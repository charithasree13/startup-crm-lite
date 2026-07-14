import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Users, Target, DollarSign, Clock } from 'lucide-react';

// Import centralized state and CSV export utility
import { useLeads } from '../context/LeadContext';
import { exportLeadsToCSV } from '../utils/csvHelpers';

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
  const { leads } = useLeads();

  // Calculate dynamic stats from real leads
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const totalLeads = leads.length;

  // Leads Month-over-Month Growth
  const leadsThisMonth = leads.filter(l => new Date(l.createdAt || l.date) >= thisMonthStart).length;
  const leadsLastMonth = leads.filter(l => {
    const d = new Date(l.createdAt || l.date);
    return d >= lastMonthStart && d < thisMonthStart;
  }).length;
  const leadGrowth = leadsLastMonth > 0
    ? Math.round(((leadsThisMonth - leadsLastMonth) / leadsLastMonth) * 100)
    : (leadsThisMonth > 0 ? 100 : 0);
  const leadGrowthStr = `${leadGrowth >= 0 ? '+' : ''}${leadGrowth}%`;

  // Active Opportunities (New, Contacted, Meeting Scheduled, Proposal Sent)
  const activeOpportunitiesList = leads.filter(l => l.status !== 'Won' && l.status !== 'Lost');
  const activeOpportunitiesCount = activeOpportunitiesList.length;

  const activeThisMonth = activeOpportunitiesList.filter(l => new Date(l.createdAt || l.date) >= thisMonthStart).length;
  const activeLastMonth = leads.filter(l => {
    const d = new Date(l.createdAt || l.date);
    return l.status !== 'Won' && l.status !== 'Lost' && d >= lastMonthStart && d < thisMonthStart;
  }).length;
  const activeGrowth = activeLastMonth > 0
    ? Math.round(((activeThisMonth - activeLastMonth) / activeLastMonth) * 100)
    : (activeThisMonth > 0 ? 100 : 0);
  const activeGrowthStr = `${activeGrowth >= 0 ? '+' : ''}${activeGrowth}%`;

  // Pipeline Revenue (Sum of deal value for active opportunities)
  const pipelineRevenue = activeOpportunitiesList.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  const pipelineRevenueStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(pipelineRevenue);

  const pipelineRevenueThisMonth = activeOpportunitiesList
    .filter(l => new Date(l.createdAt || l.date) >= thisMonthStart)
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  const pipelineRevenueLastMonth = leads
    .filter(l => {
      const d = new Date(l.createdAt || l.date);
      return l.status !== 'Won' && l.status !== 'Lost' && d >= lastMonthStart && d < thisMonthStart;
    })
    .reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  const revenueGrowth = pipelineRevenueLastMonth > 0
    ? Math.round(((pipelineRevenueThisMonth - pipelineRevenueLastMonth) / pipelineRevenueLastMonth) * 100)
    : (pipelineRevenueThisMonth > 0 ? 100 : 0);
  const revenueGrowthStr = `${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth}%`;

  // Avg. Conversion Time (Won status leads, using wonAt or fallbacks)
  const wonLeads = leads.filter(l => l.status === 'Won');
  let avgConversionTime = 0;
  if (wonLeads.length > 0) {
    const totalDays = wonLeads.reduce((sum, l) => {
      const created = new Date(l.createdAt || l.date);
      const won = l.wonAt ? new Date(l.wonAt) : new Date(l.updatedAt || l.date || Date.now());
      const diff = (won - created) / (1000 * 60 * 60 * 24);
      return sum + Math.max(0, diff);
    }, 0);
    avgConversionTime = Number((totalDays / wonLeads.length).toFixed(1));
  }
  const avgConversionTimeStr = `${avgConversionTime} Days`;

  // Avg. Conversion Time trend (compare won leads this month vs last month)
  const wonThisMonth = wonLeads.filter(l => new Date(l.wonAt || l.updatedAt || l.date) >= thisMonthStart);
  const wonLastMonth = wonLeads.filter(l => {
    const d = new Date(l.wonAt || l.updatedAt || l.date);
    return d >= lastMonthStart && d < thisMonthStart;
  });
  let avgConversionThisMonth = 0;
  if (wonThisMonth.length > 0) {
    const totalDays = wonThisMonth.reduce((sum, l) => {
      const created = new Date(l.createdAt || l.date);
      const won = l.wonAt ? new Date(l.wonAt) : new Date(l.updatedAt || l.date || Date.now());
      const diff = (won - created) / (1000 * 60 * 60 * 24);
      return sum + Math.max(0, diff);
    }, 0);
    avgConversionThisMonth = totalDays / wonThisMonth.length;
  }
  let avgConversionLastMonth = 0;
  if (wonLastMonth.length > 0) {
    const totalDays = wonLastMonth.reduce((sum, l) => {
      const created = new Date(l.createdAt || l.date);
      const won = l.wonAt ? new Date(l.wonAt) : new Date(l.updatedAt || l.date || Date.now());
      const diff = (won - created) / (1000 * 60 * 60 * 24);
      return sum + Math.max(0, diff);
    }, 0);
    avgConversionLastMonth = totalDays / wonLastMonth.length;
  }
  const conversionTimeGrowth = avgConversionLastMonth > 0
    ? Number((avgConversionThisMonth - avgConversionLastMonth).toFixed(1))
    : (avgConversionThisMonth > 0 ? Number(avgConversionThisMonth.toFixed(1)) : 0);
  const conversionTimeGrowthStr = conversionTimeGrowth === 0 
    ? '0 Days'
    : `${conversionTimeGrowth > 0 ? '+' : ''}${conversionTimeGrowth} Days`;

  // High-level dashboard summary statistics
  const stats = [
    {
      title: 'Total Leads',
      value: totalLeads.toLocaleString(),
      change: leadGrowthStr,
      icon: Users,
      color: 'primary',
    },
    {
      title: 'Active Opportunities',
      value: activeOpportunitiesCount.toLocaleString(),
      change: activeGrowthStr,
      icon: Target,
      color: 'success',
    },
    {
      title: 'Pipeline Revenue',
      value: pipelineRevenueStr,
      change: revenueGrowthStr,
      icon: DollarSign,
      color: 'warning',
    },
    {
      title: 'Avg. Conversion Time',
      value: avgConversionTimeStr,
      change: conversionTimeGrowthStr,
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
   * Action Handler: Exports actual lead workspace data to CSV.
   */
  const handleExportData = () => {
    const exportPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!leads || leads.length === 0) {
            reject(new Error('No leads available to export.'));
            return;
          }
          exportLeadsToCSV(leads, 'Startup_CRM_Leads.csv');
          resolve();
        } catch (err) {
          reject(err);
        }
      }, 1000);
    });

    toast.promise(exportPromise, {
      loading: 'Preparing lead data export...',
      success: 'Startup_CRM_Leads.csv exported successfully!',
      error: (err) => err.message || 'Failed to export data.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Dashboard Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">CRM Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
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
          <RecentLeads leads={leads} />
        </div>

        {/* Funnel Pipeline Segment Bar (Takes 1/3 of space on desktop) */}
        <div>
          <PipelineOverview leads={leads} />
        </div>
      </div>
    </div>
  );
}
