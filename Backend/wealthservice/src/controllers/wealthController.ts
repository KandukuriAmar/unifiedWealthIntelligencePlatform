import {
  Request,
  Response
} from "express";

import {
  getPortfolioSummary,
  getDashboardData,
  getAllTransactions
} from "../services/wealthService";

export const portfolioSummary =
async (
  req: Request,
  res: Response
) => {

  try {
    const user = (req as any).user;
    const authHeader = req.headers.authorization;

    const data =
      await getPortfolioSummary(user?.email, authHeader);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Portfolio Error"
    });
  }
};

export const dashboard =
async (
  req: Request,
  res: Response
) => {

  try {

    const data =
      await getDashboardData();

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Dashboard Error"
    });
  }
};

export const allTransactions =
async (
  req: Request,
  res: Response
) => {

  try {
    const user = (req as any).user;
    const authHeader = req.headers.authorization;

    const data =
      await getAllTransactions(user?.email, authHeader);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Transaction Error"
    });
  }
};