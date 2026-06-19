
/**
 * @typedef {Object} Lead
 * @property {number|string} id - Unique identifier for the lead.
 * @property {string} name - Contact name of the lead.
 * @property {string} company - Company name.
 * @property {string} email - Email address of the lead.
 * @property {string} [phone] - Phone number of the lead.
 * @property {number} value - Estimated deal value.
 * @property {string} status - Pipeline status ('New', 'Contacted', 'Qualified', 'Lost').
 * @property {string} date - Date lead was added (YYYY-MM-DD).
 */

/**
 * @typedef {Object} RecentLeadsProps
 * @property {Lead[]} leads - Array of lead records to filter and display.
 */

/**
 * RecentLeads Component
 * Displays the 5 most recently added leads in a styled, responsive table.
 *
 * @param {RecentLeadsProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered RecentLeads component.
 */
export default function RecentLeads({ leads = [] }) {
  // Extract and sort leads by date descending, taking the top 5 records
  const recentLeads = [...leads]
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : (a.createdAt ? new Date(a.createdAt) : new Date(0));
      const dateB = b.date ? new Date(b.date) : (b.createdAt ? new Date(b.createdAt) : new Date(0));
      return dateB - dateA;
    })
    .slice(0, 5);

  /**
   * Formats a YYYY-MM-DD date string to a human-readable format.
   *
   * @param {string} dateStr - Date string to format.
   * @returns {string} Formatted date string (e.g., "Jun 15, 2026").
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-6 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Leads</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">
              Overview of the last 5 leads added to your workspace
            </p>
          </div>
        </div>

        {recentLeads.length === 0 ? (
          // Empty State
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
            No recent leads available.
          </div>
        ) : (
          /* Table Container with horizontal scrolling on mobile */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 pl-0">Lead Details</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right pr-0">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-sm text-slate-600 dark:text-slate-300">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors duration-150">
                    {/* Lead Name and Email */}
                    <td className="py-3.5 px-4 pl-0">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{lead.name}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">{lead.email}</div>
                    </td>
                    
                    {/* Company Name */}
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {lead.company}
                    </td>
                    
                    {/* Dynamic Color Status Badges */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          lead.status === 'New'
                            ? 'text-[#2563EB] bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/30'
                            : lead.status === 'Contacted'
                            ? 'text-[#F59E0B] bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/30'
                            : lead.status === 'Qualified'
                            ? 'text-[#22C55E] bg-green-50 border-green-100 dark:bg-emerald-950/30 dark:border-emerald-900/30'
                            : 'text-[#EF4444] bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900/30' // Lost
                        }`}
                      >
                        {lead.status || 'New'}
                      </span>
                    </td>
                    
                    {/* Date Added */}
                    <td className="py-3.5 px-4 text-right pr-0 text-slate-500 dark:text-slate-400 dark:text-slate-500 font-medium">
                      {formatDate(lead.date || lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
