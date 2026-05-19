import { Request, Response, NextFunction } from 'express';
import * as watchlistService from '../services/watchlistService';
import { sendSuccess } from '../utils/apiResponse';

export const getWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await watchlistService.getWatchlist(req.user.investor_id);
    sendSuccess(res, 'Watchlist fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const addWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await watchlistService.addWatchlistStock(req.user.investor_id, req.body.stock_symbol);
    sendSuccess(res, 'Stock added to watchlist', data, 201);
  } catch (error) {
    next(error);
  }
};

export const deleteWatchlist = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await watchlistService.deleteWatchlistStock(req.user.investor_id, Number(req.params.id));
    sendSuccess(res, 'Stock removed from watchlist', data);
  } catch (error) {
    next(error);
  }
};