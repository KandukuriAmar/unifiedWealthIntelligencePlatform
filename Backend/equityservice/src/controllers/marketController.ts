import { Request, Response, NextFunction } from 'express';
import * as marketService from '../services/marketService';
import { sendSuccess } from '../utils/apiResponse';

export const getMarketPrices = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await marketService.getAllMarketPrices();
    sendSuccess(res, 'Market prices fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getMarketPriceBySymbol = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await marketService.getMarketPriceBySymbol(String(req.params.symbol));
    sendSuccess(res, 'Market price fetched successfully', data);
  } catch (error) {
    next(error);
  }
};