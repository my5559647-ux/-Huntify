'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function HuntifyMasterProLanding() {
  const { isAuthenticated, theme, requireAuth, openGuardModal } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Lahore');
  
  // Theme state is driven by AuthContext (light is the default)
  const isDarkMode = theme === 'dark';

  // Spotlight Mouse Glow Ref for Cards
  const cardRef1 = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef1.current) return;
    const rect = cardRef1.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const cityHubs = [
    { name: 'Lahore', leads: '1,420+ Leads', tag: 'Tech & Textile Hub', desc: 'Targeting top software houses and elite retail brands.' },
    { name: 'Karachi', leads: '2,150+ Leads', tag: 'Corporate & Real Estate', desc: 'High-value corporate deals and trading networks.' },
    { name: 'Islamabad', leads: '980+ Leads', tag: 'Startups & Government', desc: 'Agencies, tech startups, and governmental contractors.' },
    { name: 'Faisalabad', leads: '750+ Leads', tag: 'E-commerce & Manufacturing', desc: 'Textile giants, exporters, and digital store owners.' },
  ];

  const featuresList = [
    { title: 'AI Google Map Scraper', desc: 'Instantly extract verified B2B businesses, raw contacts, and websites across any region.' },
    { title: 'Website Speed & SSL Audit', desc: 'Automatically scan legacy sites for slow performance, broken responsiveness, and missing security.' },
    { title: 'Internal Secure Messaging Bridge', desc: 'Keep deals locked in. Route all outreach safely without letting clients leak your phone number.' },
    { title: 'Built-in CRM & Pipeline Board', desc: 'Track your deal statuses from initial lead discovery to closed contract in one centralized interface.' },
    { title: 'Automated Email Dispatcher', desc: 'Send customized audit reports directly to prospective business owners with one click.' },
    { title: 'Advanced Niche Filter', desc: 'Filter strictly by restaurants, dental clinics, software agencies, or manufacturing hubs.' }
  ];

  const faqs = [
    { q: 'What makes Huntify a pro-level lead generator?', a: 'Huntify combines automated map scouting with live website audits and an internal secure inbox, ensuring zero deal drop-offs.' },
{ q: 'How does the interactive mouse glow work on cards?', a: 'Our custom UI engine tracks cursor coordinates in real-time to render an exquisite teal-tinted spotlight along card borders.' },
    { q: 'Can I use Huntify for local Pakistani markets?', a: 'Yes! Optimized specifically for Lahore, Karachi, Islamabad, and Faisalabad business ecosystems.' },
    { q: 'Is my deal pipeline private and secure?', a: 'All records, client emails, and conversation logs are encrypted and strictly restricted to your account session.' }
  ];

return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#05161A] text-[#FAF8F5] selection:bg-[#03F3DA] selection:text-[#05161A]' : 'bg-[#F4FAFC] text-[#072E33] selection:bg-[#0C7075] selection:text-white'}`}>

      {/* Ambient Teal/Emerald Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#0C7075]/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#6DA5C0]/15 blur-[180px] rounded-full pointer-events-none -z-10"></div>

      {/* Toast Alert Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C7075] text-white text-xs font-bold px-6 py-3.5 rounded-2xl shadow-2xl border border-[#03F3DA]/50 animate-bounce backdrop-blur-md">
          ✨ {notification}
        </div>
      )}

{/* Shared Teal Navbar with Chat link */}
      <Navbar active="home" />

      {/* ================= HERO SECTION WITH MOUSE SPOTLIGHT GLOW CARD ================= */}
      <section className="relative px-6 lg:px-16 pt-20 pb-20 text-center max-w-5xl mx-auto space-y-8">
        
