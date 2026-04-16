import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Vendor from '@/lib/models/Vendor';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  await connectDB();
  
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const vendorId = formData.get('vendorId') as string;

  if (!file || !vendorId) return NextResponse.json({ error: 'Missing file or vendorId' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(sheet);

  if (!rows.length) return NextResponse.json({ error: 'Excel file is empty' }, { status: 400 });

  // Map Excel rows → menu items
  // Expected columns: Name, Price, Category, Stock, Unit, SKU (case-insensitive)
  const menuItems = rows.map((row) => ({
    name:              String(row['Name'] || row['name'] || '').trim(),
    price:             Number(row['Price'] || row['price'] || 0),
    category:          String(row['Category'] || row['category'] || 'Other').trim(),
    stock:             row['Stock'] !== undefined ? Number(row['Stock'] || row['stock']) : null,
    unit:              String(row['Unit'] || row['unit'] || '').trim(),
    sku:               String(row['SKU'] || row['sku'] || '').trim(),
    lowStockThreshold: Number(row['Low Stock Alert'] || row['lowStockThreshold'] || 5),
    available:         true,
    isVeg:             String(row['Veg'] || row['isVeg'] || 'yes').toLowerCase() !== 'no',
    desc:              String(row['Description'] || row['desc'] || '').trim(),
  })).filter(item => item.name && item.price > 0); // Remove empty rows

  if (!menuItems.length) return NextResponse.json({ error: 'No valid items found in Excel' }, { status: 400 });

  const vendor = await Vendor.findOneAndUpdate(
    { vendorId },
    { $set: { menuItems } },
    { new: true }
  );

  if (!vendor) return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });

  console.log(`✅ Bulk upload: ${menuItems.length} items for ${vendorId}`);
  return NextResponse.json({ success: true, count: menuItems.length, items: menuItems });
}