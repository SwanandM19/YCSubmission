
// 'use client';

// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useVendorAuthStore } from '@/lib/vendorAuthStore';

// export default function VendorDashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   useEffect(() => {
//     let sel: HTMLSelectElement | null = null;
//     const attachListener = (element: HTMLSelectElement) => {
//       element.addEventListener('change', () => {
//         window.dispatchEvent(new CustomEvent('gtLangChange', { detail: element.value }));
//         (window as any).__gtLang = element.value;
//       });
//     };
//     const observer = new MutationObserver(() => {
//       const found = document.querySelector('.goog-te-combo') as HTMLSelectElement;
//       if (found && found !== sel) { sel = found; attachListener(found); }
//     });
//     observer.observe(document.body, { childList: true, subtree: true });
//     const existing = document.querySelector('.goog-te-combo') as HTMLSelectElement;
//     if (existing) { sel = existing; attachListener(existing); }
//     return () => observer.disconnect();
//   }, []);

//   const pathname = usePathname();
//   const router = useRouter();
//   const [vendorName, setVendorName] = useState('');
//   const { shopName, shopType, logout } = useVendorAuthStore();

//   // ── NEW: dropdown states ──────────────────────────────
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   // Close both dropdowns on outside click
//   // useEffect(() => {
//   //   const handler = () => {
//   //     setShowNotifications(false);
//   //     setShowProfileMenu(false);
//   //   };
//   //   document.addEventListener('click', handler);
//   //   return () => document.removeEventListener('click', handler);
//   // }, []);
//   useEffect(() => {
//   const handler = (e: MouseEvent) => {
//     const target = e.target as HTMLElement;
//     if (!target.closest('[data-dropdown]')) {
//       setShowNotifications(false);
//       setShowProfileMenu(false);
//     }
//   };
//   document.addEventListener('mousedown', handler);
//   return () => document.removeEventListener('mousedown', handler);
// }, []);

//   useEffect(() => {
//     if (shopName) { setVendorName(shopName); return; }
//     const fetchVendor = async () => {
//       try {
//         const res = await fetch('/api/vendor/me');
//         const data = await res.json();
//         if (data?.shopName) setVendorName(data.shopName);
//       } catch {}
//     };
//     fetchVendor();
//   }, [shopName]);

//   const navItems = [
//     {
//       label: 'Orders',
//       href: '/vendor/dashboard',
//       icon: (active: boolean) => (
//         <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//       ),
//     },
//     {
//       label: 'Menu',
//       href: '/vendor/dashboard/menu',
//       icon: (active: boolean) => (
//         <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//         </svg>
//       ),
//     },
//     ...(shopType === 'Grocery Store' ? [{
//       label: 'Stock',
//       href: '/vendor/dashboard/inventory',
//       icon: (active: boolean) => (
//         <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
//         </svg>
//       ),
//     }] : []),
//     {
//       label: 'Sales',
//       href: '/vendor/dashboard/insights',
//       icon: (active: boolean) => (
//         <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//         </svg>
//       ),
//     },
//     {
//       label: 'Settings',
//       href: '/vendor/dashboard/settings',
//       icon: (active: boolean) => (
//         <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ),
//     },
//   ];

//   const isActive = (href: string) => {
//     if (href === '/vendor/dashboard') return pathname === '/vendor/dashboard';
//     return pathname.startsWith(href);
//   };

//   const initials = vendorName ? vendorName.slice(0, 2).toUpperCase() : 'VS';

//   const handleLogout = () => {
//     if (confirm('Are you sure you want to logout?')) {
//       logout();
//       router.replace('/vendor/login');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">

//       {/* ── Top Header ─────────────────────────────────────── */}
//       <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
//         <div className="px-4 h-16 flex items-center justify-between max-w-screen-xl mx-auto">

//           <div className="flex items-center gap-3">
//             {pathname !== '/vendor/dashboard' && (
//               <button
//                 onClick={() => router.back()}
//                 className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//             )}
//             <div className="flex items-center gap-2.5">
//               <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm shadow-orange-200">
//                 <span className="text-white font-black text-base">N</span>
//               </div>
//               <div>
//                 <p className="text-sm font-bold text-gray-900 leading-tight">{vendorName || 'Dashboard'}</p>
//                 <p className="text-xs text-gray-400 leading-tight">Vendor Portal</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {/* Live badge */}
//             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-100 rounded-full">
//               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
//               <span className="text-xs font-semibold text-green-700">Live</span>
//             </div>

