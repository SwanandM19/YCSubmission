// 'use client';
// import { useEffect, useState } from 'react';

// export default function VendorPWAInstallPrompt() {
//   const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
//   const [showBanner, setShowBanner] = useState(false);
//   const [isIOS, setIsIOS] = useState(false);
//   const [isInstalled, setIsInstalled] = useState(false);

//   useEffect(() => {
//     // Don't show if already running as installed PWA
//     if (window.matchMedia('(display-mode: standalone)').matches) {
//       setIsInstalled(true);
//       return;
//     }

//     const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
//     setIsIOS(ios);

//     if (ios) {
//       const dismissed = localStorage.getItem('vendor-pwa-ios-dismissed');
//       if (!dismissed) setShowBanner(true);
//       return;
//     }

//     const handler = (e: any) => {
//       e.preventDefault();
//       setDeferredPrompt(e);
//       const dismissed = localStorage.getItem('vendor-pwa-dismissed');
//       if (!dismissed) setShowBanner(true);
//     };

//     window.addEventListener('beforeinstallprompt', handler);
//     return () => window.removeEventListener('beforeinstallprompt', handler);
//   }, []);

//   const handleInstall = async () => {
//     if (!deferredPrompt) return;
//     deferredPrompt.prompt();
//     const { outcome } = await deferredPrompt.userChoice;
//     if (outcome === 'accepted') {
//       setShowBanner(false);
//       setDeferredPrompt(null);
//     }
//   };

//   const handleDismiss = () => {
//     setShowBanner(false);
//     const key = isIOS ? 'vendor-pwa-ios-dismissed' : 'vendor-pwa-dismissed';
//     localStorage.setItem(key, '1');
//   };

//   if (!showBanner || isInstalled) return null;

//   return (
//     <div className="fixed bottom-0 left-0 right-0 z-50">
//       <div className="bg-white border-t-4 border-orange-500 shadow-2xl px-4 py-4">
//         <div className="max-w-lg mx-auto">

//           {/* Header row */}
//           <div className="flex items-center gap-3 mb-3">
//             <img
//               src="/icons/icon-72x72.png"
//               alt="Nosher Vendor"
//               className="w-14 h-14 rounded-2xl shadow border border-orange-100"
//             />
//             <div className="flex-1">
//               <p className="font-bold text-gray-900 text-base">Install Nosher Vendor App</p>
//               <p className="text-gray-500 text-xs mt-0.5">
//                 Manage orders & menu right from your home screen
//               </p>
//             </div>
//             <button
//               onClick={handleDismiss}
//               className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
//               aria-label="Close"
//             >
//               ×
//             </button>
//           </div>

//           {/* Feature pills */}
//           <div className="flex gap-2 mb-4">
//             {[
//               { icon: '⚡', text: 'Instant alerts' },
//               { icon: '📦', text: 'Live orders' },
//               { icon: '🔒', text: 'Works offline' },
//             ].map((f) => (
//               <div
//                 key={f.text}
//                 className="flex-1 flex flex-col items-center bg-orange-50 rounded-xl py-2 px-1"
//               >
//                 <span className="text-lg">{f.icon}</span>
//                 <span className="text-[10px] text-gray-600 font-medium mt-0.5 text-center">
//                   {f.text}
//                 </span>
//               </div>
//             ))}
//           </div>

//           {/* iOS guide OR Install button */}
//           {isIOS ? (
//             <div className="bg-orange-50 rounded-xl p-3 text-center">
//               <p className="text-xs text-gray-700 font-medium">
//                 Tap the <strong>Share</strong> button in Safari, then tap{' '}
//                 <strong>"Add to Home Screen"</strong>
//               </p>
//               <button
//                 onClick={handleDismiss}
//                 className="mt-2 text-xs text-orange-500 font-semibold underline"
//               >
//                 Got it, dismiss
//               </button>
//             </div>
//           ) : (
//             <div className="flex gap-2">
//               <button
//                 onClick={handleDismiss}
//                 className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition"
//               >
//                 Not now
//               </button>
//               <button
//                 onClick={handleInstall}
//                 className="w-2/3 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition shadow-md shadow-orange-200"
//               >
//                 📲 Install App
//               </button>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }


'use client';
import { useEffect, useState } from 'react';

export default function VendorPWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    const ios = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    setIsIOS(ios);
    if (ios) {
      const dismissed = localStorage.getItem('vendor-pwa-ios-dismissed');
      if (!dismissed) setShowBanner(true);
      return;
    }
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const dismissed = localStorage.getItem('vendor-pwa-dismissed');
      if (!dismissed) setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    const key = isIOS ? 'vendor-pwa-ios-dismissed' : 'vendor-pwa-dismissed';
    localStorage.setItem(key, '1');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Orange top accent line */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-orange-600" />

        <div className="p-4">

          {/* Header row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm shadow-orange-200 flex-shrink-0">
              <span className="text-white font-black text-xl">N</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight">Install Nosher Vendor</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">
                Manage orders from your home screen
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Feature pills */}
          <div className="flex gap-2 mb-4">
            {[
              { icon: '⚡', text: 'Instant alerts' },
              { icon: '📦', text: 'Live orders' },
              { icon: '🔒', text: 'Works offline' },
            ].map((f) => (
              <div
                key={f.text}
                className="flex-1 flex flex-col items-center bg-orange-50 border border-orange-100 rounded-xl py-2.5 px-1"
              >
                <span className="text-base">{f.icon}</span>
                <span className="text-[10px] text-gray-600 font-semibold mt-1 text-center leading-tight">
                  {f.text}
                </span>
              </div>
            ))}
          </div>

          {/* iOS guide OR Install button */}
          {isIOS ? (
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-700">
                Tap the <span className="font-bold text-orange-600">Share</span> button in Safari,
                then tap <span className="font-bold text-orange-600">"Add to Home Screen"</span>
              </p>
              <button
                onClick={handleDismiss}
                className="mt-2 text-xs text-orange-500 font-semibold hover:text-orange-600 transition"
              >
                Got it, dismiss
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-50 transition"
              >
                Not now
              </button>
              <button
                onClick={handleInstall}
                className="w-2/3 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition shadow-sm shadow-orange-200 flex items-center justify-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Install App
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}