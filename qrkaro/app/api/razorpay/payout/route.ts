// import { NextRequest, NextResponse } from 'next/server';
// import Razorpay from 'razorpay';
// import connectDB from '@/lib/mongodb';
// import Order from '@/lib/models/Order';
// import Vendor from '@/lib/models/Vendor';

// export async function POST(req: NextRequest) {
//   try {
//     const { orderId, vendorId, amount } = await req.json();

//     console.log(`🚀 Payout request received for order: ${orderId}`);

//     // Get vendor details
//     await connectDB();
//     const vendor = await Vendor.findOne({ vendorId });

//     if (!vendor || !vendor.upiId) {
//       console.error('❌ Vendor not found or UPI ID missing');
//       return NextResponse.json({ error: 'Vendor payment details not found' }, { status: 404 });
//     }

//     // Calculate payout (vendor gets 95%, platform keeps 5%)
//     const platformCommission = amount * 0.05;
//     const vendorAmount = amount - platformCommission;

//     console.log(`💰 Total: ₹${amount} | Vendor: ₹${vendorAmount} | Commission: ₹${platformCommission}`);

//     // Initialize RazorpayX
//     const razorpayX = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID!,
//       key_secret: process.env.RAZORPAY_KEY_SECRET!,
//     });

//     // Step 1: Create or fetch contact
//     let contact;
//     try {
//       console.log('📞 Creating contact for vendor:', vendorId);
//       contact = await razorpayX.contacts.create({
//         name: vendor.accountHolderName || vendor.shopName,
//         email: `${vendorId}@qrkaro.com`,
//         contact: '9999999999',
//         type: 'vendor',
//         reference_id: vendorId,
//       });
//       console.log('✅ Contact created:', contact.id);
//     } catch (error: any) {
//       if (error.error?.description?.includes('already exists')) {
//         console.log('ℹ️ Contact already exists, fetching...');
//         const contactsResponse = await razorpayX.contacts.all();
//         contact = contactsResponse.items.find((c: any) => c.reference_id === vendorId);
//         console.log('✅ Contact fetched:', contact?.id);
//       } else {
//         throw error;
//       }
//     }

//     if (!contact) {
//       throw new Error('Failed to create or fetch contact');
//     }

//     // Step 2: Create or fetch fund account
//     let fundAccount;
//     try {
//       console.log('💳 Creating fund account with UPI:', vendor.upiId);
//       fundAccount = await razorpayX.fundAccount.create({
//         contact_id: contact.id,
//         account_type: 'vpa',
//         vpa: {
//           address: vendor.upiId,
//         },
//       });
//       console.log('✅ Fund account created:', fundAccount.id);
//     } catch (error: any) {
//       if (error.error?.description?.includes('already exists')) {
//         console.log('ℹ️ Fund account already exists, fetching...');
//         const fundAccountsResponse = await razorpayX.fundAccount.fetch({
//           contact_id: contact.id,
//         });
//         fundAccount = fundAccountsResponse.items[0];
//         console.log('✅ Fund account fetched:', fundAccount?.id);
//       } else {
//         throw error;
//       }
//     }

//     if (!fundAccount) {
//       throw new Error('Failed to create or fetch fund account');
//     }

//     // Step 3: Create payout
//     console.log('💸 Creating payout...');
//     const payout = await razorpayX.payouts.create({
//       account_number: process.env.RAZORPAY_ACCOUNT_NUMBER!,
//       fund_account_id: fundAccount.id,
//       amount: Math.round(vendorAmount * 100), // Convert to paise
//       currency: 'INR',
//       mode: 'UPI',
//       purpose: 'payout',
//       queue_if_low_balance: false,
//       reference_id: orderId,
//       narration: `QRKaro Order ${orderId}`,
//     });

//     console.log('✅ Payout created:', payout.id, '| Status:', payout.status);

//     // Update order with payout details
//     await Order.findOneAndUpdate(
//       { orderId },
//       {
//         payoutStatus: 'processing',
//         payoutId: payout.id,
//         payoutAmount: vendorAmount,
//       }
//     );

