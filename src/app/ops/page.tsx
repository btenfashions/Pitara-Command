'use client';

import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Loader2, CheckCircle2, AlertCircle, Scissors, Merge, Trash2, Edit3, MessageSquare } from 'lucide-react';
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
      queryClient.invalidateQueries({ queryKey: ['insights'] });
    },
    onError: () => {
      setStatus({ type: 'error', message: 'Failed to confirm orders.' });
    }
  });

  const removeOrder = (idx: number) => {
    setParsedOrders(prev => prev.filter((_, i) => i !== idx));
  };

  const isBusy = parseMutation.isPending || confirmMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Daily Ops</h1>
        <p className="text-slate-500">Real-time order parsing and review workflow.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-2">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 text-slate-900 font-bold">
          <span className="text-xs uppercase tracking-widest text-slate-400">WhatsApp Lot Input</span>
          <button
            onClick={() => parseMutation.mutate(text)}
            disabled={isBusy || !text}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 disabled:opacity-50 transition-all shadow-sm"
          >
            {parseMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Parse Batch
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste order text from WhatsApp here..."
          className="w-full h-40 p-5 text-sm focus:outline-none resize-none border-none text-slate-700 font-medium leading-relaxed placeholder:text-slate-300"
        />
      </div>

      {status && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in fade-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
          {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span className="text-sm font-bold">{status.message}</span>
        </div>
      )}

      {parsedOrders.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center pt-4">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Review Results ({parsedOrders.length})</h2>
            <button
              onClick={() => confirmMutation.mutate(parsedOrders)}
              disabled={confirmMutation.isPending}
              className="bg-emerald-600 text-white px-8 py-2.5 rounded-2xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg flex items-center gap-2"
            >
              {confirmMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirm & Ship All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {parsedOrders.map((order, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative group hover:border-slate-400 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{order.customerName}</h3>
                    <p className="text-sm text-slate-400 font-bold tracking-tight">{order.phoneNumber}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => removeOrder(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                   <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-bold">
                     <Edit3 className="w-3 h-3" />
                     {order.designCode}
                   </div>
                   <div className="px-3 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl text-xs font-bold italic">
                     Size {order.size}
                   </div>
                </div>

                <div className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50/50 p-4 rounded-2xl border border-slate-100 italic">
                  {order.fullAddress}, {order.city}, {order.state} - {order.pincode}
                </div>

                <div className="flex gap-3 pt-2">
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors">
                     <Scissors className="w-3.5 h-3.5" />
                     Split
                   </button>
                   <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors">
                     <Merge className="w-3.5 h-3.5" />
                     Club
                   </button>
                   <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
                     <MessageSquare className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
