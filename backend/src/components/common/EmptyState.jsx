import { SearchX, Inbox } from 'lucide-react';

/**
 * EmptyState Component
 * Shows a friendly empty-state message when no leads match the current search/filter.
 * Displays a different message depending on whether the entire database is empty
 * or just the current filters returned zero results.
 *
 * @param {Object} props
 * @param {number} props.totalLeads - Total number of leads before any filtering.
 * @param {function} [props.onClearFilters] - Optional callback to clear search/filter state.
 * @returns {React.JSX.Element}
 */
export default function EmptyState({ totalLeads = 0, onClearFilters }) {
  const isDbEmpty = totalLeads === 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-16 px-6 text-center shadow-xs animate-fade-in">
      {/* Icon */}
      <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 mb-5">
        {isDbEmpty ? (
          <Inbox className="w-7 h-7 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" />
        ) : (
          <SearchX className="w-7 h-7 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500" />
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
        {isDbEmpty ? 'No leads in your pipeline' : 'No leads found'}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
        {isDbEmpty
          ? 'Get started by adding your first lead using the "Add New Lead" button above.'
          : 'No leads match your current search or filter criteria. Try adjusting your search terms or clearing the filters.'}
      </p>

      {/* Clear Filters Button — only when filtering is active */}
      {!isDbEmpty && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-5 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 rounded-xl transition-all duration-200 cursor-pointer"
        >
          Clear Search &amp; Filters
        </button>
      )}
    </div>
  );
}
