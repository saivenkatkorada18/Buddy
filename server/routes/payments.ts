import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import Razorpay from 'razorpay';
import { prisma } from '../lib/prisma';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_Tcy4izS0j1853r';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'JG5vlbhzGCcDf8uqWuTAJVxo';

// Initialize Razorpay instance
let razorpayInstance: Razorpay | null = null;
try {
  razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
} catch (err) {
  console.warn('Razorpay SDK initialization warning:', err);
}

const createOrderSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least ₹1'),
  currency: z.string().default('INR'),
  receipt: z.string().optional(),
  notes: z.record(z.string(), z.any()).optional(),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Signature is required'),
  amount: z.number().optional(),
  purpose: z.string().optional(),
  itemId: z.string().optional(),
});

// GET /api/payments/config
// Exposes the public test Key ID for client checkout initialization
router.get('/config', (req: Request, res: Response) => {
  return res.json({
    keyId: RAZORPAY_KEY_ID,
    currency: 'INR',
    environment: 'test',
    businessName: 'BorrowBuddy Campus Network',
  });
});

// POST /api/payments/create-order
router.post('/create-order', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { amount, currency, receipt, notes } = parsed.data;
    const amountInPaise = Math.round(amount * 100);
    const receiptId = receipt || `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const orderPayload = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: receiptId,
      notes: {
        platform: 'BorrowBuddy Web',
        userId: req.user?.id || 'demo_guest',
        ...(notes || {}),
      },
    };

    let orderData: any;

    if (razorpayInstance) {
      try {
        orderData = await razorpayInstance.orders.create(orderPayload);
      } catch (sdkError: any) {
        console.error('Razorpay SDK error, falling back to direct REST API:', sdkError);
      }
    }

    // Direct REST API Fallback
    if (!orderData) {
      const authHeader = `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`;
      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        console.error('Razorpay REST error:', errJson);
        return res.status(response.status).json({
          error: errJson.error?.description || 'Failed to create Razorpay order.',
        });
      }

      orderData = await response.json();
    }

    return res.status(201).json({
      success: true,
      order: orderData,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Create order exception:', error);
    return res.status(500).json({
      error: 'Unable to initialize payment order.',
      details: error.message,
    });
  }
});

// POST /api/payments/verify-payment
router.post('/verify-payment', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = verifyPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, purpose, itemId } = parsed.data;

    // Cryptographic signature verification (HMAC-SHA256)
    const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Verification failed.',
      });
    }

    // If user is authenticated, record activity & update trust score
    if (req.user?.id) {
      try {
        await prisma.activity.create({
          data: {
            userId: req.user.id,
            type: 'system',
            title: 'Payment Successful',
            description: `Payment of ₹${amount || 0} verified (Payment ID: ${razorpay_payment_id}) for ${purpose || 'Campus Escrow/Pass'}`,
            timestamp: new Date().toISOString(),
          },
        });

        // Award +5 trust points for verified transactions
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            trustScore: {
              increment: 5,
            },
          },
        });
      } catch (dbErr) {
        console.warn('Could not record payment activity in DB:', dbErr);
      }
    }

    return res.json({
      success: true,
      message: 'Payment verified and confirmed successfully.',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      verifiedAt: new Date().toISOString(),
      amount: amount || 0,
      currency: 'INR',
      purpose: purpose || 'BorrowBuddy Demo Payment',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      error: 'Payment verification failed.',
      details: error.message,
    });
  }
});

export default router;
