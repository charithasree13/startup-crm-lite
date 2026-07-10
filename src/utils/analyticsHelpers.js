/**
 * Analytics Helper Functions
 * Pure, memoization-friendly utility functions for computing analytics metrics from lead data.
 * All functions perform defensive null/undefined handling.
 */

import { STATUS_COLORS } from '../constants/analyticsColors';

// ─── Status Normalization ────────────────────────────────────────────────────

/**
 * Normalizes status strings to handle both long and short forms.
 * e.g. "Meeting Scheduled" → "Meeting Scheduled" (kept), "Meeting" → matched
 */
const STATUS_ALIASES = {
  'Meeting Scheduled': 'Meeting Scheduled',
  'Proposal Sent': 'Proposal Sent',
  Meeting: 'Meeting Scheduled',
  Proposal: 'Proposal Sent',
};

const normalizeStatus = (status) => STATUS_ALIASES[status] || status || 'New';

// ─── Date Utilities ──────────────────────────────────────────────────────────

/** Returns a Date object from an ISO string, or null if invalid */
const toDate = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};

/** Returns "Jan", "Feb", etc. for a given Date */
const monthLabel = (date) =>
  date.toLocaleDateString('en-US', { month: 'short' });

/** Returns a YYYY-MM key for grouping */
const monthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

/**
 * Returns an array of the last N months as { key: "YYYY-MM", label: "Jan" }
 * from newest to oldest (reversed for chart order: oldest first).
 */
export const getLastNMonths = (n = 6) => {
  const months = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: monthKey(d), label: monthLabel(d) });
  }
  return months;
};

// ─── Date Range Filter ────────────────────────────────────────────────────────

/**
 * Filters leads by the selected date range string.
 * @param {Array} leads
 * @param {string} range - '7d' | '30d' | '90d' | 'year' | 'all'
 * @param {{ start: Date, end: Date }} [custom] - Only used when range === 'custom'
 * @returns {Array} filtered leads
 */
export const filterLeadsByRange = (leads, range, custom = null) => {
  if (!Array.isArray(leads)) return [];
  const now = new Date();

  let startDate = null;
  let endDate = now;

  switch (range) {
    case '7d':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 90);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'custom':
      if (custom?.start) startDate = new Date(custom.start);
      if (custom?.end) endDate = new Date(custom.end);
      break;
    default:
      return leads; // 'all'
  }

  return leads.filter((lead) => {
    const d = toDate(lead?.createdAt);
    if (!d) return false;
    if (startDate && d < startDate) return false;
    if (d > endDate) return false;
    return true;
  });
};

// ─── KPI Calculations ────────────────────────────────────────────────────────

/**
 * Returns count of leads by status as { status, count, color }[]
 * @param {Array} leads
 */
export const getStatusDistribution = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];

  const counts = {};
  leads.forEach((lead) => {
    const s = normalizeStatus(lead?.status);
    counts[s] = (counts[s] || 0) + 1;
  });

  return Object.entries(counts).map(([status, count]) => ({
    status,
    count,
    color: STATUS_COLORS[status] || '#94A3B8',
    percent: Math.round((count / leads.length) * 100),
  }));
};

/**
 * Returns pipeline value: sum of value for all non-Won, non-Lost leads.
 * @param {Array} leads
 */
export const getPipelineValue = (leads) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((l) => {
      const s = normalizeStatus(l?.status);
      return s !== 'Won' && s !== 'Lost';
    })
    .reduce((sum, l) => sum + (Number(l?.value) || 0), 0);
};

/**
 * Returns total won revenue.
 * @param {Array} leads
 */
export const getWonRevenue = (leads) => {
  if (!Array.isArray(leads)) return 0;
  return leads
    .filter((l) => normalizeStatus(l?.status) === 'Won')
    .reduce((sum, l) => sum + (Number(l?.value) || 0), 0);
};

/**
 * Returns win rate as a decimal (0–1).
 * @param {Array} leads
 */
export const getConversionRate = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return 0;
  const won = leads.filter((l) => normalizeStatus(l?.status) === 'Won').length;
  return won / leads.length;
};

/**
 * Returns lost rate as a decimal (0–1).
 * @param {Array} leads
 */
export const getLostRate = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return 0;
  const lost = leads.filter((l) => normalizeStatus(l?.status) === 'Lost').length;
  return lost / leads.length;
};

/**
 * Returns average sales cycle in days for Won leads.
 * Uses wonAt - createdAt. Falls back to contactedAt or current date if wonAt missing.
 * @param {Array} leads
 */
export const getAverageSalesCycle = (leads) => {
  if (!Array.isArray(leads)) return 0;
  const wonLeads = leads.filter((l) => normalizeStatus(l?.status) === 'Won');
  if (wonLeads.length === 0) return 0;

  const totalDays = wonLeads.reduce((sum, lead) => {
    const created = toDate(lead?.createdAt);
    const closed = toDate(lead?.wonAt) || new Date();
    if (!created) return sum;
    const diff = (closed - created) / (1000 * 60 * 60 * 24);
    return sum + Math.max(0, diff);
  }, 0);

  return Math.round(totalDays / wonLeads.length);
};

