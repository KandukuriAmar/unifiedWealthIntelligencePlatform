import { supabase } from "../config/db";

import { EquityHoldingRow }
from "../models/types";

import AppError
from "../utils/appError";

  
const ensureSupabase = (): void => {

  if (!supabase) {

    throw new AppError(

      "Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.",

      500
    );
  }
};


// GET ALL HOLDINGS BY INVESTOR

export const getHoldingsByInvestor =
async (
  investorId: string
): Promise<EquityHoldingRow[]> => {

  ensureSupabase();

  const {
    data: holdings,
    error
  } = await supabase!

    .from("equity_holdings")

    .select("*")

    .eq(
      "investor_id",
      investorId
    )

    .order(
      "id",
      {
        ascending: true
      }
    );

  if (error) {

    throw new AppError(
      error.message,
      500
    );
  }

  return (
    holdings || []
  ) as EquityHoldingRow[];
};


// GET HOLDING BY INVESTOR ID

export const getHoldingsByInvestorId =
async (
  investorId: string
): Promise<EquityHoldingRow[]> => {

  ensureSupabase();

  const {
    data: holdings,
    error
  } = await supabase!

    .from("equity_holdings")

    .select("*")

    .eq(
      "investor_id",
      investorId
    )

    .order(
      "id",
      {
        ascending: true
      }
    );

  if (error) {

    throw new AppError(
      error.message,
      500
    );
  }

  if (
    !holdings ||
    holdings.length === 0
  ) {

    throw new AppError(
      "Holding not found",
      404
    );
  }

  return holdings as EquityHoldingRow[];
};


// GET TOTAL PORTFOLIO VALUE

export const getPortfolioSummary =
async (
  investorId: string
) => {

  ensureSupabase();

  const {
    data: holdings,
    error
  } = await supabase!

    .from("equity_holdings")

    .select("*")

    .eq(
      "investor_id",
      investorId
    );

  if (error) {

    throw new AppError(
      error.message,
      500
    );
  }

  const totalInvestment =
    holdings?.reduce(

      (sum, item) =>

        sum +
        Number(
          item.invested_amount
        ),

      0
    ) || 0;

  const currentValue =
    holdings?.reduce(

      (sum, item) =>

        sum +
        Number(
          item.current_value
        ),

      0
    ) || 0;

  const totalProfit =
    currentValue -
    totalInvestment;

  return {

    holdings,

    totalInvestment,

    currentValue,

    totalProfit
  };
};