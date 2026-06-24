'use client';

import { useEffect, useState } from 'react';
import { useVendorAuthStore } from '@/lib/vendorAuthStore';
import { Printer, Save, Zap, Monitor, Download, RefreshCw } from 'lucide-react';

export default function XeroxSettingsPage() {
  const { vendorId } = useVendorAuthStore();

  // ── Pricing ───────────────────────────────────────────────────────────────
  const [bwPerPage,    setBwPerPage]    = useState('1.5');
  const [colorPerPage, setColorPerPage] = useState('8');

  // ── Auto-Print ────────────────────────────────────────────────────────────
  const [autoPrint,     setAutoPrint]     = useState(false);
  const [printerName,   setPrinterName]   = useState('');
  const [autoPrintMode, setAutoPrintMode] = useState<'browser' | 'agent'>('browser');

  // ── UI State ──────────────────────────────────────────────────────────────
  const [saving,      setSaving]      = useState(false);
  const [saved,       setSaved]       = useState(false);
  const [error,       setError]       = useState('');
  const [downloading, setDownloading] = useState(false);
  const [dlSuccess,   setDlSuccess]   = useState(false);

  useEffect(() => {
    if (vendorId) fetchSettings();
  }, [vendorId]);

  const fetchSettings = async () => {
  try {
    const res  = await fetch(`/api/vendor/xerox-settings?vendorId=${vendorId}`);
    const data = await res.json();

    if (data?.bwPerPage    !== undefined) setBwPerPage(String(data.bwPerPage));
    if (data?.colorPerPage !== undefined) setColorPerPage(String(data.colorPerPage));

    // ✅ Always set these — even if false or empty string
    setAutoPrint(data?.autoPrint === true);
    setAutoPrintMode(data?.autoPrintMode === 'agent' ? 'agent' : 'browser');
    setPrinterName(data?.printerName || '');

  } catch (e) {
    console.error('Failed to load settings:', e);
  }
};

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/vendor/xerox-settings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          bwPerPage:     parseFloat(bwPerPage),
          colorPerPage:  parseFloat(colorPerPage),
          autoPrint,
          printerName:   printerName.trim(),
          autoPrintMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadAgent = async () => {
    setDownloading(true);
    setError('');
    try {
      const res = await fetch(`/api/vendor/download-agent?vendorId=${vendorId}`);
      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `nosher-print-agent-${vendorId}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      // Mark setup complete when re-downloading too
      await fetch('/api/vendor/xerox-settings', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vendorId, agentSetupComplete: true }),
      });

      setDlSuccess(true);
      setTimeout(() => setDlSuccess(false), 4000);
    } catch (e: any) {
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-lg">

      {/* ── Print Pricing ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Printer className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Print Pricing</p>
            <p className="text-xs text-gray-400">Set your per-page rates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Black & White — Price per page (₹)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold">₹</span>
              <input
                type="number" min="0.5" step="0.5"
                value={bwPerPage}
                onChange={e => setBwPerPage(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-100 text-sm font-semibold"
              />
              <span className="text-gray-400 text-sm">/page</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">
              Color — Price per page (₹)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold">₹</span>
              <input
                type="number" min="1" step="0.5"
                value={colorPerPage}
                onChange={e => setColorPerPage(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-100 text-sm font-semibold"
              />
              <span className="text-gray-400 text-sm">/page</span>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Preview</p>
            <p className="text-xs text-gray-600">
              10 pages B&W × {bwPerPage} ={' '}
              <span className="font-bold text-[#FF5A00]">
                ₹{(10 * parseFloat(bwPerPage || '0')).toFixed(2)}
              </span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              10 pages Color × {colorPerPage} ={' '}
              <span className="font-bold text-[#FF5A00]">
                ₹{(10 * parseFloat(colorPerPage || '0')).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Auto-Print ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="font-bold text-gray-900">Auto-Print</p>
            <p className="text-xs text-gray-400">Automatically print when new job arrives</p>
          </div>
        </div>

        {/* Toggle */}
        <div
          onClick={() => setAutoPrint(p => !p)}
          className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition border-2 ${
            autoPrint ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {autoPrint ? '🟢 Auto-Print is ON' : '⚪ Auto-Print is OFF'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {autoPrint
                ? 'New paid jobs will print automatically'
                : 'You manually print each job from the dashboard'}
            </p>
          </div>
          <div className={`relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0 ${
            autoPrint ? 'bg-green-500' : 'bg-gray-300'
          }`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
              autoPrint ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </div>
        </div>

        {/* Mode + extra settings — only when ON */}
        {autoPrint && (
          <div className="mt-4 space-y-4">

            {/* Mode selector */}
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Print Mode
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    value: 'browser',
                    icon:  <Monitor size={16} />,
                    label: 'Browser Print',
                    desc:  'Opens print dialog automatically. No extra setup needed.',
                  },
                  {
                    value: 'agent',
                    icon:  <Zap size={16} />,
                    label: 'Silent Agent',
                    desc:  'Prints with zero dialogs. Requires Print Agent on your PC.',
                  },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setAutoPrintMode(opt.value as any)}
                    className={`text-left p-3 rounded-xl border-2 transition ${
                      autoPrintMode === opt.value
                        ? 'border-[#FF5A00] bg-orange-50'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex items-center gap-1.5 font-bold text-sm mb-1 ${
                      autoPrintMode === opt.value ? 'text-[#FF5A00]' : 'text-gray-800'
                    }`}>
                      {opt.icon} {opt.label}
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Printer name — agent mode only */}
            {autoPrintMode === 'agent' && (
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1.5 block">
                  Printer Name
                  <span className="text-gray-400 font-normal ml-1">(exact name from your PC)</span>
                </label>
                <input
                  type="text"
                  value={printerName}
                  onChange={e => setPrinterName(e.target.value)}
                  placeholder="e.g. HP LaserJet M1005"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-100 text-sm"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Windows: Press Win+R → type{' '}
                  <code className="bg-gray-100 px-1 rounded font-mono">control printers</code>
                  {' '}→ copy exact printer name
                </p>
              </div>
            )}

            {/* Info banner */}
            {autoPrintMode === 'agent' ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-1">
                <p className="text-xs font-bold text-blue-800">📦 Print Agent Required</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Download and run the <strong>Nosher Print Agent</strong> on the PC connected
                  to your printer. It polls every 8 seconds and silently prints new jobs.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-800">ℹ️ How Browser Mode Works</p>
                <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                  When a new paid job arrives, the PDF opens in a new tab with the print
                  dialog automatically. Keep this dashboard open on your vendor PC.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Download Agent Card ────────────────────────────────────────────── */}
      {autoPrint && autoPrintMode === 'agent' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Print Agent</p>
              <p className="text-xs text-gray-400">Your personal auto-print app</p>
            </div>
          </div>

          {/* What's inside */}
          <div className="space-y-2 mb-4">
            {[
              { icon: '⚡', title: 'nosher-agent.exe',  desc: 'Double-click to start auto-printing' },
              { icon: '⚙️', title: '.env (pre-filled)', desc: 'Your VendorID & printer already configured' },
              { icon: '🖱️', title: 'start-agent.bat',   desc: 'One double-click launcher for Windows' },
              { icon: '📖', title: 'README.txt',         desc: 'Simple 3-step instructions' },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                <span className="text-base">{item.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">{item.title}</p>
                  <p className="text-[10px] text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
            <p className="text-xs font-black text-amber-800 mb-2">After downloading:</p>
            {[
              'Extract the ZIP file',
              'Install Node.js from nodejs.org (one time)',
              'Open folder → run: npm install (one time)',
              'Double-click start-agent.bat every day 🎉',
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-amber-700 mb-1">
                <span className="w-4 h-4 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center font-black text-[9px] flex-shrink-0">
                  {i + 1}
                </span>
                {s}
              </div>
            ))}
          </div>

          {dlSuccess && (
            <div className="mb-3 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-semibold">
              ✅ Downloaded! Extract the ZIP and follow the README.
            </div>
          )}

          <button
            onClick={handleDownloadAgent}
            disabled={downloading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Preparing your agent...
              </>
            ) : (
              <>
                <RefreshCw size={15} />
                Re-download My Print Agent
              </>
            )}
          </button>
          <p className="text-[10px] text-gray-400 text-center mt-2">
            Re-download anytime — your VendorID & printer name are always pre-filled
          </p>
        </div>
      )}

      {/* ── Error / Save ───────────────────────────────────────────────────── */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
          ❌ {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3.5 bg-[#FF5A00] hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
      >
        {saving ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : saved ? (
          '✅ Settings Saved!'
        ) : (
          <><Save size={16} /> Save All Settings</>
        )}
      </button>

    </div>
  );
}