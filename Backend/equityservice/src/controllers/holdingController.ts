import { Request, Response, NextFunction } from 'express';
import * as holdingService from '../services/holdingService';
import { sendSuccess } from '../utils/apiResponse';

export const getHoldings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await holdingService.getHoldingsByInvestor(req.user.investor_id);
    sendSuccess(res, 'Holdings fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getHoldingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const investorId = String(req.params.id);
    const data = await holdingService.getHoldingsByInvestorId(investorId);
    sendSuccess(res, 'Holdings fetched successfully', data);
  } catch (error) {
    next(error);
  }
};