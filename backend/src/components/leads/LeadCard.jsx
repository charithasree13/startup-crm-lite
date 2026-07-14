import { Pencil, Trash2, Mail, Phone, Calendar, Info, DollarSign } from 'lucide-react';
import StatusBadge from './StatusBadge';

/**
 * @typedef {Object} Lead
 * @property {number|string} id - Unique identifier for the lead.
 * @property {string} name - Contact name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} phone - Phone number.
 * @property {string} status - Funnel status ('New', 'Contacted', etc.).
 * @property {string} source - Marketing source ('Website', 'LinkedIn', etc.).
 * @property {string} date - Date lead was created (YYYY-MM-DD).
 */

/**
 * @typedef {Object} LeadCardProps
 * @property {Lead} lead - The lead record.
 * @property {function} onEdit - Callback triggered when edit button is clicked, receiving the lead object.
 * @property {function} onDelete - Callback triggered when delete button is clicked, receiving the lead ID.
 */

/**
 * LeadCard Component
 * Displays CRM lead details in a styled card layout designed for mobile screens or grid-based desktop viewports.
 *
 * @param {LeadCardProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered LeadCard component.
 */
export default function LeadCard({ lead, onEdit, onDelete }) {
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-350 p-6 flex flex-col justify-between h-full group">
      <div>
        {/* Header containing name and status badge */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
              {lead.name}
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">
              {lead.company}
            </p>
          </div>
          <div className="shrink-0">
            <StatusBadge status={lead.status || 'New'} />
          </div>
        </div>

        {/* Lead Details Body */}
        <div className="space-y-2.5 my-4 pt-3 border-t border-slate-50 dark:border-slate-800/60 text-sm text-slate-600 dark:text-slate-300">
          {/* Email Info */}
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center hover:text-blue-500 transition-colors"
              aria-label={`Send email to ${lead.email}`}
            >
              <Mail className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate">{lead.email}</span>
            </a>
          )}

          {/* Phone Info */}
          {lead.phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="truncate">{lead.phone}</span>
            </div>
          )}

          {/* Source Info */}
          {lead.source && (
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
              <Info className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500 shrink-0" />
              <span>Source: <span className="font-semibold text-slate-700 dark:text-slate-300">{lead.source}</span></span>
            </div>
          )}

          {/* Deal Value Info */}
          {lead.value !== undefined && (
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
              <DollarSign className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-500 shrink-0" />
              <span>Deal Value: <span className="font-semibold text-slate-700 dark:text-slate-300">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lead.value)}</span></span>
            </div>
          )}

          {/* Date Added */}
          {(lead.date || lead.createdAt) && (
            <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">
              <Calendar className="w-4 h-4 mr-2 shrink-0" />
              <span>Added: {formatDate(lead.date || lead.createdAt)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-50 dark:border-slate-800/60">
        <button
          onClick={() => onEdit(lead)}
          className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all cursor-pointer"
          aria-label={`Edit lead ${lead.name}`}
          title="Edit Lead"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(lead.id)}
          className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
          aria-label={`Delete lead ${lead.name}`}
          title="Delete Lead"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
