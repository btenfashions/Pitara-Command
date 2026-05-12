'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronLeft, ChevronRight, Loader2, Plus, ArrowUpRight, Barcode } from 'lucide-react';
import { Sku } from '@/types';
import { code128Svg } from '@/lib/utils/barcode';

interface InventoryResponse {
  skus: Sku[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const fetchInventory = async (page: number, query: string): Promise<InventoryResponse> => {
  const res = await fetch(`/api/inventory?page=${page}&query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export default function InventoryPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedSku, setSelectedSku] = useState<Sku | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['inventory', page, query],
    queryFn: () => fetchInventory(page, query),
    placeholderData: (previousData) => previousData,
  });

  return (
    <div className="space-y-8 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Real-time tracking for 10k+ SKUs.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white text-slate-900 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            Stock Intake
          </button>
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input
              type="text"
              placeholder="Filter by SKU or Product Name..."
              value={query}
              onChange={(e) => {setQuery(e.target.value); setPage(1);}}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </header>

      {isError && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-2xl text-sm font-bold">
          Error loading inventory: {(error as Error).message}
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-lg duration-500">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-100 font-extrabold text-slate-400 uppercase tracking-[0.1em] text-[9px]">
              <th className="px-8 py-5">SKU Identity</th>
              <th className="px-6 py-5">Product Details</th>
              <th className="px-6 py-5">Size</th>
              <th className="px-6 py-5">Stock Level</th>
              <th className="px-6 py-5 text-right">Status</th>
              <th className="px-8 py-5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-medium">
            {isLoading && !data && (
              <tr>
                <td colSpan={6} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center gap-4 text-slate-300">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span className="text-sm font-bold tracking-widest uppercase">Syncing Catalog...</span>
                  </div>
                </td>
              </tr>
            )}

            {data?.skus && data.skus.length > 0 ? (
              data.skus.map((item: Sku) => (
                <tr key={item.id} className={`hover:bg-slate-50/50 transition-colors group cursor-pointer ${isLoading ? 'opacity-40' : ''}`} onClick={() => setSelectedSku(item)}>
                  <td className="px-8 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg w-fit">{item.code}</span>
                      <div className="w-16 h-4 text-slate-300" dangerouslySetInnerHTML={{ __html: code128Svg(item.code) }} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 tracking-tight">{item.product.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.size}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <span className="text-sm font-mono font-extrabold text-slate-900">{item.currentStock}</span>
                       <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full rounded-full transition-all duration-1000 ${item.currentStock > 10 ? 'bg-emerald-500 w-full' : item.currentStock > 5 ? 'bg-amber-400 w-1/2' : 'bg-rose-500 w-1/4'}`} />
                       </div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{item.reservedStock} reserved</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${item.currentStock > 5 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                      {item.currentStock > 5 ? 'In Stock' : 'Low'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-900 hover:bg-white rounded-xl transition-all group-hover:shadow-sm">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : !isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-24 text-center text-slate-400 italic font-medium">No SKUs found matching your search.</td>
              </tr>
            ) : null}
          </tbody>
        </table>

        {data?.pagination && (
          <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Range {((page-1) * 50) + 1}—{Math.min(page * 50, data.pagination.total)} of {data.pagination.total} entries
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-2xl hover:bg-white disabled:opacity-30 shadow-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.pagination.totalPages}
                className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-2xl hover:bg-white disabled:opacity-30 shadow-sm transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedSku && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300" onClick={() => setSelectedSku(null)}>
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 space-y-8 animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <header className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">SKU Profile</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 tracking-tighter">{selectedSku.code}</h2>
                  <p className="text-slate-500 font-bold text-sm tracking-tight">{selectedSku.product.name}</p>
                </div>
                <div className="p-3 bg-slate-900 text-white rounded-3xl shadow-lg">
                  <Barcode className="w-6 h-6" />
                </div>
              </header>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available</p>
                   <p className="text-2xl font-black text-slate-900">{selectedSku.currentStock}</p>
                 </div>
                 <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reserved</p>
                   <p className="text-2xl font-black text-slate-500">{selectedSku.reservedStock}</p>
                 </div>
              </div>

              <div className="space-y-3 pt-4">
                 <button className="w-full py-4 bg-slate-900 text-white rounded-3xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl">Adjust stock quantity</button>
                 <button className="w-full py-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-3xl font-bold text-sm hover:bg-slate-100 transition-all" onClick={() => setSelectedSku(null)}>Close details</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
