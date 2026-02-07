import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Vendor from '@/lib/models/Vendor';
import QRCode from 'qrcode';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      shopName,
      phone,
      city,
      shopType,
      menuItems,
      accountHolderName,
      accountNumber,
      ifscCode,
      panNumber,
    } = body;

    // Validate required fields
    if (!shopName || !phone || !city || !shopType || !menuItems || menuItems.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate unique vendor ID
    const vendorId = nanoid(10);

    // Generate customer page URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const customerPageUrl = `${baseUrl}/v/${vendorId}`;

    // Generate QR Code
    let qrCodeUrl = '';
    try {
      qrCodeUrl = await QRCode.toDataURL(customerPageUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    } catch (qrError) {
      console.error('QR Code generation error:', qrError);
      // Continue without QR code - can be generated later
    }

    // Create vendor in database
    const vendor = await Vendor.create({
      vendorId,
      shopName,
      phone,
      city,
      shopType,
      menuItems,
      accountHolderName,
      accountNumber,
      ifscCode,
      panNumber,
      qrCodeUrl,
      customerPageUrl,
      status: 'active',
    });

    return NextResponse.json({
      success: true,
      vendorId: vendor.vendorId,
      customerPageUrl: vendor.customerPageUrl,
      qrCodeUrl: vendor.qrCodeUrl,
    });
  } catch (error: any) {
    console.error('Vendor creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
// Add this function to the existing file

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

    return NextResponse.json({
      vendorId: vendor.vendorId,
      shopName: vendor.shopName,
      shopType: vendor.shopType,
      customerPageUrl: vendor.customerPageUrl,
      qrCodeUrl: vendor.qrCodeUrl,
      menuItems: vendor.menuItems,
    });
  } catch (error: any) {
    console.error('Vendor fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
