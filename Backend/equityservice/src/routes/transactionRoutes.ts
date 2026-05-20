import { Router } from 'express';
import * as transactionController from '../controllers/transactionController';
import authMiddleware from '../middleware/authMiddleware';
import validateRequestMiddleware from '../middleware/validateRequestMiddleware';
import { transactionValidation } from '../validations/transactionValidation';

const router = Router();

router.use(authMiddleware);

router.get('/', transactionController.getTransactions);
router.get('/admin', transactionController.getAllAdminTransactions);
router.post('/buy', transactionValidation, validateRequestMiddleware, transactionController.buyStock);
router.post('/sell', transactionValidation, validateRequestMiddleware, transactionController.sellStock);

export default router;