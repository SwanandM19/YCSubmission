'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface InsightsData {
  todayRevenue: number;
  weekRevenue: number;
  monthRevenue: number;
  todayOrders: number;
  weekOrders: number;
  monthOrders: number;
  avgOrderValue: number;
  topSellingItems: { name: string; quantity: number; revenue: number }[];
  revenueByHour: { hour: number; revenue: number; orders: number }[];
  peakHours: string[];
  completionRate: number;
  pendingOrders: number;
}

export default function InsightsPage() {
  const router = useRouter();
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState<string>('');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    // Get vendorId from localStorage
    const storedVendorId = localStorage.getItem('vendorId');
    
    if (!storedVendorId) {
      console.error('❌ No vendorId in localStorage');
      alert('Please login to the dashboard first');
      router.push('/vendor/dashboard');
      return;
    }

    console.log('✅ Found vendorId:', storedVendorId);
    setVendorId(storedVendorId);
    fetchInsights(storedVendorId);
  }, []);

  const fetchInsights = async (vid: string) => {
    try {
      setLoading(true);
      console.log('🔍 Fetching insights for:', vid);

      const response = await fetch(`/api/vendor/insights?vendorId=${vid}`);
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ API Error:', data.error);
        throw new Error(data.error || 'Failed to fetch insights');
      }

      console.log('✅ Insights loaded:', data);
      setInsights(data);
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const getRevenueForRange = () => {
    if (!insights) return 0;
    switch (timeRange) {
      case 'today': return insights.todayRevenue;
      case 'week': return insights.weekRevenue;
      case 'month': return insights.monthRevenue;
      default: return insights.todayRevenue;
    }
  };

  const getOrdersForRange = () => {
    if (!insights) return 0;
    switch (timeRange) {
      case 'today': return insights.todayOrders;
      case 'week': return insights.weekOrders;
      case 'month': return insights.monthOrders;
      default: return insights.todayOrders;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insights...</p>
          <p className="text-xs text-gray-400 mt-2">VendorId: {vendorId || 'Checking...'}</p>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600 mb-6">Start taking orders to see insights</p>
          <button
            onClick={() => router.push('/vendor/dashboard')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold">Sales Insights</h1>
          <button
            onClick={() => fetchInsights(vendorId)}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 bg-white/20 rounded-xl p-1">
          <button
            onClick={() => setTimeRange('today')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              timeRange === 'today' ? 'bg-white text-orange-600' : 'text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              timeRange === 'week' ? 'bg-white text-orange-600' : 'text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              timeRange === 'month' ? 'bg-white text-orange-600' : 'text-white'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Revenue & Orders */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 font-medium">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(getRevenueForRange())}</p>
            <p className="text-xs text-gray-500 mt-1">
              {timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This week' : 'This month'}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 font-medium">Orders</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{getOrdersForRange()}</p>
            <p className="text-xs text-gray-500 mt-1">Avg: {formatCurrency(insights.avgOrderValue)}</p>
          </div>
        </div>

        {/* Completion Rate & Pending */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-md p-4 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-purple-900">Success Rate</span>
            </div>
            <p className="text-3xl font-bold text-purple-900">{insights.completionRate}%</p>
            <p className="text-xs text-purple-700 mt-1">Orders completed</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl shadow-md p-4 border-2 border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-amber-900">Pending</span>
            </div>
            <p className="text-3xl font-bold text-amber-900">{insights.pendingOrders}</p>
            <p className="text-xs text-amber-700 mt-1">Active orders</p>
          </div>
        </div>

        {/* Peak Hours */}
        {insights.peakHours.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Peak Hours</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {insights.peakHours.map((hour, idx) => (
                <div key={idx} className="px-4 py-2 bg-orange-50 border-2 border-orange-200 rounded-lg">
                  <p className="text-sm font-bold text-orange-900">{hour}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              💡 <strong>Tip:</strong> Prepare popular items before these hours
            </p>
          </div>
        )}

        {/* Top Selling Items */}
        {insights.topSellingItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Top Selling Items</h3>
            </div>
            <div className="space-y-3">
              {insights.topSellingItems.slice(0, 5).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.quantity} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(item.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">
              💡 <strong>Tip:</strong> Keep bestsellers well-stocked
            </p>
          </div>
        )}

        {/* Revenue by Hour */}
        {insights.revenueByHour.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900">Revenue by Hour</h3>
            </div>
            <div className="space-y-2">
              {insights.revenueByHour
                .filter(h => h.revenue > 0)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 8)
                .map((hourData, index) => {
                  const maxRevenue = Math.max(...insights.revenueByHour.map(h => h.revenue));
                  const percentage = maxRevenue > 0 ? (hourData.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-gray-700">
                          {hourData.hour === 0 ? '12 AM' : hourData.hour < 12 ? `${hourData.hour} AM` : hourData.hour === 12 ? '12 PM' : `${hourData.hour - 12} PM`}
                        </span>
                        <span className="text-gray-600">
                          {formatCurrency(hourData.revenue)} ({hourData.orders} orders)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Business Insights */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-md p-4 border-2 border-indigo-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="font-bold text-indigo-900">Smart Insights</h3>
          </div>
          <div className="space-y-2">
            {insights.completionRate >= 90 && (
              <div className="flex gap-2 p-3 bg-white/50 rounded-lg">
                <span className="text-lg">🎯</span>
                <p className="text-sm text-indigo-900">
                  <strong>Excellent!</strong> {insights.completionRate}% completion rate shows great service
                </p>
              </div>
            )}
            {insights.avgOrderValue > 0 && insights.avgOrderValue < 100 && (
              <div className="flex gap-2 p-3 bg-white/50 rounded-lg">
                <span className="text-lg">📈</span>
                <p className="text-sm text-indigo-900">
                  <strong>Opportunity:</strong> Avg order is {formatCurrency(insights.avgOrderValue)}. Try combo offers
                </p>
              </div>
            )}
            {insights.topSellingItems.length > 0 && (
              <div className="flex gap-2 p-3 bg-white/50 rounded-lg">
                <span className="text-lg">⭐</span>
                <p className="text-sm text-indigo-900">
                  <strong>Bestseller:</strong> {insights.topSellingItems[0].name} ({insights.topSellingItems[0].quantity} orders)
                </p>
              </div>
            )}
            {insights.pendingOrders > 5 && (
              <div className="flex gap-2 p-3 bg-white/50 rounded-lg">
                <span className="text-lg">⚠️</span>
                <p className="text-sm text-indigo-900">
                  <strong>Action:</strong> {insights.pendingOrders} pending orders. Check dashboard
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
