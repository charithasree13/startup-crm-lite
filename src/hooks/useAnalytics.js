/**
 * useAnalytics Hook
 * Computes all analytics metrics from the lead dataset.
 * Memoized to prevent unnecessary recalculations on unrelated renders.
 */

import { useMemo } from 'react';
import { useLeads } from '../context/LeadContext';
import {
  filterLeadsByRange,
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getConversionRate,
  getLostRate,
  getLeadSourceStats,
  getFunnelData,
  getSalesVelocity,
  getForecastRevenue,
  getTopPerformers,
  getActivityHeatmapData,
  getPeriodGrowth,
  getLastNMonths,
} from '../utils/analyticsHelpers';

/**
 * @param {string} dateRange - '7d' | '30d' | '90d' | 'year' | 'all'
 * @param {{ start: string, end: string } | null} customRange
 * @returns {object} All computed analytics data
 */
export function useAnalytics(dateRange = 'all', customRange = null) {
  const { leads } = useLeads();

  // --- Filtered Dataset ---
  const filteredLeads = useMemo(
    () => filterLeadsByRange(leads, dateRange, customRange),
    [leads, dateRange, customRange]
  );

  // --- Previous period leads (for growth comparison) ---
  const prevPeriodLeads = useMemo(() => {
    if (!Array.isArray(leads) || leads.length === 0) return [];
    const now = new Date();
    let days = 30;
    if (dateRange === '7d') days = 7;
    else if (dateRange === '30d') days = 30;
    else if (dateRange === '90d') days = 90;
    else if (dateRange === 'year') days = 365;
    else return [];

    const prevEnd = new Date(now);
    prevEnd.setDate(now.getDate() - days);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevEnd.getDate() - days);

    return leads.filter((lead) => {
      if (!lead?.createdAt) return false;
      const d = new Date(lead.createdAt);
      return d >= prevStart && d < prevEnd;
    });
  }, [leads, dateRange]);

  // --- KPI Metrics ---
  const totalLeads = filteredLeads.length;
  const prevTotalLeads = prevPeriodLeads.length;
  const leadGrowth = useMemo(
    () => getPeriodGrowth(totalLeads, prevTotalLeads),
    [totalLeads, prevTotalLeads]
  );

  const conversionRate = useMemo(
    () => Math.round(getConversionRate(filteredLeads) * 100),
    [filteredLeads]
  );
  const prevConversionRate = useMemo(
    () => Math.round(getConversionRate(prevPeriodLeads) * 100),
    [prevPeriodLeads]
  );
  const conversionGrowth = conversionRate - prevConversionRate;

  const pipelineValue = useMemo(() => getPipelineValue(filteredLeads), [filteredLeads]);
  const wonRevenue = useMemo(() => getWonRevenue(filteredLeads), [filteredLeads]);
  const prevWonRevenue = useMemo(() => getWonRevenue(prevPeriodLeads), [prevPeriodLeads]);
  const revenueGrowth = useMemo(
    () => getPeriodGrowth(wonRevenue, prevWonRevenue),
    [wonRevenue, prevWonRevenue]
  );

  const avgSalesCycle = useMemo(
    () => getAverageSalesCycle(filteredLeads),
    [filteredLeads]
  );

  const lostRate = useMemo(
    () => Math.round(getLostRate(filteredLeads) * 100),
    [filteredLeads]
  );

  // --- Chart Data ---
  const statusDistribution = useMemo(
    () => getStatusDistribution(filteredLeads),
    [filteredLeads]
  );

  const monthlyLeads = useMemo(
    () => getMonthlyLeads(filteredLeads),
    [filteredLeads]
  );

  const conversionByMonth = useMemo(
    () => getConversionByMonth(filteredLeads),
    [filteredLeads]
  );

  const revenueByMonth = useMemo(
    () => getRevenueByMonth(filteredLeads),
    [filteredLeads]
  );

  const leadSourceStats = useMemo(
    () => getLeadSourceStats(filteredLeads),
    [filteredLeads]
  );

  const funnelData = useMemo(
    () => getFunnelData(filteredLeads),
    [filteredLeads]
  );

  // --- Velocity & Forecast ---
  const salesVelocity = useMemo(
    () => getSalesVelocity(filteredLeads),
    [filteredLeads]
  );

  const forecastData = useMemo(
    () => getForecastRevenue(filteredLeads),
    [filteredLeads]
  );

  // --- Other Widgets ---
  const topPerformers = useMemo(
    () => getTopPerformers(filteredLeads),
    [filteredLeads]
  );

  const heatmapData = useMemo(
    () => getActivityHeatmapData(leads), // Heatmap always uses all leads for continuity
    [leads]
  );

  const isEmpty = leads.length === 0;
  const isFiltered = filteredLeads.length === 0 && leads.length > 0;

  return {
    // Raw
    filteredLeads,
    totalLeads,
    isEmpty,
    isFiltered,

    // KPIs
    leadGrowth,
    conversionRate,
    conversionGrowth,
    pipelineValue,
    wonRevenue,
    revenueGrowth,
    avgSalesCycle,
    lostRate,

    // Charts
    statusDistribution,
    monthlyLeads,
    conversionByMonth,
    revenueByMonth,
    leadSourceStats,
    funnelData,

    // Widgets
    salesVelocity,
    forecastData,
    topPerformers,
    heatmapData,
  };
}
