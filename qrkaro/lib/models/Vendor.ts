// import mongoose, { Schema, models, Model } from 'mongoose';

// export interface IMenuItem {
//   name: string;
//   price: number;
// }

// export interface IVendor {
//   vendorId: string;
//   shopName: string;
//   phone: string;
//   city: string;
//   shopType: string;
//   menuItems: IMenuItem[];
//   accountHolderName: string;
//   accountNumber: string;
//   ifscCode: string;
//   panNumber: string;
//   qrCodeUrl?: string;
//   customerPageUrl: string;
//   status: 'pending' | 'active';
//   createdAt: Date;
//   updatedAt: Date;
// }

// const VendorSchema = new Schema<IVendor>(
//   {
//     vendorId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },
//     shopName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     city: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     shopType: {
//       type: String,
//       required: true,
//       enum: ['Restaurant', 'Cafe', 'Stall', 'Xerox', 'Grocery', 'Retail', 'Other'],
//     },
//     menuItems: [
//       {
//         name: {
//           type: String,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//     accountHolderName: {
//       type: String,
//       required: true,
//     },
//     accountNumber: {
//       type: String,
//       required: true,
//     },
//     ifscCode: {
//       type: String,
//       required: true,
//     },
//     panNumber: {
//       type: String,
//       required: true,
//     },
//     qrCodeUrl: {
//       type: String,
//     },
//     customerPageUrl: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'active'],
//       default: 'active',
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// const Vendor: Model<IVendor> = models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);

// export default Vendor;



import mongoose, { Schema, models, Model } from 'mongoose';

export interface IVendor {
  vendorId: string;
  shopName: string;
  shopType: string;
  city: string;
  state: string;
  phone: string;
  menuItems: { name: string; price: number }[];
  
  // Payment Details
  upiId: string;
  accountHolderName: string;
  
  // Optional backup
  bankAccount?: string;
  ifscCode?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    vendorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    shopName: {
      type: String,
      required: true,
    },
    shopType: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    menuItems: [
      {
        name: String,
        price: Number,
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
  },
  {
    timestamps: true,
  }
);

const Vendor: Model<IVendor> = models.Vendor || mongoose.model<IVendor>('Vendor', VendorSchema);

export default Vendor;
