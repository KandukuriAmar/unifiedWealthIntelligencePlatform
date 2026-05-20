import { cookies } from 'next/headers';

const SERVICE_URLS = {
  equity: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  wealth: process.env.NEXT_PUBLIC_WEALTH_API_URL || 'http://localhost:5000',
  mutualFund: process.env.NEXT_PUBLIC_MUTUAL_FUND_API_URL || 'http://localhost:5001',
};

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
  service?: 'equity' | 'wealth' | 'mutualFund';
}

export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = true, service = 'equity', headers: customHeaders, ...restOptions } = options;
  
  const headers = new Headers(customHeaders);
  headers.set('Content-Type', 'application/json');

  if (requireAuth) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');
    
    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie.value);
        if (session.access_token) {
          headers.set('Authorization', `Bearer ${session.access_token}`);
        }
      } catch (e) {
        console.error('Failed to parse session cookie for auth', e);
      }
    }
  }

  const base = SERVICE_URLS[service];
  const url = `${base}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers,
      ...restOptions,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error: any) {
    console.error(`API Error on ${service} service endpoint ${endpoint}:`, error.message);
    throw error;
  }
}
