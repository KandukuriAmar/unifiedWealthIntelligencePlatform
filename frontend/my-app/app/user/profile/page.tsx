'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/lib/auth-actions';
import { Mail, Shield, Save, Loader2, Camera, ShieldCheck } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function UserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [dematAccount, setDematAccount] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPanNumber((user as any).pan_number || '');
      setDematAccount((user as any).demat_account || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error('Name and Email are required');
      return;
    }
    setLoading(true);
    const result = await updateProfile({
      full_name: fullName,
      email,
      pan_number: panNumber,
      demat_account: dematAccount,
    });
    setLoading(false);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          My Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information and financial account preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl">
                      {fullName ? fullName.substring(0, 2).toUpperCase() : 'US'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {fullName || 'Loading...'}
                  </h2>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    Premium Client
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
                    Active
                  </Badge>
                  <Badge variant="outline" className="text-slate-500 border-slate-200 dark:border-slate-700">
                    ID: {user?.id}
                  </Badge>
                </div>
              </div>

              <div className="mt-8 space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  {email || 'Loading...'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="xl:col-span-2">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl">
              <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                Personal Info
              </TabsTrigger>
              <TabsTrigger value="financial" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                Financial Profile
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your contact details and identity information stored in our database.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          placeholder="e.g. Rahul Sharma" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="e.g. rahul@example.com" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="panNumber">PAN Number</Label>
                        <Input 
                          id="panNumber" 
                          value={panNumber} 
                          onChange={(e) => setPanNumber(e.target.value)} 
                          placeholder="e.g. ABCDE1234F" 
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="dematAccount">Demat Account Number</Label>
                        <Input 
                          id="dematAccount" 
                          value={dematAccount} 
                          onChange={(e) => setDematAccount(e.target.value)} 
                          placeholder="e.g. 1201234512345678" 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="financial" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Financial Profile & Demat</CardTitle>
                  <CardDescription>
                    Your regulatory and compliance information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Investor ID</Label>
                      <Input value={user?.id || ''} readOnly className="bg-slate-50 dark:bg-slate-900 text-slate-500 focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label>PAN Status</Label>
                      <Input value="Verified" readOnly className="bg-slate-50 dark:bg-slate-900 text-slate-500 focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label>Demat Status</Label>
                      <Input value="Connected" readOnly className="bg-slate-50 dark:bg-slate-900 text-slate-500 focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <Input value="Individual Brokerage" readOnly className="bg-slate-50 dark:bg-slate-900 text-slate-500 focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="p-4 mt-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400 text-sm flex gap-3">
                    <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p>
                      Verification profile updates require compliance review. Please contact your administrator or advisor to request changes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
