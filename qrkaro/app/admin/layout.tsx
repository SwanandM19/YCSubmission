// 'use client';

// import { useState } from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [showMenu, setShowMenu] = useState(false);

//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/admin' },
//     { id: 'vendors', label: 'Vendors', icon: '🏪', href: '/admin/vendors' },
//     { id: 'transactions', label: 'Transactions', icon: '💳', href: '/admin/transactions' },
//     // { id: 'earnings', label: 'Platform Earnings', icon: '💰', href: '/admin/earnings' },
//     { id: 'settings', label: 'Settings', icon: '⚙️', href: '/admin/settings' },
//   ];




//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b shadow-sm sticky top-0 z-50">
//         <div className="px-8">
//           <div className="flex justify-between items-center h-16">
            
//             {/* Left Logo */}
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">Q</span>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">Nosher Admin</h1>
//                 <p className="text-xs text-gray-500">Super Admin Portal</p>
//               </div>
//             </div>

//             {/* Right Section */}
//             <div className="flex items-center gap-4">
              
//               {/* Notification Bell */}
//               <button className="p-2 hover:bg-gray-100 rounded-lg relative">
//                 <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
//                 </svg>
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//               </button>

//               {/* Admin Profile + Logout */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowMenu(!showMenu)}
//                   className="flex items-center gap-3 hover:bg-gray-100 px-2 py-1 rounded-lg transition"
//                 >
//                   <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
//                     <span className="text-white font-bold">A</span>
//                   </div>
//                   <div className="text-left">
//                     <p className="text-sm font-semibold text-gray-900">Admin Nosher</p>
//                     <p className="text-xs text-gray-500">Super Admin</p>
//                   </div>
//                 </button>
//               </div>

//             </div>
//           </div>
//         </div>
//       </header>


//       <div className="flex">
//         {/* Sidebar */}
//         <aside className="w-64 bg-white border-r min-h-screen">
//           <nav className="p-4 space-y-1">
//             {menuItems.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.id}
//                   href={item.href}
//                   className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
//                     isActive
//                       ? 'bg-orange-50 text-orange-700 shadow-sm'
//                       : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                   }`}
//                 >
//                   <span className="text-xl">{item.icon}</span>
//                   <span>{item.label}</span>
//                 </Link>
//               );
//             })}
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', href: '/admin' },
    { id: 'vendors', label: 'Vendors', icon: '🏪', href: '/admin/vendors' },
    { id: 'transactions', label: 'Transactions', icon: '💳', href: '/admin/transactions' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/admin/settings' },
  ];

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Don't render layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.replace('/admin/login');
    } catch {
      router.replace('/admin/login');
    } finally {
      setLoggingOut(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left — Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Nosher Admin</h1>
                <p className="text-xs text-gray-500">Super Admin Portal</p>
              </div>
            </div>

            {/* Right — Actions */}
            <div className="flex items-center gap-3">

              {/* Notification Bell */}
              <button className="p-2 hover:bg-gray-100 rounded-lg relative transition">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Admin Profile Dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-3 hover:bg-gray-100 px-3 py-1.5 rounded-xl transition"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900">Admin Nosher</p>
                    <p className="text-xs text-gray-500">Super Admin</p>
                  </div>
                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${showMenu ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                    {/* Profile info */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">Admin Nosher</p>
                      <p className="text-xs text-gray-500 mt-0.5">Super Administrator</p>
                    </div>

                    {/* Menu links */}
                    <div className="p-2">
                      <Link
                        href="/admin/settings"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition text-sm text-gray-700"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </Link>

                      <Link
                        href="/admin/vendors"
                        onClick={() => setShowMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-xl transition text-sm text-gray-700"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Manage Vendors
                      </Link>
                    </div>

                    {/* Divider + Logout */}
                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 rounded-xl transition text-sm text-red-600 font-medium w-full disabled:opacity-60"
                      >
                        {loggingOut ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500" />
                            Logging out...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex">

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)] sticky top-16 self-start">
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 border border-orange-100 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition w-full disabled:opacity-60"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Nosher Admin v2.5
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
