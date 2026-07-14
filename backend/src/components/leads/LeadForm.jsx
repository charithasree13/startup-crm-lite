import { useState } from 'react';

/**
 * @typedef {Object} LeadFormData
 * @property {number|string} [id] - Unique identifier (present in edit mode).
 * @property {string} name - Contact name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} phone - Phone number.
 * @property {string} status - Funnel status.
 * @property {string} source - Marketing source.
 * @property {string} [date] - Date lead was added.
 */

/**
 * @typedef {Object} LeadFormProps
 * @property {LeadFormData} [initialData] - Optional initial data for pre-populating fields in edit mode.
 * @property {function} onSubmit - Callback function called when the form is successfully submitted.
 * @property {function} onCancel - Callback function called when the cancel button is clicked.
 */

/**
 * LeadForm Component
 * Renders a form containing text fields and dropdown selects to capture lead details.
 * Implements validation for required fields, accessibility attributes, and focus styling.
 *
 * @param {LeadFormProps} props - Component properties.
 * @returns {React.JSX.Element} The rendered LeadForm component.
 */
export default function LeadForm({ initialData, onSubmit, onCancel }) {
  // Setup standard list of CRM options
  const statusOptions = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sourceOptions = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

  // Initialize form state directly from initialData props
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    company: initialData?.company || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    status: initialData?.status || 'New',
    source: initialData?.source || 'Website',
    value: initialData?.value !== undefined ? initialData.value : '',
  });

  // Keep track of validation error messages
  const [errors, setErrors] = useState({});

  /**
   * Input Change Handler
   * Updates state and clears corresponding validation error when user types.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when the field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Validates the form data inputs.
   *
   * @returns {boolean} True if form is valid, false otherwise.
   */
  const validateForm = () => {
    const newErrors = {};

    // Validate Name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    // Validate Company
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    // Validate Email
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate Value
    if (formData.value && isNaN(Number(formData.value))) {
      newErrors.value = 'Deal value must be a number';
    } else if (formData.value && Number(formData.value) < 0) {
      newErrors.value = 'Deal value cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Form Submission Handler
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Pass the updated form data back to the parent component
      onSubmit({
        ...initialData, // Preserve id and date if editing
        ...formData,
        value: formData.value === '' ? 0 : Number(formData.value),
      });
    }
  };

  const isEditMode = !!initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Title */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {isEditMode ? 'Edit Lead Details' : 'Add New Lead'}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-0.5">
          {isEditMode ? 'Modify existing lead profile parameters.' : 'Fill in the credentials to insert a lead.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Lead Name */}
        <div className="flex flex-col">
          <label htmlFor="lead-name" className="text-xs font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lead-name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'lead-name-error' : undefined}
            className={`w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 dark:text-slate-200 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-slate-800 transition-all duration-200 ${
              errors.name ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.name && (
            <span id="lead-name-error" className="text-xs text-red-500 mt-1 font-medium">
              {errors.name}
            </span>
          )}
        </div>

        {/* Company Name */}
        <div className="flex flex-col">
          <label htmlFor="lead-company" className="text-xs font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-1.5">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lead-company"
            name="company"
            type="text"
            placeholder="Enterprise Inc."
            value={formData.company}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.company ? 'true' : 'false'}
            aria-describedby={errors.company ? 'lead-company-error' : undefined}
            className={`w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 dark:text-slate-200 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-slate-800 transition-all duration-200 ${
              errors.company ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.company && (
            <span id="lead-company-error" className="text-xs text-red-500 mt-1 font-medium">
              {errors.company}
            </span>
          )}
        </div>

        {/* Email Address */}
        <div className="flex flex-col">
          <label htmlFor="lead-email" className="text-xs font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-1.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            placeholder="johndoe@company.com"
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'lead-email-error' : undefined}
            className={`w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 dark:text-slate-200 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-slate-800 transition-all duration-200 ${
              errors.email ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.email && (
            <span id="lead-email-error" className="text-xs text-red-500 mt-1 font-medium">
              {errors.email}
            </span>
          )}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label htmlFor="lead-phone" className="text-xs font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-1.5">
            Phone Number
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-slate-800 transition-all duration-200"
          />
        </div>

        {/* Deal Value */}
        <div className="flex flex-col">
          <label htmlFor="lead-value" className="text-xs font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-1.5">
            Deal Value ($)
          </label>
          <input
            id="lead-value"
            name="value"
            type="number"
            placeholder="0"
            value={formData.value}
            onChange={handleChange}
            min="0"
            step="any"
            aria-invalid={errors.value ? 'true' : 'false'}
            aria-describedby={errors.value ? 'lead-value-error' : undefined}
            className={`w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 dark:text-slate-200 border rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-slate-800 transition-all duration-200 ${
              errors.value ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700'
            }`}
          />
          {errors.value && (
            <span id="lead-value-error" className="text-xs text-red-500 mt-1 font-medium">
              {errors.value}
            </span>
          )}
        </div>

        {/* Lead Status */}
        <div className="flex flex-col">
          <label htmlFor="lead-status" className="text-xs font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-1.5">
            Lead Status Stage
          </label>
          <select
            id="lead-status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-slate-800 transition-all duration-200"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Marketing Lead Source */}
        <div className="flex flex-col">
          <label htmlFor="lead-source" className="text-xs font-semibold text-slate-600 dark:text-slate-400 dark:text-slate-500 mb-1.5">
            Marketing Source
          </label>
          <select
            id="lead-source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-slate-800 transition-all duration-200"
          >
            {sourceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Button controls group */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          {isEditMode ? 'Save Changes' : 'Create Lead'}
        </button>
      </div>
    </form>
  );
}
