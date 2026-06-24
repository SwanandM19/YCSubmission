import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem {
  name: string;
  price: number;
  available: boolean;
  category: string;
  stock?: number | null;
  lowStockThreshold?: number;
  unit?: string;
  sku?: string;
  desc?: string;
  isVeg?: boolean;
}

export interface IVendor extends Document {
  vendorId: string;
  shopName: string;
  phone: string;
  city: string;
  state: string;
  shopType: string;
  menuItems: IMenuItem[];
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
  // isActive: boolean;
  // fcmTokens?: string[];
  // xeroxSettings?: {
    isActive: boolean;
    fcmTokens?: string[];
    notificationsReadAt?: Date | null;
    xeroxSettings?: {
    bwPerPage: number;
    colorPerPage: number;
    autoPrint: boolean;
    printerName: string;
    autoPrintMode: 'browser' | 'agent';
    agentSetupComplete: boolean; // ✅ NEW — tracks if vendor finished setup popup
  };
  password: string;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name:              { type: String, required: true },
    price:             { type: Number, required: true },
    available:         { type: Boolean, default: true },
    category:          { type: String, default: 'Other' },
    // stock:             { type: Number, default: null },
    stock:             { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    unit:              { type: String, default: '' },
    sku:               { type: String, default: '' },
    desc:              { type: String, default: '' },
    isVeg:             { type: Boolean, default: true },
  },
  { _id: true }
);

const VendorSchema = new Schema<IVendor>(
  {
    vendorId:              { type: String, required: true, unique: true },
    shopName:              { type: String, required: true },
    phone:                 { type: String, required: true, unique: true },
    city:                  { type: String, required: true },
    state:                 { type: String, required: true },
    shopType:              { type: String, required: true },
    menuItems:             { type: [MenuItemSchema], default: [] },
    upiId:                 { type: String, required: true },
    accountHolderName:     { type: String, required: true },
    bankAccount:           String,
    ifscCode:              String,
    qrCode:                String,
    subscriptionPaid:      { type: Boolean, default: false },
    subscriptionPaymentId: String,
    subscriptionOrderId:   String,
    subscriptionAmount:    { type: Number, default: 200 },
    subscriptionDate:      Date,
    isActive:              { type: Boolean, default: true },
    fcmTokens:             { type: [String], default: [] },
    notificationsReadAt:   { type: Date, default: null },
    xeroxSettings: {
      bwPerPage:           { type: Number,  default: 1.5 },
      colorPerPage:        { type: Number,  default: 8 },
      autoPrint:           { type: Boolean, default: false },
      printerName:         { type: String,  default: '' },
      autoPrintMode:       { type: String,  default: 'browser',
                             enum: ['browser', 'agent'] },
      agentSetupComplete:  { type: Boolean, default: false }, // ✅ NEW
    },
    password:            { type: String, required: true },
    passwordChangedAt:   Date,
  },
  { timestamps: true }
);

export default mongoose.models.Vendor ||
  mongoose.model<IVendor>('Vendor', VendorSchema);