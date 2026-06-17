import { Pencil, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * @typedef {Object} Lead
 * @property {number|string} id - Unique identifier.
 * @property {string} name - Contact name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} phone - Phone number.
 * @property {string} status - Funnel stage.
 * @property {string} source - Marketing lead origin.
 * @property {string} date - Date lead was added (YYYY-MM-DD).
 */

/**
 * @typedef {Object} LeadTableProps
 * @property {Lead[]} leads - Array of lead objects to render.
 * @property {function} onEdit - Callback triggered when the edit action is selected, receiving the lead object.
 * @property {function} onDelete - Callback triggered when the delete action is selected, receiving the lead ID.
 */

/**
 * LeadTable Component
 * Renders a list of leads in a clean, scrollable, and responsive tabular layout.
 *
 * @param {LeadTableProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered LeadTable component.
 */
export default function LeadTable({ leads = [], onEdit, onDelete }) {
  /**
   * Formats a YYYY-MM-DD date string to a human-readable format.
   *
   * @param {string} dateStr - Date string to format.
   * @returns {string} Formatted date.
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
      {leads.length === 0 ? (
        // Empty State
        <div className="py-16 text-center text-slate-400 dark:text-slate-500 font-medium">
          No leads match the active search or filters.
        </div>
      ) : (
        /* Responsive scroll wrapper */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Company</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Email / Phone</th>
                <th className="py-4 px-6">Source</th>
                <th className="py-4 px-6">Date Added</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-sm text-slate-600 dark:text-slate-300">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors duration-150"
                >
                  {/* Lead Name */}
                  <td className="py-4 px-6 font-semibold text-slate-800 dark:text-slate-200">
                    {lead.name}
                  </td>
                  
                  {/* Company */}
                  <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-300">
                    {lead.company}
                  </td>
                  
                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <StatusBadge status={lead.status || 'New'} />
                  </td>
                  
                  {/* Email & Phone */}
                  <td className="py-4 px-6">
                    <div className="flex flex-col space-y-1">
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="inline-flex items-center text-xs hover:text-blue-500 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                          {lead.email}
                        </a>
                      )}
                      {lead.phone && (
                        <span className="inline-flex items-center text-xs text-slate-400 dark:text-slate-500">
                          <Phone className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                          {lead.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  {/* Lead Source */}
                  <td className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400">
                    {lead.source || 'Website'}
                  </td>
                  
                  {/* Date Added */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                      {formatDate(lead.date)}
                    </span>
                  </td>
                  
                  {/* Edit and Delete Actions */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-all cursor-pointer"
                        aria-label={`Edit lead ${lead.name}`}
                        title="Edit Lead"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all cursor-pointer"
                        aria-label={`Delete lead ${lead.name}`}
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
