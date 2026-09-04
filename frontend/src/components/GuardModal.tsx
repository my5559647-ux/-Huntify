'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Lock } from 'lucide-react';

export default function GuardModal() {
  const { guardModalOpen, closeGuardModal } = useAuth();

  if (!guardModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={closeGuardModal}
    >
<div
        className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 shadow-2xl border border-[#B9DDE4] space-y-5 text-center dark:bg-[#05161A] dark:border-[#294D61]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF4F7] border border-[#B9DDE4] flex items-center justify-center text-3xl dark:bg-[#072E33] dark:border-[#0C7075]">
          <Lock className="w-8 h-8 text-[#0C7075]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-[#072E33] dark:text-white">Login Required</h2>
          <p className="text-xs sm:text-sm text-[#294D61] dark:text-[#A9C6D4]">
            You need to register or sign in to access Lead Finder, CRM, Pipeline, AI Features and other pro tools.
          </p>
        </div>

        <div className="space-y-2.5">
          <Link
            href="/signin"
            onClick={closeGuardModal}
            className="block w-full py-3 rounded-2xl bg-[#0C7075] text-white text-xs font-black hover:bg-[#0A5A5E] transition-all shadow-md"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            onClick={closeGuardModal}
            className="block w-full py-3 rounded-2xl bg-white text-[#0C7075] text-xs font-black border-2 border-[#0C7075] hover:bg-[#0C7075] hover:text-white transition-all shadow-sm dark:bg-[#072E33] dark:text-[#03F3DA] dark:border-[#0C7075] dark:hover:bg-[#0C7075] dark:hover:text-white dark:hover:border-[#0C7075]"
          >
            Register Free
          </Link>
          <button
            onClick={closeGuardModal}
            className="w-full py-2 text-[11px] font-bold text-[#6DA5C0] hover:text-[#0C7075] transition-all"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
