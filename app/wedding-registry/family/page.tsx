"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from 'react-i18next';
import '../../i18n';

const groomImages = [
  { src: "/groom-2.jpg", alt: "Groom's Family 2", caption: "ramesh" },
  { src: "/groom-3.jpg", alt: "Groom's Family 3", caption: "brijMohan" },
  { src: "/groom-5.jpg", alt: "Groom's Family 5", caption: "nirupamaAbhijit" },
  { src: "/groom-1.jpg", alt: "Groom's Family 1", caption: "adityaDirect" },
]

const brideImages = [
  { src: "/bride-1.jpeg", alt: "Bride's Family 1", caption: "kalyan" },
  { src: "/bride-2.jpeg", alt: "Bride's Family 2", caption: "kalyani" },
  { src: "/bride-3.JPG", alt: "Bride's Family 3", caption: "anjanRaji" },
]

export default function FamilyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      {/* Back to Registry Link */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <Link href="/wedding-registry" className="inline-flex items-center text-gray-600 hover:text-[#D4AF37] transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-serif tracking-widest">{t('backToRegistry')}</span>
        </Link>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-[#D4AF37] text-center mb-8">{t('ourFamilies')}</h1>
        
        {/* Groom's Family Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif text-[#D4AF37] mb-6">{t('adityasFamily')}</h2>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
              {t('adityasFamilyDesc')}
            </p>
          </div>
          
          {/* Groom's Family Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groomImages.map((image, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-64 h-64 rounded-full bg-white shadow-md overflow-hidden border-2 border-[#D4AF37]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={`object-cover w-full h-full ${
                      index === 0 ? 'object-[center_10%]' : 
                      index === 3 ? 'object-[center_5%]' : 
                      'object-center'
                    }`}
                    sizes="(max-width: 256px) 100vw, 256px"
                    priority={index < 2}
                  />
                </div>
                <p className="mt-4 text-lg font-serif text-gray-800">{t(image.caption)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bride's Family Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-serif text-[#D4AF37] mb-6">{t('harinisFamily')}</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
              {t('harinisFamilyDesc')}
            </p>
          </div>
          
          {/* Bride's Family Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {brideImages.map((image, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative w-64 h-64 rounded-full bg-white shadow-md overflow-hidden border-2 border-[#D4AF37]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={`object-cover w-full h-full ${
                      index === 0 ? 'object-[center_30%] scale-175' : 
                      index === 3 ? 'object-[center_5%]' : 
                      'object-center'
                    }`}
                    sizes="(max-width: 256px) 100vw, 256px"
                    priority={index < 2}
                  />
                </div>
                <p className="mt-4 text-lg font-serif text-gray-800">{t(image.caption)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link href="/wedding-registry">
            <Button variant="ghost" className="mt-4 text-gray-600 hover:text-[#D4AF37]">
              {t('backToRegistry')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 