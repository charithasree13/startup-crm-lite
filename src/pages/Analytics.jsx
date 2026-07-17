/**
 * Analytics Page
 * Production-ready analytics dashboard for Startup CRM Lite.
 * All data flows from useLeads() → useAnalytics() → chart components.
 * Fully memoized, responsive, and performant.
 */

import { useState, useCallback } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';

// Hook
import { useAnalytics } from '../hooks/useAnalytics';

// Analytics components
import AnalyticsFilters from '../components/analytics/AnalyticsFilters';
import StatsCards from '../components/analytics/StatsCards';
import PieChartCard from '../components/analytics/PieChartCard';
import FunnelChartCard from '../components/analytics/FunnelChartCard';
import BarChartCard from '../components/analytics/BarChartCard';
import LineChartCard from '../components/analytics/LineChartCard';
import RevenueChartCard from '../components/analytics/RevenueChartCard';
import LeadSourceChart from '../components/analytics/LeadSourceChart';
import SalesVelocityCard from '../components/analytics/SalesVelocityCard';
import ForecastCard from '../components/analytics/ForecastCard';
import ActivityHeatmap from '../components/analytics/ActivityHeatmap';
import TopPerformersCard from '../components/analytics/TopPerformersCard';
import EmptyAnalyticsState from '../components/analytics/EmptyAnalyticsState';


/**
 * Section wrapper — adds consistent heading + grid layout
 */
function Section({ title, children, cols = 2, className = '' }) {
  return (
    <div>
      {title && (
        <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-0.5">
          {title}
        </h2>
      )}
      <div className={`grid grid-cols-1 ${cols === 2 ? 'md:grid-cols-2' : cols === 3 ? 'md:grid-cols-3' : ''} gap-6 ${className}`}>
        {children}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [dateRange, setDateRange] = useState('all');
  const [customRange, setCustomRange] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const analytics = useAnalytics(dateRange, customRange);

  const handleRangeChange = useCallback((range) => {
    setDateRange(range);
  }, []);

  const handleCustomRange = useCallback((range) => {
    setCustomRange(range);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  // Show full empty state when no leads exist at all
  if (analytics.isEmpty) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm ml-10.5">
              Track sales performance, conversion trends, and growth insights.
            </p>
          </div>
        </div>
        <EmptyAnalyticsState />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 text-sm ml-10.5">
            Track sales performance, conversion trends, and growth insights.
          </p>
        </div>

        {/* Refresh button */}
        <button
          id="analytics-refresh-btn"
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-blue-600 border border-slate-200 dark:border-slate-700 hover:border-blue-300 px-3 py-2 rounded-lg transition-all duration-200 self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="relative">
        <AnalyticsFilters
          dateRange={dateRange}
          onRangeChange={handleRangeChange}
          customRange={customRange}
          onCustomRange={handleCustomRange}
        />
      </div>

      {/* ── Filtered empty state ─────────────────────────────────── */}
      {analytics.isFiltered ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold">No leads found in this date range.</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            Try selecting a broader range or switching to &quot;All Time&quot;.
          </p>
        </div>
      ) : (
        <>
          {/* ── KPI Cards ───────────────────────────────────────── */}
          <div>
            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Key Performance Indicators
            </h2>
            <StatsCards
              totalLeads={analytics.totalLeads}
              leadGrowth={analytics.leadGrowth}
              conversionRate={analytics.conversionRate}
              conversionGrowth={analytics.conversionGrowth}
              pipelineValue={analytics.pipelineValue}
              wonRevenue={analytics.wonRevenue}
              revenueGrowth={analytics.revenueGrowth}
              avgSalesCycle={analytics.avgSalesCycle}
              lostRate={analytics.lostRate}
            />
          </div>

          {/* ── Distribution & Funnel ───────────────────────────── */}
          <Section title="Pipeline Intelligence">
            <PieChartCard
              statusDistribution={analytics.statusDistribution}
              totalLeads={analytics.totalLeads}
            />
            <FunnelChartCard funnelData={analytics.funnelData} />
          </Section>

          {/* ── Trend Charts ────────────────────────────────────── */}
          <Section title="Trend Analysis">
            <BarChartCard monthlyLeads={analytics.monthlyLeads} />
            <LineChartCard conversionByMonth={analytics.conversionByMonth} />
          </Section>

          {/* ── Revenue & Sources ───────────────────────────────── */}
          <Section title="Revenue & Acquisition">
            <RevenueChartCard revenueByMonth={analytics.revenueByMonth} />
            <LeadSourceChart leadSourceStats={analytics.leadSourceStats} />
          </Section>

          {/* ── Activity Heatmap (full width) ───────────────────── */}
          <div>
            <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Activity Overview
            </h2>
            <ActivityHeatmap heatmapData={analytics.heatmapData} />
          </div>

          {/* ── Widgets Row ─────────────────────────────────────── */}
          <Section title="Insights & Intelligence" cols={3}>
            <ForecastCard forecastData={analytics.forecastData} />
            <SalesVelocityCard salesVelocity={analytics.salesVelocity} />
            <TopPerformersCard topPerformers={analytics.topPerformers} />
          </Section>
        </>
      )}
    </div>
  );
}
