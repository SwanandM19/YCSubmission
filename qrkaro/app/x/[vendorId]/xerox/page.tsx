'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Upload, FileText, X, ChevronDown, ChevronUp,
  Printer, User, Phone, AlertCircle,
} from 'lucide-react';

interface VendorData {
  shopName: string;
  shopType: string;
  city: string;
  rating?: string;
  bwPrice?: number;
  colorPrice?: number;
  grayscalePrice?: number;
}

interface PrintSettings {
  colorMode: 'bw' | 'color' | 'grayscale';
  paperSize: 'A4' | 'A3' | 'Legal' | 'Letter';
  orientation: 'portrait' | 'landscape';
  pageRange: string;
  copies: number;
  doubleSided: boolean;
  printQuality: 'draft' | 'normal' | 'high';
  stapling: boolean;
  binding: boolean;
  specialInstructions: string;
}

const DEFAULT_PRICES = { bw: 2, color: 10, grayscale: 4 };
const PAPER_MULTIPLIER: Record<string, number> = { A4: 1, A3: 2, Legal: 1.2, Letter: 1 };

export default function XeroxCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.vendorId as string;

  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loadingVendor, setLoadingVendor] = useState(true);

  // File state
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [settings, setSettings] = useState<PrintSettings>({
    colorMode: 'bw',
    paperSize: 'A4',
    orientation: 'portrait',
    pageRange: 'all',
    copies: 1,
    doubleSided: false,
    printQuality: 'normal',
    stapling: false,
    binding: false,
    specialInstructions: '',
  });

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Collapsible sections
  const [open, setOpen] = useState({
    colorQuality: true,
    paperLayout: true,
    copies: true,
    finishing: false,
    instructions: false,
  });

  useEffect(() => {
    fetchVendor();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [vendorId]);

  const fetchVendor = async () => {
    try {
      const res = await fetch(`/api/vendor?vendorId=${vendorId}`);
      const data = await res.json();
      setVendor(data);
    } catch {}
    finally { setLoadingVendor(false); }
  };

  const pricing = {
    bw:        vendor?.bwPrice        || DEFAULT_PRICES.bw,
    color:     vendor?.colorPrice     || DEFAULT_PRICES.color,
    grayscale: vendor?.grayscalePrice || DEFAULT_PRICES.grayscale,
  };

  // Parse custom page range → effective page count
  const effectivePageCount = useCallback((): number => {
    if (!pageCount) return 0;
    if (settings.pageRange === 'all' || !settings.pageRange.trim()) return pageCount;
    try {
      let count = 0;
      for (const part of settings.pageRange.split(',').map(s => s.trim())) {
        if (part.includes('-')) {
          const [s, e] = part.split('-').map(Number);
          if (!isNaN(s) && !isNaN(e) && s >= 1 && e <= pageCount && s <= e)
            count += e - s + 1;
        } else {
          const p = Number(part);
          if (!isNaN(p) && p >= 1 && p <= pageCount) count++;
        }
      }
      return count > 0 ? count : pageCount;
    } catch { return pageCount; }
  }, [pageCount, settings.pageRange]);

  const calcTotal = useCallback((): number => {
    const pages = effectivePageCount();
    if (!pages) return 0;
    const basePerPage = settings.colorMode === 'color'
      ? pricing.color
      : settings.colorMode === 'grayscale'
        ? pricing.grayscale
        : pricing.bw;
    const qualityExtra = settings.colorMode === 'color' && settings.printQuality === 'high' ? 2 : 0;
    const sizeMulti = PAPER_MULTIPLIER[settings.paperSize] || 1;
    const doublesideDiscount = settings.doubleSided ? 0.85 : 1;
    let total = pages * (basePerPage + qualityExtra) * sizeMulti * doublesideDiscount * settings.copies;
    if (settings.stapling) total += 5;
    if (settings.binding) total += 20;
    return Math.ceil(total);
  }, [settings, pricing, effectivePageCount]);

  const totalAmount = calcTotal();
  const effPages    = effectivePageCount();

  const set = <K extends keyof PrintSettings>(key: K, val: PrintSettings[K]) =>
    setSettings(prev => ({ ...prev, [key]: val }));

  const toggle = (k: keyof typeof open) => setOpen(prev => ({ ...prev, [k]: !prev[k] }));

  // File upload
  const handleFileSelect = async (f: File) => {
    if (!f.type.includes('pdf')) { setUploadError('Only PDF files are supported.'); return; }
    if (f.size > 20 * 1024 * 1024) { setUploadError('File must be under 20MB.'); return; }
    setUploadError('');
    setUploading(true);
    setUploadProgress(20);
    try {
      const fd = new FormData();
      fd.append('file', f);
      setUploadProgress(50);
      const res = await fetch('/api/xerox/file', { method: 'POST', body: fd });
      setUploadProgress(85);
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'Upload failed'); }
      const data = await res.json();
      setFileUrl(data.fileUrl);
      setFileName(data.fileName || f.name);
      setPageCount(data.pageCount || 1);
      setUploadProgress(100);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.');
      setUploadProgress(0);
    } finally { setUploading(false); }
  };

  const clearFile = () => {
    setFileUrl(''); setFileName(''); setPageCount(0); setUploadProgress(0); setUploadError('');
  };

  // Submit → Razorpay
  const handleSubmit = async () => {
    if (!fileUrl || !customerName.trim() || customerPhone.trim().length < 10) return;
    setSubmitting(true);
    try {
      // 1. Create print job
      const jobRes = await fetch('/api/xerox/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          fileUrl, fileName, pageCount,
          printType: settings.colorMode === 'color' ? 'color' : 'bw', // ← vendor display compat
          colorMode:   settings.colorMode,
          copies:      settings.copies,
          doubleSided: settings.doubleSided,
          paperSize:   settings.paperSize,
          orientation: settings.orientation,
          pageRange:   settings.pageRange || 'all',
          printQuality: settings.printQuality,
          stapling:    settings.stapling,
          binding:     settings.binding,
          specialInstructions: settings.specialInstructions,
          totalAmount,
          paymentStatus: 'pending',
          printStatus:   'queued',
        }),
      });
      const job = await jobRes.json();
      if (!jobRes.ok) throw new Error(job.error || 'Failed to create job');

      // 2. Create Razorpay order
      const orderRes = await fetch('/api/xerox/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job._id, amount: totalAmount }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Payment init failed');

      // 3. Open Razorpay checkout
      const rzp = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: 'INR',
        name: vendor?.shopName || 'Nosher Print',
        description: `Print Job — ${fileName}`,
        order_id: orderData.razorpayOrderId,
        prefill: { name: customerName, contact: customerPhone },
        theme: { color: '#FF5A00' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/xerox/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobId: job._id,
              razorpayOrderId:  response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            router.replace(`/x/${vendorId}/xerox-success?jobId=${job._id}`);
          } else {
            alert('Payment verification failed. Please contact the shop.');
            setSubmitting(false);
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      });
      rzp.open();
    } catch (err: any) {
      alert(err.message || 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  const canSubmit = !!fileUrl && !!customerName.trim() && customerPhone.trim().length === 10 && totalAmount > 0;

  if (loadingVendor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF5A00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-36 font-sans">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF5A00] rounded-lg flex items-center justify-center shadow-lg shadow-orange-200">
            <span className="text-white font-black text-sm italic">N</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{vendor?.shopName || 'Print Shop'}</p>
            <p className="text-xs text-gray-400">{vendor?.city} · Printing Services</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-100 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-green-700">Open</span>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-4">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">Print Your Document</h1>
          <p className="text-sm text-gray-400 mt-0.5">Upload · Configure · Pay · Collect</p>
        </div>

        {/* ── 1. File Upload ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-2">
            <FileText size={15} className="text-[#FF5A00]" />
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Upload File</h2>
          </div>
          <div className="p-4">
            {!fileUrl ? (
              <div
                onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]); }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => !uploading && fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center cursor-pointer hover:border-[#FF5A00] hover:bg-orange-50/30 transition-all group"
              >
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-100 transition-colors">
                  <Upload size={24} className="text-[#FF5A00]" />
                </div>
                <p className="text-sm font-bold text-gray-700 mb-1">
                  {uploading ? 'Uploading...' : 'Tap to upload PDF'}
                </p>
                <p className="text-xs text-gray-400">PDF only · Max 20MB</p>
                {uploading && (
                  <div className="mt-4">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF5A00] rounded-full transition-all duration-500" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{uploadProgress}%</p>
                  </div>
                )}
                {uploadError && (
                  <div className="mt-3 flex items-center gap-2 text-red-500 bg-red-50 rounded-xl px-3 py-2">
                    <AlertCircle size={14} />
                    <p className="text-xs font-medium">{uploadError}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={22} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{fileName}</p>
                  <p className="text-xs text-green-600 font-medium">{pageCount} pages detected ✓</p>
                </div>
                <button
                  onClick={clearFile}
                  className="w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelect(e.target.files[0]); }}
            />
          </div>
        </div>

        {/* ── 2. Color & Quality ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => toggle('colorQuality')} className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span>🎨</span> Color & Quality
            </h2>
            {open.colorQuality ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {open.colorQuality && (
            <div className="p-4 space-y-4">
              {/* Color Mode */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Color Mode</p>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'bw',        label: 'Black & White', emoji: '⬛', price: pricing.bw },
                    { value: 'grayscale', label: 'Grayscale',     emoji: '🔲', price: pricing.grayscale },
                    { value: 'color',     label: 'Full Color',    emoji: '🌈', price: pricing.color },
                  ] as const).map((m) => (
                    <button
                      key={m.value}
                      onClick={() => set('colorMode', m.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                        settings.colorMode === m.value ? 'border-[#FF5A00] bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <span className="text-xl">{m.emoji}</span>
                      <span className={`text-[10px] font-black text-center leading-tight ${settings.colorMode === m.value ? 'text-[#FF5A00]' : 'text-gray-600'}`}>
                        {m.label}
                      </span>
                      <span className={`text-[10px] font-bold ${settings.colorMode === m.value ? 'text-orange-400' : 'text-gray-400'}`}>
                        ₹{m.price}/pg
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Print Quality */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Print Quality</p>
                <div className="flex gap-2">
                  {([
                    { value: 'draft',  label: 'Draft',  sub: 'Faster' },
                    { value: 'normal', label: 'Normal', sub: 'Balanced' },
                    { value: 'high',   label: 'High',   sub: 'Best quality' },
                  ] as const).map((q) => (
                    <button
                      key={q.value}
                      onClick={() => set('printQuality', q.value)}
                      className={`flex-1 py-2.5 px-2 rounded-xl border-2 transition-all ${
                        settings.printQuality === q.value ? 'border-[#FF5A00] bg-orange-50' : 'border-gray-100'
                      }`}
                    >
                      <p className={`text-xs font-black ${settings.printQuality === q.value ? 'text-[#FF5A00]' : 'text-gray-700'}`}>{q.label}</p>
                      <p className="text-[10px] text-gray-400">{q.sub}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── 3. Paper & Layout ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => toggle('paperLayout')} className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span>📄</span> Paper & Layout
            </h2>
            {open.paperLayout ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {open.paperLayout && (
            <div className="p-4 space-y-4">
              {/* Paper Size */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Paper Size</p>
                <div className="grid grid-cols-4 gap-2">
                  {(['A4', 'A3', 'Legal', 'Letter'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => set('paperSize', size)}
                      className={`py-2.5 rounded-xl border-2 text-xs font-black transition-all ${
                        settings.paperSize === size ? 'border-[#FF5A00] bg-orange-50 text-[#FF5A00]' : 'border-gray-100 text-gray-600'
                      }`}
                    >
                      {size}
                      {size === 'A3' && <span className="block text-[9px] opacity-60 font-medium">2× price</span>}
                    </button>
                  ))}
                </div>
              </div>
              {/* Orientation */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Orientation</p>
                <div className="flex gap-2">
                  {([
                    { value: 'portrait',  label: 'Portrait',  icon: '📱' },
                    { value: 'landscape', label: 'Landscape', icon: '🖥️' },
                  ] as const).map((o) => (
                    <button
                      key={o.value}
                      onClick={() => set('orientation', o.value)}
                      className={`flex-1 flex items-center gap-2 py-2.5 px-4 rounded-xl border-2 transition-all ${
                        settings.orientation === o.value ? 'border-[#FF5A00] bg-orange-50' : 'border-gray-100'
                      }`}
                    >
                      <span>{o.icon}</span>
                                            <span className={`text-xs font-bold ${settings.orientation === o.value
                        ? 'text-[#FF5A00]' : 'text-gray-700'}`}>{o.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Double Sided */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-gray-700">Double-Sided</p>
                  <p className="text-xs text-gray-400">15% cheaper · saves paper</p>
                </div>
                <button
                  onClick={() => set('doubleSided', !settings.doubleSided)}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    settings.doubleSided ? 'bg-[#FF5A00]' : 'bg-gray-200'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    settings.doubleSided ? 'left-6' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── 4. Copies & Page Range ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => toggle('copies')} className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span>🔢</span> Copies & Page Range
            </h2>
            {open.copies ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {open.copies && (
            <div className="p-4 space-y-4">
              {/* Copies */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Number of Copies</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => set('copies', Math.max(1, settings.copies - 1))}
                    className="w-10 h-10 rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray-600 hover:border-[#FF5A00] hover:text-[#FF5A00] transition font-bold text-lg"
                  >−</button>
                  <span className="text-2xl font-black text-gray-900 w-8 text-center">{settings.copies}</span>
                  <button
                    onClick={() => set('copies', Math.min(50, settings.copies + 1))}
                    className="w-10 h-10 rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray-600 hover:border-[#FF5A00] hover:text-[#FF5A00] transition font-bold text-lg"
                  >+</button>
                  {/* Quick presets */}
                  <div className="flex gap-1.5 ml-2">
                    {[1, 2, 5, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => set('copies', n)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                          settings.copies === n ? 'bg-[#FF5A00] text-white' : 'bg-gray-100 text-gray-500 hover:bg-orange-50'
                        }`}
                      >{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Page Range */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Page Range</p>
                <div className="flex gap-2 mb-2.5">
                  <button
                    onClick={() => set('pageRange', 'all')}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-black transition-all ${
                      settings.pageRange === 'all' ? 'border-[#FF5A00] bg-orange-50 text-[#FF5A00]' : 'border-gray-100 text-gray-600'
                    }`}
                  >All Pages {pageCount > 0 && `(${pageCount})`}</button>
                  <button
                    onClick={() => set('pageRange', '')}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-black transition-all ${
                      settings.pageRange !== 'all' ? 'border-[#FF5A00] bg-orange-50 text-[#FF5A00]' : 'border-gray-100 text-gray-600'
                    }`}
                  >Custom Range</button>
                </div>
                {settings.pageRange !== 'all' && (
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. 1-5, 8, 11-13"
                      value={settings.pageRange}
                      onChange={(e) => set('pageRange', e.target.value)}
                      className="w-full px-4 py-3 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-50 font-medium transition"
                    />
                    <p className="text-xs text-gray-400 mt-1.5 ml-1">
                      Use commas and dashes · e.g. <span className="font-bold">1-3, 5, 8-12</span>
                      {pageCount > 0 && effPages > 0 && settings.pageRange !== 'all' && (
                        <span className="text-[#FF5A00] font-bold ml-2">→ {effPages} pages selected</span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── 5. Finishing Options ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => toggle('finishing')} className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span>📎</span> Finishing Options
              {(settings.stapling || settings.binding) && (
                <span className="text-[10px] font-bold bg-orange-100 text-[#FF5A00] px-2 py-0.5 rounded-full">Active</span>
              )}
            </h2>
            {open.finishing ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {open.finishing && (
            <div className="p-4 space-y-3">
              {[
                { key: 'stapling' as const, label: 'Stapling',  sub: '+₹5 per set',  icon: '📌' },
                { key: 'binding'  as const, label: 'Binding',   sub: '+₹20 per set', icon: '📚' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-700">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => set(item.key, !settings[item.key])}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      settings[item.key] ? 'bg-[#FF5A00]' : 'bg-gray-200'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                      settings[item.key] ? 'left-6' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 6. Special Instructions ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => toggle('instructions')} className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50">
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
              <span>💬</span> Special Instructions
              {settings.specialInstructions && (
                <span className="text-[10px] font-bold bg-orange-100 text-[#FF5A00] px-2 py-0.5 rounded-full">Added</span>
              )}
            </h2>
            {open.instructions ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {open.instructions && (
            <div className="p-4">
              <textarea
                rows={3}
                placeholder="Any specific instructions for the shop? e.g. 'Print only odd pages', 'Leave margin on left side'..."
                value={settings.specialInstructions}
                onChange={(e) => set('specialInstructions', e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-50 resize-none font-medium transition"
                maxLength={300}
              />
              <p className="text-right text-xs text-gray-300 mt-1">{settings.specialInstructions.length}/300</p>
            </div>
          )}
        </div>

        {/* ── 7. Customer Info ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-2">
            <User size={15} className="text-[#FF5A00]" />
            <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Your Details</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="relative">
              <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                placeholder="Your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-50 font-medium transition"
              />
            </div>
            <div className="relative">
              <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={customerPhone}
                maxLength={10}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-50 font-medium transition"
              />
            </div>
          </div>
        </div>

        {/* ── Price Breakdown ── */}
        {fileUrl && pageCount > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-2">
              <Printer size={15} className="text-[#FF5A00]" />
              <h2 className="text-sm font-black text-gray-700 uppercase tracking-wider">Price Breakdown</h2>
            </div>
            <div className="p-4 space-y-2 text-sm">
              {[
                ['Pages',       settings.pageRange === 'all' ? `${pageCount} pages` : `${effPages} of ${pageCount} pages`],
                ['Color Mode',  settings.colorMode === 'bw' ? 'Black & White' : settings.colorMode === 'color' ? 'Full Color' : 'Grayscale'],
                ['Paper Size',  settings.paperSize + (settings.paperSize === 'A3' ? ' (2×)' : '')],
                ['Orientation', settings.orientation.charAt(0).toUpperCase() + settings.orientation.slice(1)],
                ['Quality',     settings.printQuality.charAt(0).toUpperCase() + settings.printQuality.slice(1)],
                ['Copies',      `× ${settings.copies}`],
                ['Double-sided', settings.doubleSided ? 'Yes (15% off)' : 'No'],
                ...(settings.stapling ? [['Stapling', '+₹5']] : []),
                ...(settings.binding  ? [['Binding',  '+₹20']] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-400 font-medium">{label}</span>
                  <span className="font-bold text-gray-700">{value}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between items-center">
                <span className="font-black text-gray-900">Total</span>
                <span className="text-xl font-black text-[#FF5A00]">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 bg-gradient-to-t from-[#F8F9FB] to-transparent">
        <div className="max-w-lg mx-auto">
          {!fileUrl && (
            <p className="text-center text-xs text-gray-400 mb-2 font-medium">Upload a PDF file to see pricing</p>
          )}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full py-4 bg-[#FF5A00] disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Printer size={18} />
                {canSubmit ? `Pay ₹${totalAmount} & Submit Job` : 'Fill all details to proceed'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}