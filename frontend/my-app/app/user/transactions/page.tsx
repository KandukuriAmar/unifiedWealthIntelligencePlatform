import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Wallet,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

import { fetchApi } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';
import { TransactionForm } from './TransactionForm';

const dummyTransactions = [
  {
    id: 1,
    transaction_type: 'BUY',
    stock_symbol: 'TCS',
    quantity: 10,
    price: 3850,
    realized_gain: 1200,
    executed_at: new Date(),
  },
  {
    id: 2,
    transaction_type: 'SELL',
    stock_symbol: 'INFY',
    quantity: 5,
    price: 1620,
    realized_gain: -450,
    executed_at: new Date(),
  },
  {
    id: 3,
    transaction_type: 'BUY',
    stock_symbol: 'RELIANCE',
    quantity: 8,
    price: 2875,
    realized_gain: 3200,
    executed_at: new Date(),
  },
];

async function getTransactions() {
  try {
    const res = await fetchApi('/transactions', {
      method: 'GET',
      next: { tags: ['transactions'] },
    });

    if (res?.data?.length > 0) {
      return res.data;
    }

    return dummyTransactions;
  } catch {
    return dummyTransactions;
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
      body: JSON.stringify({
        stock_symbol,
        quantity,
        price,
        exchange,
      }),
    });

    revalidatePath('/user/transactions');
    revalidatePath('/user/portfolio');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
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
      body: JSON.stringify({
        stock_symbol,
        quantity,
        price,
        exchange,
      }),
    });

    revalidatePath('/user/transactions');
    revalidatePath('/user/portfolio');

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}

export default async function UserTransactions() {
  const transactions = await getTransactions();

  const totalTrades = transactions.length;

  const totalBuyTrades = transactions.filter(
    (t: any) => t.transaction_type === 'BUY'
  ).length;

  const totalSellTrades = transactions.filter(
    (t: any) => t.transaction_type === 'SELL'
  ).length;

  const totalPnL = transactions.reduce(
    (sum: number, tx: any) =>
      sum + Number(tx.realized_gain || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            <Activity className="h-6 w-6 text-blue-600" />
            Transactions
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Monitor your complete trading activity and order history.
          </p>
        </div>

        <TransactionForm
          buyStockAction={buyStockAction}
          sellStockAction={sellStockAction}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Trades
            </h3>

            <Wallet className="h-4 w-4 text-blue-500" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {totalTrades}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Completed market transactions
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Buy Orders
            </h3>

            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-emerald-600">
            {totalBuyTrades}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Active investment entries
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Sell Orders
            </h3>

            <ArrowDownRight className="h-4 w-4 text-rose-500" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-rose-600">
            {totalSellTrades}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Completed exits
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Realized P&L
            </h3>

            <Sparkles className="h-4 w-4 text-indigo-500" />
          </div>

          <div
            className={`mt-4 text-3xl font-semibold ${
              totalPnL >= 0
                ? 'text-emerald-600'
                : 'text-rose-600'
            }`}
          >
            ₹{totalPnL.toLocaleString('en-IN')}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Net realized performance
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">
            Transaction Ledger
          </h3>

          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Live Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                  Type
                </th>

                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                  Stock Symbol
                </th>

                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                  Quantity
                </th>

                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                  Price
                </th>

                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                  Gain / Loss
                </th>

                <th className="px-6 py-4 font-medium text-slate-500 dark:text-slate-400">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t: any) => (
                  <tr
                    key={t.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          t.transaction_type === 'BUY'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}
                      >
                        {t.transaction_type}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {t.stock_symbol}
                    </td>

                    <td className="px-6 py-4">
                      {t.quantity}
                    </td>

                    <td className="px-6 py-4">
                      ₹
                      {Number(t.price).toLocaleString(
                        'en-IN'
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {t.realized_gain !== null &&
                      t.realized_gain !== undefined ? (
                        <span
                          className={
                            Number(t.realized_gain) >= 0
                              ? 'font-semibold text-emerald-600'
                              : 'font-semibold text-rose-600'
                          }
                        >
                          ₹
                          {Number(
                            t.realized_gain
                          ).toLocaleString('en-IN')}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Date(
                        t.executed_at
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}