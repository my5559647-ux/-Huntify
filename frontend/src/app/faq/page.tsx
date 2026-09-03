'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const { theme } = useAuth();
  const isDarkMode = theme === 'dark';
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqList = [
    {
      q: "How does Huntify extract B2B leads?",
      a: "Huntify utilizes high-speed automated regional map scraping and live digital auditing to gather verified business contact data instantly without manual searching."
    },
    {
      q: "Is client deal data secure in the CRM Hub?",
      a: "Yes! All client communications, notes, and deal pipelines are fully encrypted and securely isolated within your private user session."
    },
    {
      q: "Can I track deal stages inside the platform?",
      a: "Absolutely. Our teal messaging pipeline allows you to seamlessly track deals from initial lead outreach down to final conversion."
    },
    {
      q: "How do I check website speed performance?",
      a: "The built-in AI auditing tools evaluate target website response times and performance metrics automatically within seconds."
    },
    {
      q: "Who developed Huntify?",
      a: "Huntify is engineered and developed by Ismab Yaseen, a Full-Stack MERN & Next.js Developer currently studying BSIT at GCUF."
    }
  ];

  const filteredFaqs = faqList.filter(item =>
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#05161A] text-[#FAF8F5] selection:bg-[#03F3DA] selection:text-[#05161A]' : 'bg-[#F4FAFC] text-[#072E33] selection:bg-[#0C7075] selection:text-white'}`}>

      {/* Ambient Teal/Emerald Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#0C7075]/25 blur-[160px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#6DA5C0]/20 blur-[190px] rounded-full pointer-events-none -z-10"></div>

      {/* Shared Navbar (matches Home page header, Profile picture far right) */}
      <Navbar active="faq" />

      {/* ================= FAQ HERO & SEARCH ================= */}
      <section className="px-6 lg:px-16 pt-20 pb-12 text-center max-w-4xl mx-auto space-y-6">
        <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold shadow-2xl border backdrop-blur-md ${isDarkMode ? 'bg-[#072E33]/80 text-[#03F3DA] border-[#0C7075]/60' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'}`}>
          <span>Got Questions? We Have Answers</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>
          Frequently Asked <span className="text-[#0C7075]">Questions</span>
        </h1>

        <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
          Everything you need to know about Huntify&apos;s lead extraction, CRM pipeline, and advanced platform security.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search questions (e.g. security, leads)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-5 py-3.5 rounded-2xl text-xs font-bold border shadow-inner transition-all outline-none ${isDarkMode ? 'bg-[#072E33] border-[#294D61] text-white focus:border-[#0C7075]' : 'bg-white border-[#B9DDE4] text-[#072E33] focus:border-[#0C7075]'}`}
          />
        </div>
      </section>

      {/* ================= FAQ ACCORDION LIST ================= */}
      <section className="px-6 lg:px-16 pb-24 max-w-3xl mx-auto">
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-3xl border shadow-xl transition-all overflow-hidden ${isDarkMode ? 'bg-[#072E33]/80 border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-black text-xs sm:text-sm"
                  >
                    <span className={isDarkMode ? 'text-white' : 'text-[#072E33]'}>{faq.q}</span>
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 transition-transform ${isOpen ? 'rotate-180 bg-[#0C7075] text-white' : (isDarkMode ? 'bg-[#294D61] text-[#03F3DA]' : 'bg-[#EAF4F7] text-[#0C7075]')}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className={`px-6 pb-6 text-xs sm:text-sm leading-relaxed border-t pt-4 ${isDarkMode ? 'border-[#294D61]/60 text-[#A9C6D4]' : 'border-[#D5ECF0] text-[#294D61]'}`}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-xs text-[#0C7075] font-bold">
              No matching questions found! Try searching something else.
            </div>
          )}
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="px-6 lg:px-16 pb-20 max-w-3xl mx-auto">
        <div className={`p-8 rounded-3xl border shadow-2xl text-center space-y-4 ${isDarkMode ? 'bg-[#072E33]/90 border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
          <h2 className={`text-xl sm:text-2xl font-black ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>Still have a question?</h2>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
            Explore our powerful Lead Finder, CRM Hub, and Pipeline to see Huntify in action.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <a
              href="/leadfinder"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white font-black text-xs shadow-lg hover:scale-105 transition-transform border border-[#03F3DA]/50"
            >
              Try Lead Finder
            </a>
          </div>
        </div>
      </section>

</div>
  );
}
