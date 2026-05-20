import { supabase } from "../config/db";

import {
  EquityHoldingRow,
  EquityMarketPriceRow,
  EquityTransactionRow
} from "../models/types";

import AppError
from "../utils/appError";


type TradePayload = {

  stock_symbol: string;

  quantity: number;

  price: number;

  exchange?: string;
};


const ensureSupabase = (): void => {

  if (!supabase) {

    throw new AppError(

      "Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.",

      500
    );
  }
};


// GET MARKET PRICE

const getMarketPriceOrFallback =
async (

  stockSymbol: string,

  fallbackPrice: number

): Promise<number> => {

  ensureSupabase();

  const {
    data: market,
    error
  } = await supabase!

    .from(
      "equity_market_prices"
    )

    .select(
      "current_price"
    )

    .eq(
      "stock_symbol",
      stockSymbol.toUpperCase()
    )

    .maybeSingle<
      Pick<
        EquityMarketPriceRow,
        "current_price"
      >
    >();

  if (error) {

    throw new AppError(
      error.message,
      500
    );
  }

  return market?.current_price

    ? Number(
        market.current_price
      )

    : Number(
        fallbackPrice
      );
};


// LIST TRANSACTIONS

export const listTransactions =
async (

  investorId: string

): Promise<
  EquityTransactionRow[]
> => {

  ensureSupabase();

  const {
    data: transactions,
    error
  } = await supabase!

    .from(
      "equity_transactions"
    )

    .select("*")

    .eq(
      "investor_id",
      investorId
    )

    .order(
      "executed_at",
      {
        ascending: false
      }
    );

  if (error) {

    throw new AppError(
      error.message,
      500
    );
  }

  return (
    transactions || []
  ) as EquityTransactionRow[];
};


// BUY STOCK

export const buyStock =
async (

  investorId: string,

  payload: TradePayload

) => {

  ensureSupabase();

  const symbol =
    payload.stock_symbol
    .toUpperCase();

  const exchange =
    (
      payload.exchange ||
      "NSE"
    ).toUpperCase();

  const quantity =
    Number(payload.quantity);

  const price =
    Number(payload.price);


  const {
    data: existingHolding,
    error: holdingFetchError
  } = await supabase!

    .from(
      "equity_holdings"
    )

    .select("*")

    .eq(
      "investor_id",
      investorId
    )

    .eq(
      "stock_symbol",
      symbol
    )

    .eq(
      "exchange",
      exchange
    )

    .maybeSingle<
      EquityHoldingRow
    >();

  if (holdingFetchError) {

    throw new AppError(

      holdingFetchError.message,

      500
    );
  }

  const marketPrice =
    await getMarketPriceOrFallback(
      symbol,
      price
    );

  let holding =
    existingHolding;

  // UPDATE HOLDING

  if (holding) {

    const oldQty =
      Number(
        holding.quantity
      );

    const oldAvg =
      Number(
        holding.avg_buy_price
      );

    const newQty =
      oldQty + quantity;

    const newAvg =

      (
        (
          oldQty *
          oldAvg
        )

        +

        (
          quantity *
          price
        )

      ) / newQty;

    const {
      data: updatedHolding,
      error: updateError
    } = await supabase!

      .from(
        "equity_holdings"
      )

      .update({

        quantity:
          newQty.toFixed(2),

        avg_buy_price:
          newAvg.toFixed(2),

        current_market_price:
          marketPrice.toFixed(2),

        updated_at:
          new Date().toISOString()
      })

      .eq(
        "id",
        holding.id
      )

      .select("*")

      .single<
        EquityHoldingRow
      >();

    if (updateError) {

      throw new AppError(
        updateError.message,
        500
      );
    }

    holding =
      updatedHolding;

  } else {

    // CREATE HOLDING

    const {
      data: createdHolding,
      error: createError
    } = await supabase!

      .from(
        "equity_holdings"
      )

      .insert({

        investor_id:
          investorId,

        stock_symbol:
          symbol,

        quantity:
          quantity.toFixed(2),

        avg_buy_price:
          price.toFixed(2),

        current_market_price:
          marketPrice.toFixed(2),

        exchange,

        updated_at:
          new Date().toISOString()
      })

      .select("*")

      .single<
        EquityHoldingRow
      >();

    if (createError) {

      throw new AppError(
        createError.message,
        500
      );
    }

    holding =
      createdHolding;
  }


  // INSERT TRANSACTION

  const {
    data: transactionRow,
    error: txError
  } = await supabase!

    .from(
      "equity_transactions"
    )

    .insert({

      investor_id:
        investorId,

      stock_symbol:
        symbol,

      transaction_type:
        "BUY",

      quantity:
        quantity.toFixed(2),

      price:
        price.toFixed(2),

      exchange,

      executed_at:
        new Date().toISOString()
    })

    .select("*")

    .single<
      EquityTransactionRow
    >();

  if (txError) {

    throw new AppError(
      txError.message,
      500
    );
  }

  return {

    success: true,

    message:
      "Stock purchased successfully",

    transaction:
      transactionRow,

    holding
  };
};