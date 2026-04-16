import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';

// GET — fetch inventory for vendor
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const vendorId = searchParams.get('vendorId');
  if (!vendorId) return NextResponse.json({ error: 'Vendor ID required' }, { status: 400 });

  const vendor = await Vendor.findOne({ vendorId }).select('menuItems shopName');
  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

  // Return items with stock info + low stock flags
  const inventory = vendor.menuItems.map((item: any) => ({
    _id: item._id,
    name: item.name,
    price: item.price,
    category: item.category,
    unit: item.unit || '',
    sku: item.sku || '',
    stock: item.stock ?? null,
    lowStockThreshold: item.lowStockThreshold ?? 5,
    available: item.available,
    isLowStock: item.stock !== null && item.stock <= (item.lowStockThreshold ?? 5),
    isOutOfStock: item.stock === 0,
  }));

  return NextResponse.json({ shopName: vendor.shopName, inventory });
}

// PATCH — update stock for one item manually
export async function PATCH(req: NextRequest) {
  await connectDB();
  const { vendorId, itemId, stock, available, lowStockThreshold } = await req.json();
  if (!vendorId || !itemId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const vendor = await Vendor.findOne({ vendorId });
  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

  const item = vendor.menuItems.id(itemId);
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

  if (stock !== undefined) item.stock = stock === '' ? null : Number(stock);
  if (available !== undefined) item.available = available;
  if (lowStockThreshold !== undefined) item.lowStockThreshold = Number(lowStockThreshold);
  
  // Auto restore availability when stock is added back
  if (stock > 0 && item.available === false) item.available = true;

  await vendor.save();
  return NextResponse.json({ success: true, item });
}