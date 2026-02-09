// 'use client';

// import { useState } from 'react';
// import { useOnboardingStore } from '@/lib/store';

// export default function ShopDetails() {
//   const { shopName, phone, city, shopType, setShopDetails, setCurrentStep } = useOnboardingStore();

//   const [formData, setFormData] = useState({
//     shopName: shopName || '',
//     phone: phone || '',
//     city: city || '',
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
//     <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="bg-orange-100 p-2 rounded-lg">
//           <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//           </svg>
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900">Enter Shop Details</h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* Shop Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Shop Name
//           </label>
//           <input
//             type="text"
//             placeholder="e.g. Chai Point"
//             value={formData.shopName}
//             onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${
//               errors.shopName ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.shopName && <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>}
//         </div>

//         {/* Shop Type */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Shop Type
//           </label>
//           <select
//             value={formData.shopType}
//             onChange={(e) => setFormData({ ...formData, shopType: e.target.value })}
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${
//               errors.shopType ? 'border-red-500' : 'border-gray-300'
//             }`}
//           >
//             <option value="">Select Category</option>
//             {shopTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//           {errors.shopType && <p className="text-red-500 text-sm mt-1">{errors.shopType}</p>}
//         </div>

//         {/* Phone Number */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Phone Number
//           </label>
//           <div className="flex">
//             <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
//               +91
//             </span>
//             <input
//               type="tel"
//               placeholder="98765 43210"
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
//               className={`w-full px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${
//                 errors.phone ? 'border-red-500' : 'border-gray-300'
//               }`}
//             />
//           </div>
//           {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
//         </div>

//         {/* City */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             City
//           </label>
//           <input
//             type="text"
//             placeholder="e.g. Bangalore"
//             value={formData.city}
//             onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${
//               errors.city ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
//         </div>
//       </div>

//       <div className="flex justify-end mt-8">
//         <button
//           onClick={handleNext}
//           className="px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
//         >
//           Next Step
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/lib/store';

export default function ShopDetails() {
  const { shopName, phone, city, state, shopType, setShopDetails, setCurrentStep } = useOnboardingStore();

  const [formData, setFormData] = useState({
    shopName: shopName || '',
    phone: phone || '',
    city: city || '',
    state: state || '', // ADD THIS
    shopType: shopType || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const shopTypes = ['Restaurant', 'Cafe', 'Stall', 'Xerox', 'Grocery', 'Retail', 'Other'];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // ADD STATE VALIDATION
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.shopType) {
      newErrors.shopType = 'Please select a shop type';
    }

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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Name *
          </label>
          <input
            type="text"
            value={formData.shopName}
            onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
            placeholder="Enter your shop name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
          {errors.shopName && (
            <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>
          )}
        </div>

        {/* Shop Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shop Type *
          </label>
          <select
            value={formData.shopType}
            onChange={(e) => setFormData({ ...formData, shopType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          >
            <option value="">Select shop type</option>
            {shopTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.shopType && (
            <p className="text-red-500 text-sm mt-1">{errors.shopType}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
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
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Enter your city"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        {/* ADD STATE FIELD */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Enter your state"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
          )}
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
