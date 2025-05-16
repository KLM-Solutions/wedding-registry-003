"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Handle image upload and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle camera capture
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw the current video frame
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Convert to JPEG with good quality
        const capturedImage = canvas.toDataURL('image/jpeg', 0.95);
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
