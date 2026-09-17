import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import {
  sendOrgAcceptedRequestEmail,
  sendOrgMessageToCustomerEmail,
} from '../lib/email';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'borrowbuddy_jwt_super_secret_key_2026';
const ORG_PASSCODE_MASTER = 'ORG-TEAM-2026';

// Helper to verify if email belongs to recognized organization
function isOrgEmail(email: string): boolean {
  const lower = email.toLowerCase();
  return (
    lower.endsWith('@superadmin.in') ||
    lower.includes('.edu') ||
    lower.includes('.ac.in') ||
    lower.includes('org') ||
    lower.includes('campus') ||
    lower.includes('admin')
  );
}

// POST /api/org/signup - Organization Team Signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password, department, organizationName, orgPasscode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check organization eligibility
    const validOrg = isOrgEmail(normalizedEmail) || orgPasscode === ORG_PASSCODE_MASTER;
    if (!validOrg) {
      return res.status(403).json({
        error:
          'Organization signup is restricted to institutional domains (.edu, .ac.in, @superadmin.in) or valid Organization Passcode.',
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return res.status(409).json({ error: 'An account with this organization email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name,
        passwordHash,
        role: 'ADMIN',
        profileVerified: true,
        course: department || organizationName || 'Equipment Management Team',
        campus: 'Main University Central Facility',
        bio: `Official Organization Team Staff: ${organizationName || 'Campus Central Hub'}`,
        trustScore: 100,
        completedBorrows: 0,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...safeUser } = user;

    return res.status(201).json({
      message: 'Organization Team account created successfully.',
      token,
      user: {
        ...safeUser,
        organizationName: organizationName || 'Campus Organization Team',
        department: department || 'Equipment Office',
      },
    });
  } catch (error: any) {
    console.error('Org signup error:', error);
    return res.status(500).json({ error: 'Failed to create organization account.' });
  }
});

// POST /api/org/login - Organization Team Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Special quick superadmin fallback
    if (
      normalizedEmail === 'borrowbuddy@superadmin.in' &&
      password === 'ChangeThePassword@123!'
    ) {
      let superadmin = await prisma.user.findUnique({ where: { email: normalizedEmail } });
      if (!superadmin) {
        const hash = await bcrypt.hash(password, 10);
        superadmin = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: 'Campus SuperAdmin Team',
            passwordHash: hash,
            role: 'SUPERADMIN',
            profileVerified: true,
            course: 'Central Operations',
            campus: 'Main University Central Facility',
            trustScore: 100,
          },
        });
      }

      const token = jwt.sign(
        { id: superadmin.id, email: superadmin.email, name: superadmin.name, role: superadmin.role },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      const { passwordHash: _, ...safeUser } = superadmin;
      return res.json({
        token,
        user: {
          ...safeUser,
          organizationName: 'BorrowBuddy Central Admin',
          department: 'Equipment Governance',
        },
      });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid organization credentials.' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid organization credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    const { passwordHash: _, ...safeUser } = user;
    return res.json({
      token,
      user: {
        ...safeUser,
        organizationName: 'Campus Organization Team',
      },
    });
  } catch (error) {
    console.error('Org login error:', error);
    return res.status(500).json({ error: 'Failed to authenticate organization staff.' });
  }
});

// GET /api/org/stats - Organization overview metrics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [pendingCount, approvedCount, activeCount, totalItems] = await Promise.all([
      prisma.borrowRequest.count({ where: { status: 'pending' } }),
      prisma.borrowRequest.count({ where: { status: 'approved' } }),
      prisma.borrowRequest.count({ where: { status: 'active' } }),
      prisma.item.count(),
    ]);

    return res.json({
      pendingRequests: pendingCount,
      approvedRequests: approvedCount,
      activeLoans: activeCount,
      totalInventory: totalItems,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch org stats.' });
  }
});

// GET /api/org/requests - Stream all customer inquiries and borrow requests
router.get('/requests', async (req: Request, res: Response) => {
  try {
    const requests = await prisma.borrowRequest.findMany({
      include: {
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
            course: true,
            campus: true,
            avatarUrl: true,
            trustScore: true,
            profileVerified: true,
          },
        },
        item: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(requests);
  } catch (error) {
    console.error('Failed to fetch org requests:', error);
    return res.status(500).json({ error: 'Failed to fetch customer requests.' });
  }
});

// POST /api/org/requests/:id/accept - Accept customer request & send notification email
router.post('/requests/:id/accept', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { pickupLocation, approvalNotes, orgName, orgContactEmail } = req.body;

    const request = await prisma.borrowRequest.findUnique({
      where: { id },
      include: {
        borrower: true,
        item: true,
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Customer request not found.' });
    }

    // Update request status to approved
    const updated = await prisma.borrowRequest.update({
      where: { id },
      data: {
        status: 'approved',
      },
      include: {
        borrower: true,
        item: true,
      },
    });

    // Record activity
    await prisma.activity.create({
      data: {
        type: 'request_approved',
        actorId: request.borrowerId,
        itemId: request.itemId,
        details: `Organization Team accepted loan for "${request.item.name}"`,
      },
    });

    // Send Acceptance Email to customer
    const emailResult = await sendOrgAcceptedRequestEmail({
      customerEmail: request.borrower.email,
      customerName: request.borrower.name,
      itemName: request.item.name,
      orgName: orgName || 'BorrowBuddy Organization Hub',
      orgContactEmail: orgContactEmail || 'borrowbuddy@superadmin.in',
      pickupLocation: pickupLocation || request.item.pickupLocation || request.item.campus,
      startDate: new Date(request.startDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      endDate: new Date(request.endDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      approvalNotes: approvalNotes || 'Your gear has been reserved and is ready for pickup.',
      securityDeposit: request.item.depositAmount,
    });

    return res.json({
      message: 'Request accepted successfully! Notification sent to customer.',
      request: updated,
      emailDelivery: emailResult,
    });
  } catch (error: any) {
    console.error('Error accepting customer request:', error);
    return res.status(500).json({ error: 'Failed to accept request.' });
  }
});

// POST /api/org/requests/:id/reject - Reject or request clarification
router.post('/requests/:id/reject', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, orgName } = req.body;

    const request = await prisma.borrowRequest.findUnique({
      where: { id },
      include: { borrower: true, item: true },
    });

    if (!request) {
      return res.status(404).json({ error: 'Customer request not found.' });
    }

    const updated = await prisma.borrowRequest.update({
      where: { id },
      data: { status: 'rejected' },
    });

    if (reason) {
      await sendOrgMessageToCustomerEmail({
        customerEmail: request.borrower.email,
        customerName: request.borrower.name,
        itemName: request.item.name,
        orgName: orgName || 'Organization Team',
        messageText: `Your request could not be approved at this time. Reason: ${reason}`,
      });
    }

    return res.json({
      message: 'Request rejected and customer notified.',
      request: updated,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to reject request.' });
  }
});

// POST /api/org/requests/:id/message - Send direct inquiry response to customer
router.post('/requests/:id/message', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { messageText, orgName } = req.body;

    if (!messageText) {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const request = await prisma.borrowRequest.findUnique({
      where: { id },
      include: { borrower: true, item: true },
    });

    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    const emailResult = await sendOrgMessageToCustomerEmail({
      customerEmail: request.borrower.email,
      customerName: request.borrower.name,
      itemName: request.item.name,
      orgName: orgName || 'Campus Organization Team',
      messageText,
    });

    return res.json({
      message: 'Message dispatched directly to customer email.',
      emailDelivery: emailResult,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to send message to customer.' });
  }
});

export default router;
