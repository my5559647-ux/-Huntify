'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Sparkles, Pin, ArrowUpRight, X, Rocket } from 'lucide-react';

export default function PipelinePage() {
  const { theme } = useAuth();
  const isDarkMode = theme === 'dark';
  const [notification, setNotification] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All Stages');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState<any | null>(null);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Unique Pipeline Data focused strictly on Sales Funnel Metrics & Closing Forecasts
  const [pipelineDeals, setPipelineDeals] = useState([
    {
      id: 1,
      company: 'Urban Brew Cafe',
      niche: 'Website Redesign',
      dealValue: 800,
      probability: '20%',
      stage: 'Prospecting',
      closingDate: 'Aug 20, 2026',
      nextAction: 'Send introductory pitch deck'
    },
    {
      id: 2,
      company: 'Pakistani Textile Mills',
      niche: 'Enterprise Portal',
      dealValue: 2400,
      probability: '25%',
      stage: 'Prospecting',
      closingDate: 'Aug 25, 2026',
      nextAction: 'Call marketing head'
    },
    {
      id: 3,
      company: 'Al-Madina Auto Parts',
      niche: 'Digital Marketing Ads',
      dealValue: 450,
      probability: '50%',
      stage: 'Proposal Sent',
      closingDate: 'Aug 14, 2026',
      nextAction: 'Awaiting feedback on ad budget'
    },
    {
      id: 4,
      company: 'Lahore Gourmet Bakers',
      niche: 'UI/UX Mockups',
      dealValue: 650,
      probability: '60%',
      stage: 'Proposal Sent',
      closingDate: 'Aug 12, 2026',
      nextAction: 'Follow up on mockup revisions'
    },
    {
      id: 5,
      company: 'Zenith Tech Software',
      niche: 'Full Stack App',
      dealValue: 1500,
      probability: '80%',
      stage: 'Negotiation',
      closingDate: 'Aug 10, 2026',
      nextAction: 'Finalizing API contract terms'
    },
    {
      id: 6,
      company: 'Glamour Bridal Salon',
      niche: 'Video Editing & Reels',
      dealValue: 600,
      probability: '100%',
      stage: 'Closed Won',
      closingDate: 'Aug 04, 2026',
      nextAction: 'Project delivered & payment cleared'
    }
  ]);

  // Filter deals based on active stage tab and search query
  const filteredDeals = pipelineDeals.filter(deal => {
    const matchesTab = activeTab === 'All Stages' || deal.stage === activeTab;
    const matchesSearch = deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          deal.niche.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalForecastValue = pipelineDeals.reduce((sum, d) => sum + d.dealValue, 0);

  const handleStageUpdate = (id: number, newStage: string) => {
    setPipelineDeals(prev => prev.map(d => d.id === id ? { ...d, stage: newStage } : d));
    triggerToast(`Deal stage updated to [${newStage}] successfully!`);
  };

  const stageTabs = ['All Stages', 'Prospecting', 'Proposal Sent', 'Negotiation', 'Closed Won'];

  const base = isDarkMode ? 'bg-[#05161A] text-[#FAF8F5]' : 'bg-[#F4FAFC] text-[#072E33]';
  const card = isDarkMode ? 'bg-[#072E33] border-[#294D61]' : 'bg-white border-[#B9DDE4]';
  const muted = isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]';
  const heading = isDarkMode ? 'text-white' : 'text-[#072E33]';
  const soft = isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-[#EAF4F7] border-[#B9DDE4]';

  return (
    <div className={`min-h-screen ${base} font-sans transition-colors duration-300 ${isDarkMode ? 'selection:bg-[#03F3DA] selection:text-[#05161A]' : 'selection:bg-[#0C7075] selection:text-white'}`}>
      
      {/* Ambient Teal/Emerald Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#0C7075]/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#6DA5C0]/15 blur-[180px] rounded-full pointer-events-none -z-10"></div>

      {/* Shared Teal Navbar */}
      <Navbar active="pipeline" />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C7075] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl animate-bounce border border-[#03F3DA]/50 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> {notification}
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page Purpose & Guide Banner */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-3 ${isDarkMode ? 'bg-[#072E33]/70 border-[#294D61]' : 'bg-gradient-to-r from-[#EAF4F7] to-[#F4FAFC] border-[#B9DDE4]'}`}>
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm inline-flex items-center gap-2 ${isDarkMode ? 'bg-[#294D61] text-[#03F3DA] border-[#0C7075]' : 'bg-white text-[#0C7075] border-[#B9DDE4]'}`}>
            <Pin className="w-4 h-4" /> Page Purpose & Guide: Sales Pipeline & Revenue Forecasting
          </span>
          <h1 className={`text-2xl sm:text-3xl font-black ${heading}`}>Sales Funnel & Deal Forecasting Table</h1>
          <p className={`text-xs sm:text-sm ${muted} leading-relaxed max-w-4xl`}>
            Unlike the CRM Hub which stores client contact directories, this **Pipeline** table tracks financial conversion stages, closing probabilities, and projected revenue deadlines to help you forecast agency income seamlessly.
          </p>
        </div>

        {/* Top Control Bar with Stats & Search */}
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 rounded-3xl border shadow-md ${card}`}>
          <div className="flex items-center gap-4">
            <div className={`px-5 py-3 rounded-2xl text-xs font-bold border ${soft} ${heading}`}>
              Total Pipeline Value: <span className="text-[#0C7075] text-sm font-black">${totalForecastValue.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search company or service niche..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 rounded-2xl text-xs outline-none border transition-all ${isDarkMode ? 'bg-[#05161A] border-[#294D61] text-white placeholder:text-[#6DA5C0] focus:border-[#03F3DA]' : 'bg-[#EAF4F7] border-[#B9DDE4] text-[#072E33] placeholder:text-[#6DA5C0] focus:border-[#0C7075]'}`}
            />
          </div>
        </div>

        {/* Stage Filter Tabs */}
        <div className={`flex flex-wrap gap-2 p-3 rounded-3xl border shadow-sm ${card}`}>
          {stageTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-[#0C7075] text-white shadow-md' 
                  : isDarkMode ? 'bg-[#05161A] text-[#A9C6D4] hover:bg-[#294D61] hover:text-[#03F3DA]' : 'bg-[#EAF4F7] text-[#294D61] hover:bg-[#D5ECF0] hover:text-[#0C7075]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Professional Table Container */}
        <div className={`rounded-3xl border shadow-xl overflow-hidden ${card}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-bold text-[#0C7075] uppercase tracking-wider ${isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-[#EAF4F7] border-[#B9DDE4]'}`}>
                  <th className="p-5">Company / Deal Name</th>
                  <th className="p-5">Service Niche</th>
                  <th className="p-5">Deal Value</th>
                  <th className="p-5">Probability</th>
                  <th className="p-5">Expected Closing</th>
                  <th className="p-5">Funnel Stage</th>
                  <th className="p-5 text-right">Forecast Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-[#294D61]' : 'divide-[#B9DDE4]'}`}>
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className={`transition-colors ${isDarkMode ? 'hover:bg-[#05161A]' : 'hover:bg-[#EAF4F7]'}`}>
                    <td className={`p-5 font-black ${heading}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#03F3DA]"></div>
                        <span>{deal.company}</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full font-bold text-[10px] border ${isDarkMode ? 'bg-[#294D61] text-[#03F3DA] border-[#0C7075]' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'}`}>
                        {deal.niche}
                      </span>
                    </td>
                    <td className={`p-5 font-black text-[#0C7075] text-sm`}>${deal.dealValue}</td>
                    <td className={`p-5 font-bold ${muted}`}>{deal.probability}</td>
                    <td className={`p-5 font-medium ${muted}`}>{deal.closingDate}</td>
                    <td className="p-5">
                      <select 
                        value={deal.stage}
                        onChange={(e) => handleStageUpdate(deal.id, e.target.value)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold outline-none cursor-pointer border transition-all ${isDarkMode ? 'bg-[#05161A] border-[#294D61] text-white hover:border-[#03F3DA]' : 'bg-white border-[#B9DDE4] text-[#072E33] hover:border-[#0C7075]'}`}
                      >
                        {['Prospecting', 'Proposal Sent', 'Negotiation', 'Closed Won'].map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => {
                          setSelectedForecast(deal);
                          setIsModalOpen(true);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${isDarkMode ? 'bg-[#05161A] text-[#03F3DA] border-[#294D61] hover:bg-[#0C7075] hover:text-white' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4] hover:bg-[#0C7075] hover:text-white'}`}
                      >
                        Inspect <ArrowUpRight className="inline w-4 h-4 ml-1" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredDeals.length === 0 && (
                  <tr>
                    <td colSpan={7} className={`p-12 text-center text-xs ${muted}`}>
                      No deals found matching your active filter or search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* FORECAST INSPECTION MODAL */}
      {isModalOpen && selectedForecast && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border space-y-6 animate-in fade-in zoom-in duration-200 ${card}`}>
            <div className={`flex justify-between items-start border-b pb-4 ${isDarkMode ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${isDarkMode ? 'bg-[#294D61] text-[#03F3DA]' : 'bg-[#EAF4F7] text-[#0C7075]'}`}>Deal Forecast Details</span>
                <h2 className={`text-xl font-black ${heading} mt-1`}>{selectedForecast.company}</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`w-9 h-9 rounded-xl font-black border transition-all flex items-center justify-center text-sm ${isDarkMode ? 'bg-[#05161A] text-white border-[#294D61] hover:bg-[#294D61] hover:text-[#03F3DA]' : 'bg-[#F4FAFC] text-[#072E33] border-[#B9DDE4] hover:bg-[#D5ECF0] hover:text-[#0C7075]'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className={`p-4 rounded-2xl border flex justify-between items-center ${soft}`}>
                <span className={muted}>Valuation & Probability:</span>
                <span className="text-sm font-black text-[#0C7075]">${selectedForecast.dealValue} ({selectedForecast.probability})</span>
              </div>
              <div className={`p-4 rounded-2xl border space-y-1 ${soft}`}>
                <span className={`text-[10px] font-bold uppercase ${muted}`}>Next Strategic Action Step</span>
                <p className={`font-bold ${heading}`}>{selectedForecast.nextAction}</p>
              </div>
            </div>

            <button 
              onClick={() => {
                triggerToast("Forecast details saved successfully!");
                setIsModalOpen(false);
              }}
              className="w-full py-3.5 rounded-xl bg-[#0C7075] text-white font-black text-xs hover:bg-[#0A5A5E] transition-all shadow-md"
            >
              Close & Return to Pipeline <Rocket className="inline w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
