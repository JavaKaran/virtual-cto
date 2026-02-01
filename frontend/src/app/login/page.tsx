'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, isLoading } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(username, password);
      } else {
        await register(username, password);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(#262626 1px, transparent 1px), linear-gradient(to right, #262626 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_100%)]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center min-h-screen w-full">
        {/* Card */}
        <div className="w-full max-w-[440px] bg-[#121212] rounded-xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Top gradient line */}
          <div className="h-0.5 w-full bg-linear-to-r from-transparent via-white/20 to-transparent opacity-50" />
          
          <div className="px-10 py-12 sm:px-14 sm:py-16 flex flex-col gap-10">
            {/* Header */}
            <div className="flex flex-col items-center text-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-white">
                {mode === 'login' ? 'Sign in to Virtual CTO' : 'Create your account'}
              </h2>
              <p className="text-gray-400 text-base font-normal leading-normal">
                {mode === 'login'
                  ? 'Continue designing your architecture.'
                  : 'Start building with Virtual CTO.'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Email/Username */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300" htmlFor="email">
                  {mode === 'login' ? 'Email' : 'Username'}
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-lg border border-[#333] bg-[#0a0a0a] text-white placeholder-gray-400 focus:outline-0 focus:ring-1 focus:ring-white focus:border-white h-12 px-4 transition-all text-base"
                    placeholder={mode === 'login' ? 'name@company.com' : 'johndoe'}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300" htmlFor="password">
                    Password
                  </label>
                  {mode === 'login' && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative group flex items-stretch">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg rounded-r-none border border-r-0 border-[#333] bg-[#0a0a0a] text-white placeholder-gray-400 focus:outline-0 focus:ring-1 focus:ring-white focus:border-white h-12 px-4 transition-all text-base z-10"
                    placeholder="••••••••••••"
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center px-4 rounded-r-lg border border-l-0 border-[#333] bg-[#0a0a0a] text-gray-400 hover:text-gray-300 cursor-pointer transition-colors group-focus-within:border-white group-focus-within:ring-1 group-focus-within:ring-white group-focus-within:ring-l-0"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Confirm Password (Register only) */}
              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-lg border border-[#333] bg-[#0a0a0a] text-white placeholder-gray-400 focus:outline-0 focus:ring-1 focus:ring-white focus:border-white h-12 px-4 transition-all text-base"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center rounded-lg bg-white py-3 px-4 text-base font-semibold text-black shadow-md hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  mode === 'login' ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center">
              <p className="text-sm text-gray-400">
                {mode === 'login' ? 'New here? ' : 'Already have an account? '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError('');
                    setConfirmPassword('');
                  }}
                  className="font-medium text-white hover:underline decoration-gray-400 hover:decoration-white underline-offset-4 transition-all"
                >
                  {mode === 'login' ? 'Create an account' : 'Sign in'}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
