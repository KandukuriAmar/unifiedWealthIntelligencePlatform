import express from "express";

import {
  getPortfolio,
  getAllPortfolioData,
  getSips,
  getTransactions,
  getFailedSipData,
  getAllSipsData,
  getCustomerByEmail
} from "../controllers/mfController";

import {
  verifyApiKey
} from "../middleware/apiKeyMiddleware";

const router = express.Router();

router.get(
  "/portfolio/:customerRef",
  verifyApiKey,
  getPortfolio
);

router.get(
  "/admin-portfolio",
  verifyApiKey,
  getAllPortfolioData
);

router.get(
  "/sips/:customerRef",
  verifyApiKey,
  getSips
);

router.get(
  "/admin-sips",
  verifyApiKey,
  getAllSipsData
);

router.get(
  "/transactions/:customerRef",
  verifyApiKey,
  getTransactions
);

router.get(
  "/failed-sips",
  verifyApiKey,
  getFailedSipData
);

router.get(
  "/customer/by-email/:email",
  verifyApiKey,
  getCustomerByEmail
);

export default router;