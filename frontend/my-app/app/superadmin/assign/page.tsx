'use client';

import React, { useEffect, useState } from 'react';
import { getUsers, getAdmins, getAssignments, assignUserToAdvisor, UserItem } from '@/lib/admin-actions';
import { Link2, Loader2, Save, UserCheck, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

export default function SuperAdminAssign() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [admins, setAdmins] = useState<UserItem[]>([]);
  const [assignments, setAssignments] = useState<{ investor_id: string; advisor_id: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedAdvisor, setSelectedAdvisor] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, adminsData, assignmentsData] = await Promise.all([
        getUsers(),
        getAdmins(),
        getAssignments(),
      ]);
      setUsers(usersData);
      // Filter out superadmins so we only assign clients to admins/advisors
      setAdmins(adminsData.filter((a) => a.investor_id.startsWith('ADM')));
      setAssignments(assignmentsData);
    } catch (e: any) {
      toast.error('Failed to load registry listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedAdvisor) {
      toast.error('Please select both a client and an advisor');
      return;
    }

    setSaving(true);
    try {
      const result = await assignUserToAdvisor(selectedUser, selectedAdvisor);
      if (result.success) {
        toast.success(result.message);
        // Refresh assignments list
        const updated = await getAssignments();
        setAssignments(updated);
        setSelectedUser('');
        setSelectedAdvisor('');
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to save assignment');
    } finally {
      setSaving(false);
    }
  };

  const getUserName = (id: string) => {
    const found = users.find((u) => u.investor_id === id);
    return found ? found.full_name : id;
  };

  const getAdvisorName = (id: string) => {
    const found = admins.find((a) => a.investor_id === id);
    return found ? found.full_name : id;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Link2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Assign Advisor to Client
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Map standard client user portfolios to active financial wealth advisors.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Assign Card */}
        <div className="lg:col-span-1">
          <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Create Assignment</CardTitle>
              <CardDescription>
                Link a client account with an advisor.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleAssign}>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="py-8 flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Select Client User
                      </label>
                      <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                        required
                      >
                        <option value="">-- Choose Client --</option>
                        {users.map((u) => (
                          <option key={u.investor_id} value={u.investor_id}>
                            {u.full_name} ({u.investor_id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Select Wealth Advisor
                      </label>
                      <select
                        value={selectedAdvisor}
                        onChange={(e) => setSelectedAdvisor(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                        required
                      >
                        <option value="">-- Choose Advisor --</option>
                        {admins.map((a) => (
                          <option key={a.investor_id} value={a.investor_id}>
                            {a.full_name} ({a.investor_id})
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </CardContent>
              <CardContent className="pt-0">
                <Button
                  type="submit"
                  disabled={saving || loading || !selectedUser || !selectedAdvisor}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserCheck className="h-4 w-4 mr-2" />
                  )}
                  Assign Client
                </Button>
              </CardContent>
            </form>
          </Card>
        </div>

        {/* Right Column - Assignments List */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Active Advisor mappings</CardTitle>
              <CardDescription>
                Listing of clients mapped to active financial advisors.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-500 font-medium bg-slate-50/55 dark:bg-slate-900/50">
                      <th className="py-4 px-6">Client Name (ID)</th>
                      <th className="py-4 px-6">Advisor Name (ID)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {loading ? (
                      <tr>
                        <td colSpan={2} className="py-12 text-center text-slate-500">
                          Loading assignments...
                        </td>
                      </tr>
                    ) : assignments.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-12 text-center text-slate-500">
                          No advisor assignments mapped yet.
                        </td>
                      </tr>
                    ) : (
                      assignments.map((assignment, index) => (
                        <tr
                          key={`${assignment.investor_id}-${index}`}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {getUserName(assignment.investor_id)}
                            </span>
                            <span className="font-mono text-xs text-slate-500">
                              {assignment.investor_id}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-semibold text-purple-700 dark:text-purple-400 block">
                              {getAdvisorName(assignment.advisor_id)}
                            </span>
                            <span className="font-mono text-xs text-slate-500">
                              {assignment.advisor_id}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
