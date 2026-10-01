'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  MapPin, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  PhoneCall, 
  CheckCircle2,
  Anchor,
  Car
} from 'lucide-react';
import { PRIMARY_PHONE, SECONDARY_PHONE } from '../lib/contactConfig';

const FAQS = [
  {
    q: 'Why should I buy a car from 3BrosMotor in Tanzania?',
    a: '3BrosMotor is a trusted automotive importer with physical showroom facilities in Mwanza and clearing operations at Dar es Salaam port. We offer genuine Grade 4+ Japanese auction-sourced vehicles, certified mileage verification, and 100% transparent pricing with zero surprise charges.'
  },
  {
    q: 'Can 3BrosMotor deliver vehicles across Tanzania outside Mwanza?',
    a: 'Yes! We coordinate secure, insured carrier transport from Mwanza and Dar es Salaam to all major destinations including Dodoma, Arusha, Geita, Shinyanga, Tabora, Mbeya, and across East Africa.'
  },
  {
    q: 'How do I import a vehicle from Japan through 3BrosMotor?',
    a: `Simply contact our sales team via WhatsApp (+255 671 361 160 or +255 693 100 680) with your vehicle preferences. We bid directly on your chosen vehicle at Japanese USS auctions, oversee maritime shipping to Dar es Salaam, process TRA customs clearance, and deliver the vehicle road-ready.`
  },
  {
    q: 'What payment methods does 3BrosMotor accept?',
    a: 'We accept direct bank transfers (USD / TZS), official showroom cash deposits, mobile money (M-Pesa, Tigo Pesa, Airtel Money), and verified vehicle trade-in evaluations.'
  },
  {
    q: 'Are all vehicles mechanically inspected before handover?',
    a: 'Every car in our inventory undergoes a thorough 150-point diagnostic check covering engine compression, transmission shifting, suspension, braking systems, air conditioning, and electrical diagnostics.'
  }
];

const POPULAR_SEARCHES = [
  'Toyota Land Cruiser Prado Mwanza',
  'Toyota Hilux Revo 4WD Tanzania',
  'Toyota Harrier Elegance for Sale',
  'Toyota RAV4 Adventure Dar es Salaam',
  'Sino & Scania Commercial Trucks',
  'Magari ya Japani Tanzania',
  'Used Cars for Sale Mwanza',
  'USS Japan Auto Auction Import Tanzania',
  'Toyota Land Cruiser V8 ZX',
  'Clearing and Forwarding Dar es Salaam'
];

export default function DealershipSeoSection() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (idx) => {
    setOpenFaq(current => current === idx ? null : idx);
  };

  return (
    <section 
      id="dealership-authority-seo" 
      aria-label="Dealership Information & FAQ"
      className="container mx-auto max-w-[1240px] px-3 my-10"
    >
      {/* 4 Pillars of Excellence */}
      <div className="bg-gradient-to-r from-[#213555] via-[#4b6ba3] to-[#213555] text-white p-6 sm:p-8 rounded-lg shadow-md mb-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Award size={14} /> Premier Dealership in Tanzania
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
            Why 3BrosMotor is Tanzania&apos;s #1 Choice for Quality Vehicles
          </h2>
          <p className="text-gray-200 text-xs sm:text-sm mt-2 leading-relaxed">
            Quality Cars • Better Journeys. From premier Japanese luxury SUVs to heavy-duty commercial haulers, we connect East African motorists with pristine, certified vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/15">
            <div className="w-10 h-10 rounded-lg bg-yellow-400 text-gray-900 flex items-center justify-center font-bold mb-3 shadow">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Direct Japan USS Imports</h3>
            <p className="text-gray-200 text-xs leading-relaxed">
              Direct auction access in Tokyo &amp; Nagoya. Only Grade 4+ vehicles with authentic odometer certificates and full inspection sheets.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/15">
            <div className="w-10 h-10 rounded-lg bg-yellow-400 text-gray-900 flex items-center justify-center font-bold mb-3 shadow">
              <Anchor size={22} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Dar es Salaam Port Clearance</h3>
            <p className="text-gray-200 text-xs leading-relaxed">
              Fast, hassle-free customs clearance and TRA duty processing. Zero unexpected port holding or demurrage charges.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/15">
            <div className="w-10 h-10 rounded-lg bg-yellow-400 text-gray-900 flex items-center justify-center font-bold mb-3 shadow">
              <MapPin size={22} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Physical Mwanza Showroom</h3>
            <p className="text-gray-200 text-xs leading-relaxed">
              Inspect before you purchase. Come to our physical showroom yard in Mwanza for mechanical evaluations and test drives.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/15">
            <div className="w-10 h-10 rounded-lg bg-yellow-400 text-gray-900 flex items-center justify-center font-bold mb-3 shadow">
              <Truck size={22} />
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Nationwide Carrier Transport</h3>
            <p className="text-gray-200 text-xs leading-relaxed">
              Safe, reliable delivery to Arusha, Dodoma, Geita, Shinyanga, Mbeya, and all corners of Tanzania and the Great Lakes region.
            </p>
          </div>
        </div>
      </div>

      {/* SEO FAQ Accordion + Quick Contact Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FAQ Left Column */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <HelpCircle size={20} className="text-[#4b6ba3]" />
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={faq.q} 
                  className="border border-gray-200 rounded-md overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-gray-800 cursor-pointer select-none transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-[#4b6ba3] flex-shrink-0">
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 py-3 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Quick Inquiry Box */}
        <div className="bg-[#f8fafc] border border-blue-200 rounded-lg p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[#4b6ba3] font-bold text-sm mb-2">
            <Car size={18} />
            <span>Need a Custom Japan Order?</span>
          </div>
          <p className="text-xs text-gray-600 mb-4 leading-relaxed">
            Looking for a specific model, year, or color not currently in our Mwanza yard? We bid on your behalf across Japanese USS, TAA, and CAA auction houses.
          </p>

          <div className="space-y-2.5 mb-5 text-xs">
            <div className="flex items-start gap-2 text-gray-700">
              <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Full auction sheet translation &amp; grading check</span>
            </div>
            <div className="flex items-start gap-2 text-gray-700">
              <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>Ro-Ro shipping directly to Dar es Salaam port</span>
            </div>
            <div className="flex items-start gap-2 text-gray-700">
              <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>TRA customs clearance and registration handled</span>
            </div>
          </div>

          <div className="space-y-2">
            <a
              href={PRIMARY_PHONE.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded text-xs flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
            >
              <span>Chat with Sales on WhatsApp</span>
            </a>
            <Link
              href="/contact"
              className="w-full bg-[#4b6ba3] hover:bg-[#3c5683] text-white font-bold py-2.5 px-4 rounded text-xs flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
            >
              <PhoneCall size={14} />
              <span>Visit Contact Us Page</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Local Keyword Tags */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Popular Searches &amp; Inventory Categories in Tanzania
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_SEARCHES.map(item => (
            <span 
              key={item}
              className="text-[11px] bg-gray-100 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full px-3 py-1 transition-colors"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
