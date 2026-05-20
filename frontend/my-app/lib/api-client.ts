
import { cookies } from 'next/headers';

const API_URLS = {
  equity: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  wealth: process.env.NEXT_PUBLIC_WEALTH_API_URL || 'http://localhost:5000',
  mutualFund:
    process.env.NEXT_PUBLIC_MUTUAL_FUND_API_URL || 'http://localhost:5001',
};

type Service = 'equity' | 'wealth' | 'mutualFund';

interface FetchApiOptions extends RequestInit {
  service?: Service;
  requireAuth?: boolean;
}

export async function fetchApi(
  endpoint: string,
  options: FetchApiOptions = {}
) {
  const {
    service = 'equity',
    requireAuth = true,
    ...fetchOptions
  } = options;

  const headers = new Headers(fetchOptions.headers);

  headers.set('Content-Type', 'application/json');

 
  if (service === 'mutualFund') {
    headers.set('x-api-key', 'myapikey');
  }

  
  if (requireAuth) {
    const cookieStore = await cookies();
    const session = cookieStore.get('auth_session');

    if (session) {
      const parsed = JSON.parse(session.value);

      if (parsed.access_token) {
        headers.set(
          'Authorization',
          `Bearer ${parsed.access_token}`
        );
      }
    }
  }

  const response = await fetch(
    `${API_URLS[service]}${endpoint}`,
    {
      ...fetchOptions,
      headers,
      cache: 'no-store',
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

