"use client";
import React from 'react';
import { LayoutDashboard, Zap, Package, Users, Building2, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Insights', icon: LayoutDashboard, href: '/' },
  { label: 'Daily Ops', icon: Zap, href: '/ops' },
  { label: 'Orders', icon: Package, href: '/orders' },
  { label: 'People', icon: Users, href: '/people' },
  { label: 'Inventory', icon: Building2, href: '/inventory' },
  { label: 'Master Data', icon: Settings, href: '/master' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight">PITARA</h1>
        <p className="text-slate-400 text-xs mt-1">COMMAND CENTER v4.0</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
              pathname === item.href
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          Live Connection
        </div>
      </div>
    </aside>
  );
}
