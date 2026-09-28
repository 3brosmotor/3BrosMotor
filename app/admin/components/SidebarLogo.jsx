'use client';

export default function SidebarLogo({ collapsed = false }) {
  if (collapsed) {
    return (
      <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
        3B
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 select-none">
      {/* Red & Chrome Sleek Car Graphic */}
      <div className="flex-shrink-0 w-10 h-7 relative flex items-center justify-center">
        <svg viewBox="0 0 100 45" className="w-full h-full drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Aerodynamic car silhouette matching 3B MOTORS header */}
          <path 
            d="M 5 35 C 15 35, 20 32, 28 22 C 34 14, 46 8, 62 8 C 74 8, 85 14, 94 24 C 98 28, 97 34, 90 35 Z" 
            fill="#E31837" 
          />
          <path 
            d="M 32 20 C 37 14, 47 11, 60 11 C 70 11, 78 15, 84 20 Z" 
            fill="#1f2937" 
          />
          {/* Wheels */}
          <circle cx="28" cy="34" r="7" fill="#111827" stroke="#9ca3af" strokeWidth="2" />
          <circle cx="28" cy="34" r="3" fill="#ffffff" />
          <circle cx="78" cy="34" r="7" fill="#111827" stroke="#9ca3af" strokeWidth="2" />
          <circle cx="78" cy="34" r="3" fill="#ffffff" />
        </svg>
      </div>

      {/* Dealership Name Typography */}
      <div className="leading-tight">
        <div className="flex items-baseline gap-1">
          <span className="font-black text-[#111827] text-sm tracking-tight">3BrosMotor</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase">.LTD</span>
        </div>
        <div className="text-[8px] font-semibold text-[#E31837] tracking-wider uppercase">
          Quality Cars • Better Journeys
        </div>
      </div>
    </div>
  );
}
