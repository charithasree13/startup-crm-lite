/**
 * CSV Serialization and Download Helper Utilities
 * Implements RFC 4180-compliant escaping and client-side browser downloads.
 */

/**
 * Escapes a cell value for CSV formatting according to RFC 4180 rules.
 * Encloses the value in double quotes if it contains commas, double quotes, or newlines,
 * and escapes double quotes by doubling them.
 *
 * @param {*} value - The raw value of the cell.
 * @returns {string} The escaped and formatted string value.
 */
export const escapeCSV = (value) => {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value).trim();
  
  // Check if character escaping/quoting is required
  const needsQuotes =
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r');
    
  if (needsQuotes) {
    // RFC 4180: double-quotes within a field must be escaped by preceding them with another double-quote
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
};

/**
 * Converts an array of lead objects into a single CSV string.
 *
 * @param {Array<Object>} leads - Array of CRM lead objects.
 * @returns {string} The formatted CSV string.
 */
export const convertLeadsToCSV = (leads) => {
  if (!Array.isArray(leads) || leads.length === 0) {
    return '';
  }

  // Header row definition
  const headers = [
    'ID',
    'Name',
    'Company',
    'Email',
    'Phone',
    'Status',
    'Source',
    'Deal Value ($)',
    'Date Added'
  ];

  // Map each lead object to a row representation
  const rows = leads.map((lead) => {
    // Fallback date lookup
    const rawDate = lead.date || lead.createdAt || '';
    let formattedDate = '';
    if (rawDate) {
      const dateObj = new Date(rawDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      } else {
        formattedDate = rawDate;
      }
    }

    return [
      lead.id || '',
      lead.name || '',
      lead.company || '',
      lead.email || '',
      lead.phone || '',
      lead.status || 'New',
      lead.source || 'Website',
      lead.value !== undefined ? String(lead.value) : '',
      formattedDate
    ].map(escapeCSV);
  });

  // Combine headers and rows
  return [headers, ...rows]
    .map((rowArray) => rowArray.join(','))
    .join('\r\n');
};

/**
 * Triggers a client-side browser file download for a given CSV string content.
 *
 * @param {string} csvContent - The fully constructed CSV string.
 * @param {string} filename - The name of the file to save as (e.g. 'leads.csv').
 */
export const downloadCSV = (csvContent, filename = 'leads.csv') => {
  // UTF-8 BOM to ensure compatibility with Excel character recognition
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Standard anchor tag download approach
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Converts lead objects to CSV and triggers browser download.
 *
 * @param {Array<Object>} leads - Array of CRM lead objects.
 * @param {string} filename - The filename for the download.
 */
export const exportLeadsToCSV = (leads, filename = 'Startup_CRM_Leads.csv') => {
  const csvContent = convertLeadsToCSV(leads);
  if (!csvContent) {
    throw new Error('No lead data to export');
  }
  downloadCSV(csvContent, filename);
};
