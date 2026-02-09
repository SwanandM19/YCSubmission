'use client';

import { useState, useEffect } from 'react';
import { useOnboardingStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPayment() {
  const store = useOnboardingStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError('');

    try {
      // Step 1: Create Razorpay order for ₹200
      const orderRes = await fetch('/api/razorpay/create-subscription-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 200,
          shopName: store.shopName,
          phone: store.phone,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Get Razorpay key from the order response or fetch it
      const keyRes = await fetch('/api/razorpay/get-key');
      const keyData = await keyRes.json();

      if (!keyData.key) {
        throw new Error('Razorpay configuration error');
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: keyData.key, // Use key from API instead of env
        amount: orderData.amount,
        currency: 'INR',
        name: 'Nosher',
        description: 'One-time Setup Fee',
        order_id: orderData.id,
        prefill: {
          name: store.shopName,
          contact: store.phone,
        },
        theme: {
          color: '#F97316',
        },
        handler: async function (response: any) {
          // Step 3: Verify payment
          try {
            const verifyRes = await fetch('/api/razorpay/verify-subscription-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error('Payment verification failed');
            }

            // Step 4: Save payment info to store
            store.setSubscriptionPayment({
              subscriptionPaid: true,
              subscriptionPaymentId: response.razorpay_payment_id,
              subscriptionOrderId: response.razorpay_order_id,
            });

            // Step 5: Create vendor account
            await createVendor();

          } catch (err: any) {
            setError(err.message || 'Payment verification failed');
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setError('Payment cancelled. Please try again.');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setIsProcessing(false);
    }
  };

  const createVendor = async () => {
    try {
      const response = await fetch('/api/vendor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopName: store.shopName,
          phone: store.phone,
          city: store.city,
          state: store.state,
          shopType: store.shopType,
          menuItems: store.menuItems,
          upiId: store.upiId,
          accountHolderName: store.accountHolderName,
          bankAccount: store.bankAccount,
          ifscCode: store.ifscCode,
          subscriptionPaymentId: store.subscriptionPaymentId,
          subscriptionOrderId: store.subscriptionOrderId,
          subscriptionPaid: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create vendor');
      }

      // Redirect to success page
      router.push(`/success?vendorId=${data.vendorId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create vendor account');
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    store.setCurrentStep(4);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Setup</h2>


      {/* Payment Summary */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-8 mb-8">
        <div className="text-center mb-6">
          <p className="text-5xl font-bold text-gray-900">₹200</p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-800">Custom QR code for {store.shopName}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-800">Vendor dashboard with order management</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-800">Customer ordering website (no app needed)</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-800">Instant UPI payments (100% to you)</span>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-gray-600">Secured by Razorpay • 256-bit SSL encryption</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleBack}
          disabled={isProcessing}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition shadow-lg"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Pay ₹200 & Activate'
          )}
        </button>
      </div>
    </div>
  );
}
