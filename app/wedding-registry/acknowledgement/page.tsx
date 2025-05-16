"use client"

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function AcknowledgementPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-[#fbeee6] py-12 px-4 flex flex-col items-center">
      {/* Back to Registry Link */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <Link href="/wedding-registry" className="inline-flex items-center text-gray-600 hover:text-[#D4AF37] transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-serif tracking-widest">{t('backToRegistry')}</span>
        </Link>
      </div>

      <div className="max-w-2xl w-full bg-white/90 rounded-lg shadow-md p-8 mt-8">
        <h1 className="text-3xl font-serif text-[#D4AF37] mb-8 text-center">{t('acknowledgement')}</h1>
        
        <div className="space-y-12">
          {/* Pxlbrain Section */}
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">{t('pxlbrain')}</h2>
            <div className="relative w-64 h-64 mx-auto mb-4 bg-white rounded-lg shadow-sm">
              <Image
                src="/logo.png"
                alt="Pxlbrain"
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="mt-2">
              <a
                href="https://pxlbrain.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline font-serif"
              >
                @pxlbrain
              </a>
            </div>
          </div>

          {/* Caterer Section */}
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">{t('caterer')}</h2>
            <div className="relative w-64 h-64 mx-auto mb-4 bg-white rounded-lg shadow-sm">
              <Image
                src="/cartrer.png"
                alt="Caterer"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-gray-600">
              Mohan Caterers - Manoj<br/>
              <a href="tel:+919566604126" className="hover:text-[#D4AF37] transition-colors underline">+91 9566604126</a>
            </p>
          </div>

          {/* DJ Section */}
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">{t('dj')}</h2>
            <div className="relative w-64 h-64 mx-auto mb-4 bg-white rounded-lg shadow-sm">
              <Image
                src="/dj.png"
                alt="DJ"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-gray-600">
              DJ Morgan<br/>
              <a 
                href="https://www.instagram.com/morkondj?utm_source=qr&igsh=anJ2dmE1bmQzOGsx" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors underline"
              >
                @morkondj
              </a>
            </p>
          </div>

          {/* Make-up Artist Section */}
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">{t('makeUpArtist')}</h2>
            <div className="relative w-64 h-64 mx-auto mb-4 bg-white rounded-lg shadow-sm">
              <Image
                src="/ibrahim.png"
                alt="Make-up Artist"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-gray-600">
              Make up Ibrahim<br/>
              <a href="tel:+919840177438" className="hover:text-[#D4AF37] transition-colors underline">+91 9840177438</a><br/>
              <a 
                href="https://www.instagram.com/makeupibrahim/?igsh=MXV6aTNlY3BwajFodw%3D%3D" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors underline"
              >
                @makeupibrahim
              </a>
            </p>
          </div>

          {/* Photography Section */}
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">{t('photographyVideography')}</h2>
            <div className="relative w-64 h-64 mx-auto mb-4 bg-white rounded-lg shadow-sm">
              <Image
                src="/photos.jpg"
                alt="Photography"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-gray-600">
              Iswarya Photos<br/>
              <a href="tel:+919629212345" className="hover:text-[#D4AF37] transition-colors underline">+91 9629212345</a><br/>
              <a 
                href="https://www.instagram.com/iswaryaphotos?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors underline"
              >
                @iswaryaphotos
              </a>
            </p>
          </div>

          {/* Decorators Section */}
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">{t('decorators')}</h2>
            <div className="relative w-64 h-64 mx-auto mb-4 bg-white rounded-lg shadow-sm">
              <Image
                src="/maruthi.png"
                alt="Decorators"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-gray-600">
              Maruti Decorators - Prasanna<br/>
              <a href="tel:+919843527150" className="hover:text-[#D4AF37] transition-colors underline">+91 9843527150</a>
            </p>
          </div>

          {/* Clothing Section */}
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">{t('clothing')}</h2>
            <div className="relative w-64 h-64 mx-auto mb-4 bg-white rounded-lg shadow-sm">
              <Image
                src="/adams.jpg"
                alt="Clothing"
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="space-y-4">
              <div>
                <span className="font-serif text-lg text-gray-800">Sam adams</span>
              </div>
            </div>
          </div>

          {/* Muhurtham Section */}
          <div className="text-center">
            <h2 className="text-2xl font-serif text-gray-800 mb-4">{t('muhurthamRituals')}</h2>
            <div className="relative w-64 h-64 mx-auto mb-4 bg-white rounded-lg shadow-sm">
              <Image
                src="/love.png"
                alt="Muhurtham"
                fill
                className="object-contain p-4"
              />
            </div>
            <p className="text-gray-600">
              <a 
                href="https://www.instagram.com/madewythluv?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-[#D4AF37] transition-colors underline"
              >
                {t('madeWythLuv')}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-xl font-serif text-[#D4AF37] mb-2">{t('withLove')}</p>
          <p className="text-lg text-gray-800">{t('coupleNames')}</p>
        </div>
      </div>
    </div>
  );
} 
