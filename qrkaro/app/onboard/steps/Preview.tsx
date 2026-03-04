// 'use client';

// import { useState } from 'react';
// import { useOnboardingStore } from '@/lib/store';

// export default function Preview() {
//   const store = useOnboardingStore();
//   const [isLoading, setIsLoading] = useState(false);

//   const handleProceedToPayment = () => {
//     setIsLoading(true);
//     store.setCurrentStep(5);
//     setIsLoading(false);
//   };

//   const handleBack = () => {
//     store.setCurrentStep(3);
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-8">
//       <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Details</h2>
//       <p className="text-gray-600 mb-6">
//         Please verify all information before proceeding to payment
//       </p>

//       {/* Shop Details */}
//       <div className="space-y-6">
//         <div className="border-b pb-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">Shop Information</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Shop Name</p>
//               <p className="font-medium text-gray-900">{store.shopName}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Shop Type</p>
//               <p className="font-medium text-gray-900">{store.shopType}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Phone</p>
//               <p className="font-medium text-gray-900">+91 {store.phone}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">City</p>
//               <p className="font-medium text-gray-900">{store.city}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">State</p>
//               <p className="font-medium text-gray-900">{store.state}</p>
//             </div>
//           </div>
//         </div>

//         {/* Menu Items */}
//         <div className="border-b pb-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">
//             Menu Items ({store.menuItems.length})
//           </h3>
//           <div className="space-y-2 max-h-60 overflow-y-auto">
//             {store.menuItems.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
//               >
//                 <span className="text-gray-900">{item.name}</span>
//                 <span className="font-semibold text-orange-600">₹{item.price}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Payment Details */}
//         <div className="border-b pb-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Account Holder</p>
//               <p className="font-medium text-gray-900">{store.accountHolderName}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">UPI ID</p>
//               <p className="font-medium text-gray-900">{store.upiId}</p>
//             </div>
//           </div>
//         </div>

//         {/* Subscription Info */}
//         <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-2xl p-6">
//           <div className="flex items-center gap-4 mb-4">
//             <div className="p-4 bg-orange-500 rounded-xl">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div className="flex-1">
//               <p className="text-2xl font-bold text-gray-900">₹200 one-time setup fee</p>
//               <p className="text-sm text-gray-700 mt-1">Get your QR code, vendor app, and customer website</p>
//             </div>
//           </div>
          
//           <div className="space-y-2 text-sm text-gray-800">
//             <div className="flex items-center gap-2">
//               <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span>Custom QR code for your shop</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span>Vendor dashboard app access</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span>Customer ordering website</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Buttons */}
//       <div className="flex gap-4 mt-8">
//         <button
//           onClick={handleBack}
//           disabled={isLoading}
//           className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
//         >
//           Back
//         </button>
//         <button
//           onClick={handleProceedToPayment}
//           disabled={isLoading}
//           className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition shadow-lg disabled:opacity-50"
//         >
//           {isLoading ? 'Loading...' : 'Proceed to Payment →'}
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/lib/store';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const SHOP_TYPES = ['Restaurant', 'Cafe', 'Stall', 'Xerox', 'Grocery', 'Retail', 'Other'];

interface EditableShopDetails {
  shopName: string;
  shopType: string;
  phone: string;
  city: string;
  state: string;
}

interface EditablePaymentDetails {
  accountHolderName: string;
  upiId: string;
}

