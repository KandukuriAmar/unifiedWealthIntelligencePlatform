import { Router } from 'express';
import * as marketController from '../controllers/marketController';
import validateRequestMiddleware from '../middleware/validateRequestMiddleware';
import { symbolValidation } from '../validations/marketValidation';

const router = Router();

router.get('/prices', marketController.getMarketPrices);
router.get('/prices/:symbol', symbolValidation, validateRequestMiddleware, marketController.getMarketPriceBySymbol);

export default router;