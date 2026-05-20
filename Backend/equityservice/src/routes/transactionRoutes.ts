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

export default router;