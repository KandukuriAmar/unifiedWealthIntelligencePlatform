"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, BarChart3,
  Activity, Wallet
} from "lucide-react";

interface Props {
  isOpen: boolean;
}

export default function AdminSidebar({ isOpen }: Props) {
  const router = useRouter();

  return (
    <aside className={`fixed top-16 left-0 w-64 h-full bg-white border-r transition
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

      <div className="p-4 font-bold">Menu</div>

      <div className="px-3 text-xs text-gray-400">OVERVIEW</div>
      <button onClick={() => router.push("/admin/dashboard")} className="nav">
        <LayoutDashboard /> Dashboard
      </button>

      <div className="px-3 text-xs text-gray-400 mt-4">INVESTORS</div>
      <button onClick={() => router.push("/admin/users")} className="nav">
        <Users /> My Investors
      </button>

      <div className="px-3 text-xs text-gray-400 mt-4">DATA</div>
      <button onClick={() => router.push("/admin/equity")} className="nav"><BarChart3 /> Equity</button>
      <button onClick={() => router.push("/admin/sip")} className="nav"><Activity /> SIP</button>
      <button onClick={() => router.push("/admin/wealth")} className="nav"><Wallet /> Wealth</button>

      <div className="mt-auto p-3">
        <button onClick={() => router.push("/login")} className="text-red-500 w-full">
          Logout
        </button>
      </div>
    </aside>
  );
}