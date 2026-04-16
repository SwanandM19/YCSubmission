

'use client';

import { useRouter } from 'next/navigation';
import { useVendorAuthStore } from '@/lib/vendorAuthStore';
import { useEffect, useState } from 'react';

export default function VendorSettingsPage() {
  const router = useRouter();
  const { vendorId, shopName, logout, isAuthenticated } = useVendorAuthStore();

  const [hydrated, setHydrated] = useState(false);
  const [vendor, setVendor] = useState<any>(null);

  // ── Change Password State ────────────────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  // ── UPI Edit State ───────────────────────────────────────────────────────
const [upiId, setUpiId] = useState('');
const [editingUpi, setEditingUpi] = useState(false);
const [upiLoading, setUpiLoading] = useState(false);

  // ── Hydration guard ──────────────────────────────────────────────────────
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.push('/vendor/login');
      return;
    }
    if (vendorId) fetchVendor();
  }, [hydrated, isAuthenticated, vendorId]);

  const fetchVendor = async () => {
    try {
      const res = await fetch(`/api/vendor?vendorId=${vendorId}`);
      const data = await res.json();
      setVendor(data);
      setUpiId(data.upiId || ''); // ✅ ADD THIS LINE
    } catch (error) {
      console.error('Error fetching vendor:', error);
    }
  };
const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    logout();
    // ✅ Use replace so back button can't return to dashboard
    router.replace('/vendor/login');
  }
};


  const downloadQR = () => {
    if (!vendor?.qrCode) {
      alert('QR code not available.');
      return;
    }
    const link = document.createElement('a');
    link.href = vendor.qrCode;
    link.download = `${shopName || 'shop'}-qr.png`;
    link.click();
  };

  // ── Change Password Handler ──────────────────────────────────────────────
  const handleChangePassword = async () => {
    setPasswordMsg('');
    setPasswordError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (passwordForm.newPassword === vendorId) {
      setPasswordError('New password cannot be the same as your Vendor ID.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch('/api/vendor/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPasswordMsg('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // ── UPI Update Handler ───────────────────────────────────────────────────
const handleUpiUpdate = async () => {
  if (!upiId.trim()) return alert('UPI ID cannot be empty');
  const upiRegex = /^[\w.\-]{2,}@[\w]{2,}$/;
  if (!upiRegex.test(upiId.trim())) return alert('Enter a valid UPI ID (e.g. name@upi)');
  setUpiLoading(true);
  try {
    const res = await fetch('/api/update-upi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vendorId, upiId: upiId.trim() }),
    });
    const data = await res.json();
    if (res.ok) { alert('✅ UPI ID updated!'); setEditingUpi(false); }
    else alert(data.error || 'Failed to update');
  } catch { alert('Something went wrong'); }
  finally { setUpiLoading(false); }
};

  // ── Loading / SSR guard ──────────────────────────────────────────────────
  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      {/* <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 pt-12 pb-6"> */}
      {/* <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 pt-6 pb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-orange-100 text-sm mt-1">Manage your account & preferences</p>
      </div> */}
<div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 mx-4 mt-4 shadow-lg shadow-orange-200">
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-white text-3xl font-black flex-shrink-0">
      {shopName?.charAt(0)?.toUpperCase() || 'V'}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-bold text-white text-xl truncate">{shopName}</p>
      <p className="text-xs text-orange-100 font-mono mt-0.5 truncate">ID: {vendorId}</p>
      <span className="inline-flex items-center gap-1 mt-2 text-xs bg-white/20 text-white px-2.5 py-1 rounded-full font-medium">
        <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span>
        Verified Vendor
      </span>
    </div>
  </div>
</div>

      {/* <div className="px-4 py-6 space-y-4"> */}
      <div className="px-4 py-4 space-y-4">

        {/* ── Vendor Profile Card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {shopName?.charAt(0)?.toUpperCase() || 'V'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-lg truncate">{shopName}</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5 truncate">ID: {vendorId}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Verified Vendor
            </span>
          </div>
        </div>

        {/* ── Shop Management ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <p className="px-5 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Shop Management
          </p>

          <button
            onClick={() => router.push('/vendor/dashboard/settings/edit-shop')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Edit Shop Details</p>
                <p className="text-xs text-gray-500">Name, location, contact</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={() => router.push('/vendor/dashboard/menu')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Edit Menu / Services</p>
                <p className="text-xs text-gray-500">Add, edit or remove items</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

                {/* ── Payment Settings ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <p className="px-5 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Payment Settings
          </p>
          <div className="px-5 pb-5">
            <p className="text-xs font-medium text-gray-700 mb-2">UPI ID</p>
            {editingUpi ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpiUpdate}
                    disabled={upiLoading}
                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl text-sm transition"
                  >
                    {upiLoading ? 'Saving...' : 'Save UPI ID'}
                  </button>
                  <button
                    onClick={() => { setEditingUpi(false); setUpiId(vendor?.upiId || ''); }}
                    className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{upiId || 'Not set'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Payments settled to this UPI</p>
                </div>
                <button
                  onClick={() => setEditingUpi(true)}
                  className="text-orange-500 font-semibold text-sm hover:text-orange-600 transition"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Change Password ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 pt-4 pb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Security</p>
          </div>

          <div className="px-5 pb-5">
            {/* Vendor ID display */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <div>
                <p className="text-xs text-gray-500">Your Vendor ID (never changes)</p>
                <p className="text-xs font-mono text-gray-700 font-medium">{vendorId}</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Current Password */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Current Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Confirm New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              {/* Show passwords toggle */}
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPasswords}
                  onChange={() => setShowPasswords(!showPasswords)}
                  className="rounded accent-orange-500"
                />
                Show passwords
              </label>

              {/* Error / Success messages */}
              {passwordError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {passwordError}
                </div>
              )}
              {passwordMsg && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {passwordMsg}
                </div>
              )}

              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition text-sm"
              >
                {isChangingPassword ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Changing...
                  </span>
                ) : '🔐 Change Password'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Assets & Support ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <p className="px-5 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Assets & Support
          </p>

          <button
            onClick={downloadQR}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Download QR Code</p>
                <p className="text-xs text-gray-500">Share with your customers</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          <a
            href="mailto:support@nosher.in"
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Support Contact</p>
                <p className="text-xs text-gray-500">support@nosher.in</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* ── Logout ──────────────────────────────────────────────────────── */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold rounded-2xl transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>

        <p className="text-center text-xs text-gray-400">Nosher v2.5.0</p>

      </div>

      {/* ── Bottom Navigation ──────────────────────────────────────────────
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-around z-50">
        <button onClick={() => router.push('/vendor/dashboard')} className="flex flex-col items-center gap-1 text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => router.push('/vendor/dashboard')} className="flex flex-col items-center gap-1 text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-xs">Orders</span>
        </button>
        <button onClick={() => router.push('/vendor/dashboard/menu')} className="flex flex-col items-center gap-1 text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="text-xs">Menu</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-orange-500">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-semibold">Settings</span>
        </button>
      </div> */}
    </div>
  );
}
