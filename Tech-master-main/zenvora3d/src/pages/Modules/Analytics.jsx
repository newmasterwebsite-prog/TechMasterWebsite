import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  BarChart3, Users, Clock, Flame, ShieldAlert,
  ArrowUpRight, ArrowDownRight, Compass, Laptop, Smartphone, Tablet
} from 'lucide-react';
import { 
  AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export const Analytics = () => {
  const { db } = useDatabase();
  const analyticsData = db.analytics;

  const summaryStats = [
    { title: "Total Pageviews", value: "98.4K", change: "+15.2%", isPositive: true, desc: "Last 30 days", icon: Flame },
    { title: "Avg. Session Duration", value: "2m 48s", change: "+0m 12s", isPositive: true, desc: "Focus timeline", icon: Clock },
    { title: "Bounce Rate", value: "41.6%", change: "-2.4%", isPositive: true, desc: "Audience retention", icon: ArrowDownRight },
    { title: "Active Live Sessions", value: "42", change: "Real-time", isPositive: true, desc: "Visitors currently on site", icon: Users }
  ];

  const COLORS = ['#d4af37', '#a1a1aa', '#71717a', '#3f3f46'];

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-luxury-gold" />
          Website Performance & Analytics
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review traffic reports, page retention scores, referral loops, and user device stats.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border border-zinc-800/60" hoverable>
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.title}</span>
                  <span className="font-serif text-2xl font-medium text-zinc-100 tracking-wide mt-2">{stat.value}</span>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <Icon className="w-4 h-4 text-luxury-gold" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold">
                <span className={stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}>{stat.change}</span>
                <span className="text-zinc-500 font-normal">{stat.desc}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Graph */}
        <Card className="lg:col-span-2 border border-zinc-800/60" title="Visitor Traffic Patterns" subtitle="Desktop vs Mobile session loads over past 7 days">
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.traffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradientGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4af37" stopOpacity={0.18}/>
                    <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ stroke: 'rgba(212,175,55,0.1)' }} />
                <Area type="monotone" name="Mobile Views" dataKey="mobile" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#gradientGold)" />
                <Area type="monotone" name="Desktop Views" dataKey="desktop" stroke="#a1a1aa" strokeWidth={1.5} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Referral */}
        <Card className="border border-zinc-800/60 flex flex-col justify-between" title="Acquisition Channels" subtitle="Visitor source origins">
          <div className="h-[200px] w-full flex items-center justify-center mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.referrals}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="visitors"
                  nameKey="channel"
                >
                  {analyticsData.referrals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 mt-4 border-t border-zinc-900/80 pt-4">
            {analyticsData.referrals.map((ref, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-zinc-400 font-medium">{ref.channel}</span>
                </div>
                <span className="text-zinc-300 font-mono font-bold">{ref.percentage}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pages table & System diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular pages */}
        <Card className="lg:col-span-2 border border-zinc-800/60 p-0 overflow-hidden" title="Top Visited Slugs" subtitle="Most loaded page paths">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-800 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                  <th className="px-5 py-3.5">Page Path</th>
                  <th className="px-5 py-3.5">Unique Views</th>
                  <th className="px-5 py-3.5">Avg. Time On Page</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 text-zinc-300">
                {analyticsData.topPages.map((page, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/10">
                    <td className="px-5 py-3 font-mono font-semibold text-zinc-400">{page.path}</td>
                    <td className="px-5 py-3 font-mono">{page.views.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono text-zinc-500">{page.avgDuration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Technology/device splits */}
        <Card className="border border-zinc-800/60 p-5" title="Operating Metrics" subtitle="Platform sessions analysis">
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-luxury-gold" />
                <span className="text-zinc-300">Mobile Browsers</span>
              </div>
              <Badge variant="gold">65% share</Badge>
            </div>
            
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-300">Desktop Safari/Chrome</span>
              </div>
              <Badge variant="default">30% share</Badge>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Tablet className="w-4 h-4 text-zinc-500" />
                <span className="text-zinc-300">Tablet iPadOS</span>
              </div>
              <Badge variant="default">5% share</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
