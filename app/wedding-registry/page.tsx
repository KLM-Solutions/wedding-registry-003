"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Heart, Users, UserPlus, Camera, MapPin, X, CalendarDays, Phone, Download } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import Link from "next/link"
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import '../i18n';

interface Guest {
  id: number
  name: string
  email: string
  phone: string
  association: string
  connection: string
  photo_url?: string
  date_of_birth?: string
  location?: string
  bio?: string
  voice_note_url?: string
  created_at: string
}

interface HeartPosition {
  id: number
  x: number
  y: number
  isDragging: boolean
}

interface Event {
  time: string
  title: string
  location?: string
  description?: string
  dressCode?: string
}

interface DaySchedule {
  date: string
  events: Event[]
}

interface Hotel {
  name: string
  phone: string
}

interface LocationSuggestion {
  display_name: string
  lat: string
  lon: string
}

interface RoomAssignment {
  id: number
  name: string
  date_of_birth: string
  room_number: string
  hotel_name: string
  created_at: string
}

interface VerifiedGuest {
  id: number
  roomAssignment: RoomAssignment
}

// Add new interface for popup notification
interface PopupNotification {
  guest: Guest | null
  show: boolean
}

export default function WeddingRegistry() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    association: "",
    connection: "",
    date_of_birth: "",
    location: "",
    photoStyle: "normal",
    bio: "",
  })
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("register")
  const [guestList, setGuestList] = useState<Guest[]>([])
  const [hearts, setHearts] = useState<HeartPosition[]>([])
  const [selectedConnection, setSelectedConnection] = useState<{ name: string; side: "bride" | "groom" } | null>(null)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [locationInputValue, setLocationInputValue] = useState("")
  const [isGeneratingGhibli, setIsGeneratingGhibli] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null)
  const [showCoupleStory, setShowCoupleStory] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<{ day: DaySchedule; event: Event } | null>(null)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null)
  const micStreamRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const audioBuffersRef = useRef<Float32Array[]>([])
  const [verifiedGuests, setVerifiedGuests] = useState<VerifiedGuest[]>([])
  const [passcode, setPasscode] = useState("")
  const [popupNotification, setPopupNotification] = useState<PopupNotification>({ guest: null, show: false })
  const [expandedGuestId, setExpandedGuestId] = useState<number | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const schedule: DaySchedule[] = [
    {
      date: "May 16th - Friday",
      events: [
        {
          time: "7:00 AM",
          title: t('pandhaKaalMuhurtham'),
          description: t('pandhaKaalMuhurthamDesc'),
        },
        {
          time: "7:30 - 9:30 AM",
          title: t('breakfastAtHome'),
          description: t('breakfastAtHomeDesc'),
        },
        {
          time: "8:30 AM",
          title: t('kulaDeivaVazhaipaadu'),
          description: t('kulaDeivaVazhaipaaduDesc'),
        },
        {
          time: "12:00 PM",
          title: t('welcomingGroomsFamily'),
          description: t('welcomingGroomsFamilyDesc'),
        },
        {
          time: "12:00 - 2:00 PM",
          title: t('lunchAtHome'),
          description: t('lunchAtHomeDesc'),
        },
        {
          time: "1:00 PM",
          title: t('hotelCheckin'),
          description: t('hotelCheckinDesc'),
        },
        {
          time: "3:00 PM",
          title: t('haldiCeremony'),
          description: t('haldiCeremonyDesc'),
          location: "D'Wayferer Resort, Erode (in doors)",
          dressCode: "Sunshine style, traditional yellow or lime green outfit that radiate joy",
        },
        {
          time: "4:00 PM Onwards",
          title: t('mehendiCeremony'),
          description: t('mehendiCeremonyDesc'),
          dressCode: "Festive Indian wear in bright or pastel colors",
        },
        {
          time: "4:00 - 5:00 PM",
          title: t('coffeeBreak'),
          description: t('coffeeBreakDesc'),
        },
        {
          time: "7:00 - 9:00 PM",
          title: t('sangeetNight'),
          description: t('sangeetNightDesc'),
          location: "D'Wayferer Resort",
          dressCode: "Indian party wear—anything sparkly, fun, and comfortable",
        },
        {
          time: "9:00 - 10:00 PM",
          title: t('dinner'),
          description: t('dinnerDesc'),
        },
      ],
    },
    {
      date: "May 17th - Saturday",
      events: [
        {
          time: "Morning",
          title: t('breakfastAtLeisure'),
          description: t('breakfastAtLeisureDesc'),
        },
        {
          time: "Morning",
          title: t('templeVisits'),
          description: t('templeVisitsDesc'),
        },
        {
          time: "12:00 - 1:30 PM",
          title: t('lunchAtMandapam'),
          description: t('lunchAtMandapamDesc'),
          location: "Aalayamani Mandapam",
        },
        {
          time: "4:00 - 5:00 PM",
          title: t('preReception'),
          description: t('preReceptionDesc'),
        },
        {
          time: "5:30 PM",
          title: t('baraatProcession'),
          description: t('baraatProcessionDesc'),
        },
        {
          time: "6:30 - 9:30 PM",
          title: t('weddingReception'),
          description: t('weddingReceptionDesc'),
        },
        {
          time: "7:00 - 9:00 PM",
          title: t('dinner'),
          description: t('dinnerDesc'),
        },
      ],
    },
    {
      date: "May 18th - Sunday",
      events: [
        {
          time: "5:30 AM Onwards",
          title: t('weddingRituals'),
          description: t('weddingRitualsDesc'),
        },
        {
          time: "Morning",
          title: t('coreWeddingRituals'),
          description: t('coreWeddingRitualsDesc'),
        },
        {
          time: "Morning",
          title: t('funAndGames'),
          description: t('funAndGamesDesc'),
        },
        {
          time: "12:00 - 1:00 PM",
          title: t('weddingLunch'),
          description: t('weddingLunchDesc'),
        },
        {
          time: "1:30 PM",
          title: t('weddingEventsConclude'),
          description: t('weddingEventsConcludeDesc'),
        },
      ],
    },
  ]

  const hotels: Hotel[] = [
    { name: "Hotel D'wafer", phone: "9489026222" },
    { name: "Hotel Turmeric", phone: "9063770000" },
    { name: "Hotel Varshan", phone: "9842815005" },
    { name: "Hotel Deepa", phone: "9585803636" },
    { name: "MKR Homestay", phone: "6380700287" },
  ]

  useEffect(() => {
    // Initialize hearts with random positions
    const initialHearts = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      isDragging: false,
    }))
    setHearts(initialHearts)
  }, [])

  // Debounce function for location search
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout
    return (...args: any[]) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  // Fetch location suggestions
  const fetchLocationSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setLocationSuggestions([])
      return
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      )
      const data = await response.json()
      setLocationSuggestions(data)
    } catch (error) {
      console.error("Error fetching location suggestions:", error)
      setLocationSuggestions([])
    }
  }

  // Debounced version of fetchLocationSuggestions
  const debouncedFetchSuggestions = useCallback(debounce(fetchLocationSuggestions, 300), [])

  // Handle location input change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocationInputValue(value)
    setFormData((prev) => ({ ...prev, location: value }))
    debouncedFetchSuggestions(value)
    setShowSuggestions(true)
  }

  // Handle location suggestion selection
  const handleSuggestionSelect = (suggestion: LocationSuggestion) => {
    setLocationInputValue(suggestion.display_name)
    setFormData((prev) => ({ ...prev, location: suggestion.display_name }))
    setLocationSuggestions([])
    setShowSuggestions(false)
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationInputRef.current && !locationInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPhotoFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
    // Reset input value so the same file can be selected again
    e.target.value = ""
  }

  // Add a function to handle opening device camera directly
  const openCamera = () => {
    const fileInput = document.getElementById("photo") as HTMLInputElement
    if (fileInput) {
      fileInput.setAttribute("capture", "environment")
      // Reset input value before opening camera
      fileInput.value = ""
      fileInput.click()
    }
  }

  // Add a function to handle file selection
  const openFileSelector = () => {
    const fileInput = document.getElementById("photo") as HTMLInputElement
    if (fileInput) {
      fileInput.removeAttribute("capture")
      // Reset input value before opening file selector
      fileInput.value = ""
      fileInput.click()
    }
  }

  const generateGhibliImage = async () => {
    if (!photoFile) return

    setIsGeneratingGhibli(true)
    try {
      const formData = new FormData()
      formData.append("image", photoFile)

      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to generate Ghibli-style image")
      }

      const data = await response.json()
      if (data.image) {
        setPhotoPreview(`data:image/jpeg;base64,${data.image}`)
        // Convert base64 to File object
        const response = await fetch(`data:image/jpeg;base64,${data.image}`)
        const blob = await response.blob()
        const ghibliFile = new File([blob], "ghibli-image.jpg", { type: "image/jpeg" })
        setPhotoFile(ghibliFile)
      }
    } catch (error) {
      console.error("Error generating Ghibli-style image:", error)
      toast.error("Failed to generate Ghibli-style image")
    } finally {
      setIsGeneratingGhibli(false)
    }
  }

  const fetchGuestList = async () => {
    try {
      const response = await fetch("/api/wedding-registry")
      if (response.ok) {
        const data = await response.json()
        setGuestList(data)
      }
    } catch (error) {
      console.error("Error fetching guest list:", error)
    }
  }

  // Replace the isIOS function with a more reliable check
  const isIOSUnsupported = () => {
    return (
      typeof MediaRecorder === "undefined" ||
      (!MediaRecorder.isTypeSupported("audio/webm") && !MediaRecorder.isTypeSupported("audio/mp4"))
    )
  }

  // Create a new function for recording audio on iOS
  const startIOSRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      // Create source from the microphone stream
      const micSource = audioContext.createMediaStreamSource(stream)
      micStreamRef.current = micSource

      // Create a processor node
      const processorNode = audioContext.createScriptProcessor(4096, 1, 1)
      processorNodeRef.current = processorNode

      // Clear previous buffers
      audioBuffersRef.current = []

      // Connect nodes
      micSource.connect(processorNode)
      processorNode.connect(audioContext.destination)

      // Process audio data
      processorNode.onaudioprocess = (e) => {
        const channel = e.inputBuffer.getChannelData(0)
        const buffer = new Float32Array(channel.length)
        buffer.set(channel)
        audioBuffersRef.current.push(buffer)
      }

      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast.error("Could not access microphone. Please make sure your browser has permission to use it.")
    }
  }

  // Create a function to stop iOS recording
  const stopIOSRecording = () => {
    if (!audioContextRef.current || !processorNodeRef.current || !micStreamRef.current) return

    // Disconnect nodes
    processorNodeRef.current.disconnect()
    micStreamRef.current.disconnect()

    // Get track and stop it
    micStreamRef.current.mediaStream.getTracks().forEach((track) => track.stop())

    // Convert Float32Array buffers to a single audio buffer
    const audioContext = audioContextRef.current
    const buffers = audioBuffersRef.current
    const length = buffers.reduce((acc, buffer) => acc + buffer.length, 0)
    const audioBuffer = audioContext.createBuffer(1, length, audioContext.sampleRate)
    const channelData = audioBuffer.getChannelData(0)

    let offset = 0
    buffers.forEach((buffer) => {
      channelData.set(buffer, offset)
      offset += buffer.length
    })

    // Convert the audio buffer to WAV
    const wavData = convertToWav(audioBuffer)
    const audioBlob = new Blob([wavData], { type: "audio/wav" })

    setAudioBlob(audioBlob)
    const url = URL.createObjectURL(audioBlob)
    setAudioUrl(url)

    setIsRecording(false)
  }

  // Add a WAV converter function
  const convertToWav = (audioBuffer: AudioBuffer) => {
    const numChannels = 1
    const sampleRate = audioBuffer.sampleRate
    const format = 1 // PCM
    const bitDepth = 16

    const bytesPerSample = bitDepth / 8
    const blockAlign = numChannels * bytesPerSample

    const buffer = audioBuffer.getChannelData(0)
    const length = buffer.length
    const size = length * blockAlign

    const arrayBuffer = new ArrayBuffer(44 + size)
    const dataView = new DataView(arrayBuffer)

    // RIFF identifier
    writeString(dataView, 0, "RIFF")
    // RIFF chunk length
    dataView.setUint32(4, 36 + size, true)
    // RIFF type
    writeString(dataView, 8, "WAVE")
    // format chunk identifier
    writeString(dataView, 12, "fmt ")
    // format chunk length
    dataView.setUint32(16, 16, true)
    // sample format (raw)
    dataView.setUint16(20, format, true)
    // channel count
    dataView.setUint16(22, numChannels, true)
    // sample rate
    dataView.setUint32(24, sampleRate, true)
    // byte rate (sample rate * block align)
    dataView.setUint32(28, sampleRate * blockAlign, true)
    // block align (channel count * bytes per sample)
    dataView.setUint16(32, blockAlign, true)
    // bits per sample
    dataView.setUint16(34, bitDepth, true)
    // data chunk identifier
    writeString(dataView, 36, "data")
    // data chunk length
    dataView.setUint32(40, size, true)

    // Write audio data
    floatTo16BitPCM(dataView, 44, buffer)

    return arrayBuffer
  }

  const writeString = (dataView: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      dataView.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  const floatTo16BitPCM = (dataView: DataView, offset: number, input: Float32Array) => {
    for (let i = 0; i < input.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, input[i]))
      dataView.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
    }
  }

  // Update the startRecording function to handle both standard and iOS cases
  const startRecording = async () => {
    if (isIOSUnsupported()) {
      await startIOSRecording()
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4",
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4"
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        setAudioBlob(audioBlob)
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast.error("Could not access microphone. Please make sure your browser has permission to use it.")
    }
  }

  // Update the stopRecording function to handle both standard and iOS cases
  const stopRecording = () => {
    if (isIOSUnsupported()) {
      stopIOSRecording()
      return
    }

    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataObj = new FormData()

      // Always required fields
      Object.entries(formData).forEach(([key, value]) => {
        // For optional fields, pass null if empty string
        if (["email", "phone", "date_of_birth", "bio"].includes(key)) {
          formDataObj.append(key, value ? value : "null")
        } else {
        formDataObj.append(key, value)
        }
      })

      if (photoFile) {
        formDataObj.append("photo", photoFile)
      } else {
        // If photo is not provided, pass null
        formDataObj.append("photo", "null")
      }

      if (audioBlob) {
        // Add file extension based on MIME type
        const extension = audioBlob.type.includes("webm") ? ".webm" : ".mp4"
        formDataObj.append("voiceNote", new File([audioBlob], `voice_note${extension}`, { type: audioBlob.type }))
      } else {
        // If voice note is not provided, pass null
        formDataObj.append("voiceNote", "null")
      }

      const response = await fetch("/api/wedding-registry", {
        method: "POST",
        body: formDataObj,
      })

      if (response.ok) {
        toast("Success!", {
          description: "You've been added to the wedding registry.",
        })
        setFormData({
          name: "",
          email: "",
          phone: "",
          association: "",
          connection: "",
          date_of_birth: "",
          location: "",
          photoStyle: "normal",
          bio: "",
        })
        setPhotoFile(null)
        setPhotoPreview(null)
        setAudioBlob(null)
        setAudioUrl(null)

        // Refresh guest list if on that tab
        if (activeTab === "guests") {
          fetchGuestList()
        }
      } else {
        const error = await response.json()
        toast.error("Error", {
          description: error.message || "Something went wrong. Please try again.",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch guest list when switching to guests tab
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "guests") {
      fetchGuestList()
    }
  }

  const handleMouseDown = (id: number) => {
    setHearts((prev) => prev.map((heart) => (heart.id === id ? { ...heart, isDragging: true } : heart)))
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!hearts.some((heart) => heart.isDragging)) return

    const container = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - container.left) / container.width) * 100
    const y = ((e.clientY - container.top) / container.height) * 100

    setHearts((prev) => prev.map((heart) => (heart.isDragging ? { ...heart, x, y } : heart)))
  }

  const handleMouseUp = () => {
    setHearts((prev) => prev.map((heart) => ({ ...heart, isDragging: false })))
  }

  const handleImageDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `guest-photo-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("Image downloaded successfully!")
    } catch (error) {
      console.error("Error downloading image:", error)
      toast.error("Failed to download image")
    }
  }

  const handlePasscodeSubmit = async () => {
    if (!selectedGuest) return
    setLoading(true)
    try {
      const response = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date_of_birth: passcode,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        // Add to verified guests list
        setVerifiedGuests((prev) => [...prev, { id: selectedGuest.id, roomAssignment: data }])
        // Clear passcode
        setPasscode("")
      } else {
        const error = await response.json()
        toast.error(error.message || "No room assignment found")
      }
    } catch (error) {
      toast.error("Error verifying room assignment")
    } finally {
      setLoading(false)
    }
  }

  // Add function to handle popup notification
  const showPopupNotification = (guest: Guest) => {
    setPopupNotification({ guest, show: true })
    setTimeout(() => {
      setPopupNotification((prev) => ({ ...prev, show: false }))
    }, 5000)
  }

  // Add function to create abstract
  const createAbstract = (text: string, maxLength: number = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
  }

  // Modify handleAddGuestClick to show modal instead of changing tabs
  const handleAddGuestClick = () => {
    setShowRegistrationModal(true)
  }

  // Add useEffect to handle tab changes
  useEffect(() => {
    if (activeTab === "register") {
      // Scroll to form when register tab becomes active
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }
  }, [activeTab])

  // Replace the entire return statement with this new design
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-image.jpg-OTenHMl7Xpib3FMV6YpUu5WIFuPWpy.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/30 pointer-events-none"></div>
      {/* Gradient overlay at the bottom to cover the background line */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-24 z-10" style={{background: "linear-gradient(to top, #f8fafc 90%, transparent)"}} />

      {/* Menu Bar */}
      <div className="w-full py-4 border-b border-gray-100 flex justify-between items-center px-4">
        <div className="container flex items-center justify-between">
          <button className="flex items-center space-x-2 text-black" onClick={() => setSidebarOpen(true)}>
            <div className="flex flex-col space-y-1">
              <span className="w-6 h-0.5 bg-black"></span>
              <span className="w-6 h-0.5 bg-black"></span>
              <span className="w-6 h-0.5 bg-black"></span>
            </div>
            <span className="font-serif tracking-widest text-black">{t('menu')}</span>
          </button>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay background */}
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)}></div>
          {/* Sidebar */}
          <div className="relative bg-gray-100 w-64 max-w-[80vw] h-full shadow-lg p-6 flex flex-col z-50 animate-slide-in-left">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="mt-8 flex flex-col space-y-6">
              <Link href="/wedding-registry/family" className="font-serif text-lg text-gray-800 hover:text-[#D4AF37] transition-colors" onClick={() => setSidebarOpen(false)}>
                {t('family')}
              </Link>
              <Link href="/wedding-registry/memories" className="font-serif text-lg text-gray-800 hover:text-[#D4AF37] transition-colors" onClick={() => setSidebarOpen(false)}>
                {t('memories')}
              </Link>
              <Link href="/wedding-registry/food" className="font-serif text-lg text-gray-800 hover:text-[#D4AF37] transition-colors" onClick={() => setSidebarOpen(false)}>
                {t('food')}
              </Link>
              <Link href="/wedding-registry/acknowledgement" className="font-serif text-lg text-gray-800 hover:text-[#D4AF37] transition-colors" onClick={() => setSidebarOpen(false)}>
                {t('acknowledgement')}
              </Link>
            </nav>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-20">
        <header className="text-center mb-16 mt-8">
          <div className="flex flex-col items-center">
            {/* Couple Photo */}
            <div className="relative w-64 h-64 mb-8">
              <div
                className="absolute inset-0 bg-[url('/couples.jpg')] bg-center bg-cover rounded-full"
                style={{
                  clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                  filter: "contrast(1.1) brightness(0.9)",
                }}
              ></div>
            </div>

            {/* Names */}
            <h1 className="text-5xl md:text-6xl font-serif text-gray-800 tracking-wide mb-6">{t('coupleNames')}</h1>

            {/* Welcome Text */}
            <h2 className="text-4xl font-serif text-gray-800 mb-4">{t('welcome')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-center mb-8">
              {t('welcomeMessage')}
            </p>

            {/* Meet the Couple and Ask Buttons */}
            <div className={`flex ${i18n.language === 'ta' ? 'flex-col' : 'flex-row'} justify-center gap-4 mb-12`}>
              <Link href="/meet-the-couple">
                <Button
                  className="bg-[#D4AF37] hover:bg-[#C09B2A] text-white font-serif text-base tracking-wide px-6 py-3"
                >
                  {t('meetTheCouple')}
                </Button>
              </Link>
              <Link href="/wedding-registry/ask-me-anything">
                <Button
                  className="bg-[#D4AF37] hover:bg-[#C09B2A] text-white font-serif text-base tracking-wide px-6 py-3"
                >
                  {t('askMeAnything')}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <Tabs defaultValue="events" className="max-w-4xl mx-auto" onValueChange={(value) => {
          setActiveTab(value)
          if (value === "guests") {
            fetchGuestList()
          }
        }}>
          <TabsList className="flex flex-wrap justify-center gap-4 mb-12 bg-transparent border-b border-gray-200 pb-2 w-full max-w-2xl mx-auto">
            <TabsTrigger
              value="events"
              className="font-serif text-base data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-gray-500 transition-all duration-200 bg-transparent hover:text-gray-900"
            >
              <CalendarDays className="w-4 h-4 mr-2 inline-block" />
              <span>{t('schedule')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="guests"
              className="font-serif text-base data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-gray-500 transition-all duration-200 bg-transparent hover:text-gray-900"
            >
              <Users className="w-4 h-4 mr-2 inline-block" />
              <span>{t('guestList')}</span>
            </TabsTrigger>
            <Link href="/accommodation">
              <div className="font-serif text-base text-gray-500 hover:text-gray-900 transition-all duration-200 flex items-center cursor-pointer">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>{t('accommodation')}</span>
              </div>
            </Link>
          </TabsList>

          <TabsContent value="events" className="mt-8">
            <div className="mb-12 mt-16">
              <h2 className="text-4xl font-serif text-gray-800 text-center mb-2">{t('schedule')}</h2>
              <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                {t('joinUs')}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="may-16" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 gap-2">
                  {schedule.map((day, index) => (
                    <TabsTrigger
                      key={index}
                      value={`may-${16 + index}`}
                      className="font-serif text-sm sm:text-base px-2 py-2 data-[state=active]:text-[#D4AF37] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-gray-500 transition-all duration-200 bg-transparent hover:text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {day.date.split(' - ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {schedule.map((day, dayIndex) => (
                  <TabsContent key={dayIndex} value={`may-${16 + dayIndex}`}>
                    <div className="space-y-8">
                      {day.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="relative">
                          <div 
                            className="bg-white/95 rounded-md shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-shadow duration-200"
                            onClick={() => setSelectedEvent({ day, event })}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-serif text-lg text-gray-800">{event.title}</h4>
                                <div className="text-sm font-medium text-gray-600 whitespace-nowrap ml-2">
                                  {event.time.replace(/ ([AP]M)$/i, "\u00A0$1")}
                                </div>
                              </div>

                              {event.description && (
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {createAbstract(event.description)}
                                </p>
                              )}

                              <div className="flex flex-wrap items-start gap-3">
                                {event.location && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <MapPin className="w-5 h-5 mr-1 flex-shrink-0" />
                                    <span>{event.location}</span>
                                  </div>
                                )}
                                {event.dressCode && (
                                  <div className="flex items-start text-sm text-gray-600 min-w-0">
                                    <span className="flex items-center whitespace-nowrap mr-2">
                                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                      </svg>
                                      <span className="whitespace-nowrap">Dress Code:</span>
                                    </span>
                                    <span className="break-words"> {event.dressCode}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="guests">
            <div className="mb-12">
              <h2 className="text-4xl font-serif text-gray-800 text-center mb-2">{t('guestList')}</h2>
             
              <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
                View all registered guests and their connections to the bride and groom.
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-serif text-gray-800 text-center mb-8">{t('familyConnections')}</h3>
              <div className="bg-white/95 p-4 rounded-md shadow-sm border border-gray-100">
                <Tabs defaultValue="bride" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="bride" className="font-serif text-sm sm:text-base data-[state=active]:text-[#D4AF37] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-gray-500 transition-all duration-200 bg-transparent hover:text-gray-900">
                      <Heart className="w-4 h-4 mr-2 inline-block" />
                      {t('brideSide')}
                    </TabsTrigger>
                    <TabsTrigger value="groom" className="font-serif text-sm sm:text-base data-[state=active]:text-[#D4AF37] data-[state=active]:border-b-2 data-[state=active]:border-[#D4AF37] text-gray-500 transition-all duration-200 bg-transparent hover:text-gray-900">
                      <Heart className="w-4 h-4 mr-2 inline-block" />
                      {t('groomSide')}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="bride">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Bride's Side Family */}
                      {[
                        { name: "Kalyani", image: "/bride-2.jpeg", translationKey: "kalyani" },
                        { name: "Kalyan", image: "/bride-1.jpeg", scale: "scale-110", translationKey: "kalyan" },
                        { name: "Anjan & Raji", image: "/bride-3.JPG", translationKey: "anjanRaji" }
                      ].map((item) => (
                        <div key={item.name} className="text-center">
                          <div
                            className={`w-16 h-16 mx-auto rounded-full overflow-hidden hover:scale-110 transition-transform duration-200 cursor-pointer ${
                              selectedConnection?.name === item.name ? "ring-2 ring-[#D4AF37]" : "ring-1 ring-gray-200"
                            }`}
                            onClick={() =>
                              setSelectedConnection(selectedConnection?.name === item.name ? null : { name: item.name, side: "bride" })
                            }
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className={`w-full h-full object-cover ${item.scale || ""}`}
                            />
                          </div>
                          <span className="block mt-2 font-serif text-gray-700 text-sm">{t(item.translationKey)}</span>
                        </div>
                      ))}
                      {/* Bride */}
                      <div className="text-center col-span-3 mt-6">
                        <div
                          className={`w-20 h-20 mx-auto rounded-full overflow-hidden hover:scale-110 transition-transform duration-200 cursor-pointer ${
                            selectedConnection?.name === "Harini" ? "ring-2 ring-[#D4AF37]" : "ring-1 ring-gray-200"
                          }`}
                          onClick={() =>
                            setSelectedConnection(
                              selectedConnection?.name === "Harini" ? null : { name: "Harini", side: "bride" }
                            )
                          }
                        >
                          <Image
                            src="/bride-4.jpg"
                            alt="Harini"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover object-[center_30%] scale-90"
                          />
                        </div>
                        <span className="block mt-2 font-serif text-gray-700 text-base">{t('hariniDirect')}</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="groom">
                    <div className="grid grid-cols-4 gap-4">
                      {/* Groom's Side Family */}
                      {[
                        { name: "Ramesh", image: "/groom-2.jpg", position: "object-[center_10%]", translationKey: "ramesh" },
                        { name: "Sushma", image: "/groom-4.jpg", translationKey: "sushma" },
                        { name: "Nirupama & Abhijit", image: "/groom-6.jpg", position: "object-[center_30%]", translationKey: "nirupamaAbhijit" },
                        { name: "Brij Mohan", image: "/groom-3.jpg", translationKey: "brijMohan" }
                      ].map((item) => (
                        <div key={item.name} className="text-center">
                          <div
                            className={`w-16 h-16 mx-auto rounded-full overflow-hidden hover:scale-110 transition-transform duration-200 cursor-pointer ${
                              selectedConnection?.name === item.name ? "ring-2 ring-[#D4AF37]" : "ring-1 ring-gray-200"
                            }`}
                            onClick={() =>
                              setSelectedConnection(selectedConnection?.name === item.name ? null : { name: item.name, side: "groom" })
                            }
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={64}
                              height={64}
                              className={`w-full h-full object-cover ${item.position || ""}`}
                            />
                          </div>
                          <span className={`block mt-2 font-serif text-gray-700 ${item.name === "Nirupama & Abhijit" ? "text-xs leading-tight" : "text-sm"}`}>
                            {t(item.translationKey)}
                          </span>
                        </div>
                      ))}
                      {/* Groom */}
                      <div className="text-center col-span-4 mt-6">
                        <div
                          className={`w-20 h-20 mx-auto rounded-full overflow-hidden hover:scale-110 transition-transform duration-200 cursor-pointer ${
                            selectedConnection?.name === "Aditya" ? "ring-2 ring-[#D4AF37]" : "ring-1 ring-gray-200"
                          }`}
                          onClick={() =>
                            setSelectedConnection(
                              selectedConnection?.name === "Aditya" ? null : { name: "Aditya", side: "groom" }
                            )
                          }
                        >
                          <Image
                            src="/groom-7.jpg"
                            alt="Aditya"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover object-[center_10%]"
                          />
                        </div>
                        <span className="block mt-2 font-serif text-gray-700 text-base">{t('adityaDirect')}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-serif text-gray-800 mb-6">
                {selectedConnection
                  ? `${t('guestsConnectedTo', { name: selectedConnection.name })} (${selectedConnection.side === "bride" ? t('bride') : t('groom')})`
                  : t('registeredGuests')}
              </h3>
              {guestList.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {/* Add Guest Card */}
                  <div
                    className="p-6 border border-gray-100 rounded-md bg-white/95 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col items-center justify-center text-center space-y-3 min-h-[200px]"
                    onClick={handleAddGuestClick}
                  >
                    <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                      <span className="text-3xl font-serif text-gray-500">+</span>
                    </div>
                    <h4 className="font-serif text-lg text-gray-800">{t('addGuest')}</h4>
                    <p className="text-sm text-gray-600">{t('clickToRegisterNewGuest')}</p>
                  </div>

                  {/* Existing Guest Cards */}
                  {guestList
                    .filter(
                      (guest) =>
                        !selectedConnection ||
                        (guest.association === selectedConnection.side && guest.connection === selectedConnection.name),
                    )
                    .map((guest, index) => (
                      <div
                        key={index}
                        className="p-6 border border-gray-100 rounded-md bg-white/95 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        onClick={() => setSelectedGuest(guest)}
                      >
                        <div className="flex flex-col items-center text-center space-y-3">
                          {guest.photo_url ? (
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-200">
                              <Image
                                src={guest.photo_url || "/placeholder.svg"}
                                alt={`Photo of ${guest.name}`}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                              <span className="text-2xl font-serif text-gray-500">{guest.name.charAt(0)}</span>
                            </div>
                          )}
                          <h4 className="font-serif text-lg text-gray-800">{guest.name}</h4>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="max-w-sm mx-auto">
                    <div
                      className="p-6 border border-gray-100 rounded-md bg-white/95 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col items-center justify-center text-center space-y-3"
                      onClick={handleAddGuestClick}
                    >
                      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                        <span className="text-3xl font-serif text-gray-500">+</span>
                      </div>
                      <h4 className="font-serif text-lg text-gray-800">{t('addGuest')}</h4>
                      <p className="text-sm text-gray-600">{t('clickToRegisterNewGuest')}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Event Details Modal */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="w-[95%] max-w-[600px] mx-auto rounded-md p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-sm">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-serif text-[#D4AF37] text-center">
              {selectedEvent?.event.title}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-center text-gray-600">
              {selectedEvent?.day.date} • {selectedEvent?.event.time}
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 sm:space-y-6">
              {selectedEvent.event.description && (
                <p className="text-sm sm:text-base text-gray-600 text-center whitespace-pre-line leading-relaxed">
                  {selectedEvent.event.description}
                </p>
              )}
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center">
                {selectedEvent.event.location && (
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {selectedEvent.event.location}
                  </div>
                )}
                {selectedEvent.event.dressCode && (
                  <div className="flex items-start text-sm text-gray-600 min-w-0">
                    <span className="flex items-center whitespace-nowrap mr-2">
                      <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <span className="whitespace-nowrap">Dress Code:</span>
                    </span>
                    <span className="break-words"> {selectedEvent.event.dressCode}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Guest Details Modal */}
      <Dialog
        open={!!selectedGuest}
        onOpenChange={() => {
          setSelectedGuest(null)
          setPasscode("") // Clear passcode when modal closes
        }}
      >
        <DialogContent className="w-[95%] max-w-[400px] mx-auto rounded-md p-6 sm:p-8 bg-white/95 backdrop-blur-sm">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl sm:text-2xl font-serif text-gray-800">{t('guestDetails')}</DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-gray-600">
              {t('informationAbout', { name: selectedGuest?.name })}
            </DialogDescription>
          </DialogHeader>
          {selectedGuest && (
            <div className="space-y-6">
              <div className="flex flex-col items-center space-y-3">
                {selectedGuest.photo_url ? (
                  <div
                    className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden cursor-pointer border border-gray-200"
                    onClick={() => setSelectedImage({ url: selectedGuest.photo_url || "", name: selectedGuest.name })}
                  >
                    <Image
                      src={selectedGuest.photo_url || "/placeholder.svg"}
                      alt={`Photo of ${selectedGuest.name}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                    <span className="text-3xl sm:text-4xl font-serif text-gray-500">
                      {selectedGuest.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-xl sm:text-2xl font-serif text-gray-800">{selectedGuest.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t('registeredOn', { date: new Date(selectedGuest.created_at).toLocaleDateString() })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  <span className="text-sm sm:text-base text-gray-600">
                    {selectedGuest.location || t('locationNotProvided')}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm sm:text-base font-medium text-gray-700">{t('connection')}:</span>
                  <span className="text-sm sm:text-base text-gray-600">
                    {selectedGuest.association === "bride" ? t('bride') : t('groom')} → {selectedGuest.connection}
                  </span>
                </div>
              </div>

              {selectedGuest.bio && (
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-sm sm:text-base font-medium text-gray-700 mb-2">{t('about')}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{selectedGuest.bio}</p>
                </div>
              )}

              {!verifiedGuests.find((vg) => vg.id === selectedGuest.id) && (
                <div className="p-4 sm:p-5 bg-gray-50 rounded-md border border-gray-200 mt-4 overflow-hidden">
                  <h4 className="font-serif text-gray-800 mb-3 text-center text-sm sm:text-base">
                    {t('accessRoomAssignment')}
                  </h4>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="passcode" className="text-xs sm:text-sm text-gray-700">
                        {t('enterDateOfBirthToViewRoomAssignment')}
                      </Label>
                      <Input
                        id="passcode"
                        type="date"
                        value={passcode}
                        onChange={(e) => setPasscode(e.target.value)}
                        className="bg-white text-sm sm:text-base w-full max-w-xs mx-auto h-10 sm:h-11 px-3 py-2 box-border rounded-md mb-2 border border-gray-300 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 mr-2 sm:mr-0"
                        tabIndex={-1}
                      />
                    </div>
                    <Button
                      onClick={handlePasscodeSubmit}
                      className="w-full bg-[#D4AF37] hover:bg-[#C09B2A] text-white text-sm sm:text-base h-10 sm:h-11 mt-1"
                      disabled={loading}
                    >
                      {loading ? t('verifying') : t('verify')}
                    </Button>
                  </div>
                </div>
              )}

              {verifiedGuests.find((vg) => vg.id === selectedGuest.id) && (
                <div className="p-4 sm:p-5 bg-gray-50 rounded-md border border-gray-200 mt-4">
                  <h4 className="font-serif text-gray-800 mb-3 text-center text-sm sm:text-base">
                    {t('roomAssignment')}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">{t('hotel')}:</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-800">
                        {verifiedGuests.find((vg) => vg.id === selectedGuest.id)?.roomAssignment.hotel_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">{t('roomNumber')}:</span>
                      <span className="text-xs sm:text-sm font-medium text-gray-800">
                        {verifiedGuests.find((vg) => vg.id === selectedGuest.id)?.roomAssignment.room_number}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="w-[90%] max-w-[350px] mx-auto rounded-md bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-serif text-gray-800">{selectedImage?.name}'s Photo</DialogTitle>
              {selectedImage && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleImageDownload(selectedImage.url)}
                  className="hover:bg-gray-50"
                >
                  <Download className="h-5 w-5 text-gray-600" />
                </Button>
              )}
            </div>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full aspect-square">
              <Image
                src={selectedImage.url || "/placeholder.svg"}
                alt={`Full size photo of ${selectedImage.name}`}
                fill
                className="object-contain rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Registration Modal */}
      <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
        <DialogContent className="w-[95%] max-w-[800px] mx-auto rounded-md p-4 sm:p-6 md:p-8 bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-2 sm:space-y-3">
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-serif text-[#D4AF37] text-center">
              {t('guestRegistration')}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-center text-gray-600">
              {t('pleaseFillOutThisFormToAddYourselfToOurWeddingRegistry')}
            </DialogDescription>
          </DialogHeader>
          <form ref={formRef} onSubmit={async (e) => {
            await handleSubmit(e)
            setShowRegistrationModal(false)
          }} className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-serif text-sm sm:text-base text-black">
                  {t('fullName')}
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t('enterYourFullName')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-serif text-sm sm:text-base text-black">
                  {t('email')} (Optional)
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('enterYourEmail')}
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="font-serif text-sm sm:text-base text-black">
                  {t('phoneNumber')} (Optional)
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder={t('enterYourPhoneNumber')}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="font-serif text-sm sm:text-base text-black">
                  {t('dateOfBirth')} (Optional)
                </Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="h-10 sm:h-11 text-sm sm:text-base bg-white border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="font-serif text-sm sm:text-base text-black">
                  {t('location')}
                </Label>
                <div className="relative" ref={locationInputRef}>
                  <Input
                    id="location"
                    name="location"
                    placeholder={t('enterYourLocation')}
                    value={locationInputValue}
                    onChange={handleLocationChange}
                    required
                    className="h-10 sm:h-11 text-sm sm:text-base bg-white border-gray-300 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                  />
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-auto">
                      {locationSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-xs sm:text-sm"
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          {suggestion.display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="association" className="font-serif text-sm sm:text-base text-black">
                  {t('association')}
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("association", value)}
                  value={formData.association}
                >
                  <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base bg-white border-gray-300 focus:ring-[#D4AF37]/20">
                    <SelectValue placeholder={t('selectBrideOrGroom')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">{t('bride', { name: 'Harini' })}</SelectItem>
                    <SelectItem value="groom">{t('groom', { name: 'Aditya' })}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.association && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="connection" className="font-serif text-sm sm:text-base text-black">
                    {t('connectionThrough')}
                  </Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("connection", value)}
                    value={formData.connection}
                  >
                    <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base border-gray-300 focus:ring-[#D4AF37]/20">
                      <SelectValue placeholder={t('selectYourConnection')} />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.association === "bride" ? (
                        <>
                          <SelectItem value="Kalyani">{t('kalyani')}</SelectItem>
                          <SelectItem value="Kalyan">{t('kalyan')}</SelectItem>
                          <SelectItem value="Anjan & Raji">{t('anjanRaji')}</SelectItem>
                          <SelectItem value="Harini">{t('hariniDirect')}</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Ramesh">{t('ramesh')}</SelectItem>
                          <SelectItem value="Sushma">{t('sushma')}</SelectItem>
                          <SelectItem value="Nirupama & Abhijit">{t('nirupamaAbhijit')}</SelectItem>
                          <SelectItem value="Brij Mohan">{t('brijMohan')}</SelectItem>
                          <SelectItem value="Aditya">{t('adityaDirect')}</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio" className="font-serif text-sm sm:text-base text-black">
                  {t('bioOptional')}
                </Label>
                <textarea
                  id="bio"
                  name="bio"
                  className="w-full min-h-[80px] sm:min-h-[100px] p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] bg-white"
                  placeholder={t('tellUsABitAboutYourself')}
                  value={formData.bio}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="voiceNote" className="flex items-center font-serif text-sm sm:text-base text-black">
                  <Heart className="w-4 h-4 mr-2" />
                  {t('voiceMessageForTheCoupleOptional')}
                </Label>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col space-y-3 sm:space-y-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <Button
                        type="button"
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={isRecording ? stopRecording : startRecording}
                        className="flex-1 h-10 sm:h-11 text-sm sm:text-base border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                      >
                        {isRecording ? (
                          <>
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse mr-2" />
                            {t('recording')}
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                              />
                            </svg>
                            {t('recordVoiceMessage')}
                          </>
                        )}
                      </Button>
                    </div>
                    {audioUrl && (
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <audio src={audioUrl} controls className="flex-1 h-10 sm:h-11" />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setAudioUrl(null)
                            setAudioBlob(null)
                          }}
                          className="h-10 sm:h-11 border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="photo" className="flex items-center font-serif text-sm sm:text-base text-black">
                  <Camera className="w-4 h-4 mr-2" />
                  {t('photoOptional')}
                </Label>
                <div className="flex flex-col space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex-1">
                      <div className="mb-3 sm:mb-4">
                        <Label htmlFor="photoStyle" className="text-xs sm:text-sm text-black">
                          {t('photoStyle')}
                        </Label>
                        <Select
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, photoStyle: value }))}
                          value={formData.photoStyle}
                        >
                          <SelectTrigger className="h-10 sm:h-11 text-sm sm:text-base bg-white border-gray-300 focus:ring-[#D4AF37]/20">
                            <SelectValue placeholder={t('selectPhotoStyle')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">{t('normal')}</SelectItem>
                            <SelectItem value="ghibli">{t('ghibliStyle')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex space-x-2 sm:space-x-3">
                        <Input
                          id="photo"
                          name="photo"
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="bg-white hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={openFileSelector}
                          className="flex-1 h-10 sm:h-11 text-sm sm:text-base border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {t('chooseFile')}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={openCamera}
                          className="flex-1 h-10 sm:h-11 text-sm sm:text-base border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {t('switchToCamera')}
                        </Button>
                      </div>
                    </div>
                    {photoPreview && (
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border border-[#D4AF37]">
                        <Image
                          src={photoPreview || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                  </div>
                  {photoPreview && (
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-10 sm:h-11 text-sm sm:text-base border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                        onClick={() => {
                          setPhotoFile(null)
                          setPhotoPreview(null)
                        }}
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t('removePhoto')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegistrationModal(false)}
                className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
              >
                {t('cancel')}
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base bg-[#D4AF37] hover:bg-[#C09B2A] text-white font-serif tracking-wide"
                disabled={loading}
              >
                {loading ? t('submitting') : t('registerAsGuest')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
        {/* Footer */}
      <footer className="w-full py-4 text-center text-sm text-gray-500 relative z-20">
        <div className="container mx-auto">
          Powered by <a href="https://pxlbrain.vercel.app" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:text-[#C09B2A] transition-colors">pxlbrain</a>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}
