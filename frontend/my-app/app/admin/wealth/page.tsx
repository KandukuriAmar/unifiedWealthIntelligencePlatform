'use client';

import React, { useEffect, useState } from 'react';
import { Layers, Wallet, LineChart, Shield, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { getAssignments, getAllAdminPortfolioFunds, getAllAdminHoldings } from '@/lib/admin-actions';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function AdminWealth() {
  const [mutualFunds, setMutualFunds] = useState<any[]>([]);
  const [equityHoldings, setEquityHoldings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [mfServiceStatus, setMfServiceStatus] = useState<'UP' | 'DOWN'>('UP');
  const [equityServiceStatus, setEquityServiceStatus] = useState<'UP' | 'DOWN'>('UP');
  
  const { user } = useAuth();

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    
    let allFunds = [];
    let allHoldings = [];
    
    try {
      const assignments = await getAssignments();
      const myAssignedUserIds = assignments
        .filter(a => a.advisor_id === user.id)
        .map(a => a.investor_id);

      // Fetch all MF Funds
      try {
        allFunds = await getAllAdminPortfolioFunds();
        setMfServiceStatus('UP');
      } catch (err) {
        console.error('Failed to fetch MF admin portfolio:', err);
        setMfServiceStatus('DOWN');
      }

      // Fetch all Equity Holdings
      try {
        allHoldings = await getAllAdminHoldings();
        setEquityServiceStatus('UP');
      } catch (err) {
        console.error('Failed to fetch Equity admin holdings:', err);
        setEquityServiceStatus('DOWN');
      }

      // Filter for assigned users
      const assignedFunds = allFunds.filter((fund: any) => 
        myAssignedUserIds.includes(fund.customer_ref)
      );
      
      const assignedHoldings = allHoldings.filter((holding: any) => 
        myAssignedUserIds.includes(holding.investor_id)
      );

      setMutualFunds(assignedFunds);
      setEquityHoldings(assignedHoldings);
      
    } catch (error) {
      console.error('Failed to load wealth data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Calculate summaries
  const mfTotalInvestment = mutualFunds.reduce((sum, fund) => sum + Number(fund.invested_amount || 0), 0);
  const mfTotalCurrentValue = mutualFunds.reduce((sum, fund) => sum + Number(fund.current_value || 0), 0);
  const mfProfit = mfTotalCurrentValue - mfTotalInvestment;

  const eqTotalValue = equityHoldings.reduce((sum, holding) => {
    return sum + (Number(holding.quantity) * Number(holding.current_market_price));
  }, 0);

  const totalWealth = mfTotalCurrentValue + eqTotalValue;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-600" />
            Wealth Portfolio Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Consolidated client holdings, mutual funds portfolio breakdown, and asset valuation trackers.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadData}
          disabled={loading}
          className="border-slate-200 dark:border-slate-800 self-start sm:self-center"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
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
            {loading ? (
              <span className="text-slate-300">...</span>
            ) : (
              `₹${totalWealth.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Aggregated client funds (Assigned clients only)
          </p>
        </div>

        {/* Mutual Funds Managed */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Mutual Funds Allocation</h3>
            <LineChart className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {loading ? (
              <span className="text-slate-300">...</span>
            ) : (
              `₹${mfTotalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
            )}
          </div>
          <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1 font-semibold">
            Profit: ₹{mfProfit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>

        {/* Equity Allocation */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Equity Allocation</h3>
            <Shield className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {loading ? (
              <span className="text-slate-300">...</span>
            ) : (
              `₹${eqTotalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
            )}
          </div>
          <p className="mt-1 text-xs flex items-center gap-1">
            Service status:{' '}
            <span className={`inline-flex items-center font-bold gap-0.5 ${
              equityServiceStatus === 'UP' ? 'text-emerald-600' : 'text-rose-600'
            }`}>
              {equityServiceStatus === 'UP' ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {equityServiceStatus}
            </span>
          </p>
        </div>
      </div>

      {/* Mutual Funds Holdings Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">Mutual Fund Schemes</h2>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-full">
            Assigned Clients
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Client Ref</th>
                <th className="px-6 py-4 font-semibold">Scheme Code</th>
                <th className="px-6 py-4 font-semibold">AMC</th>
                <th className="px-6 py-4 font-semibold">Units</th>
                <th className="px-6 py-4 font-semibold">NAV Value</th>
                <th className="px-6 py-4 font-semibold">Invested Amt</th>
                <th className="px-6 py-4 font-semibold">Current Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-indigo-500 mb-2" />
                    Loading mutual fund holdings...
                  </td>
                </tr>
              ) : mutualFunds.map((fund: any) => (
                <tr key={fund.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350">
                    {fund.customer_ref}
                  </td>
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
                  <td className="px-6 py-4 font-mono">₹{Number(fund.invested_amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                    ₹{Number(fund.current_value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {!loading && mutualFunds.length === 0 && (
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
      
      {/* Equity Holdings Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 dark:text-slate-100">Equity Holdings</h2>
          <span className="text-xs font-semibold px-2 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-full">
            Assigned Clients
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Client Ref</th>
                <th className="px-6 py-4 font-semibold">Stock Symbol</th>
                <th className="px-6 py-4 font-semibold">Exchange</th>
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold">Avg Buy Price</th>
                <th className="px-6 py-4 font-semibold">Current Price</th>
                <th className="px-6 py-4 font-semibold">Current Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500 mb-2" />
                    Loading equity holdings...
                  </td>
                </tr>
              ) : equityHoldings.map((holding: any) => (
                <tr key={holding.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350">
                    {holding.investor_id}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white uppercase">
                    {holding.stock_symbol}
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-350">
                    {holding.exchange || 'NSE'}
                  </td>
                  <td className="px-6 py-4 font-mono">{holding.quantity}</td>
                  <td className="px-6 py-4 font-mono">₹{Number(holding.avg_buy_price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 font-mono">₹{Number(holding.current_market_price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4 font-semibold text-blue-600 dark:text-blue-400 font-mono">
                    ₹{(Number(holding.quantity) * Number(holding.current_market_price)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
              {!loading && equityHoldings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No equity holdings found.
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
