/**
 * ActivityHeatmap Component
 * GitHub-style contribution heatmap tracking lead activity over 12 weeks.
 * Shows lead creation, contact, and meeting activity per day.
 */

import { memo, useState, useCallback } from 'react';
import { HEATMAP_COLORS } from '../../constants/analyticsColors';

/** Groups 84 daily entries into 12 weeks × 7 days */
const groupIntoWeeks = (data) => {
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }
  return weeks;
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Single day cell */
const HeatCell = memo(({ entry, onHover, onLeave }) => {
  const color = HEATMAP_COLORS[entry.level] || HEATMAP_COLORS[0];

  return (
    <div
      className="w-4 h-4 rounded-sm cursor-pointer transition-all duration-150 hover:ring-2 hover:ring-offset-1 hover:ring-blue-400 hover:scale-125"
      style={{ backgroundColor: color }}
      onMouseEnter={() => onHover(entry)}
      onMouseLeave={onLeave}
      title={`${entry.date}: ${entry.count} activities`}
    />
  );
});
HeatCell.displayName = 'HeatCell';

const ActivityHeatmap = memo(({ heatmapData = [] }) => {
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const weeks = groupIntoWeeks(heatmapData);

  // Get last 12 week-start labels (approx month markers)
  const monthLabels = (() => {
    const labels = [];
    const seen = new Set();
    weeks.forEach((week, wi) => {
      const firstDay = week[0]?.date;
      if (!firstDay) return;
      const d = new Date(firstDay);
      const label = d.toLocaleDateString('en-US', { month: 'short' });
      if (!seen.has(label)) {
        seen.add(label);
        labels.push({ week: wi, label });
      }
    });
    return labels;
  })();

  const onHover = useCallback((entry, e) => {
    setTooltip(entry);
  }, []);
  const onLeave = useCallback(() => setTooltip(null), []);

  const totalActivity = heatmapData.reduce((s, d) => s + d.count, 0);
  const activeDays = heatmapData.filter((d) => d.count > 0).length;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Activity Heatmap</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">
            Lead creation, contacts &amp; meetings — last 12 weeks
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-slate-900 dark:text-white">{totalActivity}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">activities</p>
        </div>
      </div>

      {heatmapData.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-slate-400 dark:text-slate-500 text-sm">
          No activity data available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Month labels */}
            <div className="flex gap-1 mb-1 ml-8">
              {weeks.map((_, wi) => {
                const ml = monthLabels.find((m) => m.week === wi);
                return (
                  <div key={wi} className="w-4">
                    {ml ? (
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold whitespace-nowrap">
                        {ml.label}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Grid: 7 rows (days) × 12 columns (weeks) */}
            <div className="flex gap-2">
              {/* Day labels */}
              <div className="flex flex-col gap-1 justify-between pr-1">
                {DAY_LABELS.map((d, i) => (
                  <span
                    key={d}
                    className={`text-xs text-slate-400 dark:text-slate-500 h-4 flex items-center ${
                      i % 2 === 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Week columns */}
              <div className="flex gap-1">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, di) => {
                      const entry = week[di] || { date: '', count: 0, level: 0 };
                      return (
                        <HeatCell
                          key={di}
                          entry={entry}
                          onHover={onHover}
                          onLeave={onLeave}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 justify-end">
              <span className="text-xs text-slate-400 dark:text-slate-500">Less</span>
              {HEATMAP_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-sm border border-slate-100 dark:border-slate-700"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span className="text-xs text-slate-400 dark:text-slate-500">More</span>
            </div>
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-4">
        <div>
          <p className="text-lg font-black text-slate-900 dark:text-white">{activeDays}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Active days (12 weeks)</p>
        </div>
        <div>
          <p className="text-lg font-black text-slate-900 dark:text-white">
            {activeDays > 0 ? Math.round(totalActivity / activeDays) : 0}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Avg activities/active day</p>
        </div>
      </div>
    </div>
  );
});

ActivityHeatmap.displayName = 'ActivityHeatmap';
export default ActivityHeatmap;
