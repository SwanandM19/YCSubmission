'use client';

import { useEffect, useState } from 'react';
import { useVendorAuthStore } from '@/lib/vendorAuthStore';
import { Printer, Save } from 'lucide-react';

export default function XeroxSettingsPage() {
  const { vendorId } = useVendorAuthStore();
  const [bwPerPage, setBwPerPage] = useState('1.5');
  const [colorPerPage, setColorPerPage] = useState('8');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (vendorId) fetchSettings();
  }, [vendorId]);

  const fetchSettings = async () => {
    const res = await fetch(`/api/vendor/xerox-settings?vendorId=${vendorId}`);
    const data = await res.json();
    if (data?.bwPerPage) setBwPerPage(String(data.bwPerPage));
    if (data?.colorPerPage) setColorPerPage(String(data.colorPerPage));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/vendor/xerox-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          xeroxSettings: {
            bwPerPage: parseFloat(bwPerPage),
            colorPerPage: parseFloat(colorPerPage),
          },
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-lg">

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
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">Black & White — Price per page (₹)</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold">₹</span>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={bwPerPage}
                onChange={(e) => setBwPerPage(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-100 text-sm font-semibold"
              />
              <span className="text-gray-400 text-sm">/page</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 mb-1.5 block">Color — Price per page (₹)</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 font-bold">₹</span>
              <input
                type="number"
                min="1"
                step="0.5"
                value={colorPerPage}
                onChange={(e) => setColorPerPage(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF5A00] focus:ring-2 focus:ring-orange-100 text-sm font-semibold"
              />
              <span className="text-gray-400 text-sm">/page</span>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Preview</p>
            <p className="text-xs text-gray-600">
              10 pages B&W × {bwPerPage} = <span className="font-bold text-[#FF5A00]">₹{(10 * parseFloat(bwPerPage || '0')).toFixed(2)}</span>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              10 pages Color × {colorPerPage} = <span className="font-bold text-[#FF5A00]">₹{(10 * parseFloat(colorPerPage || '0')).toFixed(2)}</span>
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-[#FF5A00] hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              '✅ Saved!'
            ) : (
              <><Save size={16} /> Save Pricing</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}