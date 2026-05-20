import express from "express";

import {
  healthCheck
} from "../controllers/systemController";

const router =
express.Router();

router.get(
  "/health",
  healthCheck
);

export default router;