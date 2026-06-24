// 'use client';

// import { useSearchParams, useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Link from 'next/link';

// export default function OrderSuccessPage() {
//   const searchParams = useSearchParams();
//   const params = useParams();
//   const orderId = searchParams.get('orderId');
//   const vendorId = params.vendorId as string;

//   const [order, setOrder] = useState<any>(null);

//   useEffect(() => {
//     if (orderId) {
//       fetchOrder();
//     }
//   }, [orderId]);

//   const fetchOrder = async () => {
//     try {
//       const response = await fetch(`/api/orders?orderId=${orderId}`);
//       const data = await response.json();
//       setOrder(data);
//     } catch (error) {
//       console.error('Error fetching order:', error);
//     }
//   };

//   const downloadReceipt = () => {
//     if (!order) return;

//     const receiptContent = `
// QRKaro Order Receipt
// ====================
// Order ID: ${order.orderId}
// Date: ${new Date(order.createdAt).toLocaleString()}

// Items:
// ${order.items.map((item: any) => `${item.name} x${item.quantity} - ₹${item.price * item.quantity}`).join('\n')}

// Subtotal: ₹${order.subtotal.toFixed(2)}
// Tax (5%): ₹${order.tax.toFixed(2)}
// Platform Fee: ₹${order.platformFee.toFixed(2)}

// Total: ₹${order.totalAmount.toFixed(2)}

// Thank you for your order!
//     `;

//     const blob = new Blob([receiptContent], { type: 'text/plain' });
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `receipt-${orderId}.txt`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         {/* Success Animation */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
//             <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
//           <p className="text-gray-600">Your order has been sent to the restaurant</p>
//         </div>

//         {/* Order Details Card */}
//         {order && (
//           <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//             <div className="text-center mb-6">
//               <p className="text-sm text-gray-500 mb-1">Order ID</p>
//               <p className="text-2xl font-bold text-gray-900">{order.orderId}</p>
//             </div>

//             <div className="border-t border-b py-4 mb-6 space-y-3">
//               {order.items.map((item: any, index: number) => (
//                 <div key={index} className="flex justify-between">
//                   <span className="text-gray-700">{item.name} x{item.quantity}</span>
//                   <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-2 mb-6">
//               <div className="flex justify-between text-gray-600">
//                 <span>Subtotal</span>
//                 <span>₹{order.subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Tax (5%)</span>
//                 <span>₹{order.tax.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Platform Fee</span>
//                 <span>₹{order.platformFee.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
//                 <span>Total Paid</span>
//                 <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg py-3 mb-6">
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span className="font-medium">Payment Successful</span>
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-3">
//               <button
//                 onClick={downloadReceipt}
//                 className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 Download Receipt
//               </button>

//               <Link
//                 href={`/v/${vendorId}`}
//                 className="block w-full py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl transition text-center"
//               >
//                 Order More
//               </Link>
//             </div>
//           </div>
//         )}

//         <div className="text-center text-sm text-gray-500">
//           <p>Your order will be ready shortly</p>
//           <p className="mt-1">We'll notify you when it's done</p>
//         </div>
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useSearchParams, useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import jsPDF from 'jspdf';
// // import { requestNotificationPermission } from "@/lib/firebase";


// export default function OrderSuccessPage() {
//   const searchParams = useSearchParams();
//   const params = useParams();
//   const orderId = searchParams.get('orderId');
//   const vendorId = params.vendorId as string;

//   const [order, setOrder] = useState<any>(null);
//   const [vendor, setVendor] = useState<any>(null);

//   useEffect(() => {
//     if (orderId) {
//       fetchOrder();
//       fetchVendor();
//     }
//   }, [orderId]);

//   const fetchOrder = async () => {
//     try {
//       const response = await fetch(`/api/orders?orderId=${orderId}`);
//       const data = await response.json();
//       setOrder(data);
//     } catch (error) {
//       console.error('Error fetching order:', error);
//     }
//   };

//   const fetchVendor = async () => {
//     try {
//       const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
//       const data = await response.json();
//       setVendor(data);
//     } catch (error) {
//       console.error('Error fetching vendor:', error);
//     }
//   };

//   const subtotal = Number(
//   order?.subtotal ??
//   order?.items?.reduce((sum: number, item: any) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0) ??
//   0
// );

// const tax = Number(order?.tax ?? subtotal * 0.05);

// // const totalAmount = Number(order?.totalAmount ?? subtotal + tax);
// const totalAmount = subtotal + tax;

//   const downloadReceipt = () => {
//     if (!order || !vendor) return;

//     const doc = new jsPDF();

//     // Colors
//     const primaryColor: [number, number, number] = [249, 115, 22]; // Orange
//     const darkGray: [number, number, number] = [31, 41, 55];
//     const lightGray: [number, number, number] = [156, 163, 175];

//     // Header with Logo
//     doc.setFillColor(...primaryColor);
//     doc.rect(0, 0, 210, 40, 'F');
    
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(28);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Nosher', 105, 20, { align: 'center' });
    
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'normal');
//     doc.text('Order Receipt', 105, 30, { align: 'center' });

