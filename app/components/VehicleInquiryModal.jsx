'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, MessageSquare, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { 
  PRIMARY_PHONE, 
  SECONDARY_PHONE, 
  buildWhatsAppLink, 
  buildVehicleInquiryMessage 
} from '../lib/contactConfig';

export default function VehicleInquiryModal({ car, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!car) return null;

  const handleWhatsApp = (targetCleanNumber) => {
    const text = buildVehicleInquiryMessage(car);
    const url = buildWhatsAppLink(targetCleanNumber, text);
    window.open(url, '_blank');
  };

  return (
    <div 
      id="vehicle-inquiry-modal-backdrop" 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="vehicle-inquiry-modal" 
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#4b6ba3] text-white p-3.5 sm:p-4 flex justify-between items-center">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-blue-200 font-bold">
              Stock #{car.id} • Dealership Inquiry
            </div>
            <h3 className="font-black text-base sm:text-lg leading-tight">
              {car.year} {car.make} {car.model}
            </h3>
          </div>
          <button
            id="btn-close-inquiry-modal"
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Car Snapshot Bar */}
        <div className="p-3 sm:p-4 bg-gray-50 border-b border-gray-200 flex gap-3 items-center">
          <div className="w-20 h-16 bg-gray-200 rounded overflow-hidden relative flex-shrink-0 border border-gray-300">
            {car.photo ? (
              <Image 
                src={car.photo} 
                alt={`${car.make} ${car.model}`} 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-[10px] text-gray-500 font-bold w-full h-full flex items-center justify-center">
                No Photo
              </div>
            )}
          </div>
          <div className="flex-1 text-xs">
            <div className="font-bold text-gray-900 text-sm">
              <span className="text-gray-900">{car.year} {car.make} {car.model}</span>
            </div>
            <div className="text-gray-600 mt-0.5">
              Chassis: <span className="font-mono font-semibold">{car.chassis || 'N/A'}</span>
            </div>
            <div className="text-gray-500 text-[11px]">
              {car.engine} • {car.fuel} • {car.trans}
            </div>
          </div>
        </div>

        {/* Contact Sales Team */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="text-xs font-bold text-gray-700 uppercase tracking-wide">
            Contact our sales team directly:
          </div>

          {/* Line 1 */}
          <div className="border border-gray-300 bg-gray-50/70 rounded-lg p-3 hover:border-gray-400 transition">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-gray-900 text-sm sm:text-base">
                  {PRIMARY_PHONE.display}
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">
                  Line 1
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-semibold">
                WhatsApp &amp; Call
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-modal-wa-primary"
                type="button"
                onClick={() => handleWhatsApp(PRIMARY_PHONE.clean)}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2 px-2.5 rounded text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98] cursor-pointer"
              >
                <MessageSquare size={15} />
                <span>WhatsApp</span>
              </button>
              <a
                id="btn-modal-call-primary"
                href={PRIMARY_PHONE.tel}
                className="bg-[#4b6ba3] hover:bg-blue-800 text-white font-bold py-2 px-2.5 rounded text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98]"
              >
                <Phone size={15} />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Line 2 */}
          <div className="border border-gray-300 bg-gray-50/70 rounded-lg p-3 hover:border-gray-400 transition">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-gray-900 text-sm sm:text-base">
                  {SECONDARY_PHONE.display}
                </span>
                <span className="text-[10px] font-bold text-gray-700 bg-gray-200 px-1.5 py-0.5 rounded">
                  Line 2
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-semibold">
                WhatsApp &amp; Call
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-modal-wa-secondary"
                type="button"
                onClick={() => handleWhatsApp(SECONDARY_PHONE.clean)}
                className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2 px-2.5 rounded text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98] cursor-pointer"
              >
                <MessageSquare size={15} />
                <span>WhatsApp</span>
              </button>
              <a
                id="btn-modal-call-secondary"
                href={SECONDARY_PHONE.tel}
                className="bg-[#4b6ba3] hover:bg-blue-800 text-white font-bold py-2 px-2.5 rounded text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98]"
              >
                <Phone size={15} />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Bottom link to Contact Us page */}
          <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-600" />
              <span>Direct 3BrosMotor Dealership</span>
            </span>
            <Link 
              href="/contact" 
              onClick={onClose}
              className="text-[#4b6ba3] hover:underline font-bold flex items-center gap-1"
            >
              <span>Full Contact Form</span>
              <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
