import React from 'react';
import { fetchApi } from '@/lib/api-client';
import { Briefcase, Landmark, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

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
    return null;
  }
}

export default async function UserPortfolios() {
  const summary = await getWealthPortfolioSummary();

  const mfSummary = summary?.mutualFunds?.summary || { totalInvestment: 0, totalCurrentValue: 0, profit: 0 };
  const funds = summary?.mutualFunds?.funds || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-blue-600" />
          My Portfolios
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Supervise and navigate your designated assets, mutual fund portfolios, and equity holdings.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mutual Funds Portfolio Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Mutual Fund Assets</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Managed via Mutual Fund Service</p>
              </div>
              <Landmark className="h-6 w-6 text-blue-600" />
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Invested Capital:</span>
                <span className="font-semibold font-mono">₹{mfSummary.totalInvestment.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Current Valuation:</span>
                <span className="font-bold font-mono text-blue-600 dark:text-blue-400">₹{mfSummary.totalCurrentValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-bold">Total Gain:</span>
                <span className="font-bold font-mono text-emerald-600">+₹{mfSummary.profit.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-550">Active Schemes: {funds.length}</span>
            <span className="text-slate-555 font-bold uppercase tracking-wider bg-blue-50 text-blue-755 px-2 py-0.5 rounded">
              Active
            </span>
          </div>
        </div>

        {/* Global Wealth Allocation Card */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden flex flex-col justify-between">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Consolidated Wealth</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Aggregated Asset Ledger</p>
              </div>
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Mutual Fund Allocation:</span>
                <span className="font-semibold font-mono">₹{mfSummary.totalCurrentValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Equity Asset Allocation:</span>
                <span className="font-semibold font-mono">₹{(summary?.equity?.totalValue || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 font-bold">Total Wealth Portfolio:</span>
                <span className="font-extrabold font-mono text-indigo-600 dark:text-indigo-400">
                  ₹{(summary?.totalWealth || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-550">Last Synced: Just now</span>
            <span className="text-slate-555 font-bold uppercase tracking-wider bg-indigo-50 text-indigo-755 px-2 py-0.5 rounded">
              Synced
            </span>
          </div>
        </div>
      </div>
      
      {/* Portfolio holdings listing */}
      {funds.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden mt-6">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Holdings under Mutual Funds Portfolio</h4>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {funds.map((fund: any) => (
              <div key={fund.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">
                    {fund.mf_schemes?.scheme_name || fund.scheme_code}
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    AMC: {fund.mf_schemes?.amc_name || 'N/A'} | Purchased: {new Date(fund.investment_date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-baseline gap-6">
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Units</span>
                    <span className="font-mono text-sm font-semibold">{fund.units}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Invested</span>
                    <span className="font-mono text-sm font-semibold">₹{fund.invested_amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Current Value</span>
                    <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      ₹{fund.current_value.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
