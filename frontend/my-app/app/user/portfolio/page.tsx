import React from 'react';
import {
  Shield,
  Activity,
  TrendingUp,
  Compass,
  PieChart,
  Sparkles,
  Wallet,
  Landmark,
} from 'lucide-react';

import { fetchApi } from '@/lib/api-client';

const dummyDashboard = {
  totalProfit: 25000,
  monthlyReturns: '12%',
  diversification: 'Good',
  riskScore: 'Moderate',
};

const dummyHealth = {
  wealthService: 'UP',
  mutualFundService: 'DOWN',
  equityService: 'DOWN',
};

const dummyHoldings = [
  {
    id: 1,
    stock_symbol: 'TCS',
    quantity: 12,
    avg_buy_price: 3850,
    current_market_price: 4020,
  },
  {
    id: 2,
    stock_symbol: 'INFY',
    quantity: 20,
    avg_buy_price: 1520,
    current_market_price: 1645,
  },
  {
    id: 3,
    stock_symbol: 'RELIANCE',
    quantity: 8,
    avg_buy_price: 2875,
    current_market_price: 3010,
  },
];

async function getWealthDashboard() {
  try {
    const res = await fetchApi('/api/wealth/dashboard', {
      method: 'GET',
      service: 'wealth',
    });

    return res.data || dummyDashboard;
  } catch {
    return dummyDashboard;
  }
}

async function getSystemHealth() {
  try {
    const res = await fetchApi('/api/system/health', {
      method: 'GET',
      service: 'wealth',
    });

    return res || dummyHealth;
  } catch {
    return dummyHealth;
  }
}

async function getHoldings() {
  try {
    const res = await fetchApi('/holdings', {
      method: 'GET',
    });

    if (res?.data?.length > 0) {
      return res.data;
    }

    return dummyHoldings;
  } catch {
    return dummyHoldings;
  }
}

export default async function UserDashboard() {
  const dashboardStats = await getWealthDashboard();
  const healthStats = await getSystemHealth();
  const holdings = await getHoldings();

  const portfolioValue = holdings.reduce(
    (sum: number, item: any) =>
      sum +
      Number(item.quantity) *
        Number(item.current_market_price || item.avg_buy_price),
    0
  );

  const totalHoldings = holdings.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          <Shield className="h-6 w-6 text-blue-600" />
          User Dashboard
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          Global platform overview, client diagnostics, and portfolio analytics.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Profit
            </h3>

            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            ₹{dashboardStats.totalProfit.toLocaleString('en-IN')}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Unified across assets
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Monthly Returns
            </h3>

            <Activity className="h-4 w-4 text-blue-500" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {dashboardStats.monthlyReturns}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Rolling average
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Diversification
            </h3>

            <Compass className="h-4 w-4 text-indigo-500" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {dashboardStats.diversification}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Asset class index
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Risk Profile
            </h3>

            <Shield className="h-4 w-4 text-amber-500" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {dashboardStats.riskScore}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Conservative to Aggressive
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Portfolio Value
              </h3>

              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                ₹{portfolioValue.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-950/30">
              <Wallet className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Holdings Count
              </h3>

              <div className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                {totalHoldings}
              </div>
            </div>

            <div className="rounded-xl bg-blue-100 p-3 dark:bg-blue-950/30">
              <PieChart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Wealth Service
              </h3>

              <div
                className={`mt-3 text-3xl font-bold ${
                  healthStats.wealthService === 'UP'
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {healthStats.wealthService}
              </div>
            </div>

            <div className="rounded-xl bg-indigo-100 p-3 dark:bg-indigo-950/30">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
            <Landmark className="h-4 w-4 text-blue-500" />
            Portfolio Holdings
          </h3>

          <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            Live Portfolio
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                  Symbol
                </th>

                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                  Quantity
                </th>

                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                  Avg Price
                </th>

                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                  Market Price
                </th>

                <th className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">
                  Current Value
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {holdings.map((stock: any) => {
                const currentValue =
                  Number(stock.quantity) *
                  Number(
                    stock.current_market_price ||
                      stock.avg_buy_price
                  );

                return (
                  <tr
                    key={stock.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/30"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                      {stock.stock_symbol}
                    </td>

                    <td className="px-6 py-4">
                      {stock.quantity}
                    </td>

                    <td className="px-6 py-4">
                      ₹
                      {Number(
                        stock.avg_buy_price
                      ).toLocaleString('en-IN')}
                    </td>

                    <td className="px-6 py-4">
                      ₹
                      {Number(
                        stock.current_market_price ||
                          stock.avg_buy_price
                      ).toLocaleString('en-IN')}
                    </td>

                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      ₹{currentValue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}