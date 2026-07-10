/**
 * Analytics Color Palette
 * Centralized color definitions for all analytics charts and visualizations.
 * Aligned with the CRM pipeline status stages.
 */

/** Colors keyed by lead status stage */
export const STATUS_COLORS = {
  New: '#94A3B8',
  Contacted: '#2563EB',
  'Meeting Scheduled': '#F59E0B',
  'Proposal Sent': '#7C3AED',
  Won: '#22C55E',
  Lost: '#EF4444',
};

/** Short aliases used in funnel/chart labels */
export const STATUS_COLORS_SHORT = {
  New: '#94A3B8',
  Contacted: '#2563EB',
  Meeting: '#F59E0B',
  Proposal: '#7C3AED',
  Won: '#22C55E',
  Lost: '#EF4444',
};

/** Lead source channel colors */
export const SOURCE_COLORS = {
  Website: '#3B82F6',
  Referral: '#22C55E',
  LinkedIn: '#0077B5',
  'Cold Call': '#F59E0B',
  'Email Campaign': '#8B5CF6',
  Other: '#94A3B8',
};

/** Chart gradient / brand palette */
export const CHART_COLORS = {
  primary: '#2563EB',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#7C3AED',
  slate: '#94A3B8',
  cyan: '#06B6D4',
  pink: '#EC4899',
};

/** Heatmap intensity scale (low → high) */
export const HEATMAP_COLORS = [
  '#F1F5F9', // 0 activity
  '#BFDBFE', // low
  '#93C5FD',
  '#60A5FA',
  '#3B82F6',
  '#1D4ED8', // high
];

/** Ordered funnel stage colors */
export const FUNNEL_COLORS = [
  '#94A3B8', // New
  '#2563EB', // Contacted
  '#F59E0B', // Meeting
  '#7C3AED', // Proposal
  '#22C55E', // Won
];
