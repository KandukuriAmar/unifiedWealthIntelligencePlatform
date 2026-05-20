import { Request, Response, NextFunction } from 'express';
import * as transactionService from '../services/transactionService';
import { sendSuccess } from '../utils/apiResponse';

export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await transactionService.listTransactions(req.user.investor_id);
    sendSuccess(res, 'Transactions fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getAllAdminTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await transactionService.listAllTransactions();
    sendSuccess(res, 'All transactions fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const buyStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await transactionService.buyStock(req.user.investor_id, req.body);
    sendSuccess(res, 'Stock bought successfully', data, 201);
  } catch (error) {
    next(error);
  }
};

export const sellStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await transactionService.sellStock(req.user.investor_id, req.body);
    sendSuccess(res, 'Stock sold successfully', data, 201);
  } catch (error) {
    next(error);
  }
};