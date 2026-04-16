'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';

export default function XeroxSuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const jobId = searchParams.get('jobId');
  const vendorId = params.vendorId as string;

  const [job, setJob]       = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    if (jobId) { fetchJob(); fetchVendor(); }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/xerox/jobs/${jobId}`);
      setJob(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchVendor = async () => {
    try {
      const res = await fetch(`/api/vendor?vendorId=${vendorId}`);
      setVendor(await res.json());
    } catch (err) { console.error(err); }
  };

  const downloadReceipt = () => {
    if (!job || !vendor) return;
    const doc = new jsPDF();
    const orange: [number, number, number] = [249, 115, 22];
    const dark:   [number, number, number] = [31, 41, 55];
    const gray:   [number, number, number] = [156, 163, 175];

    doc.setFillColor(...orange);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28); doc.setFont('helvetica', 'bold');
    doc.text('Nosher', 105, 20, { align: 'center' });
    doc.setFontSize(12); doc.setFont('helvetica', 'normal');
    doc.text('Print Job Receipt', 105, 30, { align: 'center' });

    doc.setTextColor(...dark);
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text(vendor.shopName, 20, 55);
    doc.setFontSize(10); doc.setFont('helvetica', 'normal');
    doc.setTextColor(...gray);
    doc.text(`${vendor.city} • Xerox Shop`, 20, 62);

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(20, 70, 170, 30, 3, 3, 'F');
    doc.setTextColor(...gray); doc.setFontSize(9);
    doc.text('JOB ID', 25, 78); doc.text('DATE & TIME', 95, 78);
    doc.setTextColor(...dark); doc.setFontSize(11); doc.setFont('helvetica', 'bold');
    doc.text(job._id?.slice(-8).toUpperCase() || 'N/A', 25, 86);
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(job.createdAt).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }), 95, 86);

    doc.setTextColor(...dark); doc.setFontSize(14); doc.setFont('helvetica', 'bold');
    doc.text('Print Details', 20, 115);

    let y = 130;
    const details = [
      ['File Name',    job.fileName],
      ['Pages',        `${job.pageCount} pages`],
      ['Page Range',   job.pageRange === 'all' ? 'All Pages' : job.pageRange],
      ['Color Mode',   job.colorMode === 'bw' ? 'Black & White' : job.colorMode === 'color' ? 'Full Color' : 'Grayscale'],
      ['Paper Size',   job.paperSize || 'A4'],
      ['Orientation',  job.orientation || 'Portrait'],
      ['Quality',      job.printQuality || 'Normal'],
      ['Copies',       `${job.copies}`],
      ['Double Sided', job.doubleSided ? 'Yes' : 'No'],
      ['Stapling',     job.stapling  ? 'Yes' : 'No'],
      ['Binding',      job.binding   ? 'Yes' : 'No'],
      ['Customer',     job.customerName],
      ['Phone',        job.customerPhone],
      ...(job.specialInstructions ? [['Instructions', job.specialInstructions]] : []),
    ];

    details.forEach(([label, value], i) => {
      if (i % 2 === 0) { doc.setFillColor(249, 250, 251); doc.rect(20, y - 6, 170, 10, 'F'); }
      doc.setTextColor(...gray); doc.setFontSize(9); doc.text(label, 25, y);
      doc.setTextColor(...dark); doc.setFontSize(10); doc.text(value || '', 100, y);
      y += 10;
    });

    y += 10;
    doc.setFillColor(...orange);
    doc.roundedRect(120, y - 5, 70, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(12); doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAID', 125, y + 3);
    doc.text(`₹${job.totalAmount?.toFixed(2)}`, 185, y + 3, { align: 'right' });

    y += 25;
    doc.setTextColor(...gray); doc.setFontSize(9); doc.setFont('helvetica', 'normal');
    doc.text('Thank you for using Nosher Print Service!', 105, y, { align: 'center' });
    doc.text('Powered by Nosher', 105, 285, { align: 'center' });

    doc.save(`Nosher-PrintReceipt-${job._id?.slice(-8)}.pdf`);
  };

  const colorLabel = job?.colorMode === 'color' ? 'Full Color'
    : job?.colorMode === 'grayscale' ? 'Grayscale' : 'Black & White';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Print Job Submitted!</h1>
          <p className="text-gray-600">Your file has been sent to the shop</p>
        </div>

        {job && vendor && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">Job ID</p>
              <p className="text-2xl font-bold text-gray-900">{job._id?.slice(-8).toUpperCase()}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{vendor.shopName}</p>
                  <p className="text-sm text-gray-600">{vendor.city}</p>
                </div>
              </div>
            </div>

            {/* Core details */}
            <div className="border-t border-b py-4 mb-4 space-y-2.5">
              {[
                ['File',         job.fileName],
                ['Pages',        `${job.pageCount} pages`],
                ['Page Range',   job.pageRange === 'all' ? 'All Pages' : job.pageRange],
                ['Color Mode',   colorLabel],
                ['Paper Size',   job.paperSize || 'A4'],
                ['Orientation',  (job.orientation || 'portrait').charAt(0).toUpperCase() + (job.orientation || 'portrait').slice(1)],
                ['Quality',      (job.printQuality || 'normal').charAt(0).toUpperCase() + (job.printQuality || 'normal').slice(1)],
                ['Copies',       job.copies],
                ['Double Sided', job.doubleSided ? 'Yes' : 'No'],
                ['Stapling',     job.stapling  ? 'Yes ✓' : 'No'],
                ['Binding',      job.binding   ? 'Yes ✓' : 'No'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="font-medium text-gray-800 text-sm">{value}</span>
                </div>
              ))}
              {job.specialInstructions && (
                <div className="mt-2 bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                  <p className="text-xs font-bold text-yellow-700 mb-1">Special Instructions</p>
                  <p className="text-xs text-gray-600">{job.specialInstructions}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t mb-6">
              <span>Total Paid</span>
              <span className="text-green-600">₹{job.totalAmount?.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg py-3 mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Payment Successful</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={downloadReceipt}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF Receipt
              </button>
              <Link
                href={`/v/${vendorId}`}
                className="block w-full py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl transition text-center"
              >
                Back to Shop
              </Link>
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-500">
          <p>Your print job will be ready shortly</p>
          <p className="mt-1">Visit the shop to collect your prints</p>
        </div>
      </div>
    </div>
  );
}