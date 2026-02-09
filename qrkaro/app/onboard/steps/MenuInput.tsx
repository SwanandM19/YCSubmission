// 'use client';

// import { useState } from 'react';
// import { useOnboardingStore } from '@/lib/store';

// export default function MenuInput() {
//   const { menuItems, setMenuItems, setCurrentStep } = useOnboardingStore();

//   const [items, setItems] = useState(menuItems.length > 0 ? menuItems : [{ name: '', price: 0 }]);
//   const [errors, setErrors] = useState<string>('');

//   const addItem = () => {
//     setItems([...items, { name: '', price: 0 }]);
//   };

//   const removeItem = (index: number) => {
//     if (items.length > 1) {
//       setItems(items.filter((_, i) => i !== index));
//     }
//   };

//   const updateItem = (index: number, field: 'name' | 'price', value: string | number) => {
//     const newItems = [...items];
//     newItems[index] = { ...newItems[index], [field]: value };
//     setItems(newItems);
//   };

//   const validateMenu = () => {
//     const validItems = items.filter((item) => item.name.trim() && item.price > 0);
    
//     if (validItems.length === 0) {
//       setErrors('Please add at least one menu item with name and price');
//       return false;
//     }

//     setErrors('');
//     return true;
//   };

//   const handleNext = () => {
//     if (validateMenu()) {
//       const validItems = items.filter((item) => item.name.trim() && item.price > 0);
//       setMenuItems(validItems);
//       setCurrentStep(3);
//     }
//   };

//   const handleBack = () => {
//     setCurrentStep(1);
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="bg-orange-100 p-2 rounded-lg">
//           <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900">Add Menu Items</h2>
//       </div>

//       <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
//         {items.map((item, index) => (
//           <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Item Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="e.g. Masala Chai"
//                 value={item.name}
//                 onChange={(e) => updateItem(index, 'name', e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//               />
//             </div>
//             <div className="w-32">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Price (₹)
//               </label>
//               <input
//                 type="number"
//                 placeholder="0"
//                 min="0"
//                 value={item.price || ''}
//                 onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
//               />
//             </div>
//             {items.length > 1 && (
//               <button
//                 onClick={() => removeItem(index)}
//                 className="mt-7 p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
//                 title="Remove item"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//               </button>
//             )}
//           </div>
//         ))}
//       </div>

//       <button
//         onClick={addItem}
//         className="mt-4 flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition"
//       >
//         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//         </svg>
//         Add Another Item
//       </button>

//       {errors && (
//         <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-600 text-sm">{errors}</p>
//         </div>
//       )}

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
//           Next Step
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { useState, useRef } from 'react';
import { useOnboardingStore } from '@/lib/store';

interface MenuItem {
  name: string;
  price: number;
}

export default function MenuInput() {
  const { setCurrentStep, setMenuItems, menuItems } = useOnboardingStore();
  
  const [items, setItems] = useState<MenuItem[]>(menuItems || []);
  const [menuImage, setMenuImage] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'camera' | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload from gallery
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setUploadMethod('upload');

    try {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Send to Flask backend
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('https://ooommmggg-menu-extractor-api.hf.space/extract-menu', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setItems(data.menuItems);
        alert(`✅ Successfully extracted ${data.menuItems.length} menu items!`);
      } else {
        throw new Error(data.error || 'Failed to extract menu items');
      }
    } catch (error: any) {
      alert('❌ Error processing image: ' + error.message);
      setMenuImage(null);
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Handle camera capture
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setUploadMethod('camera');

    try {
      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMenuImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Send to Flask backend
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('https://ooommmggg-menu-extractor-api.hf.space/extract-menu', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setItems(data.menuItems);
        alert(`✅ Successfully extracted ${data.menuItems.length} menu items!`);
      } else {
        throw new Error(data.error || 'Failed to extract menu items');
      }
    } catch (error: any) {
      alert('❌ Error processing image: ' + error.message);
      setMenuImage(null);
    } finally {
      setIsProcessingImage(false);
    }
  };

  // Edit extracted menu item
  const handleEditItem = (index: number, field: 'name' | 'price', value: string) => {
    const updatedItems = [...items];
    if (field === 'price') {
      updatedItems[index][field] = parseFloat(value) || 0;
    } else {
      updatedItems[index][field] = value;
    }
    setItems(updatedItems);
  };

  // Remove menu item
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Clear and re-upload
  const handleReupload = () => {
    setMenuImage(null);
    setItems([]);
    setUploadMethod(null);
  };

  const handleNext = () => {
    if (items.length === 0) {
      alert('Please upload a menu image to extract items');
      return;
    }
    setMenuItems(items);
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Menu</h2>
      <p className="text-gray-600 mb-6">
        Upload a photo of your menu, and we'll extract the items automatically using AI
      </p>

      {!menuImage ? (
        <div className="space-y-4">
          {/* Upload from Gallery */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingImage}
            className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition flex flex-col items-center gap-3 disabled:opacity-50"
          >
            <svg
              className="w-12 h-12 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-lg">Upload Menu Image</p>
              <p className="text-sm text-gray-500">Click to select from gallery</p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Capture from Camera */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isProcessingImage}
            className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition flex flex-col items-center gap-3 disabled:opacity-50"
          >
            <svg
              className="w-12 h-12 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="text-center">
              <p className="font-semibold text-gray-900 text-lg">Capture with Camera</p>
              <p className="text-sm text-gray-500">Click to open camera</p>
            </div>
          </button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />

          {isProcessingImage && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Processing image with AI...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Image Preview */}
          <div className="mb-6">
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
              <img
                src={menuImage}
                alt="Menu"
                className="w-full h-64 object-contain bg-gray-50"
              />
              <button
                onClick={handleReupload}
                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={handleReupload}
              className="mt-3 text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Upload different image
            </button>
          </div>

          {/* Extracted Menu Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Extracted Menu Items ({items.length})
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✓ AI Extracted
              </span>
            </div>

            {items.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleEditItem(index, 'name', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="Item name"
                      />
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleEditItem(index, 'price', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No items extracted. Try uploading a clearer image.</p>
              </div>
            )}
          </div>
        </div>
      )}

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
          disabled={isProcessingImage || items.length === 0}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}