<div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-inner border ${isDarkMode ? 'bg-[#072E33] text-[#03F3DA] border-[#0C7075]/60' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'}`}>
          <span>⚡ Pro-Level B2B Lead Extraction & Secure Deal Pipeline</span>
        </div>

        <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>
          Discover High-Value <br />
          <span className="bg-gradient-to-r from-[#03F3DA] via-[#0C7075] to-[#6DA5C0] bg-clip-text text-transparent">
            Clients Instantly.
          </span>
        </h1>

        <p className={`text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
          Stop losing clients to direct phone chats. Huntify connects you with verified regional businesses, audits legacy websites, and manages all deal conversions securely inside our secure teal messaging pipeline.
        </p>

        {/* Interactive Spotlight Card Widget */}
        <div 
          ref={cardRef1}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`relative p-4 rounded-3xl border shadow-2xl max-w-3xl mx-auto overflow-hidden group transition-colors ${isDarkMode ? 'bg-[#072E33] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}
        >
          {/* Dynamic Mouse-Following Light Effect */}
          {isHovered && (
            <div 
              className="absolute pointer-events-none w-72 h-72 rounded-full bg-gradient-to-r from-[#0C7075]/40 to-[#03F3DA]/30 blur-3xl -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
              style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
            ></div>
          )}

          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
            <div className={`flex-1 flex items-center px-4 py-3.5 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-[#F4FAFC] border-[#B9DDE4]'}`}>
              <span className="mr-2 text-[#03F3DA]">🔍</span>
              <input 
                type="text" 
                placeholder="Search niche (e.g. Restaurants, Software Houses)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent text-xs outline-none ${isDarkMode ? 'text-white placeholder:text-[#6DA5C0]' : 'text-[#072E33] placeholder:text-[#6DA5C0]'}`}
              />
            </div>

            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className={`px-4 py-3.5 rounded-2xl border text-xs font-bold outline-none cursor-pointer ${isDarkMode ? 'bg-[#05161A] border-[#294D61] text-white' : 'bg-[#F4FAFC] border-[#B9DDE4] text-[#072E33]'}`}
            >
              <option value="Lahore">📍 Lahore</option>
              <option value="Karachi">📍 Karachi</option>
              <option value="Islamabad">📍 Islamabad</option>
              <option value="Faisalabad">📍 Faisalabad</option>
            </select>

<button 
              onClick={() => requireAuth(() => triggerToast(`Scanning verified leads for "${searchQuery || 'All'}" in ${selectedCity}!`))}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] hover:from-[#0C7075] hover:to-[#03F3DA] text-white font-black text-xs shadow-lg shadow-black/60 transition-all hover:scale-105 border border-[#03F3DA]/40"
            >
              Hunt Leads 🚀
            </button>
          </div>
        </div>

      </section>

      {/* ================= TRUST STATISTICS COUNTER BAR ================= */}
      <section className={`border-y py-10 px-6 lg:px-16 shadow-xl transition-colors ${isDarkMode ? 'border-[#294D61] bg-[#072E33]' : 'border-[#B9DDE4] bg-[#EAF4F7]'}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-3xl lg:text-4xl font-black text-[#03F3DA]">12,500+</p>
            <p className={`text-xs mt-1 font-semibold ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>Verified Businesses Audited</p>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-3xl lg:text-4xl font-black text-[#6DA5C0]">100%</p>
            <p className={`text-xs mt-1 font-semibold ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>Internal Secure Inbox Rate</p>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-3xl lg:text-4xl font-black text-[#0C7075]">4 Major</p>
            <p className={`text-xs mt-1 font-semibold ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>Pakistani Regional Hubs</p>
          </div>
          <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-3xl lg:text-4xl font-black text-[#03F3DA]">$450 - $900</p>
            <p className={`text-xs mt-1 font-semibold ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>Average Deal Potential</p>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: REGIONAL CITY HUBS (MOUSE SPOTLIGHT CARDS) ================= */}
      <section id="cities" className="px-6 lg:px-16 py-24 max-w-6xl mx-auto space-y-10">
<div className="text-center space-y-3">
          <h2 className={`text-2xl sm:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>Explore Regional City Hubs</h2>
          <p className={`text-xs sm:text-sm max-w-xl mx-auto ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
            Click on any major hub below to instantly filter high-ticket clients needing web redesigns and digital marketing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cityHubs.map((hub, idx) => (
            <div 
              key={idx}
onClick={() => requireAuth(() => { setSelectedCity(hub.name); triggerToast(`Selected ${hub.name} City Hub!`); })}
              className={`relative p-6 rounded-3xl border transition-all cursor-pointer space-y-4 group overflow-hidden ${isDarkMode ? 'bg-[#072E33] border-[#294D61] hover:border-[#6DA5C0]' : 'bg-white border-[#B9DDE4] hover:border-[#0C7075] shadow-sm'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0C7075]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              <div className="flex justify-between items-start relative z-10">
                <span className="text-2xl">📍</span>
                <span className={`px-3 py-1 rounded-full font-bold text-[10px] border ${isDarkMode ? 'bg-[#072E33] text-[#03F3DA] border-[#0C7075]' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'}`}>
                  {hub.leads}
                </span>
              </div>
              
              <div className="relative z-10">
                <h3 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>{hub.name}</h3>
                <p className="text-xs text-[#0C7075] mt-1 font-semibold">{hub.tag}</p>
                <p className={`text-[11px] mt-2 leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>{hub.desc}</p>
              </div>

              <div className="pt-2 text-xs font-bold text-[#03F3DA] flex items-center gap-1 relative z-10">
                Explore {hub.name} Leads →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRO AI FEATURES & SECURE INBOX ================= */}
      <section id="features" className={`px-6 lg:px-16 py-20 border-y transition-colors ${isDarkMode ? 'bg-[#072E33] border-[#294D61]' : 'bg-[#EAF4F7] border-[#B9DDE4]'}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border inline-block ${isDarkMode ? 'bg-[#072E33] text-[#03F3DA] border-[#0C7075]' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'}`}>
              🔒 Built-in Secure Inbox System
            </span>
            <h2 className={`text-3xl font-black leading-tight ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>
              No More Lost Numbers. Keep All Negotiations Inside Huntify.
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
              When leads find your phone number externally, they often vanish. Huntify routes all client outreach through an internal secure inbox. Messages dispatch directly to their verified email while keeping your deal pipeline fully organized in one professional dashboard.
            </p>
            <ul className={`space-y-3 text-xs font-bold ${isDarkMode ? 'text-[#D4E6EE]' : 'text-[#072E33]'}`}>
              <li className="flex items-center gap-2">✅ Direct Email Dispatch via Internal Messaging</li>
              <li className="flex items-center gap-2">✅ Automated Website Speed & SSL Audit Reports</li>
              <li className="flex items-center gap-2">✅ Professional User Profile & Resume Management</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuresList.map((feat, idx) => (
              <div key={idx} className={`p-5 rounded-2xl border transition-all space-y-2 group shadow-lg ${isDarkMode ? 'bg-[#05161A] border-[#294D61] hover:border-[#0C7075]' : 'bg-white border-[#B9DDE4] hover:border-[#0C7075]'}`}>
                <div className={`w-8 h-8 rounded-xl font-black flex items-center justify-center text-xs border ${isDarkMode ? 'bg-[#072E33] text-[#03F3DA] border-[#0C7075]' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'}`}>
                  0{idx + 1}
                </div>
                <h3 className={`font-black text-sm group-hover:text-[#03F3DA] transition-colors ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>{feat.title}</h3>
                <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>{feat.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= FREQUENTLY ASKED QUESTIONS (FAQ) ================= */}
      <section id="faq" className="px-6 lg:px-16 py-24 max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className={`text-2xl sm:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>Frequently Asked Questions</h2>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>Got questions about how Huntify works? We have answers.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border transition-all space-y-2 shadow-xl ${isDarkMode ? 'bg-[#072E33] border-[#294D61] hover:border-[#0C7075]' : 'bg-white border-[#B9DDE4] hover:border-[#0C7075]'}`}>
              <h3 className={`text-sm sm:text-base font-black ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>{faq.q}</h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

</div>
  );
}
