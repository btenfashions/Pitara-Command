'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Phone, AlertCircle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function PeoplePage() {
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await fetch('/api/people');
      return res.json();
    }
  });

  const repeatCustomers = customers?.filter((c: {orderCount: number}) => c.orderCount > 1) || [];
  const churnWatch = customers?.filter((c: {isChurnWatch: boolean}) => c.isChurnWatch) || [];

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">People</h1>
        <p className="text-slate-500 mt-1">Customer profiles and ordering patterns.</p>
      </header>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Unique</p>
            <h3 className="text-2xl font-bold text-slate-900">{customers?.length || 0}</h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Repeat Rate</p>
            <h3 className="text-2xl font-bold text-slate-900">
              {customers?.length ? Math.round((repeatCustomers.length / customers.length) * 100) : 0}%
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Churn Watch</p>
            <h3 className="text-2xl font-bold text-slate-900">{churnWatch.length}</h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-20 text-slate-400 font-medium tracking-tight">Loading customer directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers?.map((customer: {id: string, name: string, phone: string, orderCount: number, lastOrderDate: string, isChurnWatch: boolean}) => (
            <div key={customer.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
                    {customer.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{customer.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Phone className="w-3 h-3" /> {customer.phone}
                    </div>
                  </div>
                </div>
                {customer.isChurnWatch && (
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded text-[10px] font-bold uppercase tracking-tight border border-rose-100">Churn Watch</span>
                )}
              </div>

              <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
                 <div className="space-y-0.5">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Orders</p>
                   <p className="text-sm font-bold text-slate-900">{customer.orderCount}</p>
                 </div>
                 <div className="space-y-0.5 text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Last Order</p>
                   <p className="text-sm font-bold text-slate-900">
                     {customer.lastOrderDate ? format(new Date(customer.lastOrderDate), 'MMM d, yyyy') : '—'}
                   </p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
