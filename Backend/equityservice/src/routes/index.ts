import { Router } from 'express';
import authRoutes from './authRoutes';
import holdingRoutes from './holdingRoutes';
import transactionRoutes from './transactionRoutes';
import watchlistRoutes from './watchlistRoutes';
import marketRoutes from './marketRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/holdings', holdingRoutes);
router.use('/transactions', transactionRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/market', marketRoutes);

export default router;