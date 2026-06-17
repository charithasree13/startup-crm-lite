import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Filter, LayoutGrid, Table, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Import our custom CRUD components
import LeadForm from '../components/leads/LeadForm';
import LeadCard from '../components/leads/LeadCard';
import LeadTable from '../components/leads/LeadTable';

/**
 * Leads Component
 * Main page for managing CRM leads. Houses the list state and filters, manages modal states
 * for creating/editing, and supports toggling between Card and Table layout modes.
 *
 * @returns {React.JSX.Element} The rendered Leads page.
 */
export default function Leads() {
  // Define default list of CRM leads representing realistic customer pipeline data
  const initialLeads = [
    { id: 1, name: 'Sarah Jenkins', company: 'Apex Global', email: 'sjenkins@apex.io', phone: '+1 (555) 234-5678', status: 'Meeting Scheduled', source: 'LinkedIn', date: '2026-06-12' },
    { id: 2, name: 'Michael Chen', company: 'NextGen Solutions', email: 'm.chen@nextgen.com', phone: '+1 (555) 876-5432', status: 'Contacted', source: 'Website', date: '2026-06-14' },
    { id: 3, name: 'Elena Rostova', company: 'Siberia Tech', email: 'elena@siberia.tech', phone: '+7 (909) 123-4567', status: 'New', source: 'Referral', date: '2026-06-15' },
    { id: 4, name: 'Marcus Brody', company: 'Adventure Corp', email: 'brody@adventure.com', phone: '+1 (555) 345-6789', status: 'Lost', source: 'Cold Call', date: '2026-06-08' },
    { id: 5, name: 'David Miller', company: 'Miller Brewing', email: 'david@miller.co', phone: '+1 (555) 456-7890', status: 'Meeting Scheduled', source: 'Email Campaign', date: '2026-06-11' },
    { id: 6, name: 'Aisha Rahman', company: 'Indus Ventures', email: 'aisha@indus.vc', phone: '+91 98765 43210', status: 'New', source: 'Website', date: '2026-06-15' },
    { id: 7, name: 'Oliver Hansen', company: 'Nordic Designs', email: 'oliver@nordic.dk', phone: '+45 33 44 55 66', status: 'Contacted', source: 'LinkedIn', date: '2026-06-13' },
    { id: 8, name: 'Yuki Tanaka', company: 'Kyoto Robotics', email: 'tanaka@kyoto.jp', phone: '+81 75 123 4567', status: 'Won', source: 'Referral', date: '2026-06-10' },
  ];

  // Component States
  const [leads, setLeads] = useState(() => {
    // Attempt to load leads from localStorage, fallback to initial mock list
    const stored = localStorage.getItem('startup_crm_leads');
    return stored ? JSON.parse(stored) : initialLeads;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
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

  // Sync leads list to localStorage when modified
  useEffect(() => {
    localStorage.setItem('startup_crm_leads', JSON.stringify(leads));
  }, [leads]);

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
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

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
   * @param {Object} formData - Form input values
   */
  const handleFormSubmit = (formData) => {
    if (selectedLead) {
      // Edit Mode: Update existing lead
      setLeads((prev) =>
        prev.map((lead) => (lead.id === selectedLead.id ? { ...lead, ...formData } : lead))
      );
      toast.success(`Lead for "${formData.name}" updated successfully!`, {
        icon: '✓',
        style: {
          background: '#ECFDF5',
          color: '#065F46',
          border: '1px solid #A7F3D0',
        },
      });
    } else {
      // Create Mode: Append new lead record
      const newLead = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
      };
      setLeads((prev) => [newLead, ...prev]);
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
   * Removes lead record and triggers red alert toast notification.
   * @param {number|string} id - Lead unique ID
   */
  const handleDeleteLead = (id) => {
    const leadToDelete = leads.find((l) => l.id === id);
    if (!leadToDelete) return;

    if (window.confirm(`Are you sure you want to delete lead "${leadToDelete.name}"?`)) {
      setLeads((prev) => prev.filter((lead) => lead.id !== id));
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
          <p className="text-slate-500 dark:text-slate-400 mt-1">
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
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Left Side: Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search leads"
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
          />
        </div>

        {/* Right Side: Filters and View Toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {/* Status Dropdown Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by Lead Status"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Meeting Scheduled">Meeting Scheduled</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Table/Card View Toggle Button Group */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
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
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
              }`}
              aria-label="Card Grid Layout View"
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Main List Display (Conditional rendering based on active viewMode) */}
      <div>
        {viewMode === 'table' ? (
          // Desktop Table Layout
          <LeadTable
            leads={filteredLeads}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteLead}
          />
        ) : (
          // Mobile-friendly / Responsive Card Grid Layout
          filteredLeads.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-16 text-center text-slate-400 dark:text-slate-500 font-medium shadow-xs">
              No leads match the active search or filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteLead}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Modal dialog block (Create / Edit Form Modal) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Modal Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-scale-in">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl transition-all cursor-pointer"
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
