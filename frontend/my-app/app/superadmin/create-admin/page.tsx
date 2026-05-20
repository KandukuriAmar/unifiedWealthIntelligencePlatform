'use client';

import React, { useState } from 'react';
import { createAdmin } from '@/lib/admin-actions';
import { ShieldAlert, Loader2, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

export default function SuperAdminCreateAdmin() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const result = await createAdmin({
        full_name: fullName,
        email,
        password,
        pan_number: 'SYSTEMPAN',
        demat_account: 'SYSTEMDMAT',
      });

      if (result.success) {
        toast.success(result.message);
        // Clear fields
        setFullName('');
        setEmail('');
        setPassword('');
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to register admin/advisor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/superadmin/admins">
          <Button variant="outline" size="icon" className="border-slate-200 dark:border-slate-800 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-rose-600 dark:text-rose-400" />
            Onboard New Advisor
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Register a firm administrator or advisor in the database.
          </p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Advisor Profile Credentials</CardTitle>
          <CardDescription>
            Register their name and credentials. A unique ADM... identifier will be generated.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="e.g. Arjun Mehta"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Work Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. arjun@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Login Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-200 dark:border-slate-800 focus-visible:ring-rose-500 bg-white dark:bg-slate-900"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Register Advisor
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
