import { useMemo } from 'react';

/**
 * Status filter definitions with labels matching the lead pipeline stages.
 */
const STATUSES = [
  'All',
  'New',
  'Contacted',
  'Meeting Scheduled',
  'Proposal Sent',
  'Won',
  'Lost',
];

/**
 * FilterBar Component
 * A row of clickable pill buttons for filtering leads by status.
 * Active filter is highlighted with the primary blue color.
 * Each button displays a count of matching leads in parentheses.
 *
 * @param {Object} props
 * @param {string} props.activeFilter - Currently selected status filter.
 * @param {function} props.onFilterChange - Callback fired with the new status string.
 * @param {Array} props.leads - Full (unfiltered) leads array, used for computing counts.
 * @returns {React.JSX.Element}
 */
export default function FilterBar({ activeFilter, onFilterChange, leads = [] }) {
  // Pre-compute counts per status so we only iterate the array once
  const counts = useMemo(() => {
    const map = { All: leads.length };
    STATUSES.forEach((s) => {
      if (s !== 'All') map[s] = 0;
    });
    leads.forEach((lead) => {
      if (map[lead.status] !== undefined) {
        map[lead.status]++;
      }
    });
    return map;
  }, [leads]);

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter leads by status">
      {STATUSES.map((status) => {
        const isActive = activeFilter === status;
        return (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className={`
              inline-flex items-center px-3.5 py-1.5 text-sm font-medium rounded-lg
              transition-all duration-200 cursor-pointer select-none
              ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-200'
              }
            `}
            aria-pressed={isActive}
          >
            {status}
            <span
              className={`
                ml-1.5 text-xs font-semibold
                ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500'}
              `}
            >
              ({counts[status] ?? 0})
            </span>
          </button>
        );
      })}
    </div>
  );
}
