import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Car } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back! Login successful.');
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(firstError.message || 'Please fill in all required fields.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-white rounded-[32px] border border-slate-200/80 shadow-[0_15px_50px_rgba(0,0,0,0.03)]">
        {/* Left Side Branding Banner (Split Layout) */}
        <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 flex flex-col justify-between relative border-b lg:border-b-0 lg:border-r border-slate-100 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-bold bg-white/15 text-white border border-white/20 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-blue-200" />
              <span>Dealership Portal</span>
            </div>
            
            <div className="space-y-3">
              <div className="inline-flex p-3 bg-white/10 rounded-2xl shadow-sm text-white mb-2 border border-white/10">
                <Car className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">AutoSphere</h2>
              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                Experience next-generation car dealership inventory management built for modern teams.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-50">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Secure JWT Encryption</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-50">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              <span>Role-Based Permissions</span>
            </div>
          </div>
        </div>

        {/* Right Side Form (Split Layout) */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-8 flex flex-col justify-center bg-white">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to AutoSphere</h2>
            <p className="mt-1.5 text-sm text-slate-400 font-medium">Manage your dealership inventory & account</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="email"
                    id="login-email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={`w-full pl-11 pr-4 py-3.5 premium-input ${
                      errors.email ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                    } text-slate-900 placeholder-slate-400 text-sm`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && <p id="email-error" className="mt-1.5 text-xs text-rose-500 font-bold">{errors.email.message}</p>}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    id="login-password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className={`w-full pl-11 pr-4 py-3.5 premium-input ${
                      errors.password ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                    } text-slate-900 placeholder-slate-400 text-sm`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1.5 text-xs text-rose-500 font-bold">{errors.password.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 disabled:opacity-50 min-h-[46px] active:scale-[0.98] shadow-sm shadow-blue-500/10"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-t border-slate-100">
            <p className="text-sm text-slate-400 font-medium">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
