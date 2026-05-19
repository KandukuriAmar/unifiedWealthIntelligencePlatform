"use client";

import React, { useState } from "react";
import Navbar from "../components/user/Navbar";
import Sidebar from "../components/user/Sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onToggleSidebar={() => setOpen(!open)} />

      <div className="flex flex-1">
        <Sidebar isOpen={open} onClose={() => setOpen(false)} />

        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}