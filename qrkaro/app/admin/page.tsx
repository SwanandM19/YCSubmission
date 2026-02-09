'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVendors: 0,
    activeVendors: 0,
    todayOrders: 0,
    monthlyRevenue: 0,
    platformEarnings: 0,
    totalPayouts: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Vendors */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalVendors}</p>
          <p className="text-sm text-gray-600 mt-1">Total Vendors</p>
        </div>

        {/* Active Vendors */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full">-5%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeVendors}</p>
          <p className="text-sm text-gray-600 mt-1">Active Vendors</p>
        </div>

        {/* Today's Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">+8%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.todayOrders}</p>
          <p className="text-sm text-gray-600 mt-1">Today's Orders</p>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">+15%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
          <p className="text-sm text-gray-600 mt-1">Monthly Revenue</p>
        </div>
      </div>

      {/* Platform Earnings & Payouts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-2">Platform Earnings (5%)</p>
              <p className="text-4xl font-bold">₹{stats.platformEarnings.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-orange-100 text-sm">Your commission from all orders</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-2">Total Payouts (95%)</p>
              <p className="text-4xl font-bold">₹{stats.totalPayouts.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-blue-100 text-sm">Sent to vendors successfully</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <button className="text-orange-600 text-sm font-medium hover:text-orange-700">View All →</button>
        </div>
        <div className="space-y-4">
          <ActivityItem
            icon="🆕"
            title="New vendor onboarded: Cafe Mocha"
            time="2 minutes ago"
            color="green"
          />
          <ActivityItem
            icon="💸"
            title="Payout completed: ₹5,240 to Raj Food Plaza"
            time="15 minutes ago"
            color="blue"
          />
          <ActivityItem
            icon="📦"
            title="45 new orders received"
            time="1 hour ago"
            color="purple"
          />
          <ActivityItem
            icon="⚠️"
            title="Vendor Tech World suspended"
            time="3 hours ago"
            color="red"
          />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ 
  icon, 
  title, 
  time, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  time: string; 
  color: 'green' | 'blue' | 'purple' | 'red' 
}) {
  const colors = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition">
      <div className={`p-3 ${colors[color]} rounded-xl text-2xl`}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}
