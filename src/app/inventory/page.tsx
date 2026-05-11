'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2, Package } from 'lucide-react';

export default function InventoryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inventory?page=${page}&query=${query}`);
      const d = await res.json();
      setData(d);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchInventory, 300);
    return () => clearTimeout(timer);
  }, [page, query]);

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory</h1>
          <p className="text-slate-500">Manage 10k+ SKUs with real-time stock levels.</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU, name..."
            value={query}
            onChange={(e) => {setQuery(e.target.value); setPage(1);}}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 outline-none transition-all"
          />
        </div>
      </header>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">SKU Code</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Name</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Size</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">In Stock</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reserved</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-sm font-medium tracking-tight">Refreshing stock...</span>
                  </div>
                </td>
              </tr>
            ) : data?.skus.length > 0 ? (
              data.skus.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded tracking-tight">{item.code}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.product.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{item.size}</td>
                  <td className="px-6 py-4 text-sm font-mono font-bold text-slate-900">{item.currentStock}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-400">{item.reservedStock}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${item.currentStock > 5 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {item.currentStock > 5 ? 'Available' : 'Low Stock'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">No SKUs found matching your search.</td>
              </tr>
            )}
          </tbody>
        </table>

        {data?.pagination && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-xs font-medium text-slate-500">
              Showing {((page-1) * 50) + 1} to {Math.min(page * 50, data.pagination.total)} of {data.pagination.total} SKUs
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-slate-200 rounded hover:bg-white disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= data.pagination.totalPages}
                className="p-2 border border-slate-200 rounded hover:bg-white disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
