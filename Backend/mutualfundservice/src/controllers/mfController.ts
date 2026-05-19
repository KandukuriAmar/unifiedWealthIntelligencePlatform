import { Request, Response } from "express";

import {
  fetchCompletePortfolio,
  fetchSips,
  fetchTransactions,
  fetchFailedSips
} from "../services/mfService";

export const getPortfolio =
async (
  req: Request,
  res: Response
) => {

  try {

    const customerRef =
      req.params.customerRef as string;

    const portfolio =
      await fetchCompletePortfolio(customerRef);

    res.status(200).json({
      success: true,
      data: portfolio
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Portfolio fetch failed",
      error
    });
  }
};

export const getSips =
async (
  req: Request,
  res: Response
) => {

  try {

    const customerRef =
      req.params.customerRef as string;

    const sips =
      await fetchSips(customerRef);

    res.status(200).json({
      success: true,
      sips
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch SIPs",
      error
    });
  }
};

export const getTransactions =
async (
  req: Request,
  res: Response
) => {

  try {

    const customerRef =
      req.params.customerRef as string;

    const transactions =
      await fetchTransactions(customerRef);

    res.status(200).json({
      success: true,
      transactions
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch transactions",
      error
    });
  }
};

export const getFailedSipData =
async (
  req: Request,
  res: Response
) => {

  try {

    const failedSips =
      await fetchFailedSips();

    res.status(200).json({
      success: true,
      failedSips
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch failed SIPs",
      error
    });
  }
};