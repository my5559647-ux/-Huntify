'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function UserDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'campaigns'>('leads');

  const userLeads = [
    { id: '1', business: 'Royal Spice Lahore', status: 'In Progress', budget: '$400', date: 'Aug 6, 2026' },
    { id: '2', business: 'Al-Madina Real Estate', status: 'Contacted', budget: '$800', date: 'Aug 5, 2026' },
  ];

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#05161A] text-[#FAF8F5]' : 'bg-[#F4FAFC] text-[#072E33]'}`}>
      
      {/* Sidebar */}
      <aside className={`w-72 border-r p-6 hidden lg:flex flex-col justify-between ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
        <div>
          <h2 className="text-2xl font-black mb-8">Lead<span className="text-[#03F3DA]">Flow.ai</span> <span className="text-xs bg-[#0C7075]/20 text-[#0C7075] px-2 py-0.5 rounded-full">User Hub</span></h2>
          <div className="space-y-2">
            <Link href="/dashboard/user" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs bg-[#0C7075] text-white">
              📊 My Dashboard
            </Link>
            <Link href="/lead-finder" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs ${isDarkMode ? 'hover:bg-[#072E33] text-[#A9C6D4]' : 'hover:bg-[#EAF4F7] text-[#294D61]'}`}>
              🔍 Lead Finder & Audit
            </Link>
          </div>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-xl border text-xs font-bold">
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Welcome Back, Ismab! 👋</h1>
            <p className="text-xs opacity-70 mt-1">Here is your personal lead generation and campaign summary.</p>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-[#0C7075]/10 text-[#0C7075] font-bold text-xs border border-[#0C7075]/20">
            Account Type: Pro User
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-xs opacity-70">Total Saved Leads</p>
            <p className="text-3xl font-black text-[#03F3DA] mt-1">12</p>
          </div>
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-xs opacity-70">Active Campaigns</p>
<p className="text-3xl font-black text-[#03F3DA] mt-1">3</p>
          </div>
          <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-xs opacity-70">Conversion Rate</p>
            <p className="text-3xl font-black text-emerald-500 mt-1">24.5%</p>
          </div>
        </div>

        {/* Table */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
          <h3 className="font-black text-sm mb-4">Your Recent Saved Leads & Deals</h3>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b opacity-50">
                <th className="pb-3">Business Name</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Estimated Budget</th>
                <th className="pb-3">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {userLeads.map(item => (
                <tr key={item.id} className="h-12">
                  <td className="font-bold text-[#0C7075]">{item.business}</td>
                  <td><span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 font-bold text-[10px]">{item.status}</span></td>
                  <td className="font-semibold">{item.budget}</td>
                  <td className="opacity-70">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
