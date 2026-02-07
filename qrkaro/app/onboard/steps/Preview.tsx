'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function Preview() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/vendor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopName: store.shopName,
          phone: store.phone,
          city: store.city,
          shopType: store.shopType,
          menuItems: store.menuItems,
          accountHolderName: store.accountHolderName,
          accountNumber: store.accountNumber,
          ifscCode: store.ifscCode,
          panNumber: store.panNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create vendor');
      }

      // Redirect to success page with vendor ID
      router.push(`/success?vendorId=${data.vendorId}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    store.setCurrentStep(3);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-100 p-2 rounded-lg">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
      </div>

      <div className="space-y-6">
        {/* Shop Details */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
            Shop Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Shop Name</p>
              <p className="font-medium text-gray-900">{store.shopName}</p>
            </div>
            <div>
              <p className="text-gray-500">Shop Type</p>
              <p className="font-medium text-gray-900">{store.shopType}</p>
            </div>
            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">+91 {store.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">City</p>
              <p className="font-medium text-gray-900">{store.city}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
            Menu Items ({store.menuItems.length})
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {store.menuItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <span className="text-gray-900">{item.name}</span>
                <span className="font-medium text-gray-900">₹{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">3</span>
            Payment Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Account Holder</p>
              <p className="font-medium text-gray-900">{store.accountHolderName}</p>
            </div>
            <div>
              <p className="text-gray-500">Account Number</p>
              <p className="font-medium text-gray-900">XXXX{store.accountNumber.slice(-4)}</p>
            </div>
            <div>
              <p className="text-gray-500">IFSC Code</p>
              <p className="font-medium text-gray-900">{store.ifscCode}</p>
            </div>
            <div>
              <p className="text-gray-500">PAN Number</p>
              <p className="font-medium text-gray-900">{store.panNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={isSubmitting}
          className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit & Generate QR'
          )}
        </button>
      </div>
    </div>
  );
}
