import React from 'react';
import { fetchApi } from '@/lib/api-client';

async function getHoldings() {
  try {
    const res = await fetchApi('/holdings', { method: 'GET', next: { tags: ['holdings'] } });
    return res.data || [];
  } catch (error) {
    console.error('Failed to get holdings:', error);
    return [];
  }
}

export default async function UserPortfolio() {
  const holdings = await getHoldings();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">My Portfolio</h1>
        <p className="text-slate-500 dark:text-slate-400">Detailed view of your holdings.</p>
      </div>
      
      {/* Holdings Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Stock Symbol</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Exchange</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Quantity</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Avg Buy Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No holdings found. Make a transaction to start building your portfolio.
                </td>
              </tr>
            ) : (
              holdings.map((h: any) => (
                <tr key={h.holding_id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{h.stock_symbol}</td>
                  <td className="px-6 py-4">{h.exchange || 'NSE'}</td>
                  <td className="px-6 py-4">{h.quantity}</td>
                  <td className="px-6 py-4">₹{h.average_buy_price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
