/**
 * PieChartCard Component
 * Doughnut chart showing lead status distribution.
 * Features animated rendering, active slice expansion on hover,
 * and a center label showing total leads count.
 */

import { memo, useState, useCallback } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from 'recharts';
import { STATUS_COLORS } from '../../constants/analyticsColors';

/** Custom tooltip */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { status, count, percent } = payload[0]?.payload || {};
  return (
    <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm min-w-[130px]">
      <p className="font-bold mb-1">{status}</p>
      <p className="text-slate-300">{count} Leads</p>
      <p className="text-slate-400 dark:text-slate-500 text-xs">{percent}%</p>
    </div>
  );
};

/** Center label overlay (absolute) */
const CenterLabel = memo(({ total }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
    <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">{total}</span>
    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1">
      Total Leads
    </span>
  </div>
));
CenterLabel.displayName = 'CenterLabel';

/** Custom legend */
const CustomLegend = memo(({ data }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
    {data.map((item) => (
      <div key={item.status} className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: item.color }}
        />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
          {item.status}
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto font-medium">
          {item.count} ({item.percent}%)
        </span>
      </div>
    ))}
  </div>
));
CustomLegend.displayName = 'CustomLegend';

const PieChartCard = memo(({ statusDistribution = [], totalLeads = 0 }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onMouseEnter = useCallback((_, index) => setActiveIndex(index), []);
  const onMouseLeave = useCallback(() => setActiveIndex(null), []);

  const chartData = statusDistribution.map((item) => ({
    ...item,
    color: STATUS_COLORS[item.status] || '#94A3B8',
    name: item.status, // required for Recharts
    value: item.count,
  }));

  const isEmpty = chartData.length === 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col">
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Lead Status Distribution</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Breakdown of leads by current pipeline stage</p>
      </div>

      {isEmpty ? (
        <div className="flex-1 flex items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-sm">
          No data available
        </div>
      ) : (
        <>
          {/* Doughnut chart */}
          <div className="relative h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.4}
                      stroke="white"
                      strokeWidth={2}
                      style={{
                        transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                        transformOrigin: 'center',
                        transition: 'transform 0.2s ease, opacity 0.2s ease',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <CenterLabel total={totalLeads} />
          </div>

          {/* Legend */}
          <CustomLegend data={chartData} />
        </>
      )}
    </div>
  );
});

PieChartCard.displayName = 'PieChartCard';
export default PieChartCard;