export default function Preview() {
  const store = useOnboardingStore();

  // ── Edit mode toggles ──────────────────────────────────────────────────────
  const [editingShop, setEditingShop] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);
  const [editingMenuIndex, setEditingMenuIndex] = useState<number | null>(null);

  // ── Local edit states ──────────────────────────────────────────────────────
  const [shopDraft, setShopDraft] = useState<EditableShopDetails>({
    shopName: store.shopName,
    shopType: store.shopType,
    phone: store.phone,
    city: store.city,
    state: store.state,
  });

  const [paymentDraft, setPaymentDraft] = useState<EditablePaymentDetails>({
    accountHolderName: store.accountHolderName,
    upiId: store.upiId,
  });

  const [menuDraft, setMenuDraft] = useState(store.menuItems.map((i) => ({ ...i })));
  const [stateSearch, setStateSearch] = useState(store.state);
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: 0 });
  const [showAddItem, setShowAddItem] = useState(false);

  // ── Shop Details Save ──────────────────────────────────────────────────────
  const saveShopDetails = () => {
    if (!shopDraft.shopName.trim() || !shopDraft.city.trim() || !shopDraft.state.trim()) {
      alert('Shop name, city, and state are required.');
      return;
    }
    store.setShopDetails(shopDraft);
    setEditingShop(false);
  };

  // ── Payment Details Save ───────────────────────────────────────────────────
  const savePaymentDetails = () => {
    if (!paymentDraft.accountHolderName.trim() || !paymentDraft.upiId.trim()) {
      alert('Account holder name and UPI ID are required.');
      return;
    }
    store.setPaymentDetails({ ...paymentDraft, bankAccount: store.bankAccount, ifscCode: store.ifscCode });
    setEditingPayment(false);
  };

  // ── Menu Item Editing ──────────────────────────────────────────────────────
  const saveMenuEdit = (index: number) => {
    const item = menuDraft[index];
    if (!item.name.trim() || item.price <= 0) {
      alert('Item name and a valid price are required.');
      return;
    }
    store.setMenuItems(menuDraft);
    setEditingMenuIndex(null);
  };

  const removeMenuItem = (index: number) => {
    const updated = menuDraft.filter((_, i) => i !== index);
    setMenuDraft(updated);
    store.setMenuItems(updated);
  };

  const addNewItem = () => {
    if (!newItem.name.trim() || newItem.price <= 0) {
      alert('Please enter item name and price.');
      return;
    }
    const updated = [...menuDraft, { ...newItem }];
    setMenuDraft(updated);
    store.setMenuItems(updated);
    setNewItem({ name: '', price: 0 });
    setShowAddItem(false);
  };

  const handleProceedToPayment = () => {
    store.setCurrentStep(5);
  };

  const handleBack = () => {
    store.setCurrentStep(3);
  };

  // ── Edit Pencil Button ─────────────────────────────────────────────────────
  const EditBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium px-3 py-1.5 rounded-lg hover:bg-orange-50 transition"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      Edit
    </button>
  );

  const SaveBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium px-3 py-1.5 rounded-lg hover:bg-green-50 transition"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      Save
    </button>
  );

  const CancelBtn = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
    >
      Cancel
    </button>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Details</h2>
      <p className="text-gray-600 mb-6">
        Click <span className="text-orange-600 font-medium">Edit</span> on any section to update it directly here
      </p>

      <div className="space-y-6">

        {/* ── SHOP INFORMATION ────────────────────────────────────────────── */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">🏪 Shop Information</h3>
            {!editingShop
              ? <EditBtn onClick={() => { setShopDraft({ shopName: store.shopName, shopType: store.shopType, phone: store.phone, city: store.city, state: store.state }); setStateSearch(store.state); setEditingShop(true); }} />
              : <div className="flex gap-2">
                  <CancelBtn onClick={() => setEditingShop(false)} />
                  <SaveBtn onClick={saveShopDetails} />
                </div>
            }
          </div>

          {!editingShop ? (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Shop Name', value: store.shopName },
                { label: 'Shop Type', value: store.shopType },
                { label: 'Phone', value: `+91 ${store.phone}` },
                { label: 'City', value: store.city },
                { label: 'State', value: store.state },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="font-medium text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* Shop Name */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Shop Name *</label>
                <input
                  type="text"
                  value={shopDraft.shopName}
                  onChange={(e) => setShopDraft({ ...shopDraft, shopName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                />
              </div>

              {/* Shop Type */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Shop Type *</label>
                <select
                  value={shopDraft.shopType}
                  onChange={(e) => setShopDraft({ ...shopDraft, shopType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                >
                  {SHOP_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Phone *</label>
                <div className="flex">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={shopDraft.phone}
                    onChange={(e) => setShopDraft({ ...shopDraft, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">City *</label>
                <input
                  type="text"
                  value={shopDraft.city}
                  onChange={(e) => setShopDraft({ ...shopDraft, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                />
              </div>

              {/* State - Searchable Dropdown */}
              <div className="relative col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">State *</label>
                <input
                  type="text"
                  value={stateSearch}
                  onChange={(e) => {
                    setStateSearch(e.target.value);
                    setShopDraft({ ...shopDraft, state: '' });
                    setShowStateDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => stateSearch.length > 0 && setShowStateDropdown(true)}
                  onBlur={() => setTimeout(() => setShowStateDropdown(false), 150)}
                  placeholder="Type to search state..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                />
                {shopDraft.state && (
                  <span className="absolute right-3 top-8 text-green-500">✓</span>
                )}
                {showStateDropdown && (
                  <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {INDIAN_STATES.filter((s) => s.toLowerCase().startsWith(stateSearch.toLowerCase())).map((s) => (
                      <li key={s} onMouseDown={() => { setStateSearch(s); setShopDraft({ ...shopDraft, state: s }); setShowStateDropdown(false); }}
                        className="px-3 py-2 cursor-pointer hover:bg-orange-50 hover:text-orange-600 text-sm">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── MENU ITEMS ───────────────────────────────────────────────────── */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              🍽️ Menu Items ({menuDraft.length})
            </h3>
            <button
              onClick={() => setShowAddItem(!showAddItem)}
              className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium px-3 py-1.5 rounded-lg hover:bg-orange-50 transition"
            >
              + Add Item
            </button>
          </div>

          {/* Add New Item Row */}
          {showAddItem && (
            <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-xl mb-3">
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
              />
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
                <span className="px-2 py-2 bg-gray-100 text-gray-500 text-sm border-r border-gray-300">₹</span>
                <input
                  type="number"
                  value={newItem.price || ''}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="w-20 px-2 py-2 outline-none text-sm"
                  min="0"
                />
              </div>
              <button onClick={addNewItem} className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition">Add</button>
              <button onClick={() => setShowAddItem(false)} className="px-3 py-2 text-gray-500 hover:bg-gray-100 text-sm rounded-lg transition">Cancel</button>
            </div>
          )}

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {menuDraft.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                {editingMenuIndex === index ? (
                  <>
                    <span className="text-xs text-gray-400 w-5 text-center">{index + 1}</span>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => { const u = [...menuDraft]; u[index].name = e.target.value; setMenuDraft(u); }}
                      className="flex-1 px-3 py-1.5 border border-orange-400 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      autoFocus
                    />
                    <div className="flex items-center border border-orange-400 rounded-lg overflow-hidden">
                      <span className="px-2 py-1.5 bg-gray-100 text-gray-500 text-sm border-r border-gray-300">₹</span>
                      <input
                        type="number"
                        value={item.price || ''}
                        onChange={(e) => { const u = [...menuDraft]; u[index].price = parseFloat(e.target.value) || 0; setMenuDraft(u); }}
                        className="w-20 px-2 py-1.5 outline-none text-sm"
                        min="0"
                      />
                    </div>
                    <button onClick={() => saveMenuEdit(index)} className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button onClick={() => setEditingMenuIndex(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-gray-400 w-5 text-center">{index + 1}</span>
                    <span className="flex-1 text-gray-900 text-sm">{item.name}</span>
                    <span className="font-semibold text-orange-600 text-sm">₹{item.price}</span>
                    <button onClick={() => setEditingMenuIndex(index)} className="p-1.5 text-orange-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => removeMenuItem(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── PAYMENT DETAILS ──────────────────────────────────────────────── */}
        <div className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">💳 Payment Details</h3>
            {!editingPayment
              ? <EditBtn onClick={() => { setPaymentDraft({ accountHolderName: store.accountHolderName, upiId: store.upiId }); setEditingPayment(true); }} />
              : <div className="flex gap-2">
                  <CancelBtn onClick={() => setEditingPayment(false)} />
                  <SaveBtn onClick={savePaymentDetails} />
                </div>
            }
          </div>

          {!editingPayment ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Account Holder</p>
                <p className="font-medium text-gray-900">{store.accountHolderName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">UPI ID</p>
                <p className="font-medium text-gray-900">{store.upiId}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Account Holder Name *</label>
                <input
                  type="text"
                  value={paymentDraft.accountHolderName}
                  onChange={(e) => setPaymentDraft({ ...paymentDraft, accountHolderName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">UPI ID *</label>
                <input
                  type="text"
                  value={paymentDraft.upiId}
                  onChange={(e) => setPaymentDraft({ ...paymentDraft, upiId: e.target.value })}
                  placeholder="yourname@upi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── SUBSCRIPTION INFO ────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-orange-500 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">₹200 one-time setup fee</p>
              <p className="text-sm text-gray-700 mt-1">Get your QR code, vendor app & customer website</p>
            </div>
          </div>
          {['Custom QR code for your shop', 'Vendor dashboard app access', 'Customer ordering website'].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-gray-800 mb-2">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {f}
            </div>
          ))}
        </div>

      </div>

      {/* ── Navigation ───────────────────────────────────────────────────────── */}
      <div className="flex gap-4 mt-8">
        <button onClick={handleBack}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
          Back
        </button>
        <button onClick={handleProceedToPayment}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition shadow-lg">
          Proceed to Payment →
        </button>
      </div>
    </div>
  );
}
