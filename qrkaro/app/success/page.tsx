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
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (vendorId) fetchVendor();
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const customerMenuUrl = vendor?.shopType === 'Xerox Shop'
    ? `${baseUrl}/x/${vendorId}`
    : `${baseUrl}/v/${vendorId}`;
  const vendorDashboardUrl = `${baseUrl}/vendor/login`;

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

  const handleCopyId = () => {
    navigator.clipboard.writeText(vendorId!);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <p className="text-xl text-gray-600">Vendor not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* ── HERO ── */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-5 shadow-lg shadow-green-200">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="inline-block px-4 py-1 bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-widest rounded-full mb-4">
            Official Nosher Merchant
          </span>
          <h1 className="text-4xl font-black text-gray-900 mb-2">🎉 Your Shop is Live!</h1>
          <p className="text-lg text-gray-500">
            <span className="text-orange-500 font-bold">{vendor.shopName}</span> is ready to take orders on Nosher
          </p>
          <p className="text-sm text-gray-400 mt-1">{vendor.shopType} · {vendor.city}, {vendor.state}</p>
        </div>

        {/* ── SECTION 1: SAVE VENDOR ID ── */}
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 overflow-hidden">
          <div className="bg-orange-500 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-sm">1</div>
            <div>
              <h2 className="text-white font-black text-lg">Save Your Vendor ID</h2>
              <p className="text-orange-100 text-xs font-medium">You need this every time you log in</p>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-2xl p-6 text-center mb-4">
              <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">Your Vendor ID</p>
              <p className="text-xl font-mono font-black text-gray-900 break-all mb-4">{vendorId}</p>
              <button
                onClick={handleCopyId}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  copiedId ? 'bg-green-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                {copiedId ? (
                  <><span>✓</span> Copied!</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy ID</>
                )}
              </button>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>Important:</strong> Screenshot this page or save this ID in your phone notes. You will need it every time you open the vendor dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: QR CODE ── */}
        <div className="bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="bg-blue-500 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-sm">2</div>
            <div>
              <h2 className="text-white font-black text-lg">Download & Print Your QR Code</h2>
              <p className="text-blue-100 text-xs font-medium">Display this at your counter — customers scan to order</p>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="p-6 bg-gradient-to-br from-orange-50 to-white border-4 border-dashed border-orange-300 rounded-3xl mb-5">
                <QRCodeSVG
                  id="qr-code"
                  value={customerMenuUrl}
                  size={220}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <button
                onClick={downloadQR}
                className="inline-flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl transition shadow-lg shadow-blue-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download QR Code
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-blue-800">
                ✅ <strong>Verified Nosher Business</strong> — When customers scan this QR, they land directly on your {vendor.shopType === 'Xerox Shop' ? 'print order page' : 'menu page'} on their phone and can order instantly.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Customer Link</p>
              <p className="text-sm font-mono text-gray-600 break-all">{customerMenuUrl}</p>
              <Link href={customerMenuUrl} target="_blank" className="inline-block mt-2 text-sm text-blue-500 font-semibold hover:underline">
                Preview your page →
              </Link>
            </div>
          </div>
        </div>

        {/* ── SECTION 3: HOW IT WORKS ── */}
        <div className="bg-white rounded-3xl shadow-lg border border-purple-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-sm">3</div>
            <div>
              <h2 className="text-white font-black text-lg">How the Ordering Flow Works</h2>
              <p className="text-purple-100 text-xs font-medium">Understand the full customer → you journey</p>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">

              {/* Step A */}
              <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📱</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Customer scans your QR</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    They open the camera on their mobile, scan the QR you placed at your counter, and your {vendor.shopType === 'Xerox Shop' ? 'print order page' : 'menu'} opens instantly — no app download needed.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>

              {/* Step B */}
              <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🛒</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">They browse and add to cart</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Customer browses your {vendor.shopType === 'Xerox Shop' ? 'print options, uploads their document, selects pages and colour type' : 'menu, picks items, adjusts quantity'} and adds everything to the cart — all on their phone.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>

              {/* Step C */}
              <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">💳</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Customer pays online</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    They tap Pay and complete the payment via UPI, card, or netbanking through Razorpay. The full payment amount goes directly and instantly to your UPI ID <strong className="text-gray-700">{vendor.upiId}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>

              {/* Step D */}
              <div className="flex gap-4 items-start bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🔔</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">You get notified instantly</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    The moment payment is done, your vendor dashboard gets a real-time notification and the new order appears automatically. You will also get a push notification on your device.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>

              {/* Step E */}
              <div className="flex gap-4 items-start bg-gray-50 rounded-2xl p-4">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✅</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">You accept and prepare the order</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    On your dashboard, tap <strong className="text-gray-700">Accept</strong> to confirm. Prepare the order. When it's ready, tap <strong className="text-gray-700">Mark as Ready</strong>.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>

              {/* Step F */}
              <div className="flex gap-4 items-start bg-green-50 rounded-2xl p-4 border border-green-100">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🎯</div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Customer gets notified to pick up</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    As soon as you mark ready, the customer gets a notification on their phone that their order is ready for pickup. They come to your counter and collect it. Done!
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── SECTION 4: PAYMENT SETUP ── */}
        <div className="bg-white rounded-3xl shadow-lg border border-green-100 overflow-hidden">
          <div className="bg-green-500 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-sm">4</div>
            <div>
              <h2 className="text-white font-black text-lg">Payment Setup</h2>
              <p className="text-green-100 text-xs font-medium">100% of every payment goes to you</p>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-green-900">UPI Linked: {vendor.upiId}</p>
                  <p className="text-sm text-green-700">Every rupee the customer pays lands here</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-800">
                💡 <strong>Example:</strong> Customer pays ₹200 → ₹200 goes instantly and directly to your UPI <strong>{vendor.upiId}</strong>. No delays, no deductions.
              </p>
            </div>
          </div>
        </div>

        {/* ── SECTION 5: GO LIVE ── */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-black text-sm">5</div>
            <div>
              <h2 className="text-white font-black text-lg">Open Your Dashboard</h2>
              <p className="text-orange-100 text-xs font-medium">You're ready — start accepting orders</p>
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-2.5">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Everything is ready ✓</p>
              {[
                `Vendor ID saved — ${vendorId?.slice(0, 8)}...`,
                'QR code downloaded and ready to print',
                `UPI ${vendor.upiId} linked for instant payments`,
                'Dashboard ready to receive live orders',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">✓</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            <Link
              href={vendorDashboardUrl}
              className="flex items-center justify-center gap-2 w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-lg rounded-2xl transition shadow-2xl shadow-orange-200 mb-3"
            >
              🚀 Open Vendor Dashboard
            </Link>

            <Link
              href={customerMenuUrl}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-4 border-2 border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition text-sm"
            >
              👀 Preview Customer Page
            </Link>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="text-center pb-8">
          <p className="text-xs text-gray-400 font-medium">
            Need help? Contact us at <span className="text-orange-500 font-bold">support@nosher.in</span>
          </p>
          <p className="text-xs text-gray-300 mt-1">© 2026 Nosher · Digitalising India's local businesses</p>
        </div>

      </div>
    </div>
  );
}