// ─── Monthly Aggregations ─────────────────────────────────────────────────────

/**
 * Returns monthly lead counts for the last 6 months.
 * @param {Array} leads
 * @returns {{ month: string, leads: number }[]}
 */
export const getMonthlyLeads = (leads) => {
  if (!Array.isArray(leads)) return [];
  const months = getLastNMonths(6);
  const groups = {};
  months.forEach(({ key, label }) => { groups[key] = { month: label, leads: 0 }; });

  leads.forEach((lead) => {
    const d = toDate(lead?.createdAt);
    if (!d) return;
    const k = monthKey(d);
    if (groups[k]) groups[k].leads += 1;
  });

  return months.map(({ key }) => groups[key]);
};

/**
 * Returns monthly conversion rate (won/total) for last 6 months.
 * @param {Array} leads
 * @returns {{ month: string, rate: number }[]}
 */
export const getConversionByMonth = (leads) => {
  if (!Array.isArray(leads)) return [];
  const months = getLastNMonths(6);
  const groups = {};
  months.forEach(({ key, label }) => {
    groups[key] = { month: label, total: 0, won: 0 };
  });

  leads.forEach((lead) => {
    const d = toDate(lead?.createdAt);
    if (!d) return;
    const k = monthKey(d);
    if (!groups[k]) return;
    groups[k].total += 1;
    if (normalizeStatus(lead?.status) === 'Won') groups[k].won += 1;
  });

  return months.map(({ key }) => {
    const g = groups[key];
    return {
      month: g.month,
      rate: g.total > 0 ? Math.round((g.won / g.total) * 100) : 0,
    };
  });
};

/**
 * Returns monthly won revenue for last 6 months.
 * @param {Array} leads
 * @returns {{ month: string, revenue: number }[]}
 */
export const getRevenueByMonth = (leads) => {
  if (!Array.isArray(leads)) return [];
  const months = getLastNMonths(6);
  const groups = {};
  months.forEach(({ key, label }) => { groups[key] = { month: label, revenue: 0 }; });

  leads.forEach((lead) => {
    if (normalizeStatus(lead?.status) !== 'Won') return;
    const d = toDate(lead?.wonAt) || toDate(lead?.createdAt);
    if (!d) return;
    const k = monthKey(d);
    if (groups[k]) groups[k].revenue += Number(lead?.value) || 0;
  });

  return months.map(({ key }) => groups[key]);
};

// ─── Lead Source ──────────────────────────────────────────────────────────────

/**
 * Returns lead source breakdown sorted by count descending.
 * @param {Array} leads
 * @returns {{ source: string, count: number }[]}
 */
export const getLeadSourceStats = (leads) => {
  if (!Array.isArray(leads)) return [];
  const counts = {};
  leads.forEach((lead) => {
    const s = lead?.source || 'Other';
    counts[s] = (counts[s] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
};

// ─── Funnel ───────────────────────────────────────────────────────────────────

const FUNNEL_STAGES = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won'];
const FUNNEL_LABELS = ['New', 'Contacted', 'Meeting', 'Proposal', 'Won'];

/**
 * Returns sales funnel data with stage counts and conversion rates.
 * @param {Array} leads
 */
export const getFunnelData = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) return [];

  // Count leads at or past each stage (cumulative funnel logic)
  const stageOrder = {
    New: 0,
    Contacted: 1,
    'Meeting Scheduled': 2,
    'Proposal Sent': 3,
    Won: 4,
    Lost: -1,
  };

  const stageCounts = FUNNEL_STAGES.map(() => 0);

  leads.forEach((lead) => {
    const s = normalizeStatus(lead?.status);
    const rank = stageOrder[s] ?? 0;
    if (rank < 0) return; // skip Lost from funnel count
    // count in all stages up to and including this one
    for (let i = 0; i <= rank && i < FUNNEL_STAGES.length; i++) {
      stageCounts[i] += 1;
    }
  });

  return FUNNEL_STAGES.map((stage, i) => {
    const count = stageCounts[i];
    const prev = i > 0 ? stageCounts[i - 1] : count;
    const conversionRate = prev > 0 ? Math.round((count / prev) * 100) : 0;
    const dropOff = 100 - conversionRate;
    return {
      stage: FUNNEL_LABELS[i],
      fullStage: stage,
      count,
      conversionRate,
      dropOff,
      fill: ['#94A3B8', '#2563EB', '#F59E0B', '#7C3AED', '#22C55E'][i],
    };
  });
};

// ─── Sales Velocity ───────────────────────────────────────────────────────────

/**
 * Calculates sales velocity: (Opportunities × Win Rate × Avg Deal Size) / Sales Cycle
 * @param {Array} leads
 * @returns {{ velocity: number, opportunities: number, winRate: number, avgDealSize: number, salesCycle: number }}
 */
export const getSalesVelocity = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) {
    return { velocity: 0, opportunities: 0, winRate: 0, avgDealSize: 0, salesCycle: 0 };
  }

  const active = leads.filter((l) => {
    const s = normalizeStatus(l?.status);
    return s !== 'Lost';
  });

  const won = leads.filter((l) => normalizeStatus(l?.status) === 'Won');
  const opportunities = active.length;
  const winRate = leads.length > 0 ? won.length / leads.length : 0;
  const avgDealSize =
    won.length > 0
      ? won.reduce((s, l) => s + (Number(l?.value) || 0), 0) / won.length
      : 0;
  const salesCycle = getAverageSalesCycle(leads) || 1;

  const velocity = (opportunities * winRate * avgDealSize) / salesCycle;

  return {
    velocity: Math.round(velocity),
    opportunities,
    winRate: Math.round(winRate * 100),
    avgDealSize: Math.round(avgDealSize),
    salesCycle,
  };
};

