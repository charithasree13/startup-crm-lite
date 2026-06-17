// Import NavLink from react-router-dom to enable spa links with active status highlighting
import { NavLink } from 'react-router-dom';
// Import essential icons from the lucide-react package to decorate navigation options
import { LayoutDashboard, Users, BarChart3, Rocket } from 'lucide-react';

// Define the Sidebar component as a functional React component
export default function Sidebar() {
  // Define navigation menu items containing pathways, display labels, and icons
  const menuItems = [
    {
      // Text label to show on UI
      label: 'Dashboard',
      // Internal route path
      path: '/',
      // Lucide icon component mapping
      icon: LayoutDashboard,
    },
    {
      label: 'Lead Management',
      path: '/leads',
      icon: Users,
    },
    {
      label: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
    },
  ];

  // Return the JSX representing the Sidebar UI layout
  return (
    // Sidebar container styled as a flex vertical stack with specific width and borders
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 shrink-0 shadow-xs">
      
      {/* Brand logo header area */}
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        {/* Decorative rocket icon badge representing the Startup theme */}
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <Rocket className="w-5.5 h-5.5" />
        </div>
        <div>
          {/* Main logo brand heading */}
          <h2 className="font-bold text-slate-800 text-lg leading-none">CRM Lite</h2>
          {/* Version / subtext label */}
          <span className="text-xxs font-semibold text-blue-500 tracking-wider uppercase">Startup Edition</span>
        </div>
      </div>

      {/* Main navigation menu list filling vertical workspace */}
      <nav className="flex-1 p-4 space-y-1.5">
        {/* Map over navigation configuration items */}
        {menuItems.map((item) => {
          // Resolve icon identifier into a React Component variable name
          const Icon = item.icon;
          return (
            // Render active router link
            <NavLink
              key={item.path}
              to={item.path}
              // Dynamic className function supplied by NavLink context to apply active states
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 shadow-xxs' // Active page styling
                    : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'          // Inactive page hover styling
                }`
              }
            >
              {/* Render navigation item icon */}
              <Icon className="w-5 h-5 shrink-0" />
              {/* Display text label */}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar footer section with disclaimer / version */}
      <div className="p-4 border-t border-slate-100 text-center">
        <p className="text-xxs font-semibold text-slate-400">© 2026 Startup CRM v1.0.0</p>
      </div>

    </aside>
  );
}