//     // Restaurant Info
//     doc.setTextColor(...darkGray);
//     doc.setFontSize(18);
//     doc.setFont('helvetica', 'bold');
//     doc.text(vendor.shopName, 20, 55);
    
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'normal');
//     doc.setTextColor(...lightGray);
//     doc.text(`${vendor.city} • ${vendor.shopType}`, 20, 62);

//     // Order Info Box
//     doc.setFillColor(249, 250, 251);
//     doc.roundedRect(20, 70, 170, 30, 3, 3, 'F');
    
//     doc.setTextColor(...lightGray);
//     doc.setFontSize(9);
//     doc.text('ORDER ID', 25, 78);
//     doc.text('DATE & TIME', 95, 78);
//     doc.text('STATUS', 150, 78);
    
//     doc.setTextColor(...darkGray);
//     doc.setFontSize(11);
//     doc.setFont('helvetica', 'bold');
//     doc.text(order.orderId, 25, 86);
//     doc.setFont('helvetica', 'normal');
//     doc.text(new Date(order.createdAt).toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     }), 95, 86);
    
//     doc.setFillColor(34, 197, 94);
//     doc.roundedRect(150, 81, 35, 8, 2, 2, 'F');
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'bold');
//     doc.text('PAID', 167.5, 86, { align: 'center' });

//     // Items Header
//     doc.setTextColor(...darkGray);
//     doc.setFontSize(14);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Order Items', 20, 115);

//     // Table Header
//     doc.setFillColor(249, 115, 22);
//     doc.rect(20, 122, 170, 10, 'F');
    
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(10);
//     doc.setFont('helvetica', 'bold');
//     doc.text('Item', 25, 128);
//     doc.text('Qty', 130, 128);
//     doc.text('Price', 155, 128);
//     doc.text('Amount', 180, 128, { align: 'right' });

//     // Table Rows
//     let yPos = 140;
//     doc.setTextColor(...darkGray);
//     doc.setFont('helvetica', 'normal');
    
//     // order.items.forEach((item: any, index: number) => {
//     (order.items || []).forEach((item: any, index: number) => {
//       // Alternating row colors
//       if (index % 2 === 0) {
//         doc.setFillColor(249, 250, 251);
//         doc.rect(20, yPos - 6, 170, 10, 'F');
//       }
      
//       doc.setFontSize(10);
//       doc.text(item.name, 25, yPos);
//       doc.text(item.quantity.toString(), 135, yPos, { align: 'center' });
//       doc.text(`₹${item.price.toFixed(2)}`, 155, yPos);
//       doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 185, yPos, { align: 'right' });
      
//       yPos += 10;
//     });

//     // Summary Box
//     yPos += 10;
//     doc.setDrawColor(...lightGray);
//     doc.setLineWidth(0.5);
//     doc.line(20, yPos, 190, yPos);

//     yPos += 10;
//     doc.setFontSize(10);
//     doc.setTextColor(...lightGray);
    
