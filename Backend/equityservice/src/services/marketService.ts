import { supabase } from '../config/db';
import { EquityMarketPriceRow } from '../models/types';
import AppError from '../utils/appError';

const ensureSupabase = (): void => {
  if (!supabase) {
    throw new AppError('Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.', 500);
  }
};

export const getAllMarketPrices = async (): Promise<EquityMarketPriceRow[]> => {
  ensureSupabase();

  const { data, error } = await supabase
    .from('equity_market_prices')
    .select('*')
    .order('stock_symbol', { ascending: true });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return (data || []) as EquityMarketPriceRow[];
};

export const getMarketPriceBySymbol = async (symbol: string): Promise<EquityMarketPriceRow> => {
  ensureSupabase();

  const { data: marketPrice, error } = await supabase
    .from('equity_market_prices')
    .select('*')
    .eq('stock_symbol', symbol.toUpperCase())
    .maybeSingle<EquityMarketPriceRow>();

  if (error) {
    throw new AppError(error.message, 500);
  }

  if (!marketPrice) {
    throw new AppError('Market price not found for symbol', 404);
  }

  return marketPrice;
};