'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Phone, MapPin, Building, Calendar, Shield, Save, Loader2, Camera } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function UserProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          My Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information and preferences.
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
                      {user?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-transform hover:scale-105 active:scale-95">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {user?.name}
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
                    Joined 2024
                  </Badge>
                </div>
              </div>

              <div className="mt-8 space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  {user?.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  +1 (555) 123-4567
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <div className="p-2 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  New York, NY
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
                    Update your contact details and personal information.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue={user?.name.split(' ')[0]} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue={user?.name.split(' ').slice(1).join(' ')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user?.email} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" defaultValue="123 Park Avenue, Suite 400" />
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
                  <CardTitle>Financial Profile</CardTitle>
                  <CardDescription>
                    Your regulatory and compliance information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Risk Tolerance</Label>
                      <Input value="Aggressive Growth" readOnly className="bg-slate-50 dark:bg-slate-900 text-slate-500 focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label>Investment Horizon</Label>
                      <Input value="10+ Years" readOnly className="bg-slate-50 dark:bg-slate-900 text-slate-500 focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax ID / SSN</Label>
                      <Input type="password" value="********1234" readOnly className="bg-slate-50 dark:bg-slate-900 text-slate-500 focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <Input value="Individual Brokerage" readOnly className="bg-slate-50 dark:bg-slate-900 text-slate-500 focus-visible:ring-0 cursor-not-allowed" />
                    </div>
                  </div>
                  <div className="p-4 mt-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-900/50 dark:text-amber-400 text-sm flex gap-3">
                    <Shield className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p>
                      Financial profile updates require advisor verification. Please contact your dedicated wealth advisor to modify these settings.
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
