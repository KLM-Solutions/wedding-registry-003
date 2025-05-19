"use client"

import { useTranslation } from 'react-i18next';
import '../i18n';
import Link from 'next/link';

export default function MeetTheCouple() {
  const { t } = useTranslation();

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
      
      {/* Menu Bar */}
      <div className="w-full py-4 border-b border-gray-100 flex justify-center">
        <div className="container px-4 flex items-center justify-start">
          <Link href="/wedding-registry" className="text-gray-700 hover:text-gray-900">
            {t('backToRegistry')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-20">
        <div className="max-w-4xl mx-auto">
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

              {/* Date and Location */}
              <div className="text-xl font-serif text-gray-600 tracking-wider mb-6">
                <div className="mb-2">{t('weddingDate')}</div>
                <div>{t('weddingLocation')}</div>
              </div>
            </div>
          </header>

          <div className="bg-white/95 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-serif text-[#D4AF37] mb-6 text-center">{t('theirStory')}</h2>
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-center">
                {t('storyPart1')}
              </p>
              <p className="text-center">
                {t('storyPart2')}
              </p>
              <p className="text-center">
                {t('storyPart3')}
              </p>
              <p className="text-center">
                {t('storyPart4')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 