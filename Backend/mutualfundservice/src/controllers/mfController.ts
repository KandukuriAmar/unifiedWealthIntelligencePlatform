import { Request, Response } from "express";

import {
  fetchCompletePortfolio,
  fetchAllFunds,
  fetchSips,
  fetchAllSips,
  fetchTransactions,
  fetchFailedSips,
  fetchCustomerByEmail
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

export const getAllPortfolioData =
async (
  req: Request,
  res: Response
) => {

  try {

    const funds =
      await fetchAllFunds();

    res.status(200).json({
      success: true,
      data: { funds }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "All portfolio fetch failed",
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

export const getAllSipsData =
async (
  req: Request,
  res: Response
) => {

  try {

    const sips =
      await fetchAllSips();

    res.status(200).json({
      success: true,
      sips
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch all SIPs",
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

export const getCustomerByEmail =
async (
  req: Request,
  res: Response
) => {

  try {

    const email =
      req.params.email as string;

    const customer =
      await fetchCustomerByEmail(email);

    res.status(200).json({
      success: true,
      data: customer
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Customer fetch failed",
      error
    });
  }
};