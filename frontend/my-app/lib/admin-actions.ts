'use server';

import { fetchApi } from './api-client';

export interface UserItem {
  investor_id: string;
  full_name: string;
  email: string;
  pan_number: string;
  demat_account: string;
  created_at: string;
}

export async function getUsers(): Promise<UserItem[]> {
  try {
    const res = await fetchApi('/auth/users', {
      method: 'GET',
      service: 'equity',
      requireAuth: true,
    });
    return res.data || [];
  } catch (error: any) {
    console.error('Failed to get users:', error.message);
    return [];
  }
}

export async function getAdmins(): Promise<UserItem[]> {
  try {
    const res = await fetchApi('/auth/admins', {
      method: 'GET',
      service: 'equity',
      requireAuth: true,
    });
    return res.data || [];
  } catch (error: any) {
    console.error('Failed to get admins:', error.message);
    return [];
  }
}

export async function createUser(data: {
  full_name: string;
  email: string;
  pan_number: string;
  demat_account: string;
  password: string;
}) {
  try {
    const res = await fetchApi('/auth/create-user', {
      method: 'POST',
      service: 'equity',
      requireAuth: true,
      body: JSON.stringify(data),
    });
    return { success: true, message: 'User created successfully', data: res.data };
  } catch (error: any) {
    console.error('Failed to create user:', error.message);
    return { success: false, message: error.message || 'Failed to create user' };
  }
}

export async function createAdmin(data: {
  full_name: string;
  email: string;
  pan_number: string;
  demat_account: string;
  password: string;
}) {
  try {
    const res = await fetchApi('/auth/create-admin', {
      method: 'POST',
      service: 'equity',
      requireAuth: true,
      body: JSON.stringify(data),
    });
    return { success: true, message: 'Admin created successfully', data: res.data };
  } catch (error: any) {
    console.error('Failed to create admin:', error.message);
    return { success: false, message: error.message || 'Failed to create admin' };
  }
}

export async function assignUserToAdvisor(investor_id: string, advisor_id: string) {
  try {
    const res = await fetchApi('/auth/assign', {
      method: 'POST',
      service: 'equity',
      requireAuth: true,
      body: JSON.stringify({ investor_id, advisor_id }),
    });
    return { success: true, message: 'Assignment saved successfully', data: res.data };
  } catch (error: any) {
    console.error('Failed to assign user:', error.message);
    return { success: false, message: error.message || 'Failed to assign user' };
  }
}

export async function getAssignments(): Promise<{ investor_id: string; advisor_id: string }[]> {
  try {
    const res = await fetchApi('/auth/assignments', {
      method: 'GET',
      service: 'equity',
      requireAuth: true,
    });
    return res.data || [];
  } catch (error: any) {
    console.error('Failed to get assignments:', error.message);
    return [];
  }
}

export async function getAllAdminTransactions(): Promise<any[]> {
  try {
    const res = await fetchApi('/transactions/admin', {
      method: 'GET',
      service: 'equity',
      requireAuth: true,
    });
    return res.data || [];
  } catch (error: any) {
    console.error('Failed to get admin transactions:', error.message);
    return [];
  }
}

export async function getAllAdminSips(): Promise<any[]> {
  try {
    const res = await fetchApi('/api/mf/admin-sips', {
      method: 'GET',
      service: 'mutualFund',
      requireAuth: false, // matches mf route currently
    });
    return res.data?.sips || [];
  } catch (error: any) {
    console.error('Failed to get admin sips:', error.message);
    return [];
  }
}

export async function getAllAdminPortfolioFunds(): Promise<any[]> {
  try {
    const res = await fetchApi('/api/mf/admin-portfolio', {
      method: 'GET',
      service: 'mutualFund',
      requireAuth: false,
    });
    return res.data?.funds || [];
  } catch (error: any) {
    console.error('Failed to get admin portfolio funds:', error.message);
    return [];
  }
}

export async function getAllAdminHoldings(): Promise<any[]> {
  try {
    const res = await fetchApi('/holdings/admin', {
      method: 'GET',
      service: 'equity',
      requireAuth: true,
    });
    return res.data || [];
  } catch (error: any) {
    console.error('Failed to get admin holdings:', error.message);
    return [];
  }
}
