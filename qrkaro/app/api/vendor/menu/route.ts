// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Vendor from '@/lib/models/Vendor';

// // GET - Fetch menu
// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const vendorId = searchParams.get('vendorId');

//     if (!vendorId) {
//       return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
//     }

//     const vendor = await Vendor.findOne({ vendorId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     return NextResponse.json({ menuItems: vendor.menuItems || [] });

//   } catch (error: any) {
//     console.error('❌ Error fetching menu:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to fetch menu' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Add new item
// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const { vendorId, item } = await req.json();

//     if (!vendorId || !item || !item.name || item.price === undefined) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     const vendor = await Vendor.findOne({ vendorId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     // Add new item
//     vendor.menuItems.push({
//       name: item.name,
//       price: parseFloat(item.price),
//     });

//     await vendor.save();

//     console.log('✅ Menu item added:', item.name);

//     return NextResponse.json({
//       success: true,
//       menuItems: vendor.menuItems,
//     });

//   } catch (error: any) {
//     console.error('❌ Error adding menu item:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to add item' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update existing item
// export async function PUT(req: NextRequest) {
//   try {
//     await connectDB();

//     const { vendorId, index, item } = await req.json();

//     if (!vendorId || index === undefined || !item || !item.name || item.price === undefined) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     const vendor = await Vendor.findOne({ vendorId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     if (index < 0 || index >= vendor.menuItems.length) {
//       return NextResponse.json({ error: 'Invalid item index' }, { status: 400 });
//     }

//     // Update item
//     vendor.menuItems[index] = {
//       name: item.name,
//       price: parseFloat(item.price),
//     };

//     await vendor.save();

//     console.log('✅ Menu item updated:', item.name);

//     return NextResponse.json({
//       success: true,
//       menuItems: vendor.menuItems,
//     });

//   } catch (error: any) {
//     console.error('❌ Error updating menu item:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to update item' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Remove item
// export async function DELETE(req: NextRequest) {
//   try {
//     await connectDB();

//     const { vendorId, index } = await req.json();

