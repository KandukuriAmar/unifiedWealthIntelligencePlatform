import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { supabase } from '../config/db';
import { EquityUserRow, EquityRefreshTokenRow } from '../models/types';
import AppError from '../utils/appError';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils';

const ensureSupabase = (): void => {
  if (!supabase) {
    throw new AppError('Supabase client is not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY.', 500);
  }
};

export const hashPassword = (password: string): string => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

export const registerUser = async (userData: {
  full_name: string;
  email: string;
  pan_number: string;
  demat_account: string;
  password: string;
}, prefix: string = 'INV') => {
  ensureSupabase();

  const { full_name, email, pan_number, demat_account, password } = userData;
  const normalizedEmail = email.toLowerCase();
  const hashedPassword = hashPassword(password);

  // Check if user already exists
  const { data: existingUser, error: checkError } = await supabase!
    .from('equity_users')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle<EquityUserRow>();

  if (checkError) {
    throw new AppError(checkError.message, 500);
  }

  let finalUser: EquityUserRow;

  if (existingUser) {
    // If the user already exists and is not pending, reject
    if (existingUser.password_hash !== 'pending') {
      throw new AppError('Email is already registered', 400);
    }

    // If it's a seeded user with 'pending' status, we "activate" them by updating details
    const { data: updatedUser, error: updateError } = await supabase!
      .from('equity_users')
      .update({
        full_name,
        pan_number: pan_number.toUpperCase(),
        demat_account,
        password_hash: hashedPassword,
        created_at: new Date().toISOString()
      })
      .eq('email', normalizedEmail)
      .select('*')
      .single<EquityUserRow>();

    if (updateError) {
      throw new AppError(updateError.message, 500);
    }
    finalUser = updatedUser;
  } else {
    // Determine the next investor_id
    const { data: users, error: fetchUsersError } = await supabase!
      .from('equity_users')
      .select('investor_id');

    if (fetchUsersError) {
      throw new AppError(fetchUsersError.message, 500);
    }

    let nextNum = 1001;
    if (users && users.length > 0) {
      const ids = users
        .filter(u => u.investor_id.startsWith(prefix))
        .map(u => {
          const match = u.investor_id.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        });
      const maxId = ids.length > 0 ? Math.max(...ids) : 0;
      if (maxId >= 1000) {
        nextNum = maxId + 1;
      }
    }
    const nextInvestorId = `${prefix}${nextNum}`;

    // Create a new user
    const { data: newUser, error: insertError } = await supabase!
      .from('equity_users')
      .insert({
        investor_id: nextInvestorId,
        full_name,
        email: normalizedEmail,
        pan_number: pan_number.toUpperCase(),
        demat_account,
        password_hash: hashedPassword,
        created_at: new Date().toISOString()
      })
      .select('*')
      .single<EquityUserRow>();

    if (insertError) {
      throw new AppError(insertError.message, 500);
    }
    finalUser = newUser;
  }

  // Generate tokens
  const role = finalUser.investor_id.startsWith('SUP') ? 'SUPERADMIN' : finalUser.investor_id.startsWith('ADM') ? 'ADMIN' : 'USER';
  const payload = { investor_id: finalUser.investor_id, email: finalUser.email, role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refresh token
  const { error: tokenError } = await supabase!
    .from('equity_refresh_tokens')
    .insert({
      investor_id: finalUser.investor_id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    });

  if (tokenError) {
    throw new AppError(tokenError.message, 500);
  }

  return {
    token: accessToken,
    user: {
      investor_id: finalUser.investor_id,
      full_name: finalUser.full_name,
      email: finalUser.email,
      pan_number: finalUser.pan_number,
      demat_account: finalUser.demat_account,
      created_at: finalUser.created_at
    }
  };
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  ensureSupabase();

  const { email, password } = credentials;
  const normalizedEmail = email.toLowerCase();
  const hashedPassword = hashPassword(password);

  const { data: user, error: findError } = await supabase!
    .from('equity_users')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle<EquityUserRow>();

  if (findError) {
    throw new AppError(findError.message, 500);
  }

  if (!user || user.password_hash === 'pending' || user.password_hash !== hashedPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate tokens
  const role = user.investor_id.startsWith('SUP') ? 'SUPERADMIN' : user.investor_id.startsWith('ADM') ? 'ADMIN' : 'USER';
  const payload = { investor_id: user.investor_id, email: user.email, role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refresh token
  const { error: tokenError } = await supabase!
    .from('equity_refresh_tokens')
    .insert({
      investor_id: user.investor_id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    });

  if (tokenError) {
    throw new AppError(tokenError.message, 500);
  }

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    investor: {
      investor_id: user.investor_id,
      full_name: user.full_name,
      email: user.email,
      pan_number: user.pan_number,
      demat_account: user.demat_account,
      created_at: user.created_at
    }
  };
};

export const logoutUser = async (refreshToken: string) => {
  ensureSupabase();

  const { error: deleteError } = await supabase!
    .from('equity_refresh_tokens')
    .delete()
    .eq('token', refreshToken);

  if (deleteError) {
    throw new AppError(deleteError.message, 500);
  }

  return {
    invalidated: true
  };
};

const assignmentsFilePath = path.join(__dirname, '../data/assignments.json');

const ensureAssignmentsDir = () => {
  const dir = path.dirname(assignmentsFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(assignmentsFilePath)) {
    fs.writeFileSync(assignmentsFilePath, JSON.stringify([]));
  }
};

export const getAssignments = async () => {
  ensureAssignmentsDir();
  try {
    const data = fs.readFileSync(assignmentsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

export const assignUserToAdvisor = async (investorId: string, advisorId: string) => {
  ensureAssignmentsDir();
  const assignments = await getAssignments();
  
  const existingIndex = assignments.findIndex((a: any) => a.investor_id === investorId);
  if (existingIndex > -1) {
    assignments[existingIndex].advisor_id = advisorId;
  } else {
    assignments.push({ investor_id: investorId, advisor_id: advisorId });
  }
  
  fs.writeFileSync(assignmentsFilePath, JSON.stringify(assignments, null, 2));
  return { investor_id: investorId, advisor_id: advisorId };
};

export const getProfile = async (investorId: string) => {
  ensureSupabase();
  const { data, error } = await supabase!
    .from('equity_users')
    .select('*')
    .eq('investor_id', investorId)
    .maybeSingle<EquityUserRow>();
    
  if (error) {
    throw new AppError(error.message, 500);
  }
  if (!data) {
    throw new AppError('User profile not found', 404);
  }
  return data;
};

export const updateProfile = async (investorId: string, updateData: {
  full_name: string;
  email: string;
  pan_number: string;
  demat_account: string;
}) => {
  ensureSupabase();
  const { data, error } = await supabase!
    .from('equity_users')
    .update({
      full_name: updateData.full_name,
      email: updateData.email.toLowerCase(),
      pan_number: updateData.pan_number.toUpperCase(),
      demat_account: updateData.demat_account
    })
    .eq('investor_id', investorId)
    .select('*')
    .single<EquityUserRow>();

  if (error) {
    throw new AppError(error.message, 500);
  }
  return data;
};

export const getAllUsers = async () => {
  ensureSupabase();
  const { data, error } = await supabase!
    .from('equity_users')
    .select('*');
    
  if (error) {
    throw new AppError(error.message, 500);
  }
  return (data || []).filter(u => !u.investor_id.startsWith('ADM') && !u.investor_id.startsWith('SUP'));
};

export const getAllAdmins = async () => {
  ensureSupabase();
  const { data, error } = await supabase!
    .from('equity_users')
    .select('*');
    
  if (error) {
    throw new AppError(error.message, 500);
  }
  return (data || []).filter(u => u.investor_id.startsWith('ADM') || u.investor_id.startsWith('SUP'));
};
