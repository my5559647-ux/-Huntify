'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function CRMHubPage() {
  const { theme } = useAuth();
  const isDarkMode = theme === 'dark';
  const [notification, setNotification] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Mock CRM client data
  const [crmClients, setCrmClients] = useState([
    {
      id: 1,
      name: 'Lahore Gourmet Bakers & Cafe',
      skill: 'Web Designer',
      status: 'Proposal Sent',
      dealValue: '$450',
      lastContact: 'Today',
      email: 'info@lahoregourmetcafe.pk'
    },
    {
      id: 2,
      name: 'Al-Madina Auto Spare Parts',
      skill: 'Digital Marketer',
      status: 'In Discussion',
      dealValue: '$300',
      lastContact: 'Yesterday',
      email: 'contact@almadinaauto.pk'
    },
    {
      id: 3,
      name: 'Zenith Tech Software House',
      skill: 'Full Stack Developer',
      status: 'Negotiation',
      dealValue: '$1,200',
      lastContact: '3 days ago',
      email: 'hello@zenithtech.com'
    },
    {
      id: 4,
      name: 'Glamour Bridal Studio & Salon',
      skill: 'Video Editor',
      status: 'Deal Closed',
      dealValue: '$600',
      lastContact: '1 week ago',
      email: 'glamourstudio@gmail.com'
    }
  ]);

  const filteredClients = filterStatus === 'All' 
    ? crmClients 
    : crmClients.filter(client => client.status === filterStatus);

  const base = isDarkMode ? 'bg-[#05161A] text-[#FAF8F5]' : 'bg-[#F4FAFC] text-[#072E33]';
  const card = isDarkMode ? 'bg-[#072E33] border-[#294D61]' : 'bg-white border-[#B9DDE4]';
  const muted = isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]';
  const heading = isDarkMode ? 'text-white' : 'text-[#072E33]';
  const cta = isDarkMode ? 'bg-[#0C7075] text-white hover:bg-[#0A5A5E]' : 'bg-[#0C7075] text-white hover:bg-[#0A5A5E]';

  return (
    <div className={`min-h-screen ${base} font-sans transition-colors duration-300 ${isDarkMode ? 'selection:bg-[#03F3DA] selection:text-[#05161A]' : 'selection:bg-[#0C7075] selection:text-white'}`}>
      
      {/* Ambient Teal/Emerald Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#0C7075]/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#6DA5C0]/15 blur-[180px] rounded-full pointer-events-none -z-10"></div>

      {/* Shared Teal Navbar */}
      <Navbar active="crm" />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C7075] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl animate-bounce border border-[#03F3DA]/50">
          ✨ {notification}
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Page Purpose & Guide Banner */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-3 ${isDarkMode ? 'bg-[#072E33]/70 border-[#294D61]' : 'bg-gradient-to-r from-[#EAF4F7] to-[#F4FAFC] border-[#B9DDE4]'}`}>
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm inline-block ${isDarkMode ? 'bg-[#294D61] text-[#03F3DA] border-[#0C7075]' : 'bg-white text-[#0C7075] border-[#B9DDE4]'}`}>
            📌 Page Purpose & Guide: CRM Hub
          </span>
          <h1 className={`text-2xl sm:text-3xl font-black ${heading}`}>Manage & Track All Your Client Relationships</h1>
          <p className={`text-xs sm:text-sm ${muted} leading-relaxed max-w-3xl`}>
            This page serves as your centralized **Customer Relationship Management (CRM)** dashboard. Once you pitch leads or initiate contact, track their ongoing status, deal values, and communication stages here to ensure no potential client slips through the cracks.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-2xl border shadow-sm ${card}`}>
          <div className={`flex items-center gap-2 text-xs font-bold ${muted} flex-wrap`}>
            <span>Filter Status:</span>
            {['All', 'Proposal Sent', 'In Discussion', 'Negotiation', 'Deal Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-xl transition-all ${filterStatus === status ? 'bg-[#0C7075] text-white shadow-sm' : isDarkMode ? 'bg-[#05161A] text-[#A9C6D4] hover:bg-[#294D61]' : 'bg-[#EAF4F7] text-[#294D61] hover:bg-[#D5ECF0]'}`}
              >
                {status}
              </button>
            ))}
          </div>
          <button 
            onClick={() => triggerToast("New client manual entry modal opened!")}
            className={`px-4 py-2 rounded-xl ${cta} font-bold text-xs transition-all shadow-md`}
          >
            + Add New Client
          </button>
        </div>

        {/* Clients Table / Grid */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden ${card}`}>
          <div className={`p-6 border-b flex justify-between items-center ${isDarkMode ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
            <h3 className={`text-base font-black ${heading}`}>Active Client Pipeline ({filteredClients.length})</h3>
            <span className={`text-xs font-bold ${muted}`}>Updated Live</span>
          </div>

          <div className={`divide-y ${isDarkMode ? 'divide-[#294D61]' : 'divide-[#B9DDE4]'}`}>
            {filteredClients.map((client) => (
              <div key={client.id} className={`p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors ${isDarkMode ? 'hover:bg-[#05161A]' : 'hover:bg-[#EAF4F7]'}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-black ${heading}`}>{client.name}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${isDarkMode ? 'bg-[#294D61] text-[#03F3DA]' : 'bg-[#EAF4F7] text-[#0C7075]'}`}>
                      {client.skill}
                    </span>
                  </div>
                  <p className={`text-xs ${muted}`}>✉️ {client.email} • Last Contact: {client.lastContact}</p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className={`text-xs font-bold ${heading} block`}>{client.dealValue}</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                      client.status === 'Deal Closed' ? 'bg-green-100 text-green-800' : isDarkMode ? 'bg-[#294D61] text-[#03F3DA]' : 'bg-[#EAF4F7] text-[#0C7075]'
                    }`}>
                      {client.status}
                    </span>
                  </div>
                  <Link 
                    href="/messages"
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${isDarkMode ? 'bg-[#05161A] text-[#03F3DA] border-[#294D61] hover:bg-[#0C7075] hover:text-white' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4] hover:bg-[#0C7075] hover:text-white'}`}
                  >
                    View Chat →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
