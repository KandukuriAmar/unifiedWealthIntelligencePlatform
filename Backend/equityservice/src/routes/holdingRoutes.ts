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


<<<<<<< HEAD
router.get('/', holdingController.getHoldings);
router.get('/admin', holdingController.getAllAdminHoldings);
router.get('/:id', holdingIdValidation, validateRequestMiddleware, holdingController.getHoldingById);
=======
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
>>>>>>> e71cf39bbdf103cb602b3d8bd49a8f81ba74ac3f

export default router;