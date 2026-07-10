/**
 * RevenueChartCard Component
 * Area chart showing won revenue by month.
 * Features gradient fill, smooth curve, and INR formatting.
 */

import { memo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatINR } from '../../utils/analyticsHelpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
      <p className="font-bold mb-1">{label} Revenue</p>
      <p className="text-emerald-400 font-bold">{formatINR(payload[0]?.value ?? 0)}</p>
    </div>
  );
};

const formatYAxis = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

const RevenueChartCard = memo(({ revenueByMonth = [] }) => {
  const totalRevenue = revenueByMonth.reduce((s, m) => s + (m.revenue || 0), 0);
  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.revenue || 0), 0);
  const lastMonth = revenueByMonth[revenueByMonth.length - 1]?.revenue || 0;
  const prevMonth = revenueByMonth[revenueByMonth.length - 2]?.revenue || 0;
  const growth = prevMonth > 0 ? Math.round(((lastMonth - prevMonth) / prevMonth) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue Analytics</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Monthly won revenue (closed deals only)</p>
        </div>
        <div className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
          growth >= 0
            ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
            : 'text-red-600 bg-red-50 border-red-100'
        }`}>
          {growth >= 0 ? '+' : ''}{growth}% MoM
        </div>
      </div>

      {revenueByMonth.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-sm">
          No revenue data for this period
        </div>
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueByMonth}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                tickFormatter={formatYAxis}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#22C55E"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={{ r: 4, fill: '#22C55E', stroke: 'white', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#22C55E', stroke: 'white', strokeWidth: 2 }}
                animationBegin={0}
                animationDuration={900}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer summary */}
      {revenueByMonth.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-2">
          {[
            { label: 'Total', value: formatINR(totalRevenue) },
            { label: 'Peak Month', value: formatINR(maxRevenue) },
            { label: 'Last Month', value: formatINR(lastMonth) },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-sm font-black text-slate-800 dark:text-slate-100">{item.value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

RevenueChartCard.displayName = 'RevenueChartCard';
export default RevenueChartCard;
