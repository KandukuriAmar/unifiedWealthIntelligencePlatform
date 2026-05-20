import React from 'react';
import { Activity, Server, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Platform Control Center</h1>
        <p className="text-slate-500 dark:text-slate-400">System-wide overview and infrastructure metrics.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">System Uptime</h3>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            99.99%
          </div>
          <p className="mt-1 flex items-center text-sm font-medium text-emerald-600">
            All systems operational
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Advisors</h3>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            45
          </div>
          <p className="mt-1 flex items-center text-sm font-medium text-emerald-600">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            Across 3 regions
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Security Threats</h3>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            0
          </div>
          <p className="mt-1 flex items-center text-sm font-medium text-slate-600">
            Resolved automatically
          </p>
        </div>
      </div>
    </div>
  );
}

// Re-importing Users locally for the icon
import { Users } from 'lucide-react';