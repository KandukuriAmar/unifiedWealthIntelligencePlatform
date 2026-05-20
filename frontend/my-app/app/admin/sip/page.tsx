'use client';

import React, { useEffect, useState } from 'react';
import { Repeat, Calendar, CheckCircle2, AlertTriangle, Play, Pause, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { getAssignments, getAllAdminSips } from '@/lib/admin-actions';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function AdminSIP() {
  const [activeSips, setActiveSips] = useState<any[]>([]);
  const [failedSips, setFailedSips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const assignments = await getAssignments();
      const myAssignedUserIds = assignments
        .filter(a => a.advisor_id === user.id)
        .map(a => a.investor_id);

      const allData = await getAllAdminSips();
      
      const allSips = allData || [];

      // Filter active SIPs for assigned users
      const assignedActiveSips = allSips.filter((sip: any) => 
        myAssignedUserIds.includes(sip.customer_ref) && sip.sip_status === 'ACTIVE'
      );

      // We still might want to show global failed SIPs, but it's better to filter them for this admin's users
      const assignedFailedSips = allSips.filter((sip: any) => 
        myAssignedUserIds.includes(sip.customer_ref) && sip.sip_status !== 'ACTIVE'
      );

      setActiveSips(assignedActiveSips);
      setFailedSips(assignedFailedSips);
    } catch (error) {
      console.error('Failed to fetch SIP data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Repeat className="h-6 w-6 text-emerald-600" />
            Systematic Investment Plans (SIP)
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Track recurring mutual fund schedules, active portfolios, and paused or cancelled configurations.
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

      {/* Grid of Tables */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {/* Active SIPs */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/20 dark:bg-emerald-950/20 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Active SIP Schedules
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-450 rounded-full">
              Assigned Clients
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Client / Scheme</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Next Due</th>
                  <th className="px-4 py-3 font-semibold">Start Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-500 mb-2" />
                      Loading active SIPs...
                    </td>
                  </tr>
                ) : activeSips.map((sip: any) => (
                  <tr key={sip.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block font-mono">
                        {sip.customer_ref}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white block">
                        {sip.mf_schemes?.scheme_name || sip.scheme_code}
                      </span>
                      <span className="text-xs text-slate-550 dark:text-slate-500 uppercase">{sip.scheme_code}</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                      ₹{sip.sip_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-slate-650 dark:text-slate-350">
                      {sip.next_due_date ? new Date(sip.next_due_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(sip.start_date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {!loading && activeSips.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No active SIPs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Failed / Paused / Cancelled SIPs */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-rose-50/20 dark:bg-rose-950/20 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-600 animate-pulse" />
              Failed & Paused SIP Alerts
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-455 rounded-full">
              Assigned Clients
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Client / Scheme</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">AMC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-rose-500 mb-2" />
                      Loading SIP alerts...
                    </td>
                  </tr>
                ) : failedSips.map((sip: any) => (
                  <tr key={sip.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block font-mono">
                        {sip.customer_ref}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white block text-sm">
                        {sip.mf_schemes?.scheme_name || sip.scheme_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                      ₹{sip.sip_amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        sip.sip_status === 'PAUSED'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-455'
                      }`}>
                        {sip.sip_status === 'PAUSED' ? <Pause className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {sip.sip_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {sip.mf_schemes?.amc_name || 'N/A'}
                    </td>
                  </tr>
                ))}
                {!loading && failedSips.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                      No failed or paused SIP alerts detected.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
