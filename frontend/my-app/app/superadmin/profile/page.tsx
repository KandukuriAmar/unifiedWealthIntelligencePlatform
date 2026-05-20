'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { updateProfile } from '@/lib/auth-actions';
import { Mail, Server, ShieldCheck, Save, Loader2, Star } from 'lucide-react';
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

export default function SuperAdminProfile() {
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
    const result = await updateProfile({
      full_name: fullName,
      email,
      pan_number: 'SYSTEMPAN',
      demat_account: 'SYSTEMDMAT',
    });
    setLoading(false);
    if (result.success) {
      toast.success('Superadmin details updated');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Superadmin Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage system-level access and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <Avatar className="h-32 w-32 border-4 border-white dark:border-slate-900 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-br from-rose-500 to-orange-600 text-white text-4xl">
                      {fullName ? fullName.substring(0, 2).toUpperCase() : 'SU'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {fullName || 'Loading...'}
                  </h2>
                  <p className="text-sm font-medium text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1.5">
                    <Star className="h-4 w-4" />
                    Platform Owner
                  </p>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  
                  <Badge variant="outline" className="text-slate-500 border-slate-200 dark:border-slate-700">
                    ID: {user?.id}
                  </Badge>
                </div>
              </div>

              <div className="mt-8 space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  {email || 'Loading...'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Tabs defaultValue="system" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md rounded-xl">
              <TabsTrigger value="system" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                System Credentials
              </TabsTrigger>
              <TabsTrigger value="audit" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800">
                Audit Log
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="system" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>System Credentials</CardTitle>
                  <CardDescription>
                    Update your root access information.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name">Display Name</Label>
                        <Input 
                          id="name" 
                          value={fullName} 
                          onChange={(e) => setFullName(e.target.value)} 
                          placeholder="e.g. System Administrator" 
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="email">Root Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="e.g. superadmin@app.com" 
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end border-t border-slate-100 dark:border-slate-800 pt-6">
                    <Button type="submit" disabled={loading} className="bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 transition-all active:scale-95">
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Configuration
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="audit" className="mt-6 focus-visible:outline-none focus-visible:ring-0">
              <Card className="border-slate-200 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Authentication Activity</CardTitle>
                  <CardDescription>
                    Your recent logins and security events.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="text-sm font-medium">Successful Login</p>
                          <p className="text-xs text-slate-500">127.0.0.1 (Localhost)</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">Just Now</p>
                    </div>
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
