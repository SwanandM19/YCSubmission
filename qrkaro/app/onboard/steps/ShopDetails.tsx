


// 'use client';

// import { useState } from 'react';
// import { useOnboardingStore } from '@/lib/store';

// export default function ShopDetails() {
//   const { shopName, phone, city, state, shopType, setShopDetails, setCurrentStep } = useOnboardingStore();

//   const [formData, setFormData] = useState({
//     shopName: shopName || '',
//     phone: phone || '',
//     city: city || '',
//     state: state || '', // ADD THIS
//     shopType: shopType || '',
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const shopTypes = ['Restaurant', 'Cafe', 'Stall', 'Xerox', 'Grocery', 'Retail', 'Other'];

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!formData.shopName.trim()) {
//       newErrors.shopName = 'Shop name is required';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
//       newErrors.phone = 'Enter a valid 10-digit phone number';
//     }

//     if (!formData.city.trim()) {
//       newErrors.city = 'City is required';
//     }

//     // ADD STATE VALIDATION
//     if (!formData.state.trim()) {
//       newErrors.state = 'State is required';
//     }

//     if (!formData.shopType) {
//       newErrors.shopType = 'Please select a shop type';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateForm()) {
//       setShopDetails(formData);
//       setCurrentStep(2);
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-8">
//       <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop Details</h2>
//       <p className="text-gray-600 mb-6">Tell us about your business</p>

//       <div className="space-y-6">
//         {/* Shop Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Shop Name *
//           </label>
//           <input
//             type="text"
//             value={formData.shopName}
//             onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
//             placeholder="Enter your shop name"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//           />
//           {errors.shopName && (
//             <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>
//           )}
//         </div>

//         {/* Shop Type */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Shop Type *
//           </label>
//           <select
//             value={formData.shopType}
//             onChange={(e) => setFormData({ ...formData, shopType: e.target.value })}
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//           >
//             <option value="">Select shop type</option>
//             {shopTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//           {errors.shopType && (
//             <p className="text-red-500 text-sm mt-1">{errors.shopType}</p>
//           )}
//         </div>

//         {/* Phone */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Phone Number *
//           </label>
//           <div className="flex">
//             <span className="inline-flex items-center px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
//               +91
//             </span>
//             <input
//               type="tel"
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               placeholder="9876543210"
//               maxLength={10}
//               className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//             />
//           </div>
//           {errors.phone && (
//             <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
//           )}
//         </div>

//         {/* City */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             City *
//           </label>
//           <input
//             type="text"
//             value={formData.city}
//             onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//             placeholder="Enter your city"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//           />
//           {errors.city && (
//             <p className="text-red-500 text-sm mt-1">{errors.city}</p>
//           )}
//         </div>

//         {/* ADD STATE FIELD */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             State *
//           </label>
//           <input
//             type="text"
//             value={formData.state}
//             onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//             placeholder="Enter your state"
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//           />
//           {errors.state && (
//             <p className="text-red-500 text-sm mt-1">{errors.state}</p>
//           )}
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="mt-8">
//         <button
//           onClick={handleNext}
//           className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
//         >
//           Next Step
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useRef, useEffect } from 'react';
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

export default function ShopDetails() {
  const { shopName, phone, city, state, shopType, setShopDetails, setCurrentStep } = useOnboardingStore();

  const [formData, setFormData] = useState({
    shopName: shopName || '',
    phone: phone || '',
    city: city || '',
    state: state || '',
    shopType: shopType || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stateSearch, setStateSearch] = useState(state || '');
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [filteredStates, setFilteredStates] = useState<string[]>([]);
  const stateRef = useRef<HTMLDivElement>(null);

  const shopTypes = ['Restaurant', 'Cafe', 'Stall', 'Xerox', 'Grocery', 'Retail', 'Other'];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (stateRef.current && !stateRef.current.contains(e.target as Node)) {
        setShowStateDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStateSearch = (value: string) => {
    setStateSearch(value);
    setFormData({ ...formData, state: '' }); // clear until selected
    if (value.trim().length > 0) {
      const filtered = INDIAN_STATES.filter((s) =>
        s.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredStates(filtered);
      setShowStateDropdown(true);
    } else {
      setShowStateDropdown(false);
      setFilteredStates([]);
    }
  };

  const handleStateSelect = (selectedState: string) => {
    setStateSearch(selectedState);
    setFormData({ ...formData, state: selectedState });
    setShowStateDropdown(false);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.shopName.trim()) newErrors.shopName = 'Shop name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'Please select a valid state from the list';
    if (!formData.shopType) newErrors.shopType = 'Please select a shop type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setShopDetails(formData);
      setCurrentStep(2);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop Details</h2>
      <p className="text-gray-600 mb-6">Tell us about your business</p>

      <div className="space-y-6">
        {/* Shop Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name *</label>
          <input
            type="text"
            value={formData.shopName}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            placeholder="Enter your shop name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
          {errors.shopName && <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>}
        </div>

        {/* Shop Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shop Type *</label>
          <select
            value={formData.shopType}
            onChange={(e) => setFormData({ ...formData, shopType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="">Select shop type</option>
            {shopTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.shopType && <p className="text-red-500 text-sm mt-1">{errors.shopType}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <div className="flex">
            <span className="inline-flex items-center px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
              +91
            </span>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="9876543210"
              maxLength={10}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Enter your city"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
        </div>

        {/* State - Searchable Dropdown */}
        <div ref={stateRef} className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
          <div className="relative">
            <input
              type="text"
              value={stateSearch}
              onChange={(e) => handleStateSearch(e.target.value)}
              onFocus={() => {
                if (stateSearch.trim().length > 0) setShowStateDropdown(true);
              }}
              placeholder="Type to search state (e.g. Ma...)"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {/* Checkmark when selected */}
            {formData.state && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-lg">✓</span>
            )}
          </div>

          {/* Dropdown List */}
          {showStateDropdown && filteredStates.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
              {filteredStates.map((s) => (
                <li
                  key={s}
                  onMouseDown={() => handleStateSelect(s)}
                  className="px-4 py-3 cursor-pointer hover:bg-orange-50 hover:text-orange-600 transition text-sm"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}

          {/* No results */}
          {showStateDropdown && filteredStates.length === 0 && stateSearch.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500">
              No state found. Try typing differently.
            </div>
          )}

          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8">
        <button
          onClick={handleNext}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}
