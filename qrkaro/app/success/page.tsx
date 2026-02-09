// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';

// export default function SuccessPage() {
//   const searchParams = useSearchParams();
//   const vendorId = searchParams.get('vendorId');

//   const [vendorData, setVendorData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (vendorId) {
//       fetchVendorData();
//     }
//   }, [vendorId]);

//   const fetchVendorData = async () => {
//     try {
//       const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
//       const data = await response.json();
//       setVendorData(data);
//     } catch (error) {
//       console.error('Error fetching vendor data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadQR = () => {
//     if (vendorData?.qrCodeUrl) {
//       const link = document.createElement('a');
//       link.href = vendorData.qrCodeUrl;
//       link.download = `${vendorData.shopName}-QR.png`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     }
//   };

//   const openVendorApp = () => {
//   // Open vendor login page
//   const vendorLoginUrl = `${window.location.origin}/vendor/login`;
//   window.open(vendorLoginUrl, '_blank');
// };


//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Setting up your shop...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!vendorData) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-600">Error loading vendor data</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
//       {/* Decorative Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
//         <div className="absolute top-40 right-20 w-32 h-32 bg-orange-300 rounded-full opacity-20 animate-pulse delay-75"></div>
//         <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-orange-200 rounded-full opacity-20 animate-pulse delay-150"></div>
//       </div>

//       <div className="max-w-4xl mx-auto relative">
//         {/* Success Header */}
//         <div className="text-center mb-8">
//           <div className="inline-block mb-4">
//             <svg className="w-20 h-20 text-orange-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
//             </svg>
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Badhai Ho! Your shop is live.</h1>
//           <p className="text-lg text-gray-600">
//             Your unique QR code is ready. Display it at your counter to start accepting orders instantly.
//           </p>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
//           <div className="text-center mb-6">
//             <p className="text-sm text-orange-600 font-semibold uppercase tracking-wide mb-1">
//               Official Merchant
//             </p>
//             <h2 className="text-3xl font-bold text-gray-900">{vendorData.shopName}</h2>
//           </div>

//           {/* QR Code Display */}
//           <div className="flex justify-center mb-6">
//             <div className="relative inline-block">
//               <div className="border-4 border-dashed border-orange-200 rounded-2xl p-8 bg-gray-50">
//                 {vendorData.qrCodeUrl ? (
//                   <div className="relative">
//                     <img
//                       src={vendorData.qrCodeUrl}
//                       alt="QR Code"
//                       className="w-64 h-64 rounded-lg"
//                     />
//                     <button
//                       onClick={downloadQR}
//                       className="absolute -top-3 -right-3 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110"
//                       title="Download QR"
//                     >
//                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                       </svg>
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="w-64 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
//                     <p className="text-gray-500">QR Code not available</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Scan Instruction */}
//           <div className="text-center mb-8">
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full">
//               <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//               </svg>
//               <span className="text-sm font-medium text-orange-700">Scan to Order Online</span>
//             </div>
//           </div>

//           {/* Verification Badge */}
//           <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8">
//             <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//             </svg>
//             <span>Verified QRKaro Business Identity</span>
//           </div>

//           {/* Action Buttons */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Download QR Button */}
//             <button
//               onClick={downloadQR}
//               className="flex items-center justify-center gap-3 px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition transform hover:scale-105 shadow-lg"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//               </svg>
//               Download QR
//             </button>

//             {/* Get Vendor App Button */}
//             <button
//               onClick={openVendorApp}
//               className="flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-50 border-2 border-orange-500 text-orange-600 font-semibold rounded-xl transition transform hover:scale-105 shadow-lg"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
//               </svg>
//               Get Vendor App
//             </button>
//           </div>
//         </div>

//         {/* Info Cards */}
//         <div className="grid md:grid-cols-2 gap-4 mb-6">
//           {/* QR Code Info */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//             <div className="flex items-start gap-3">
//               <div className="bg-blue-500 rounded-lg p-2">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
//                 </svg>
//               </div>
//               <div className="flex-1">
//                 <p className="font-semibold text-blue-900 mb-1">Customer QR Code</p>
//                 <p className="text-sm text-blue-700">Print and display this QR at your counter. Customers scan to view menu and place orders.</p>
//               </div>
//             </div>
//           </div>

