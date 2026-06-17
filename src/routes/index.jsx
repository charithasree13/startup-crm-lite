// Import lazy and Suspense features for code-splitting and loading states from react
import { lazy, Suspense } from 'react';
// Import essential routing components from react-router-dom
import { Routes, Route, Outlet } from 'react-router-dom';
// Import our Sidebar component to display it globally on all page layouts
import Sidebar from '../components/common/Sidebar';

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
  return (
    // Flexbox container establishing a row layout with background color and screen height bounds
    <div className="flex bg-slate-50 min-h-screen">
      
      {/* Render the sidebar navigation menu */}
      <Sidebar />
      
      {/* Main content body panel filling remaining horizontal layout space */}
      <main className="flex-1 p-8 overflow-y-auto">
        
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
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
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
