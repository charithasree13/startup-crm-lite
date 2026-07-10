// Import BrowserRouter from react-router-dom to manage HTML5 history APIs and navigation contexts
import { BrowserRouter } from 'react-router-dom';
// Import Toaster component to show slick feedback notifications
import { Toaster } from 'react-hot-toast';
// Import our centralized routes configuration that maps paths to lazy loaded views
import AppRoutes from './routes';

// Define the main App root functional component
function App() {
  return (
    // Wrap the entire component tree in BrowserRouter to provide routing capabilities
    <BrowserRouter>
      {/* Configure a global toast notification overlay */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {/* Render the app route structure containing the sidebar layout and view outlets */}
      <AppRoutes />
    </BrowserRouter>
  );
}

// Export the App component as default for bootstrapping in main.jsx
export default App;

