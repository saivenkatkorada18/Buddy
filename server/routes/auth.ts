import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'borrowbuddy_jwt_super_secret_key_2026';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid university email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  course: z.string().min(2, 'Course is required'),
});

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(1, 'Password is required'),
});

import { sendVerificationOtpEmail } from '../lib/email';

const otpRequestSchema = z.object({
  email: z.string().email('Valid university email required'),
  name: z.string().optional(),
});

const otpVerifySchema = z.object({
  email: z.string().email('Valid university email required'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

// POST /api/auth/send-otp
router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const parsed = otpRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { email, name } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Generate random 6 digit numeric code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete existing OTPs for this email in SQLite
    try {
      await (prisma as any).otpVerification.deleteMany({
        where: { email: normalizedEmail },
      });
      await (prisma as any).otpVerification.create({
        data: {
          email: normalizedEmail,
          code: otpCode,
          expiresAt,
        },
      });
    } catch (dbErr) {
      // Fallback direct raw insert if needed
      console.warn('Prisma table insert warning:', dbErr);
      await prisma.$executeRawUnsafe(
        `INSERT INTO OtpVerification (id, email, code, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?)`,
        `otp_${Date.now()}`,
        normalizedEmail,
        otpCode,
        expiresAt.toISOString(),
        new Date().toISOString()
      );
    }

    // Send real email via Resend
    const emailResult = await sendVerificationOtpEmail(
      normalizedEmail,
      name || 'Student',
      otpCode
    );

    return res.json({
      success: true,
      message: `Verification code sent to ${normalizedEmail}`,
      emailDelivery: emailResult,
      // For local testing demo when sandbox domain restrictions apply:
      demoCode: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return res.status(500).json({ error: 'Failed to send OTP verification email.' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const parsed = otpVerifySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { email, code } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check OTP in DB
    let record: any = null;
    try {
      record = await (prisma as any).otpVerification.findFirst({
        where: {
          email: normalizedEmail,
          code,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT * FROM OtpVerification WHERE email = ? AND code = ? AND expiresAt > ? ORDER BY createdAt DESC LIMIT 1`,
        normalizedEmail,
        code,
        new Date().toISOString()
      );
      record = rows[0];
    }

    if (!record) {
      return res.status(400).json({
        verified: false,
        error: 'Invalid or expired 6-digit verification code. Please request a new code.',
      });
    }

    // Clean up used OTP
    try {
      await (prisma as any).otpVerification.deleteMany({
        where: { email: normalizedEmail },
      });
    } catch {
      await prisma.$executeRawUnsafe(`DELETE FROM OtpVerification WHERE email = ?`, normalizedEmail);
    }

    return res.json({
      verified: true,
      message: 'Student email verified successfully!',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ error: 'Failed to verify OTP code.' });
  }
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { name, email, password, course } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check institutional / university / organization domain
    const isInstitutional =
      normalizedEmail.endsWith('.edu') ||
      normalizedEmail.endsWith('.edu.in') ||
      normalizedEmail.endsWith('.ac.in') ||
      normalizedEmail.endsWith('.ac.uk') ||
      normalizedEmail.endsWith('.org') ||
      normalizedEmail.includes('.univ') ||
      normalizedEmail.includes('superadmin') ||
      normalizedEmail.includes('college') ||
      normalizedEmail.includes('university');

    if (!isInstitutional) {
      return res.status(400).json({
        error:
          'Access restricted: Only official university (.edu, .ac.in) or registered organization accounts are permitted to join.',
      });
    }

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        initials,
        course,
        avatarColor: 'bg-indigo-100 text-indigo-700',
        verifiedEmail: true,
        profileVerified: true,
        trustScore: 85,
        onTimeReturnsCount: 0,
        totalReturnsCount: 0,
        avgConditionRating: 5.0,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    return res.status(201).json({ token, user: safeUser });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to register account.' });
  }
});


// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Special handler for Organization / University SuperAdmin: borrowbuddy@superadmin.in
    if (normalizedEmail === 'borrowbuddy@superadmin.in') {
      if (password === 'ChangeThePassword@123!') {
        let adminUser = await prisma.user.findUnique({
          where: { email: 'borrowbuddy@superadmin.in' },
        });

        if (!adminUser) {
          const passwordHash = await bcrypt.hash('ChangeThePassword@123!', 10);
          adminUser = await prisma.user.create({
            data: {
              name: 'University & Organization SuperAdmin',
              email: 'borrowbuddy@superadmin.in',
              passwordHash,
              initials: 'SA',
              avatarColor: 'bg-amber-100 text-amber-800',
              course: 'Central Operations & Asset Oversight',
              verifiedEmail: true,
              profileVerified: true,
              trustScore: 99,
              onTimeReturnsCount: 50,
              totalReturnsCount: 50,
              avgConditionRating: 5.0,
              memberSince: 'Sep 2023',
            },
          });
        }

        const token = jwt.sign(
          { id: adminUser.id, email: adminUser.email, name: adminUser.name, role: 'superadmin' },
          JWT_SECRET,
          { expiresIn: '30d' }
        );

        const { passwordHash: _, ...safeAdmin } = adminUser;
        return res.json({ token, user: safeAdmin });
      } else {
        return res.status(401).json({ error: 'Invalid SuperAdmin password.' });
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    return res.json({ token, user: safeUser });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});


// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        items: true,
        borrowRequestsMade: {
          include: {
            item: true,
            lender: {
              select: { id: true, name: true, initials: true, avatarColor: true, trustScore: true },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.json(safeUser);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

export default router;
