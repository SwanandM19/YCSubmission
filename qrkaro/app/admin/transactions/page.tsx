'use client';

import { useEffect, useState } from 'react';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    fetchTransactions();
  }, [filter, dateRange]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/admin/transactions?filter=${filter}&range=${dateRange}`);
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
        <p className="text-gray-600 mt-1">Monitor all payments and payouts across the platform</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹45,230</p>
          <p className="text-sm text-gray-600 mt-1">Total Collected</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹42,968</p>
          <p className="text-sm text-gray-600 mt-1">Paid to Vendors</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹2,262</p>
          <p className="text-sm text-gray-600 mt-1">Platform Earnings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">342</p>
          <p className="text-sm text-gray-600 mt-1">Total Transactions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('payments')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'payments'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setFilter('payouts')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'payouts'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Payouts
            </button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium text-gray-700">Date:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">
            📥 Export CSV
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Vendor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                Date & Time
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((txn: any) => (
              <tr key={txn.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-gray-900">{txn.id}</span>
                </td>
                <td className="px-6 py-4">
                  {txn.type === 'payment' ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      ↓ Payment
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      ↑ Payout
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{txn.vendorName}</p>
                    <p className="text-xs text-gray-500">{txn.vendorId}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">₹{txn.amount.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    ✓ Success
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(txn.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="View Details">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
