'use client';

import React from 'react';
import { Users, Search, Mail, Phone } from 'lucide-react';

export default function PeoplePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">People</h1>
        <p className="text-slate-500">Customer profiles and ordering patterns.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Sample Customer {i}</h3>
                <p className="text-xs text-slate-500">Joined Jan 2024</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone className="w-4 h-4" /> 987654321{i}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
