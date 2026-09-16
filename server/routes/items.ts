import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const createItemSchema = z.object({
  name: z.string().min(3, 'Item title must be at least 3 characters'),
  category: z.string(),
  condition: z.enum(['New', 'Like new', 'Good', 'Fair']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  rules: z.array(z.string()).default([]),
  campus: z.string(),
  maxDurationDays: z.number().int().min(1).default(7),
  suggestedDurationDays: z.number().int().min(1).default(3),
  depositEuros: z.number().int().min(0).default(0),
  pickupMethod: z.string().min(2, 'Pickup location is required'),
  imageSeed: z.string().optional(),
});

// Helper to format Item output (parsing JSON rules string back to string array)
function formatItem(item: any) {
  let parsedRules: string[] = [];
  try {
    parsedRules = typeof item.rules === 'string' ? JSON.parse(item.rules) : item.rules;
  } catch (e) {
    parsedRules = [item.rules];
  }

  return {
    ...item,
    rules: parsedRules,
  };
}

// GET /api/items
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, campus, search, availableOnly, sort } = req.query;

    const where: any = {};

    if (category && category !== 'all') {
      where.category = String(category);
    }

    if (campus && campus !== 'all') {
      where.campus = String(campus);
    }

    if (availableOnly === 'true') {
      where.available = true;
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { category: { contains: q } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'rating' || sort === 'highest-rated') {
      orderBy = { rating: 'desc' };
    } else if (sort === 'popularity' || sort === 'popular') {
      orderBy = { borrowCount: 'desc' };
    } else if (sort === 'nearest') {
      orderBy = { distanceKm: 'asc' };
    }

    const items = await prisma.item.findMany({
      where,
      orderBy,
      include: {
        lender: {
          select: {
            id: true,
            name: true,
            initials: true,
            avatarColor: true,
            course: true,
            verifiedEmail: true,
            profileVerified: true,
            trustScore: true,
            onTimeReturnsCount: true,
            totalReturnsCount: true,
            avgConditionRating: true,
            memberSince: true,
          },
        },
      },
    });

    const formatted = items.map((item) => {
      const base = formatItem(item);
      if (base.lender) {
        base.lender = {
          ...base.lender,
          onTimeReturns: [base.lender.onTimeReturnsCount, base.lender.totalReturnsCount],
        };
      }
      return base;
    });

    return res.json(formatted);
  } catch (error) {
    console.error('List items error:', error);
    return res.status(500).json({ error: 'Failed to fetch items.' });
  }
});

// GET /api/items/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        lender: {
          select: {
            id: true,
            name: true,
            initials: true,
            avatarColor: true,
            course: true,
            verifiedEmail: true,
            profileVerified: true,
            trustScore: true,
            onTimeReturnsCount: true,
            totalReturnsCount: true,
            avgConditionRating: true,
            memberSince: true,
          },
        },
      },
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const formatted = formatItem(item);
    if (formatted.lender) {
      formatted.lender = {
        ...formatted.lender,
        onTimeReturns: [formatted.lender.onTimeReturnsCount, formatted.lender.totalReturnsCount],
      };
    }

    return res.json(formatted);
  } catch (error) {
    console.error('Get item error:', error);
    return res.status(500).json({ error: 'Failed to retrieve item.' });
  }
});

// POST /api/items (protected)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const parsed = createItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const data = parsed.data;
    const imageSeed = data.imageSeed || `${data.category}-${Date.now().toString(36)}`;

    const newItem = await prisma.item.create({
      data: {
        name: data.name,
        category: data.category,
        condition: data.condition,
        description: data.description,
        rules: JSON.stringify(data.rules),
        campus: data.campus,
        maxDurationDays: data.maxDurationDays,
        suggestedDurationDays: data.suggestedDurationDays,
        depositEuros: data.depositEuros,
        pickupMethod: data.pickupMethod,
        imageSeed,
        lenderId: req.user.id,
        available: true,
        rating: 5.0,
        borrowCount: 0,
        distanceKm: 0.3,
      },
      include: {
        lender: true,
      },
    });

    // Record activity
    await prisma.activity.create({
      data: {
        userId: req.user.id,
        type: 'lend',
        title: 'New Item Listed',
        description: `You listed "${data.name}" in ${data.category}`,
        timestamp: new Date().toISOString(),
      },
    });

    return res.status(201).json(formatItem(newItem));
  } catch (error) {
    console.error('Create item error:', error);
    return res.status(500).json({ error: 'Failed to create item listing.' });
  }
});

// DELETE /api/items/:id (protected)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    if (item.lenderId !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission to delete this listing.' });
    }

    await prisma.item.delete({ where: { id } });
    return res.json({ success: true, message: 'Item listing deleted.' });
  } catch (error) {
    console.error('Delete item error:', error);
    return res.status(500).json({ error: 'Failed to delete item.' });
  }
});

export default router;
