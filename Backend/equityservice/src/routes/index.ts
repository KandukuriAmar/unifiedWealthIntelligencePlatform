import { Router } from "express";

import holdingRoutes
from "./holdingRoutes";

import transactionRoutes
from "./transactionRoutes";

import watchlistRoutes
from "./watchlistRoutes";

import marketRoutes
from "./marketRoutes";

const router = Router();


// HOLDINGS ROUTES

router.use(
  "/holdings",
  holdingRoutes 
);


// TRANSACTIONS ROUTES

router.use(
  "/transactions",
  transactionRoutes
);


// WATCHLIST ROUTES

router.use(
  "/watchlist",
  watchlistRoutes
);


// MARKET ROUTES

router.use(
  "/market",
  marketRoutes
);


// HEALTH ROUTE

router.get(
  "/health",

  (req, res) => {

    res.status(200).json({

      success: true,

      service:
        "Equity Service UP"
    });
  }
);

export default router;