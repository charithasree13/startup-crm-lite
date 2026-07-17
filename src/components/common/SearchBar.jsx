import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 * A controlled, debounced search input with search icon and clear button.
 *
 * @param {Object} props
 * @param {string} props.value - The current search query from the parent.
 * @param {function} props.onChange - Callback fired after a 300ms debounce with the new query string.
 * @returns {React.JSX.Element}
 */
export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef(null);

  // Sync local state when parent resets value externally (e.g. "Clear Filters")
  useEffect(() => {
    setTimeout(() => {
      setLocalValue(value);
    }, 0);
  }, [value]);

  // Debounce: propagate changes to parent after 300ms of inactivity
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValue]); // intentionally omitting onChange to avoid re-triggering on every render

  const handleClear = () => {
    setLocalValue('');
    onChange(''); // clear immediately, no debounce needed
  };

  return (
    <div className="relative w-full md:w-96">
      {/* Search Icon */}
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />

      {/* Input */}
      <input
        type="text"
        placeholder="Search by name, company, or email..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        aria-label="Search leads by name, company, or email"
        className="w-full pl-10 pr-10 py-2.5 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
      />

      {/* Clear Button — only visible when there is text */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-150 cursor-pointer"
          aria-label="Clear search"
          title="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
