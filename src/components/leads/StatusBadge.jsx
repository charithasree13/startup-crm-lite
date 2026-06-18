/**
 * @typedef {Object} StatusBadgeProps
 * @property {string} status - The lead status stage ('New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost').
 */

/**
 * StatusBadge Component
 * Renders a pill-shaped, colored badge representing the lead's current stage in the sales funnel.
 *
 * @param {StatusBadgeProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered StatusBadge component.
 */
export default function StatusBadge({ status }) {
  // Map standard stages to specific aesthetic styles aligning with requirements
  const statusStyles = {
    New: 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    Contacted: 'text-amber-700 bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30',
    'Meeting Scheduled': 'text-purple-700 bg-purple-50 border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30',
    'Proposal Sent': 'text-blue-700 bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
    Won: 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30',
    Lost: 'text-rose-700 bg-rose-50 border-rose-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30',
  };

  const currentStyle = statusStyles[status] || statusStyles.New;

  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${currentStyle} transition-colors duration-150`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current shrink-0" />
      {status}
    </span>
  );
}
