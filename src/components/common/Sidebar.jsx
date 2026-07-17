import { useState } from 'react';
import { NavLink } from 'react-router-dom';
// Import essential icons from the lucide-react package to decorate navigation options
import { 
  LayoutDashboard, Users, BarChart3, Rocket, X, 
  Mail, Phone, LogOut 
} from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { useAuth } from '../../context/AuthContext';

// Define the Sidebar component as a functional React component
export default function Sidebar({ isMobileDrawerOpen, closeMobileDrawer }) {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden animate-fade-in"
          onClick={closeMobileDrawer}
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Mobile Drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col h-screen shrink-0 shadow-xs transition-all duration-300
        bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
        md:sticky md:top-0 md:translate-x-0 w-64 md:w-56 lg:w-64
        ${isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
      
      {/* Brand logo header area */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Decorative rocket icon badge representing the Startup theme */}
          <div className="w-10 h-10 shrink-0 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Rocket className="w-5.5 h-5.5" />
          </div>
          <div className="overflow-hidden whitespace-nowrap">
            {/* Main logo brand heading */}
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-none truncate">CRM Lite</h2>
            {/* Version / subtext label */}
            <span className="text-xxs font-semibold text-blue-500 tracking-wider uppercase truncate block">Startup Edition</span>
          </div>
        </div>
        
        {/* Close button for mobile drawer */}
        <button 
          onClick={closeMobileDrawer}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main navigation menu list filling vertical workspace */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {/* Map over navigation configuration items */}
        {menuItems.map((item) => {
          // Resolve icon identifier into a React Component variable name
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                // Close drawer on mobile when navigating
                if (window.innerWidth < 768) closeMobileDrawer();
              }}
              // Dynamic className function supplied by NavLink context to apply active states
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600 shadow-xxs' // Active page styling
                    : 'text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50' // Inactive page hover styling
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

      {/* Admin Profile Section */}
      {user && (
        <div className="relative p-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
          {/* Circular Avatar Trigger */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200/50 dark:border-blue-800/30 hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer focus:outline-hidden"
            aria-label="Toggle admin user details"
          >
            {user.username ? user.username.slice(0, 2).toUpperCase() : user.name.slice(0, 2).toUpperCase()}
          </button>

          {/* Floating Details Popover */}
          {isProfileOpen && (
            <>
              {/* Click-outside helper overlay */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsProfileOpen(false)} 
              />
              
              {/* Popover Card */}
              <div className="absolute bottom-16 left-4 right-4 z-50 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-slate-950/80 animate-fade-in space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100 dark:border-blue-800/20">
                    {user.username ? user.username.slice(0, 2).toUpperCase() : user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="overflow-hidden text-left">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-slate-850 dark:text-slate-200 text-xs truncate max-w-[90px]" title={user.username || user.name}>
                        {user.username || user.name}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-100 dark:border-emerald-900/30">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate" title={user.email}>{user.email}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 space-y-2 text-xxs font-semibold text-slate-550 dark:text-slate-400 text-left">
                  {user.mobile && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-450 dark:text-slate-500" />
                      <span>{user.mobile}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-450 dark:text-slate-500" />
                    <span className="truncate" title={user.email}>{user.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full mt-2 py-2 px-3 text-xs font-bold text-rose-600 dark:text-rose-455 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Sidebar footer section with disclaimer / version */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Theme</span>
          <DarkModeToggle />
        </div>
        <div className="text-center">
          <p className="text-xxs font-semibold text-slate-400 dark:text-slate-500 dark:text-slate-400 dark:text-slate-500">© 2026 Startup CRM v1.0.0</p>
        </div>
      </div>

    </aside>

    {/* Mobile Bottom Navigation (Hidden on Tablet/Desktop) */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-30 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.5)]">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full py-3 px-1 transition-colors duration-200 min-h-[44px] min-w-[44px] ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`
            }
          >
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-semibold leading-none">{item.label.split(' ')[0]}</span>
          </NavLink>
        );
      })}
    </nav>
    </>
  );
}
