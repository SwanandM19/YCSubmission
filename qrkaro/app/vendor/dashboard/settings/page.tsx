// 'use client';

// import { useRouter } from 'next/navigation';
// import { useVendorAuth } from '@/lib/vendorAuthStore';
// import { useEffect, useState } from 'react';

// export default function VendorSettingsPage() {
//   const router = useRouter();
//   const { vendorId, shopName, logout, isAuthenticated } = useVendorAuth();
//   const [vendor, setVendor] = useState<any>(null);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       router.push('/vendor/login');
//       return;
//     }
//     if (vendorId) {
//       fetchVendor();
//     }
//   }, [isAuthenticated, vendorId]);

//   const fetchVendor = async () => {
//     try {
//       const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
//       const data = await response.json();
//       setVendor(data);
//     } catch (error) {
//       console.error('Error fetching vendor:', error);
//     }
//   };

//   const handleLogout = () => {
//     if (confirm('Are you sure you want to logout?')) {
//       logout();
//       router.push('/vendor/login');
//     }
//   };

//   const downloadQR = () => {
//     const qrUrl = `${window.location.origin}/v/${vendorId}`;
//     alert(`QR Code URL: ${qrUrl}\n\nIntegrate QR generation library to download image.`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Header */}
//       <header className="bg-white border-b sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center gap-3">
//             <button onClick={() => router.back()}>
//               <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//             </button>
//             <h1 className="text-xl font-bold text-gray-900">Settings</h1>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {/* Vendor Profile */}
//         <div className="bg-white rounded-2xl p-6 mb-6 text-center shadow-sm">
//           <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center relative">
//             <span className="text-white font-bold text-3xl">{shopName?.charAt(0) || 'Q'}</span>
//             <div className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center border-4 border-white">
//               <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-1">{shopName}</h2>
//           <p className="text-orange-600 font-semibold mb-1">Shop ID: {vendorId}</p>
//           <p className="text-gray-500 text-sm">Verified Vendor</p>
//         </div>

//         {/* Shop Management */}
//         <div className="mb-6">
//           <h3 className="text-sm font-bold text-gray-900 mb-3 px-2">Shop Management</h3>
//           <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//             <button 
//               onClick={() => router.push('/vendor/dashboard/settings/edit-shop')}
//               className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition border-b"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
//                   </svg>
//                 </div>
//                 <span className="font-semibold text-gray-900">Edit Shop Details</span>
//               </div>
//               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>

//             <button 
//               onClick={() => router.push('/vendor/dashboard/menu')}
//               className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition border-b"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//                   </svg>
//                 </div>
//                 <span className="font-semibold text-gray-900">Edit Menu/Services</span>
//               </div>
//               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>

//             <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//                 <span className="font-semibold text-gray-900">Razorpay Credentials</span>
//               </div>
//               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Assets & Support */}
//         <div className="mb-6">
//           <h3 className="text-sm font-bold text-gray-900 mb-3 px-2">Assets & Support</h3>
//           <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
//             <button
//               onClick={downloadQR}
//               className="w-full flex items-center justify-between p-4 hover:bg-orange-50 transition border-b"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
//                     <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
//                   </svg>
//                 </div>
//                 <span className="font-semibold text-gray-900">Download QR Code</span>
//               </div>
//               <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//               </svg>
//             </button>

//             <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
//                   <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
//                   </svg>
//                 </div>
//                 <span className="font-semibold text-gray-900">Support Contact</span>
//               </div>
//               <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Logout Button */}
//         <button
//           onClick={handleLogout}
//           className="w-full py-4 bg-white hover:bg-red-50 border-2 border-red-200 text-red-600 font-bold rounded-xl transition flex items-center justify-center gap-2 mb-4"
//         >
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//           </svg>
//           Logout
//         </button>

//         {/* Version */}
//         <p className="text-center text-sm text-gray-400">Version 2.4.1 (Stable)</p>
//       </div>

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex items-center justify-around py-3">
//             <button onClick={() => router.push('/vendor/dashboard')} className="flex flex-col items-center gap-1 text-gray-500">
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                 <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
//               </svg>
//               <span className="text-xs font-medium">Home</span>
//             </button>
            
//             <button onClick={() => router.push('/vendor/dashboard')} className="flex flex-col items-center gap-1 text-gray-500">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               <span className="text-xs font-medium">Orders</span>
//             </button>
            
//             <button 
//               onClick={() => router.push('/vendor/dashboard/menu')}
//               className="flex flex-col items-center gap-1 text-gray-500"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//               </svg>
//               <span className="text-xs font-medium">Menu</span>
//             </button>
            
