import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Building2, LayoutDashboard, FileText, Settings, LogOut, Menu, X, ArrowLeft, Eye, ShieldCheck, KeyRound, Star, User, Moon, Sun } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const GOLD = '#C9A84C';
const GOLD_LIGHT = '#E6C97A';
const NAVY = '#0B1120';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { adminLogin, adminLogout } = useApp();

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Authentication check (using localStorage)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('newstar_admin_logged_in') === 'true';
  });

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await adminLogin(loginForm.username, loginForm.password);
    if (success) {
      setIsLoggedIn(true);
      setLoginError('');
      navigate('/admin/dashboard');
    } else {
      setLoginError('Invalid email or password. (Use admin@newstar.com / admin123)');
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsLoggedIn(false);
    navigate('/');
  };

  // Login Screen if not authenticated
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 text-white font-inter">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-[100px]" style={{ backgroundColor: 'rgba(201,168,76,0.05)' }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" style={{ backgroundColor: 'rgba(37,99,235,0.05)' }} />

        <div className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md relative overflow-hidden space-y-6">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mx-auto border border-gold/30">
              <ShieldCheck className="w-6 h-6 text-gold" style={{ color: GOLD }} />
            </div>
            <h1 style={{ fontFamily: '"Playfair Display", serif' }} className="text-2xl font-bold tracking-wide">
              ADMIN PORTAL
            </h1>
            <p className="text-xs text-slate-400">
              New Star Real Estate — Control Center Login
            </p>
          </div>

          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs py-2.5 px-3 rounded-lg text-center font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full bg-[#0B1120] border border-slate-800 rounded-lg py-2.5 px-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gold hover:opacity-90 text-navy font-bold rounded-lg text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #E6C97A)`, color: NAVY }}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Authenticate
            </button>
          </form>

          <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-xs">
            <Link to="/" className="text-slate-400 hover:text-white flex items-center gap-1 no-underline">
              <ArrowLeft className="w-3.5 h-3.5" />
              Public Website
            </Link>
            <span className="text-slate-600">v1.0.0</span>
          </div>
        </div>
      </main>
    );
  }

  // Sidebar Links
  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Properties', path: '/admin/properties', icon: Building2 },
    { label: 'Enquiries', path: '/admin/enquiries', icon: FileText },
  ];

  const sidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0B1120] text-white font-inter">
      {/* Branding Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0" style={{ textDecoration: 'none' }}>
          <Star className="w-7 h-7" style={{ color: GOLD, fill: GOLD, filter: 'drop-shadow(0 0 5px rgba(201, 168, 76, 0.45))' }} aria-hidden="true" />
          <div className="flex flex-col leading-none">
            <span 
              style={{ 
                background: 'linear-gradient(135deg, #FFFFFF 20%, #FFEFC2 70%, #C9A84C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))',
                fontFamily: '"Playfair Display", serif', 
                fontWeight: 700, 
                fontSize: '0.8rem', 
                letterSpacing: '0.1em' 
              }}
            >
              NEW STAR
            </span>
            <span style={{ color: GOLD_LIGHT, fontFamily: 'Inter, sans-serif', fontSize: '0.52rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Real Estate
            </span>
          </div>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-1 rounded hover:bg-white/5 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path === '/admin/properties' && location.pathname.startsWith('/admin/properties'));
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 py-2.5 px-4 rounded-lg text-xs font-semibold tracking-wide no-underline transition-all ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
              style={{
                background: isActive ? '#1E3A8A' : 'transparent',
              }}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 py-2.5 px-4 text-xs font-semibold tracking-wide text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-850 font-inter dark:bg-navy-950 dark:text-white transition-colors duration-300">
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:block w-[240px] border-r border-slate-100 bg-[#0B1120] flex-shrink-0 sticky top-0 h-screen">
        {sidebarContent()}
      </aside>

      {/* Mobile Drawer (Absolute overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Slide container */}
          <div className="relative w-[240px] h-full bg-[#0B1120] shadow-2xl z-50 animate-slide-right">
            {sidebarContent()}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-6 lg:px-8 dark:bg-navy-900/95 dark:border-navy-800 transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded text-slate-400 hover:bg-slate-50 hover:text-slate-850 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all dark:border-navy-700 dark:text-navy-200 dark:hover:bg-navy-800"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Quick Public Site Button */}
            <Link
              to="/"
              className="flex items-center gap-1 text-slate-500 hover:text-[#0B1120] no-underline border border-slate-200 py-1.5 px-3 rounded-lg bg-white hover:bg-slate-50 transition-all dark:bg-navy-950 dark:border-navy-700 dark:text-navy-200 dark:hover:text-white dark:hover:bg-navy-800"
            >
              <Eye className="w-3.5 h-3.5" />
              View Site
            </Link>
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 dark:border-navy-800">
              <span className="text-slate-600 hidden sm:inline dark:text-navy-200">
                Welcome, <span className="font-bold text-[#0B1120] dark:text-white">Admin</span>
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 dark:bg-navy-800 dark:border-navy-700 dark:text-navy-100">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Inner Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
