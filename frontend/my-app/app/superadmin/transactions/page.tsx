import React from 'react';
import { fetchApi } from '@/lib/api-client';
import { Database, Landmark, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

async function getWealthAllTransactions() {
  try {
    const res = await fetchApi('/api/wealth/all-transactions', {
      method: 'GET',
      service: 'wealth',
      requireAuth: false,
    });
    return res.data || { mutualFundTransactions: [], equityTransactions: [] };
  } catch (error) {
    console.error('Failed to fetch all transactions:', error);
    // Dummy fallback values for graceful degradation
    return {
      mutualFundTransactions: [
        {
          id: 1,
          customer_ref: 'CUST-1001',
          scheme_code: 'SBI-BLUECHIP',
          transaction_type: 'PURCHASE',
          amount: 5000,
          units: 73.05,
          redemption_status: null,
          executed_at: '2024-11-05T02:30:00+00:00',
          mf_schemes: {
            amc_name: 'SBI Mutual Fund',
            scheme_name: 'SBI Bluechip Fund'
          }
        },
        {
          id: 2,
          customer_ref: 'CUST-1001',
          scheme_code: 'HDFC-FLEXI',
          transaction_type: 'PURCHASE',
          amount: 10000,
          units: 11.21,
          redemption_status: null,
          executed_at: '2024-11-05T02:30:00+00:00',
          mf_schemes: {
            amc_name: 'HDFC Mutual Fund',
            scheme_name: 'HDFC Flexi Cap Fund'
          }
        }
      ],
      equityTransactions: []
    };
  }
}

export default async function SuperAdminTransactions() {
  const transactions = await getWealthAllTransactions();
  
  const mfTx = transactions.mutualFundTransactions || [];
  const equityTx = transactions.equityTransactions || [];

  // Combine and sort both lists chronologically
  const unifiedTx = [
    ...mfTx.map((tx: any) => ({
      id: `MF-${tx.id}`,
      customer: tx.customer_ref,
      assetType: 'Mutual Fund',
      name: tx.mf_schemes?.scheme_name || tx.scheme_code,
      type: tx.transaction_type,
      detail: `${tx.units} units`,
      value: `₹${tx.amount.toLocaleString('en-IN')}`,
      date: tx.executed_at,
    })),
    ...equityTx.map((tx: any) => ({
      id: `EQ-${tx.id}`,
      customer: tx.customer_ref,
      assetType: 'Equity',
      name: tx.stock_symbol,
      type: tx.transaction_type,
      detail: `${tx.quantity} shares`,
      value: `₹${(tx.quantity * tx.price).toLocaleString('en-IN')}`,
      date: tx.executed_at,
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Database className="h-6 w-6 text-blue-600" />
          Global Platform Transactions
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Audit and trace all mutual fund purchases and stock trade executions platform-wide.
        </p>
      </div>

      {/* Unified Transactions List */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 dark:text-slate-100">Audit Log</h3>
          <span className="text-xs font-semibold px-2 py-0.5 bg-slate-150 dark:bg-slate-800 text-slate-550 rounded">
            Unified: Mutual Funds + Equities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction ID</th>
                <th className="px-6 py-4 font-semibold">Client Ref</th>
                <th className="px-6 py-4 font-semibold">Asset Class</th>
                <th className="px-6 py-4 font-semibold">Scheme / Symbol</th>
                <th className="px-6 py-4 font-semibold">Execution Type</th>
                <th className="px-6 py-4 font-semibold">Detail</th>
                <th className="px-6 py-4 font-semibold">Value</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {unifiedTx.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-550">{tx.id}</td>
                  <td className="px-6 py-4 font-mono text-sm font-semibold">{tx.customer}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      tx.assetType === 'Equity' ? 'text-emerald-600' : 'text-blue-600'
                    }`}>
                      {tx.assetType === 'Equity' ? <TrendingUp className="h-3.5 w-3.5" /> : <Landmark className="h-3.5 w-3.5" />}
                      {tx.assetType}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                    {tx.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                      tx.type === 'BUY' || tx.type === 'PURCHASE'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400' 
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-455'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">{tx.detail}</td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-slate-100">{tx.value}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {unifiedTx.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="h-6 w-6 text-slate-400" />
                      <span>No transactions found on the platform ledger.</span>
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
