import React from 'react';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';
import { MarketWatch } from './MarketWatch';

async function getMarketPrices() {
  try {
    const res = await fetchApi('/market/prices', { requireAuth: false, next: { tags: ['market'] } });
    return res.data || [];
  } catch (error) {
    console.error('Failed to get market prices:', error);
    return [];
  }
}

async function getWatchlist() {
  try {
    const res = await fetchApi('/watchlist', { method: 'GET', next: { tags: ['watchlist'] } });
    return res.data || [];
  } catch (error) {
    console.error('Failed to get watchlist:', error);
    return [];
  }
}

async function addToWatchlistAction(formData: FormData) {
  'use server';
  const stock_symbol = formData.get('stock_symbol') as string;
  try {
    await fetchApi('/watchlist', {
      method: 'POST',
      body: JSON.stringify({ stock_symbol })
    });
    revalidatePath('/user/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function removeFromWatchlistAction(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  try {
    await fetchApi(`/watchlist/${id}`, { method: 'DELETE' });
    revalidatePath('/user/dashboard');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export default async function UserDashboard() {
  const marketPrices = await getMarketPrices();
  const watchlist = await getWatchlist();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Client Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Welcome to your wealth overview.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Net Worth</h3>
            <Wallet className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            $1,245,600
          </div>
          <p className="mt-1 flex items-center text-sm font-medium text-emerald-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            +12.5% from last month
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Invested Capital</h3>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            $890,200
          </div>
          <p className="mt-1 flex items-center text-sm font-medium text-emerald-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            +4.2% from last month
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Cash Balance</h3>
            <Wallet className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            $355,400
          </div>
          <p className="mt-1 flex items-center text-sm font-medium text-rose-600">
            <ArrowDownRight className="mr-1 h-4 w-4" />
            -2.1% from last month
          </p>
        </div>
      </div>

      <MarketWatch
        marketPrices={marketPrices}
        watchlist={watchlist}
        addToWatchlistAction={addToWatchlistAction}
        removeFromWatchlistAction={removeFromWatchlistAction}
      />
    </div>
  );
}