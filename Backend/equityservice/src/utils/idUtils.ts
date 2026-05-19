import { randomBytes } from 'crypto';
import { supabase } from '../config/db';
import AppError from './appError';

export const generateInvestorId = async (): Promise<string> => {
  if (!supabase) {
    throw new AppError('Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.', 500);
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = `INV${randomBytes(8).toString('hex').toUpperCase()}`;
    const { data, error } = await supabase
      .from('equity_users')
      .select('investor_id')
      .eq('investor_id', candidate)
      .maybeSingle();

    if (error) {
      throw new AppError(error.message, 500);
    }

    if (!data) {
      return candidate;
    }
  }

  throw new AppError('Unable to generate a unique investor ID', 500);
};