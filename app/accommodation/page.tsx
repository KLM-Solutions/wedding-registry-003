"use client"

import { Phone } from "lucide-react"
import Link from "next/link"
import { useTranslation } from 'react-i18next';
import '../i18n';

interface Hotel {
  name: string
  phone: string
  translationKey: string
}

export default function Accommodation() {
  const { t } = useTranslation();
  
  const hotels: Hotel[] = [
    { name: "Hotel D'wafarer", phone: "9489026222", translationKey: "hotelDwafarer" },
    { name: "Hotel Turmeric", phone: "9063770000", translationKey: "hotelTurmeric" },
    { name: "Hotel Varshan", phone: "9842815005", translationKey: "hotelVarshan" },
    { name: "Hotel Deepa", phone: "9585803636", translationKey: "hotelDeepa" },
    { name: "MKR Homestay", phone: "6380700287", translationKey: "mkrHomestay" },
  ]

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
        <div className="container px-4 flex items-center justify-between">
          <Link href="/wedding-registry" className="text-gray-700 hover:text-gray-900">
            {t('backToRegistry')}
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16 mt-8">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-800 tracking-wide mb-6">{t('accommodationTitle')}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('accommodationDescription')}
            </p>
          </header>

          <div className="bg-white/95 rounded-lg shadow-lg p-8 mb-8">
            <div className="space-y-4">
              {hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                      <span className="text-gray-700 font-serif">{hotel.name.charAt(0)}</span>
                    </div>
                    <h3 className="font-serif text-gray-800">{t(hotel.translationKey)}</h3>
                  </div>
                  <a
                    href={`tel:${hotel.phone}`}
                    className="flex items-center text-[#D4AF37] hover:text-[#C09B2A] transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{hotel.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 