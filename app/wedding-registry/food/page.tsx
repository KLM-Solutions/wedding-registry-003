"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from 'react-i18next';
import '../../i18n';

const foodImages = [
  { src: "/food-1.png", alt: "Food 1", date: "16th May" },
  { src: "/food-2.png", alt: "Food 2", date: "16th May" },
  { src: "/food-3.png", alt: "Food 3", date: "17th May" },
  { src: "/food-4.png", alt: "Food 4", date: "17th May" },
  { src: "/food-5.png", alt: "Food 5", date: "17th May" },
  { src: "/food-6.png", alt: "Food 6", date: "18th May" },
  { src: "/food-7.png", alt: "Food 7", date: "18th May" },
  { src: "/food-8.png", alt: "Food 8", date: "18th May" },
]

export default function FoodGallery() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0)

  const handlePrev = () => setPage((p) => (p > 0 ? p - 1 : p))
  const handleNext = () => setPage((p) => (p < foodImages.length - 1 ? p + 1 : p))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        <div className="w-full flex justify-between mb-4">
          <Link 
            href="/wedding-registry" 
            className="text-gray-600 hover:text-[#D4AF37] font-serif text-base tracking-wide"
          >
            ← {t('backToRegistry')}
          </Link>
          <Link 
            href="/calculator"
            className="text-[#D4AF37] hover:text-[#C09B2A] font-serif text-base tracking-wide"
          >
            {t('analyzeFood')}
          </Link>
        </div>
        <h1 className="text-3xl font-serif text-gray-800 mb-6">{t('foodMenu')}</h1>
        <div className="text-2xl font-serif text-[#D4AF37] mb-4">
          {foodImages[page].date}
        </div>
        <div className="relative w-full aspect-[3/4] bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center mb-6">
          <Image
            src={foodImages[page].src}
            alt={foodImages[page].alt}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <button 
            onClick={handlePrev} 
            disabled={page === 0}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#C09B2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('previous')}
          </button>
          <span className="text-lg font-serif text-gray-700">
            {t('page')} {page + 1} / {foodImages.length}
          </span>
          <button 
            onClick={handleNext} 
            disabled={page === foodImages.length - 1}
            className="px-4 py-2 bg-[#D4AF37] text-white rounded-md hover:bg-[#C09B2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('next')}
          </button>
        </div>
      </div>
    </div>
  )
} 