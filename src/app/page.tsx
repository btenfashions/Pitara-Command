'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Users, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';

export default function InsightsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['insights'],
    queryFn: async () => {
      const res = await fetch('/api/insights');
      return res.json();
    }
  });

  const stats = [
    { label: 'Total Orders (MTD)', value: data?.totalOrders || 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Customers', value: data?.activeCustomers || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Est. Revenue (MTD)', value: `₹${(data?.revenue / 100000).toFixed(1)}L`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Stock Alerts', value: data?.stockAlerts || 0, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Command Center Insights</h1>
        <p className="text-slate-500 mt-1">Real-time operational overview for Pitara Jaypore.</p>
      </header>

      {isLoading ? (
        <div className="flex items-center gap-3 text-slate-400 p-12">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium tracking-tight">Calculating metrics...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
              <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</h3>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
             <TrendingUp className="w-8 h-8 text-slate-300" />
           </div>
           <div>
             <h2 className="text-lg font-bold text-slate-900">Sales Velocity</h2>
             <p className="text-sm text-slate-500 max-w-xs mx-auto">Historical trend analysis will appear here as order data populates.</p>
           </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
             <ShoppingBag className="w-8 h-8 text-slate-300" />
           </div>
           <div>
             <h2 className="text-lg font-bold text-slate-900">Top Moving SKUs</h2>
             <p className="text-sm text-slate-500 max-w-xs mx-auto">Ranking of best-performing designs by sales volume and stock turnover.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