//             {/* ── Bell Icon ─────────────────────────────────── */}
//             {/* <div className="relative" onClick={(e) => e.stopPropagation()}> */}
//             <div className="relative" data-dropdown onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
//               <button
//                 onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
//                 className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition relative"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                 </svg>
//                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
//               </button>

//               {showNotifications && (
//                 <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
//                   <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
//                     <p className="font-bold text-gray-900 text-sm">Notifications</p>
//                     <button
//                       onClick={() => setShowNotifications(false)}
//                       className="text-xs text-orange-500 font-semibold hover:text-orange-600"
//                     >
//                       Mark all read
//                     </button>
//                   </div>
//                   <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
//                     <div className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer">
//                       <div className="flex gap-3 items-start">
//                         <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <span className="text-sm">🛒</span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-gray-900">New order received!</p>
//                           <p className="text-xs text-gray-500 mt-0.5">Order #4521 — ₹320.00</p>
//                           <p className="text-xs text-gray-400 mt-1">2 mins ago</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer">
//                       <div className="flex gap-3 items-start">
//                         <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <span className="text-sm">✅</span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-gray-900">Order completed</p>
//                           <p className="text-xs text-gray-500 mt-0.5">Order #4520 marked as done</p>
//                           <p className="text-xs text-gray-400 mt-1">15 mins ago</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="px-4 py-10 text-center">
//                       <p className="text-xs text-gray-400">You're all caught up! 🎉</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* ── Profile Icon ───────────────────────────────── */}
//             <div className="relative" data-dropdown onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
//               <button
//                 onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
//                 className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm"
//               >
//                 <span className="text-white font-bold text-xs">{initials}</span>
//               </button>

//               {showProfileMenu && (
//                 <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
//                   <div className="px-4 py-3 border-b border-gray-100">
//                     <p className="font-bold text-gray-900 text-sm truncate">{vendorName}</p>
//                     <p className="text-xs text-gray-400 mt-0.5">Vendor Account</p>
//                   </div>
//                   <div className="py-1">
//                     <button
//                       onClick={() => { router.push('/vendor/dashboard/settings'); setShowProfileMenu(false); }}
//                       className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
//                     >
//                       <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                       Settings
//                     </button>
//                     <button
//                       onClick={() => { router.push('/vendor/dashboard/settings/edit-shop'); setShowProfileMenu(false); }}
//                       className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
//                     >
//                       <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                       </svg>
//                       Edit Shop
//                     </button>
//                     <div className="border-t border-gray-100 mt-1 pt-1">
//                       <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-sm text-red-500"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                         </svg>
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </header>

//       {/* ── Main Content ───────────────────────────────────── */}
//       <main className="flex-1 pb-28 min-w-0 max-w-screen-xl mx-auto w-full">
//         {children}
//       </main>

//       {/* ── Bottom Navigation ──────────────────────────────── */}
//       <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-5">
//         <nav className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 px-2 py-2">
//           <div className="flex items-center justify-around">
//             {navItems.map((item) => {
//               const active = isActive(item.href);
//               return (
//                 <button
//                   key={item.label}
//                   onClick={() => router.push(item.href)}
//                   className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
//                     active
//                       ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
//                       : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span className={`transition-transform ${active ? 'scale-110' : ''}`}>
//                     {item.icon(active)}
//                   </span>
//                   <span className={`text-xs font-semibold leading-none ${active ? 'text-white' : ''}`}>
//                     {item.label}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </nav>
//       </div>

//     </div>
//   );
// }





// 'use client';

// import { usePathname, useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { useVendorAuthStore } from '@/lib/vendorAuthStore';

// export default function VendorDashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   useEffect(() => {
//     let sel: HTMLSelectElement | null = null;
//     const attachListener = (element: HTMLSelectElement) => {
//       element.addEventListener('change', () => {
//         window.dispatchEvent(new CustomEvent('gtLangChange', { detail: element.value }));
//         (window as any).__gtLang = element.value;
//       });
//     };
//     const observer = new MutationObserver(() => {
//       const found = document.querySelector('.goog-te-combo') as HTMLSelectElement;
//       if (found && found !== sel) { sel = found; attachListener(found); }
//     });
//     observer.observe(document.body, { childList: true, subtree: true });
//     const existing = document.querySelector('.goog-te-combo') as HTMLSelectElement;
//     if (existing) { sel = existing; attachListener(existing); }
//     return () => observer.disconnect();
//   }, []);

