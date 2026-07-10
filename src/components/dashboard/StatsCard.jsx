import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

/**
 * @typedef {Object} StatsCardProps
 * @property {string} title - The name of the metric (e.g., "Total Leads").
 * @property {string|number} value - The display value of the metric (e.g., "$142,500").
 * @property {React.ComponentType<{ className?: string }>} icon - The Lucide icon component to render.
 * @property {string} change - The percentage change vs last month (e.g., "+12.5%").
 * @property {string} color - Color theme ('primary', 'success', 'warning', 'danger') or Tailwind CSS classes.
 */

/**
 * StatsCard Component
 * Renders a key performance metric card containing an icon, the value, and a trend percentage change indicator.
 *
 * @param {StatsCardProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered StatsCard component.
 */
export default function StatsCard({ title, value, icon: Icon, change, color }) {
  // Determine trend direction (positive or negative) by inspecting the change string
  const isNegative = typeof change === 'string' && change.trim().startsWith('-');
  const isPositive = !isNegative;

  // Custom mapping to ensure exact matches with the requested CRM color palette
  const themeMap = {
    primary: 'text-[#2563EB] bg-blue-50 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/30',
    success: 'text-[#22C55E] bg-green-50 border-green-100 dark:bg-emerald-950/20 dark:border-emerald-900/30',
    warning: 'text-[#F59E0B] bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30',
    danger: 'text-[#EF4444] bg-red-50 border-red-100 dark:bg-red-950/20 dark:border-red-900/30',
  };

  // If color matches one of our custom keywords, use its classes. Otherwise, treat as raw tailwind class string.
  const resolvedColorClasses = themeMap[color?.toLowerCase()] || color || themeMap.primary;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-center justify-between">
        {/* Metric Icon Wrapper */}
        <div className={`p-3 rounded-xl border ${resolvedColorClasses} flex items-center justify-center shrink-0`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        
        {/* Trend / Percentage Change Pill */}
        {change && (
          <div className="flex items-center space-x-1">
            <span
              className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${
                isPositive
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/30 dark:border-emerald-900/30'
                  : 'text-red-700 bg-red-50 border-red-100 dark:text-red-400 dark:bg-red-950/30 dark:border-red-900/30'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 shrink-0" />
              )}
              {change}
            </span>
          </div>
        )}
      </div>
      
      {/* Metric Title and Big Value */}
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">{value}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-medium text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">{title}</p>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            vs last month
          </span>
        </div>
      </div>
    </div>
  );
}
