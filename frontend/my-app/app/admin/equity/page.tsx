'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, AlertCircle, ShieldAlert, CheckCircle, Database, Loader2, RefreshCw } from 'lucide-react';
import { getAssignments, getAllAdminTransactions } from '@/lib/admin-actions';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function AdminEquity() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEquityServiceUp, setIsEquityServiceUp] = useState(true);
  const { user } = useAuth();

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const assignments = await getAssignments();
      const myAssignedUserIds = assignments
        .filter(a => a.advisor_id === user.id)
        .map(a => a.investor_id);

      const allTransactions = await getAllAdminTransactions();
      
      const assignedTransactions = allTransactions.filter((tx: any) => 
        myAssignedUserIds.includes(tx.investor_id)
      );
      
      setTransactions(assignedTransactions);
      setIsEquityServiceUp(true);
    } catch (error) {
      console.error('Failed to fetch admin transactions:', error);
      setIsEquityServiceUp(false);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Equity Transaction Feed
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Supervise global equity stock trades and client order executions.
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

      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isEquityServiceUp 
          ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900' 
          : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900'
      }`}>
        {isEquityServiceUp ? (
          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
        ) : (
          <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
        )}
        <div>
          <h4 className={`text-sm font-bold ${isEquityServiceUp ? 'text-emerald-800 dark:text-emerald-400' : 'text-amber-800 dark:text-amber-400'}`}>
            Equity Microservice Connectivity: {isEquityServiceUp ? 'UP' : 'DOWN'}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {isEquityServiceUp 
              ? 'The equity gateway is online. Live market transaction streaming and client order executions are active.' 
              : 'The equity service is currently offline. Viewing historic logs and cache files. Re-run local service instances to sync live.'
            }
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-500" />
            Assigned Clients' Equity Ledger
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-150 dark:bg-slate-800 text-slate-550 rounded">
            Filtered: Equity Only
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Client Ref</th>
                <th className="px-6 py-4 font-semibold">Symbol</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Quantity</th>
                <th className="px-6 py-4 font-semibold">Execution Price</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-500 mb-2" />
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{tx.id}</td>
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-350">{tx.investor_id}</td>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white uppercase">{tx.stock_symbol}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      tx.transaction_type === 'BUY' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' 
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-455'
                    }`}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">{tx.quantity}</td>
                  <td className="px-6 py-4 font-mono">₹{tx.price.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(tx.executed_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!loading && transactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-6 w-6 text-slate-400" />
                      <span>No equity ledger transactions found in the pipeline.</span>
                    </div>
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