//   const pathname = usePathname();
//   const router = useRouter();
//   const [vendorName, setVendorName] = useState('');
//   const { shopName, shopType, logout } = useVendorAuthStore();

//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       const target = e.target as HTMLElement;
//       if (!target.closest('[data-dropdown]')) {
//         setShowNotifications(false);
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   useEffect(() => {
//     if (shopName) { setVendorName(shopName); return; }
//     const fetchVendor = async () => {
//       try {
//         const res = await fetch('/api/vendor/me');
//         const data = await res.json();
//         if (data?.shopName) setVendorName(data.shopName);
//       } catch {}
//     };
//     fetchVendor();
//   }, [shopName]);

//   const navItems = [
//     {
//       label: 'Orders',
//       href: '/vendor/dashboard',
//       icon: (active: boolean) => (
//         <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//       ),
//     },
//     ...(shopType !== 'Xerox Shop' && shopType !== 'Grocery Store' ? [{
//   label: 'Menu',
//   href: '/vendor/dashboard/menu',
//   icon: (active: boolean) => (
//     <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//     </svg>
//   ),
// }] : []),

//     // ── Grocery Store only ──
//     ...(shopType === 'Grocery Store' ? [{
//       label: 'Stock',
//       href: '/vendor/dashboard/inventory',
//       icon: (active: boolean) => (
//         <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
//         </svg>
//       ),
//     }] : []),

//     // ── Xerox Shop only ──
//     ...(shopType === 'Xerox Shop' ? [{
//       label: 'Print Jobs',
//       href: '/vendor/dashboard/print-jobs',
//       icon: (active: boolean) => (
//         <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//         </svg>
//       ),
//     }] : []),

//     {
//       label: 'Sales',
//       href: '/vendor/dashboard/insights',
//       icon: (active: boolean) => (
//         <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//         </svg>
//       ),
//     },
//     {
//       label: 'Settings',
//       href: '/vendor/dashboard/settings',
//       icon: (active: boolean) => (
//         <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ),
//     },
//   ];

//   const isActive = (href: string) => {
//     if (href === '/vendor/dashboard') return pathname === '/vendor/dashboard';
//     return pathname.startsWith(href);
//   };

//   const initials = vendorName ? vendorName.slice(0, 2).toUpperCase() : 'VS';

//   const handleLogout = () => {
//     if (confirm('Are you sure you want to logout?')) {
//       logout();
//       router.replace('/vendor/login');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">

//       {/* ── Top Header ─────────────────────────────────────── */}
//       <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
//         <div className="px-4 h-16 flex items-center justify-between max-w-screen-xl mx-auto">

//           <div className="flex items-center gap-3">
//             {pathname !== '/vendor/dashboard' && (
//               <button
//                 onClick={() => router.back()}
//                 className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </button>
//             )}
//             <div className="flex items-center gap-2.5">
//               <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm shadow-orange-200">
//                 <span className="text-white font-black text-base">N</span>
//               </div>
//               <div>
//                 <p className="text-sm font-bold text-gray-900 leading-tight">{vendorName || 'Dashboard'}</p>
//                 <p className="text-xs text-gray-400 leading-tight">Vendor Portal</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center gap-2">

//             {/* Live badge */}
//             <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-100 rounded-full">
//               <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
//               <span className="text-xs font-semibold text-green-700">Live</span>
//             </div>

//             {/* ── Bell Icon ─────────────────────────────────── */}
//             <div className="relative" data-dropdown onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
//               <button
//                 onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
//                 className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition relative"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                 </svg>
//                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
//               </button>

//               {showNotifications && (
//                 <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
//                   <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
//                     <p className="font-bold text-gray-900 text-sm">Notifications</p>
//                     <button
//                       onClick={() => setShowNotifications(false)}
//                       className="text-xs text-orange-500 font-semibold hover:text-orange-600"
//                     >
//                       Mark all read
//                     </button>
//                   </div>
//                   <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
//                     <div className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer">
//                       <div className="flex gap-3 items-start">
//                         <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <span className="text-sm">🛒</span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-gray-900">New order received!</p>
//                           <p className="text-xs text-gray-500 mt-0.5">Order #4521 — ₹320.00</p>
//                           <p className="text-xs text-gray-400 mt-1">2 mins ago</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer">
//                       <div className="flex gap-3 items-start">
//                         <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
//                           <span className="text-sm">✅</span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-semibold text-gray-900">Order completed</p>
//                           <p className="text-xs text-gray-500 mt-0.5">Order #4520 marked as done</p>
//                           <p className="text-xs text-gray-400 mt-1">15 mins ago</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="px-4 py-10 text-center">
//                       <p className="text-xs text-gray-400">You're all caught up! 🎉</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* ── Profile Icon ───────────────────────────────── */}
//             <div className="relative" data-dropdown onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
//               <button
//                 onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
//                 className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm"
//               >
//                 <span className="text-white font-bold text-xs">{initials}</span>
//               </button>

//               {showProfileMenu && (
//                 <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
//                   <div className="px-4 py-3 border-b border-gray-100">
//                     <p className="font-bold text-gray-900 text-sm truncate">{vendorName}</p>
//                     <p className="text-xs text-gray-400 mt-0.5">Vendor Account</p>
//                   </div>
//                   <div className="py-1">
//                     <button
//                       onClick={() => { router.push('/vendor/dashboard/settings'); setShowProfileMenu(false); }}
//                       className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
//                     >
//                       <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       </svg>
//                       Settings
//                     </button>
//                     <button
//                       onClick={() => { router.push('/vendor/dashboard/settings/edit-shop'); setShowProfileMenu(false); }}
//                       className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
//                     >
//                       <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                       </svg>
//                       Edit Shop
//                     </button>

//                     {/* ── Xerox Shop extra link ── */}
//                     {shopType === 'Xerox Shop' && (
//                       <button
//                         onClick={() => { router.push('/vendor/dashboard/settings/xerox'); setShowProfileMenu(false); }}
//                         className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
//                       >
//                         <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
//                         </svg>
//                         Print Pricing
//                       </button>
//                     )}

//                     <div className="border-t border-gray-100 mt-1 pt-1">
//                       <button
//                         onClick={handleLogout}
//                         className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-sm text-red-500"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                         </svg>
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>
//       </header>

//       {/* ── Main Content ───────────────────────────────────── */}
//       <main className="flex-1 pb-28 min-w-0 max-w-screen-xl mx-auto w-full">
//         {children}
//       </main>

//       {/* ── Bottom Navigation ──────────────────────────────── */}
//       <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-5">
//         <nav className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 px-2 py-2">
//           <div className="flex items-center justify-around">
//             {navItems.map((item) => {
//               const active = isActive(item.href);
//               return (
//                 <button
//                   key={item.label}
//                   onClick={() => router.push(item.href)}
//                   className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
//                     active
//                       ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
//                       : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <span className={`transition-transform ${active ? 'scale-110' : ''}`}>
//                     {item.icon(active)}
//                   </span>
//                   <span className={`text-xs font-semibold leading-none ${active ? 'text-white' : ''}`}>
//                     {item.label}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </nav>
//       </div>

//     </div>
//   );
// }


'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useVendorAuthStore } from '@/lib/vendorAuthStore';

export default function VendorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let sel: HTMLSelectElement | null = null;
    const attachListener = (element: HTMLSelectElement) => {
      element.addEventListener('change', () => {
        window.dispatchEvent(new CustomEvent('gtLangChange', { detail: element.value }));
        (window as any).__gtLang = element.value;
      });
    };
    const observer = new MutationObserver(() => {
      const found = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (found && found !== sel) { sel = found; attachListener(found); }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const existing = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (existing) { sel = existing; attachListener(existing); }
    return () => observer.disconnect();
  }, []);

  const pathname = usePathname();
  const router = useRouter();
  const [vendorName, setVendorName] = useState('');
  const { shopName, shopType, logout } = useVendorAuthStore();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ✅ Each vendor type has its own "home" route
  const homeRoute =
    shopType === 'Xerox Shop' ? '/vendor/dashboard/print-jobs' : '/vendor/dashboard';

  // ✅ Hide back button on the vendor's home screen
  const isHomePage = pathname === homeRoute;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (shopName) { setVendorName(shopName); return; }
    const fetchVendor = async () => {
      try {
        const res = await fetch('/api/vendor/me');
        const data = await res.json();
        if (data?.shopName) setVendorName(data.shopName);
      } catch {}
    };
    fetchVendor();
  }, [shopName]);

  const navItems = [
    // ✅ Orders tab — hidden for Xerox vendors
    ...(shopType !== 'Xerox Shop' ? [{
      label: 'Orders',
      href: '/vendor/dashboard',
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    }] : []),

    // Menu — food vendors only
    ...(shopType !== 'Xerox Shop' && shopType !== 'Grocery Store' ? [{
      label: 'Menu',
      href: '/vendor/dashboard/menu',
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    }] : []),

    // Stock — Grocery only
    ...(shopType === 'Grocery Store' ? [{
      label: 'Stock',
      href: '/vendor/dashboard/inventory',
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
        </svg>
      ),
    }] : []),

    // Print Jobs — Xerox only
    ...(shopType === 'Xerox Shop' ? [{
      label: 'Print Jobs',
      href: '/vendor/dashboard/print-jobs',
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      ),
    }] : []),

    {
      label: 'Sales',
      href: '/vendor/dashboard/insights',
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      href: '/vendor/dashboard/settings',
      icon: (active: boolean) => (
        <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const isActive = (href: string) => {
    if (href === '/vendor/dashboard') return pathname === '/vendor/dashboard';
    return pathname.startsWith(href);
  };

  const initials = vendorName ? vendorName.slice(0, 2).toUpperCase() : 'VS';

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      router.replace('/vendor/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top Header ─────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="px-4 h-16 flex items-center justify-between max-w-screen-xl mx-auto">

          <div className="flex items-center gap-3">
            {/* ✅ Back button only when NOT on home page */}
            {!isHomePage && (
              <button
                onClick={() => router.back()}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm shadow-orange-200">
                <span className="text-white font-black text-base">N</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{vendorName || 'Dashboard'}</p>
                {/* ✅ Contextual subtitle based on shop type */}
                <p className="text-xs text-gray-400 leading-tight">
                  {shopType === 'Xerox Shop' ? 'Print Portal' : 'Vendor Portal'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-100 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-green-700">Live</span>
            </div>

            {/* Bell */}
            <div className="relative" data-dropdown onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-400 transition relative"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">Notifications</p>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-orange-500 font-semibold hover:text-orange-600">
                      Mark all read
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer">
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm">🖨️</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">New print job received!</p>
                          <p className="text-xs text-gray-500 mt-0.5">Job #4521 — ₹45.00</p>
                          <p className="text-xs text-gray-400 mt-1">2 mins ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 transition cursor-pointer">
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm">✅</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Job completed</p>
                          <p className="text-xs text-gray-500 mt-0.5">Job #4520 marked as done</p>
                          <p className="text-xs text-gray-400 mt-1">15 mins ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-10 text-center">
                      <p className="text-xs text-gray-400">You're all caught up! 🎉</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" data-dropdown onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
              <button
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-sm"
              >
                <span className="text-white font-bold text-xs">{initials}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-sm truncate">{vendorName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {shopType === 'Xerox Shop' ? 'Print Vendor' : 'Vendor Account'}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => { router.push('/vendor/dashboard/settings'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </button>
                    <button
                      onClick={() => { router.push('/vendor/dashboard/settings/edit-shop'); setShowProfileMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Edit Shop
                    </button>

                    {shopType === 'Xerox Shop' && (
                      <button
                        onClick={() => { router.push('/vendor/dashboard/settings/xerox'); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-sm text-gray-700"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Print Pricing
                      </button>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 transition text-sm text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="flex-1 pb-28 min-w-0 max-w-screen-xl mx-auto w-full">
        {children}
      </main>

      {/* ── Bottom Navigation ──────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-5">
        <nav className="max-w-md mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 px-2 py-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
                    active
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`transition-transform ${active ? 'scale-110' : ''}`}>
                    {item.icon(active)}
                  </span>
                  <span className={`text-xs font-semibold leading-none ${active ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

    </div>
  );
}