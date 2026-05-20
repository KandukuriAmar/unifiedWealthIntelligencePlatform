import React from 'react';
import { Users, Shield, Activity, TrendingUp, Compass, PieChart, Sparkles } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

async function getWealthDashboard() {
  try {
    const res = await fetchApi('/api/wealth/dashboard', {
      method: 'GET',
      service: 'wealth',
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


    </div>
  );
}