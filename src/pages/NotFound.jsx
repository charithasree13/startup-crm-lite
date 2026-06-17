// Import the Link component from react-router-dom to handle internal spa navigation
import { Link } from 'react-router-dom';
// Import essential icons from the lucide-react package for decoration
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

// Define the NotFound functional component representing our custom 404 page
export default function NotFound() {
  // Return the JSX representing the 404 Error page layout
  return (
    // Centered vertical layout container with animate-fade-in transition, filling screen bounds
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center animate-fade-in">
      
      {/* Visual background icon badge with warning color highlights */}
      <div className="w-24 h-24 bg-amber-50 border border-amber-100 rounded-3xl flex items-center justify-center text-amber-500 mb-8 shadow-xs animate-bounce">
        {/* Render caution icon inside the badge */}
        <AlertTriangle className="w-12 h-12" />
      </div>

      {/* Primary error status code heading */}
      <h1 className="text-6xl font-black text-slate-800 tracking-tight">404</h1>
      
      {/* Friendly descriptive error message */}
      <h2 className="text-xl font-bold text-slate-700 mt-4">Page Not Found</h2>
      
      {/* Informative description paragraph clarifying page loss */}
      <p className="text-slate-500 mt-2 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* Button controls wrapper */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        {/* Navigation Link pointing to root dashboard page */}
        <Link 
          to="/" 
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow-xs hover:shadow-md transition-all duration-200"
        >
          {/* Dashboard home icon */}
          <Home className="w-5 h-5 mr-2" />
          <span>Back to Dashboard</span>
        </Link>
        
        {/* Alternative historical trigger button to go back to previous page in window history */}
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-xl transition-all duration-200"
        >
          {/* Back arrows symbol */}
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Go Back</span>
        </button>
      </div>

    </div>
  );
}
