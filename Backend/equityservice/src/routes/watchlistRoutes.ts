import { Router } from 'express';
import * as watchlistController from '../controllers/watchlistController';
import authMiddleware from '../middleware/authMiddleware';
import validateRequestMiddleware from '../middleware/validateRequestMiddleware';
import { addWatchlistValidation, watchlistIdValidation } from '../validations/watchlistValidation';

const router = Router();

router.use(authMiddleware);

router.get('/', watchlistController.getWatchlist);
router.post('/', addWatchlistValidation, validateRequestMiddleware, watchlistController.addWatchlist);
router.delete('/:id', watchlistIdValidation, validateRequestMiddleware, watchlistController.deleteWatchlist);

export default router;