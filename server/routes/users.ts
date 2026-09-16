import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// GET /api/users/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const { passwordHash: _, ...safeUser } = user;
    const formatted = {
      ...safeUser,
      onTimeReturns: [safeUser.onTimeReturnsCount, safeUser.totalReturnsCount],
      completedBorrows: safeUser.totalReturnsCount,
      completedLends: safeUser.items.length * 2, // Approximate metric
    };

    return res.json(formatted);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ error: 'Failed to retrieve user profile.' });
  }
});

export default router;
