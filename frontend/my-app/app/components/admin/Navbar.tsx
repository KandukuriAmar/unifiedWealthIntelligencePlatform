"use client";

import React from "react";
import { Menu, Bell, User } from "lucide-react";

interface Props {
  onToggleSidebar: () => void;
}

export default function AdminNavbar({ onToggleSidebar }: Props) {
  return (
    <header className="h-16 border-b bg-white px-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="p-2 lg:hidden">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-bold">Admin Panel</span>
      </div>

      <div className="flex gap-4 items-center">
        <Bell className="h-5 w-5 text-gray-500" />
        <User className="h-5 w-5 text-gray-500" />
      </div>
    </header>
  );
}