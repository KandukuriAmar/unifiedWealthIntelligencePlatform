import { supabase } from '../config/db';
import { EquityHoldingRow } from '../models/types';
import AppError from '../utils/appError';

const ensureSupabase = (): void => {
  if (!supabase) {
    throw new AppError('Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.', 500);
  }
};

export const getHoldingsByInvestor = async (investorId: string): Promise<EquityHoldingRow[]> => {
  ensureSupabase();

  const { data: holdings, error } = await supabase
    .from('equity_holdings')
    .select('*')
    .eq('investor_id', investorId)
    .order('id', { ascending: true });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return (holdings || []) as EquityHoldingRow[];
};

export const getAllHoldings = async (): Promise<EquityHoldingRow[]> => {
  ensureSupabase();

  const { data: holdings, error } = await supabase
    .from('equity_holdings')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    throw new AppError(error.message, 500);
  }

  return (holdings || []) as EquityHoldingRow[];
};

export const getHoldingsByInvestorId = async (investorId: string): Promise<EquityHoldingRow[]> => {
  ensureSupabase();

  const { data: holdings, error } = await supabase
    .from('equity_holdings')
    .select('*')
    .eq('investor_id', investorId)
    .order('id', { ascending: true });

  if (error) {
    throw new AppError(error.message, 500);
  }

  if (!holdings || holdings.length === 0) {
    throw new AppError('Holding not found', 404);
  }

  return holdings as EquityHoldingRow[];
};