import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Users, Target, DollarSign, Clock } from 'lucide-react';

// Import our custom modular dashboard components
import StatsCard from '../components/dashboard/StatsCard';
import PipelineOverview from '../components/dashboard/PipelineOverview';
import RecentLeads from '../components/dashboard/RecentLeads';
import QuickActions from '../components/dashboard/QuickActions';

/**
 * Dashboard Component
 * Renders the main dashboard page containing KPI stats cards, quick action buttons,
 * the recent leads table, and a visual representation of the sales funnel pipeline.
 *
 * @returns {React.JSX.Element} The rendered Dashboard page.
 */
export default function Dashboard() {
  const navigate = useNavigate();

  // Mock leads array used to feed both RecentLeads and PipelineOverview components
  const sampleLeads = [
    { id: 1, name: 'Sarah Jenkins', company: 'Apex Global', email: 'sjenkins@apex.io', phone: '+1 (555) 234-5678', value: 12500, status: 'Qualified', date: '2026-06-12' },
    { id: 2, name: 'Michael Chen', company: 'NextGen Solutions', email: 'm.chen@nextgen.com', phone: '+1 (555) 876-5432', value: 8200, status: 'Contacted', date: '2026-06-14' },
    { id: 3, name: 'Elena Rostova', company: 'Siberia Tech', email: 'elena@siberia.tech', phone: '+7 (909) 123-4567', value: 25000, status: 'New', date: '2026-06-15' },
    { id: 4, name: 'Marcus Brody', company: 'Adventure Corp', email: 'brody@adventure.com', phone: '+1 (555) 345-6789', value: 5000, status: 'Lost', date: '2026-06-08' },
    { id: 5, name: 'David Miller', company: 'Miller Brewing', email: 'david@miller.co', phone: '+1 (555) 456-7890', value: 18500, status: 'Qualified', date: '2026-06-11' },
    { id: 6, name: 'Aisha Rahman', company: 'Indus Ventures', email: 'aisha@indus.vc', phone: '+91 98765 43210', value: 30000, status: 'New', date: '2026-06-15' },
    { id: 7, name: 'Oliver Hansen', company: 'Nordic Designs', email: 'oliver@nordic.dk', phone: '+45 33 44 55 66', value: 15000, status: 'Contacted', date: '2026-06-13' },
    { id: 8, name: 'Yuki Tanaka', company: 'Kyoto Robotics', email: 'tanaka@kyoto.jp', phone: '+81 75 123 4567', value: 45000, status: 'Qualified', date: '2026-06-10' },
  ];

  // High-level dashboard summary statistics
  const stats = [
    {
      title: 'Total Leads',
      value: '1,482',
      change: '+12.5%',
      icon: Users,
      color: 'primary',
    },
    {
      title: 'Active Opportunities',
      value: '328',
      change: '+8.3%',
      icon: Target,
      color: 'success',
    },
    {
      title: 'Pipeline Revenue',
      value: '$142,500',
      change: '+18.2%',
      icon: DollarSign,
      color: 'warning',
    },
    {
      title: 'Avg. Conversion Time',
      value: '14.2 Days',
      change: '-2.1 Days', // Decrease is positive trend, colored red/danger here to match color assignment
      icon: Clock,
      color: 'danger',
    },
  ];

  /**
   * Action Handler: Navigates to the Lead Management page to trigger adding a new lead.
   */
  const handleAddLead = () => {
    toast.success('Redirecting to Lead Management to add a lead...');
    navigate('/leads');
  };

  /**
   * Action Handler: Navigates directly to the Lead Management list page.
   */
  const handleViewLeads = () => {
    navigate('/leads');
  };

  /**
   * Action Handler: Simulates exporting lead workspace data to CSV.
   */
  const handleExportData = () => {
    const exportPromise = new Promise((resolve) => setTimeout(resolve, 1500));
    toast.promise(exportPromise, {
      loading: 'Preparing lead data export...',
      success: 'Startup_CRM_Leads.csv exported successfully!',
      error: 'Failed to export data.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Dashboard Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">CRM Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
          Welcome back! Here is a summary of your startup's pipeline activity.
        </p>
      </div>

      {/* Stats Cards Grid - Responsive: 1 col on mobile, 2 on tablet, 4 on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            color={stat.color}
          />
        ))}
      </div>

      {/* Quick Actions Panel */}
      <QuickActions
        onAddLead={handleAddLead}
        onViewLeads={handleViewLeads}
        onExportData={handleExportData}
      />

      {/* Two-Column Responsive Layout for Leads Details and Funnel Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads Table (Takes half space on desktop) */}
        <div>
          <RecentLeads leads={sampleLeads} />
        </div>

        {/* Funnel Pipeline Segment Bar (Takes 1/3 of space on desktop) */}
        <div>
          <PipelineOverview leads={sampleLeads} />
        </div>
      </div>
    </div>
  );
}
