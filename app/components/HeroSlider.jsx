'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    bgUrl: "/Slide_1.1.jpg",
    objectPosition: "left center",
    containerClassName: "bg-[#091B33] pl-5 sm:pl-2 md:pl-5",
    
  },
  {
    id: 2,
   
    label: "NEW ARRIVALS",
    bgUrl: "/Slide_2.2.jpg",
    objectPosition: "center bottom",
    
  },
  {
    id: 3,
   
    label: "SPECIAL OFFERS",
    bgUrl: "/Slide_3.jpg",
    objectPosition: "center top",
  },
  {
    id: 4,
  
    label: "VERIFIED CARS",
    bgUrl: "/Slide_4.jpg",
    className: "pt-2"
  },
  {
    id: 5,
   
    label: "HEAVY DUTY",
    bgUrl: "/Slide_5.jpg",
    className: "pt-2"
  },
  
];

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handlePrev = (e) => {
    e?.stopPropagation?.();
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = (e) => {
    e?.stopPropagation?.();
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      id="hero-slider-container" 
      className="w-full md:flex-1 bg-gray-100 border border-gray-300 relative overflow-hidden h-[250px] sm:h-[310px] md:h-[340px] min-h-[250px] sm:min-h-[310px] md:min-h-[340px] flex flex-col rounded-sm shadow-sm select-none"
    >
      {/* Main Banner Graphic Area with Touch Swipe Support */}
      <div 
        className="relative w-full flex-1 min-h-[195px] sm:min-h-[250px] md:min-h-[280px] overflow-hidden bg-gradient-to-r from-pink-100 via-rose-50 to-amber-50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          key={currentIndex} 
          className={`absolute inset-0 overflow-hidden animate-in fade-in duration-700 ease-in-out ${SLIDES[currentIndex].containerClassName || ''}`}
        >
          <div className="relative w-full h-full">
            <Image 
              src={SLIDES[currentIndex].bgUrl} 
              alt={SLIDES[currentIndex].label || `3BrosMotor Banner Slide ${SLIDES[currentIndex].id}`} 
              fill 
              className={`opacity-95 transition-transform duration-300 ${
                SLIDES[currentIndex].className?.includes('object-') 
                  ? SLIDES[currentIndex].className 
                  : `object-cover ${SLIDES[currentIndex].className || ''}`
              }`}
              style={SLIDES[currentIndex].objectPosition ? { objectPosition: SLIDES[currentIndex].objectPosition } : undefined}
              referrerPolicy="no-referrer"
              priority
            />
          </div>

          {/* Authentic banner text overlay (rendered only if text is provided) */}
          {(SLIDES[currentIndex].company || SLIDES[currentIndex].subtitle || SLIDES[currentIndex].details) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/50 flex flex-col justify-between p-4 sm:p-6 text-white z-10">
              <div className="text-center">
                {SLIDES[currentIndex].company && (
                  <h2 className="text-xl sm:text-2xl md:text-4xl font-black italic tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-white">
                    {SLIDES[currentIndex].company}
                  </h2>
                )}
                {SLIDES[currentIndex].subtitle && (
                  <div className="inline-block bg-red-600 text-white font-bold text-xs sm:text-sm md:text-base px-3 py-0.5 mt-1 transform -skew-x-6 tracking-wide shadow-md">
                    {SLIDES[currentIndex].subtitle}
                  </div>
                )}
              </div>

              {SLIDES[currentIndex].details && (
                <div className="text-center pb-1">
                  <div className="bg-gradient-to-b from-yellow-300 to-yellow-500 text-black font-extrabold text-sm sm:text-base md:text-xl px-4 py-1.5 inline-block shadow-lg border-b-2 border-yellow-700 rounded-sm">
                    <span className="text-red-700 font-black mr-2">📞</span>
                    {SLIDES[currentIndex].details}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Previous Button */}
        <button
          id="btn-hero-prev"
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-black/50 hover:bg-black/80 active:scale-95 text-white rounded-full flex items-center justify-center transition shadow-md backdrop-blur-[2px]"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next Button */}
        <button
          id="btn-hero-next"
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 bg-black/50 hover:bg-black/80 active:scale-95 text-white rounded-full flex items-center justify-center transition shadow-md backdrop-blur-[2px]"
        >
          <ChevronRight size={20} />
        </button>

        {/* Mobile Slide Counter Badge */}
        <div className="absolute top-2 right-2 z-20 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-[2px] shadow-sm">
          {currentIndex + 1} / {SLIDES.length}
        </div>
      </div>

      {/* Mini Thumbnails Strip */}
      <div id="hero-thumbnails-strip" className="bg-gray-800 flex h-[50px] sm:h-[58px] flex-shrink-0 overflow-x-auto border-t border-gray-700 touch-pan-x">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id} 
            id={`slide-thumb-${slide.id}`}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`flex-1 min-w-[70px] sm:min-w-[90px] border-r border-gray-600 relative cursor-pointer group ${currentIndex === idx ? 'opacity-100 ring-2 ring-red-600 ring-inset' : 'opacity-50 hover:opacity-85'} transition-opacity`}
          >
            <Image 
              src={slide.bgUrl} 
              alt={slide.label || `Slide thumbnail ${slide.id}`} 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            {slide.label ? (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-0.5">
                <span className="text-[9px] sm:text-[10px] text-white font-bold tracking-tight text-center leading-tight drop-shadow">
                  {slide.label}
                </span>
              </div>
            ) : null}
            {currentIndex === idx && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 z-10"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

