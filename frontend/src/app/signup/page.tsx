'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { API_URL } from '@/lib/config';

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    // Convert to base64 immediately for preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password, avatar }),
      });

      const raw = await response.text();
      let result: { success?: boolean; message?: string; user?: { id: string; name: string; email: string; avatar?: string } };
      try {
        result = raw ? JSON.parse(raw) : {};
      } catch {
        setError('Could not reach the server. Please try again later.');
        return;
      }

      if (response.ok && result.success && result.user) {
        login(result.user);
        setSuccess(true);
        setTimeout(() => router.push('/leadfinder'), 900);
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Could not reach the server. Please try again later.');
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
          <span className="text-xs text-[#294D61] font-bold hidden sm:inline">Already have an account?</span>
          <Link href="/signin" className="px-4 py-2 rounded-xl bg-[#EAF4F7] text-xs font-bold text-[#0C7075] border border-[#B9DDE4] hover:bg-[#D5ECF0] transition-all">
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Card */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#B9DDE4] shadow-xl space-y-6">
          {/* Heading */}
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1.5 rounded-full bg-[#EAF4F7] text-[#0C7075] text-xs font-bold border border-[#B9DDE4]">
              Join Huntify
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#072E33]">Create your account</h1>
            <p className="text-xs sm:text-sm text-[#294D61]">
              Start scouting verified clients based on your expertise.
            </p>
          </div>

          {/* Success message */}
          {success && (
            <div className="p-3 rounded-2xl bg-[#E8F7EE] border border-[#A7E3C0] text-xs font-bold text-[#1F7A3D] text-center">
              Account created successfully! Redirecting...
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-3 rounded-2xl bg-[#EAF4F7] border border-[#B9DDE4] text-xs font-semibold text-[#0C7075] text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Picture - top center circular upload */}
            <div className="flex flex-col items-center">
              <label className="cursor-pointer relative group">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] border-4 border-[#B9DDE4] flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                  {avatar ? (
                    <img src={avatar} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-white/95">+</span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                    <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">+</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <span className="mt-2 text-xs font-bold text-[#294D61]">Upload a photo</span>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0C7075] uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ali Khan"
                className="w-full px-4 py-3 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] text-sm text-[#072E33] outline-none focus:border-[#0C7075] placeholder:text-[#6DA5C0]"
              />
            </div>

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
                  placeholder="Min. 6 characters"
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer links */}
          <div className="text-center text-xs text-[#294D61] space-x-1">
            <span>Already have an account?</span>
            <Link href="/signin" className="font-bold text-[#0C7075] underline">Sign In</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
