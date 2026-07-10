/**
 * AnalyticsFilters Component
 * Date range filter bar for the Analytics Dashboard.
 * Supports preset ranges and a custom date range picker.
 */

import { memo, useState, useCallback } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

const PRESET_RANGES = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'This Year', value: 'year' },
  { label: 'All Time', value: 'all' },
];

/**
 * @param {{ dateRange: string, onRangeChange: Function, customRange: object, onCustomRange: Function }} props
 */
const AnalyticsFilters = memo(({
  dateRange,
  onRangeChange,
  customRange,
  onCustomRange,
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [tempStart, setTempStart] = useState('');
  const [tempEnd, setTempEnd] = useState('');

  const handlePreset = useCallback((value) => {
    onRangeChange(value);
    setShowCustom(false);
  }, [onRangeChange]);

  const handleCustomApply = useCallback(() => {
    if (tempStart && tempEnd) {
      onCustomRange({ start: tempStart, end: tempEnd });
      onRangeChange('custom');
      setShowCustom(false);
    }
  }, [tempStart, tempEnd, onCustomRange, onRangeChange]);

  const handleClearCustom = useCallback(() => {
    onRangeChange('all');
    onCustomRange(null);
    setTempStart('');
    setTempEnd('');
    setShowCustom(false);
  }, [onRangeChange, onCustomRange]);

  const activeLabel =
    dateRange === 'custom' && customRange
      ? `${customRange.start} → ${customRange.end}`
      : PRESET_RANGES.find((r) => r.value === dateRange)?.label || 'All Time';

  return (
    <div className="flex flex-wrap items-center gap-2 relative">
      {/* Preset filter buttons */}
      <div className="flex flex-wrap gap-2">
        {PRESET_RANGES.map((range) => (
          <button
            key={range.value}
            id={`filter-${range.value}`}
            onClick={() => handlePreset(range.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
              dateRange === range.value
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {range.label}
          </button>
        ))}

        {/* Custom range trigger */}
        <button
          id="filter-custom"
          onClick={() => setShowCustom((v) => !v)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${
            dateRange === 'custom'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:text-blue-600'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Custom Range
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCustom ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Active custom range badge */}
      {dateRange === 'custom' && customRange && (
        <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
          <Calendar className="w-3.5 h-3.5" />
          {customRange.start} → {customRange.end}
          <button onClick={handleClearCustom} className="ml-1 hover:text-blue-900">
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Custom date range panel */}
      {showCustom && (
        <div className="absolute top-12 left-0 z-50 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-5 min-w-72">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-4">Select Custom Range</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-1">Start Date</label>
              <input
                type="date"
                id="custom-range-start"
                value={tempStart}
                onChange={(e) => setTempStart(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 mb-1">End Date</label>
              <input
                type="date"
                id="custom-range-end"
                value={tempEnd}
                min={tempStart}
                onChange={(e) => setTempEnd(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCustomApply}
              disabled={!tempStart || !tempEnd}
              className="flex-1 bg-blue-600 disabled:bg-slate-300 text-white font-semibold py-2 rounded-lg text-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed"
            >
              Apply
            </button>
            <button
              onClick={() => setShowCustom(false)}
              className="px-4 bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-semibold py-2 rounded-lg text-sm hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

AnalyticsFilters.displayName = 'AnalyticsFilters';
export default AnalyticsFilters;
