// import mongoose, { Schema, Document } from 'mongoose';

// export interface IVendor extends Document {
//   vendorId: string;
//   shopName: string;
//   phone: string;
//   city: string;
//   state: string;
//   shopType: string;
//   menuItems: { name: string; price: number }[];
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
//   fcmTokens?: string[]; // ✅ ADDED: FCM tokens for push notifications
//   createdAt: Date;
//   updatedAt: Date;
// }

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
//     menuItems: [
//       {
//         name: { type: String, required: true },
//         price: { type: Number, required: true },
//       },
//     ],
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
//     // ✅ ADDED: Array of FCM tokens (vendor can have multiple devices)
//     fcmTokens: {
//       type: [String],
//       default: [],
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);


// import mongoose, { Schema, Document } from 'mongoose';

// export interface IVendor extends Document {
//   vendorId: string;
//   shopName: string;
//   phone: string;
//   city: string;
//   state: string;
//   shopType: string;
//   menuItems: { name: string; price: number }[];
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
//   password: string;
//   passwordChangedAt?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

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
//     menuItems: [
//       {
//         name: { type: String, required: true },
//         price: { type: Number, required: true },
//       },
//     ],
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
//     // ✅ NEW: Password fields
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

// export default mongoose.models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);



import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem {
  name: string;
  price: number;
  available: boolean;
  category: string;
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
  password: string;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    category: { type: String, default: 'Other' }, // ✅ NEW
  },
  { _id: true }
);

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
    menuItems: {
      type: [MenuItemSchema],
      default: [],
    },
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
    fcmTokens: {
      type: [String],
      default: [],
    },
    password: {
      type: String,
      required: true,
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Vendor ||
  mongoose.model<IVendor>('Vendor', VendorSchema);
