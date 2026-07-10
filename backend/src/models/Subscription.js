import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: String,
    price: {
      type: Number,
      required: true
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    },
    features: [{
      name: String,
      included: Boolean,
      limit: Number
    }],
    limits: {
      resumeBuilders: Number,
      portfolios: Number,
      interviews: Number,
      storage: Number, // in MB
      apiRequests: Number,
      collaborators: Number
    },
    isActive: {
      type: Boolean,
      default: true
    },
    stripePriceId: String,
    razorpayPlanId: String,
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
