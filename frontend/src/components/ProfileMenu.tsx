'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ProfileMenu() {
  const { user, isAuthenticated, openGuardModal } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

// When not authenticated, clicking opens the login guard modal.
  if (!isAuthenticated) {
    return (
      <button
        onClick={openGuardModal}
        aria-label="Sign in"
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] border border-[#B9DDE4] dark:border-[#294D61] text-white font-black text-sm shadow hover:scale-105 hover:border-[#03F3DA]/60 transition-all"
      >
        U
      </button>
    );
  }

  // When authenticated, show the profile picture as a link to the dedicated profile page.
  return (
    <Link
      href="/profile"
      aria-label="Open profile settings"
      className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-transparent transition-all hover:border-[#0C7075]/50 hover:bg-black/5 dark:hover:bg-white/5"
    >
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-10 h-10 rounded-full object-cover border-2 border-[#B9DDE4] dark:border-[#294D61] shadow"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] text-white font-black text-sm flex items-center justify-center shadow">
          {initials}
        </div>
      )}
    </Link>
  );
}
