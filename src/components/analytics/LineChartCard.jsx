/**
 * LineChartCard Component
 * Monthly conversion rate trend line chart.
 * Shows Won/Total ratio per month with smooth curve and dot markers.
 */

import { memo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
      <p className="font-bold mb-1">{label}</p>
      <p className="text-emerald-400 font-bold">
        {payload[0]?.value ?? 0}%{' '}
        <span className="text-slate-400 dark:text-slate-500 font-normal">conversion</span>
      </p>
    </div>
  );
};

const CustomDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#22C55E"
      stroke="white"
      strokeWidth={2}
    />
  );
};

const LineChartCard = memo(({ conversionByMonth = [] }) => {
  const avgRate =
    conversionByMonth.length > 0
      ? Math.round(
          conversionByMonth.reduce((s, m) => s + (m.rate || 0), 0) /
            conversionByMonth.length
        )
      : 0;

  const maxRate = Math.max(...conversionByMonth.map((d) => d.rate || 0), 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Conversion Rate Trend</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Monthly Won / Total leads ratio (%)</p>
        </div>
        <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
          Avg {avgRate}%
        </div>
      </div>

      {conversionByMonth.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-sm">
          No data for this period
        </div>
      ) : (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={conversionByMonth}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
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
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
              {/* Average reference line */}
              <ReferenceLine
                y={avgRate}
                stroke="#22C55E"
                strokeDasharray="4 4"
                strokeOpacity={0.4}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#22C55E"
                strokeWidth={2.5}
                dot={<CustomDot />}
                activeDot={{ r: 6, fill: '#22C55E', stroke: 'white', strokeWidth: 2 }}
                animationBegin={0}
                animationDuration={900}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer */}
      {conversionByMonth.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-2">
          {[
            { label: 'Avg Rate', value: `${avgRate}%` },
            { label: 'Peak Rate', value: `${maxRate}%` },
            { label: 'This Month', value: `${conversionByMonth[conversionByMonth.length - 1]?.rate ?? 0}%` },
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

LineChartCard.displayName = 'LineChartCard';
export default LineChartCard;
