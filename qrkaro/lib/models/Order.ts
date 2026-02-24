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
  
  // ✅ ADDED: Customer details and notification token
  customerName?: string;
  customerPhone?: string;
  customerFcmToken?: string;
  
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
    
    // ✅ ADDED: Customer information
    customerName: {
      type: String,
    },
    customerPhone: {
      type: String,
      index: true, // For looking up customer's past orders
    },
    customerFcmToken: {
      type: String, // FCM token for sending order status notifications
    },
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> = models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
