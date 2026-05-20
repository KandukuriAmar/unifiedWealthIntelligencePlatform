'use client';

import React, { useEffect, useState } from 'react';
import { getAdmins, UserItem } from '@/lib/admin-actions';
import { Search, Loader2, ShieldCheck, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SuperAdminAdmins() {
  const [admins, setAdmins] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (e: any) {
      toast.error('Failed to load admins list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const filteredAdmins = admins.filter(
    (a) =>
      a.investor_id.startsWith('ADM') &&
      (a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       a.investor_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ShieldCheck className="h-8 w-8 text-rose-600 dark:text-rose-400" />
            Admins & Advisors
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Browse and manage administrator and financial advisor accounts.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadAdmins}
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

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search admins by name, email, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm"
          />
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle>Advisor Registry</CardTitle>
          <CardDescription>
            Showing {filteredAdmins.length} of {admins.length} administrators and advisors in the system.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-medium bg-slate-50/55 dark:bg-slate-900/50">
                  <th className="py-4 px-6">ID / Code</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Role / Type</th>
                  <th className="py-4 px-6 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
                        <span>Fetching database records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      No administrative users found.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((a) => {
                    const isSuper = a.investor_id.startsWith('SUP');
                    return (
                      <tr
                        key={a.investor_id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {a.investor_id}
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-900 dark:text-white">
                          {a.full_name}
                        </td>
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                          {a.email}
                        </td>
                        <td className="py-4 px-6">
                          <Badge
                            variant="secondary"
                            className={
                              isSuper
                                ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 font-semibold'
                                : 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 font-semibold'
                            }
                          >
                            {isSuper ? 'SUPERADMIN' : 'ADMIN / ADVISOR'}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right text-slate-500">
                          {new Date(a.created_at || Date.now()).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