//     // Subtotal
//     doc.text('Subtotal', 120, yPos);
//     doc.setTextColor(...darkGray);
//     // doc.text(`₹${order.subtotal.toFixed(2)}`, 185, yPos, { align: 'right' });
//     doc.text(`₹${subtotal.toFixed(2)}`, 185, yPos, { align: 'right' });
    
//     // Tax
//     yPos += 8;
//     doc.setTextColor(...lightGray);
//     doc.text('Tax / GST (5%)', 120, yPos);
//     doc.setTextColor(...darkGray);
//     // doc.text(`₹${order.tax.toFixed(2)}`, 185, yPos, { align: 'right' });
//     doc.text(`₹${tax.toFixed(2)}`, 185, yPos, { align: 'right' });
    
//     // Platform Fee
//     // yPos += 8;
//     // doc.setTextColor(...lightGray);
//     // doc.text('Platform Fee', 120, yPos);
//     // doc.setTextColor(...darkGray);
//     // doc.text(`₹${order.platformFee.toFixed(2)}`, 185, yPos, { align: 'right' });

//     // Total Box
//     yPos += 12;
//     doc.setFillColor(...primaryColor);
//     doc.roundedRect(120, yPos - 5, 70, 12, 2, 2, 'F');
    
//     doc.setTextColor(255, 255, 255);
//     doc.setFontSize(12);
//     doc.setFont('helvetica', 'bold');
//     doc.text('TOTAL PAID', 125, yPos + 3);
//     doc.setFontSize(14);
//     // doc.text(`₹${order.totalAmount.toFixed(2)}`, 185, yPos + 3, { align: 'right' });
//     doc.text(`₹${totalAmount.toFixed(2)}`, 185, yPos + 3, { align: 'right' });

//     // Footer
//     yPos += 25;
//     doc.setTextColor(...lightGray);
//     doc.setFontSize(9);
//     doc.setFont('helvetica', 'normal');
//     doc.text('Thank you for your order!', 105, yPos, { align: 'center' });
    
//     yPos += 6;
//     doc.text('Questions? Contact us at support@Nosher.com', 105, yPos, { align: 'center' });

//     // Watermark
//     doc.setTextColor(220, 220, 220);
//     doc.setFontSize(8);
//     doc.text('Powered by Nosher - Seamless Dining Experience', 105, 285, { align: 'center' });

//     // Save PDF
//     doc.save(`Nosher-Receipt-${order.orderId}.pdf`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full">
//         {/* Success Animation */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
//             <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
//           <p className="text-gray-600">Your order has been sent to the restaurant</p>
//         </div>

//         {/* Order Details Card */}
//         {order && vendor && (
//           <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
//             <div className="text-center mb-6">
//               <p className="text-sm text-gray-500 mb-1">Order ID</p>
//               <p className="text-2xl font-bold text-gray-900">{order.orderId}</p>
//             </div>

//             <div className="bg-orange-50 rounded-lg p-4 mb-6">
//               <div className="flex items-center gap-3">
//                 <Image
//   src="/nosher-logo.png"
//   alt="Nosher logo"
//   width={170}
//   height={56}
//   className="h-12 w-auto object-contain"
//   priority
// />
//                 <div>
//                   <p className="font-semibold text-gray-900">{vendor.shopName}</p>
//                   <p className="text-sm text-gray-600">{vendor.city}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-b py-4 mb-6 space-y-3">
//               {/* {order.items.map((item: any, index: number) => ( */}
//               {(order.items || []).map((item: any, index: number) => (
//                 <div key={index} className="flex justify-between">
//                   <span className="text-gray-700">{item.name} x{item.quantity}</span>
//                   <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-2 mb-6">
//               <div className="flex justify-between text-gray-600">
//                 <span>Subtotal</span>
//                 {/* <span>₹{order.subtotal.toFixed(2)}</span> */}
//                 <span>₹{subtotal.toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Tax (5%)</span>
//                 {/* <span>₹{order.tax.toFixed(2)}</span> */}
//                 <span>₹{tax.toFixed(2)}</span>
//               </div>
//               {/* <div className="flex justify-between text-gray-600">
//                 <span>Platform Fee</span>
//                 <span>₹{order.platformFee.toFixed(2)}</span>
//               </div> */}
//               <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
//                 <span>Total Paid</span>
//                 {/* <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span> */}
//                 <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg py-3 mb-6">
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//               </svg>
//               <span className="font-medium">Payment Successful</span>
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-3">
//               <button
//                 onClick={downloadReceipt}
//                 className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//                 Download PDF Receipt
//               </button>