//     if (!vendorId || index === undefined) {
//       return NextResponse.json(
//         { error: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     const vendor = await Vendor.findOne({ vendorId });
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     if (index < 0 || index >= vendor.menuItems.length) {
//       return NextResponse.json({ error: 'Invalid item index' }, { status: 400 });
//     }

//     // Remove item
//     const deletedItem = vendor.menuItems[index];
//     vendor.menuItems.splice(index, 1);

//     await vendor.save();

//     console.log('✅ Menu item deleted:', deletedItem.name);

//     return NextResponse.json({
//       success: true,
//       menuItems: vendor.menuItems,
//     });

//   } catch (error: any) {
//     console.error('❌ Error deleting menu item:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to delete item' },
//       { status: 500 }
//     );
//   }
// }



// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/db';
// import Vendor from '@/lib/models/Vendor';

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const vendorId = searchParams.get('vendorId');

//     if (!vendorId) {
//       return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
//     }

//     const vendor = await Vendor.findOne({ vendorId }).select('menuItems');
//     if (!vendor) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, menuItems: vendor.menuItems });

//   } catch (error: any) {
//     console.error('❌ Menu GET error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     await connectDB();
//     const { vendorId, menuItems } = await req.json();

//     if (!vendorId) {
//       return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
//     }

//     if (!Array.isArray(menuItems)) {
//       return NextResponse.json({ error: 'menuItems must be an array' }, { status: 400 });
//     }

//     // ✅ Clean + normalize every item before saving
//     const cleanedItems = menuItems.map((item: any) => ({
//       name: String(item.name || '').trim(),
//       price: parseFloat(item.price) || 0,
//       available: item.available !== false, // default true
//       category: String(item.category || 'Other').trim(),
//     })).filter((item) => item.name.length > 0); // remove blank-name items

//     const updated = await Vendor.findOneAndUpdate(
//       { vendorId },
//       { menuItems: cleanedItems },
//       { new: true }
//     ).select('menuItems');

//     if (!updated) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     console.log(`✅ Menu updated for ${vendorId}: ${cleanedItems.length} items`);

//     return NextResponse.json({
//       success: true,
//       menuItems: updated.menuItems,
//       count: updated.menuItems.length,
//     });

//   } catch (error: any) {
//     console.error('❌ Menu PUT error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();
//     const { vendorId, item } = await req.json();

//     if (!vendorId) {
//       return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
//     }

//     if (!item?.name || item.name.trim() === '') {
//       return NextResponse.json({ error: 'Item name is required' }, { status: 400 });
//     }

//     const newItem = {
//       name: String(item.name).trim(),
//       price: parseFloat(item.price) || 0,
//       available: item.available !== false,
//       category: String(item.category || 'Other').trim(),
//     };

//     const updated = await Vendor.findOneAndUpdate(
//       { vendorId },
//       { $push: { menuItems: newItem } },
//       { new: true }
//     ).select('menuItems');

//     if (!updated) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     const addedItem = updated.menuItems[updated.menuItems.length - 1];

//     return NextResponse.json({
//       success: true,
//       item: addedItem,
//       menuItems: updated.menuItems,
//       count: updated.menuItems.length,
//     }, { status: 201 });

//   } catch (error: any) {
//     console.error('❌ Menu POST error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     await connectDB();
//     const { searchParams } = new URL(req.url);
//     const vendorId = searchParams.get('vendorId');
//     const itemId = searchParams.get('itemId');

//     if (!vendorId) {
//       return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
//     }

//     if (!itemId) {
//       return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
//     }

//     const updated = await Vendor.findOneAndUpdate(
//       { vendorId },
//       { $pull: { menuItems: { _id: itemId } } },
//       { new: true }
//     ).select('menuItems');

//     if (!updated) {
//       return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
//     }

//     console.log(`✅ Item ${itemId} deleted from vendor ${vendorId}`);

//     return NextResponse.json({
//       success: true,
//       menuItems: updated.menuItems,
//       count: updated.menuItems.length,
//     });

//   } catch (error: any) {
//     console.error('❌ Menu DELETE error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';

const ALLOWED_CATEGORIES = new Set([
  'Starters', 'Main Course', 'Beverages', 'Desserts',
  'Snacks', 'Breads', 'Rice & Biryani', 'Other',
]);

function normalizeCategory(cat: any): string {
  const c = String(cat || '').trim();
  return ALLOWED_CATEGORIES.has(c) ? c : 'Other';
}

// GET - Fetch menu
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');
    if (!vendorId) return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    return NextResponse.json({ menuItems: vendor.menuItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add single item
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { vendorId, item } = await req.json();

    if (!vendorId || !item || !item.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    // ✅ category is now saved
    vendor.menuItems.push({
      name: String(item.name).trim(),
      price: parseFloat(item.price) || 0,
      available: item.available !== false,
      category: normalizeCategory(item.category),
    });

    await vendor.save();
    return NextResponse.json({ success: true, menuItems: vendor.menuItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update item by index OR bulk replace all menuItems
export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { vendorId } = body;

    if (!vendorId) return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    // ✅ Bulk replace (used by onboarding after menu scan)
    if (Array.isArray(body.menuItems)) {
      vendor.menuItems = body.menuItems
        .filter((i: any) => String(i.name || '').trim().length > 0)
        .map((i: any) => ({
          name: String(i.name).trim(),
          price: parseFloat(i.price) || 0,
          available: i.available !== false,
          category: normalizeCategory(i.category), // ✅ saved
        }));
      await vendor.save();
      return NextResponse.json({ success: true, menuItems: vendor.menuItems });
    }

    // ✅ Single item update by index
    const { index, item } = body;
    if (index === undefined || !item || !item.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (index < 0 || index >= vendor.menuItems.length) {
      return NextResponse.json({ error: 'Invalid item index' }, { status: 400 });
    }

    vendor.menuItems[index] = {
      ...vendor.menuItems[index].toObject(),
      name: String(item.name).trim(),
      price: parseFloat(item.price) || 0,
      available: item.available !== false,
      category: normalizeCategory(item.category), // ✅ saved
    };

    await vendor.save();
    return NextResponse.json({ success: true, menuItems: vendor.menuItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Remove item by index
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { vendorId, index } = await req.json();

    if (!vendorId || index === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

    if (index < 0 || index >= vendor.menuItems.length) {
      return NextResponse.json({ error: 'Invalid item index' }, { status: 400 });
    }

    vendor.menuItems.splice(index, 1);
    await vendor.save();

    return NextResponse.json({ success: true, menuItems: vendor.menuItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
