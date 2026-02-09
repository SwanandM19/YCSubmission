// import mongoose, { Schema, models, Model } from 'mongoose';

// export interface IOrderItem {
//   name: string;
//   price: number;
//   quantity: number;
// }

// export interface IOrder {
//   orderId: string;
//   vendorId: string;
//   items: IOrderItem[];
//   subtotal: number;
//   tax: number;
//   platformFee: number;
//   totalAmount: number;
//   customerPhone?: string;
//   customerName?: string;
//   status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
//   paymentStatus: 'pending' | 'paid' | 'failed';
//   paymentId?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const OrderSchema = new Schema<IOrder>(
//   {
//     orderId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },
//     vendorId: {
//       type: String,
//       required: true,
//       index: true,
//     },
//     items: [
//       {
//         name: String,
//         price: Number,
//         quantity: Number,
//       },
//     ],
//     subtotal: {
//       type: Number,
//       required: true,
//     },
//     tax: {
//       type: Number,
//       default: 0,
//     },
//     platformFee: {
//       type: Number,
//       default: 5,
//     },
//     totalAmount: {
//       type: Number,
//       required: true,
//     },
//     customerPhone: String,
//     customerName: String,
//     status: {
//       type: String,
//       enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
//       default: 'pending',
//     },
//     paymentStatus: {
//       type: String,
//       enum: ['pending', 'paid', 'failed'],
//       default: 'pending',
//     },
//     paymentId: String,
//   },
//   {
//     timestamps: true,
//   }
// );

// const Order: Model<IOrder> = models.Order || mongoose.model<IOrder>('Order', OrderSchema);

// export default Order;


import mongoose, { Schema, models, Model } from 'mongoose';

export interface IOrder {
  orderId: string;
  vendorId: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  tax: number;
  platformFee: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  
  // Payout tracking
  payoutStatus: 'pending' | 'processing' | 'completed' | 'failed';
  payoutId?: string;
  payoutAmount?: number;
  
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    vendorId: {
      type: String,
      required: true,
      index: true,
    },
    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    subtotal: Number,
    tax: Number,
    platformFee: Number,
    totalAmount: Number,
    
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentId: String,
    
    payoutStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    payoutId: String,
    payoutAmount: Number,
    
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> = models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
