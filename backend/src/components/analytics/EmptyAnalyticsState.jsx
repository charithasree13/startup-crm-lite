/**
 * EmptyAnalyticsState Component
 * Displayed when there are no leads to analyze.
 * Provides a clear call-to-action to add the first lead.
 */

import { memo } from 'react';
import { BarChart3, PlusCircle, TrendingUp, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyAnalyticsState = memo(() => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Decorative background icons */}
      <div className="relative mb-8">
        {/* Floating chart icons */}
        <div className="absolute -top-4 -left-10 w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center opacity-60 rotate-[-12deg]">
          <TrendingUp className="w-5 h-5 text-blue-500" />
        </div>
        <div className="absolute -top-2 -right-10 w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center opacity-60 rotate-[12deg]">
          <PieChart className="w-5 h-5 text-purple-500" />
        </div>

        {/* Main icon */}
        <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-100 border border-blue-100">
          <BarChart3 className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text content */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
        No analytics available yet
      </h2>
      <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed mb-8">
        Add your first lead to start tracking business performance, conversion
        trends, and revenue growth.
      </p>

      {/* Feature previews */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm w-full">
        {[
          { label: 'Conversion Rate', value: '--' },
          { label: 'Pipeline Value', value: '₹0' },
          { label: 'Won Revenue', value: '₹0' },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-xl p-3 text-center"
          >
            <p className="text-lg font-bold text-slate-300">{item.value}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        id="empty-analytics-add-lead-btn"
        onClick={() => navigate('/leads')}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5"
      >
        <PlusCircle className="w-5 h-5" />
        Add Lead
      </button>
    </div>
  );
});

EmptyAnalyticsState.displayName = 'EmptyAnalyticsState';
export default EmptyAnalyticsState;
