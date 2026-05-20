import { Router } from "express";

import * as holdingController
from "../controllers/holdingController";

import validateRequestMiddleware
from "../middleware/validateRequestMiddleware";

import {
  holdingIdValidation
} from "../validations/holdingValidation";

import {
  authMiddleware
} from "../middleware/authMiddleware";

const router = Router();


// GET ALL HOLDINGS

router.get(
  "/",

  authMiddleware,

  holdingController.getHoldings
);


// GET HOLDING BY INVESTOR ID

router.get(
  "/:investor_id",

  authMiddleware,

  holdingIdValidation,

  validateRequestMiddleware,

  holdingController.getHoldingById
);

export default router;