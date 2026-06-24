'use client';

import { useEffect, useState, useRef } from 'react';
import { useVendorAuthStore } from '@/lib/vendorAuthStore';
import { Printer, FileText, Clock, CheckCircle, RefreshCw, Download, X, ChevronRight, Zap, Monitor } from 'lucide-react';

interface PrintJob {
  _id: string;
  customerName: string;
  customerPhone?: string;
  fileName: string;
  fileUrl: string;
  pageCount: number;
  printType: 'bw' | 'color';
  copies: number;
  doubleSided: boolean;
  totalAmount: number;
  printStatus: 'queued' | 'printing' | 'done' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
}

const STATUS_CONFIG = {
  queued:    { label: 'Queued',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500' },
  printing:  { label: 'Printing',  color: 'bg-blue-100 text-blue-700 border-blue-200',       dot: 'bg-blue-500 animate-pulse' },
  done:      { label: 'Done',      color: 'bg-green-100 text-green-700 border-green-200',    dot: 'bg-green-500' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-500 border-gray-200',       dot: 'bg-gray-400' },
};

// ── Setup Modal ─────────────────────────────────────────────────────────────
function PrinterSetupModal({
  vendorId,
  shopName,
  onComplete,
}: {
  vendorId: string;
  shopName: string;
  onComplete: () => void;
}) {
  const [step, setStep]               = useState<1 | 2>(1);
  const [mode, setMode]               = useState<'browser' | 'agent'>('browser');
  const [printerName, setPrinterName] = useState('');
  const [saving, setSaving]           = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError]             = useState('');

  const handleSaveStep1 = async () => {
    if (mode === 'agent' && !printerName.trim()) {
      setError('Please enter your printer name.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/vendor/xerox-settings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          autoPrint:     true,
          autoPrintMode: mode,
          printerName:   printerName.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to save settings');

      if (mode === 'browser') {
        // Browser mode — no download needed, mark complete immediately
        await markSetupComplete();
        onComplete();
      } else {
        // Agent mode — go to step 2 to download .exe
        setStep(2);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadAgent = async () => {
    setDownloading(true);
    try {
      // Hits your API which generates the custom zip with their config baked in
      const res = await fetch(
        `/api/vendor/download-agent?vendorId=${vendorId}`,
        { method: 'GET' }
      );
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `nosher-print-agent-${vendorId}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      // Mark setup complete after download
      await markSetupComplete();
      setTimeout(() => onComplete(), 1500);
    } catch (e: any) {
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const markSetupComplete = async () => {
    await fetch('/api/vendor/xerox-settings', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendorId,
        agentSetupComplete: true,
      }),
    });
  };

  return (
  <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#FF5A00] to-orange-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-orange-100 font-medium">Welcome, {shopName}!</p>
              <h2 className="text-lg font-black">Printer Setup</h2>
            </div>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  step >= s ? 'bg-white text-[#FF5A00]' : 'bg-white/30 text-white'
                }`}>{s}</div>
                {s < 2 && <div className={`h-0.5 w-8 rounded-full transition-all ${step > s ? 'bg-white' : 'bg-white/30'}`} />}
              </div>
            ))}
            <span className="text-xs text-orange-100 ml-1 font-medium">
              {step === 1 ? 'Choose Print Mode' : 'Download Agent'}
            </span>
          </div>
        </div>

        {/* Step 1 — Choose mode */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <p className="text-sm text-gray-500 leading-relaxed">
              Choose how your shop handles print jobs. You can change this anytime in Settings.
            </p>

            {/* Mode cards */}
            <div className="space-y-3">
              {[
                {
                  value:   'browser' as const,
                  icon:    <Monitor className="w-5 h-5" />,
                  title:   '🌐 Browser Print',
                  desc:    'New jobs open automatically in a print dialog. Keep this dashboard open on your shop PC.',
                  badge:   'Easiest',
                  badgeColor: 'bg-green-100 text-green-700',
                },
                {
                  value:   'agent' as const,
                  icon:    <Zap className="w-5 h-5" />,
                  title:   '⚡ Silent Auto-Print',
                  desc:    'Jobs print silently the moment they arrive — no clicks needed. Requires a small background app on your PC.',
                  badge:   'Fully Automatic',
                  badgeColor: 'bg-blue-100 text-blue-700',
                },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setMode(opt.value); setError(''); }}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    mode === opt.value
                      ? 'border-[#FF5A00] bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`font-black text-sm ${mode === opt.value ? 'text-[#FF5A00]' : 'text-gray-900'}`}>
                          {opt.title}
                        </p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${opt.badgeColor}`}>
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{opt.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      mode === opt.value ? 'border-[#FF5A00] bg-[#FF5A00]' : 'border-gray-300'
                    }`}>
                      {mode === opt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Printer name — agent only */}
            {mode === 'agent' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">
                  Your Printer Name
                  <span className="text-gray-400 font-normal ml-1">(exact name from Windows)</span>
                </label>
                <input
                  type="text"
                  value={printerName}
                  onChange={e => { setPrinterName(e.target.value); setError(''); }}
                  placeholder="e.g. HP LaserJet M1005"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-100"
                />
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                  💡 To find it: Press Win+R → type{' '}
                  <code className="bg-gray-100 px-1 rounded font-mono">control printers</code>
                  {' '}→ see printer name
                </p>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 font-medium bg-red-50 px-4 py-2.5 rounded-xl">
                ❌ {error}
              </p>
            )}

            <button
              onClick={handleSaveStep1}
              disabled={saving}
              className="w-full py-3.5 bg-[#FF5A00] hover:bg-orange-600 disabled:bg-orange-300 text-white font-black rounded-2xl transition flex items-center justify-center gap-2"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Continue <ChevronRight size={16} /></>
              )}
            </button>
          </div>
        )}

        {/* Step 2 — Download agent (only for agent mode) */}
        {step === 2 && (
          <div className="p-6 space-y-5">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <p className="text-sm font-black text-blue-900 mb-1">📦 Your Personal Print Agent</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                We've built a custom agent with your details pre-configured.
                Just download, extract, and double-click — no setup needed.
              </p>
            </div>

            {/* What's inside */}
            <div className="space-y-2">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">What's inside the ZIP</p>
              {[
                { icon: '⚡', title: 'nosher-agent.exe',   desc: 'Double-click to start auto-printing' },
                { icon: '⚙️', title: '.env (pre-filled)',  desc: `Your VendorID & printer name already set` },
                { icon: '📖', title: 'README.txt',         desc: 'Simple 2-step instructions' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{item.title}</p>
                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* How to use */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2">
              <p className="text-xs font-black text-amber-800">How to use:</p>
              {[
                'Download & extract the ZIP',
                'Double-click nosher-agent.exe',
                'Keep it running while shop is open',
                'Jobs will print automatically! 🎉',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-amber-700">
                  <span className="w-5 h-5 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center font-black text-[10px] flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium bg-red-50 px-4 py-2.5 rounded-xl">
                ❌ {error}
              </p>
            )}

            <button
              onClick={handleDownloadAgent}
              disabled={downloading}
              className="w-full py-3.5 bg-[#FF5A00] hover:bg-orange-600 disabled:bg-orange-300 text-white font-black rounded-2xl transition flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Preparing your agent...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download My Print Agent
                </>
              )}
            </button>

            <button
              onClick={onComplete}
              className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 transition font-medium"
            >
              Skip for now — I'll download later from Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function PrintJobsPage() {
  const { vendorId, shopName } = useVendorAuthStore();
  const [jobs,       setJobs]       = useState<PrintJob[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [activeTab,  setActiveTab]  = useState<'queued' | 'printing' | 'done' | 'all'>('queued');
  const [updating,   setUpdating]   = useState<string | null>(null);
  const [showSetup,  setShowSetup]  = useState(false);
  const [setupChecked, setSetupChecked] = useState(false);

  useEffect(() => {
    if (vendorId) {
      fetchJobs();
      checkSetupStatus();
    }
    const interval = setInterval(() => { if (vendorId) fetchJobs(true); }, 15000);
    return () => clearInterval(interval);
  }, [vendorId]);

  const checkSetupStatus = async () => {
    try {
      const res  = await fetch(`/api/vendor/xerox-settings?vendorId=${vendorId}`);
      const data = await res.json();
      // Show popup if setup never completed
      if (!data?.agentSetupComplete) {
        setShowSetup(true);
      }
    } catch (e) {
      // Silently fail — don't block dashboard
    } finally {
      setSetupChecked(true);
    }
  };

  const fetchJobs = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res  = await fetch(`/api/xerox/jobs?vendorId=${vendorId}`);
      const data = await res.json();
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (jobId: string, printStatus: string) => {
    setUpdating(jobId);
    try {
      await fetch(`/api/xerox/jobs/${jobId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printStatus }),
      });
      await fetchJobs(true);
    } finally {
      setUpdating(null);
    }
  };

  const handlePrint = (job: PrintJob) => {
    const printUrl    = `/api/xerox/file?url=${encodeURIComponent(job.fileUrl)}`;
    const printWindow = window.open(printUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => printWindow.print();
    }
    updateStatus(job._id, 'printing');
  };

  const filteredJobs = activeTab === 'all'
    ? jobs
    : jobs.filter((j) => j.printStatus === activeTab);

  const counts = {
    queued:   jobs.filter((j) => j.printStatus === 'queued').length,
    printing: jobs.filter((j) => j.printStatus === 'printing').length,
    done:     jobs.filter((j) => j.printStatus === 'done').length,
    all:      jobs.length,
  };

  const todayEarnings = jobs
    .filter((j) =>
      j.paymentStatus === 'paid' &&
      new Date(j.createdAt).toDateString() === new Date().toDateString()
    )
    .reduce((s, j) => s + j.totalAmount, 0);

  return (
    <>
      {/* Setup Popup — shown only on first visit */}
      {showSetup && vendorId && shopName && (
        <PrinterSetupModal
          vendorId={vendorId}
          shopName={shopName}
          onComplete={() => setShowSetup(false)}
        />
      )}

      <div className="p-4 space-y-4">

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">Today's Jobs</p>
            <p className="text-2xl font-black text-gray-900 mt-1">
              {jobs.filter((j) => new Date(j.createdAt).toDateString() === new Date().toDateString()).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-400 font-medium">In Queue</p>
            <p className="text-2xl font-black text-yellow-500 mt-1">{counts.queued}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 shadow-sm shadow-orange-200">
            <p className="text-xs text-orange-100 font-medium">Today's Earnings</p>
            <p className="text-2xl font-black text-white mt-1">₹{todayEarnings}</p>
          </div>
        </div>

        {/* Re-do setup banner — visible in settings-like area */}
        {setupChecked && !showSetup && (
          <button
            onClick={() => setShowSetup(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
          >
            <div className="flex items-center gap-2">
              <Printer size={16} />
              <span>Print Agent Settings</span>
            </div>
            <ChevronRight size={16} />
          </button>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {(['queued', 'printing', 'done', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-xs font-bold capitalize transition-all relative ${
                  activeTab === tab
                    ? 'text-[#FF5A00] bg-orange-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {counts[tab] > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                    activeTab === tab ? 'bg-[#FF5A00] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {counts[tab]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="w-8 h-8 border-[3px] border-[#FF5A00] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-16 text-center">
              <Printer className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-gray-400 font-medium">
                No {activeTab !== 'all' ? activeTab : ''} jobs
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredJobs.map((job) => {
                const cfg = STATUS_CONFIG[job.printStatus];
                return (
                  <div key={job._id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        job.printType === 'color' ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        <FileText className={`w-5 h-5 ${job.printType === 'color' ? 'text-orange-500' : 'text-gray-500'}`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-bold text-gray-900 truncate max-w-[160px]">{job.fileName}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${cfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
                          <span>{job.pageCount} pages</span>
                          <span>{job.printType === 'bw' ? 'B&W' : '🎨 Color'}</span>
                          <span>{job.copies} {job.copies === 1 ? 'copy' : 'copies'}</span>
                          {job.doubleSided && <span>Double-sided</span>}
                          <span className="font-bold text-[#FF5A00]">₹{job.totalAmount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock size={10} />
                          {new Date(job.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          {job.customerName && job.customerName !== 'Walk-in Customer' && (
                            <span className="ml-2">• {job.customerName}</span>
                          )}
                          {job.customerPhone && <span>• {job.customerPhone}</span>}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-base font-black text-[#FF5A00]">₹{job.totalAmount}</p>
                        <p className="text-[10px] text-gray-400">{job.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                      {job.printStatus === 'queued' && (
                        <button
                          onClick={() => handlePrint(job)}
                          disabled={updating === job._id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#FF5A00] hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl text-sm transition active:scale-95"
                        >
                          <Printer size={14} />
                          Print Now
                        </button>
                      )}
                      {job.printStatus === 'printing' && (
                        <button
                          onClick={() => updateStatus(job._id, 'done')}
                          disabled={updating === job._id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold rounded-xl text-sm transition active:scale-95"
                        >
                          <CheckCircle size={14} />
                          Mark Done
                        </button>
                      )}
                      {(job.printStatus === 'queued' || job.printStatus === 'printing') && (
                        <a
                          href={job.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl transition"
                        >
                          <Download size={15} />
                        </a>
                      )}
                      {job.printStatus === 'done' && (
                        <button
                          onClick={() => handlePrint(job)}
                          className="flex items-center gap-1.5 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl text-sm transition"
                        >
                          <RefreshCw size={13} />
                          Reprint
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}