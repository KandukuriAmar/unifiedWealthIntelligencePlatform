import express from "express";

import {
  getPortfolio,
  getSips,
  getTransactions,
  getFailedSipData
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
  "/sips/:customerRef",
  verifyApiKey,
  getSips
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

export default router;