'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Package, CheckCircle2, User, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default function OrderTimelinePage() {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-timeline', id],
    queryFn: async () => {
      // In a real app: fetch(`/api/orders/${id}/timeline`)
      return {
        orderRef: id,
        status: 'CONFIRMED',
        customer: { name: 'Rajesh Kumar', phone: '9876543210', city: 'Jaipur' },
        createdAt: new Date(),
        items: [{ sku: { code: 'NT300125R40' }, qty: 1 }],
        events: [
          { status: 'CREATED', label: 'Order Parsed', date: new Date(), description: 'Parsed from WhatsApp text.' },
          { status: 'CONFIRMED', label: 'Order Confirmed', date: new Date(), description: 'Inventory reserved and logged.' },
        ]
      };
    }
  });

  if (isLoading) return <div className="p-8">Loading timeline...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center text-slate-900">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order {order?.orderRef}</h1>
          <p className="text-slate-500">Full traceability for this transaction.</p>
        </div>
        <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100 uppercase">
          {order?.status}
        </span>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
           <User className="w-5 h-5 text-slate-400 mt-1" />
           <div>
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Customer</h3>
             <p className="text-sm font-bold text-slate-900 mt-1">{order?.customer.name}</p>
             <p className="text-xs text-slate-500">{order?.customer.phone}</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
           <MapPin className="w-5 h-5 text-slate-400 mt-1" />
           <div>
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery</h3>
             <p className="text-sm font-bold text-slate-900 mt-1">{order?.customer.city}</p>
             <p className="text-xs text-slate-500">Standard Shipping</p>
           </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
           <Package className="w-5 h-5 text-slate-400 mt-1" />
           <div>
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Items</h3>
             <p className="text-sm font-bold text-slate-900 mt-1">{order?.items.length} Product(s)</p>
             <p className="text-xs text-slate-500">{order?.items[0].sku.code}</p>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <h2 className="text-lg font-bold text-slate-900 mb-8">Timeline</h2>
        <div className="space-y-8 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />
          {order?.events.map((event: { label: string; date: Date; description: string }, idx: number) => (
            <div key={idx} className="relative pl-10">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-slate-900 flex items-center justify-center z-10">
                <CheckCircle2 className="w-3 h-3 text-slate-900" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900">{event.label}</h4>
                  <time className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {format(event.date, 'MMM d, h:mm a')}
                  </time>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
