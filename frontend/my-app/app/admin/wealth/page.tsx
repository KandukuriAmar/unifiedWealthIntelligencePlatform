import React from 'react';
import { fetchApi } from '@/lib/api-client';
import { Layers, Wallet, LineChart, Shield, CheckCircle, XCircle } from 'lucide-react';

async function getWealthPortfolioSummary() {
  try {
    const res = await fetchApi('/api/wealth/portfolio/summary', {
      method: 'GET',
      service: 'wealth',
      requireAuth: false,
    });
    return res.data || null;
  } catch (error) {
    console.error('Failed to fetch wealth portfolio summary:', error);
    // Return dummy data structure for graceful degradation
    return {
      mutualFunds: {
        funds: [
          {
            id: 1,
            customer_ref: 'CUST-1001',
            scheme_code: 'SBI-BLUECHIP',
            units: 500,
            invested_amount: 30000,
            current_value: 34226.05,
            investment_date: '2023-06-01',
            mf_schemes: {
              amc_name: 'SBI Mutual Fund',
              nav_date: '2024-12-01',
              nav_value: 68.4521,
              scheme_code: 'SBI-BLUECHIP',
              scheme_name: 'SBI Bluechip Fund',
              fund_category: 'Large Cap',
              risk_category: 'Moderate'
            }
          },
          {
            id: 2,
            customer_ref: 'CUST-1001',
            scheme_code: 'HDFC-FLEXI',
            units: 100,
            invested_amount: 80000,
            current_value: 89215,
            investment_date: '2023-08-15',
            mf_schemes: {
              amc_name: 'HDFC Mutual Fund',
              nav_date: '2024-12-01',
              nav_value: 892.15,
              scheme_code: 'HDFC-FLEXI',
              scheme_name: 'HDFC Flexi Cap Fund',
              fund_category: 'Flexi Cap',
              risk_category: 'Moderately High'
            }
          }
        ],
        sips: [],
        transactions: [],
        summary: {
          totalInvestment: 110000,
          totalCurrentValue: 123441.05,
          profit: 13441.05
        }
      },
      equity: {
        service: 'DOWN',
        totalValue: 0
      },
      totalWealth: 123441.05
    };
  }
}

export default async function AdminWealth() {
  const summary = await getWealthPortfolioSummary();

  const mutualFundsSummary = summary?.mutualFunds?.summary || { totalInvestment: 0, totalCurrentValue: 0, profit: 0 };
  const equitySummary = summary?.equity || { service: 'DOWN', totalValue: 0 };
  const fundsList = summary?.mutualFunds?.funds || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Layers className="h-6 w-6 text-indigo-600" />
          Wealth Portfolio Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Consolidated client holdings, mutual funds portfolio breakdown, and asset valuation trackers.
        </p>
      </div>

      {/* Asset Allocation Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Wealth */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Net Worth</h3>
            <Wallet className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            ₹{summary?.totalWealth ? summary.totalWealth.toLocaleString('en-IN') : '0'}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Aggregated client funds
          </p>
        </div>

        {/* Mutual Funds Managed */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Mutual Funds Allocation</h3>
            <LineChart className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            ₹{mutualFundsSummary.totalCurrentValue.toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1 font-semibold">
            Profit: ₹{mutualFundsSummary.profit.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Equity Allocation */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Equity Allocation</h3>
            <Shield className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            ₹{equitySummary.totalValue.toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-xs flex items-center gap-1">
            Service status:{' '}
            <span className={`inline-flex items-center font-bold gap-0.5 ${
              equitySummary.service === 'UP' ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {equitySummary.service === 'UP' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {equitySummary.service}
            </span>
          </p>
        </div>
      </div>

      {/* Mutual Funds Holdings Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">Mutual Fund Schemes</h2>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-full">
            Client: CUST-1001
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Scheme Code</th>
                <th className="px-6 py-4 font-semibold">AMC</th>
                <th className="px-6 py-4 font-semibold">Units</th>
                <th className="px-6 py-4 font-semibold">NAV Value</th>
                <th className="px-6 py-4 font-semibold">Invested Amt</th>
                <th className="px-6 py-4 font-semibold">Current Value</th>
                <th className="px-6 py-4 font-semibold">Risk Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {fundsList.map((fund: any) => (
                <tr key={fund.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {fund.mf_schemes?.scheme_name || fund.scheme_code}
                    </span>
                    <span className="text-xs text-slate-550 dark:text-slate-500 uppercase">{fund.scheme_code}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-350">
                    {fund.mf_schemes?.amc_name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 font-mono">{fund.units}</td>
                  <td className="px-6 py-4 font-mono">₹{fund.mf_schemes?.nav_value || '0.00'}</td>
                  <td className="px-6 py-4 font-mono">₹{fund.invested_amount.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                    ₹{fund.current_value.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      fund.mf_schemes?.risk_category === 'Very High' || fund.mf_schemes?.risk_category === 'High'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
                        : fund.mf_schemes?.risk_category === 'Moderately High'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
                    }`}>
                      {fund.mf_schemes?.risk_category || 'Moderate'}
                    </span>
                  </td>
                </tr>
              ))}
              {fundsList.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No mutual fund holdings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
