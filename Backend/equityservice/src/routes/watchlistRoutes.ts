import { Router } from "express";

import * as watchlistController
from "../controllers/watchlistController";

import validateRequestMiddleware
from "../middleware/validateRequestMiddleware";

import {
  addWatchlistValidation,
  watchlistIdValidation
} from "../validations/watchlistValidation";

import {
  authMiddleware
} from "../middleware/authMiddleware";

const router = Router();


// GET WATCHLIST

router.get(
  "/",

  authMiddleware,

  watchlistController.getWatchlist
);


// ADD WATCHLIST STOCK

router.post(
  "/",

  authMiddleware,

  addWatchlistValidation,

  validateRequestMiddleware,

  watchlistController.addWatchlist
);


// DELETE WATCHLIST STOCK

router.delete(
  "/:id",

  authMiddleware,

  watchlistIdValidation,

  validateRequestMiddleware,

  watchlistController.deleteWatchlist
);

export default router;