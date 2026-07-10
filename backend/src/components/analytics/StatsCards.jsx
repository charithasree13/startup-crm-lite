/**
 * StatsCards Component
 * Displays 6 KPI summary cards for the Analytics Dashboard.
 * Each card shows a metric, trend indicator, and growth vs prior period.
 */

import { memo } from 'react';
import {
  Users, TrendingUp, TrendingDown, DollarSign, Award,
  Clock, AlertTriangle, Minus,
} from 'lucide-react';
import { formatINR } from '../../utils/analyticsHelpers';

/** Trend badge shown on each card */
const TrendBadge = memo(({ value, suffix = '%', invert = false }) => {
  const isPositive = invert ? value <= 0 : value >= 0;
  const isNeutral = value === 0;

  if (isNeutral) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-full">
        <Minus className="w-3 h-3" />
        0{suffix}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
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
      {Math.abs(value)}{suffix}
    </span>
  );
});
TrendBadge.displayName = 'TrendBadge';

/** Individual KPI card */
const StatCard = memo(({ id, icon: Icon, iconBg, iconColor, label, value, trendValue, trendSuffix, trendInvert, trendLabel }) => (
  <div
    id={id}
    className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 group"
  >
    {/* Header row */}
    <div className="flex items-center justify-between">
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-none">
        {label}
      </p>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </div>
    </div>

    {/* Value */}
    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
      {value}
    </p>

    {/* Trend */}
    <div className="flex items-center gap-2">
      <TrendBadge value={trendValue} suffix={trendSuffix} invert={trendInvert} />
      <span className="text-xs text-slate-400 dark:text-slate-500">{trendLabel}</span>
    </div>
  </div>
));
StatCard.displayName = 'StatCard';

/**
 * @param {{ totalLeads, leadGrowth, conversionRate, conversionGrowth, pipelineValue, wonRevenue, revenueGrowth, avgSalesCycle, lostRate }} props
 */
const StatsCards = memo(({
  totalLeads = 0,
  leadGrowth = 0,
  conversionRate = 0,
  conversionGrowth = 0,
  pipelineValue = 0,
  wonRevenue = 0,
  revenueGrowth = 0,
  avgSalesCycle = 0,
  lostRate = 0,
}) => {
  const cards = [
    {
      id: 'kpi-total-leads',
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      label: 'Total Leads',
      value: totalLeads.toLocaleString(),
      trendValue: leadGrowth,
      trendSuffix: '%',
      trendLabel: 'vs prior period',
    },
    {
      id: 'kpi-conversion-rate',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      trendValue: conversionGrowth,
      trendSuffix: 'pp',
      trendLabel: 'vs prior period',
    },
    {
      id: 'kpi-pipeline-value',
      icon: DollarSign,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      label: 'Pipeline Value',
      value: formatINR(pipelineValue),
      trendValue: 0,
      trendSuffix: '%',
      trendLabel: 'active deals',
    },
    {
      id: 'kpi-won-revenue',
      icon: Award,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      label: 'Won Revenue',
      value: formatINR(wonRevenue),
      trendValue: revenueGrowth,
      trendSuffix: '%',
      trendLabel: 'vs prior period',
    },
    {
      id: 'kpi-sales-cycle',
      icon: Clock,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      label: 'Avg Sales Cycle',
      value: `${avgSalesCycle} Days`,
      trendValue: 0,
      trendSuffix: 'd',
      trendInvert: true,
      trendLabel: 'avg close time',
    },
    {
      id: 'kpi-lost-rate',
      icon: AlertTriangle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
      label: 'Lost Rate',
      value: `${lostRate}%`,
      trendValue: 0,
      trendSuffix: '%',
      trendInvert: true,
      trendLabel: 'of total leads',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <StatCard key={card.id} {...card} />
      ))}
    </div>
  );
});

StatsCards.displayName = 'StatsCards';
export default StatsCards;