//     return NextResponse.json({
//       success: true,
//       payout_id: payout.id,
//       vendor_amount: vendorAmount,
//       platform_commission: platformCommission,
//       status: payout.status,
//     });
//   } catch (error: any) {
//     console.error('❌ Payout error:', error);
//     console.error('Error details:', error.error);
//     return NextResponse.json(
//       {
//         error: error.message || 'Payout failed',
//         details: error.error,
//       },
//       { status: 500 }
//     );
//   }
// }
// import { NextRequest, NextResponse } from 'next/server';
// import Razorpay from 'razorpay';
// import connectDB from '@/lib/mongodb';
// import Order from '@/lib/models/Order';
// import Vendor from '@/lib/models/Vendor';

// export async function POST(req: NextRequest) {
//   try {
//     const { orderId, vendorId, amount } = await req.json();

//     console.log(`🚀 Payout request: Order ${orderId} | Amount ₹${amount}`);

//     // Get vendor details
//     await connectDB();
//     const vendor = await Vendor.findOne({ vendorId });

//     if (!vendor || !vendor.upiId) {
//       return NextResponse.json({ error: 'Vendor UPI not found' }, { status: 404 });
//     }

//     // Calculate split: 95% vendor, 5% platform
//     const platformFee = amount * 0.05;
//     const vendorAmount = amount - platformFee;

//     console.log(`💰 Split: Vendor ₹${vendorAmount} | Platform ₹${platformFee}`);

//     // Initialize RazorpayX
//     const razorpayX = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID!,
//       key_secret: process.env.RAZORPAY_KEY_SECRET!,
//     });

//     // Create contact
//     let contact;
//     try {
//       contact = await razorpayX.contacts.create({
//         name: vendor.accountHolderName,
//         email: `${vendorId}@qrkaro.com`,
//         contact: vendor.phone || '9999999999',
//         type: 'vendor',
//         reference_id: vendorId,
//       });
//       console.log('✅ Contact created:', contact.id);
//     } catch (error: any) {
//       if (error.error?.description?.includes('already exists')) {
//         const contactsResponse = await razorpayX.contacts.all();
//         contact = contactsResponse.items.find((c: any) => c.reference_id === vendorId);
//         console.log('ℹ️ Contact already exists:', contact?.id);
//       } else {
//         throw error;
//       }
//     }

//     if (!contact) {
//       throw new Error('Failed to create contact');
//     }

//     // Create fund account (UPI)
//     let fundAccount;
//     try {
//       fundAccount = await razorpayX.fundAccount.create({
//         contact_id: contact.id,
//         account_type: 'vpa',
//         vpa: {
//           address: vendor.upiId,
//         },
//       });
//       console.log('✅ Fund account created:', fundAccount.id);
//     } catch (error: any) {
//       if (error.error?.description?.includes('already exists')) {
//         const fundAccountsResponse = await razorpayX.fundAccount.fetch({
//           contact_id: contact.id,
//         });
//         fundAccount = fundAccountsResponse.items[0];
//         console.log('ℹ️ Fund account already exists:', fundAccount?.id);
//       } else {
//         throw error;
//       }
//     }

//     if (!fundAccount) {
//       throw new Error('Failed to create fund account');
//     }

//     // Create payout
//     console.log('💸 Creating payout to', vendor.upiId);
//     const payout = await razorpayX.payouts.create({
//       account_number: process.env.RAZORPAY_ACCOUNT_NUMBER!,
//       fund_account_id: fundAccount.id,
//       amount: Math.round(vendorAmount * 100), // Convert to paise
//       currency: 'INR',
//       mode: 'UPI',
//       purpose: 'payout',
//       queue_if_low_balance: false,
//       reference_id: orderId,
//       narration: `QRKaro Order ${orderId}`,
//     });

//     console.log('✅ Payout created:', payout.id, '| Status:', payout.status);

//     // Update order
//     await Order.findOneAndUpdate(
//       { orderId },
//       {
//         payoutStatus: 'processing',
//         payoutId: payout.id,
//         payoutAmount: vendorAmount,
//       }
//     );

//     return NextResponse.json({
//       success: true,
//       payout_id: payout.id,
//       vendor_amount: vendorAmount,
//       platform_fee: platformFee,
//       status: payout.status,
//       message: `₹${vendorAmount} transferred to ${vendor.upiId}`,
//     });
//   } catch (error: any) {
//     console.error('❌ Payout error:', error);
//     return NextResponse.json(
//       {
//         error: error.message || 'Payout failed',
//         details: error.error,
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import Vendor from '@/lib/models/Vendor';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;
const RAZORPAY_ACCOUNT_NUMBER = process.env.RAZORPAY_ACCOUNT_NUMBER!;

