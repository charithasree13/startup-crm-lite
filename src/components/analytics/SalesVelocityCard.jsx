/**
 * SalesVelocityCard Component
 * Displays the daily sales velocity metric with formula breakdown.
 * Formula: (Opportunities × Win Rate × Avg Deal Size) / Sales Cycle
 */

import { memo } from 'react';
import { Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { formatINR } from '../../utils/analyticsHelpers';

const MetricRow = memo(({ label, value }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
    <span className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{label}</span>
    <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{value}</span>
  </div>
));
MetricRow.displayName = 'MetricRow';

const SalesVelocityCard = memo(({ salesVelocity = {} }) => {
  const {
    velocity = 0,
    opportunities = 0,
    winRate = 0,
    avgDealSize = 0,
    salesCycle = 0,
  } = salesVelocity;

  const isPositive = velocity > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Sales Velocity</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">Revenue generated per day</p>
        </div>
        <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
          <Zap className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      {/* Hero metric */}
      <div className="flex items-end gap-3 mb-5">
        <div>
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {formatINR(velocity)}
          </span>
          <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm font-semibold ml-1">/day</span>
        </div>
        <div
          className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full mb-1 ${
            isPositive
              ? 'text-emerald-700 bg-emerald-50'
              : 'text-red-600 bg-red-50'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {isPositive ? 'Positive' : 'Needs attention'}
        </div>
      </div>

      {/* Formula breakdown */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-3 mb-4 border border-slate-100 dark:border-slate-700">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Formula Breakdown
        </p>
        <MetricRow label="Active Opportunities" value={opportunities} />
        <MetricRow label="Win Rate" value={`${winRate}%`} />
        <MetricRow label="Avg Deal Size" value={formatINR(avgDealSize)} />
        <MetricRow label="Avg Sales Cycle" value={`${salesCycle} days`} />
      </div>

      {/* Velocity bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mb-1">
          <span>Velocity Score</span>
          <span>{Math.min(100, Math.round((velocity / 50000) * 100))}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-amber-400 transition-all duration-700"
            style={{ width: `${Math.min(100, Math.round((velocity / 50000) * 100))}%` }}
          />
        </div>
      </div>
    </div>
  );
});

SalesVelocityCard.displayName = 'SalesVelocityCard';
export default SalesVelocityCard;
