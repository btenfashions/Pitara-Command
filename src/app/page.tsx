import { ShoppingBag, Users, TrendingUp, AlertTriangle } from 'lucide-react';

const stats = [
  { label: 'Total Orders (MTD)', value: '1,284', change: '+12.5%', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Active Customers', value: '842', change: '+5.2%', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Revenue (MTD)', value: '₹14.2L', change: '+18.1%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Stock Alerts', value: '24', change: '-2', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
];

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Command Center Insights</h1>
        <p className="text-slate-500 mt-1">Real-time operational overview for Pitara Jaypore.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-hover hover:shadow-md">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
             <TrendingUp className="w-8 h-8 text-slate-300" />
           </div>
           <div>
             <h2 className="text-lg font-bold text-slate-900">Sales Velocity</h2>
             <p className="text-sm text-slate-500 max-w-xs mx-auto">Detailed chart integration with D3 or Chart.js would go here to show daily order trends.</p>
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
