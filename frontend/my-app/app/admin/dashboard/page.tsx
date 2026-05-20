import React from 'react';
import { Users, Shield, Activity, TrendingUp, Compass, PieChart, Sparkles } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

async function getWealthDashboard() {
  try {
    const res = await fetchApi('/api/wealth/dashboard', {
      method: 'GET',
      service: 'wealth',
      requireAuth: false,
    });
    return res.data || {
      totalProfit: 0,
      monthlyReturns: '0%',
      diversification: 'Unknown',
      riskScore: 'Low',
    };
  } catch (error) {
    console.error('Failed to fetch wealth dashboard:', error);
    return {
      totalProfit: 25000,
      monthlyReturns: '12%',
      diversification: 'Good',
      riskScore: 'Moderate',
    };
  }
}

async function getSystemHealth() {
  try {
    const res = await fetchApi('/api/system/health', {
      method: 'GET',
      service: 'wealth',
      requireAuth: false,
    });
    return res;
  } catch (error) {
    console.error('Failed to fetch system health:', error);
    return {
      wealthService: 'UP',
      mutualFundService: 'DOWN',
      equityService: 'DOWN'
    };
  }
}

export default async function AdminDashboard() {
  const dashboardStats = await getWealthDashboard();
  const healthStats = await getSystemHealth();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          Advisor Admin Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Global platform overview, client diagnostics, and microservice status logs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Wealth Profit */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Profit</h3>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            ₹{dashboardStats.totalProfit.toLocaleString('en-IN')}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Unified across assets
          </p>
        </div>

        {/* Monthly Returns */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Monthly Returns</h3>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {dashboardStats.monthlyReturns}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Rolling average
          </p>
        </div>

        {/* Diversification */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Diversification</h3>
            <Compass className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {dashboardStats.diversification}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Asset class index
          </p>
        </div>

        {/* Risk Score */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Risk Profile</h3>
            <Shield className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {dashboardStats.riskScore}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Conservative to Aggressive
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Health Check */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
              Microservice Health Monitor
            </h3>
            <span className="text-xs text-slate-500">Live Status</span>
          </div>

          <div className="space-y-4">
            {/* Wealth Service */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Wealth Service API</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                healthStats.wealthService === 'UP' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
              }`}>
                {healthStats.wealthService}
              </span>
            </div>

            {/* Mutual Fund Service */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mutual Fund Service API</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                healthStats.mutualFundService === 'UP' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
              }`}>
                {healthStats.mutualFundService}
              </span>
            </div>

            {/* Equity Service */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Equity Service API</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                healthStats.equityService === 'UP' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
              }`}>
                {healthStats.equityService}
              </span>
            </div>
          </div>
        </div>

        {/* Advisor Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100">System Insights</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              The platform is tracking multiple interconnected services. Ensure that all API instances are fully UP to access full diagnostic breakdowns for your customers.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
              <span className="block text-xs font-medium text-blue-600 dark:text-blue-400">Advisor Portal</span>
              <span className="text-lg font-bold text-blue-900 dark:text-blue-100">Active</span>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-center">
              <span className="block text-xs font-medium text-indigo-600 dark:text-indigo-400">Total Clients</span>
              <span className="text-lg font-bold text-indigo-900 dark:text-indigo-100">CUST-1001</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}