// Helper: basic auth header
function razorpayAuthHeader() {
  const token = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
  return `Basic ${token}`;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, vendorId, amount } = await req.json();

    console.log(`🚀 Payout request: Order ${orderId} | Amount ₹${amount}`);

    await connectDB();
    const vendor = await Vendor.findOne({ vendorId });

    if (!vendor || !vendor.upiId) {
      return NextResponse.json({ error: 'Vendor UPI not found' }, { status: 404 });
    }

    // 95% to vendor, 5% platform
    const platformFee = amount * 0.05;
    const vendorAmount = amount - platformFee;

    console.log(`💰 Split: Vendor ₹${vendorAmount} | Platform ₹${platformFee}`);

    // 1. CREATE / GET CONTACT
    let contactId: string | undefined;

    // Try creating contact
    const contactRes = await fetch('https://api.razorpay.com/v1/contacts', {
      method: 'POST',
      headers: {
        Authorization: razorpayAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: vendor.accountHolderName || vendor.shopName,
        email: `${vendorId}@qrkaro.com`,
        contact: vendor.phone || '9999999999',
        type: 'vendor',
        reference_id: vendorId,
      }),
    });

    if (contactRes.status === 200 || contactRes.status === 201) {
      const contactJson = await contactRes.json();
      contactId = contactJson.id;
      console.log('✅ Contact created:', contactId);
    } else {
      // Might already exist – try listing contacts and matching reference_id
      const listRes = await fetch('https://api.razorpay.com/v1/contacts', {
        method: 'GET',
        headers: {
          Authorization: razorpayAuthHeader(),
        },
      });
      const listJson = await listRes.json();
      const existing = (listJson.items || []).find((c: any) => c.reference_id === vendorId);
      if (!existing) {
        const errText = await contactRes.text();
        console.error('❌ Contact error:', errText);
        return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
      }
      contactId = existing.id;
      console.log('ℹ️ Using existing contact:', contactId);
    }

    // 2. CREATE / GET FUND ACCOUNT (UPI / VPA)
    let fundAccountId: string | undefined;

    const faRes = await fetch('https://api.razorpay.com/v1/fund_accounts', {
      method: 'POST',
      headers: {
        Authorization: razorpayAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contact_id: contactId,
        account_type: 'vpa',
        vpa: {
          address: vendor.upiId,
        },
      }),
    });

    if (faRes.status === 200 || faRes.status === 201) {
      const faJson = await faRes.json();
      fundAccountId = faJson.id;
      console.log('✅ Fund account created:', fundAccountId);
    } else {
      const errText = await faRes.text();
      console.error('❌ Fund account error:', errText);
      return NextResponse.json({ error: 'Failed to create fund account' }, { status: 500 });
    }

    // 3. CREATE PAYOUT
    console.log('💸 Creating payout to', vendor.upiId);

    const payoutRes = await fetch('https://api.razorpay.com/v1/payouts', {
      method: 'POST',
      headers: {
        Authorization: razorpayAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_number: RAZORPAY_ACCOUNT_NUMBER,
        fund_account_id: fundAccountId,
        amount: Math.round(vendorAmount * 100), // paise
        currency: 'INR',
        mode: 'UPI',
        purpose: 'payout',
        queue_if_low_balance: false,
        reference_id: orderId,
        narration: `QRKaro Order ${orderId}`,
      }),
    });

    const payoutJson = await payoutRes.json();

    if (payoutRes.status !== 200 && payoutRes.status !== 201) {
      console.error('❌ Payout API error:', payoutJson);
      return NextResponse.json(
        { error: 'Payout API failed', details: payoutJson },
        { status: 500 }
      );
    }

    console.log('✅ Payout created:', payoutJson.id, '| Status:', payoutJson.status);

    // 4. Update order
    await Order.findOneAndUpdate(
      { orderId },
      {
        payoutStatus: 'processing',
        payoutId: payoutJson.id,
        payoutAmount: vendorAmount,
      }
    );

    return NextResponse.json({
      success: true,
      payout_id: payoutJson.id,
      vendor_amount: vendorAmount,
      platform_fee: platformFee,
      status: payoutJson.status,
      message: `₹${vendorAmount} sent to ${vendor.upiId}`,
    });
  } catch (error: any) {
    console.error('❌ Payout error:', error);
    return NextResponse.json(
      { error: error.message || 'Payout failed' },
      { status: 500 }
    );
  }
}
