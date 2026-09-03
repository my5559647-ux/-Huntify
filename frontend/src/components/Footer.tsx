import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="bg-teal-600 text-white font-bold text-xl px-3 py-1 rounded-lg shadow-sm">H</span>
              <span className="text-2xl font-black text-white tracking-tight">Huntify</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Empowering professional developers and agencies with secure lead hunting, website audits, and a teal real-time messaging pipeline.
            </p>
            <div className="inline-flex items-center space-x-2 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full text-xs font-semibold text-teal-400">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>Real-time Secure Inbox Active</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-teal-400 transition-colors">→ Home</Link></li>
              <li><Link href="/leadfinder" className="hover:text-teal-400 transition-colors">→ Lead Finder</Link></li>
              <li><Link href="/crm" className="hover:text-teal-400 transition-colors">→ CRM Hub</Link></li>
              <li><Link href="/messages" className="hover:text-teal-400 transition-colors">→ Chat</Link></li>
              <li><Link href="/pipeline" className="hover:text-teal-400 transition-colors">→ Pipeline</Link></li>
              <li><Link href="/cities" className="hover:text-teal-400 transition-colors">→ City Hubs</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/ai-features" className="hover:text-teal-400 transition-colors">→ AI Features</Link></li>
              <li><Link href="/about" className="hover:text-teal-400 transition-colors">→ About Us</Link></li>
              <li><Link href="/faq" className="hover:text-teal-400 transition-colors">→ FAQ</Link></li>
              <li><Link href="/profile" className="hover:text-teal-400 transition-colors">→ Profile</Link></li>
            </ul>
          </div>

          {/* Platform Security Trust Badges */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Platform Security</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              All records, client emails, and conversation logs are encrypted and strictly restricted to your account session.
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-gray-300">
                <span>Data Encryption</span>
                <span className="text-teal-400 font-bold">AES-256</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-300">
                <span>API Status</span>
                <span className="text-emerald-400 font-bold">Operational</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Built with <span className="text-rose-500">♥</span> using Next.js & Tailwind CSS
            </div>
          </div>

        </div>

        {/* Bottom Bar with Name/Copyright centered */}
        <div className="mt-8 text-center text-xs text-gray-400">
          © 2026 Huntify.ai • Pro Version Built by Ismab Yaseen.
        </div>

      </div>
    </footer>
  );
}