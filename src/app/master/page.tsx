'use client';

import React from 'react';
import { ShieldCheck, CloudSync } from 'lucide-react';

export default function MasterDataPage() {
  const handleSync = async () => {
    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      alert(`Sync completed: ${data.synced} synced, ${data.failed} failed.`);
    } catch (error) {
      console.error(error);
      alert('Sync failed.');
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Master Data & Config</h1>
        <p className="text-slate-500 mt-1">System-wide settings and legacy synchronization.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <CloudSync className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold">Google Sheets Sync</h2>
          </div>
          <p className="text-sm text-slate-500">
            Manually trigger a data push from PostgreSQL back to your legacy Google Sheets for reporting.
          </p>
          <button
            onClick={handleSync}
            className="w-full py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-sm"
          >
            Sync Pending Orders Now
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 opacity-50 cursor-not-allowed">
           <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold">Access Control</h2>
          </div>
          <p className="text-sm text-slate-500">Manage team members and their permission levels.</p>
        </div>
      </div>
    </div>
  );
}
