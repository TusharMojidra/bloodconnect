import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Droplet, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Alert from '@/components/UI';

export default function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email.trim(), password);

    if (error) {
      setError(error);
      setLoading(false);
    } else {
      const role = user?.role;
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role) {
        navigate('/dashboard');
      } else {
        try {
          const me = await api.auth.me();
          navigate(me.role === 'admin' ? '/admin-dashboard' : '/dashboard');
        } catch {
          navigate('/dashboard');
        }
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Droplet className="w-7 h-7 text-white" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to your BloodConnect account</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4">
              <Alert type="error" message={error} onClose={() => setError(null)} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-red-600 font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 card bg-blue-50 border-blue-100">
          <p className="text-sm font-medium text-blue-900 mb-2">Test Accounts (created by seed script)</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p><span className="font-semibold">User:</span> demo@bloodconnect.org / demo12345</p>
            <p><span className="font-semibold">Admin:</span> admin@bloodconnect.org / admin12345</p>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            These are real accounts with bcrypt-hashed passwords in MongoDB. Run the seed script first.
          </p>
        </div>
      </div>
    </div>
  );
}
