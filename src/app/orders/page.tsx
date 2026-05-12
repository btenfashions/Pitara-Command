'use client';

import React from 'react';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        <p className="text-slate-500">View and manage historical order records.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
        <Package className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">Order History</h3>
        <p className="text-slate-500 max-w-sm mx-auto mt-2">
          Your confirmed orders will appear here. Currently displaying a placeholder while data migration from Sheets is pending.
        </p>
      </div>
    </div>
  );
}
