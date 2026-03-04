import type { Metadata, Viewport } from 'next';
import VendorPWAInstallPrompt from '@/components/VendorPWAInstallPrompt';

export const viewport: Viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Nosher Vendor Dashboard',
  description: 'Manage your shop orders, menu and payments instantly.',
  manifest: '/vendor-manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nosher Vendor',
  },
  icons: {
    apple: '/icons/icon-192x192.png',
    icon: '/icons/icon-192x192.png',
  },
};

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <head>
        <link rel="manifest" href="/vendor-manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nosher Vendor" />
        <meta name="theme-color" content="#f97316" />
      </head>
      {children}
      <VendorPWAInstallPrompt />
    </>
  );
}
