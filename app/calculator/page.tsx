"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState('');
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);

  // Handle camera access
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "environment"
        }
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Please ensure you have granted camera permissions and have a working webcam connected.");
    }
  };

  // Start camera when switching to camera mode
  useEffect(() => {
    if (isCameraMode) {
      startCamera();
    } else if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraMode]);

  // Compress and resize image
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Set maximum dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Set white background for JPEG
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            
            // Draw image on top of white background
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to JPEG with 80% quality (good balance between quality and size)
            const quality = 0.8;
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          } else {
            // Fallback to original if canvas context is not available
            resolve(event.target?.result as string);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Handle image upload and show crop dialog if needed
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    
    if (file.size > MAX_SIZE) {
      // If image is too large, prepare it for cropping
      const reader = new FileReader();
      reader.onload = () => {
        setImgSrc(reader.result?.toString() || '');
        setOriginalImage(file);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    } else {
      // If image is within size limit, process it directly
      try {
        const compressedImage = await compressImage(file);
        setImage(compressedImage);
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Error processing image. Please try another image.');
      }
    }
  };

  // Handle image load for cropping
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect || 1));
  }

  // Apply the crop and process the image
  const applyCrop = async () => {
    if (!completedCrop || !imgRef.current) {
      console.error('Missing required elements for cropping');
      return;
    }

    try {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      
      // Calculate scale factors to handle high DPI displays
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      
      // Get the 2D context of the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas dimensions to match the cropped area
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      // Calculate the crop coordinates in the original image's coordinate space
      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;
      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;

      // Draw only the cropped portion of the original image onto the canvas
      ctx.drawImage(
        image,
        cropX,           // source x
        cropY,           // source y
        cropWidth,       // source width
        cropHeight,      // source height
        0,               // destination x
        0,               // destination y
        completedCrop.width,  // destination width
        completedCrop.height  // destination height
      );

      // Convert canvas to a blob with JPEG compression
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob),
          'image/jpeg',
          0.8 // quality (0.0 to 1.0)
        );
      });

      if (!blob) {
        throw new Error('Failed to create image blob');
      }

      // Create a file from the blob
      const croppedFile = new File(
        [blob],
        `cropped-${Date.now()}.jpg`,
        { type: 'image/jpeg' }
      );

      // Process the cropped image
      const compressedImage = await compressImage(croppedFile);
      setImage(compressedImage);
      
      // Close the crop modal
      setShowCropModal(false);
      
    } catch (error) {
      console.error('Error in applyCrop:', error);
      alert('Failed to process the cropped image. Please try again.');
    }
  };

  // Close crop modal and reset states
  const closeCropModal = () => {
    setShowCropModal(false);
    setImgSrc('');
    setOriginalImage(null);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  // Handle camera capture with compression
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      // Set canvas dimensions (limit to 1200px on the longer side)
      let width = video.videoWidth;
      let height = video.videoHeight;
      const MAX_DIMENSION = 1200;
      
      if (width > height) {
        if (width > MAX_DIMENSION) {
          height = (height * MAX_DIMENSION) / width;
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width = (width * MAX_DIMENSION) / height;
          height = MAX_DIMENSION;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw the current video frame with new dimensions
        ctx.drawImage(video, 0, 0, width, height);
        
        // Convert to JPEG with 80% quality
        const capturedImage = canvas.toDataURL('image/jpeg', 0.8);
        setImage(capturedImage);
        
        // Stop the camera stream after capture
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    }
  };

  // Toggle between camera and file upload modes
  const toggleMode = () => {
    setIsCameraMode(!isCameraMode);
    setImage(null);
    if (!isCameraMode) {
      startCamera();
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;
    setAnalysis("");
    setLoading(true);

    // Prepare request
    const body = {
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            type: "analysis_request",
            image,
          }),
        },
      ],
    };

    // Stream response from API
    const response = await fetch("/api/calculator", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.body) {
      setAnalysis("No response from server.");
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let resultText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      // Parse SSE data
      chunk.split("\n\n").forEach((line) => {
        if (line.startsWith("data:")) {
          try {
            const { content, type } = JSON.parse(line.replace("data: ", ""));
            if (type === "analysis") {
              resultText += content;
              setAnalysis(resultText);
            }
          } catch {}
        }
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 py-4 px-4">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        <div className="w-full flex justify-start mb-4">
          <Link href="/wedding-registry/food">
            <Button variant="ghost" className="text-gray-600 hover:text-[#D4AF37]">
              ← Back to Food Menu
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-serif text-[#D4AF37] mb-6">Food Analysis</h1>
        
        <div className="w-full bg-white rounded-lg shadow-md p-6">
          {/* Crop Modal */}
          {showCropModal && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Crop Image</h3>
                  <button 
                    onClick={closeCropModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  {imgSrc && (
                    <div className="relative w-full max-w-2xl">
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        className="max-h-[60vh]"
                      >
                        <img
                          ref={imgRef}
                          alt="Crop me"
                          src={imgSrc}
                          onLoad={onImageLoad}
                          className="max-w-full max-h-[60vh] object-contain"
                        />
                      </ReactCrop>
                    </div>
                  )}
                  <div className="mt-4 flex gap-4">
                    <Button
                      type="button"
                      onClick={() => setAspect(16 / 9)}
                      variant={aspect === 16 / 9 ? 'default' : 'outline'}
                    >
                      16:9
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setAspect(1)}
                      variant={aspect === 1 ? 'default' : 'outline'}
                    >
                      1:1
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setAspect(4 / 3)}
                      variant={aspect === 4 / 3 ? 'default' : 'outline'}
                    >
                      4:3
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setAspect(undefined)}
                      variant={!aspect ? 'default' : 'outline'}
                    >
                      Free
                    </Button>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <Button
                      type="button"
                      onClick={closeCropModal}
                      variant="outline"
                      className="text-gray-600 hover:text-[#D4AF37]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={applyCrop}
                      className="bg-[#D4AF37] hover:bg-[#c19b30] text-white"
                    >
                      Apply Crop
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
            <div className="w-full flex flex-col items-center gap-4">
              <Button
                type="button"
                onClick={toggleMode}
                variant="outline"
                className="text-gray-600 hover:text-[#D4AF37]"
              >
                {isCameraMode ? "Switch to File Upload" : "Switch to Camera"}
              </Button>
              
              {isCameraMode ? (
                <div className="w-full flex flex-col items-center gap-4">
                  <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    {image ? (
                      <img
                        src={image}
                        alt="Captured"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {image ? (
                    <Button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        startCamera();
                      }}
                      variant="outline"
                    >
                      Retake Photo
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={captureImage}
                      variant="outline"
                      className="bg-[#D4AF37] hover:bg-[#C09B2A] text-white"
                    >
                      Capture Photo
                    </Button>
                  )}
                </div>
              ) : (
                <div
                  className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ minHeight: 180 }}
                >
                  {image ? (
                    <img
                      src={image}
                      alt="Preview"
                      className="rounded-lg shadow-md max-h-48 object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 text-lg">
                      Click to upload a food image
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            
            <Button
              type="submit"
              disabled={!image || loading}
              className="w-full bg-[#D4AF37] hover:bg-[#C09B2A] text-white font-serif text-base tracking-wide px-6 py-3"
            >
              {loading ? "Analyzing..." : "Analyze Dish"}
            </Button>
          </form>

          {analysis && (
            <div className="mt-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-serif text-gray-800 mb-4">
                Analysis Result
              </h2>
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </div>
          )}

          {!loading && !analysis && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-serif text-gray-800 mb-4">How It Works</h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold">1</div>
                  <p className="flex-1">Upload a clear photo of your food or use your camera to capture it directly.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold">2</div>
                  <p className="flex-1">Our AI will analyze the dish and provide detailed information about its ingredients, nutritional value, and cultural significance.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold">3</div>
                  <p className="flex-1">Get insights about the dish's origin, traditional preparation methods, and suggested pairings.</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-serif text-gray-800 mb-2">Tips for Best Results:</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Ensure good lighting for clear photos</li>
                  <li>Capture the entire dish in frame</li>
                  <li>Avoid blurry or distorted images</li>
                  <li>Try to minimize background distractions</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
