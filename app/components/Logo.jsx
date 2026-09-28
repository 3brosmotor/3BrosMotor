'use client';

/**
 * 3BrosMotor Pure Vector SVG Logo
 * Recreates the exact emblem from the reference:
 * - Stylized silver-chrome aerodynamic supercar silhouette with red rear fin
 * - Metallic chrome beveled "3Bros" text with authentic automotive horizon reflection
 * - Vibrant glossy racing red "Motor" text
 * - Tagline: "QUALITY CARS • BETTER JOURNEYS" flanked by red accent lines
 * Completely vector-based (SVG) — NO image file dependency.
 */
export default function Logo({ 
  className = '', 
  width = 250, 
  height, 
  variant = 'auto' // 'auto' | 'light' | 'dark'
}) {
  // Unique gradient IDs to prevent conflicts
  const idPrefix = 'bros_logo_';

  return (
    <div 
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: width ? `${width}px` : 'auto', height: height ? `${height}px` : 'auto' }}
    >
      <svg 
        viewBox="0 0 540 180" 
        className="w-full h-full drop-shadow-md overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Chrome Horizon Mirror Gradient for 3Bros typography */}
          <linearGradient id={`${idPrefix}chromeText`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#f3f4f6" />
            <stop offset="47%" stopColor="#e5e7eb" />
            <stop offset="49%" stopColor="#ffffff" />
            <stop offset="51%" stopColor="#374151" />
            <stop offset="68%" stopColor="#6b7280" />
            <stop offset="88%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#e5e7eb" />
          </linearGradient>

          {/* Chrome Stroke Gradient for metallic beveled edges */}
          <linearGradient id={`${idPrefix}chromeStroke`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#6b7280" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
          </linearGradient>

          {/* Car Body Chrome Outline Gradient */}
          <linearGradient id={`${idPrefix}carChrome`} x1="0%" y1="0%" x2="100%" y2="30%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="20%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#9ca3af" />
            <stop offset="60%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#f9fafb" />
          </linearGradient>

          {/* Car Lower Chrome Lines */}
          <linearGradient id={`${idPrefix}carLowerChrome`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>

          {/* Racing Red Gradient for 'Motor' */}
          <linearGradient id={`${idPrefix}redText`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff3333" />
            <stop offset="45%" stopColor="#e50914" />
            <stop offset="70%" stopColor="#cc0000" />
            <stop offset="100%" stopColor="#990000" />
          </linearGradient>

          {/* Red Rear Wing / Fin Gradient */}
          <linearGradient id={`${idPrefix}redWing`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="60%" stopColor="#e50914" />
            <stop offset="100%" stopColor="#b30000" />
          </linearGradient>

          {/* 3D Drop Shadow for the Car and Typography */}
          <filter id={`${idPrefix}glow`} x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        {/* ============================================================ */}
        {/* CAR SILHOUETTE (Supercar profile with silver chrome + red wing) */}
        {/* ============================================================ */}
        <g filter={`url(#${idPrefix}glow)`}>
          {/* 1. Red Rear Wing / Fin / Spoiler Accent on Left */}
          <path
            d="M 68 58 
               C 74 54, 88 51, 106 52 
               L 116 53 
               C 98 56, 85 62, 70 65 
               C 65 64, 62 61, 68 58 Z"
            fill={`url(#${idPrefix}redWing)`}
          />
          <path
            d="M 62 58 L 76 54 L 72 63 Z"
            fill="#b30000"
          />

          {/* 2. Main Aerodynamic Roof Arch & Windshield Line */}
          <path
            d="M 108 53 
               C 145 35, 215 22, 285 24 
               C 365 26, 420 46, 470 66 
               C 445 61, 385 41, 305 37 
               C 230 34, 160 44, 115 57 
               Z"
            fill={`url(#${idPrefix}carChrome)`}
          />

          {/* 3. Sleek Cabin Window & B-Pillar Contour */}
          <path
            d="M 175 47 
               C 215 36, 275 35, 335 44 
               C 385 52, 425 64, 442 70 
               C 405 66, 355 58, 305 55 
               C 245 52, 195 56, 175 60
               Z"
            fill={`url(#${idPrefix}carLowerChrome)`}
            opacity="0.85"
          />

          {/* 4. Rear Haunch & Muscular Fender Sweep */}
          <path
            d="M 88 64 
               C 105 60, 130 57, 158 58 
               C 140 64, 118 72, 98 78 
               C 88 77, 85 71, 88 64 Z"
            fill={`url(#${idPrefix}carChrome)`}
          />

          {/* 5. Rear Wheel Arch Curve */}
          <path
            d="M 98 78 
               C 112 65, 142 63, 162 76 
               C 148 71, 122 71, 108 81 Z"
            fill={`url(#${idPrefix}carLowerChrome)`}
          />

          {/* 6. Aerodynamic Side Skirt / Door Blade Crease */}
          <path
            d="M 166 76 
               C 210 68, 280 67, 345 74 
               C 310 76, 240 76, 180 82 Z"
            fill={`url(#${idPrefix}carChrome)`}
          />

          {/* 7. Front Wheel Arch Curve */}
          <path
            d="M 345 74 
               C 365 62, 400 62, 422 75 
               C 405 68, 380 68, 360 78 Z"
            fill={`url(#${idPrefix}carLowerChrome)`}
          />

          {/* 8. Front Headlight Blade & Aggressive Nose Splitter */}
          <path
            d="M 445 68 
               C 465 72, 485 79, 492 84 
               C 480 84, 460 81, 440 78 
               C 435 74, 438 70, 445 68 Z"
            fill={`url(#${idPrefix}carChrome)`}
          />

          {/* Sharp Headlight Intake Slit */}
          <path
            d="M 458 73 L 484 80 L 468 81 Z"
            fill="#ffffff"
            opacity="0.9"
          />
        </g>

        {/* ============================================================ */}
        {/* WORDMARK: "3Bros" (Silver Chrome) + "Motor" (Racing Red) */}
        {/* ============================================================ */}
        <g filter={`url(#${idPrefix}glow)`}>
          {/* Beveled Extrusion Underlayer for 3D depth */}
          <text
            x="270"
            y="136"
            textAnchor="middle"
            fontFamily="'Arial Black', 'Impact', 'Montserrat', sans-serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="68"
            letterSpacing="-1.5"
            fill="#111827"
            opacity="0.75"
          >
            <tspan dx="-2">3Bros</tspan>
            <tspan dx="1">Motor</tspan>
          </text>

          {/* Main Chromatic Text Layer */}
          <text
            x="270"
            y="134"
            textAnchor="middle"
            fontFamily="'Arial Black', 'Impact', 'Montserrat', sans-serif"
            fontStyle="italic"
            fontWeight="900"
            fontSize="68"
            letterSpacing="-1.5"
          >
            {/* 3Bros in High-Definition Chrome */}
            <tspan 
              fill={`url(#${idPrefix}chromeText)`} 
              stroke={`url(#${idPrefix}chromeStroke)`}
              strokeWidth="1"
              dx="-2"
            >
              3Bros
            </tspan>

            {/* Motor in Glossy Racing Red */}
            <tspan 
              fill={`url(#${idPrefix}redText)`}
              stroke="#800000"
              strokeWidth="0.8"
              dx="1"
            >
              Motor
            </tspan>
          </text>
        </g>

        {/* ============================================================ */}
        {/* TAGLINE: "QUALITY CARS • BETTER JOURNEYS" */}
        {/* ============================================================ */}
        <g filter={`url(#${idPrefix}glow)`}>
          {/* Left Red Accent Line with angled tip */}
          <path
            d="M 28 160 L 76 160 L 71 164 L 23 164 Z"
            fill="#dc2626"
          />

          {/* Tagline Text in Pristine Tracked Caps */}
          <text
            x="270"
            y="163.5"
            textAnchor="middle"
            fontFamily="'Montserrat', 'Arial', sans-serif"
            fontWeight="800"
            fontSize="12.5"
            letterSpacing="5.5"
            fill={variant === 'light' ? '#1f2937' : '#ffffff'}
            stroke={variant === 'light' ? 'none' : '#000000'}
            strokeWidth={variant === 'light' ? '0' : '0.4'}
          >
            QUALITY CARS  •  BETTER JOURNEYS
          </text>

          {/* Right Red Accent Line with angled tip */}
          <path
            d="M 464 160 L 512 160 L 517 164 L 469 164 Z"
            fill="#dc2626"
          />
        </g>
      </svg>
    </div>
  );
}