//           {/* Vendor App Info */}
//           <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
//             <div className="flex items-start gap-3">
//               <div className="bg-purple-500 rounded-lg p-2">
//                 <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//               <div className="flex-1">
//                 <p className="font-semibold text-purple-900 mb-1">Vendor Dashboard App</p>
//                 <p className="text-sm text-purple-700">Access your dashboard to manage incoming orders, update menu, and track earnings.</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Menu Synced Toast */}
//         <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 mb-6">
//           <div className="bg-green-500 rounded-full p-1">
//             <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div className="flex-1">
//             <p className="font-semibold text-green-900">Menu successfully synced</p>
//             <p className="text-sm text-green-700 mt-1">{vendorData.menuItems?.length || 0} items available</p>
//           </div>
//         </div>

//         {/* Support Link */}
//         <div className="text-center">
//           <p className="text-gray-600">
//             Need help setting up your store?{' '}
//             <a href="#" className="text-orange-600 hover:text-orange-700 font-medium underline">
//               Visit Support Center
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendorId');
  
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vendorId) {
      fetchVendor();
    }
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
      const data = await response.json();
      setVendor(data);
    } catch (error) {
      console.error('Error fetching vendor:', error);
    } finally {
      setLoading(false);
    }
  };

  const customerMenuUrl = `${window.location.origin}/v/${vendorId}`;
  const vendorDashboardUrl = `${window.location.origin}/vendor/login`;

  const downloadQR = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `Nosher-${vendorId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Vendor not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 Success!</h1>
          <p className="text-xl text-gray-600">
            Your shop is now live on Nosher
          </p>
        </div>

        {/* Shop Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold mb-3">
              OFFICIAL MERCHANT
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{vendor.shopName}</h2>
            <p className="text-gray-600 mt-1">{vendor.shopType} • {vendor.city}, {vendor.state}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-white border-4 border-dashed border-orange-300 rounded-2xl">
              <QRCodeSVG
                id="qr-code"
                value={customerMenuUrl}
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <button
              onClick={downloadQR}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download QR Code
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  ✓ Verified Nosher Business Identity
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Print this QR code and display it at your counter. Customers can scan it to view your menu and place orders.
                </p>
              </div>
            </div>
          </div>

          {/* Vendor ID */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Your Vendor ID</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-mono font-bold text-gray-900">{vendorId}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(vendorId!);
                  alert('Vendor ID copied!');
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Save this ID - you'll need it to log in to your vendor dashboard
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Customer Menu Link */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Customer QR Code</h3>
                <p className="text-sm text-gray-600">Scan to Order Online</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Print and display this QR at your counter. Customers can scan to see your menu and place orders.
            </p>
            <Link
              href={customerMenuUrl}
              target="_blank"
              className="block text-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
            >
              View Customer Menu
            </Link>
          </div>

          {/* Vendor Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Vendor Dashboard App</h3>
                <p className="text-sm text-gray-600">Manage Orders</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Access your dashboard to manage incoming orders, track payments, and update your menu.
            </p>
            <Link
              href={vendorDashboardUrl}
              className="block text-center px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition"
            >
              Open Vendor Dashboard
            </Link>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Payment Setup Complete</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">UPI ID: {vendor.upiId}</p>
                <p className="text-sm text-gray-600">You'll receive 95% of each order instantly</p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                <strong>How it works:</strong> Customer pays → You get 95% instantly to your UPI → Nosher keeps 5% platform fee
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Next Steps</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">Download & Print QR Code</p>
                <p className="text-sm text-gray-600">Click the download button above to save your QR code</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">Display QR at Counter</p>
                <p className="text-sm text-gray-600">Place it where customers can easily scan it</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">Login to Vendor Dashboard</p>
                <p className="text-sm text-gray-600">Use your Vendor ID to accept and manage orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}