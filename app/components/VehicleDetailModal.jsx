'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Gauge, 
  Fuel, 
  ShieldCheck, 
  MapPin, 
  Share2, 
  Check, 
  ListChecks, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  Car as CarIcon
} from 'lucide-react';
import { getVehicleImages } from '../lib/carsData';
import { 
  PRIMARY_PHONE, 
  SECONDARY_PHONE, 
  buildWhatsAppLink 
} from '../lib/contactConfig';

export default function VehicleDetailModal({ car, onClose, onOpenInquiry }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Normalize images
  const images = car ? getVehicleImages(car) : [];

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation (ESC to close, Left/Right arrows to flip images)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNext, handlePrev]);

  // Reset index when car changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [car?.id]);

  if (!car) return null;

  // Build structured WhatsApp message for this vehicle
  const handleWhatsApp = (phoneObj) => {
    const lines = [
      `Hello 3BrosMotor Sales Team,`,
      ``,
      `I am interested in this vehicle on your website:`,
      `*${car.year} ${car.make} ${car.model}*`,
      `• Stock ID: #${car.id}`,
      `• Chassis No: ${car.chassis || 'N/A'}`,
      `• Mileage: ${car.mileage || 'N/A'}`,
      `• Listed Price: $${car.price || 'Ask'}`,
      `• Location: ${car.location || 'Dar es Salaam, Tanzania'}`,
      ``,
      `Please share additional photos, a walkaround video, and discuss the final on-the-road price.`
    ];
    const text = lines.join('\n');
    const url = buildWhatsAppLink(phoneObj.clean, text);
    window.open(url, '_blank');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/?stock=${car.id}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  // Features list breakdown
  const featuresList = car.features
    ? car.features
        .split(/[,•\n]+|\s{2,}/)
        .map(f => f.trim())
        .filter(f => f.length > 2)
    : [];

  const rawPriceNum = car.price ? parseInt(String(car.price).replace(/\D/g, ''), 10) : 0;
  const tzsEquivalent = rawPriceNum > 0 ? (rawPriceNum * 2650).toLocaleString() : null;

  return (
    <div 
      id="vehicle-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="vehicle-detail-modal"
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150 my-auto max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar Header */}
        <div className="bg-[#4b6ba3] text-white px-4 py-3 flex items-center justify-between border-b border-[#3c5683] flex-shrink-0">
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-2 text-[11px] text-blue-200 font-bold uppercase tracking-wider">
              <span>Stock #{car.id}</span>
              <span>•</span>
              <span className="text-yellow-300 flex items-center gap-1">
                <MapPin size={11} />
                {car.location || 'Dar es Salaam Yard'}
              </span>
              <span>•</span>
              <span className="text-emerald-300">{car.status || 'In Stock'}</span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white truncate leading-tight">
              {car.year} {car.make} <span className="text-blue-100">{car.model}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleShare}
              title="Copy share link"
              className="bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              id="btn-close-vehicle-detail"
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Top Section: Image Gallery + Quick Action Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 7 Cols: Interactive Image Gallery */}
            <div className="lg:col-span-7 space-y-3">
              {/* Primary Large Image Viewport */}
              <div className="relative aspect-[4/3] w-full bg-gray-900 rounded-xl overflow-hidden border border-gray-200 shadow-inner group select-none">
                {images.length > 0 && images[activeImageIndex] ? (
                  <Image 
                    src={images[activeImageIndex]} 
                    alt={`${car.make} ${car.model} - Photo ${activeImageIndex + 1}`}
                    fill
                    priority
                    className="object-cover transition-opacity duration-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                    <CarIcon size={32} className="mb-2 text-gray-500" />
                    <span>No image uploaded for this unit</span>
                  </div>
                )}

                {/* Photo Count Badge */}
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow">
                  <Layers size={13} className="text-yellow-400" />
                  <span>Photo {activeImageIndex + 1} of {images.length}</span>
                </div>

                {/* Left/Right Arrows for flipping images */}
                {images.length > 1 && (
                  <>
                    <button
                      id="btn-gallery-prev"
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous Photo"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition shadow-md cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <ChevronLeft size={22} />
                    </button>
                    <button
                      id="btn-gallery-next"
                      type="button"
                      onClick={handleNext}
                      aria-label="Next Photo"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition shadow-md cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <ChevronRight size={22} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Strip */}
              {images.length > 1 && (
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Click angle to view:</span>
                    <span className="text-gray-400 font-normal">Use ← → arrow keys to flip</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition cursor-pointer ${
                          activeImageIndex === idx 
                            ? 'border-[#4b6ba3] ring-2 ring-blue-200 scale-[1.02]' 
                            : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-400'
                        }`}
                      >
                        <Image 
                          src={imgUrl} 
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 right-0 bg-black/75 text-[9px] font-bold text-white px-1 rounded-tl">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right 5 Cols: Pricing & Direct WhatsApp Contact Card */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Pricing Box */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 sm:p-5">
                <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-1">
                  Asking Dealership Price
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">
                    {car.price ? `$${car.price}` : 'Price on Request'}
                  </span>
                  <span className="text-xs font-bold text-gray-500">USD</span>
                </div>
                {tzsEquivalent && (
                  <div className="text-xs font-bold text-blue-700 mt-1 flex items-center gap-1">
                    <span>≈ TZS {tzsEquivalent}</span>
                    <span className="text-[10px] text-gray-500 font-normal">(Exchange rate applied)</span>
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-blue-200/80 text-[11px] text-gray-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Verified Importation & Title Clearance</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                    <span>Inspection report available at yard</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Box */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2.5 shadow-xs">
                <div className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  Contact Sales for Video & Price:
                </div>

                {/* Primary WhatsApp Sales Line */}
                <button
                  id="btn-detail-wa-primary"
                  type="button"
                  onClick={() => handleWhatsApp(PRIMARY_PHONE)}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp {PRIMARY_PHONE.display}</span>
                </button>

                {/* Secondary WhatsApp Line */}
                <button
                  id="btn-detail-wa-secondary"
                  type="button"
                  onClick={() => handleWhatsApp(SECONDARY_PHONE)}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.99] cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp {SECONDARY_PHONE.display}</span>
                </button>

                {/* Direct Phone Call */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={PRIMARY_PHONE.tel}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-2 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <Phone size={13} className="text-[#4b6ba3]" />
                    <span className="truncate">Call Line 1</span>
                  </a>
                  <a
                    href={SECONDARY_PHONE.tel}
                    className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold py-2 px-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <Phone size={13} className="text-[#4b6ba3]" />
                    <span className="truncate">Call Line 2</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* Specifications Table Section */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                <span>Vehicle Specifications & Identity</span>
              </h3>
              <span className="text-[11px] font-mono text-gray-500 font-semibold">
                CHASSIS: {car.chassis || 'N/A'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 divide-x divide-y divide-gray-200 text-xs">
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Year</span>
                <span className="font-bold text-gray-900 text-sm">{car.year || 'N/A'}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Mileage</span>
                <span className="font-bold text-gray-900 text-sm">{car.mileage || 'N/A'}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Engine</span>
                <span className="font-bold text-gray-900 text-sm">{car.engine || 'N/A'}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Transmission</span>
                <span className="font-bold text-gray-900 text-sm">{car.trans || 'Auto'}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Steering</span>
                <span className="font-bold text-gray-900 text-sm">{car.steering || 'RIGHT'}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Fuel Type</span>
                <span className="font-bold text-gray-900 text-sm">{car.fuel || 'Petrol'}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Color</span>
                <span className="font-bold text-red-600 text-sm">{car.color || 'WHITE'}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Body Type</span>
                <span className="font-bold text-gray-900 text-sm">{car.bodyType || 'SUV'}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Doors / Seats</span>
                <span className="font-bold text-gray-900 text-sm">{car.doors || '5'} Doors • {car.seats || '5'} Seats</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Location Yard</span>
                <span className="font-bold text-gray-900 text-sm">{car.location || 'Dar es Salaam'}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Inventory Status</span>
                <span className="font-bold text-emerald-700 text-sm">{car.status || 'In Stock'}</span>
              </div>
              <div className="p-3 bg-white">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Stock No.</span>
                <span className="font-bold text-[#4b6ba3] text-sm">#{car.id}</span>
              </div>
            </div>
          </div>

          {/* Features & Options Checklist */}
          {featuresList.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-xs">
              <h3 className="font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <ListChecks size={15} className="text-[#4b6ba3]" />
                <span>Installed Equipment & Features</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {featuresList.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-2">
                    <Check size={14} className="text-emerald-600 flex-shrink-0" />
                    <span className="font-medium truncate">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Footer Note */}
          <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#4b6ba3] flex-shrink-0" />
              <span>Inspection, road test, and direct title transfer handled at our Dar es Salaam yard.</span>
            </div>
            <Link
              href="/contact"
              onClick={onClose}
              className="text-[#4b6ba3] hover:underline font-bold flex items-center gap-1 flex-shrink-0"
            >
              <span>Visit Dealership / Book Test Drive</span>
              <ExternalLink size={12} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
