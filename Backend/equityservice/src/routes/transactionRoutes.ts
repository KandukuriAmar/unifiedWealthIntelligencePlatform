import { Router } from "express";

import * as transactionController
from "../controllers/transactionController";

import validateRequestMiddleware
from "../middleware/validateRequestMiddleware";

import {
  transactionValidation
} from "../validations/transactionValidation";

import {
  authMiddleware
} from "../middleware/authMiddleware";

const router = Router();


<<<<<<< HEAD
router.get('/', transactionController.getTransactions);
router.get('/admin', transactionController.getAllAdminTransactions);
router.post('/buy', transactionValidation, validateRequestMiddleware, transactionController.buyStock);
router.post('/sell', transactionValidation, validateRequestMiddleware, transactionController.sellStock);
=======
// GET ALL TRANSACTIONS

router.get(
  "/",

  authMiddleware,

  transactionController.getTransactions
);


// BUY STOCK

router.post(
  "/buy",

  authMiddleware,

  transactionValidation,

  validateRequestMiddleware,

  transactionController.buyStock
);


// SELL STOCK

router.post(
  "/sell",

  authMiddleware,

  transactionValidation,

  validateRequestMiddleware,

  transactionController.sellStock
);
>>>>>>> e71cf39bbdf103cb602b3d8bd49a8f81ba74ac3f

export default router;