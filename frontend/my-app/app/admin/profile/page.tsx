'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/lib/auth-actions';
import { Mail, Shield, Save, Loader2, Briefcase } from 'lucide-react';
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

export default function AdminProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      toast.error('Name and Email are required');
      return;
    }
    setLoading(true);
    // Since admins only update name and email, we pass empty/existing PAN/Demat
    const result = await updateProfile({
      full_name: fullName,
      email,
      pan_number: 'SYSTEMPAN',
      demat_account: 'SYSTEMDMAT',
    });
    setLoading(false);
    if (result.success) {
      toast.success('Advisor profile updated successfully');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Advisor Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your advisor details and firm information.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-4xl">
                      {fullName ? fullName.substring(0, 2).toUpperCase() : 'AD'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {fullName || 'Loading...'}
                  </h2>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center justify-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    Senior Wealth Advisor
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
                    Active License
                  </Badge>
                  <Badge variant="outline" className="text-slate-500 border-slate-200 dark:border-slate-700">
                    ID: {user?.id}
                  </Badge>
                </div>
              </div>

              <div className="mt-8 space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  {email || 'Loading...'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Tabs defaultValue="professional" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl">
              <TabsTrigger value="professional" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                Professional Info
              </TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                Security & Access
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="professional" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>
                    Update your advisor directory profile.
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
                          placeholder="e.g. Arjun Mehta" 
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Work Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="e.g. arjun@example.com" 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
                    <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20 transition-all active:scale-95">
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
            
            <TabsContent value="security" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Security & Compliance</CardTitle>
                  <CardDescription>
                    Your platform access and compliance status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Access Level</Label>
                      <Input value="Tier 2 (Advisor)" readOnly className="bg-slate-50 dark:bg-slate-900 text-slate-500 focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Compliance Training</Label>
                      <Input value="October 12, 2024" readOnly className="bg-slate-50 dark:bg-slate-900 text-slate-500 focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="p-4 mt-6 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400 text-sm flex gap-3">
                    <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p>
                      Your permissions are actively managed by the platform administrators. Ensure your 2FA devices are up to date.
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
