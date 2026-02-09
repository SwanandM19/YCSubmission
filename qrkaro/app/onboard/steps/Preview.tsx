'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/lib/store';

export default function Preview() {
  const store = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleProceedToPayment = () => {
    setIsLoading(true);
    store.setCurrentStep(5);
    setIsLoading(false);
  };

  const handleBack = () => {
    store.setCurrentStep(3);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Details</h2>
      <p className="text-gray-600 mb-6">
        Please verify all information before proceeding to payment
      </p>

      {/* Shop Details */}
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Shop Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Shop Name</p>
              <p className="font-medium text-gray-900">{store.shopName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shop Type</p>
              <p className="font-medium text-gray-900">{store.shopType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">+91 {store.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="font-medium text-gray-900">{store.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">State</p>
              <p className="font-medium text-gray-900">{store.state}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Menu Items ({store.menuItems.length})
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {store.menuItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-gray-900">{item.name}</span>
                <span className="font-semibold text-orange-600">₹{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Account Holder</p>
              <p className="font-medium text-gray-900">{store.accountHolderName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">UPI ID</p>
              <p className="font-medium text-gray-900">{store.upiId}</p>
            </div>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-orange-500 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-gray-900">₹200 one-time setup fee</p>
              <p className="text-sm text-gray-700 mt-1">Get your QR code, vendor app, and customer website</p>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-800">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Custom QR code for your shop</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Vendor dashboard app access</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Customer ordering website</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleProceedToPayment}
          disabled={isLoading}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition shadow-lg disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Proceed to Payment →'}
        </button>
      </div>
    </div>
  );
}
