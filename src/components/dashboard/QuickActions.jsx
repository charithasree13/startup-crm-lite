import { Plus, List, Download } from 'lucide-react';

/**
 * @typedef {Object} QuickActionsProps
 * @property {function} onAddLead - Triggered when the user clicks 'Add New Lead'.
 * @property {function} onViewLeads - Triggered when the user clicks 'View All Leads'.
 * @property {function} onExportData - Triggered when the user clicks 'Export Data'.
 */

/**
 * QuickActions Component
 * Renders quick access buttons on the dashboard for adding leads, navigating, and exporting data.
 *
 * @param {QuickActionsProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered QuickActions component.
 */
export default function QuickActions({ onAddLead, onViewLeads, onExportData }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-6">
      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Quick Actions</h2>
      
      {/* Grid adapts to 1 column on mobile, 3 columns on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Add New Lead Action */}
        <button
          onClick={onAddLead}
          className="inline-flex items-center justify-center space-x-2 py-3 px-4 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-5 h-5 shrink-0" />
          <span>Add New Lead</span>
        </button>

        {/* View All Leads Action */}
        <button
          onClick={onViewLeads}
          className="inline-flex items-center justify-center space-x-2 py-3 px-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:shadow-xs transition-all duration-200 cursor-pointer"
        >
          <List className="w-5 h-5 text-slate-500 dark:text-slate-400 dark:text-slate-500 shrink-0" />
          <span>View All Leads</span>
        </button>

        {/* Export Data Action */}
        <button
          onClick={onExportData}
          className="inline-flex items-center justify-center space-x-2 py-3 px-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:shadow-xs transition-all duration-200 cursor-pointer"
        >
          <Download className="w-5 h-5 text-slate-500 dark:text-slate-400 dark:text-slate-500 shrink-0" />
          <span>Export Data</span>
        </button>
      </div>
    </div>
  );
}
