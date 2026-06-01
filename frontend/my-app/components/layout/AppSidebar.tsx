'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  ShieldAlert,
  LogOut,
  Wallet,
  UserPlus,
  ShieldCheck,
  ClipboardList,
  UserCheck,
  FileSpreadsheet,
  User,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/lib/auth-actions';
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

// Define the navigation items for each role
const NAV_ITEMS: Record<string, NavGroup[]> = {
  user: [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      label: 'PORTFOLIO',
      items: [
        { name: 'Portfolio', href: '/user/portfolio', icon: Wallet },
        { name: 'Breakdown', href: '/user/breakdown', icon: BarChart3 },
      ]
    },
    {
      label: 'ACTIVITY',
      items: [
        { name: 'Transactions', href: '/user/transactions', icon: FileSpreadsheet },
      ]
    },
    {
      label: 'ACCOUNT',
      items: [
        { name: 'Profile', href: '/user/profile', icon: User },
        
      ]
    }
  ],
  admin: [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      label: 'INVESTORS',
      items: [
        { name: 'My Investors', href: '/admin/users', icon: Users },
      ]
    },
    {
      label: 'DATA',
      items: [
        { name: 'Equity', href: '/admin/equity', icon: BarChart3 },
        { name: 'SIP', href: '/admin/sip', icon: Activity },
        { name: 'Wealth', href: '/admin/wealth', icon: Wallet },
      ]
    },
    {
      label: 'ACCOUNT',
      items: [
        { name: 'Profile', href: '/admin/profile', icon: User },
      ]
    }
  ],
  superadmin: [
    {
      label: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/superadmin/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      label: 'USERS',
      items: [
        { name: 'Users', href: '/superadmin/users', icon: Users },
        { name: 'Admins', href: '/superadmin/admins', icon: ShieldCheck },
        { name: 'Create User', href: '/superadmin/create-user', icon: UserPlus },
        { name: 'Create Admin', href: '/superadmin/create-admin', icon: UserPlus },
      ]
    },

    {
      label: 'OPERATIONS',
      items: [
        { name: 'Assign Clients', href: '/superadmin/assign', icon: UserCheck },
      ]
    },
    
    {
      label: 'ACCOUNT',
      items: [
        { name: 'Profile', href: '/superadmin/profile', icon: User },
      ]
    }
  ],
};

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user || !user.role) return null;

  const groups = NAV_ITEMS[user.role] || [];

  return (
    <aside className="flex h-full w-64 min-w-64 flex-col bg-white border-r text-slate-800 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-100 transition-transform duration-300">
      <div className="flex h-16 items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <Wallet className="mr-2 h-6 w-6 text-blue-600 dark:text-blue-500" />
        <span className="text-xl font-bold tracking-tight">Wealth UI</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-start gap-1">
        {groups.map((group, index) => (
          <div key={group.label} className={cn("w-full", index > 0 && "mt-6")}>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mb-2 px-3 uppercase tracking-wider">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap w-full",
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    )}
                  >
                    <Icon className={cn("mr-3 h-5 w-5 flex-shrink-0", isActive ? "text-blue-700 dark:text-blue-400" : "text-slate-500 dark:text-slate-400")} />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 p-4">
        <div className="flex items-center gap-3 px-2 mb-4">
          <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700">
            <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold">
              {user.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-medium truncate">{user.name}</span>
            <span className="text-xs text-slate-500 truncate capitalize">{user.role}</span>
          </div>
        </div>
        <button
          onClick={() => logout()}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors whitespace-nowrap"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
