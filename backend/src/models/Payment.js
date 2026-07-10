import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    planType: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      required: true
    },
    provider: {
      type: String,
      enum: ['razorpay', 'stripe', 'qrcode'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    // Razorpay fields
    orderId: String,
    paymentId: String,
    signature: String,
    
    // Stripe fields
    paymentIntentId: String,
    clientSecret: String,
    
    // QR Code fields
    qrCodeData: {
      generatedAt: Date,
      amount: Number,
      planType: String
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    
    // Additional info
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
    refundReason: String,
    refundAmount: Number,
    refundDate: Date,
    transactionHash: String,
    ipAddress: String,
    userAgent: String
  },
  {
    timestamps: true
  }
);

// Index for faster queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ provider: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paymentIntentId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
