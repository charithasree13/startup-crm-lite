/**
 * Analytics Color Palette
 * Centralized color definitions for all analytics charts and visualizations.
 * Aligned with the CRM pipeline status stages using dynamic CSS variables.
 */

/** Colors keyed by lead status stage */
export const STATUS_COLORS = {
  New: 'var(--text-secondary)',
  Contacted: 'var(--secondary)',
  'Meeting Scheduled': 'var(--warning)',
  'Proposal Sent': 'var(--accent)',
  Won: 'var(--success)',
  Lost: 'var(--error)',
};

/** Short aliases used in funnel/chart labels */
export const STATUS_COLORS_SHORT = {
  New: 'var(--text-secondary)',
  Contacted: 'var(--secondary)',
  Meeting: 'var(--warning)',
  Proposal: 'var(--accent)',
  Won: 'var(--success)',
  Lost: 'var(--error)',
};

/** Lead source channel colors */
export const SOURCE_COLORS = {
  Website: 'var(--primary)',
  Referral: 'var(--success)',
  LinkedIn: 'var(--accent)',
  'Cold Call': 'var(--warning)',
  'Email Campaign': 'var(--secondary)',
  Other: 'var(--text-secondary)',
};

/** Chart gradient / brand palette */
export const CHART_COLORS = {
  primary: 'var(--primary)',
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger: 'var(--error)',
  purple: 'var(--secondary)',
  slate: 'var(--text-secondary)',
  cyan: 'var(--accent)',
  pink: 'var(--accent)',
};

/** Heatmap intensity scale (low → high) */
export const HEATMAP_COLORS = [
  'var(--heatmap-0)', // 0 activity
  'var(--heatmap-1)', // low
  'var(--heatmap-2)',
  'var(--heatmap-3)',
  'var(--heatmap-4)',
  'var(--heatmap-5)', // high
];

/** Ordered funnel stage colors */
export const FUNNEL_COLORS = [
  'var(--text-secondary)', // New
  'var(--secondary)',       // Contacted
  'var(--warning)',         // Meeting
  'var(--accent)',          // Proposal
  'var(--success)',         // Won
];
