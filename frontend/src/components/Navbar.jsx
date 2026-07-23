import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { Car, LogOut, LogIn, UserPlus, Menu, X, PlusCircle, LayoutDashboard, Shield, Bell, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'init-1',
      text: 'Welcome to AutoSphere Dealership Portal!',
      time: 'Just now',
      type: 'system',
      read: false,
    }
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleNewNotification = (e) => {
      const newNotif = {
        ...e.detail,
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    };

    window.addEventListener('autosphere-notification', handleNewNotification);
    return () => {
      window.removeEventListener('autosphere-notification', handleNewNotification);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed top-4 left-0 right-0 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
          >
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 via-indigo-500 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/10">
              <Car className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              AutoSphere
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
            {!isAdmin && (
              <Link
                to="/"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive('/')
                    ? 'bg-white text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Inventory</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isActive('/admin')
                    ? 'bg-white text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Profile / Auth Action Buttons & Notifications */}
          <div className="hidden md:flex items-center space-x-3">


            {/* Notifications Indicator Icon */}
            <div className="relative">
              <button
                onClick={handleToggleNotifications}
                className="relative text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-xl hover:bg-slate-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Toggle notifications panel"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white animate-pulse" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-slate-200 shadow-[0_10px_35px_rgba(0,0,0,0.06)] py-3 z-50 text-slate-800 transition-all duration-200">
                  <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Actions</span>
                      {notifications.length > 0 && (
                        <button
                          onClick={handleClearNotifications}
                          className="text-[10px] font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center space-x-0.5"
                          title="Clear all notifications"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors focus:outline-none"
                      aria-label="Close notifications panel"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto mt-2">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-450 font-semibold">
                        No new notifications.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-55">
                        {notifications.map((notif) => (
                          <div key={notif.id} className="p-3.5 flex items-start space-x-3 hover:bg-slate-50 transition-colors">
                            <div className={`p-2 rounded-xl shrink-0 ${
                              notif.type === 'purchase'
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : notif.type === 'favorite'
                                  ? 'bg-rose-50 text-rose-500 border border-rose-100'
                                  : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                              {notif.type === 'purchase' ? (
                                <ShoppingBag className="h-3.5 w-3.5" />
                              ) : notif.type === 'favorite' ? (
                                <Heart className="h-3.5 w-3.5 fill-current" />
                              ) : (
                                <Car className="h-3.5 w-3.5" />
                              )}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <p className="text-xs text-slate-700 font-medium leading-normal break-words">
                                {notif.text}
                              </p>
                              <span className="text-[9px] font-bold text-slate-405 block uppercase">
                                {notif.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 leading-none">{user?.name}</span>
                    <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 bg-rose-50/60 hover:bg-rose-50 text-rose-600 border border-rose-100 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 border border-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation controls */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden mt-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-4 pt-3 pb-5 space-y-3 shadow-xl">
          {!isAdmin && (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive('/') ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Inventory</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive('/admin') ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center space-x-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-bold text-slate-800">{user?.name}</span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-100"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center space-x-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/10"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
