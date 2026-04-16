'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Upload, FileText, Printer, X,
  ChevronDown, ChevronUp, User, Phone, AlertCircle,
} from 'lucide-react';

interface XeroxSettings {
  bwPerPage: number;
  colorPerPage: number;
  grayscalePerPage?: number;
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

const PAPER_MULTIPLIER: Record<string, number> = { A4: 1, A3: 2, Legal: 1.2, Letter: 1 };

declare global { interface Window { Razorpay: any; } }

export default function XeroxCustomerPage() {
  const params  = useParams();
  const router  = useRouter();
  const vendorId = params.vendorId as string;

  const [xeroxSettings, setXeroxSettings] = useState<XeroxSettings | null>(null);
  const [shopName, setShopName] = useState('');
  const [loadingPage, setLoadingPage] = useState(true);

  // File state
  const [uploading, setUploading]       = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadData, setUploadData]     = useState<{ fileUrl: string; fileName: string; pageCount: number } | null>(null);
  const [uploadError, setUploadError]   = useState('');
  const [dragOver, setDragOver]         = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Print settings
  const [ps, setPs] = useState<PrintSettings>({
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

  // Customer
  const [customerName,  setCustomerName]  = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // UI
  const [open, setOpen] = useState({
    colorQuality: true,
    paperLayout:  true,
    copies:       true,
    finishing:    false,
    instructions: false,
  });
  const [paying, setPaying] = useState(false);

  const set = <K extends keyof PrintSettings>(k: K, v: PrintSettings[K]) =>
    setPs(prev => ({ ...prev, [k]: v }));
  const toggle = (k: keyof typeof open) =>
    setOpen(prev => ({ ...prev, [k]: !prev[k] }));

  useEffect(() => {
    fetchVendorData();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(s);
    return () => { document.body.removeChild(s); };
  }, [vendorId]);

  const fetchVendorData = async () => {
    try {
      const [vRes, sRes] = await Promise.all([
        fetch(`/api/vendor?vendorId=${vendorId}`),
        fetch(`/api/vendor/xerox-settings?vendorId=${vendorId}`),
      ]);
      const vData = await vRes.json();
      const sData = await sRes.json();
      setShopName(vData?.shopName || 'Print Shop');
      setXeroxSettings(sData?.bwPerPage ? sData : { bwPerPage: 1.5, colorPerPage: 8, grayscalePerPage: 3 });
    } catch {
      setXeroxSettings({ bwPerPage: 1.5, colorPerPage: 8, grayscalePerPage: 3 });
    } finally {
      setLoadingPage(false);
    }
  };

  // File upload
  const handleFileChange = async (f: File) => {
    if (f.type !== 'application/pdf') { setUploadError('Only PDF files are allowed.'); return; }
    if (f.size > 25 * 1024 * 1024)   { setUploadError('File too large. Max 25MB.'); return; }
    setUploadError(''); setUploading(true); setUploadData(null); setUploadProgress(30);
    const fd = new FormData(); fd.append('file', f);
    try {
      setUploadProgress(60);
      const res  = await fetch('/api/xerox/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUploadData(data);
      setUploadProgress(100);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Try again.');
      setUploadProgress(0);
    } finally { setUploading(false); }
  };

  // Parse page range → effective count
  const effPages = useCallback((): number => {
    if (!uploadData?.pageCount) return 0;
    const total = uploadData.pageCount;
    if (ps.pageRange === 'all' || !ps.pageRange.trim()) return total;
    try {
      let count = 0;
      for (const part of ps.pageRange.split(',').map(s => s.trim())) {
        if (part.includes('-')) {
          const [s, e] = part.split('-').map(Number);
          if (!isNaN(s) && !isNaN(e) && s >= 1 && e <= total && s <= e) count += e - s + 1;
        } else {
          const p = Number(part);
          if (!isNaN(p) && p >= 1 && p <= total) count++;
        }
      }
      return count > 0 ? count : total;
    } catch { return total; }
  }, [uploadData, ps.pageRange]);

  const calcTotal = useCallback((): number => {
    const pages = effPages();
    if (!pages || !xeroxSettings) return 0;
    const basePerPage =
      ps.colorMode === 'color'     ? xeroxSettings.colorPerPage :
      ps.colorMode === 'grayscale' ? (xeroxSettings.grayscalePerPage || 3) :
                                     xeroxSettings.bwPerPage;
    const qualityExtra   = ps.colorMode === 'color' && ps.printQuality === 'high' ? 2 : 0;
    const sizeMulti      = PAPER_MULTIPLIER[ps.paperSize] || 1;
    const dsDiscount     = ps.doubleSided ? 0.85 : 1;
    let total = pages * (basePerPage + qualityExtra) * sizeMulti * dsDiscount * ps.copies;
    if (ps.stapling) total += 5;
    if (ps.binding)  total += 20;
    return Math.ceil(total);
  }, [ps, xeroxSettings, effPages]);

  const totalAmount  = calcTotal();
  const effectivePages = effPages();
  const canSubmit    = !!uploadData && !!customerName.trim() && customerPhone.trim().length === 10 && totalAmount > 0;

  // Payment — keeps your existing API flow
  const handlePay = async () => {
    if (!uploadData) return;
    setPaying(true);
    try {
      const orderRes = await fetch('/api/xerox/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, vendorId, fileName: uploadData.fileName }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error);

      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      orderData.amount,
        currency:    'INR',
        name:        shopName,
        description: `Print: ${uploadData.fileName}`,
        order_id:    orderData.orderId,
        prefill: { name: customerName, contact: customerPhone },
        theme: { color: '#FF5A00' },
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/xerox/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              vendorId,
              customerName:  customerName || 'Walk-in Customer',
              customerPhone,
              fileUrl:       uploadData.fileUrl,
              fileName:      uploadData.fileName,
              pageCount:     uploadData.pageCount,
              // ── legacy fields (vendor print-jobs page uses these) ──
              printType:     ps.colorMode === 'color' ? 'color' : 'bw',
              copies:        ps.copies,
              doubleSided:   ps.doubleSided,
              // ── new extended fields ──
              colorMode:     ps.colorMode,
              paperSize:     ps.paperSize,
              orientation:   ps.orientation,
              pageRange:     ps.pageRange || 'all',
              printQuality:  ps.printQuality,
              stapling:      ps.stapling,
              binding:       ps.binding,
              specialInstructions: ps.specialInstructions,
              totalAmount,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(`/v/${vendorId}/xerox-success?jobId=${verifyData.jobId}`);
          } else {
            alert('Payment verification failed. Please contact the shop.');
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      };
      new window.Razorpay(options).open();
    } catch (err: any) {
      alert(err.message || 'Payment failed');
      setPaying(false);
    }
  };

  if (loadingPage) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-[#FF5A00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const pricing = {
    bw:        xeroxSettings?.bwPerPage        || 1.5,
    color:     xeroxSettings?.colorPerPage     || 8,
    grayscale: xeroxSettings?.grayscalePerPage || 3,
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] pb-36 font-sans">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FF5A00] rounded-xl flex items-center justify-center shadow-sm shadow-orange-200">
            <Printer className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-gray-900 truncate">{shopName}</p>
            <p className="text-xs text-gray-400">Print Service</p>
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
            <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider">Upload File</h2>
          </div>
          <div className="p-4">
            {!uploadData ? (
              <div
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFileChange(f); }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onClick={() => !uploading && fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragOver ? 'border-[#FF5A00] bg-orange-50' : 'border-gray-200 hover:border-[#FF5A00] hover:bg-orange-50/30'
                }`}
              >
                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Upload size={24} className="text-[#FF5A00]" />
                </div>
                <p className="text-sm font-bold text-gray-700 mb-1">
                  {uploading ? 'Uploading...' : 'Tap to upload PDF'}
                </p>
                <p className="text-xs text-gray-400">PDF only · Max 25MB</p>
                {uploading && (
                  <div className="mt-4">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FF5A00] rounded-full transition-all duration-500" style={{ width: `${uploadProgress}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{uploadProgress}%</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-2xl p-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{uploadData.fileName}</p>
                  <p className="text-xs text-green-600 font-semibold">{uploadData.pageCount} pages detected ✓</p>
                </div>
                <button onClick={() => { setUploadData(null); setUploadProgress(0); }}
                  className="w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition">
                  <X size={14} />
                </button>
              </div>
            )}
            {uploadError && (
              <div className="mt-3 flex items-center gap-2 text-red-500 bg-red-50 rounded-xl px-3 py-2">
                <AlertCircle size={14} />
                <p className="text-xs font-medium">{uploadError}</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".pdf,application/pdf" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileChange(f); }} />
          </div>
        </div>

        {/* ── 2. Color & Quality ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => toggle('colorQuality')} className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50">
            <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
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
                    { value: 'bw',        label: 'B & W',      emoji: '⬛', price: pricing.bw },
                    { value: 'grayscale', label: 'Grayscale',  emoji: '🔲', price: pricing.grayscale },
                    { value: 'color',     label: 'Full Color', emoji: '🌈', price: pricing.color },
                  ] as const).map((m) => (
                    <button key={m.value} onClick={() => set('colorMode', m.value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${
                        ps.colorMode === m.value ? 'border-[#FF5A00] bg-orange-50' : 'border-gray-100 hover:border-gray-200'
                      }`}>
                      <span className="text-xl">{m.emoji}</span>
                      <span className={`text-[10px] font-black text-center leading-tight ${ps.colorMode === m.value ? 'text-[#FF5A00]' : 'text-gray-600'}`}>
                        {m.label}
                      </span>
                      <span className={`text-[10px] font-bold ${ps.colorMode === m.value ? 'text-orange-400' : 'text-gray-400'}`}>
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
                    { value: 'high',   label: 'High',   sub: 'Best' },
                  ] as const).map((q) => (
                    <button key={q.value} onClick={() => set('printQuality', q.value)}
                      className={`flex-1 py-2.5 px-2 rounded-xl border-2 transition-all ${
                        ps.printQuality === q.value ? 'border-[#FF5A00] bg-orange-50' : 'border-gray-100'
                      }`}>
                      <p className={`text-xs font-black ${ps.printQuality === q.value ? 'text-[#FF5A00]' : 'text-gray-700'}`}>{q.label}</p>
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
            <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
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
                    <button key={size} onClick={() => set('paperSize', size)}
                      className={`py-2.5 rounded-xl border-2 text-xs font-black transition-all ${
                        ps.paperSize === size ? 'border-[#FF5A00] bg-orange-50 text-[#FF5A00]' : 'border-gray-100 text-gray-600'
                      }`}>
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
                    <button key={o.value} onClick={() => set('orientation', o.value)}
                      className={`flex-1 flex items-center gap-2 py-2.5 px-4 rounded-xl border-2 transition-all ${
                        ps.orientation === o.value ? 'border-[#FF5A00] bg-orange-50' : 'border-gray-100'
                      }`}>
                      <span>{o.icon}</span>
                      <span className={`text-xs font-bold ${ps.orientation === o.value ? 'text-[#FF5A00]' : 'text-gray-700'}`}>{o.label}</span>
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
                <button onClick={() => set('doubleSided', !ps.doubleSided)}
                  className={`w-12 h-6 rounded-full transition-all relative ${ps.doubleSided ? 'bg-[#FF5A00]' : 'bg-gray-200'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${ps.doubleSided ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── 4. Copies & Page Range ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => toggle('copies')} className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50">
            <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
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
                  <button onClick={() => set('copies', Math.max(1, ps.copies - 1))}
                    className="w-10 h-10 rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray-600 hover:border-[#FF5A00] hover:text-[#FF5A00] transition font-bold text-lg">−</button>
                  <span className="text-2xl font-black text-gray-900 w-8 text-center">{ps.copies}</span>
                  <button onClick={() => set('copies', Math.min(50, ps.copies + 1))}
                    className="w-10 h-10 rounded-xl border-2 border-gray-100 flex items-center justify-center text-gray-600 hover:border-[#FF5A00] hover:text-[#FF5A00] transition font-bold text-lg">+</button>
                  <div className="flex gap-1.5 ml-2">
                    {[1,2,5,10].map((n) => (
                      <button key={n} onClick={() => set('copies', n)}
                        className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                          ps.copies === n ? 'bg-[#FF5A00] text-white' : 'bg-gray-100 text-gray-500 hover:bg-orange-50'
                        }`}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Page Range */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Page Range</p>
                <div className="flex gap-2 mb-2.5">
                  <button onClick={() => set('pageRange', 'all')}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-black transition-all ${
                      ps.pageRange === 'all' ? 'border-[#FF5A00] bg-orange-50 text-[#FF5A00]' : 'border-gray-100 text-gray-600'
                    }`}>
                    All Pages {uploadData ? `(${uploadData.pageCount})` : ''}
                  </button>
                  <button onClick={() => set('pageRange', '')}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-black transition-all ${
                      ps.pageRange !== 'all' ? 'border-[#FF5A00] bg-orange-50 text-[#FF5A00]' : 'border-gray-100 text-gray-600'
                    }`}>
                    Custom Range
                  </button>
                </div>
                {ps.pageRange !== 'all' && (
                  <div>
                    <input type="text" placeholder="e.g. 1-5, 8, 11-13"
                      value={ps.pageRange}
                      onChange={(e) => set('pageRange', e.target.value)}
                      className="w-full px-4 py-3 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-50 font-medium transition" />
                    <p className="text-xs text-gray-400 mt-1.5 ml-1">
                      Use commas and dashes · e.g. <span className="font-bold">1-3, 5, 8-12</span>
                      {uploadData && effectivePages > 0 && (
                        <span className="text-[#FF5A00] font-bold ml-2">→ {effectivePages} pages selected</span>
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
            <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <span>📎</span> Finishing Options
              {(ps.stapling || ps.binding) && (
                <span className="text-[10px] font-bold bg-orange-100 text-[#FF5A00] px-2 py-0.5 rounded-full">Active</span>
              )}
            </h2>
            {open.finishing ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {open.finishing && (
            <div className="p-4 space-y-3">
              {[
                { key: 'stapling' as const, label: 'Stapling', sub: '+₹5 per set',  icon: '📌' },
                { key: 'binding'  as const, label: 'Binding',  sub: '+₹20 per set', icon: '📚' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-700">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                  <button onClick={() => set(item.key, !ps[item.key])}
                    className={`w-12 h-6 rounded-full transition-all relative ${ps[item.key] ? 'bg-[#FF5A00]' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${ps[item.key] ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 6. Special Instructions ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button onClick={() => toggle('instructions')} className="w-full px-4 py-3.5 flex items-center justify-between border-b border-gray-50">
            <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider flex items-center gap-2">
              <span>💬</span> Special Instructions
              {ps.specialInstructions && (
                <span className="text-[10px] font-bold bg-orange-100 text-[#FF5A00] px-2 py-0.5 rounded-full">Added</span>
              )}
            </h2>
            {open.instructions ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>
          {open.instructions && (
            <div className="p-4">
              <textarea rows={3}
                placeholder="Any specific instructions? e.g. 'Print only odd pages', 'Leave margin on left'..."
                value={ps.specialInstructions}
                onChange={(e) => set('specialInstructions', e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-50 resize-none font-medium transition"
                maxLength={300} />
              <p className="text-right text-xs text-gray-300 mt-1">{ps.specialInstructions.length}/300</p>
            </div>
          )}
        </div>

        {/* ── 7. Customer Details ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-2">
            <User size={15} className="text-[#FF5A00]" />
            <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider">Your Details</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="relative">
              <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="text" placeholder="Your name"
                value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-50 font-medium transition" />
            </div>
            <div className="relative">
              <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="tel" placeholder="10-digit mobile number"
                value={customerPhone} maxLength={10}
                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full pl-10 pr-4 py-3 text-sm border-2 border-gray-100 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-50 font-medium transition" />
            </div>
          </div>
        </div>

        {/* ── 8. Price Breakdown ── */}
        {uploadData && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-2">
              <Printer size={15} className="text-[#FF5A00]" />
              <h2 className="text-xs font-black text-gray-600 uppercase tracking-wider">Price Breakdown</h2>
            </div>
            <div className="p-4 space-y-2 text-sm">
              {[
                ['Pages',        ps.pageRange === 'all' ? `${uploadData.pageCount} pages` : `${effectivePages} of ${uploadData.pageCount}`],
                ['Color Mode',   ps.colorMode === 'bw' ? 'Black & White' : ps.colorMode === 'color' ? 'Full Color' : 'Grayscale'],
                ['Paper Size',   ps.paperSize + (ps.paperSize === 'A3' ? ' (2×)' : '')],
                ['Orientation',  ps.orientation.charAt(0).toUpperCase() + ps.orientation.slice(1)],
                ['Quality',      ps.printQuality.charAt(0).toUpperCase() + ps.printQuality.slice(1)],
                ['Copies',       `× ${ps.copies}`],
                ['Double-sided', ps.doubleSided ? 'Yes (15% off)' : 'No'],
                ...(ps.stapling ? [['Stapling', '+₹5']] : []),
                ...(ps.binding  ? [['Binding',  '+₹20']] : []),
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
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-3 bg-gradient-to-t from-[#F8F9FB] via-[#F8F9FB]/90 to-transparent">
        <div className="max-w-lg mx-auto">
          {!uploadData && (
            <p className="text-center text-xs text-gray-400 mb-2 font-medium">Upload a PDF file to see pricing</p>
          )}
          <button onClick={handlePay} disabled={!canSubmit || paying}
            className="w-full py-4 bg-[#FF5A00] disabled:bg-gray-200 disabled:text-gray-400 text-white font-black text-base rounded-2xl shadow-xl shadow-orange-200 active:scale-95 transition-all flex items-center justify-center gap-2">
            {paying ? (
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