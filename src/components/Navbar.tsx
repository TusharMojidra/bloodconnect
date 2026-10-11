import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Droplet,
  Menu,
  X,
  Home,
  Info,
  Search,
  UserPlus,
  FilePlus,
  ListChecks,
  LayoutDashboard,
  Shield,
  Phone,
  LogOut,
  LogIn,
} from 'lucide-react';

const publicLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/about', label: 'About Us', icon: Info },
  { to: '/find-blood', label: 'Find Blood', icon: Search },
  { to: '/register-donor', label: 'Register as Donor', icon: UserPlus },
  { to: '/create-request', label: 'Create Blood Request', icon: FilePlus },
  { to: '/blood-requests', label: 'Blood Requests', icon: ListChecks },
  { to: '/contact', label: 'Contact Us', icon: Phone },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="container-max px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
              <Droplet className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BloodConnect</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.to)
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={isAdmin ? '/admin-dashboard' : '/dashboard'}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  {isAdmin ? <Shield className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                  {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-1 animate-fade-in">
            {publicLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive(link.to)
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-1">
              {user ? (
                <>
                  <Link
                    to={isAdmin ? '/admin-dashboard' : '/dashboard'}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    {isAdmin ? <Shield className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
                    {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
