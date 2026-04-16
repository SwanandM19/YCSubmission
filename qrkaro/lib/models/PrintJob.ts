// import mongoose from 'mongoose';

// const PrintJobSchema = new mongoose.Schema({
//   vendorId: { type: String, required: true, index: true },
//   customerName: { type: String, default: 'Walk-in Customer' },
//   customerPhone: String,
//   fileUrl: { type: String, required: true },
//   fileName: { type: String, required: true },
//   pageCount: { type: Number, required: true },
//   printType: { type: String, enum: ['bw', 'color'], default: 'bw' },
//   copies: { type: Number, default: 1 },
//   doubleSided: { type: Boolean, default: false },
//   totalAmount: { type: Number, required: true },
//   paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
//   printStatus: { type: String, enum: ['queued', 'printing', 'done', 'cancelled'], default: 'queued' },
//   razorpayOrderId: String,
//   razorpayPaymentId: String,
//   notes: String,
// }, { timestamps: true });

// export default mongoose.models.PrintJob || mongoose.model('PrintJob', PrintJobSchema);

// import mongoose from 'mongoose';

// const PrintJobSchema = new mongoose.Schema(
//   {
//     vendorId: { type: String, required: true, index: true },
//     customerName: { type: String, default: 'Walk-in Customer' },
//     customerPhone: String,

//     fileUrl: { type: String, required: true },
//     fileName: { type: String, required: true },
//     pageCount: { type: Number, required: true },
//     printType: { type: String, enum: ['bw', 'color'], default: 'bw' },
//     copies: { type: Number, default: 1 },
//     doubleSided: { type: Boolean, default: false },

//     totalAmount: { type: Number, required: true },

//     paymentStatus: {
//       type: String,
//       enum: ['pending', 'paid'],
//       default: 'pending',
//     },

//     printStatus: {
//       type: String,
//       enum: ['queued', 'printing', 'done', 'cancelled'],
//       default: 'queued',
//     },

//     razorpayOrderId: String,
//     razorpayPaymentId: String,

//     // ✅ ADD THESE FOR VENDOR PAYOUT TRACKING
//     payoutStatus: {
//       type: String,
//       enum: ['pending', 'processing', 'completed', 'failed'],
//       default: 'pending',
//     },
//     payoutId: {
//       type: String,
//       default: null,
//     },
//     payoutAmount: {
//       type: Number,
//       default: null,
//     },

//     notes: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.models.PrintJob ||
//   mongoose.model('PrintJob', PrintJobSchema);

import mongoose from 'mongoose';

const PrintJobSchema = new mongoose.Schema(
  {
    vendorId:      { type: String, required: true, index: true },
    customerName:  { type: String, default: 'Walk-in Customer' },
    customerPhone: String,

    fileUrl:   { type: String, required: true },
    fileName:  { type: String, required: true },
    pageCount: { type: Number, required: true },

    // ── Core (kept for vendor display backward-compat) ──────────
    printType:   { type: String, enum: ['bw', 'color'], default: 'bw' },
    copies:      { type: Number, default: 1 },
    doubleSided: { type: Boolean, default: false },

    // ── NEW: Extended print settings ────────────────────────────
    colorMode:    { type: String, enum: ['bw', 'color', 'grayscale'], default: 'bw' },
    paperSize:    { type: String, enum: ['A4', 'A3', 'Legal', 'Letter'], default: 'A4' },
    orientation:  { type: String, enum: ['portrait', 'landscape'], default: 'portrait' },
    pageRange:    { type: String, default: 'all' },          // 'all' or '1-3,5,8-12'
    printQuality: { type: String, enum: ['draft', 'normal', 'high'], default: 'normal' },
    stapling:     { type: Boolean, default: false },
    binding:      { type: Boolean, default: false },
    specialInstructions: { type: String, default: '' },

    totalAmount: { type: Number, required: true },

    paymentStatus: {
      type: String, enum: ['pending', 'paid'], default: 'pending',
    },
    printStatus: {
      type: String, enum: ['queued', 'printing', 'done', 'cancelled'], default: 'queued',
    },

    razorpayOrderId:  String,
    razorpayPaymentId: String,

    payoutStatus: {
      type: String, enum: ['pending', 'processing', 'completed', 'failed'], default: 'pending',
    },
    payoutId:     { type: String, default: null },
    payoutAmount: { type: Number, default: null },

    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.PrintJob ||
  mongoose.model('PrintJob', PrintJobSchema);