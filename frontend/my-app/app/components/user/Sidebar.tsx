"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Wallet,
  BarChart3, FileSpreadsheet, User
} from "lucide-react";

interface Props {
  isOpen: boolean;
}

export default function UserSidebar({ isOpen }: Props) {
  const router = useRouter();

  return (
    <aside className={`fixed top-16 left-0 w-64 h-full bg-white border-r transition
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>

      <div className="p-4 font-bold">Menu</div>

      <div className="px-3 text-xs text-gray-400">OVERVIEW</div>
      <button onClick={() => router.push("/user/dashboard")} className="nav">
        <LayoutDashboard /> Dashboard
      </button>

      <div className="px-3 text-xs text-gray-400 mt-4">PORTFOLIO</div>
      <button onClick={() => router.push("/user/portfolio")} className="nav"><Wallet /> Portfolio</button>
      <button onClick={() => router.push("/user/breakdown")} className="nav"><BarChart3 /> Breakdown</button>

      <div className="px-3 text-xs text-gray-400 mt-4">ACTIVITY</div>
      <button onClick={() => router.push("/user/transactions")} className="nav"><FileSpreadsheet /> Transactions</button>

      <div className="px-3 text-xs text-gray-400 mt-4">ACCOUNT</div>
      <button onClick={() => router.push("/user/profile")} className="nav"><User /> Profile</button>

      <div className="mt-auto p-3">
        <button onClick={() => router.push("/login")} className="text-red-500 w-full">
          Logout
        </button>
      </div>
    </aside>
  );
}