import { Router } from 'express';
import * as holdingController from '../controllers/holdingController';
import authMiddleware from '../middleware/authMiddleware';
import validateRequestMiddleware from '../middleware/validateRequestMiddleware';
import { holdingIdValidation } from '../validations/holdingValidation';

const router = Router();

router.use(authMiddleware);

router.get('/', holdingController.getHoldings);
router.get('/:id', holdingIdValidation, validateRequestMiddleware, holdingController.getHoldingById);

export default router;