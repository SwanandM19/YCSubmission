import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  vendorId: string;
  shopName: string;
  phone: string;
  city: string;
  state: string;
  shopType: string;
  menuItems: { name: string; price: number }[];
  upiId: string;
  accountHolderName: string;
  bankAccount?: string;
  ifscCode?: string;
  qrCode?: string;
  subscriptionPaid: boolean;
  subscriptionPaymentId?: string;
  subscriptionOrderId?: string;
  subscriptionAmount: number;
  subscriptionDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    vendorId: {
      type: String,
      required: true,
      unique: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    shopType: {
      type: String,
      required: true,
    },
    menuItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    upiId: {
      type: String,
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    bankAccount: String,
    ifscCode: String,
    qrCode: String,
    subscriptionPaid: {
      type: Boolean,
      default: false,
    },
    subscriptionPaymentId: String,
    subscriptionOrderId: String,
    subscriptionAmount: {
      type: Number,
      default: 200,
    },
    subscriptionDate: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Remove the duplicate index definitions - they're already defined with unique: true above
// VendorSchema.index({ vendorId: 1 });
// VendorSchema.index({ phone: 1 });

export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);
