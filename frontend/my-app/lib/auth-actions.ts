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
}

// Mock users database with dummy session tokens for the backend
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
      // Call real backend for Admin/Superadmin on Wealth Service (port 5000)
      const response = await fetchApi('/api/auth/login', {
        method: 'POST',
        requireAuth: false,
        service: 'wealth',
        body: JSON.stringify({ email, password }),
      });
      
      const data = response.data;
      userSession = {
        id: role === 'superadmin' ? 'sup_1' : 'adm_1',
        name: role === 'superadmin' ? 'Super Admin' : 'Admin User',
        email: email || (role === 'superadmin' ? 'superadmin@example.com' : 'admin@example.com'),
        role: role,
        access_token: data.token, // Store the returned token
      };
    } catch (e: any) {
      console.error('Real admin login failed, falling back to mock session:', e.message);
      // Fallback to mock session so that the developer can still run it if the backend is down
      userSession = MOCK_USERS[role];
    }
  } else {
    // Keep mock for investor/user role as requested
    userSession = MOCK_USERS.user;
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(userSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  redirect(`/${role}/dashboard`);
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
