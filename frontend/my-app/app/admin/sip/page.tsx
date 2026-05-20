import React from 'react';
import { fetchApi } from '@/lib/api-client';
import { Repeat, Calendar, CheckCircle2, AlertTriangle, Play, Pause, XCircle } from 'lucide-react';

async function getMutualFundSips(customerRef: string = 'CUST-1001') {
  try {
    const res = await fetchApi(`/api/mf/sips/${customerRef}`, {
      method: 'GET',
      service: 'mutualFund',
      requireAuth: false,
    });
    return res.sips || [];
  } catch (error) {
    console.error(`Failed to fetch SIPs for ${customerRef}:`, error);
    // Return dummy data fallback
    return [
      {
        id: 1,
        customer_ref: customerRef,
        scheme_code: 'SBI-BLUECHIP',
        sip_amount: 5000,
        sip_status: 'ACTIVE',
        start_date: '2023-06-01',
        next_due_date: '2024-12-05',
        mf_schemes: {
          amc_name: 'SBI Mutual Fund',
          nav_date: '2024-12-01',
          nav_value: 68.4521,
          scheme_code: 'SBI-BLUECHIP',
          scheme_name: 'SBI Bluechip Fund',
          fund_category: 'Large Cap',
          risk_category: 'Moderate'
        }
      },
      {
        id: 2,
        customer_ref: customerRef,
        scheme_code: 'MIRAE-LARGECAP',
        sip_amount: 3000,
        sip_status: 'ACTIVE',
        start_date: '2024-01-01',
        next_due_date: '2024-12-05',
        mf_schemes: {
          amc_name: 'Mirae Asset',
          nav_date: '2024-12-01',
          nav_value: 112.89,
          scheme_code: 'MIRAE-LARGECAP',
          scheme_name: 'Mirae Asset Large Cap Fund',
          fund_category: 'Large Cap',
          risk_category: 'Moderate'
        }
      }
    ];
  }
}

async function getMutualFundFailedSips() {
  try {
    const res = await fetchApi('/api/mf/failed-sips', {
      method: 'GET',
      service: 'mutualFund',
      requireAuth: false,
    });
    return res.failedSips || [];
  } catch (error) {
    console.error('Failed to fetch failed SIPs:', error);
    // Return dummy data fallback
    return [
      {
        id: 3,
        customer_ref: 'CUST-1002',
        scheme_code: 'AXIS-SMALLCAP',
        sip_amount: 2500,
        sip_status: 'PAUSED',
        start_date: '2023-09-01',
        next_due_date: null,
        mf_schemes: {
          amc_name: 'Axis Mutual Fund',
          nav_date: '2024-12-01',
          nav_value: 95.231,
          scheme_code: 'AXIS-SMALLCAP',
          scheme_name: 'Axis Small Cap Fund',
          fund_category: 'Small Cap',
          risk_category: 'Very High'
        }
      },
      {
        id: 5,
        customer_ref: 'CUST-1004',
        scheme_code: 'NIPPON-GROWTH',
        sip_amount: 2000,
        sip_status: 'CANCELLED',
        start_date: '2023-11-20',
        next_due_date: null,
        mf_schemes: {
          amc_name: 'Nippon India',
          nav_date: '2024-12-01',
          nav_value: 312.45,
          scheme_code: 'NIPPON-GROWTH',
          scheme_name: 'Nippon India Growth Fund',
          fund_category: 'Mid Cap',
          risk_category: 'High'
        }
      }
    ];
  }
}

export default async function AdminSIP() {
  const activeSips = await getMutualFundSips('CUST-1001');
  const failedSips = await getMutualFundFailedSips();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Repeat className="h-6 w-6 text-emerald-600" />
          Systematic Investment Plans (SIP)
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Track recurring mutual fund schedules, active portfolios, and paused or cancelled configurations.
        </p>
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
              Client: CUST-1001
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3 font-semibold">Scheme</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Next Due</th>
                  <th className="px-4 py-3 font-semibold">Start Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {activeSips.map((sip: any) => (
                  <tr key={sip.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-4 py-3">
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
                {activeSips.length === 0 && (
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
              Global Platform Alerts
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
                {failedSips.map((sip: any) => (
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
                {failedSips.length === 0 && (
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
