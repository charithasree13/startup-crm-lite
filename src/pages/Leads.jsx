import { useState, useMemo, useEffect } from 'react';
import { Plus, LayoutGrid, Table, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Import lead context hook for centralized state management
import { useLeads } from '../context/LeadContext';

// Import our custom CRUD components
import LeadForm from '../components/leads/LeadForm';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';

// Import the Search, Filter, and Empty State components
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import EmptyState from '../components/common/EmptyState';

/**
 * Leads Component
 * Main page for managing CRM leads. Consumes centralized lead state from LeadContext,
 * manages local UI state (search, filters, modal, view mode), and supports
 * toggling between Card and Table layout modes.
 *
 * @returns {React.JSX.Element} The rendered Leads page.
 */
export default function Leads() {
  // Pull centralized lead state and CRUD functions from context
  const { leads, addLead, updateLead, deleteLead } = useLeads();

  // Local UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  /**
   * Action: Closes modal and resets state variables
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  // Accessibility: Handle Escape key to close the modal automatically
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // useMemo hook to filter results dynamically and efficiently
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => activeFilter === 'All' || lead.status === activeFilter)
      .filter((lead) =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [leads, searchQuery, activeFilter]);

  /**
   * Action: Clear all search and filter state
   */
  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveFilter('All');
  };

  /**
   * Action: Open modal to create a new lead
   */
  const handleOpenAddModal = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  /**
   * Action: Open modal to edit an existing lead
   * @param {Object} lead - Lead model data
   */
  const handleOpenEditModal = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  /**
   * Action Handler: Form Submission
   * Handles both creation and editing depending on if selectedLead is set.
   * Delegates to LeadContext's addLead / updateLead.
   *
   * @param {Object} formData - Form input values
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Edit Mode: Update existing lead via context
      updateLead(selectedLead.id, formData);
      toast.success(`Lead for "${formData.name}" updated successfully!`, {
        icon: '✓',
        style: {
          background: '#ECFDF5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });
    } else {
      // Create Mode: Add new lead via context (id + createdAt auto-generated)
      addLead(formData);
      toast.success(`Lead for "${formData.name}" created successfully!`, {
        icon: '✓',
        style: {
          background: '#ECFDF5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });
    }
    handleCloseModal();
  };

  /**
   * Action Handler: Delete Lead
   * Removes lead record via context and triggers red alert toast notification.
   * @param {number|string} id - Lead unique ID
   */
  const handleDeleteLead = (id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    if (!leadToDelete) return;

    if (window.confirm(`Are you sure you want to delete lead "${leadToDelete.name}"?`)) {
      deleteLead(id);
      toast.error(`Lead for "${leadToDelete.name}" has been deleted.`, {
        icon: '🗑️',
        style: {
          background: '#FEF2F2',
          color: '#991B1B',
          border: '1px solid #FCA5A5',
        },
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">Lead Management</h1>
          <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
            Organize, follow up, and track your potential clients and pipeline value.
          </p>
        </div>
        
        {/* Create Lead Trigger Button */}
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-sm"
          aria-haspopup="dialog"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span>Add New Lead</span>
        </button>
      </div>

      {/* Control Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        
        {/* Top Row: Search + View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* SearchBar Component */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          {/* Table/Card View Toggle Button Group (Hidden on mobile) */}
          <div className="hidden md:flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300'
              }`}
              aria-label="Table Layout View"
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300'
              }`}
              aria-label="Card Grid Layout View"
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row: FilterBar Component */}
        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          leads={leads}
        />
      </div>

      {/* Main List Display (Conditional rendering based on active viewMode) */}
      <div>
        {filteredLeads.length === 0 ? (
          // Empty State Component
          <EmptyState
            totalLeads={leads.length}
            onClearFilters={handleClearFilters}
          />
        ) : (
          <>
            {/* Desktop Table Layout (Hidden on mobile, only shown on md+ when viewMode is table) */}
            <div className={`hidden ${viewMode === 'table' ? 'md:block' : ''}`}>
              <LeadTable
                leads={filteredLeads}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteLead}
              />
            </div>
            
            {/* Mobile-friendly / Responsive Card Grid Layout (Always shown on mobile, conditional on md+) */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${viewMode === 'table' ? 'max-md:grid md:hidden' : ''}`}>
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal dialog block (Create / Edit Form Modal) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-0 md:p-4 z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full h-full md:max-w-lg md:h-auto rounded-none md:rounded-2xl p-6 shadow-xl relative animate-scale-in overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-all cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Embedded Form Component */}
            <LeadForm
              key={selectedLead?.id || 'new'}
              initialData={selectedLead}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
