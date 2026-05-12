'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, Package, Filter, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const [query, setQuery] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders-history', query],
    queryFn: async () => {
      // For prototype, we'll return mock data. In production: fetch(`/api/orders?query=${query}`)
      return [
        { id: 1, orderRef: 'CMD-20240511-1', customerName: 'Rajesh Kumar', status: 'CONFIRMED', date: new Date(), total: 1, sku: 'NT300125R40' },
        { id: 2, orderRef: 'CMD-20240511-2', customerName: 'Sita Sharma', status: 'DISPATCHED', date: new Date(), total: 2, sku: 'FC020426L42' },
        { id: 3, orderRef: 'CMD-20240510-1', customerName: 'Amit Singh', status: 'PENDING', date: new Date(), total: 1, sku: 'NT300125R38' },
      ];
    }
  });

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Orders</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Management and history of all written records.</p>
        </div>
        <div className="flex gap-4">
           <button className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            Filters
          </button>
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder="Search by Ref or Customer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-100 font-extrabold text-slate-400 uppercase tracking-widest text-[9px]">
              <th className="px-8 py-5">Order Reference</th>
              <th className="px-6 py-5">Customer</th>
              <th className="px-6 py-5">Product(s)</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-20 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-300" /></td></tr>
            ) : orders?.map((order: {id: number, orderRef: string, customerName: string, status: string, total: number, sku: string}) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-slate-900 text-white rounded-lg">
                       <Package className="w-3.5 h-3.5" />
                     </div>
                     <span className="font-mono text-xs font-bold text-slate-900 tracking-tight">{order.orderRef}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-tighter">Verified 10/10</p>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-600">{order.sku}</span>
                    <span className="text-[10px] text-slate-400 font-medium">{order.total} item(s)</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                     {order.status === 'DISPATCHED' ? (
                       <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-widest">
                         <CheckCircle2 className="w-3 h-3" />
                         Shipped
                       </span>
                     ) : (
                       <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-bold uppercase tracking-widest">
                         <Clock className="w-3 h-3" />
                         Confirmed
                       </span>
                     )}
                   </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <Link href={`/orders/${order.orderRef}`} className="inline-flex items-center gap-2 text-slate-300 hover:text-slate-900 transition-all font-bold text-xs">
                    View Timeline
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
