// Import all required components from the recharts library for interactive charts
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
// Import lucide-react icons for dashboard headings and stat cards
import { TrendingUp, Award, Target } from 'lucide-react';

// Define the Analytics component as a functional React component
export default function Analytics() {
  // Define mock timeline data for Lead Growth over the last 6 months
  const monthlyData = [
    { name: 'Jan', Leads: 120, Conversions: 40 },
    { name: 'Feb', Leads: 150, Conversions: 55 },
    { name: 'Mar', Leads: 220, Conversions: 70 },
    { name: 'Apr', Leads: 180, Conversions: 60 },
    { name: 'May', Leads: 270, Conversions: 90 },
    { name: 'Jun', Leads: 340, Conversions: 110 },
  ];

  // Define mock categoric data representing the sources of leads
  const sourceData = [
    { name: 'Organic Search', value: 450, color: '#3B82F6' }, // Blue
    { name: 'Paid Ads', value: 300, color: '#10B981' },       // Emerald
    { name: 'Referrals', value: 200, color: '#8B5CF6' },      // Purple
    { name: 'Social Media', value: 150, color: '#F59E0B' },   // Amber
  ];

  // Define summary KPI statistics for the top row of the analytics dashboard
  const analyticsSummary = [
    {
      title: 'Average Conversion Rate',
      value: '24.8%',
      change: '+2.4% vs last month',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
    },
    {
      title: 'Deals Closed Won',
      value: '118 Deals',
      change: '+14% growth rate',
      icon: Award,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Total Pipeline Target',
      value: '$250,000',
      change: '82% of target reached',
      icon: Target,
      color: 'text-purple-600 bg-purple-50 border-purple-100',
    },
  ];

  // Return the JSX representing the Analytics page layout
  return (
    // Outer content layout container styled with page transition animations
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section containing page title and descriptive explanation */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Performance Analytics</h1>
        <p className="text-slate-500 mt-1">Deep-dive insights into conversion metrics, traffic acquisition, and pipeline growth.</p>
      </div>

      {/* Grid container for quick summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map over the analyticsSummary metrics array and render cards */}
        {analyticsSummary.map((summary, index) => {
          // Resolve dynamic Icon component from lucide icons
          const Icon = summary.icon;
          return (
            <div key={index} className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center shadow-xs">
              {/* Dynamic color-coded circle holding the metric icon */}
              <div className={`p-4 rounded-xl border ${summary.color} mr-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                {/* Title label of the metric */}
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{summary.title}</p>
                {/* Metric value styled with bold typography */}
                <p className="text-2xl font-bold text-slate-800 mt-1">{summary.value}</p>
                {/* Subtext description detailing percentage change */}
                <p className="text-xs text-slate-500 mt-0.5">{summary.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid container for complex charts: Left area chart, right pie chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Lead Trends Chart: Occupies 2 columns on large screens */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Acquisition & Conversion Trends</h2>
              <p className="text-xs text-slate-400">Monthly breakdown of incoming leads vs. qualified conversions</p>
            </div>
          </div>
          {/* Responsive chart container. Standard height set to 300px */}
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* Area chart mapping monthly metrics */}
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                {/* Visual grid behind chart plots */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                {/* Horizontal time label axis */}
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                {/* Vertical value range axis */}
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                {/* Custom tooltip displaying data details on cursor hover */}
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#FFF' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                {/* Legend display identifier */}
                <Legend verticalAlign="top" height={36} iconType="circle" />
                {/* Area plots mapping leads progression */}
                <Area 
                  type="monotone" 
                  dataKey="Leads" 
                  stroke="#3B82F6" 
                  fillOpacity={0.1} 
                  fill="url(#colorLeads)" 
                  strokeWidth={2}
                />
                {/* Area plots mapping conversions progress */}
                <Area 
                  type="monotone" 
                  dataKey="Conversions" 
                  stroke="#10B981" 
                  fillOpacity={0.1} 
                  fill="url(#colorConversions)" 
                  strokeWidth={2}
                />
                {/* SVG definitions for gradient fills under areas */}
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources Distribution: Occupies 1 column */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Lead Sources</h2>
            <p className="text-xs text-slate-400 mb-6">Percentage share of marketing acquisition channels</p>
          </div>
          {/* Pie Chart display inside container */}
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              {/* Pie chart with custom inner radius for doughnut effect */}
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {/* Map over data objects and assign custom color cell fills */}
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {/* Interactive hover tooltips */}
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: 'none', color: '#FFF' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Absolute positioning overlay text inside doughnut hole */}
            <div className="absolute text-center">
              <span className="text-2xl font-black text-slate-800">1,100</span>
              <span className="block text-xxs font-semibold text-slate-400 uppercase tracking-wider">Total Leads</span>
            </div>
          </div>
          {/* Custom legend details mapping colors to categories below charts */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {sourceData.map((source, index) => (
              <div key={index} className="flex items-center text-xs font-semibold text-slate-600">
                <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: source.color }}></span>
                <span className="truncate">{source.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
