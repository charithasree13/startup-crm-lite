// Import lazy and Suspense features for code-splitting and loading states from react
import { lazy, Suspense, useState } from 'react';
// Import essential routing components from react-router-dom
import { Routes, Route, Outlet } from 'react-router-dom';
import { Menu, Rocket } from 'lucide-react';
// Import our Sidebar component to display it globally on all page layouts
import Sidebar from '../components/common/Sidebar';
import DarkModeToggle from '../components/common/DarkModeToggle';

// Lazy load the Dashboard page component (loaded only when the '/' path is active)
const Dashboard = lazy(() => import('../pages/Dashboard'));
// Lazy load the Leads page component (loaded only when the '/leads' path is active)
const Leads = lazy(() => import('../pages/Leads'));
// Lazy load the Analytics page component (loaded only when the '/analytics' path is active)
const Analytics = lazy(() => import('../pages/Analytics'));
// Lazy load the NotFound page component (loaded when any invalid path is matched)
const NotFound = lazy(() => import('../pages/NotFound'));

/**
 * MainLayout Component
 * Serves as the base layout structure for our authenticated application views.
 * It positions the Sidebar on the left and wraps child route views in a Suspense loader.
 */
function MainLayout() {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    // Flexbox container establishing a row layout on md+ and col on mobile
    <div className="flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-200">
      
      {/* Mobile Top Header (Hidden on tablet/desktop) */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Rocket className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-none">CRM Lite</h2>
        </div>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <button 
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 -mr-2 text-slate-500 dark:text-slate-400 focus:outline-hidden"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Render the sidebar navigation menu */}
      <Sidebar 
        isMobileDrawerOpen={isMobileDrawerOpen} 
        closeMobileDrawer={() => setIsMobileDrawerOpen(false)} 
      />
      
      {/* Main content body panel filling remaining layout space */}
      {/* pb-20 on mobile to account for the fixed bottom navigation */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
        
        {/* Suspense handles showing a placeholder spinner while lazy pages are downloaded */}
        <Suspense fallback={<LoadingSpinner />}>
          
          {/* Outlet is the router placeholder where matched child route components render */}
          <Outlet />
          
        </Suspense>
        
      </main>
      
    </div>
  );
}

/**
 * LoadingSpinner Component
 * Renders a clean spinning wheel as a fallback UI during chunk resolution.
 */
function LoadingSpinner() {
  return (
    // Flex container to center spinner horizontally and vertically on screen
    <div className="flex items-center justify-center min-h-[50vh]">
      {/* Spinning element with circular borders and animation classes */}
      <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}

/**
 * AppRoutes Component
 * Declares all URL mappings to components within a react-router-dom <Routes> switcher.
 */
export default function AppRoutes() {
  return (
    <Routes>
      
      {/* Route group wrapped under MainLayout. All nested child routes share the layout */}
      <Route element={<MainLayout />}>
        
        {/* Map Dashboard component as index route or root url '/' */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Map Leads page component to the '/leads' url path */}
        <Route path="/leads" element={<Leads />} />
        
        {/* Map Analytics page component to the '/analytics' url path */}
        <Route path="/analytics" element={<Analytics />} />
        
      </Route>
      
      {/* Catch-all path '*' for unknown routes, displaying the 404 page outside the main dashboard layout */}
      <Route path="*" element={<NotFound />} />
      
    </Routes>
  );
}
