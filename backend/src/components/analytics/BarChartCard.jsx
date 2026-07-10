/**
 * BarChartCard Component
 * Monthly leads trend bar chart for the last 6 months.
 * Uses Recharts BarChart with ResponsiveContainer and animations.
 */

import { memo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
      <p className="font-bold mb-1">{label}</p>
      <p className="text-blue-300">
        {payload[0]?.value ?? 0}{' '}
        <span className="text-slate-400 dark:text-slate-500 font-normal">Leads</span>
      </p>
    </div>
  );
};

const BarChartCard = memo(({ monthlyLeads = [] }) => {
  const maxVal = Math.max(...monthlyLeads.map((d) => d.leads || 0), 1);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Leads Trend</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Lead volume over the last 6 months</p>
        </div>
        <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
          6-Month View
        </div>
      </div>

      {monthlyLeads.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-sm">
          No data for this period
        </div>
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyLeads}
              margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
              barSize={28}
            >
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
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#EFF6FF', radius: 8 }} />
              <Bar
                dataKey="leads"
                radius={[6, 6, 0, 0]}
                animationBegin={0}
                animationDuration={800}
              >
                {monthlyLeads.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.leads === maxVal
                        ? '#2563EB'        // highlight max
                        : '#BFDBFE'        // lighter for others
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer summary */}
      {monthlyLeads.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-2">
          {[
            { label: 'Total', value: monthlyLeads.reduce((s, m) => s + (m.leads || 0), 0) },
            { label: 'Avg / mo', value: Math.round(monthlyLeads.reduce((s, m) => s + (m.leads || 0), 0) / (monthlyLeads.length || 1)) },
            { label: 'Peak', value: maxVal },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-base font-black text-slate-800 dark:text-slate-100">{item.value}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

BarChartCard.displayName = 'BarChartCard';
export default BarChartCard;
