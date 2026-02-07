'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorAuth } from '@/lib/vendorAuthStore';

export default function VendorLoginPage() {
  const router = useRouter();
  const { login } = useVendorAuth();

  const [vendorId, setVendorId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verify vendor exists
      const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error('Invalid Vendor ID');
      }

      // Store auth and redirect
      login(vendorId, data.shopName);
      router.push('/vendor/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">Q</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QRKaro Vendor</h1>
          <p className="text-gray-600">Manage your orders and menu</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Login to Dashboard</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vendor ID
              </label>
              <input
                type="text"
                value={vendorId}
                onChange={(e) => setVendorId(e.target.value)}
                placeholder="Enter your Vendor ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Find your Vendor ID in the onboarding success page
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !vendorId.trim()}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-lg transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 text-center">
              Don't have a Vendor ID?{' '}
              <a href="/onboard" className="text-orange-600 hover:text-orange-700 font-medium">
                Create Account
              </a>
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-orange-600 font-bold text-2xl mb-1">📱</div>
            <p className="text-xs text-gray-600">Mobile Ready</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-orange-600 font-bold text-2xl mb-1">⚡</div>
            <p className="text-xs text-gray-600">Real-time Orders</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-orange-600 font-bold text-2xl mb-1">💰</div>
            <p className="text-xs text-gray-600">Instant Payments</p>
          </div>
        </div>
      </div>
    </div>
  );
}
