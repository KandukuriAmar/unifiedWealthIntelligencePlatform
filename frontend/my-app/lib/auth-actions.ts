'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { fetchApi } from './api-client';

export type Role = 'user' | 'admin' | 'superadmin';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  access_token?: string;
  refresh_token?: string;
  pan_number?: string;
  demat_account?: string;
}


const MOCK_USERS: Record<Role, UserSession> = {
  user: { 
    id: 'usr_1', 
    name: 'Normal User', 
    email: 'user@example.com', 
    role: 'user',
    access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.access.token',
    refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example.refresh.token'
  },
  admin: { id: 'adm_1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  superadmin: { id: 'sup_1', name: 'Super Admin', email: 'superadmin@example.com', role: 'superadmin' },
};

const SESSION_COOKIE_NAME = 'auth_session';

export async function login(credentials: { email?: string; password?: string; role: Role }) {
  const { email, password, role } = credentials;
  let userSession: UserSession;

  if (role === 'admin' || role === 'superadmin') {
    try {
     
      const res = await fetchApi('/api/auth/login', {
        method: 'POST',
        requireAuth: false,
        service: 'wealth',
        body: JSON.stringify({ email, password }),
      });
      
      const payload = res.data;
      userSession = {
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
        role: role,
        access_token: payload.token,
      };
    } catch (e: any) {
      console.error('Real admin login failed, falling back to mock session:', e.message);
      userSession = MOCK_USERS[role];
    }
  } else {
    try {
     
      const res = await fetchApi('/auth/login', {
        method: 'POST',
        requireAuth: false,
        service: 'equity',
        body: JSON.stringify({ email, password }),
      });
      
      const payload = res.data;
      userSession = {
        id: payload.investor.investor_id,
        name: payload.investor.full_name,
        email: payload.investor.email,
        role: 'user',
        access_token: payload.access_token,
        refresh_token: payload.refresh_token,
        pan_number: payload.investor.pan_number,
        demat_account: payload.investor.demat_account,
      };
    } catch (e: any) {
      console.error('Real user login failed, falling back to mock session:', e.message);
      userSession = MOCK_USERS.user;
    }
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(userSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, 
  });

  redirect(`/${role}/dashboard`);
}

export async function updateProfile(data: { full_name: string; email: string; pan_number: string; demat_account: string }) {
  try {
    const res = await fetchApi('/auth/profile', {
      method: 'PUT',
      service: 'equity',
      body: JSON.stringify(data),
    });

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (sessionCookie) {
      const session = JSON.parse(sessionCookie.value) as UserSession;
      session.name = data.full_name;
      session.email = data.email;
      session.pan_number = data.pan_number;
      session.demat_account = data.demat_account;
      cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    return { success: true, message: 'Profile updated successfully' };
  } catch (error: any) {
    console.error('Failed to update profile:', error.message);
    return { success: false, message: error.message || 'Failed to update profile' };
  }
}


export async function logout() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);
      if (session.role === 'user' && session.refresh_token) {
        // Call backend logout
        await fetchApi('/auth/logout', {
          method: 'POST',
          requireAuth: false,
          body: JSON.stringify({ refresh_token: session.refresh_token }),
        }).catch(e => console.error('Backend logout failed', e));
      }
    } catch(e) {}
  }
  
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/login');
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value) as UserSession;
  } catch (e) {
    return null;
  }
}
