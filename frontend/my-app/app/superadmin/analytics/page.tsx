import React from 'react';

export default function SuperAdminAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Platform Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">View overall platform usage and performance metrics.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-sm text-slate-500 dark:text-slate-400">Analytics charts will appear here.</p>
      </div>
    </div>
  );
}
