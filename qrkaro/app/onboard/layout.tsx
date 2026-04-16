'use client';

import LanguageSelector from '@/components/LanguageSwitcher';

export default function OnboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <LanguageSelector />
    </>
  );
}