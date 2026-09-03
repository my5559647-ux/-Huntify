'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

export default function AdminDashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const registeredUsers = [
    { id: '1', name: 'Ismab Yaseen', email: 'ismab@gcuf.edu.pk', role: 'Super Admin', status: 'Active' },
    { id: '2', name: 'Ali Khan', email: 'ali@gmail.com', role: 'Standard User', status: 'Active' },
    { id: '3', name: 'Ayesha Malik', email: 'ayesha@hotmail.com', role: 'Standard User', status: 'Pending' },
  ];

  return (
<div className={`min-h-screen flex font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#05161A] text-[#F3F3F4]' : 'bg-[#F4FAFC] text-[#072E33]'}`}>
      
      {/* Admin Sidebar */}
<aside className={`w-72 border-r p-6 hidden lg:flex flex-col justify-between ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
        <div>
<h2 className="text-2xl font-black mb-8">Lead<span className="text-[#03F3DA]">Flow.ai</span> <span className="text-xs bg-[#0C7075]/20 text-[#03F3DA] px-2 py-0.5 rounded-full">ADMIN PANEL</span></h2>
          <div className="space-y-2">
            <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white shadow-md">
              Admin Control Center
            </Link>
<Link href="/lead-finder" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs ${isDarkMode ? 'hover:bg-[#072E33] text-slate-300' : 'hover:bg-[#EAF4F7] text-[#294D61]'}`}>
              System Lead Scanner
            </Link>
          </div>
        </div>
<div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
          <p className="text-[10px] font-bold text-emerald-500">Secure Admin Session</p>
        </div>
      </aside>

      {/* Admin Main Workspace */}
      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black">Admin Control Panel</h1>
            <p className="text-xs opacity-70 mt-1">Manage platform users, server logs, and AI scanning nodes across Pakistan.</p>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
className="px-4 py-2 rounded-xl border text-xs font-bold bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
          >
            {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>

        {/* Admin System Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
<div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-[11px] opacity-70">Total Platform Users</p>
<p className="text-2xl font-black text-[#03F3DA] mt-1">1,420</p>
            <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1"><ArrowUp className="w-3 h-3" /> +18% this week</p>
          </div>
<div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-[11px] opacity-70">Verified Leads Scanned</p>
<p className="text-2xl font-black text-emerald-500 mt-1">8,930</p>
            <p className="text-[10px] text-emerald-500 mt-1">All scrapers active</p>
          </div>
<div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-[11px] opacity-70">Server Latency</p>
            <p className="text-2xl font-black text-blue-400 mt-1">42 ms</p>
            <p className="text-[10px] text-emerald-500 mt-1">Optimal performance</p>
          </div>
<div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <p className="text-[11px] opacity-70">API Key Status</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">Secure</p>
            <p className="text-[10px] text-slate-400 mt-1">Vercel Production</p>
          </div>
        </div>

        {/* Users Management Table */}
<div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-sm">Platform Registered Users Management</h3>
<span className="text-xs text-emerald-500 font-bold">Total: {registeredUsers.length} Users Listed</span>
          </div>
          
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700/30 opacity-60">
                <th className="pb-3">User Full Name</th>
                <th className="pb-3">Email Address</th>
                <th className="pb-3">Access Role</th>
                <th className="pb-3">Account Status</th>
                <th className="pb-3 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {registeredUsers.map(u => (
                <tr key={u.id} className="h-14">
<td className="font-bold text-[#0C7075]">{u.name}</td>
                  <td className="opacity-80">{u.email}</td>
                  <td>
<span className={`px-2.5 py-1 rounded-md font-bold text-[10px] ${u.role === 'Super Admin' ? 'bg-[#0C7075]/20 text-[#03F3DA] border border-[#0C7075]/30' : 'bg-slate-700/20 text-slate-300'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
<span className={`px-2 py-0.5 rounded font-bold text-[10px] ${u.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#0C7075]/10 text-[#6DA5C0]'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="text-right">
<button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white font-bold text-[10px] transition-colors">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}