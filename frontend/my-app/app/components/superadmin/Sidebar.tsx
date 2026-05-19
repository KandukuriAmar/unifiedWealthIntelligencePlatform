"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, UserPlus,
  UserCheck, FileSpreadsheet, Settings
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuperadminSidebar({ isOpen, onClose }: Props) {
  const router = useRouter();

  const go = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <aside className={`fixed top-16 left-0 w-64 h-full bg-white border-r transition
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

      <div className="p-4 font-bold">Menu</div>

      <div className="px-3 text-xs text-gray-400">OVERVIEW</div>
      <button onClick={() => go("/superadmin/dashboard")} className="nav">
        <LayoutDashboard /> Dashboard
      </button>

      <div className="px-3 text-xs text-gray-400 mt-4">USERS</div>
      <button onClick={() => go("/superadmin/users")} className="nav"><Users /> Users</button>
      <button onClick={() => go("/superadmin/admins")} className="nav"><Users /> Admins</button>
      <button onClick={() => go("/superadmin/create-user")} className="nav"><UserPlus /> Create User</button>
      <button onClick={() => go("/superadmin/create-admin")} className="nav"><UserPlus /> Create Admin</button>

      <div className="px-3 text-xs text-gray-400 mt-4">OPERATIONS</div>
      <button onClick={() => go("/superadmin/assign")} className="nav"><UserCheck /> Assign</button>
      <button onClick={() => go("/superadmin/transactions")} className="nav"><FileSpreadsheet /> Transactions</button>

      <div className="px-3 text-xs text-gray-400 mt-4">SYSTEM</div>
      <button onClick={() => go("/superadmin/logs")} className="nav"><Settings /> Logs</button>

      <div className="mt-auto p-3">
        <button onClick={() => router.push("/login")} className="text-red-500 w-full">
          Logout
        </button>
      </div>
    </aside>
  );
}