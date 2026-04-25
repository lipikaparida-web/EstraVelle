import React from 'react';

export default function Logo({ size = 40, className = "" }: { size?: number, className?: string }) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Crescent Moon */}
        <path d="M72 20C55.4315 20 42 33.4315 42 50C42 66.5685 55.4315 80 72 80C76.1608 80 80.122 79.1556 83.7126 77.6253C69.0118 77.6253 57.0094 65.2343 57.0094 49.9213C57.0094 34.6083 69.0118 22.2173 83.7126 22.2173C80.122 20.6869 76.1608 20 72 20Z" fill="url(#moon_grad)" />
        
        {/* Woman Profile (simplified silhouette) */}
        <path d="M62 38C65 38 68 40 68 45C68 48 66 50 67 53C68 56 71 58 71 62C71 67 67 70 63 70C59 70 55 68 53 64C51 60 52 56 55 52C54 48 56 42 62 38Z" fill="#3D1C34" opacity="0.7" />
        
        {/* Botanical Leaves at Bottom Left */}
        <g opacity="0.8">
          <path d="M35 80C28 72 32 65 40 68C38 60 45 55 52 62C48 55 58 50 65 58" stroke="#87A187" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="85" r="4" fill="#A4BFA4" />
          <circle cx="45" cy="90" r="3" fill="#A4BFA4" />
          <circle cx="25" cy="75" r="2.5" fill="#A4BFA4" />
        </g>

        {/* Stars at Top Right */}
        <path d="M85 15L86 18L89 19L86 20L85 23L84 20L81 19L84 18L85 15Z" fill="#D4AF37" />
        <path d="M92 25L93 27L95 28L93 29L92 31L91 29L89 28L91 27L92 25Z" fill="#D4AF37" scale="0.8" />
        <path d="M80 32L81 33L83 34L81 35L80 37L79 35L77 34L79 33L80 32Z" fill="#D4AF37" scale="0.6" />

        <defs>
          <linearGradient id="moon_grad" x1="42" y1="20" x2="83.7" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6C3A61" />
            <stop offset="1" stopColor="#3D1C34" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
