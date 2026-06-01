import React from 'react';
import {
  PieChart,
  Landmark,
  TrendingUp,
  Wallet,
  Shield,
  Sparkles,
  Activity,
} from 'lucide-react';

import { fetchApi } from '@/lib/api-client';

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

const dummySummary = {
  mutualFunds: {
    summary: {
      totalCurrentValue: 185000,
    },
  },
};

const dummyDashboard = {
  totalProfit: 25000,
  monthlyReturns: '12%',
  diversification: 'Good',
  riskScore: 'Moderate',
};

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

async function getWealthPortfolioSummary() {
  try {
    const res = await fetchApi('/api/wealth/portfolio/summary', {
      method: 'GET',
      service: 'wealth',
    });

    return res.data || dummySummary;
  } catch {
    return dummySummary;
  }
}

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

export default async function UserBreakdown() {
  const holdings = await getHoldings();
  const summary = await getWealthPortfolioSummary();
  const dashboard = await getWealthDashboard();

  const equityValue = holdings.reduce(
    (sum: number, item: any) =>
      sum +
      Number(item.quantity) *
        Number(item.current_market_price || item.avg_buy_price),
    0
  );

  const mfValue =
    summary?.mutualFunds?.summary?.totalCurrentValue || 0;

  const totalValue = equityValue + mfValue;

  const equityPercentage =
    totalValue > 0
      ? Math.round((equityValue / totalValue) * 100)
      : 0;

  const mfPercentage =
    totalValue > 0
      ? Math.round((mfValue / totalValue) * 100)
      : 0;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const equityStrokeDashoffset =
    circumference -
    (equityPercentage / 100) * circumference;

  const mfStrokeDashoffset =
    circumference -
    (mfPercentage / 100) * circumference;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          <PieChart className="h-6 w-6 text-blue-600" />
          Asset Allocation Breakdown
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          Analyze your diversified portfolio distribution across assets.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Portfolio Value
            </h3>

            <Wallet className="h-4 w-4 text-emerald-500" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            ₹{totalValue.toLocaleString('en-IN')}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Total consolidated assets
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Profit
            </h3>

            <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            ₹{dashboard.totalProfit.toLocaleString('en-IN')}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Portfolio growth summary
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Monthly Returns
            </h3>

            <Activity className="h-4 w-4 text-indigo-500" />
          </div>

          <div className="mt-4 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {dashboard.monthlyReturns}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Average rolling return
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
            {dashboard.riskScore}
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Risk exposure analytics
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:col-span-1">
          <h3 className="mb-6 self-start text-sm font-bold text-slate-800 dark:text-slate-100">
            Diversification Split
          </h3>

          <div className="relative flex h-48 w-48 items-center justify-center">
            <svg
              className="h-full w-full -rotate-90 transform"
              viewBox="0 0 120 120"
            >
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-100 dark:stroke-slate-900"
                strokeWidth="10"
                fill="transparent"
              />

              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-blue-600 transition-all duration-500"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={mfStrokeDashoffset}
                strokeLinecap="round"
              />

              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-emerald-500 transition-all duration-500"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={equityStrokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(${(mfPercentage / 100) * 360} 60 60)`}
              />
            </svg>

            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                100%
              </span>

              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Diversified
              </span>
            </div>
          </div>

          <div className="mt-6 flex w-full justify-center gap-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded-full bg-blue-600"></span>

              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Mutual Funds ({mfPercentage}%)
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>

              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Equities ({equityPercentage}%)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-950/40">
                    Mutual Funds
                  </span>

                  <Landmark className="h-4 w-4 text-blue-500" />
                </div>

                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  ₹{mfValue.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Allocation: {mfPercentage}% of portfolio
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:bg-emerald-950/40">
                    Equities
                  </span>

                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>

                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                  ₹{equityValue.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Allocation: {equityPercentage}% of portfolio
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Portfolio Intelligence
                </h4>

                <div className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
                  {dashboard.diversification}
                </div>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Diversification quality across asset classes.
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <Sparkles className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">
                Equity Holdings
              </h3>
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
                          ₹
                          {currentValue.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}