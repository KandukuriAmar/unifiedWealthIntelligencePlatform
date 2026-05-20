'use client';

import React, { useState } from 'react';
import { createUser } from '@/lib/admin-actions';
import { UserPlus, Loader2, Save, ArrowLeft } from 'lucide-react';
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

export default function SuperAdminCreateUser() {
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [dematAccount, setDematAccount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !panNumber || !dematAccount) {
      toast.error('All fields are required');
      return;
    }

    setLoading(true);
    try {
      const result = await createUser({
        full_name: fullName,
        email,
        password,
        pan_number: panNumber,
        demat_account: dematAccount,
      });

      if (result.success) {
        toast.success(result.message);
        // Clear fields
        setFullName('');
        setEmail('');
        setPassword('');
        setPanNumber('');
        setDematAccount('');
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to register client user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/superadmin/users">
          <Button variant="outline" size="icon" className="border-slate-200 dark:border-slate-800 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Onboard New Client
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Register a standard user account directly in the Supabase database.
          </p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
          <CardDescription>
            Provide contact and investment account identification for regulatory compliance.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 bg-white dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number</Label>
                <Input
                  id="panNumber"
                  placeholder="e.g. ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  required
                  className="border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 bg-white dark:bg-slate-900 font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dematAccount">Demat Account Number</Label>
                <Input
                  id="dematAccount"
                  placeholder="e.g. 1201234512345678"
                  value={dematAccount}
                  onChange={(e) => setDematAccount(e.target.value)}
                  required
                  className="border-slate-200 dark:border-slate-800 focus-visible:ring-blue-500 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Register Client
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
