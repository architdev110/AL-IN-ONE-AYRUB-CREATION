import Razorpay from 'razorpay';
import stripe from 'stripe';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import logger from '../config/logger.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// CREATE RAZORPAY ORDER
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  try {
    const { amount, planType } = req.body;
    const userId = req.user.id;

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${userId}_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);

    // Store order in database
    await Payment.create({
      userId,
      orderId: order.id,
      amount,
      planType,
      provider: 'razorpay',
      status: 'pending'
    });

    res.status(201).json({
      status: 'success',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    logger.error(`Razorpay order creation failed: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Failed to create payment order'\n    });\n  }\n});\n\n// VERIFY RAZORPAY PAYMENT\nexport const verifyRazorpayPayment = asyncHandler(async (req, res) => {\n  try {\n    const { orderId, paymentId, signature } = req.body;\n\n    // Verify signature\n    const crypto = require('crypto');\n    const generatedSignature = crypto\n      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)\n      .update(`${orderId}|${paymentId}`)\n      .digest('hex');\n\n    if (generatedSignature !== signature) {\n      return res.status(400).json({\n        status: 'error',\n        message: 'Payment verification failed'\n      });\n    }\n\n    // Update payment status\n    const payment = await Payment.findOneAndUpdate(\n      { orderId },\n      { status: 'completed', paymentId },\n      { new: true }\n    );\n\n    if (!payment) {\n      return res.status(404).json({\n        status: 'error',\n        message: 'Payment not found'\n      });\n    }\n\n    // Update user subscription\n    await User.findByIdAndUpdate(\n      payment.userId,\n      { subscriptionPlan: payment.planType }\n    );\n\n    logger.info(`Payment verified: ${paymentId}`);\n\n    res.json({\n      status: 'success',\n      message: 'Payment verified successfully',\n      data: payment\n    });\n  } catch (error) {\n    logger.error(`Razorpay verification failed: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Payment verification failed'\n    });\n  }\n});\n\n// CREATE STRIPE PAYMENT INTENT\nexport const createStripePaymentIntent = asyncHandler(async (req, res) => {\n  try {\n    const { amount, planType } = req.body;\n    const userId = req.user.id;\n\n    const paymentIntent = await stripeClient.paymentIntents.create({\n      amount: amount * 100, // Convert to cents\n      currency: 'usd',\n      metadata: {\n        userId,\n        planType\n      }\n    });\n\n    // Store in database\n    await Payment.create({\n      userId,\n      paymentIntentId: paymentIntent.id,\n      amount,\n      planType,\n      provider: 'stripe',\n      status: 'pending'\n    });\n\n    res.status(201).json({\n      status: 'success',\n      data: {\n        clientSecret: paymentIntent.client_secret,\n        paymentIntentId: paymentIntent.id\n      }\n    });\n  } catch (error) {\n    logger.error(`Stripe payment intent creation failed: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Failed to create payment intent'\n    });\n  }\n});\n\n// VERIFY STRIPE PAYMENT\nexport const verifyStripePayment = asyncHandler(async (req, res) => {\n  try {\n    const { paymentIntentId } = req.body;\n\n    const paymentIntent = await stripeClient.paymentIntents.retrieve(\n      paymentIntentId\n    );\n\n    if (paymentIntent.status !== 'succeeded') {\n      return res.status(400).json({\n        status: 'error',\n        message: 'Payment not completed'\n      });\n    }\n\n    // Update payment status\n    const payment = await Payment.findOneAndUpdate(\n      { paymentIntentId },\n      { status: 'completed' },\n      { new: true }\n    );\n\n    if (!payment) {\n      return res.status(404).json({\n        status: 'error',\n        message: 'Payment not found'\n      });\n    }\n\n    // Update user subscription\n    await User.findByIdAndUpdate(\n      payment.userId,\n      { subscriptionPlan: payment.planType }\n    );\n\n    logger.info(`Stripe payment verified: ${paymentIntentId}`);\n\n    res.json({\n      status: 'success',\n      message: 'Payment verified successfully',\n      data: payment\n    });\n  } catch (error) {\n    logger.error(`Stripe verification failed: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Payment verification failed'\n    });\n  }\n});\n\n// CREATE QR CODE PAYMENT\nexport const createQRCodePayment = asyncHandler(async (req, res) => {\n  try {\n    const { amount, planType, description } = req.body;\n    const userId = req.user.id;\n\n    // Create payment record\n    const payment = await Payment.create({\n      userId,\n      amount,\n      planType,\n      provider: 'qrcode',\n      status: 'pending',\n      description,\n      qrCodeData: {\n        generatedAt: new Date(),\n        amount,\n        planType\n      }\n    });\n\n    logger.info(`QR code payment created: ${payment._id}`);\n\n    res.status(201).json({\n      status: 'success',\n      data: {\n        paymentId: payment._id,\n        amount,\n        planType,\n        status: payment.status\n      }\n    });\n  } catch (error) {\n    logger.error(`QR code payment creation failed: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Failed to create QR code payment'\n    });\n  }\n});\n\n// VERIFY QR CODE PAYMENT (Admin verifies after scanning)\nexport const verifyQRCodePayment = asyncHandler(async (req, res) => {\n  try {\n    const { paymentId } = req.body;\n    const adminId = req.user.id;\n\n    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {\n      return res.status(403).json({\n        status: 'error',\n        message: 'Only admins can verify QR payments'\n      });\n    }\n\n    // Update payment status\n    const payment = await Payment.findByIdAndUpdate(\n      paymentId,\n      { \n        status: 'completed',\n        verifiedBy: adminId,\n        verifiedAt: new Date()\n      },\n      { new: true }\n    );\n\n    if (!payment) {\n      return res.status(404).json({\n        status: 'error',\n        message: 'Payment not found'\n      });\n    }\n\n    // Update user subscription\n    await User.findByIdAndUpdate(\n      payment.userId,\n      { subscriptionPlan: payment.planType }\n    );\n\n    logger.info(`QR code payment verified: ${paymentId}`);\n\n    res.json({\n      status: 'success',\n      message: 'QR code payment verified successfully',\n      data: payment\n    });\n  } catch (error) {\n    logger.error(`QR code verification failed: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'QR code verification failed'\n    });\n  }\n});\n\n// GET PAYMENT HISTORY\nexport const getPaymentHistory = asyncHandler(async (req, res) => {\n  try {\n    const userId = req.user.id;\n    const { page = 1, limit = 10 } = req.query;\n\n    const payments = await Payment.find({ userId })\n      .sort({ createdAt: -1 })\n      .limit(limit * 1)\n      .skip((page - 1) * limit);\n\n    const total = await Payment.countDocuments({ userId });\n\n    res.json({\n      status: 'success',\n      data: {\n        payments,\n        pagination: {\n          total,\n          page: parseInt(page),\n          pages: Math.ceil(total / limit)\n        }\n      }\n    });\n  } catch (error) {\n    logger.error(`Payment history retrieval failed: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Failed to retrieve payment history'\n    });\n  }\n});\n\n// GET ADMIN PAYMENT STATISTICS\nexport const getAdminPaymentStats = asyncHandler(async (req, res) => {\n  try {\n    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {\n      return res.status(403).json({\n        status: 'error',\n        message: 'Only admins can access payment statistics'\n      });\n    }\n\n    const stats = await Payment.aggregate([\n      {\n        $group: {\n          _id: '$provider',\n          totalAmount: { $sum: '$amount' },\n          count: { $sum: 1 },\n          completed: {\n            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }\n          }\n        }\n      }\n    ]);\n\n    res.json({\n      status: 'success',\n      data: stats\n    });\n  } catch (error) {\n    logger.error(`Payment stats retrieval failed: ${error.message}`);\n    res.status(500).json({\n      status: 'error',\n      message: 'Failed to retrieve payment statistics'\n    });\n  }\n});\n"