

// import mongoose, { Schema, Document } from 'mongoose';

// export interface IMenuItem {
//   name: string;
//   price: number;
//   available: boolean;
//   category: string;
//   stock?: number | null;
//   lowStockThreshold?: number;
//   unit?: string;
//   sku?: string;
//   desc?: string;
//   isVeg?: boolean;
// }

// export interface IVendor extends Document {
//   vendorId: string;
//   shopName: string;
//   phone: string;
//   city: string;
//   state: string;
//   shopType: string;
//   menuItems: IMenuItem[];
//   upiId: string;
//   accountHolderName: string;
//   bankAccount?: string;
//   ifscCode?: string;
//   qrCode?: string;
//   subscriptionPaid: boolean;
//   subscriptionPaymentId?: string;
//   subscriptionOrderId?: string;
//   subscriptionAmount: number;
//   subscriptionDate?: Date;
//   isActive: boolean;
//   fcmTokens?: string[];
//   xeroxSettings?: {
//     bwPerPage: number;
//     colorPerPage: number;
//   };
//   password: string;
//   passwordChangedAt?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const MenuItemSchema = new Schema<IMenuItem>(
//   {
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     available: { type: Boolean, default: true },
//     category: { type: String, default: 'Other' }, // ✅ NEW
//     stock: { type: Number, default: null },   // null = unlimited (food stalls)
//     lowStockThreshold: { type: Number, default: 5 },      // alert when stock <= this
//     unit: { type: String, default: '' },     // kg, litre, pcs, pack
//     sku: { type: String, default: '' },     // barcode / SKU code
//     desc: { type: String, default: '' },
//     isVeg: { type: Boolean, default: true },
//   },
//   { _id: true }
// );

// const VendorSchema = new Schema<IVendor>(
//   {
//     vendorId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     shopName: {
//       type: String,
//       required: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     state: {
//       type: String,
//       required: true,
//     },
//     shopType: {
//       type: String,
//       required: true,
//     },
//     menuItems: {
//       type: [MenuItemSchema],
//       default: [],
//     },
//     upiId: {
//       type: String,
//       required: true,
//     },
//     accountHolderName: {
//       type: String,
//       required: true,
//     },
//     bankAccount: String,
//     ifscCode: String,
//     qrCode: String,
//     subscriptionPaid: {
//       type: Boolean,
//       default: false,
//     },
//     subscriptionPaymentId: String,
//     subscriptionOrderId: String,
//     subscriptionAmount: {
//       type: Number,
//       default: 200,
//     },
//     subscriptionDate: Date,
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//     fcmTokens: {
//       type: [String],
//       default: [],
//     },
//     xeroxSettings: {
//       bwPerPage: { type: Number, default: 1.5 },
//       colorPerPage: { type: Number, default: 8 },
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     passwordChangedAt: {
//       type: Date,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.models.Vendor ||
//   mongoose.model<IVendor>('Vendor', VendorSchema);


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
  isActive: boolean;
  fcmTokens?: string[];
  xeroxSettings?: {
    bwPerPage: number;
    colorPerPage: number;
    printMode: 'manual' | 'auto'; // ✅ NEW
  };
  password: string;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema(
  {
    name:              { type: String,  required: true },
    price:             { type: Number,  required: true },
    available:         { type: Boolean, default: true },
    category:          { type: String,  default: 'Other' },
    stock:             { type: Number,  default: null },
    lowStockThreshold: { type: Number,  default: 5 },
    unit:              { type: String,  default: '' },
    sku:               { type: String,  default: '' },
    desc:              { type: String,  default: '' },
    isVeg:             { type: Boolean, default: true },
  },
  { _id: true }
);

const VendorSchema = new Schema(
  {
    vendorId:             { type: String,  required: true, unique: true },
    shopName:             { type: String,  required: true },
    phone:                { type: String,  required: true, unique: true },
    city:                 { type: String,  required: true },
    state:                { type: String,  required: true },
    shopType:             { type: String,  required: true },
    menuItems:            { type: [MenuItemSchema], default: [] },
    upiId:                { type: String,  required: true },
    accountHolderName:    { type: String,  required: true },
    bankAccount:          String,
    ifscCode:             String,
    qrCode:               String,
    subscriptionPaid:     { type: Boolean, default: false },
    subscriptionPaymentId: String,
    subscriptionOrderId:  String,
    subscriptionAmount:   { type: Number,  default: 200 },
    subscriptionDate:     Date,
    isActive:             { type: Boolean, default: true },
    fcmTokens:            { type: [String], default: [] },
    xeroxSettings: {
      bwPerPage:    { type: Number, default: 1.5 },
      colorPerPage: { type: Number, default: 8 },
      printMode:    { type: String, enum: ['manual', 'auto'], default: 'manual' }, // ✅ NEW
    },
    password:            { type: String, required: true },
    passwordChangedAt:   { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);