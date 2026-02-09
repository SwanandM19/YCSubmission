'use client';

import { useEffect, useState } from 'react';

export default function EarningsPage() {
  const [earnings, setEarnings] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    avgCommission: 5,
  });

  const [recentEarnings, setRecentEarnings] = useState([]);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await fetch('/api/admin/earnings');
      const data = await res.json();
      setEarnings(data.summary);
      setRecentEarnings(data.recent);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Platform Earnings</h1>
        <p className="text-gray-600 mt-1">Track your 5% commission from all orders</p>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Today</span>
          </div>
          <p className="text-4xl font-bold mb-2">₹{earnings.today.toLocaleString()}</p>
          <p className="text-green-100 text-sm">Earned today</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Week</span>
          </div>
          <p className="text-4xl font-bold mb-2">₹{earnings.thisWeek.toLocaleString()}</p>
          <p className="text-blue-100 text-sm">This week</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Month</span>
          </div>
          <p className="text-4xl font-bold mb-2">₹{earnings.thisMonth.toLocaleString()}</p>
          <p className="text-purple-100 text-sm">This month</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">Total</span>
          </div>
          <p className="text-4xl font-bold mb-2">₹{earnings.total.toLocaleString()}</p>
          <p className="text-orange-100 text-sm">All time earnings</p>
        </div>
      </div>

      {/* Commission Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Commission Structure</h2>
            <p className="text-gray-600">How platform earnings are calculated</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold text-orange-600">{earnings.avgCommission}%</p>
            <p className="text-sm text-gray-600 mt-1">Platform Fee</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">95%</p>
                <p className="text-sm text-gray-600">Goes to Vendor</p>
              </div>
            </div>
            <p className="text-sm text-green-800">
              Vendors receive 95% of each order amount directly to their UPI account instantly.
            </p>
          </div>

          <div className="p-6 bg-orange-50 border border-orange-200 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-500 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">5%</p>
                <p className="text-sm text-gray-600">Platform Fee</p>
              </div>
            </div>
            <p className="text-sm text-orange-800">
              Your commission for providing the platform, QR codes, payment processing, and support.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Earnings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Earnings</h2>
          <button className="text-orange-600 text-sm font-medium hover:text-orange-700">
            View All →
          </button>
        </div>

        <div className="space-y-4">
          {recentEarnings.map((earning: any) => (
            <div
              key={earning.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{earning.vendorName}</p>
                  <p className="text-sm text-gray-500">Order {earning.orderId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">+₹{earning.commission.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{new Date(earning.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
