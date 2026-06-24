// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Order from '@/lib/models/Order';
// import Vendor from '@/lib/models/Vendor';
// import { nanoid } from 'nanoid';

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const {
//       vendorId,
//       items,
//       subtotal,
//       tax,
//       totalAmount,
//       customerName,
//       customerPhone,
//       customerFcmToken
//     } = body;

//     console.log('📦 Order POST hit — vendorId:', vendorId);
//     console.log('📦 Items received:', JSON.stringify(items));

//     if (!vendorId || !items || items.length === 0) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const orderId = `ORD${nanoid(8)}`.toUpperCase();

//     const vendor = await Vendor.findOne({ vendorId });
// if (!vendor) {
//   return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
// }

// for (const orderedItem of items) {
//   const orderedItemId = orderedItem._id || orderedItem.itemId;

//   const baseName = (orderedItem.name || '')
//     .replace(/\s*\(\s*\d+(\.\d+)?\s*(g|kg|ml|l|ltr|litre|litres|pcs|pc|piece|pieces|packet|packets|bag|bags|bottle|bottles)\s*\)\s*$/i, '')
//     .trim();

//   const menuItem = vendor.menuItems.find((m: any) => {
//     if (orderedItemId && m._id?.toString() === orderedItemId.toString()) return true;
//     return m.name?.trim().toLowerCase() === baseName.toLowerCase();
//   });

//   if (!menuItem) {
//     return NextResponse.json(
//       { error: `Item not found: ${orderedItem.name}` },
//       { status: 400 }
//     );
//   }

//   if (menuItem.available === false) {
//     return NextResponse.json(
//       { error: `${menuItem.name} is currently unavailable` },
//       { status: 400 }
//     );
//   }

//   if (typeof menuItem.stock === 'number') {
//     let requiredQty = Number(orderedItem.quantity) || 0;

//     const selectionMatch = (orderedItem.name || '').match(
//       /\(\s*(\d+(\.\d+)?)\s*(g|kg|ml|l|ltr|litre|litres|pcs|pc|piece|pieces|packet|packets|bag|bags|bottle|bottles)\s*\)/i
//     );

//     if (selectionMatch) {
//       const selectedValue = parseFloat(selectionMatch[1]);
//       const selectedUnit = selectionMatch[3].toLowerCase();
//       const stockUnit = (menuItem.unit || '').toLowerCase();

//       if (['kg', 'g'].includes(stockUnit)) {
//         requiredQty = ['kg'].includes(selectedUnit)
//           ? selectedValue * (Number(orderedItem.quantity) || 0)
//           : (selectedValue / 1000) * (Number(orderedItem.quantity) || 0);
//       } else if (['litre', 'litres', 'ltr', 'l', 'ml'].includes(stockUnit)) {
//         requiredQty = ['litre', 'litres', 'ltr', 'l'].includes(selectedUnit)
//           ? selectedValue * (Number(orderedItem.quantity) || 0)
//           : (selectedValue / 1000) * (Number(orderedItem.quantity) || 0);
//       } else {
//         requiredQty = selectedValue * (Number(orderedItem.quantity) || 0);
//       }
//     }

//     if (requiredQty > menuItem.stock) {
//       return NextResponse.json(
//         {
//           error: `Only ${menuItem.stock} ${menuItem.unit || 'item(s)'} available for ${menuItem.name}`,
//         },
//         { status: 400 }
//       );
//     }
//   }
// }

//     const order = await Order.create({
//       orderId,
//       vendorId,
//       items,
//       subtotal,
//       tax,
//       totalAmount,
//       customerName,
//       customerPhone,
//       customerFcmToken,
//       status: 'pending',
//       paymentStatus: 'pending',
//     });
    

//     console.log('✅ Order created:', orderId);

//     // ── Stock Deduction ────────────────────────────────────────────────────
//     // try {
//     //   const vendor = await Vendor.findOne({ vendorId });
//     //   console.log('🔍 Vendor found:', !!vendor);
//     //   console.log('🔍 Menu items count:', vendor?.menuItems?.length);

//     //   if (vendor) {
//     //     let stockChanged = false;

//     //     items.forEach((orderedItem: any) => {
//     //       // Strip weight suffix e.g. " (500g)", " (1kg)", " (5kg)"
//     //       const baseName = orderedItem.name
//     //         .replace(/\s*\(\s*\d+(\.\d+)?\s*(g|kg|ml|l|ltr|litre|litres|pcs|pc|piece|pieces|packet|packets|bag|bags|bottle|bottles)\s*\)\s*$/i, '')
//     //         .trim();

//     //       console.log('🔍 Looking for item:', orderedItem.name, '→ base name:', baseName);

//     //       const menuItem = vendor.menuItems.find(
//     //         (m: any) => m.name.trim().toLowerCase() === baseName.toLowerCase()
//     //       );

//     //       console.log('🔍 Menu item found:', !!menuItem);
//     //       if (menuItem) {
//     //         console.log('🔍 Current stock:', menuItem.stock, '| type:', typeof menuItem.stock);
//     //       }

//     //       if (menuItem && menuItem.stock !== null && menuItem.stock !== undefined) {
//     //         const before = menuItem.stock;

//     //         const selectionMatch = orderedItem.name.match(/\(\s*(\d+(\.\d+)?)\s*(g|kg|ml|l|ltr|litre|litres|pcs|pc|piece|pieces|packet|packets|bag|bags|bottle|bottles)\s*\)/i);

//     //         let deductAmount = orderedItem.quantity;

//     //         if (selectionMatch) {
//     //           const selectedValue = parseFloat(selectionMatch[1]);
//     //           const selectedUnit = selectionMatch[3].toLowerCase();
//     //           const stockUnit = (menuItem.unit || '').toLowerCase();

//     //           if (['kg', 'g'].includes(stockUnit)) {
//     //             deductAmount = ['kg'].includes(selectedUnit)
//     //               ? selectedValue * orderedItem.quantity
//     //               : (selectedValue / 1000) * orderedItem.quantity;
//     //           } else if (['litre', 'litres', 'ltr', 'l', 'ml'].includes(stockUnit)) {
//     //             deductAmount = ['litre', 'litres', 'ltr', 'l'].includes(selectedUnit)
//     //               ? selectedValue * orderedItem.quantity
//     //               : (selectedValue / 1000) * orderedItem.quantity;
//     //           } else {
//     //             deductAmount = selectedValue * orderedItem.quantity;
//     //           }
//     //         }

//     //         console.log(`🔍 Deducting: ${deductAmount} ${menuItem.unit || 'units'} (cart qty: ${orderedItem.quantity})`);

//     //         menuItem.stock = Math.max(0, menuItem.stock - deductAmount);

//     //         if (menuItem.stock === 0) {
//     //           menuItem.available = false;
//     //         }

//     //         stockChanged = true;
//     //         console.log(`✅ Stock updated: ${before} → ${menuItem.stock}`);
//     //       } else {
//     //         console.log('⚠️ Skipped — stock is null/undefined or item not found');
//     //       }
//     //     });

//     //     console.log('🔍 Stock changed:', stockChanged);
//     //     if (stockChanged) {
//     //       await vendor.save();
//     //       console.log('✅ Vendor saved successfully');
//     //     }
//     //   }
//     // } catch (stockError) {
//     //   console.error('⚠️ Stock deduction failed (non-blocking):', stockError);
//     // }

//     return NextResponse.json({
//       success: true,
//       orderId: order.orderId,
//     });

//   } catch (error: any) {
//     console.error('❌ Order creation error:', error);
//     return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const orderId = searchParams.get('orderId');
//     const vendorId = searchParams.get('vendorId');

//     if (orderId) {
//       const order = await Order.findOne({ orderId });
//       if (!order) {
//         return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//       }
//       return NextResponse.json(order);
//     }

//     if (vendorId) {
//       const orders = await Order.find({
//         vendorId,
//         paymentStatus: 'paid',
//       }).sort({ createdAt: -1 });

//       return NextResponse.json(orders);
//     }

//     return NextResponse.json({ error: 'Order ID or Vendor ID required' }, { status: 400 });

//   } catch (error: any) {
//     console.error('❌ Order fetch error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Vendor from '@/lib/models/Vendor';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // const {
    //   vendorId,
    //   items,
    //   subtotal,
    //   tax,
    //   totalAmount,
    //   customerName,
    //   customerPhone,
    //   customerFcmToken,
    // } = body;

    const {
  vendorId,
  items,
  subtotal,
  gstAmount,
  totalAmount,
  customerName,
  customerPhone,
  customerFcmToken,
} = body;

    console.log('📦 Order POST hit — vendorId:', vendorId);
    console.log('📦 Items received:', JSON.stringify(items));

    if (!vendorId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ vendorId });
