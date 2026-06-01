import { Router } from "express";

import * as marketController
from "../controllers/marketController";

import validateRequestMiddleware
from "../middleware/validateRequestMiddleware";

import {
  symbolValidation
} from "../validations/marketValidation";

import {
  authMiddleware
} from "../middleware/authMiddleware";

const router = Router();


// GET ALL MARKET PRICES

router.get(
  "/prices",

  authMiddleware,

  marketController.getMarketPrices
);


// GET MARKET PRICE BY SYMBOL

router.get(
  "/prices/:symbol",

  authMiddleware,

  symbolValidation,

  validateRequestMiddleware,

  marketController.getMarketPriceBySymbol
);

export default router;