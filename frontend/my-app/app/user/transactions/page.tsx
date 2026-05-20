import React from 'react';
import { fetchApi } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';
import { TransactionForm } from './TransactionForm';

async function getTransactions() {
  try {
    const res = await fetchApi('/transactions', { method: 'GET', next: { tags: ['transactions'] } });
    return res.data || [];
  } catch (error) {
    console.error('Failed to get transactions:', error);
    return [];
  }
}

async function buyStockAction(formData: FormData) {
  'use server';
  const stock_symbol = formData.get('stock_symbol') as string;
  const quantity = Number(formData.get('quantity'));
  const price = Number(formData.get('price'));
  const exchange = formData.get('exchange') as string;

  try {
    await fetchApi('/transactions/buy', {
      method: 'POST',
      body: JSON.stringify({ stock_symbol, quantity, price, exchange })
    });
    revalidatePath('/user/transactions');
    revalidatePath('/user/portfolio');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function sellStockAction(formData: FormData) {
  'use server';
  const stock_symbol = formData.get('stock_symbol') as string;
  const quantity = Number(formData.get('quantity'));
  const price = Number(formData.get('price'));
  const exchange = formData.get('exchange') as string;

  try {
    await fetchApi('/transactions/sell', {
      method: 'POST',
      body: JSON.stringify({ stock_symbol, quantity, price, exchange })
    });
    revalidatePath('/user/transactions');
    revalidatePath('/user/portfolio');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export default async function UserTransactions() {
  const transactions = await getTransactions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400">Your recent trading activity.</p>
        </div>
        <TransactionForm buyStockAction={buyStockAction} sellStockAction={sellStockAction} />
      </div>
      
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Type</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Stock Symbol</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Quantity</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Price</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Gain/Loss</th>
              <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((t: any) => (
                <tr key={t.transaction_id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      t.transaction_type === 'BUY' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      {t.transaction_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">{t.stock_symbol}</td>
                  <td className="px-6 py-4">{t.quantity}</td>
                  <td className="px-6 py-4">₹{t.price}</td>
                  <td className="px-6 py-4">
                    {t.realized_gain !== null ? (
                       <span className={Number(t.realized_gain) >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                         ₹{t.realized_gain}
                       </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(t.transaction_date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
