'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CloudSync, MapPin, Loader2, CheckCircle2, XCircle, Settings, Plus } from 'lucide-react';

export default function MasterDataPage() {
  const [pin, setPin] = useState('');
  const [pinResult, setPinResult] = useState<{serviceable: boolean, city?: string, state?: string} | null>(null);
  const [pinLoading, setPinLoading] = useState(false);

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['master-products'],
    queryFn: async () => {
      const res = await fetch('/api/master/products');
      return res.json();
    }
  });

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

  const checkPincode = async () => {
    if (pin.length !== 6) return;
    setPinLoading(true);
    setPinResult(null);
    try {
      const res = await fetch(`/api/pincode?pin=${pin}`);
      const data = await res.json();
      setPinResult(data);
    } catch {
      setPinResult({ serviceable: false });
    } finally {
      setPinLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-900 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Master Data & Config</h1>
        <p className="text-slate-500 mt-1 font-medium text-sm">System-wide settings and product catalog management.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
               <Settings className="w-5 h-5 text-slate-400" />
               Product Catalog
            </h2>
            <button className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100 font-extrabold text-slate-500 uppercase tracking-widest text-[9px]">
                  <th className="px-8 py-5">Base Code</th>
                  <th className="px-6 py-5">Product Name</th>
                  <th className="px-6 py-5 text-right">SKUs</th>
                  <th className="px-8 py-5 text-right">MRP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {productsLoading ? (
                  <tr><td colSpan={4} className="px-6 py-24 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading catalog...</td></tr>
                ) : products?.map((p: {id: string, baseCode: string, name: string, mrp: number, _count: {skus: number}}) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 font-mono font-bold text-slate-700 bg-slate-50/50 w-fit">{p.baseCode}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 tracking-tight">{p.name}</td>
                    <td className="px-6 py-4 text-right text-slate-400 font-black">{p._count.skus}</td>
                    <td className="px-8 py-4 text-right font-black text-slate-900">₹{p.mrp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6 text-slate-900">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                <CloudSync className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold">Sheets Sync</h2>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
              Manual data push from PostgreSQL back to legacy Google Sheets.
            </p>
            <button
              onClick={handleSync}
              className="w-full py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-sm text-sm"
            >
              Sync Now
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold">Pincode</h2>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="6-digit pin"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-slate-900 transition-all"
              />
              <button
                onClick={checkPincode}
                disabled={pinLoading || pin.length !== 6}
                className="px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all text-xs"
              >
                {pinLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Check'}
              </button>
            </div>

            {pinResult && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in slide-in-from-top-2 ${pinResult.serviceable ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                {pinResult.serviceable ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">{pinResult.serviceable ? 'Serviceable' : 'Blocked'}</p>
                  {pinResult.city && <p className="text-[10px] font-bold opacity-70 uppercase">{pinResult.city}, {pinResult.state}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
