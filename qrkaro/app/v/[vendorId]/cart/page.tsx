'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { requestNotificationPermission } from '@/lib/firebase'; // ✅ ADDED

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.vendorId as string;

  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  
  // ✅ ADDED: Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerFcmToken, setCustomerFcmToken] = useState<string | null>(null);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  const subtotal = getTotal();
  const tax = subtotal * 0.05; // 5% tax
  const platformFee = 5;
  const total = subtotal + tax + platformFee;

  // ✅ ADDED: Request notification permission when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      requestCustomerNotificationPermission();
    }, 2000); // Ask after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // ✅ ADDED: Request notification permission
  const requestCustomerNotificationPermission = async () => {
    try {
      const token = await requestNotificationPermission();
      if (token) {
        setCustomerFcmToken(token);
        console.log('✅ Customer FCM token received:', token);
      } else {
        console.log('⚠️ Customer denied notification permission');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handlePayment = async () => {
    // ✅ ADDED: Validate customer details
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your name and phone number');
      return;
    }

    if (customerPhone.length !== 10 || !/^\d+$/.test(customerPhone)) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create order in database
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          items,
          subtotal,
          tax,
          platformFee,
          totalAmount: total,
          customerName: customerName.trim(), // ✅ ADDED
          customerPhone: customerPhone.trim(), // ✅ ADDED
          customerFcmToken, // ✅ ADDED
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // ✅ ADDED: Send notification to vendor about new order
      try {
        await fetch('/api/notifications/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userType: 'vendor',
            userId: vendorId,
            title: '🔔 New Order Received!',
            body: `Order #${orderData.orderId.slice(-4)} - ${items.length} items - ₹${total.toFixed(2)}`,
            data: {
              orderId: orderData.orderId,
              link: '/vendor/dashboard',
            },
          }),
        });
        console.log('✅ Notification sent to vendor');
      } catch (notifError) {
        console.error('⚠️ Failed to send notification to vendor:', notifError);
        // Don't block the payment flow if notification fails
      }

      // Step 2: Create Razorpay order
      const razorpayOrderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          orderId: orderData.orderId,
          vendorId,
        }),
      });

      const razorpayData = await razorpayOrderResponse.json();

      if (!razorpayOrderResponse.ok) {
        throw new Error(razorpayData.error || 'Failed to create payment order');
      }

      // Step 3: Initialize Razorpay checkout
      const options = {
        key: razorpayData.keyId,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: 'Nosher',
        description: `Order #${orderData.orderId}`,
        order_id: razorpayData.razorpayOrderId,
        handler: async function (response: any) {
          // Step 4: Verify payment
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              clearCart();
              router.push(`/v/${vendorId}/order-success?orderId=${orderData.orderId}`);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            alert('Payment verification failed. Please contact support.');
            console.error('Verification error:', error);
          }
        },
        prefill: {
          name: customerName,
          contact: customerPhone,
        },
        theme: {
          color: '#f97316',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      if (typeof (window as any).Razorpay !== 'undefined') {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          alert('Payment failed: ' + response.error.description);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        throw new Error('Razorpay SDK not loaded');
      }

    } catch (error: any) {
      alert(error.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add items to get started</p>
          <Link
            href={`/v/${vendorId}`}
            className="inline-block px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Load Razorpay Script */}
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link href={`/v/${vendorId}`}>
                  <svg className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">N</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Nosher</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
                <span className="px-4 py-1.5 bg-orange-100 text-orange-700 font-medium rounded-full text-sm">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-orange-600 font-semibold mt-1">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded transition"
                      >
                        −
                      </button>
                      <span className="font-semibold text-gray-900 w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 rounded transition"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.name)}
                      className="p-2 text-gray-400 hover:text-red-500 transition"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push(`/v/${vendorId}`)}
                className="mt-6 flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add more items
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* ✅ ADDED: Customer Details Form */}
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* ✅ ADDED: Notification status indicator */}
                  {customerFcmToken && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      <span>Order updates enabled</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6 pt-4 border-t">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax / GST (5%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Platform Fee</span>
                    <span className="font-medium">₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-orange-600">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing || !razorpayLoaded || !customerName.trim() || !customerPhone.trim()}
                  className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition mb-4"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : !razorpayLoaded ? (
                    'Loading Payment...'
                  ) : (
                    'Pay Now with Razorpay'
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secured by Razorpay</span>
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <img src="https://cdn.razorpay.com/static/assets/pay_methods_branding.png" alt="Payment methods" className="h-6" />
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex gap-2 text-sm text-orange-800">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p>You'll receive instant order updates. The vendor will be notified immediately.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
