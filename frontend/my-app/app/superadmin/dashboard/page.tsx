
'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, Users, UserCog, Loader2 } from 'lucide-react';
import { getUsers, getAdmins } from '@/lib/admin-actions';

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allUsers, allAdmins] = await Promise.all([
          getUsers(),
          getAdmins(),
        ]);

        console.log('Users:', allUsers);
        console.log('Admins:', allAdmins);

        setUsers(allUsers || []);
        setAdmins(allAdmins || []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalUsers = users.length;
  const totalAdmins = admins.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Platform Control Center
        </h1>

        <p className="text-slate-500 dark:text-slate-400">
          System-wide overview and infrastructure metrics.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Investors
            </h3>

            <Users className="h-4 w-4 text-blue-500" />
          </div>

          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            ) : (
              totalUsers
            )}
          </div>

          <p className="mt-1 flex items-center text-sm font-medium text-slate-600">
            Registered on platform
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Active Advisors / Admins
            </h3>

            <UserCog className="h-4 w-4 text-indigo-500" />
          </div>

          <div className="mt-4 flex items-baseline text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            ) : (
              totalAdmins
            )}
          </div>

          <p className="mt-1 flex items-center text-sm font-medium text-slate-600">
            Managing client portfolios
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Security Threats
            </h3>

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
