'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function SigninPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://huntify-production-7c9c.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Persist the user (with avatar) in auth context + localStorage
        login(result.user);
        setSuccess(true);
        setTimeout(() => router.push('/leadfinder'), 900);
      } else {
        setError(result.message || 'Invalid email or password.');
      }
    } catch {
      setError('Could not reach the server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="min-h-screen bg-[#F4FAFC] text-[#072E33] font-sans flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#B9DDE4] px-6 lg:px-12 py-4 flex justify-between items-center shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center font-black text-white text-base shadow-md">H</div>
          <span className="text-xl font-black text-[#072E33]">Hunt<span className="text-[#0C7075]">ify</span></span>
        </Link>
<div className="flex items-center gap-3">
          <span className="text-xs text-[#294D61] font-bold hidden sm:inline">New here?</span>
          <Link href="/signup" className="px-4 py-2 rounded-xl bg-[#EAF4F7] text-xs font-bold text-[#0C7075] border border-[#B9DDE4] hover:bg-[#D5ECF0] transition-all">
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#B9DDE4] shadow-xl space-y-6">
          {/* Heading */}
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-[#EAF4F7] text-[#0C7075] text-xs font-bold border border-[#B9DDE4]">
              Welcome Back
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#072E33]">Sign in to your account</h1>
            <p className="text-xs sm:text-sm text-[#294D61]">
              Access your leads, CRM, and pipeline dashboard.
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="p-3 rounded-2xl bg-[#E8F7EE] border border-[#A7E3C0] text-xs font-bold text-[#1F7A3D] text-center">
              Login successful! Redirecting...
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-2xl bg-[#EAF4F7] border border-[#B9DDE4] text-xs font-semibold text-[#0C7075] text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0C7075] uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] text-sm text-[#072E33] outline-none focus:border-[#0C7075] placeholder:text-[#6DA5C0]"
              />
            </div>

{/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0C7075] uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 pr-12 py-3 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] text-sm text-[#072E33] outline-none focus:border-[#0C7075] placeholder:text-[#6DA5C0]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-[#6DA5C0] hover:text-[#0C7075] hover:bg-[#EAF4F7] transition-all"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 rounded-2xl bg-[#0C7075] text-white text-sm font-black hover:bg-[#0A5A5E] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer links */}
          <div className="text-center text-xs text-[#294D61] space-x-1">
            <span>Don&apos;t have an account?</span>
            <Link href="/signup" className="font-bold text-[#0C7075] underline">Create Account</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