// ─── Revenue Forecast ─────────────────────────────────────────────────────────

/**
 * Forecasts next month revenue using average of last 6 months won revenue.
 * Includes confidence score based on data consistency (std deviation).
 * @param {Array} leads
 * @returns {{ forecast: number, confidence: number, trend: number }}
 */
export const getForecastRevenue = (leads) => {
  const monthly = getRevenueByMonth(leads);
  if (monthly.length === 0) return { forecast: 0, confidence: 0, trend: 0 };

  const revenues = monthly.map((m) => m.revenue);
  const avg = revenues.reduce((s, v) => s + v, 0) / revenues.length;

  // Standard deviation for confidence
  const variance =
    revenues.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / revenues.length;
  const stdDev = Math.sqrt(variance);
  const coeffVar = avg > 0 ? stdDev / avg : 1;
  // Confidence: 100% when no variance, lower when high variance
  const confidence = Math.round(Math.max(20, Math.min(95, (1 - coeffVar) * 100)));

  // Trend: compare last month vs average
  const lastMonth = revenues[revenues.length - 1] || 0;
  const trend = avg > 0 ? Math.round(((lastMonth - avg) / avg) * 100) : 0;

  // Forecast: weighted (recent 2 months weighted 2x + avg)
  const recent = revenues.slice(-2).reduce((s, v) => s + v, 0);
  const recentAvg = revenues.slice(-2).length > 0 ? recent / revenues.slice(-2).length : avg;
  const forecast = Math.round((avg + recentAvg) / 2 * 1.05); // 5% growth assumption

  return { forecast, confidence, trend };
};

// ─── Top Performers ───────────────────────────────────────────────────────────

/**
 * Returns top performing sales reps ranked by won revenue.
 * @param {Array} leads
 * @returns {{ owner: string, wonRevenue: number, wonCount: number, rank: number }[]}
 */
export const getTopPerformers = (leads) => {
  if (!Array.isArray(leads)) return [];

  const perfMap = {};
  leads.forEach((lead) => {
    const owner = lead?.owner || 'Unknown';
    if (!perfMap[owner]) perfMap[owner] = { owner, wonRevenue: 0, wonCount: 0, totalLeads: 0 };
    perfMap[owner].totalLeads += 1;
    if (normalizeStatus(lead?.status) === 'Won') {
      perfMap[owner].wonRevenue += Number(lead?.value) || 0;
      perfMap[owner].wonCount += 1;
    }
  });

  return Object.values(perfMap)
    .sort((a, b) => b.wonRevenue - a.wonRevenue)
    .slice(0, 5)
    .map((p, i) => ({ ...p, rank: i + 1 }));
};

// ─── Activity Heatmap ─────────────────────────────────────────────────────────

/**
 * Returns heatmap data for a calendar-month view (last 12 weeks).
 * Each entry: { date: "YYYY-MM-DD", count: number, level: 0-5 }
 * @param {Array} leads
 */
export const getActivityHeatmapData = (leads) => {
  if (!Array.isArray(leads)) return [];

  const activityMap = {};

  const addActivity = (isoDate) => {
    if (!isoDate) return;
    const d = toDate(isoDate);
    if (!d) return;
    const key = d.toISOString().slice(0, 10);
    activityMap[key] = (activityMap[key] || 0) + 1;
  };

  leads.forEach((lead) => {
    addActivity(lead?.createdAt);
    addActivity(lead?.contactedAt);
    addActivity(lead?.meetingAt);
  });

  // Build last 84 days (12 weeks)
  const result = [];
  const now = new Date();
  for (let i = 83; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const count = activityMap[key] || 0;
    // level 0-5 scale
    const level = count === 0 ? 0 : count <= 1 ? 1 : count <= 2 ? 2 : count <= 4 ? 3 : count <= 6 ? 4 : 5;
    result.push({ date: key, count, level });
  }
  return result;
};

// ─── Formatting Helpers ───────────────────────────────────────────────────────

/**
 * Formats a number as Indian Rupee (₹).
 * e.g. 1240000 → "₹12,40,000"
 */
export const formatINR = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
};

/**
 * Formats a percent change with + or – sign.
 * e.g. 12.5 → "+12.5%", -4 → "-4%"
 */
export const formatChange = (value) => {
  if (typeof value !== 'number') return '0%';
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

/**
 * Computes period-over-period growth % given current and previous counts.
 */
export const getPeriodGrowth = (current, previous) => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};
