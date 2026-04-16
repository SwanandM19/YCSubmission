'use client';

import { useEffect, useState, useRef } from 'react';
import { useVendorAuthStore } from '@/lib/vendorAuthStore';
import { Printer, FileText, Clock, CheckCircle, RefreshCw, Download } from 'lucide-react';

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
  queued:    { label: 'Queued',   color: 'bg-yellow-100 text-yellow-700 border-yellow-200',  dot: 'bg-yellow-500' },
  printing:  { label: 'Printing', color: 'bg-blue-100 text-blue-700 border-blue-200',        dot: 'bg-blue-500 animate-pulse' },
  done:      { label: 'Done',     color: 'bg-green-100 text-green-700 border-green-200',     dot: 'bg-green-500' },
  cancelled: { label: 'Cancelled',color: 'bg-gray-100 text-gray-500 border-gray-200',        dot: 'bg-gray-400' },
};

export default function PrintJobsPage() {
  const { vendorId } = useVendorAuthStore();
  const [jobs, setJobs] = useState<PrintJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'queued' | 'printing' | 'done' | 'all'>('queued');
  const [updating, setUpdating] = useState<string | null>(null);
  const printFrameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (vendorId) { fetchJobs(); }
    const interval = setInterval(() => { if (vendorId) fetchJobs(true); }, 15000);
    return () => clearInterval(interval);
  }, [vendorId]);

  const fetchJobs = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/xerox/jobs?vendorId=${vendorId}`);
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
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ printStatus }),
      });
      await fetchJobs(true);
    } finally {
      setUpdating(null);
    }
  };

//   const handlePrint = (job: PrintJob) => {
//     // Open PDF in new tab and trigger print dialog
//     const printWindow = window.open(job.fileUrl, '_blank');
//     if (printWindow) {
//       printWindow.onload = () => printWindow.print();
//     }
//     // Mark as printing
//     updateStatus(job._id, 'printing');
//   };
const handlePrint = (job: PrintJob) => {
  // ✅ Proxy through your own API — works for ALL Cloudinary raw PDFs
  const printUrl = `/api/xerox/file?url=${encodeURIComponent(job.fileUrl)}`;
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
    queued: jobs.filter((j) => j.printStatus === 'queued').length,
    printing: jobs.filter((j) => j.printStatus === 'printing').length,
    done: jobs.filter((j) => j.printStatus === 'done').length,
    all: jobs.length,
  };

  const todayEarnings = jobs
    .filter((j) => j.paymentStatus === 'paid' && new Date(j.createdAt).toDateString() === new Date().toDateString())
    .reduce((s, j) => s + j.totalAmount, 0);

  return (
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
            <div className="w-8 h-8 border-3 border-[#FF5A00] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-16 text-center">
            <Printer className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400 font-medium">No {activeTab !== 'all' ? activeTab : ''} jobs</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredJobs.map((job) => {
              const cfg = STATUS_CONFIG[job.printStatus];
              return (
                <div key={job._id} className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      job.printType === 'color' ? 'bg-orange-100' : 'bg-gray-100'
                    }`}>
                      <FileText className={`w-5 h-5 ${job.printType === 'color' ? 'text-orange-500' : 'text-gray-500'}`} />
                    </div>

                    {/* Info */}
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

                    {/* Amount */}
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
  );
}