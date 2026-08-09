'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const QUICK_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Lead Finder', href: '/leadfinder' },
  { name: 'CRM Hub', href: '/crm' },
  { name: 'Chat', href: '/messages' },
  { name: 'Pipeline', href: '/pipeline' },
  { name: 'City Hubs', href: '/cities' },
];

const RESOURCES = [
  { name: 'AI Features', href: '/ai-features' },
  { name: 'About Us', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Profile', href: '/profile' },
];

const SOCIALS = [
  { name: 'Twitter', href: 'https://twitter.com', icon: '𝕏' },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: 'in' },
  { name: 'GitHub', href: 'https://github.com', icon: '⌥' },
  { name: 'Instagram', href: 'https://instagram.com', icon: '◎' },
];

export default function Footer() {
  const { theme } = useAuth();
  const isDarkMode = theme === 'dark';

  return (
    <footer className={`mt-auto border-t transition-colors duration-300 ${isDarkMode ? 'border-[#294D61] bg-[#030B0D]' : 'border-[#B9DDE4] bg-[#EAF4F7]'}`}>
      {/* Top gradient accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0C7075] via-[#03F3DA] to-[#6DA5C0]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center font-black text-white text-lg shadow-lg group-hover:scale-105 transition-transform border border-[#03F3DA]/50">
                H
              </div>
              <span className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#05161A]'}`}>
                Hunt<span className="text-[#0C7075]">ify</span>
              </span>
            </Link>
            <p className={`text-xs leading-relaxed max-w-xs ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
              Empowering professional developers and agencies across Pakistan with secure lead hunting, website audits, and a teal real-time messaging pipeline.
            </p>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${isDarkMode ? 'bg-[#072E33] text-[#03F3DA] border-[#0C7075]/60' : 'bg-white text-[#0C7075] border-[#B9DDE4]'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#03F3DA] animate-pulse"></span>
                Real-time Secure Inbox
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-wider mb-4 ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-xs font-semibold transition-colors ${isDarkMode ? 'text-[#A9C6D4] hover:text-[#03F3DA]' : 'text-[#294D61] hover:text-[#0C7075]'}`}
                  >
                    → {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-wider mb-4 ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>
              Resources
            </h4>
            <ul className="space-y-2.5">
              {RESOURCES.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-xs font-semibold transition-colors ${isDarkMode ? 'text-[#A9C6D4] hover:text-[#03F3DA]' : 'text-[#294D61] hover:text-[#0C7075]'}`}
                  >
                    → {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className={`text-xs font-black uppercase tracking-wider mb-4 ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>
              Follow Us
            </h4>
            <div className="flex flex-wrap gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black border transition-all shadow ${isDarkMode ? 'bg-[#072E33] border-[#294D61] text-[#03F3DA] hover:border-[#03F3DA] hover:-translate-y-0.5' : 'bg-white border-[#B9DDE4] text-[#0C7075] hover:border-[#0C7075] hover:-translate-y-0.5'}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <p className={`text-[11px] font-semibold mt-4 ${isDarkMode ? 'text-[#6DA5C0]' : 'text-[#294D61]'}`}>
              Built with 💙 using Next.js & Tailwind CSS
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className={`mt-12 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3 ${isDarkMode ? 'border-[#294D61]/60' : 'border-[#B9DDE4]'}`}>
          <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-[#6DA5C0]' : 'text-[#294D61]'}`}>
            © {new Date().getFullYear()} Huntify.ai • Pro Version Built by Ismab Yaseen.
          </p>
          <div className={`flex flex-wrap justify-center gap-5 text-[11px] font-bold ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
            <Link href="/" className="hover:text-[#03F3DA] transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-[#03F3DA] transition-colors">Terms of Service</Link>
            <Link href="/about" className="hover:text-[#03F3DA] transition-colors">About Us</Link>
            <Link href="/messages" className="hover:text-[#03F3DA] transition-colors">Support Inbox</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
