'use client';

import Image from 'next/image';

interface BrandLoaderProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export default function BrandLoader({
  title = 'Loading...',
  subtitle = 'Please wait a moment',
  compact = false,
}: BrandLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${compact ? 'py-8' : 'min-h-screen px-4 bg-gradient-to-b from-orange-50 to-white'}`}>
      <div className="relative mb-6">
        <div className={`${compact ? 'w-20 h-20' : 'w-28 h-28'} rounded-3xl bg-white shadow-xl shadow-orange-100 border border-orange-100 flex items-center justify-center p-3`}>
          <Image
            src="/nosher-logo2.png"
            alt="Nosher"
            width={200}
            height={80}
            className="w-full h-full object-contain animate-pulse"
            priority
          />
        </div>
        <span className="absolute inset-0 rounded-3xl border-2 border-orange-300 animate-ping opacity-30" />
      </div>

      <h1 className={`${compact ? 'text-lg' : 'text-2xl'} font-black text-gray-900 text-center mb-2`}>
        {title}
      </h1>
      <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}