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


'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const orderId = searchParams.get('orderId');
  const vendorId = params.vendorId as string;

  const [order, setOrder] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      fetchVendor();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders?orderId=${orderId}`);
      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const fetchVendor = async () => {
    try {
      const response = await fetch(`/api/vendor?vendorId=${vendorId}`);
      const data = await response.json();
      setVendor(data);
    } catch (error) {
      console.error('Error fetching vendor:', error);
    }
  };

  const downloadReceipt = () => {
    if (!order || !vendor) return;

    const doc = new jsPDF();

    // Colors
    const primaryColor: [number, number, number] = [249, 115, 22]; // Orange
    const darkGray: [number, number, number] = [31, 41, 55];
    const lightGray: [number, number, number] = [156, 163, 175];

    // Header with Logo
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Nosher', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Order Receipt', 105, 30, { align: 'center' });

    // Restaurant Info
    doc.setTextColor(...darkGray);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(vendor.shopName, 20, 55);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...lightGray);
    doc.text(`${vendor.city} • ${vendor.shopType}`, 20, 62);

    // Order Info Box
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
    doc.text(new Date(order.createdAt).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }), 95, 86);
    
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(150, 81, 35, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID', 167.5, 86, { align: 'center' });

    // Items Header
    doc.setTextColor(...darkGray);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Items', 20, 115);

    // Table Header
    doc.setFillColor(249, 115, 22);
    doc.rect(20, 122, 170, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', 25, 128);
    doc.text('Qty', 130, 128);
    doc.text('Price', 155, 128);
    doc.text('Amount', 180, 128, { align: 'right' });

    // Table Rows
    let yPos = 140;
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'normal');
    
    order.items.forEach((item: any, index: number) => {
      // Alternating row colors
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

    // Summary Box
    yPos += 10;
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    
    // Subtotal
    doc.text('Subtotal', 120, yPos);
    doc.setTextColor(...darkGray);
    doc.text(`₹${order.subtotal.toFixed(2)}`, 185, yPos, { align: 'right' });
    
    // Tax
    yPos += 8;
    doc.setTextColor(...lightGray);
    doc.text('Tax / GST (5%)', 120, yPos);
    doc.setTextColor(...darkGray);
    doc.text(`₹${order.tax.toFixed(2)}`, 185, yPos, { align: 'right' });
    
    // Platform Fee
    yPos += 8;
    doc.setTextColor(...lightGray);
    doc.text('Platform Fee', 120, yPos);
    doc.setTextColor(...darkGray);
    doc.text(`₹${order.platformFee.toFixed(2)}`, 185, yPos, { align: 'right' });

    // Total Box
    yPos += 12;
    doc.setFillColor(...primaryColor);
    doc.roundedRect(120, yPos - 5, 70, 12, 2, 2, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL PAID', 125, yPos + 3);
    doc.setFontSize(14);
    doc.text(`₹${order.totalAmount.toFixed(2)}`, 185, yPos + 3, { align: 'right' });

    // Footer
    yPos += 25;
    doc.setTextColor(...lightGray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for your order!', 105, yPos, { align: 'center' });
    
    yPos += 6;
    doc.text('Questions? Contact us at support@Nosher.com', 105, yPos, { align: 'center' });

    // Watermark
    doc.setTextColor(220, 220, 220);
    doc.setFontSize(8);
    doc.text('Powered by Nosher - Seamless Dining Experience', 105, 285, { align: 'center' });

    // Save PDF
    doc.save(`Nosher-Receipt-${order.orderId}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 animate-bounce">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-600">Your order has been sent to the restaurant</p>
        </div>

        {/* Order Details Card */}
        {order && vendor && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="text-2xl font-bold text-gray-900">{order.orderId}</p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl">Q</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{vendor.shopName}</p>
                  <p className="text-sm text-gray-600">{vendor.city}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-b py-4 mb-6 space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-700">{item.name} x{item.quantity}</span>
                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (5%)</span>
                <span>₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee</span>
                <span>₹{order.platformFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total Paid</span>
                <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg py-3 mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Payment Successful</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={downloadReceipt}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
        )}

        <div className="text-center text-sm text-gray-500">
          <p>Your order will be ready shortly</p>
          <p className="mt-1">We'll notify you when it's done</p>
        </div>
      </div>
    </div>
  );
}
