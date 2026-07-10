/**
 * LeadSourceChart Component
 * Horizontal bar chart ranking lead sources by volume.
 */

import { memo } from 'react';
import { SOURCE_COLORS } from '../../constants/analyticsColors';

const LeadSourceChart = memo(({ leadSourceStats = [] }) => {
  const maxCount = leadSourceStats.length > 0 ? leadSourceStats[0]?.count || 1 : 1;
  const total = leadSourceStats.reduce((s, d) => s + d.count, 0);

  const getColor = (source) =>
    SOURCE_COLORS[source] || '#94A3B8';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Lead Source Analytics</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Top acquisition channels ranked by volume</p>
        </div>
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg">
          {total} Total
        </div>
      </div>

      {leadSourceStats.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-sm">
          No source data available
        </div>
      ) : (
        <div className="space-y-4">
          {leadSourceStats.map((item, i) => {
            const pct = Math.round((item.count / total) * 100);
            const barWidth = Math.max(8, (item.count / maxCount) * 100);
            const color = getColor(item.source);

            return (
              <div key={item.source} className="group">
                {/* Label row */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.source}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500">{pct}%</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white w-8 text-right">{item.count}</span>
                  </div>
                </div>

                {/* Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-2.5 rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: color,
                      opacity: 0.85,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rank badges */}
      {leadSourceStats.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Top source:</span>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: getColor(leadSourceStats[0]?.source) }}
          >
            {leadSourceStats[0]?.source}
          </span>
        </div>
      )}
    </div>
  );
});

LeadSourceChart.displayName = 'LeadSourceChart';
export default LeadSourceChart;
