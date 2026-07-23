import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Shield, ArrowRight, Sparkles, Car, ShieldCheck } from 'lucide-react';

export const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerAuth(data.name, data.email, data.password, data.role);
      toast.success('Registration successful! Welcome to AutoSphere.');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please check your inputs.';
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
              <span>Join AutoSphere</span>
            </div>
            
            <div className="space-y-3">
              <div className="inline-flex p-3 bg-white/10 rounded-2xl shadow-sm text-white mb-2 border border-white/10">
                <Car className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">Create Account</h2>
              <p className="text-xs text-blue-100 leading-relaxed font-medium">
                Register to explore our car dealership showroom catalog or manage dealership inventory operations.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-50">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Instant Active Account</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-50">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              <span>Customer & Admin Roles</span>
            </div>
          </div>
        </div>

        {/* Right Side Form (Split Layout) */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-center bg-white">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Account Details</h3>
            <p className="mt-1.5 text-sm text-slate-400 font-medium">Please enter your registration information</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  id="reg-name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  })}
                  className={`w-full pl-11 pr-4 py-3 premium-input ${
                    errors.name ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                  } text-slate-900 placeholder-slate-400 text-sm`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p id="name-error" className="mt-1 text-xs text-rose-500 font-bold">{errors.name.message}</p>}
            </div>

            {/* Email Field */}
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
                  id="reg-email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`w-full pl-11 pr-4 py-3 premium-input ${
                    errors.email ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                  } text-slate-900 placeholder-slate-400 text-sm`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p id="email-error" className="mt-1 text-xs text-rose-500 font-bold">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    })}
                    className={`w-full pl-10 pr-3.5 py-2.5 premium-input ${
                      errors.password ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                    } text-slate-900 placeholder-slate-400 text-sm`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && <p className="mt-1 text-xs text-rose-500 font-bold">{errors.password.message}</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match',
                    })}
                    className={`w-full pl-10 pr-3.5 py-2.5 premium-input ${
                      errors.confirmPassword ? 'border-rose-500/80 focus:ring-rose-500/10' : ''
                    } text-slate-900 placeholder-slate-400 text-sm`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-rose-500 font-bold">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Account Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Shield className="h-4.5 w-4.5" />
                </div>
                <select
                  {...register('role')}
                  className="w-full pl-11 pr-4 py-3 premium-input rounded-2xl text-slate-800 focus:outline-none text-sm"
                >
                  <option value="user" className="bg-white text-slate-800">Customer / User</option>
                  <option value="admin" className="bg-white text-slate-800">Dealership Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 disabled:opacity-50 min-h-[46px] mt-2 active:scale-[0.98] shadow-sm shadow-blue-500/10"
            >
              {loading ? (
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <span>Register Account</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
