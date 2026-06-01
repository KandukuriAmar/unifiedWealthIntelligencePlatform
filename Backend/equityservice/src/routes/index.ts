<<<<<<< HEAD
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
=======
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
>>>>>>> e71cf39bbdf103cb602b3d8bd49a8f81ba74ac3f

export default router;