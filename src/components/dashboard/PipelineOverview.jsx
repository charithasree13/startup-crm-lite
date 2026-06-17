
/**
 * @typedef {Object} Lead
 * @property {number|string} id - Unique identifier for the lead.
 * @property {string} name - Contact name of the lead.
 * @property {string} company - Company name.
 * @property {string} status - Pipeline status ('New', 'Contacted', 'Qualified', 'Lost').
 * @property {number} value - Estimated deal value.
 * @property {string} date - Date lead was added.
 */

/**
 * @typedef {Object} PipelineOverviewProps
 * @property {Lead[]} leads - Array of lead records to process.
 */

/**
 * PipelineOverview Component
 * Renders a segmented horizontal bar chart indicating the proportion of leads in each stage of the CRM pipeline.
 *
 * @param {PipelineOverviewProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered PipelineOverview component.
 */
export default function PipelineOverview({ leads = [] }) {
  const totalLeads = leads.length;

  // Group and count leads by status
  const counts = leads.reduce((acc, lead) => {
    const status = lead.status || 'New';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Define status configurations mapping to the exact requested CRM colors
  const statusConfigs = {
    New: {
      label: 'New',
      colorClass: 'bg-[#2563EB]', // Primary
      dotClass: 'bg-[#2563EB]',
      textClass: 'text-[#2563EB]',
    },
    Contacted: {
      label: 'Contacted',
      colorClass: 'bg-[#F59E0B]', // Warning
      dotClass: 'bg-[#F59E0B]',
      textClass: 'text-[#F59E0B]',
    },
    Qualified: {
      label: 'Qualified',
      colorClass: 'bg-[#22C55E]', // Success
      dotClass: 'bg-[#22C55E]',
      textClass: 'text-[#22C55E]',
    },
    Lost: {
      label: 'Lost',
      colorClass: 'bg-[#EF4444]', // Danger
      dotClass: 'bg-[#EF4444]',
      textClass: 'text-[#EF4444]',
    },
  };

  // Order of stages in a typical sales funnel
  const order = ['New', 'Contacted', 'Qualified', 'Lost'];

  // Map data into sorted pipeline segments
  const segments = order.map((status) => {
    const count = counts[status] || 0;
    const percentage = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
    const config = statusConfigs[status] || {
      label: status,
      colorClass: 'bg-slate-400',
      dotClass: 'bg-slate-400',
      textClass: 'text-slate-400',
    };
    return {
      status,
      count,
      percentage,
      ...config,
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs p-6 flex flex-col h-full justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Pipeline Overview</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">
          Distribution of lead stages across your active sales funnel
        </p>

        {totalLeads === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full mb-3" />
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No leads in pipeline</p>
          </div>
        ) : (
          <div>
            {/* Horizontal Segmented Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden flex shadow-inner">
              {segments
                .filter((seg) => seg.count > 0)
                .map((segment) => (
                  <div
                    key={segment.status}
                    style={{ width: `${segment.percentage}%` }}
                    className={`${segment.colorClass} h-full transition-all duration-500 hover:brightness-95 relative group cursor-pointer first:rounded-l-full last:rounded-r-full`}
                  >
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded shadow-md whitespace-nowrap">
                      {segment.label}: {segment.count} ({segment.percentage.toFixed(1)}%)
                    </div>
                  </div>
                ))}
            </div>

            {/* Pipeline Stage Legend and Details */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {segments.map((segment) => (
                <div 
                  key={segment.status} 
                  className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span className={`w-3 h-3 rounded-full ${segment.dotClass} shrink-0 shadow-xs`} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate">
                      {segment.label}
                    </p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                      {segment.count}{' '}
                      <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                        ({segment.percentage.toFixed(0)}%)
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {totalLeads > 0 && (
        <div className="border-t border-slate-50 dark:border-slate-800/50 pt-4 mt-6 flex justify-between items-center text-xs font-semibold text-slate-400 dark:text-slate-500">
          <span>Active Opportunities</span>
          <span className="text-slate-800 dark:text-slate-200">
            {totalLeads} Total Leads
          </span>
        </div>
      )}
    </div>
  );
}