//             <button className="flex flex-col items-center gap-1 text-orange-600">
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
//               </svg>
//               <span className="text-xs font-semibold">Settings</span>
//             </button>
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

'use client';

import { useRouter } from 'next/navigation';
import { useVendorAuthStore } from '@/lib/vendorAuthStore';
import { useEffect, useState } from 'react';

export default function VendorSettingsPage() {
  const router = useRouter();
  const { vendorId, shopName, logout, isAuthenticated } = useVendorAuthStore();

  const [hydrated, setHydrated] = useState(false);
  const [vendor, setVendor] = useState<any>(null);

  // ── Change Password State ────────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // ── Hydration guard ──────────────────────────────────────────────────────
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push('/vendor/login');
      return;
    }
    if (vendorId) fetchVendor();
  }, [hydrated, isAuthenticated, vendorId]);

  const fetchVendor = async () => {
    try {
      const res = await fetch(`/api/vendor?vendorId=${vendorId}`);
      const data = await res.json();
      setVendor(data);
    } catch (error) {
      console.error('Error fetching vendor:', error);
    }
  };
const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    logout();
    // ✅ Use replace so back button can't return to dashboard
    router.replace('/vendor/login');
  }
};


  const downloadQR = () => {
    if (!vendor?.qrCode) {
      alert('QR code not available.');
      return;
    }
    const link = document.createElement('a');
    link.href = vendor.qrCode;
    link.download = `${shopName || 'shop'}-qr.png`;
    link.click();
  };

  // ── Change Password Handler ──────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordMsg('');
    setPasswordError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword === vendorId) {
      setPasswordError('New password cannot be the same as your Vendor ID.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/vendor/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPasswordMsg('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ── Loading / SSR guard ──────────────────────────────────────────────────
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 pt-12 pb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-orange-100 text-sm mt-1">Manage your account & preferences</p>
      </div>

      <div className="px-4 py-6 space-y-4">

        {/* ── Vendor Profile Card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {shopName?.charAt(0)?.toUpperCase() || 'V'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-lg truncate">{shopName}</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">ID: {vendorId}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Verified Vendor
            </span>
          </div>
        </div>

        {/* ── Shop Management ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <p className="px-5 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Shop Management
          </p>

          <button
            onClick={() => router.push('/vendor/dashboard/settings/edit-shop')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Edit Shop Details</p>
                <p className="text-xs text-gray-500">Name, location, contact</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => router.push('/vendor/dashboard/menu')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Edit Menu / Services</p>
                <p className="text-xs text-gray-500">Add, edit or remove items</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* ── Change Password ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Security</p>
          </div>

          <div className="px-5 pb-5">
            {/* Vendor ID display */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <div>
                <p className="text-xs text-gray-500">Your Vendor ID (never changes)</p>
                <p className="text-xs font-mono text-gray-700 font-medium">{vendorId}</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Current Password */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Current Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Confirm New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* Show passwords toggle */}
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={() => setShowPasswords(!showPasswords)}
                  className="rounded accent-orange-500"
                />
                Show passwords
              </label>

              {/* Error / Success messages */}
              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {passwordError}
                </div>
              )}
              {passwordMsg && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {passwordMsg}
                </div>
              )}

              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition text-sm"
              >
                {isChangingPassword ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Changing...
                  </span>
                ) : '🔐 Change Password'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Assets & Support ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <p className="px-5 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Assets & Support
          </p>

          <button
            onClick={downloadQR}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Download QR Code</p>
                <p className="text-xs text-gray-500">Share with your customers</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          <a
            href="mailto:support@nosher.in"
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Support Contact</p>
                <p className="text-xs text-gray-500">support@nosher.in</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* ── Logout ──────────────────────────────────────────────────────── */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold rounded-2xl transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>

        <p className="text-center text-xs text-gray-400">Nosher v2.5.0</p>

      </div>

      {/* ── Bottom Navigation ────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around z-50">
        <button onClick={() => router.push('/vendor/dashboard')} className="flex flex-col items-center gap-1 text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => router.push('/vendor/dashboard')} className="flex flex-col items-center gap-1 text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs">Orders</span>
        </button>
        <button onClick={() => router.push('/vendor/dashboard/menu')} className="flex flex-col items-center gap-1 text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-xs">Menu</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-orange-500">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-semibold">Settings</span>
        </button>
      </div>
    </div>
  );
}
