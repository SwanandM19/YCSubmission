import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';

// GET - Fetch menu
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    if (!vendorId) {
      return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    return NextResponse.json({ menuItems: vendor.menuItems || [] });

  } catch (error: any) {
    console.error('❌ Error fetching menu:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch menu' },
      { status: 500 }
    );
  }
}

// POST - Add new item
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { vendorId, item } = await req.json();

    if (!vendorId || !item || !item.name || item.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    // Add new item
    vendor.menuItems.push({
      name: item.name,
      price: parseFloat(item.price),
    });

    await vendor.save();

    console.log('✅ Menu item added:', item.name);

    return NextResponse.json({
      success: true,
      menuItems: vendor.menuItems,
    });

  } catch (error: any) {
    console.error('❌ Error adding menu item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add item' },
      { status: 500 }
    );
  }
}

// PUT - Update existing item
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { vendorId, index, item } = await req.json();

    if (!vendorId || index === undefined || !item || !item.name || item.price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    if (index < 0 || index >= vendor.menuItems.length) {
      return NextResponse.json({ error: 'Invalid item index' }, { status: 400 });
    }

    // Update item
    vendor.menuItems[index] = {
      name: item.name,
      price: parseFloat(item.price),
    };

    await vendor.save();

    console.log('✅ Menu item updated:', item.name);

    return NextResponse.json({
      success: true,
      menuItems: vendor.menuItems,
    });

  } catch (error: any) {
    console.error('❌ Error updating menu item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { vendorId, index } = await req.json();

    if (!vendorId || index === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    if (index < 0 || index >= vendor.menuItems.length) {
      return NextResponse.json({ error: 'Invalid item index' }, { status: 400 });
    }

    // Remove item
    const deletedItem = vendor.menuItems[index];
    vendor.menuItems.splice(index, 1);

    await vendor.save();

    console.log('✅ Menu item deleted:', deletedItem.name);

    return NextResponse.json({
      success: true,
      menuItems: vendor.menuItems,
    });

  } catch (error: any) {
    console.error('❌ Error deleting menu item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete item' },
      { status: 500 }
    );
  }
}
