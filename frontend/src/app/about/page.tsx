'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Shield, Zap, Rocket, Target, Folder, TrendingUp, MapPin, X, ArrowLeft } from 'lucide-react';

export default function AboutUsPage() {
  const { theme } = useAuth();
  const isDarkMode = theme === 'dark';

  const coreValues = [
    { title: 'Absolute Data Security', desc: 'All client negotiations and scraped leads are encrypted and strictly bound to your private session.', icon: 'shield' },
    { title: 'Speed & Intelligence', desc: 'Automated map scraping and live website speed audits execute in seconds to save hours of manual research.', icon: 'zap' },
    { title: 'Zero Deal Drop-off', desc: 'By routing outreach through secure internal messaging bridges, client contact leaks are completely eliminated.', icon: 'rocket' },
  ];

  const missionPoints = [
    'Unify local map intelligence, live website audits, and deal closing into one seamless platform.',
    'Eliminate the chaos of scattered spreadsheets and leaked client contacts.',
    'Give freelancers and agencies the same powerful tooling as enterprise teams.',
    'Keep every negotiation encrypted and organized inside a private, secure pipeline.',
  ];

  const ecosystem = [
    { title: 'Lead Finder', desc: 'Automated B2B map scraper that extracts verified businesses, contacts, and websites in seconds.', icon: 'target' },
    { title: 'CRM Hub', desc: 'Centralized client records and notes, fully encrypted within your private user session.', icon: 'folder' },
    { title: 'Pipeline', desc: 'A teal deal board that tracks every lead from first outreach to final conversion.', icon: 'trending-up' },
    { title: 'City Hubs', desc: 'Curated regional centers optimized for Lahore, Karachi, Islamabad, and Faisalabad.', icon: 'map-pin' },
  ];

  const techStack = [
    { name: 'Next.js 14 App Router', cat: 'Frontend Framework' },
    { name: 'Tailwind CSS', cat: 'UI Styling & Glows' },
    { name: 'TypeScript', cat: 'Type Safety & Logic' },
    { name: 'Node.js & Express', cat: 'Backend Secure API' },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#05161A] text-[#FAF8F5] selection:bg-[#03F3DA] selection:text-[#05161A]' : 'bg-[#F4FAFC] text-[#072E33] selection:bg-[#0C7075] selection:text-white'}`}>

      {/* Ambient Teal/Emerald Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#0C7075]/25 blur-[160px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#6DA5C0]/20 blur-[190px] rounded-full pointer-events-none -z-10"></div>

      {/* Shared Navbar (matches Home page header, Profile picture far right) */}
      <Navbar active="about" />

      {/* ================= HERO SECTION ================= */}
      <section className="px-6 lg:px-16 pt-20 pb-16 text-center max-w-5xl mx-auto space-y-6">
        <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold shadow-2xl border backdrop-blur-md ${isDarkMode ? 'bg-[#072E33]/80 text-[#03F3DA] border-[#0C7075]/60' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'}`}>
          <span>Crafting The Ultimate Digital Business Ecosystem</span>
        </div>

        <h1 className={`text-3xl sm:text-6xl font-black tracking-tight leading-[1.15] ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>
          Empowering The Future Of <br />
          <span className="bg-gradient-to-r from-[#03F3DA] via-[#0C7075] to-[#6DA5C0] bg-clip-text text-transparent">
            Smart Lead Acquisition & CRM.
          </span>
        </h1>

        <p className={`text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
          Huntify is built with dedication to solve real-world agency challenges, unifying local map leads, live performance audits, and secure deal closings into one seamless platform.
        </p>
      </section>

      {/* ================= MISSION SECTION ================= */}
      <section className={`px-6 lg:px-16 py-16 border-y ${isDarkMode ? 'bg-[#072E33]/70 border-[#294D61]' : 'bg-[#EAF4F7] border-[#B9DDE4]'}`}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className={`p-8 rounded-3xl border shadow-2xl space-y-4 ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center shadow-lg border border-[#03F3DA]/40`}>
              <Target className="w-7 h-7 text-white" />
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>Our Mission</h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
              To arm every freelancer, developer, and digital agency with a single pro-grade platform that replaces manual research, scattered spreadsheets, and lost client contacts with one intelligent, secure, and automated workflow.
            </p>
          </div>

          <div className="space-y-4">
            {missionPoints.map((point, idx) => (
              <div key={idx} className={`flex items-start gap-4 p-5 rounded-2xl border shadow-lg transition-all ${isDarkMode ? 'bg-[#072E33] border-[#294D61] hover:border-[#0C7075]' : 'bg-white border-[#B9DDE4] hover:border-[#0C7075]'}`}>
                <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-black text-xs border ${isDarkMode ? 'bg-[#294D61] text-[#03F3DA] border-[#0C7075]' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'}`}>
                  0{idx + 1}
                </span>
                <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDarkMode ? 'text-[#D4E6EE]' : 'text-[#294D61]'}`}>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CORE PRINCIPLES SECTION ================= */}
      <section className="px-6 lg:px-16 py-16 max-w-6xl mx-auto">
        <div className="text-center space-y-2 mb-10">
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>Our Core Principles</h2>
          <p className={`text-xs ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>Designed with strict engineering standards for supreme efficiency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => (
            <div key={idx} className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-3 transition-transform hover:-translate-y-2 duration-300 ${isDarkMode ? 'bg-[#072E33]/90 border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center shadow-lg border border-[#03F3DA]/40">
                {val.icon === 'shield' && <Shield className="w-6 h-6 text-white" />}
                {val.icon === 'zap' && <Zap className="w-6 h-6 text-white" />}
                {val.icon === 'rocket' && <Rocket className="w-6 h-6 text-white" />}
              </div>
              <h3 className={`text-base sm:text-lg font-black ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>{val.title}</h3>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= ECOSYSTEM OVERVIEW SECTION ================= */}
      <section className={`px-6 lg:px-16 py-16 border-y ${isDarkMode ? 'bg-[#072E33]/70 border-[#294D61]' : 'bg-[#EAF4F7] border-[#B9DDE4]'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>One Seamless Ecosystem</h2>
            <p className={`text-xs ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>Every module works together to move you from lead discovery to closed deal.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystem.map((mod, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border shadow-xl transition-all hover:-translate-y-1.5 duration-300 ${isDarkMode ? 'bg-[#05161A] border-[#294D61] hover:border-[#0C7075]' : 'bg-white border-[#B9DDE4] hover:border-[#0C7075]'}`}>
                <div className="w-12 h-12 mb-3 rounded-2xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center shadow-lg border border-[#03F3DA]/40">
                  {mod.icon === 'target' && <Target className="w-6 h-6 text-white" />}
                  {mod.icon === 'folder' && <Folder className="w-6 h-6 text-white" />}
                  {mod.icon === 'trending-up' && <TrendingUp className="w-6 h-6 text-white" />}
                  {mod.icon === 'map-pin' && <MapPin className="w-6 h-6 text-white" />}
                </div>
                <h3 className={`font-black text-sm mb-2 ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>{mod.title}</h3>
                <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TECH STACK SECTION ================= */}
      <section className="px-6 lg:px-16 py-16 max-w-5xl mx-auto">
        <div className="text-center space-y-6">
          <h2 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>Powered By Modern Tech Stack</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {techStack.map((tech, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border shadow-inner ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
                <p className={`text-xs font-black ${isDarkMode ? 'text-[#03F3DA]' : 'text-[#0C7075]'}`}>{tech.name}</p>
                <p className={`text-[10px] mt-1 ${isDarkMode ? 'text-[#6DA5C0]' : 'text-[#294D61]'}`}>{tech.cat}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DEVELOPER PROFILE SECTION ================= */}
      <section className="px-6 lg:px-16 py-16 max-w-4xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-[#0C7075] to-[#6DA5C0] flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-2xl border border-[#03F3DA]/60">
          IY
        </div>

        <div className="space-y-1">
          <h2 className={`text-2xl sm:text-3xl font-black ${isDarkMode ? 'text-white' : 'text-[#072E33]'}`}>Ismab Yaseen</h2>
          <p className="text-xs font-bold text-[#0C7075]">Lead Full-Stack Developer & Creator</p>
        </div>

        <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed ${isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>
          BSIT (5th Semester) Student at GCUF, specializing in modern web development frameworks including Next.js, React, TypeScript, and high-performance backend architectures.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white font-black text-xs shadow-xl inline-block hover:scale-105 transition-transform border border-[#03F3DA]/50"
          >
            Back to Home Dashboard
          </Link>
        </div>
      </section>

</div>
  );
}
