

'use client';

import { useState, useRef } from 'react';
import { useOnboardingStore } from '@/lib/store';

// interface MenuItem {
//   name: string;
//   price: number;
// }

// ✅ Update MenuItem interface to support grocery fields:
interface MenuItem {
  name: string;
  price: number;
  category?: string;
  stock?: number | null;
  unit?: string;
  sku?: string;
  isVeg?: boolean;
  desc?: string;
}

interface UploadedImage {
  id: string;
  preview: string;
  file: File;
  status: 'pending' | 'processing' | 'done' | 'error';
  extractedCount?: number;
}

// ✅ Add this just above export default function MenuInput()
function getCurrentLang(): string {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  if (!match) return 'en';
  const parts = decodeURIComponent(match[1]).split('/');
  return parts[parts.length - 1] || 'en';
}

export default function MenuInput() {
  // const { setCurrentStep, setMenuItems, menuItems } = useOnboardingStore();
  const { setCurrentStep, setMenuItems, menuItems, shopType, setExcelFile, excelFile } = useOnboardingStore();

  const [items, setItems] = useState<MenuItem[]>(menuItems || []);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isProcessingAny, setIsProcessingAny] = useState(false);
  // const [inputMode, setInputMode] = useState<'ai' | 'manual'>('ai');
  const [inputMode, setInputMode] = useState<'ai' | 'manual' | 'excel'>(
  shopType === 'Grocery Store' ? 'excel' : 'ai'
);

  const [excelUploading, setExcelUploading] = useState(false);
  const [excelFileName, setExcelFileName] = useState<string | null>(null);
  const [excelItemCount, setExcelItemCount] = useState<number>(0);
  const excelInputRef = useRef<HTMLInputElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // ─── Process a single image file ───────────────────────────────────────────
  const processImageFile = async (file: File, imgId: string) => {
    const formData = new FormData();
    formData.append('image', file);

    setUploadedImages((prev) =>
      prev.map((img) => img.id === imgId ? { ...img, status: 'processing' } : img)
    );

    try {
      const response = await fetch('https://ooommmggg-menu-extractor-api.hf.space/extract-menu', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      // ✅ AFTER — translates names if non-English language is active
if (response.ok && data.success) {
  let extractedItems: MenuItem[] = data.menuItems;

  // Translate OCR names if a non-English language is active
  const currentLang = getCurrentLang();
  if (currentLang !== 'en' && extractedItems.length > 0) {
    try {
      const transRes = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: extractedItems.map((i) => i.name),
          target: currentLang,
        }),
      });
      const transData = await transRes.json();
      if (transData.translated) {
        extractedItems = extractedItems.map((item, i) => ({
          ...item,
          name: transData.translated[i] || item.name,
        }));
      }
    } catch {
      // Silent fallback — use original OCR names if translation fails
    }
  }

  setItems((prev) => {
    const existingNames = new Set(prev.map((i) => i.name.toLowerCase()));
    const newItems = extractedItems.filter(
      (i: MenuItem) => !existingNames.has(i.name.toLowerCase())
    );
    return [...prev, ...newItems];
  });

        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === imgId
              ? { ...img, status: 'done', extractedCount: data.menuItems.length }
              : img
          )
        );
      } else {
        throw new Error(data.error || 'Extraction failed');
      }
    } catch (error: any) {
      setUploadedImages((prev) =>
        prev.map((img) => img.id === imgId ? { ...img, status: 'error' } : img)
      );
    }
  };

  // ─── Handle multiple file uploads ──────────────────────────────────────────
  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessingAny(true);

    const newImages: UploadedImage[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      preview: URL.createObjectURL(file),
      file,
      status: 'pending' as const,
    }));

    setUploadedImages((prev) => [...prev, ...newImages]);

    // Process all images concurrently
    await Promise.all(newImages.map((img) => processImageFile(img.file, img.id)));

    setIsProcessingAny(false);
  };

  // ─── Remove an uploaded image ───────────────────────────────────────────────
  const handleRemoveImage = (imgId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imgId));
  };

  // ─── Edit menu item ─────────────────────────────────────────────────────────
  const handleEditItem = (index: number, field: 'name' | 'price', value: string) => {
    const updated = [...items];
    if (field === 'price') updated[index][field] = parseFloat(value) || 0;
    else updated[index][field] = value;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleAddManualItem = () => {
    setItems([...items, { name: '', price: 0 }]);
  };

  const handleExcelSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Save file to store
  setExcelFile(file);
  setExcelFileName(file.name);
  setExcelUploading(true);

  try {
    // Dynamically import xlsx (no extra bundle cost)
    const XLSX = await import('xlsx');

    // Read the file as ArrayBuffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Read first sheet only
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert sheet rows to JSON array
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    // Map each row to a MenuItem
    const parsed: MenuItem[] = rows
      .map((row) => ({
        name:     String(row['Name']     || row['name']     || '').trim(),
        price:    Number(row['Price']    || row['price']    || 0),
        category: String(row['Category'] || row['category'] || 'Other').trim(),
        stock:    row['Stock'] !== undefined ? Number(row['Stock']) : null,
        unit:     String(row['Unit']     || row['unit']     || '').trim(),
        sku:      String(row['SKU']      || row['sku']      || '').trim(),
        isVeg:    String(row['Veg']      || 'yes').toLowerCase() !== 'no',
        desc:     String(row['Description'] || row['desc'] || '').trim(),
      }))
      .filter(item => item.name && item.price > 0); // skip empty rows

    // Set items in state so they show in the list below
    setItems(parsed);
    setExcelItemCount(parsed.length);

  } catch (err) {
    alert('Failed to read Excel file. Please check the format.');
  } finally {
    setExcelUploading(false);
  }
};

  // ─── Navigation ─────────────────────────────────────────────────────────────
  // const handleNext = () => {
  //   if (items.length === 0) {
  //     alert('Please add at least one menu item before continuing.');
  //     return;
  //   }
  //   const validItems = items.filter((i) => i.name.trim() && i.price > 0);
  //   if (validItems.length === 0) {
  //     alert('Please ensure all items have a name and price greater than 0.');
  //     return;
  //   }
  //   setMenuItems(validItems);
  //   setCurrentStep(3);
  // };

  const handleNext = () => {
  // ✅ Grocery + Excel flow
  if (shopType === 'Grocery Store' && inputMode === 'excel') {
    if (items.length === 0) {
      alert('Please upload an Excel file with at least one product.');
      return;
    }
    setMenuItems(items);
    setCurrentStep(3);
    return;
  }

  // ✅ All other shop types (existing logic — unchanged)
  if (items.length === 0) {
    alert('Please add at least one menu item before continuing.');
    return;
  }
  const validItems = items.filter((i) => i.name.trim() && i.price > 0);
  if (validItems.length === 0) {
    alert('Please ensure all items have a name and price greater than 0.');
    return;
  }
  setMenuItems(validItems);
  setCurrentStep(3);
};

  const handleBack = () => setCurrentStep(1);

  const processingCount = uploadedImages.filter((i) => i.status === 'processing').length;
  const doneCount = uploadedImages.filter((i) => i.status === 'done').length;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Build Your Menu</h2>
      <p className="text-gray-600 mb-6">
        Upload menu photos for AI extraction, add items manually, or both!
      </p>

      {/* ── Mode Toggle ─────────────────────────────────────────────────────── */}
      {/* <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setInputMode('ai')}
          className={`flex-1 py-2.5 rounded-lg font-medium transition text-sm ${
            inputMode === 'ai'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📸 AI Menu Scan
        </button>
        <button
          onClick={() => setInputMode('manual')}
          className={`flex-1 py-2.5 rounded-lg font-medium transition text-sm ${
            inputMode === 'manual'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✏️ Manual Entry
        </button>
      </div> */}

      {/* ── Mode Toggle ─────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">

        {/* AI Scan tab — hidden for Grocery */}
        {shopType !== 'Grocery Store' && (
          <button
            onClick={() => setInputMode('ai')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition text-sm ${
              inputMode === 'ai'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📸 AI Menu Scan
          </button>
        )}

        {/* Excel tab — shown ONLY for Grocery */}
        {shopType === 'Grocery Store' && (
          <button
            onClick={() => setInputMode('excel')}
            className={`flex-1 py-2.5 rounded-lg font-medium transition text-sm ${
              inputMode === 'excel'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📦 Excel Upload
          </button>
        )}

        {/* Manual tab — always shown */}
        <button
          onClick={() => setInputMode('manual')}
          className={`flex-1 py-2.5 rounded-lg font-medium transition text-sm ${
            inputMode === 'manual'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          ✏️ Manual Entry
        </button>

      </div>

      {/* ── AI MODE ─────────────────────────────────────────────────────────── */}
      {inputMode === 'ai' && (
        <div className="space-y-4">

          {/* Upload Buttons */}
          <div className="grid grid-cols-2 gap-4">
            {/* Gallery Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingAny}
              className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition flex flex-col items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-semibold text-gray-900 text-sm">Upload Images</p>
              <p className="text-xs text-gray-500">Multiple files supported</p>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />

            {/* Camera Capture */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isProcessingAny}
              className="p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition flex flex-col items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="font-semibold text-gray-900 text-sm">Use Camera</p>
              <p className="text-xs text-gray-500">Take a photo now</p>
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleFilesSelected(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Processing Status Banner */}
          {processingCount > 0 && (
            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 flex-shrink-0"></div>
              <p className="text-orange-700 font-medium text-sm">
                Processing {processingCount} image{processingCount > 1 ? 's' : ''} with AI...
              </p>
            </div>
          )}

          {/* Uploaded Images Grid */}
          {uploadedImages.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Uploaded Images ({uploadedImages.length}) — {doneCount} processed
              </p>
              <div className="grid grid-cols-3 gap-3">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative rounded-xl overflow-hidden border-2 border-gray-200 aspect-square">
                    <img src={img.preview} alt="menu" className="w-full h-full object-cover" />

                    {/* Status Overlay */}
                    {img.status === 'processing' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                    {img.status === 'done' && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-end justify-center pb-2">
                        <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          ✓ {img.extractedCount} items
                        </span>
                      </div>
                    )}
                    {img.status === 'error' && (
                      <div className="absolute inset-0 bg-red-500/20 flex items-end justify-center pb-2">
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          ✗ Failed
                        </span>
                      </div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {/* Add More Images Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingAny}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition flex flex-col items-center justify-center gap-1 disabled:opacity-50"
                >
                  <span className="text-2xl text-orange-500">+</span>
                  <span className="text-xs text-gray-500">Add more</span>
                </button>
              </div>
            </div>
          )}

          {/* Switch to manual hint */}
          <p className="text-center text-sm text-gray-500">
            No menu image?{' '}
            <button
              onClick={() => setInputMode('manual')}
              className="text-orange-600 hover:underline font-medium"
            >
              Add items manually
            </button>
          </p>
        </div>
      )}

      {/* ── PASTE EXCEL MODE BLOCK RIGHT HERE ── */}
  {inputMode === 'excel' && shopType === 'Grocery Store' && (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
        <p className="text-sm font-bold text-green-800 mb-1">📦 Grocery Catalogue Upload</p>
        <p className="text-xs text-green-600 mb-3">
          Upload an Excel file with your products. Required columns:
          <span className="font-semibold"> Name, Price</span> — Optional:
          <span className="font-semibold"> Category, Stock, Unit, SKU, Veg, Description</span>
        </p>

        {/* Upload button */}
        <label className={`flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-green-400 rounded-xl cursor-pointer hover:bg-green-100 transition ${excelUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-sm font-bold text-green-700">
            {excelUploading
              ? '⏳ Reading file...'
              : excelFileName
              ? `✅ ${excelFileName}`
              : 'Upload .xlsx / .csv file'}
          </span>
          <input
            ref={excelInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={handleExcelSelected}
            disabled={excelUploading}
          />
        </label>

        {/* Items loaded count */}
        {excelItemCount > 0 && (
          <div className="mt-3 flex items-center gap-2 bg-green-100 px-3 py-2 rounded-xl">
            <span className="text-green-700 text-sm font-bold">
              ✅ {excelItemCount} products loaded — scroll down to review
            </span>
          </div>
        )}

        {/* Sample template download */}
        <p className="text-xs text-gray-400 mt-3 text-center">
          Not sure about the format?{' '}
          <button
            type="button"
            onClick={() => {
              import('xlsx').then(XLSX => {
                const ws = XLSX.utils.aoa_to_sheet([
                  ['Name','Price','Category','Stock','Unit','SKU','Veg','Description'],
                  ['Toor Dal 1kg','120','Pulses & Grains','50','kg','SKU001','yes','Premium toor dal'],
                  ['Amul Butter 500g','280','Dairy','30','pack','SKU002','yes','Fresh butter'],
                  ['Basmati Rice 5kg','550','Rice & Cereals','20','bag','SKU003','yes','Long grain rice'],
                ]);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Products');
                XLSX.writeFile(wb, 'grocery-template.xlsx');
              });
            }}
            className="text-green-600 underline font-medium"
          >
            Download sample template
          </button>
        </p>
      </div>

      {/* Tip box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
        💡 <strong>Tip:</strong> Leave the Stock column empty for unlimited items.
        Add stock numbers only for items you want to track automatically.
      </div>

      {/* Switch to manual */}
      <p className="text-center text-sm text-gray-500">
        Prefer to type manually?{' '}
        <button
          onClick={() => setInputMode('manual')}
          className="text-orange-600 hover:underline font-medium"
        >
          Add items manually
        </button>
      </p>
    </div>
  )}

      {/* ── MANUAL MODE ─────────────────────────────────────────────────────── */}
      {inputMode === 'manual' && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Type your menu items one by one. You can also switch to AI scan to add more.
          </p>
          {items.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="font-medium">No items yet</p>
              <p className="text-sm">Click "Add Item" below to get started</p>
            </div>
          )}
        </div>
      )}

      {/* ── EXTRACTED / MANUAL ITEMS LIST (shown in both modes) ─────────────── */}
      {items.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">
              Menu Items ({items.length})
            </h3>
            <span className="text-xs text-gray-500">All items will be saved</span>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 w-5 text-center font-medium">{index + 1}</span>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleEditItem(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                  placeholder="Item name"
                />
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-500">
                  <span className="px-2 py-2 bg-gray-100 text-gray-500 text-sm border-r border-gray-300">₹</span>
                  <input
                    type="number"
                    value={item.price || ''}
                    onChange={(e) => handleEditItem(index, 'price', e.target.value)}
                    className="w-20 px-2 py-2 outline-none text-sm"
                    placeholder="0"
                    min="0"
                  />
                </div>
                <button
                  onClick={() => handleRemoveItem(index)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Add Manual Item Button (always visible at bottom) ───────────────── */}
      <button
        onClick={handleAddManualItem}
        className="mt-4 w-full py-3 border-2 border-dashed border-orange-300 text-orange-600 hover:bg-orange-50 font-medium rounded-xl transition flex items-center justify-center gap-2 text-sm"
      >
        <span className="text-lg">+</span> Add Item Manually
      </button>

      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleBack}
          className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={isProcessingAny || items.length === 0}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl transition"
        >
          {isProcessingAny ? 'Processing...' : `Next (${items.length} items)`}
        </button>
      </div>
    </div>
  );
}
