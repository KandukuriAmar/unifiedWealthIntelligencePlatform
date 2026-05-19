import { supabase } from '../config/db';
import { EquityUserRow } from '../models/types';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';
import AppError from '../utils/appError';
import { generateInvestorId } from '../utils/idUtils';
import { access } from 'fs';

type RegisterPayload = {
  full_name: string;
  email: string;
  pan_number: string;
  demat_account: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type LogoutPayload = {
  refresh_token: string;
};

const ensureSupabase = (): void => {
  if (!supabase) {
    throw new AppError('Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.', 500);
  }
};

const getUserPayload = (user: EquityUserRow) => ({
  investor_id: user.investor_id,
  full_name: user.full_name,
  email: user.email,
  pan_number: user.pan_number,
  demat_account: user.demat_account,
  created_at: user.created_at
});

export const registerInvestor = async (payload: RegisterPayload) => {
  ensureSupabase();

  const { data: existingUser, error: existingUserError } = await supabase
    .from('equity_users')
    .select('investor_id')
    .eq('email', payload.email)
    .maybeSingle();

  if (existingUserError) {
    throw new AppError(existingUserError.message, 500);
  }

  if (existingUser) {
    throw new AppError('Email already exists', 409);
  }

  const investorId = await generateInvestorId();

  const { data: newUser, error: createError } = await supabase
    .from('equity_users')
    .insert({
      investor_id: investorId,
      full_name: payload.full_name,
      email: payload.email,
      pan_number: payload.pan_number,
      demat_account: payload.demat_account,
      password_hash: payload.password
    })
    .select('*')
    .single<EquityUserRow>();

  if (createError) {
    throw new AppError(createError.message, 500);
  }

  const accessToken = generateAccessToken({
    investor_id: newUser.investor_id,
    email: newUser.email
  });

  return {
    token: accessToken,
    user: getUserPayload(newUser)
  };
};

export const loginInvestor = async ({ email, password }: LoginPayload) => {
  ensureSupabase();

  const { data: user, error: userError } = await supabase
    .from('equity_users')
    .select('*')
    .eq('email', email)
    .maybeSingle<EquityUserRow>();

  if (userError) {
    console.error('[LOGIN] equity_users fetch error:', JSON.stringify(userError));
    throw new AppError(userError.message, 500);
  }

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  if (user.password_hash !== password) {
    throw new AppError('Invalid credentials', 401);
  }

  const accessToken = generateAccessToken({
    investor_id: user.investor_id,
    email: user.email
  });

  const refreshToken = generateRefreshToken({
    investor_id: user.investor_id,
    email: user.email
  });

  const { error: tokenError } = await supabase.from('equity_refresh_tokens').insert({
    investor_id: user.investor_id,
    token: refreshToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  if (tokenError) {
    console.error('[LOGIN] equity_refresh_tokens insert error:', JSON.stringify(tokenError));
    throw new AppError(tokenError.message, 500);
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    investor: getUserPayload(user)
  };
};

export const logoutInvestor = async ({ refresh_token }: LogoutPayload) => {
  ensureSupabase();

  const { data: deletedRows, error: deleteError } = await supabase
    .from('equity_refresh_tokens')
    .delete()
    .eq('token', refresh_token)
    .select('id');

  if (deleteError) {
    throw new AppError(deleteError.message, 500);
  }

  if (!deletedRows || deletedRows.length === 0) {
    throw new AppError('Refresh token not found or already invalidated', 404);
  }

  return {
    invalidated: true
  };
};