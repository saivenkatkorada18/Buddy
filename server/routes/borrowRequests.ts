import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { sendDueDateReminderEmail, sendBorrowConfirmationEmail } from '../lib/email';

const router = Router();


const createRequestSchema = z.object({
  itemId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  message: z.string().default(''),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'approved', 'active', 'returned', 'rejected', 'overdue']),
});

// GET /api/borrow-requests (protected)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const requests = await prisma.borrowRequest.findMany({
      where: {
        OR: [{ borrowerId: req.user.id }, { lenderId: req.user.id }],
      },
      include: {
        item: true,
        borrower: {
          select: { id: true, name: true, initials: true, avatarColor: true, trustScore: true },
        },
        lender: {
          select: { id: true, name: true, initials: true, avatarColor: true, trustScore: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = requests.map((r) => ({
      id: r.id,
      itemId: r.itemId,
      itemName: r.item.name,
      lenderId: r.lenderId,
      borrowerId: r.borrowerId,
      borrowerName: r.borrower.name,
      borrowerTrustScore: r.borrower.trustScore,
      requestDate: r.requestDate,
      startDate: r.startDate,
      endDate: r.endDate,
      message: r.message,
      status: r.status,
      item: r.item,
      borrower: r.borrower,
      lender: r.lender,
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Fetch borrow requests error:', error);
    return res.status(500).json({ error: 'Failed to fetch borrow requests.' });
  }
});

// POST /api/borrow-requests (protected)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const parsed = createRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { itemId, startDate, endDate, message } = parsed.data;

    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    if (item.lenderId === req.user.id) {
      return res.status(400).json({ error: 'You cannot borrow your own listed item.' });
    }

    const newRequest = await prisma.borrowRequest.create({
      data: {
        itemId,
        borrowerId: req.user.id,
        lenderId: item.lenderId,
        requestDate: new Date().toISOString().split('T')[0],
        startDate,
        endDate,
        message,
        status: 'approved', // Auto-approved in friendly student community demo
      },
      include: {
        item: true,
        borrower: true,
        lender: true,
      },
    });

    // Update item status and count
    await prisma.item.update({
      where: { id: itemId },
      data: {
        available: false,
        borrowCount: { increment: 1 },
      },
    });

    // Log Activity
    await prisma.activity.create({
      data: {
        userId: req.user.id,
        type: 'borrow',
        title: 'Borrow Request Confirmed',
        description: `You borrowed "${item.name}" from ${newRequest.lender.name}`,
        timestamp: new Date().toISOString(),
      },
    });

    // Send confirmation email asynchronously via Resend
    if (newRequest.borrower?.email) {
      sendBorrowConfirmationEmail(
        newRequest.borrower.email,
        newRequest.borrower.name,
        item.name,
        newRequest.lender.name,
        startDate,
        endDate,
        item.campus
      ).catch((err) => console.error('Borrow confirmation email failed:', err));
    }

    return res.status(201).json(newRequest);
  } catch (error) {
    console.error('Create borrow request error:', error);
    return res.status(500).json({ error: 'Failed to create borrow request.' });
  }
});

// POST /api/borrow-requests/:id/send-reminder (protected)
// Real automatic/manual due date reminder email trigger
router.post('/:id/send-reminder', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const request = await prisma.borrowRequest.findUnique({
      where: { id },
      include: {
        item: true,
        borrower: true,
        lender: true,
      },
    });

    if (!request) {
      return res.status(404).json({ error: 'Borrow loan record not found.' });
    }

    const recipientEmail = request.borrower.email;
    const borrowerName = request.borrower.name;
    const itemName = request.item.name;
    const campus = request.item.campus;
    const dueDate = request.endDate;

    const result = await sendDueDateReminderEmail(
      recipientEmail,
      borrowerName,
      itemName,
      campus,
      dueDate
    );

    return res.json({
      success: true,
      message: `Due date reminder email sent to ${recipientEmail}!`,
      delivery: result,
    });
  } catch (error: any) {
    console.error('Send reminder error:', error);
    return res.status(500).json({ error: 'Failed to dispatch due date reminder email.' });
  }
});

// PATCH /api/borrow-requests/:id/status (protected)
router.patch('/:id/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }


    const { status } = parsed.data;

    const request = await prisma.borrowRequest.findUnique({
      where: { id },
      include: { item: true },
    });

    if (!request) {
      return res.status(404).json({ error: 'Borrow request not found.' });
    }

    // Check ownership
    if (request.borrowerId !== req.user.id && request.lenderId !== req.user.id) {
      return res.status(403).json({ error: 'Permission denied.' });
    }

    const updated = await prisma.borrowRequest.update({
      where: { id },
      data: { status },
      include: { item: true, borrower: true, lender: true },
    });

    // If marked returned, make item available again
    if (status === 'returned') {
      await prisma.item.update({
        where: { id: request.itemId },
        data: { available: true },
      });

      // Increment borrower on-time record
      await prisma.user.update({
        where: { id: request.borrowerId },
        data: {
          onTimeReturnsCount: { increment: 1 },
          totalReturnsCount: { increment: 1 },
        },
      });

      // Log Activity
      await prisma.activity.create({
        data: {
          userId: req.user.id,
          type: 'system',
          title: 'Item Returned',
          description: `"${request.item.name}" was marked as returned. Trust score refreshed!`,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return res.json(updated);
  } catch (error) {
    console.error('Update request status error:', error);
    return res.status(500).json({ error: 'Failed to update borrow request status.' });
  }
});

export default router;