//               <Link
//                 href={`/v/${vendorId}`}
//                 className="block w-full py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl transition text-center"
//               >
//                 Order More
//               </Link>
//             </div>
//           </div>
//         )}

//         <div className="text-center text-sm text-gray-500">
//           <p>Your order will be ready shortly</p>
//           <p className="mt-1">We'll notify you when it's done</p>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import jsPDF from 'jspdf';

type FetchState = 'loading' | 'retrying' | 'success' | 'failed';

const MAX_RETRIES = 10;
const RETRY_INTERVAL_MS = 3000;

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const orderId = searchParams.get('orderId');
  const vendorId = params.vendorId as string;

  const [order, setOrder] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [fetchState, setFetchState] = useState<FetchState>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // ── Derived values ────────────────────────────────────────
  const subtotal = Number(
    order?.subtotal ??
    order?.items?.reduce(
      (sum: number, item: any) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0
    ) ?? 0
  );
  // const tax = Number(order?.tax ?? subtotal * 0.05);
  // const totalAmount = subtotal + tax;

  const gstAmount = Number(order?.gstAmount ?? (subtotal * 0.05).toFixed(2));
  const totalAmount = Number(order?.totalAmount ?? (subtotal + gstAmount).toFixed(2));

  // ── Fetch with retry ──────────────────────────────────────
  const startFetching = useCallback(() => {
    if (!orderId) return;

    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout>;
    let elapsedTimer: ReturnType<typeof setInterval>;

    setFetchState('loading');
    setRetryCount(0);
    setElapsed(0);

    elapsedTimer = setInterval(() => setElapsed((p) => p + 1), 1000);

    const tryFetch = async () => {
      try {
        const [orderRes, vendorRes] = await Promise.all([
          fetch(`/api/orders?orderId=${orderId}`),
          fetch(`/api/vendor?vendorId=${vendorId}`),
        ]);

  //   const tryFetch = async () => {
  // try {
  //   await new Promise((resolve) => setTimeout(resolve, 5000)); // temporary test delay

  //   const [orderRes, vendorRes] = await Promise.all([
  //     fetch(`/api/orders?orderId=${orderId}`),
  //     fetch(`/api/vendor?vendorId=${vendorId}`),
  //   ]);

        const orderData = await orderRes.json();
        const vendorData = await vendorRes.json();

        const paymentOk =
          !orderData?.paymentStatus ||
          ['paid', 'captured', 'success'].includes(
            String(orderData.paymentStatus).toLowerCase()
          );

        // ✅ Consider success only when order has items and payment is done
        if (
          orderRes.ok &&
          orderData?.orderId &&
          Array.isArray(orderData?.items) &&
          orderData.items.length > 0 &&
          ['paid', 'captured', 'success'].includes(
            String(orderData?.paymentStatus || '').toLowerCase()
          )
        ) {
          clearInterval(elapsedTimer);
          setOrder(orderData);
          setVendor(vendorData);
          setFetchState('success');
          return;
        }

        throw new Error('Order not ready yet');
      } catch {
        attempts++;
        setRetryCount(attempts);

        if (attempts >= MAX_RETRIES) {
          clearInterval(elapsedTimer);
          setFetchState('failed');
          return;
        }

        setFetchState('retrying');
        timeoutId = setTimeout(tryFetch, RETRY_INTERVAL_MS);
      }
    };

    tryFetch();

    return () => {
      clearTimeout(timeoutId);
      clearInterval(elapsedTimer);
    };
  }, [orderId, vendorId]);

  useEffect(() => {
    const cleanup = startFetching();
    return cleanup;
  }, [startFetching]);

  // ── PDF Download ──────────────────────────────────────────
  const downloadReceipt = () => {
    if (!order || !vendor) return;

    const doc = new jsPDF();
    const primaryColor: [number, number, number] = [249, 115, 22];
    const darkGray: [number, number, number] = [31, 41, 55];
    const lightGray: [number, number, number] = [156, 163, 175];

    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Nosher', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Order Receipt', 105, 30, { align: 'center' });

    doc.setTextColor(...darkGray);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(vendor.shopName, 20, 55);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...lightGray);
    doc.text(`${vendor.city} • ${vendor.shopType}`, 20, 62);

    doc.setFillColor(249, 250, 251);
    doc.roundedRect(20, 70, 170, 30, 3, 3, 'F');
    doc.setTextColor(...lightGray);
    doc.setFontSize(9);
    doc.text('ORDER ID', 25, 78);
    doc.text('DATE & TIME', 95, 78);
    doc.text('STATUS', 150, 78);
    doc.setTextColor(...darkGray);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(order.orderId, 25, 86);
    doc.setFont('helvetica', 'normal');
    doc.text(
      new Date(order.createdAt).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }),
      95, 86
    );
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(150, 81, 35, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID', 167.5, 86, { align: 'center' });

    doc.setTextColor(...darkGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Items', 20, 115);

    doc.setFillColor(...primaryColor);
    doc.rect(20, 122, 170, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 25, 128);
    doc.text('Qty', 130, 128);
    doc.text('Price', 155, 128);
    doc.text('Amount', 180, 128, { align: 'right' });

    let yPos = 140;
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'normal');
    (order.items || []).forEach((item: any, index: number) => {
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(20, yPos - 6, 170, 10, 'F');
      }
      doc.setFontSize(10);
      doc.text(item.name, 25, yPos);
      doc.text(item.quantity.toString(), 135, yPos, { align: 'center' });
      doc.text(`₹${item.price.toFixed(2)}`, 155, yPos);
      doc.text(`₹${(item.price * item.quantity).toFixed(2)}`, 185, yPos, { align: 'right' });
      yPos += 10;
    });

    yPos += 10;
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text('Subtotal', 120, yPos);
    doc.setTextColor(...darkGray);
    doc.text(`₹${subtotal.toFixed(2)}`, 185, yPos, { align: 'right' });

    yPos += 8;
    doc.setTextColor(...lightGray);
    doc.text('Tax / GST (5%)', 120, yPos);
    doc.setTextColor(...darkGray);
    // doc.text(`₹${tax.toFixed(2)}`, 185, yPos, { align: 'right' });
    doc.text(`₹${gstAmount.toFixed(2)}`, 185, yPos, { align: 'right' });

    yPos += 12;
    doc.setFillColor(...primaryColor);
    doc.roundedRect(120, yPos - 5, 70, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAID', 125, yPos + 3);
    doc.setFontSize(14);
    doc.text(`₹${totalAmount.toFixed(2)}`, 185, yPos + 3, { align: 'right' });

    yPos += 25;
    doc.setTextColor(...lightGray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your order!', 105, yPos, { align: 'center' });
    yPos += 6;
    doc.text('Questions? Contact us at support@nosher.com', 105, yPos, { align: 'center' });
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(8);
    doc.text('Powered by Nosher - Seamless Dining Experience', 105, 285, { align: 'center' });

    doc.save(`Nosher-Receipt-${order.orderId}.pdf`);
  };

  // ── Loading / Retrying Screen ─────────────────────────────
  if (fetchState === 'loading' || fetchState === 'retrying') {
    const progress = Math.min((retryCount / MAX_RETRIES) * 100, 90);

    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center px-4">

        {/* Animated icon
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-white shadow-xl shadow-orange-100 border border-orange-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="absolute inset-0 rounded-3xl border-2 border-orange-300 animate-ping opacity-30" />
        </div> */}

        {/* Animated logo */}
<div className="relative mb-8">
  <div className="w-28 h-28 rounded-3xl bg-white shadow-xl shadow-orange-100 border border-orange-100 flex items-center justify-center p-3">
    <Image
      src="/nosher-logo2.png"
      alt="Nosher"
      width={200}
      height={80}
      className="w-full h-full object-contain animate-pulse"
      priority
    />
  </div>
  <span className="absolute inset-0 rounded-3xl border-2 border-orange-300 animate-ping opacity-30" />
</div>

        <h1 className="text-2xl font-black text-gray-900 mb-2 text-center">
          {retryCount === 0 ? 'Confirming your order…' : 'Almost there…'}
        </h1>
        <p className="text-sm text-gray-500 text-center max-w-xs mb-8 leading-relaxed">
          {retryCount === 0
            ? 'Payment received. Generating your receipt.'
            : 'High traffic right now — hang tight, your order is confirmed!'}
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-xs mb-3">
          <div className="h-1.5 bg-orange-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status text */}
        <div className="flex items-center gap-2 mb-10">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
          <p className="text-xs text-gray-400 font-medium">
            {retryCount === 0
              ? 'Connecting to server…'
              : `Attempt ${retryCount} of ${MAX_RETRIES} · ${elapsed}s elapsed`}
          </p>
        </div>

        {/* 3-step tracker */}
        <div className="w-full max-w-xs space-y-3">
          {[
            { label: 'Payment received', done: true },
            { label: 'Order confirmed',  done: retryCount >= 1 },
            { label: 'Receipt ready',    done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                step.done
                  ? 'bg-green-500'
                  : i === 2
                  ? 'bg-orange-100 border-2 border-orange-300'
                  : 'bg-gray-100'
              }`}>
                {step.done ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : i === 2 ? (
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                ) : (
                  <span className="w-2 h-2 bg-gray-300 rounded-full" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                step.done ? 'text-green-700' : i === 2 ? 'text-orange-600' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Failed Screen ─────────────────────────────────────────
  if (fetchState === 'failed') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-3xl flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>

        <h1 className="text-xl font-black text-gray-900 mb-2">Receipt taking longer than usual</h1>
        <p className="text-sm text-gray-500 max-w-xs mb-1 leading-relaxed">
          Your payment went through. The receipt will be available shortly.
        </p>
        <p className="text-xs text-gray-400 mb-8">
          Order ID:{' '}
          <span className="font-semibold text-gray-600">
            #{orderId?.slice(-6).toUpperCase()}
          </span>
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            // onClick={startFetching}
            onClick={() => startFetching()}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl transition text-sm shadow-sm shadow-orange-200"
          >
            Try Again
          </button>
          <Link
            href={`/v/${vendorId}`}
            className="block w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition text-sm text-center"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  // ── Success Screen ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-600">Your order has been sent to the restaurant</p>
        </div>

        {/* Receipt card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="text-2xl font-bold text-gray-900">{order.orderId}</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Image
                src="/nosher-logo.png"
                alt="Nosher logo"
                width={170}
                height={56}
                className="h-12 w-auto object-contain"
                priority
              />
              <div>
                <p className="font-semibold text-gray-900">{vendor?.shopName}</p>
                <p className="text-sm text-gray-600">{vendor?.city}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-b py-4 mb-6 space-y-3">
            {(order.items || []).map((item: any, index: number) => (
              <div key={index} className="flex justify-between">
                <span className="text-gray-700">{item.name} x{item.quantity}</span>
                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              {/* <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span> */}
              <span>Tax (5%)</span>
<span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total Paid</span>
              <span className="text-green-600">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg py-3 mb-6">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Payment Successful</span>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={downloadReceipt}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download PDF Receipt
            </button>

            <Link
              href={`/v/${vendorId}`}
              className="block w-full py-3 bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl transition text-center"
            >
              Order More
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Your order will be ready shortly</p>
          <p className="mt-1">We'll notify you when it's done</p>
        </div>
      </div>
    </div>
  );
}