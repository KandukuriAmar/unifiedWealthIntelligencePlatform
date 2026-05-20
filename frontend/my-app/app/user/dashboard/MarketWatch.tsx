'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

interface MarketWatchProps {
  marketPrices: any[];
  watchlist: any[];
  addToWatchlistAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  removeFromWatchlistAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export function MarketWatch({ marketPrices, watchlist, addToWatchlistAction, removeFromWatchlistAction }: MarketWatchProps) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await addToWatchlistAction(formData);
    if (res.success) {
      toast.success('Added to watchlist');
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.error || 'Failed to add');
    }
    setLoading(false);
  };

  const handleRemove = async (id: number) => {
    const formData = new FormData();
    formData.append('id', id.toString());
    const res = await removeFromWatchlistAction(formData);
    if (res.success) {
      toast.success('Removed from watchlist');
    } else {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Market Prices */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-lg font-bold mb-4">Live Market Prices</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-2 font-medium">Symbol</th>
                <th className="px-4 py-2 font-medium">Price</th>
                <th className="px-4 py-2 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {marketPrices.map((p) => (
                <tr key={p.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-semibold">{p.symbol}</td>
                  <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">₹{p.current_price}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(p.last_updated).toLocaleTimeString()}</td>
                </tr>
              ))}
              {marketPrices.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">No market data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watchlist */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">My Watchlist</h2>
        </div>
        
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <Input name="stock_symbol" placeholder="Stock Symbol (e.g. RELIANCE)" required className="uppercase" />
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50">
              <tr>
                <th className="px-4 py-2 font-medium">Symbol</th>
                <th className="px-4 py-2 font-medium">Added On</th>
                <th className="px-4 py-2 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {watchlist.map((w) => (
                <tr key={w.watchlist_id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-semibold">{w.stock_symbol}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{new Date(w.added_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => handleRemove(w.watchlist_id)} className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {watchlist.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-500">Watchlist is empty.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
