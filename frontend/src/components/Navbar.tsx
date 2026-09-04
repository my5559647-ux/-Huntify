'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProfileMenu from '@/components/ProfileMenu';
import { Menu } from 'lucide-react';

interface NavbarProps {
  active?: string;
}

interface NavLink {
  name: string;
  href: string;
  key: string;
}

const LINKS: NavLink[] = [
  { name: 'Home', href: '/', key: 'home' },
  { name: 'Chat', href: '/messages', key: 'messages' },
  { name: 'Lead Finder', href: '/leadfinder', key: 'leadfinder' },
  { name: 'CRM Hub', href: '/crm', key: 'crm' },
  { name: 'Pipeline', href: '/pipeline', key: 'pipeline' },
  { name: 'City Hubs', href: '/cities', key: 'cities' },
  { name: 'AI Features', href: '/ai-features', key: 'aifeatures' },
  { name: 'About Us', href: '/about', key: 'about' },
  { name: 'FAQ', href: '/faq', key: 'faq' },
];

const AUTH_GUARDED_KEYS = ['messages', 'leadfinder', 'crm', 'pipeline', 'cities', 'aifeatures'];

export default function Navbar({ active }: NavbarProps) {
  const { isAuthenticated, theme, openGuardModal } = useAuth();
  const isDarkMode = theme === 'dark';
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent, link: NavLink) => {
    const needsAuth = AUTH_GUARDED_KEYS.includes(link.key);
    if (needsAuth && !isAuthenticated) {
      e.preventDefault();
      openGuardModal();
      return;
    }
  };

  const linkClasses = (link: NavLink) => {
    const isActive = active === link.key;
    const base = 'px-3 py-1.5 rounded-xl transition-all';
    if (isActive) {
      return `${base} ${isDarkMode ? 'bg-[#072E33] text-[#03F3DA] border border-[#0C7075]/60 shadow-inner' : 'bg-[#D5ECF0] text-[#0C7075] border border-[#B9DDE4]'} ${link.key === 'aifeatures' ? 'px-3.5' : ''}`;
    }
    return `${base} ${isDarkMode ? 'hover:bg-[#072E33] hover:text-[#03F3DA]' : 'hover:bg-[#EAF4F7] hover:text-[#0C7075]'} ${link.key === 'aifeatures' ? 'px-3.5' : ''}`;
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full px-4 lg:px-12 h-20 flex items-center justify-between border-b backdrop-blur-2xl shadow-2xl transition-colors duration-300 ${isDarkMode ? 'border-[#294D61]/80 bg-[#05161A]/90' : 'border-[#B9DDE4]/80 bg-white/90'}`}>
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center font-black text-white text-lg shadow-lg shadow-black/60 group-hover:scale-105 transition-transform border border-[#03F3DA]/50">
            H
          </div>
          <span className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#05161A]'}`}>
            Hunt<span className="text-[#0C7075]">ify</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={`hidden md:flex items-center gap-1 lg:gap-2 text-[13px] font-bold ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={(e) => handleNavClick(e, link)}
              className={linkClasses(link)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Auth & Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 relative">
          <ProfileMenu />

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-xl border ${isDarkMode ? 'bg-[#072E33] text-white border-[#294D61]' : 'bg-[#EAF4F7] text-[#05161A] border-[#B9DDE4]'}`}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden w-full border-b p-6 space-y-2 text-xs font-bold transition-colors ${isDarkMode ? 'bg-[#072E33] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
          {LINKS.map((link) => {
            const isActive = active === link.key;
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, link);
                }}
                className={`block p-2.5 rounded-xl ${
                  isActive
                    ? 'bg-[#0C7075] text-white'
                    : isDarkMode
                      ? 'hover:bg-[#294D61]'
                      : 'hover:bg-[#EAF4F7]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
