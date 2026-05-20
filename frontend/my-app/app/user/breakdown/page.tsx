import React from 'react';
import { fetchApi } from '@/lib/api-client';
import { PieChart, Landmark, ArrowUpRight, TrendingUp, HelpCircle } from 'lucide-react';

async function getHoldings() {
  try {
    const res = await fetchApi('/holdings', { method: 'GET' });
    return res.data || [];
  } catch (error) {
    console.error('Failed to get holdings:', error);
    return [];
  }
}

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

export default async function UserBreakdown() {
  const holdings = await getHoldings();
  const summary = await getWealthPortfolioSummary();

  // Calculate Equities value
  const equityValue = holdings.reduce((sum: number, item: any) => sum + (item.quantity * item.average_buy_price), 0);
  
  // Calculate Mutual Funds value
  const mfValue = summary?.mutualFunds?.summary?.totalCurrentValue || 0;
  
  const totalValue = equityValue + mfValue;
  
  const equityPercentage = totalValue > 0 ? Math.round((equityValue / totalValue) * 100) : 0;
  const mfPercentage = totalValue > 0 ? Math.round((mfValue / totalValue) * 100) : 0;

  // SVG Donut calculation properties
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const equityStrokeDashoffset = circumference - (equityPercentage / 100) * circumference;
  const mfStrokeDashoffset = circumference - (mfPercentage / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <PieChart className="h-6 w-6 text-blue-600" />
          Asset Allocation Breakdown
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Analyze your diversified portfolio distribution across Equities and Mutual Funds.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* SVG Allocation Donut Chart */}
        <div className="md:col-span-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-6 self-start">
            Diversification Split
          </h3>
          
          {totalValue > 0 ? (
            <div className="relative flex items-center justify-center w-48 h-48">
              {/* SVG Ring Container */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-slate-900"
                  strokeWidth="10"
                  fill="transparent"
                />
                
                {/* Mutual Fund Circle Segment */}
                {mfPercentage > 0 && (
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
                )}

                {/* Equity Circle Segment */}
                {equityPercentage > 0 && (
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
                )}
              </svg>
              
              {/* Absolute Center Labels */}
              <div className="absolute text-center">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {totalValue > 0 ? '100%' : '0%'}
                </span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                  Diversified
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">
              No holdings recorded yet to calculate allocation.
            </div>
          )}

          {/* Color Legend */}
          <div className="flex gap-6 mt-6 justify-center w-full">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-350">Mutual Funds ({mfPercentage}%)</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-slate-700 dark:text-slate-350">Equities ({equityPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Detailed Values breakdown */}
        <div className="md:col-span-2 space-y-6">
          {/* Summary values */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* MF Segment Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                    Mutual Funds
                  </span>
                  <Landmark className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                  ₹{mfValue.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-4">
                Allocation: {mfPercentage}% of overall wealth
              </div>
            </div>

            {/* Equity Segment Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    Equities
                  </span>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">
                  ₹{equityValue.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-4">
                Allocation: {equityPercentage}% of overall wealth
              </div>
            </div>
          </div>

          {/* Consolidated Wealth Header card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 flex justify-between items-center">
            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Consolidated Portfolio Value
              </h4>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                ₹{totalValue.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-slate-950 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Asset Classes</span>
              <span className="text-lg font-black text-blue-600">2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
