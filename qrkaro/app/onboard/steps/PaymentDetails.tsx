// 'use client';

// import { useState } from 'react';
// import { useOnboardingStore } from '@/lib/store';

// export default function PaymentDetails() {
//   const { accountHolderName, accountNumber, ifscCode, panNumber, setPaymentDetails, setCurrentStep } = useOnboardingStore();

//   const [formData, setFormData] = useState({
//     accountHolderName: accountHolderName || '',
//     accountNumber: accountNumber || '',
//     ifscCode: ifscCode || '',
//     panNumber: panNumber || '',
//   });

//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

//   const validateForm = () => {
//     const newErrors: { [key: string]: string } = {};

//     if (!formData.accountHolderName.trim()) {
//       newErrors.accountHolderName = 'Account holder name is required';
//     }

//     if (!formData.accountNumber.trim()) {
//       newErrors.accountNumber = 'Account number is required';
//     } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
//       newErrors.accountNumber = 'Enter a valid account number (9-18 digits)';
//     }

//     if (!formData.ifscCode.trim()) {
//       newErrors.ifscCode = 'IFSC code is required';
//     } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
//       newErrors.ifscCode = 'Enter a valid IFSC code';
//     }

//     if (!formData.panNumber.trim()) {
//       newErrors.panNumber = 'PAN number is required';
//     } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
//       newErrors.panNumber = 'Enter a valid PAN number';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (validateForm()) {
//       setPaymentDetails({
//         ...formData,
//         ifscCode: formData.ifscCode.toUpperCase(),
//         panNumber: formData.panNumber.toUpperCase(),
//       });
//       setCurrentStep(4);
//     }
//   };

//   const handleBack = () => {
//     setCurrentStep(2);
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="bg-orange-100 p-2 rounded-lg">
//           <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//           </svg>
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
//       </div>

//       <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//         <div className="flex gap-2">
//           <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <div>
//             <p className="text-sm font-medium text-blue-900">Secure Payments</p>
//             <p className="text-sm text-blue-700 mt-1">
//               Link your bank account. Payments go directly from customers to your bank account.
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="space-y-6">
//         {/* Account Holder Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Account Holder Name
//           </label>
//           <input
//             type="text"
//             placeholder="e.g. Rajesh Kumar"
//             value={formData.accountHolderName}
//             onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${
//               errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.accountHolderName && <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>}
//         </div>

//         {/* Account Number */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Bank Account Number
//           </label>
//           <input
//             type="text"
//             placeholder="e.g. 1234567890123456"
//             value={formData.accountNumber}
//             onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${
//               errors.accountNumber ? 'border-red-500' : 'border-gray-300'
//             }`}
//           />
//           {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* IFSC Code */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               IFSC Code
//             </label>
//             <input
//               type="text"
//               placeholder="e.g. SBIN0001234"
//               value={formData.ifscCode}
//               onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${
//                 errors.ifscCode ? 'border-red-500' : 'border-gray-300'
//               }`}
//               maxLength={11}
//             />
//             {errors.ifscCode && <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>}
//           </div>

//           {/* PAN Number */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               PAN Number
//             </label>
//             <input
//               type="text"
//               placeholder="e.g. ABCDE1234F"
//               value={formData.panNumber}
//               onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition ${
//                 errors.panNumber ? 'border-red-500' : 'border-gray-300'
//               }`}
//               maxLength={10}
//             />
//             {errors.panNumber && <p className="text-red-500 text-sm mt-1">{errors.panNumber}</p>}
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-between mt-8">
//         <button
//           onClick={handleBack}
//           className="px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
//         >
//           Back
//         </button>
//         <button
//           onClick={handleNext}
//           className="px-8 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition"
//         >
//           Preview
//         </button>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/lib/store';

export default function PaymentDetails() {
  const { 
    upiId,
    accountHolderName,
    bankAccount,
    ifscCode,
    setPaymentDetails, 
    setCurrentStep 
  } = useOnboardingStore();

  const [formData, setFormData] = useState({
    upiId: upiId || '',
    accountHolderName: accountHolderName || '',
    bankAccount: bankAccount || '',
    ifscCode: ifscCode || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (!formData.upiId.trim()) {
      newErrors.upiId = 'UPI ID is required';
    } else if (!/^[\w.-]+@[\w]+$/.test(formData.upiId)) {
      newErrors.upiId = 'Enter a valid UPI ID (e.g., name@paytm)';
    }

    // Bank account is optional
    if (formData.bankAccount && !/^\d{9,18}$/.test(formData.bankAccount)) {
      newErrors.bankAccount = 'Enter a valid account number (9-18 digits)';
    }

    if (formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Enter a valid IFSC code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setPaymentDetails({
        upiId: formData.upiId,
        accountHolderName: formData.accountHolderName,
        bankAccount: formData.bankAccount,
        ifscCode: formData.ifscCode.toUpperCase(),
      });
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setCurrentStep(2);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Details</h2>
      <p className="text-gray-600 mb-6">
        Enter your UPI ID to receive payments instantly
      </p>

      <div className="space-y-6">
        {/* Account Holder Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account Holder Name *
          </label>
          <input
            type="text"
            value={formData.accountHolderName}
            onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
            placeholder="Enter name as per bank account"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
          {errors.accountHolderName && (
            <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            This should match your bank account name
          </p>
        </div>

        {/* UPI ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            UPI ID *
          </label>
          <input
            type="text"
            value={formData.upiId}
            onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
            placeholder="yourname@paytm"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
          {errors.upiId && (
            <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Enter your UPI ID (e.g., 9876543210@paytm, yourname@ybl, yourname@okaxis)
          </p>
          
          {/* Help Box */}
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              💡 How to find your UPI ID:
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
              <li>Open any UPI app (Paytm, PhonePe, Google Pay, etc.)</li>
              <li>Go to Profile or Settings</li>
              <li>Look for "UPI ID" or "VPA"</li>
            </ul>
          </div>
        </div>

        {/* Optional: Bank Account Backup */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 font-medium hover:text-orange-600">
            + Add bank account as backup (optional)
          </summary>
          <div className="mt-4 space-y-4 border-l-2 border-orange-200 pl-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Account Number
              </label>
              <input
                type="text"
                placeholder="Bank Account Number"
                value={formData.bankAccount}
                onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              {errors.bankAccount && (
                <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IFSC Code
              </label>
              <input
                type="text"
                placeholder="IFSC Code"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              />
              {errors.ifscCode && (
                <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>
              )}
            </div>
          </div>
        </details>

        {/* Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800">
                Instant Payments to Your UPI
              </p>
              <p className="text-sm text-green-700 mt-1">
                You'll receive 95% of each order amount directly to your UPI within seconds. Platform keeps 5% as service fee.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleBack}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!formData.upiId.trim() || !formData.accountHolderName.trim()}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition"
        >
          Preview & Submit
        </button>
      </div>
    </div>
  );
}

