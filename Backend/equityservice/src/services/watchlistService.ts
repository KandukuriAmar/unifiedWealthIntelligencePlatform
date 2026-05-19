import { supabase } from '../config/db';
import { EquityWatchlistRow } from '../models/types';
import AppError from '../utils/appError';

const ensureSupabase = (): void => {
  if (!supabase) {
    throw new AppError('Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.', 500);
  }
};

export const getWatchlist = async (investorId: string): Promise<EquityWatchlistRow[]> => {
  ensureSupabase();

  const { data, error } = await supabase
    .from('equity_watchlist')
    .select('*')
    .eq('investor_id', investorId)
    .order('added_at', { ascending: false });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return (data || []) as EquityWatchlistRow[];
};

export const addWatchlistStock = async (investorId: string, stockSymbol: string): Promise<EquityWatchlistRow> => {
  ensureSupabase();

  const symbol = stockSymbol.toUpperCase();

  const { data: exists, error: existsError } = await supabase
    .from('equity_watchlist')
    .select('id')
    .eq('investor_id', investorId)
    .eq('stock_symbol', symbol)
    .maybeSingle();

  if (existsError) {
    throw new AppError(existsError.message, 500);
  }

  if (exists) {
    throw new AppError('Stock already exists in watchlist', 409);
  }

  const { data: watchlistItem, error: insertError } = await supabase
    .from('equity_watchlist')
    .insert({
      investor_id: investorId,
      stock_symbol: symbol,
      added_at: new Date().toISOString()
    })
    .select('*')
    .single<EquityWatchlistRow>();

  if (insertError) {
    throw new AppError(insertError.message, 500);
  }

  return watchlistItem;
};

export const deleteWatchlistStock = async (investorId: string, id: number): Promise<{ deleted: boolean }> => {
  ensureSupabase();

  const { data: watchlistItem, error: findError } = await supabase
    .from('equity_watchlist')
    .select('*')
    .eq('id', id)
    .eq('investor_id', investorId)
    .maybeSingle<EquityWatchlistRow>();

  if (findError) {
    throw new AppError(findError.message, 500);
  }

  if (!watchlistItem) {
    throw new AppError('Watchlist item not found', 404);
  }

  const { error: deleteError } = await supabase.from('equity_watchlist').delete().eq('id', id).eq('investor_id', investorId);

  if (deleteError) {
    throw new AppError(deleteError.message, 500);
  }

  return {
    deleted: true
  };
};