if (!vendor) {
  return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
}

const isGrocery = vendor.shopType === 'Grocery Store';

    for (const orderedItem of items) {
      const orderedItemId = orderedItem._id || orderedItem.itemId;

      const baseName = (orderedItem.name || '')
        .replace(
          /\s*\(\s*\d+(\.\d+)?\s*(g|kg|ml|l|ltr|litre|litres|pcs|pc|piece|pieces|packet|packets|bag|bags|bottle|bottles)\s*\)\s*$/i,
          ''
        )
        .trim();

      const menuItem = vendor.menuItems.find((m: any) => {
        if (orderedItemId && m._id?.toString() === orderedItemId.toString()) {
          return true;
        }
        return m.name?.trim().toLowerCase() === baseName.toLowerCase();
      });

      if (!menuItem) {
        return NextResponse.json(
          { error: `Item not found: ${orderedItem.name}` },
          { status: 400 }
        );
      }

      if (menuItem.available === false) {
        return NextResponse.json(
          { error: `${menuItem.name} is currently unavailable` },
          { status: 400 }
        );
      }

      // if (typeof menuItem.stock === 'number') {
      if (isGrocery && typeof menuItem.stock === 'number') {
        let requiredQty = Number(orderedItem.quantity) || 0;

        const selectionMatch = (orderedItem.name || '').match(
          /\(\s*(\d+(\.\d+)?)\s*(g|kg|ml|l|ltr|litre|litres|pcs|pc|piece|pieces|packet|packets|bag|bags|bottle|bottles)\s*\)/i
        );

        // if (selectionMatch) {
        //   const selectedValue = parseFloat(selectionMatch[1]);
        //   const selectedUnit = selectionMatch[3].toLowerCase();
        //   const stockUnit = (menuItem.unit || '').toLowerCase();

        //   if (['kg', 'g'].includes(stockUnit)) {
        //     requiredQty = ['kg'].includes(selectedUnit)
        //       ? selectedValue * (Number(orderedItem.quantity) || 0)
        //       : (selectedValue / 1000) * (Number(orderedItem.quantity) || 0);
        //   } else if (['litre', 'litres', 'ltr', 'l', 'ml'].includes(stockUnit)) {
        //     requiredQty = ['litre', 'litres', 'ltr', 'l'].includes(selectedUnit)
        //       ? selectedValue * (Number(orderedItem.quantity) || 0)
        //       : (selectedValue / 1000) * (Number(orderedItem.quantity) || 0);
        //   } else {
        //     requiredQty = selectedValue * (Number(orderedItem.quantity) || 0);
        //   }
        // }

        if (selectionMatch) {
  const selectedValue = parseFloat(selectionMatch[1]);
  const selectedUnit = selectionMatch[3].toLowerCase();
  const stockUnit = (menuItem.unit || '').toLowerCase();

  if (['kg', 'g'].includes(stockUnit)) {
    requiredQty = ['kg'].includes(selectedUnit)
      ? selectedValue * (Number(orderedItem.quantity) || 0)
      : (selectedValue / 1000) * (Number(orderedItem.quantity) || 0);
  } else if (['litre', 'litres', 'ltr', 'l', 'ml'].includes(stockUnit)) {
    requiredQty = ['litre', 'litres', 'ltr', 'l'].includes(selectedUnit)
      ? selectedValue * (Number(orderedItem.quantity) || 0)
      : (selectedValue / 1000) * (Number(orderedItem.quantity) || 0);
  } else if (['pcs', 'pc', 'piece', 'pieces', 'packet', 'packets', 'bag', 'bags', 'bottle', 'bottles'].includes(stockUnit)) {
    requiredQty = Number(orderedItem.quantity) || 0;
  } else {
    requiredQty = Number(orderedItem.quantity) || 0;
  }
}

        if (requiredQty > menuItem.stock) {
          return NextResponse.json(
            {
              error: `Only ${menuItem.stock} ${menuItem.unit || 'item(s)'} available for ${menuItem.name}`,
            },
            { status: 400 }
          );
        }
      }
    }

    const orderId = `ORD${nanoid(8)}`.toUpperCase();

    const order = await Order.create({
      orderId,
      vendorId,
      items,
      subtotal,
      // tax,
      gstAmount,
      totalAmount,
      customerName,
      customerPhone,
      customerFcmToken,
      status: 'pending',
      paymentStatus: 'pending',
    });

    console.log('✅ Order created:', orderId);

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
    });
  } catch (error: any) {
    console.error('❌ Order creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const vendorId = searchParams.get('vendorId');

    if (orderId) {
      const order = await Order.findOne({ orderId });
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(order);
    }

    if (vendorId) {
      const orders = await Order.find({
        vendorId,
        paymentStatus: 'paid',
      }).sort({ createdAt: -1 });

      return NextResponse.json(orders);
    }

    return NextResponse.json(
      { error: 'Order ID or Vendor ID required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('❌ Order fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}