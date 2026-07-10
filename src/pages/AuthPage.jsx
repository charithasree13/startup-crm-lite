import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Rocket, User, Mail, Phone, Lock, LogIn, UserPlus, ShieldAlert 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('saved_email') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('saved_password') || '');
  const [localError, setLocalError] = useState('');
  const [localSuccess, setLocalSuccess] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');
    setLocalLoading(true);

    try {
      if (isSignUp) {
        await register(username, mobile, email, password);
        toast.success('Admin registered and logged in successfully!');
        setLocalSuccess('Registered successfully!');
        // Save login credentials for easy subsequent access
        localStorage.setItem('saved_email', email);
        localStorage.setItem('saved_password', password);
        // Clear fields
        setUsername('');
        setMobile('');
        setEmail('');
        setPassword('');
      } else {
        await login(email, password);
        toast.success('Welcome back, Admin!');
        setLocalSuccess('Logged in successfully!');
        // Save login credentials for easy subsequent access
        localStorage.setItem('saved_email', email);
        localStorage.setItem('saved_password', password);
        // Clear fields
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      const errMsg = err.message || 'Authentication failed';
      setLocalError(errMsg);
      toast.error(errMsg);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 transition-colors duration-300">
      {/* Background blobs for premium glassmorphism feel */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl" />

      {/* Auth Card container */}
      <div className="relative w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 p-8 rounded-3xl shadow-2xl transition-all duration-300">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-4 hover:rotate-6 transition-transform duration-300">
            <Rocket className="w-7.5 h-7.5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-850 dark:text-slate-105 tracking-tight mb-1">
            Startup CRM Lite
          </h1>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            Admin Authentication Portal
          </p>
        </div>

        {/* Sign In / Sign Up Toggles */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-sm font-semibold mb-6">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setLocalError(''); setLocalSuccess(''); }}
            className={`w-1/2 text-center py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
              !isSignUp 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setLocalError(''); setLocalSuccess(''); }}
            className={`w-1/2 text-center py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
              isSignUp 
                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin123"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-850/40 text-slate-850 dark:text-slate-105 border-slate-200 dark:border-slate-750 focus:outline-hidden focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-850/40 text-slate-850 dark:text-slate-105 border-slate-200 dark:border-slate-750 focus:outline-hidden focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Email ID
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@crm.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-850/40 text-slate-850 dark:text-slate-105 border-slate-200 dark:border-slate-750 focus:outline-hidden focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-850/40 text-slate-850 dark:text-slate-105 border-slate-200 dark:border-slate-750 focus:outline-hidden focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          {localError && (
            <div className="p-3 text-xs font-semibold text-red-650 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200/50 dark:border-red-900/40 flex items-start gap-2.5 animate-shake">
              <ShieldAlert className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
              <span>{localError}</span>
            </div>
          )}

          {localSuccess && (
            <div className="p-3 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-900/40 flex items-start gap-2.5">
              <span className="mt-0.5">✅</span>
              <span>{localSuccess}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={localLoading}
            className="w-full mt-4 py-3 px-4 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            {localLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4.5 h-4.5" />
                Register Admin
              </>
            ) : (
              <>
                <LogIn className="w-4.5 h-4.5" />
                Login Admin
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
