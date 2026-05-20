import { supabase } from '../config/db';
import { EquityHoldingRow, EquityMarketPriceRow, EquityTransactionRow } from '../models/types';
import AppError from '../utils/appError';

type TradePayload = {
  stock_symbol: string;
  quantity: number;
  price: number;
  exchange?: string;
};

const ensureSupabase = (): void => {
  if (!supabase) {
    throw new AppError('Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.', 500);
  }
};

const getMarketPriceOrFallback = async (stockSymbol: string, fallbackPrice: number): Promise<number> => {
  const { data: market, error } = await supabase
    .from('equity_market_prices')
    .select('current_price')
    .eq('stock_symbol', stockSymbol.toUpperCase())
    .maybeSingle<Pick<EquityMarketPriceRow, 'current_price'>>();

  if (error) {
    throw new AppError(error.message, 500);
  }

  return market && market.current_price ? Number(market.current_price) : Number(fallbackPrice);
};

export const listTransactions = async (investorId: string): Promise<EquityTransactionRow[]> => {
  ensureSupabase();

  const { data: transactions, error } = await supabase
    .from('equity_transactions')
    .select('*')
    .eq('investor_id', investorId)
    .order('executed_at', { ascending: false })
    .order('id', { ascending: false });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return (transactions || []) as EquityTransactionRow[];
};

export const listAllTransactions = async (): Promise<EquityTransactionRow[]> => {
  ensureSupabase();

  const { data: transactions, error } = await supabase
    .from('equity_transactions')
    .select('*')
    .order('executed_at', { ascending: false })
    .order('id', { ascending: false });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return (transactions || []) as EquityTransactionRow[];
};

export const buyStock = async (investorId: string, payload: TradePayload) => {
  ensureSupabase();

  const symbol = payload.stock_symbol.toUpperCase();
  const exchange = (payload.exchange || 'NSE').toUpperCase();
  const quantity = Number(payload.quantity);
  const price = Number(payload.price);

  const { data: existingHolding, error: holdingFetchError } = await supabase
    .from('equity_holdings')
    .select('*')
    .eq('investor_id', investorId)
    .eq('stock_symbol', symbol)
    .eq('exchange', exchange)
    .maybeSingle<EquityHoldingRow>();

  if (holdingFetchError) {
    throw new AppError(holdingFetchError.message, 500);
  }

  const marketPrice = await getMarketPriceOrFallback(symbol, price);
  let holding = existingHolding;

  if (holding) {
    const oldQty = Number(holding.quantity);
    const oldAvg = Number(holding.avg_buy_price);
    const newQty = oldQty + quantity;
    const newAvg = ((oldQty * oldAvg) + (quantity * price)) / newQty;

    const { data: updatedHolding, error: updateError } = await supabase
      .from('equity_holdings')
      .update({
        quantity: newQty.toFixed(2),
        avg_buy_price: newAvg.toFixed(2),
        current_market_price: marketPrice.toFixed(2),
        updated_at: new Date().toISOString()
      })
      .eq('id', holding.id)
      .select('*')
      .single<EquityHoldingRow>();

    if (updateError) {
      throw new AppError(updateError.message, 500);
    }

    holding = updatedHolding;
  } else {
    const { data: createdHolding, error: createError } = await supabase
      .from('equity_holdings')
      .insert({
        investor_id: investorId,
        stock_symbol: symbol,
        quantity: quantity.toFixed(2),
        avg_buy_price: price.toFixed(2),
        current_market_price: marketPrice.toFixed(2),
        exchange,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single<EquityHoldingRow>();

    if (createError) {
      throw new AppError(createError.message, 500);
    }

    holding = createdHolding;
  }

  const { data: transactionRow, error: txError } = await supabase
    .from('equity_transactions')
    .insert({
      investor_id: investorId,
      stock_symbol: symbol,
      transaction_type: 'BUY',
      quantity: quantity.toFixed(2),
      price: price.toFixed(2),
      exchange,
      executed_at: new Date().toISOString()
    })
    .select('*')
    .single<EquityTransactionRow>();

  if (txError) {
    throw new AppError(txError.message, 500);
  }

  return {
    transaction: transactionRow,
    holding
  };
};

export const sellStock = async (investorId: string, payload: TradePayload) => {
  ensureSupabase();

  const symbol = payload.stock_symbol.toUpperCase();
  const exchange = (payload.exchange || 'NSE').toUpperCase();
  const sellQty = Number(payload.quantity);
  const sellPrice = Number(payload.price);

  const { data: holding, error: holdingError } = await supabase
    .from('equity_holdings')
    .select('*')
    .eq('investor_id', investorId)
    .eq('stock_symbol', symbol)
    .eq('exchange', exchange)
    .maybeSingle<EquityHoldingRow>();

  if (holdingError) {
    throw new AppError(holdingError.message, 500);
  }

  if (!holding) {
    throw new AppError('Holding not found for the requested stock', 404);
  }

  const currentQty = Number(holding.quantity);

  if (sellQty > currentQty) {
    throw new AppError('Insufficient quantity to sell', 400);
  }

  const avgBuyPrice = Number(holding.avg_buy_price);
  const realizedGain = (sellPrice - avgBuyPrice) * sellQty;
  const remainingQty = currentQty - sellQty;
  const marketPrice = await getMarketPriceOrFallback(symbol, sellPrice);

  if (remainingQty === 0) {
    const { error: deleteHoldingError } = await supabase.from('equity_holdings').delete().eq('id', holding.id);

    if (deleteHoldingError) {
      throw new AppError(deleteHoldingError.message, 500);
    }
  } else {
    const { error: updateHoldingError } = await supabase
      .from('equity_holdings')
      .update({
        quantity: remainingQty.toFixed(2),
        current_market_price: marketPrice.toFixed(2),
        updated_at: new Date().toISOString()
      })
      .eq('id', holding.id);

    if (updateHoldingError) {
      throw new AppError(updateHoldingError.message, 500);
    }
  }

  const { data: transactionRow, error: txError } = await supabase
    .from('equity_transactions')
    .insert({
      investor_id: investorId,
      stock_symbol: symbol,
      transaction_type: 'SELL',
      quantity: sellQty.toFixed(2),
      price: sellPrice.toFixed(2),
      exchange,
      realized_gain: realizedGain.toFixed(2),
      executed_at: new Date().toISOString()
    })
    .select('*')
    .single<EquityTransactionRow>();

  if (txError) {
    throw new AppError(txError.message, 500);
  }

  return {
    transaction: transactionRow,
    remaining_quantity: remainingQty.toFixed(2),
    realized_gain: realizedGain.toFixed(2)
  };
};