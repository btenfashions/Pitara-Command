'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { OrderData } from '@/types';

export default function DailyOpsPage() {
  const [text, setText] = useState('');
  const [parsedOrders, setParsedOrders] = useState<OrderData[]>([]);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const queryClient = useQueryClient();

  const parseMutation = useMutation({
    mutationFn: async (input: string) => {
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      if (!res.ok) throw new Error('Parse failed');
      return res.json();
    },
    onSuccess: (data) => {
      setParsedOrders(data);
      setStatus({ type: 'success', message: `Successfully parsed ${data.length} orders.` });
    },
    onError: () => {
      setStatus({ type: 'error', message: 'Failed to parse text. Please try again.' });
    }
  });

  const confirmMutation = useMutation({
    mutationFn: async (orders: OrderData[]) => {
      const res = await fetch('/api/orders/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders }),
      });
      if (!res.ok) throw new Error('Confirm failed');
      return res.json();
    },
    onSuccess: (data) => {
      setStatus({ type: 'success', message: `Confirmed ${data.count} orders. Written to database.` });
      setParsedOrders([]);
      setText('');
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
    onError: () => {
      setStatus({ type: 'error', message: 'Failed to confirm orders.' });
    }
  });

  const isBusy = parseMutation.isPending || confirmMutation.isPending;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Daily Ops</h1>
        <p className="text-slate-500">Paste WhatsApp lots to parse and review orders.</p>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Input Batch</span>
          <button
            onClick={() => parseMutation.mutate(text)}
            disabled={isBusy || !text}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            {parseMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Parse with Claude
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste WhatsApp text here..."
          className="w-full h-48 p-4 text-sm focus:outline-none resize-none border-none"
        />
      </div>

      {status && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{status.message}</span>
        </div>
      )}

      {parsedOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">Review Orders ({parsedOrders.length})</h2>
            <button
              onClick={() => confirmMutation.mutate(parsedOrders)}
              disabled={confirmMutation.isPending}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
            >
              {confirmMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm All & Sync
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parsedOrders.map((order, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 relative group transition-hover hover:border-slate-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900">{order.customerName}</h3>
                    <p className="text-sm text-slate-500 font-medium">{order.phoneNumber}</p>
                  </div>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-tight">Review</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                   <span className="px-2 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded text-xs font-semibold">{order.designCode}</span>
                   <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded text-xs font-semibold">Size {order.size}</span>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {order.fullAddress}, {order.city}, {order.state} - {order.pincode}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
