import express from "express";

import {
  portfolioSummary,
  dashboard,
  allTransactions
} from "../controllers/wealthController";

import {
  verifyToken
} from "../middleware/authMiddleware";

import {
  allowRoles
} from "../middleware/roleMiddleware";
const router = express.Router();

router.get(
  "/portfolio/summary",
  verifyToken,
  portfolioSummary
);

router.get(
  "/dashboard",
  verifyToken,
  dashboard
);

router.get(
  "/all-transactions",
  verifyToken,
  allTransactions
);

router.get(
  "/dashboard",

  verifyToken,

  allowRoles(
    "ADMIN",
    "INVESTOR"
  ),

  dashboard
);

export default router;