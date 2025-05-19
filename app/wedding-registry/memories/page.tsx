"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from 'react-i18next'
import '../../i18n'

const memories = [
  { src: "/mem-1.jpg", alt: "Memory 1" },
  { src: "/mem-2.jpg", alt: "Memory 2" },
  { src: "/mem-3.jpg", alt: "Memory 3" },
  { src: "/mem-4.jpg", alt: "Memory 4" },
  { src: "/mem-5.jpg", alt: "Memory 5" },
  { src: "/mem-6.jpg", alt: "Memory 6" },
  { src: "/mem-7.jpg", alt: "Memory 7" },
  { src: "/mem-8.jpg", alt: "Memory 8" },
  { src: "/mem-9.jpg", alt: "Memory 9" },
  { src: "/mem-10.jpg", alt: "Memory 10" },
  { src: "/mem-11.jpg", alt: "Memory 11" },
  { src: "/mem-12.jpg", alt: "Memory 12" },
  { src: "/mem-13.jpg", alt: "Memory 13" },
  { src: "/mem-14.jpg", alt: "Memory 14" },
  { src: "/mem-15.jpg", alt: "Memory 15" },
  { src: "/mem-16.jpeg", alt: "Memory 16" },
  { src: "/mem-17.jpeg", alt: "Memory 17" },
  { src: "/mem-18.jpeg", alt: "Memory 18" },
]

const BUBBLE_SIZE = 56; // px
const CENTER_SIZE = 176; // px (w-44 h-44)
const AREA_W = 500; // px
const AREA_H = 500; // px

// Fixed positions for 17 bubbles (memories.length - 1)
// These are visually balanced and avoid the center
const fixedPositions = [
  { x: 50, y: 8 },   // top center
  { x: 80, y: 16 },  // top right
  { x: 92, y: 35 },  // right top
  { x: 92, y: 65 },  // right bottom
  { x: 80, y: 84 },  // bottom right
  { x: 50, y: 92 },  // bottom center
  { x: 20, y: 84 },  // bottom left
  { x: 8, y: 65 },   // left bottom
  { x: 8, y: 35 },   // left top
  { x: 20, y: 16 },  // top left
  { x: 70, y: 24 },  // upper right
  { x: 85, y: 50 },  // right center
  { x: 70, y: 76 },  // lower right
  { x: 30, y: 24 },  // upper left
  { x: 15, y: 50 },  // left center
  { x: 30, y: 76 },  // lower left
  { x: 50, y: 50 },  // center (will be skipped, but keeps symmetry)
]

export default function Memories() {
  const { t } = useTranslation()
  const [centerIndex, setCenterIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)

  // Prepare small bubbles (exclude the center image)
  const smallBubbles = memories
    .map((mem, idx) => ({ ...mem, idx }))
    .filter((_, idx) => idx !== centerIndex)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-4 sm:py-8 px-4 relative overflow-hidden">
      {/* Top bar with Back to Registry */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-start pt-2 pb-2 sm:pt-4 sm:pb-4 px-2 sm:px-4" style={{ minHeight: 48 }}>
        <Link 
          href="/wedding-registry" 
          className="text-gray-600 hover:text-[#D4AF37] font-serif text-base tracking-wide"
        >
          ← {t('backToRegistry')}
        </Link>
      </div>
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl font-serif mb-4 sm:mb-6 mt-4 sm:mt-0" style={{ color: '#D4AF37' }}>{t('ourMemories')}</h1>
        <p className="text-base sm:text-lg text-gray-600 text-center mb-6 sm:mb-8 max-w-md px-4">
          Cherished moments are the threads that weave the story of our lives. <br />
          Each photo here is a window into laughter, love, and unforgettable days shared with family and friends. <br />
          As you explore these memories, we hope you feel the warmth and joy that filled these moments. <br />
          Thank you for being a part of our journey and for helping us create new memories together. <br />
          With love, we invite you to relive these special times and celebrate with us.
        </p>
        {/* Gallery Area */}
        <div className="relative w-full max-w-[500px] h-[500px] mx-auto flex items-center justify-center">
          {/* Center Bubble */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 z-10 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-lg bg-white flex items-center justify-center cursor-pointer"
            onClick={() => setShowModal(true)}
            title="Click to view full image"
          >
            <Image
              src={memories[centerIndex].src}
              alt={memories[centerIndex].alt}
              fill
              className="object-contain object-center bg-white"
              priority
            />
          </div>
          {/* Fixed-position small bubbles */}
          {smallBubbles.map((bubble, i) => (
            <div
              key={bubble.idx}
              className="absolute rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer transition-transform duration-200 hover:scale-110 bg-white"
              style={{
                left: `${fixedPositions[i].x}%`,
                top: `${fixedPositions[i].y}%`,
                width: `${BUBBLE_SIZE}px`,
                height: `${BUBBLE_SIZE}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 5,
              }}
              onClick={() => setCenterIndex(bubble.idx)}
            >
              <Image
                src={bubble.src}
                alt={bubble.alt}
                fill
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
      {/* Modal for full image view */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative max-w-2xl w-[90vw] max-h-[90vh] bg-transparent flex flex-col items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button above the image, not overlapping */}
            <button
              className="mb-2 mt-2 self-end text-white bg-black/60 rounded-full p-2 hover:bg-black/80 z-10"
              onClick={() => setShowModal(false)}
              aria-label="Close"
              style={{ position: 'static' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-[60vw] max-h-[80vh] max-w-[80vw] bg-white rounded-lg flex items-center justify-center">
              <Image
                src={memories[centerIndex].src}
                alt={memories[centerIndex].alt}
                fill
                className="object-contain object-center rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 