'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

interface ChatMsg {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

const SUGGESTIONS = [
  'Write a cold email for a restaurant in Lahore',
  'Audit my website for SEO issues',
  'Score a $50,000 lead',
  'Find a profitable niche in Pakistan',
  'How do I close a deal in the pipeline?',
];

function getAIResponse(input: string): string {
  const q = input.toLowerCase();
  if (q.includes('email') || q.includes('cold') || q.includes('pitch')) {
    return 'Here is a tailored cold email template:\n\nSubject: Boost your revenue with Huntify AI\n\nHi there,\n\nI noticed your business could capture more local clients online. Using Huntify, I can automate your lead generation, fix legacy website leaks, and secure direct conversions through an advanced pipeline.\n\nWould you be open to a quick audit call this week?\n\nBest, your favorite growth partner.';
  }
  if (q.includes('audit') || q.includes('website') || q.includes('seo')) {
    return 'I recommend running a full AI Website Audit. Paste any client URL into our Auditor tool to instantly check load speed, mobile responsiveness, and missing SEO meta tags. It will output a score (e.g. 58/100) plus concrete redesign recommendations to pitch the client.';
  }
  if (q.includes('score') || q.includes('lead') && q.includes('deal')) {
    return 'For a $50,000 deal, I would classify this as 🔥 Hot Lead (High Priority). Recommended action: Send an immediate personalized proposal and book a demo. Use the Lead Scoring Assistant to auto-generate this for any deal size.';
  }
  if (q.includes('niche') || q.includes('market') || q.includes('profitable')) {
    return 'Top trending Pakistani niches right now: 1) Software Houses & IT Agencies, 2) Textile & Garment Exporters, 3) E-commerce & Retail Brands. Use the Niche Intelligence tool to refresh demand data and filter by city.';
  }
  if (q.includes('close') || q.includes('pipeline') || q.includes('deal')) {
    return 'To close a deal in the pipeline: 1) Move the lead to Negotiation, 2) Send a personalized proposal via the CRM, 3) Follow up in the Messages hub, and 4) Mark it Deal Closed once signed. Every step is tracked visually on your Pipeline board.';
  }
  return 'I can help with B2B lead generation, website auditing, lead scoring, and CRM workflows. Try clicking a suggestion below, or ask me about cold emails, SEO audits, or closing deals!';
}

export default function AIFeaturesPage() {
  const { theme } = useAuth();
  const isDarkMode = theme === 'dark';
  const [notification, setNotification] = useState<string | null>(null);

  // AI Chat Assistant states
  const [chatOpen, setChatOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { id: 1, sender: 'ai', text: '👋 Hi! I am your Huntify AI Assistant. Ask me anything about lead generation, website audits, or CRM workflows.' },
  ]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // States for AI Cold Email Generator
  const [clientNiche, setClientNiche] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

  // States for AI Website Auditor
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [auditResult, setAuditResult] = useState<any | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // States for Lead Scoring Assistant
  const [leadName, setLeadName] = useState('');
  const [dealSize, setDealSize] = useState('');
  const [scoreResult, setScoreResult] = useState<any | null>(null);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatTyping]);

  const sendChat = (text?: string) => {
    const content = (text ?? chatInput).trim();
    if (!content) return;
    setChatMessages((prev) => [...prev, { id: Date.now(), sender: 'user', text: content }]);
    setChatInput('');
    setChatTyping(true);
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: getAIResponse(content) },
      ]);
      setChatTyping(false);
    }, 900);
  };

  // Handler for Cold Email Generation
  const handleGenerateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientNiche || !clientCity) {
      triggerToast('Please enter both niche and city for the email!');
      return;
    }
    setIsGeneratingEmail(true);
    setTimeout(() => {
      setGeneratedEmail(
        `Subject: Boost your ${clientNiche} revenue in ${clientCity} with Huntify AI\n\nHi there,\n\nI was reviewing local ${clientNiche} businesses in ${clientCity} and noticed a massive opportunity to capture high-value clients searching online.\n\nAt Huntify, we help regional businesses automate lead generation, fix legacy website leaks, and secure direct conversions through our advanced pipeline.\n\nWould you be open to a quick 5-minute audit call this week to see how we can drive 30+ qualified leads to your business?\n\nBest regards,\nIsmab Yaseen\nFull-Stack Web & Growth Developer`
      );
      setIsGeneratingEmail(false);
      triggerToast('AI Cold Email generated successfully!');
    }, 1200);
  };

  // Handler for Website Audit
  const handleAuditWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl) {
      triggerToast('Please enter a website URL to audit!');
      return;
    }
    setIsAuditing(true);
    setTimeout(() => {
      setAuditResult({
        score: '58/100',
        speed: 'Slow (3.8s Load Time)',
        seoStatus: 'Missing Meta Descriptions & H1 Tags',
        mobileFriendly: 'Passed with minor padding issues',
        recommendation: 'High priority: Redesign layout to a modern Next.js multi-page stack to boost conversion.'
      });
      setIsAuditing(false);
      triggerToast('AI Website Audit completed!');
    }, 1500);
  };

  // Handler for Lead Scoring
  const handleScoreLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !dealSize) {
      triggerToast('Please provide lead name and deal size!');
      return;
    }
    const score = Number(dealSize) > 50000 ? '🔥 Hot Lead (High Priority Conversion)' : '⚡ Warm Lead (Needs Follow-up)';
    setScoreResult({ name: leadName, potentialScore: score, recommendedAction: 'Immediate personalized proposal outreach.' });
    triggerToast('Lead score calculated!');
  };

  const base = isDarkMode ? 'bg-[#05161A] text-[#FAF8F5]' : 'bg-[#F4FAFC] text-[#072E33]';
  const card = isDarkMode ? 'bg-[#072E33] border-[#294D61]' : 'bg-white border-[#B9DDE4]';
  const muted = isDarkMode ? 'text-[#A9C6D4]' : 'text-[#294D61]';
  const heading = isDarkMode ? 'text-white' : 'text-[#072E33]';
  const inputCls = isDarkMode
    ? 'bg-[#05161A] border-[#294D61] text-white placeholder:text-[#6DA5C0] focus:border-[#03F3DA]'
    : 'bg-[#F4FAFC] border-[#B9DDE4] text-[#072E33] placeholder:text-[#6DA5C0] focus:border-[#0C7075]';
  const soft = isDarkMode ? 'bg-[#05161A] border-[#294D61]' : 'bg-[#EAF4F7] border-[#B9DDE4]';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative overflow-hidden ${base} ${isDarkMode ? 'selection:bg-[#03F3DA] selection:text-[#05161A]' : 'selection:bg-[#0C7075] selection:text-white'}`}>

      {/* Ambient Teal/Emerald Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#0C7075]/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#6DA5C0]/15 blur-[180px] rounded-full pointer-events-none -z-10"></div>

      {/* Shared Navbar */}
      <Navbar active="aifeatures" />

      {/* Floating Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 bg-[#0C7075] text-white text-xs font-bold px-6 py-3.5 rounded-2xl shadow-2xl border border-[#03F3DA]/50 animate-bounce backdrop-blur-md`}>
          ✨ {notification}
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Page Banner */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm space-y-3 ${isDarkMode ? 'bg-[#072E33]/70 border-[#294D61]' : 'bg-gradient-to-r from-[#EAF4F7] to-[#F4FAFC] border-[#B9DDE4]'}`}>
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm inline-block ${isDarkMode ? 'bg-[#294D61] text-[#03F3DA] border-[#0C7075]' : 'bg-white text-[#0C7075] border-[#B9DDE4]'}`}>
            🤖 Next-Gen AI Intelligence Suite
          </span>
          <h1 className={`text-2xl sm:text-3xl font-black ${heading}`}>Automate Outreach & Client Conversion with AI</h1>
          <p className={`text-xs sm:text-sm leading-relaxed max-w-4xl ${muted}`}>
            Leverage advanced AI tools built directly into Huntify. Chat with your AI Assistant, generate high-converting cold emails, audit legacy client websites for SEO flaws, and score leads instantly to close deals faster.
          </p>
        </div>

        {/* ================= AI CHAT ASSISTANT ================= */}
        <section className={`rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${card}`}>
          {/* Chat Header */}
          <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center text-lg shadow-lg border border-[#03F3DA]/40">
                🤖
              </div>
              <div>
                <h2 className={`text-sm font-black ${heading}`}>Huntify AI Assistant</h2>
                <p className="text-[10px] font-bold text-[#03F3DA]">● Online • Tailored to B2B Lead Gen, Auditing & CRM</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm border transition-all ${isDarkMode ? 'bg-[#294D61] border-[#0C7075] text-white' : 'bg-[#EAF4F7] border-[#B9DDE4] text-[#072E33]'}`}
            >
              {chatOpen ? '−' : '+'}
            </button>
          </div>

          {chatOpen && (
            <>
              {/* Messages */}
              <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-80 ${isDarkMode ? 'bg-[#05161A]' : 'bg-[#EAF4F7]'}`}>
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-sm whitespace-pre-line ${
                        isUser
                          ? 'bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white rounded-br-sm'
                          : isDarkMode
                            ? 'bg-[#072E33] border border-[#294D61] text-[#D4E6EE] rounded-bl-sm'
                            : 'bg-white border border-[#B9DDE4] text-[#072E33] rounded-bl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
                {chatTyping && (
                  <div className="flex justify-start">
                    <div className={`rounded-2xl px-4 py-3 text-xs shadow-sm flex items-center gap-1 ${card}`}>
                      <span className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-[#03F3DA]' : 'bg-[#0C7075]'}`} style={{ animationDelay: '0ms' }}></span>
                      <span className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-[#03F3DA]' : 'bg-[#0C7075]'}`} style={{ animationDelay: '150ms' }}></span>
                      <span className={`w-2 h-2 rounded-full animate-bounce ${isDarkMode ? 'bg-[#03F3DA]' : 'bg-[#0C7075]'}`} style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Smart Suggestions */}
              <div className={`px-4 sm:px-6 py-3 border-t flex flex-wrap gap-2 ${isDarkMode ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendChat(s)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${isDarkMode ? 'bg-[#072E33] border-[#0C7075] text-[#03F3DA] hover:bg-[#294D61]' : 'bg-[#EAF4F7] border-[#B9DDE4] text-[#0C7075] hover:bg-white'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className={`p-3 sm:p-4 border-t ${isDarkMode ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask Huntify AI anything..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                    className={`flex-1 px-4 py-3 rounded-2xl text-xs font-bold border outline-none transition-all ${inputCls}`}
                  />
                  <button
                    onClick={() => sendChat()}
                    className="w-11 h-11 shrink-0 rounded-xl bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white font-black flex items-center justify-center text-base shadow-lg hover:scale-105 transition-transform border border-[#03F3DA]/50"
                  >
                    ➤
                  </button>
                </div>
              </div>
            </>
          )}
        </section>

        {/* GRID OF AI TOOLS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* TOOL 1: AI Cold Email Generator */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 flex flex-col justify-between ${card}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] text-white flex items-center justify-center font-black text-sm">✉️</div>
                <div>
                  <h2 className={`text-lg font-black ${heading}`}>AI Cold Email & Outreach Generator</h2>
                  <p className={`text-xs ${muted}`}>Create hyper-personalized sales pitches instantly.</p>
                </div>
              </div>

              <form onSubmit={handleGenerateEmail} className="space-y-4 pt-2">
                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${muted}`}>Business Niche (e.g. Software House, Cafe)</label>
                  <input
                    type="text"
                    placeholder="e.g. Digital Agency"
                    value={clientNiche}
                    onChange={(e) => setClientNiche(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${muted}`}>Target City (e.g. Lahore, Karachi)</label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore"
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none ${inputCls}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isGeneratingEmail}
                  className="w-full py-3.5 rounded-xl bg-[#0C7075] text-white font-black text-xs hover:bg-[#0A5A5E] transition-all shadow-md disabled:opacity-50"
                >
                  {isGeneratingEmail ? 'AI is writing email...' : 'Generate Cold Email 🚀'}
                </button>
              </form>

              {generatedEmail && (
                <div className={`mt-4 p-4 rounded-2xl border space-y-2 ${soft}`}>
                  <span className={`text-[10px] font-bold uppercase text-[#0C7075]`}>Generated Output</span>
                  <pre className={`text-xs font-mono whitespace-pre-wrap p-3 rounded-xl border ${inputCls}`}>{generatedEmail}</pre>
                </div>
              )}
            </div>
          </div>

          {/* TOOL 2: AI Website & SEO Auditor */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 flex flex-col justify-between ${card}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] text-white flex items-center justify-center font-black text-sm">🔍</div>
                <div>
                  <h2 className={`text-lg font-black ${heading}`}>AI Website & SEO Auditor</h2>
                  <p className={`text-xs ${muted}`}>Analyze prospect websites to find flaws & pitch redesigns.</p>
                </div>
              </div>

              <form onSubmit={handleAuditWebsite} className="space-y-4 pt-2">
                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${muted}`}>Client Website URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com.pk"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none ${inputCls}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAuditing}
                  className="w-full py-3.5 rounded-xl bg-[#0C7075] text-white font-black text-xs hover:bg-[#0A5A5E] transition-all shadow-md disabled:opacity-50"
                >
                  {isAuditing ? 'Scanning website metrics...' : 'Run AI Website Audit 🔍'}
                </button>
              </form>

              {auditResult && (
                <div className={`mt-4 p-4 rounded-2xl border space-y-2 text-xs ${soft}`}>
                  <span className={`text-[10px] font-bold uppercase text-[#0C7075]`}>Audit Report Summary</span>
                  <div className={`space-y-1 font-medium ${muted}`}>
                    <p>⚡ Performance Score: <span className="font-black text-[#0C7075]">{auditResult.score}</span></p>
                    <p>🐌 Load Speed: {auditResult.speed}</p>
                    <p>🛠️ SEO Health: {auditResult.seoStatus}</p>
                    <p className={`pt-2 font-bold text-[#0C7075]`}>💡 {auditResult.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TOOL 3: AI Lead Scorer & Conversion Predictor */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 flex flex-col justify-between ${card}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] text-white flex items-center justify-center font-black text-sm">📊</div>
                <div>
                  <h2 className={`text-lg font-black ${heading}`}>AI Lead Scoring Assistant</h2>
                  <p className={`text-xs ${muted}`}>Prioritize prospects based on budget and conversion probability.</p>
                </div>
              </div>

              <form onSubmit={handleScoreLead} className="space-y-4 pt-2">
                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${muted}`}>Prospect / Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alpha Tech Solutions"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={`block text-[11px] font-bold uppercase mb-1 ${muted}`}>Expected Deal Size (PKR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 75000"
                    value={dealSize}
                    onChange={(e) => setDealSize(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl border text-xs outline-none ${inputCls}`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0C7075] text-white font-black text-xs hover:bg-[#0A5A5E] transition-all shadow-md"
                >
                  Calculate Lead Score ⚡
                </button>
              </form>

              {scoreResult && (
                <div className={`mt-4 p-4 rounded-2xl border space-y-2 text-xs ${soft}`}>
                  <span className={`text-[10px] font-bold uppercase text-[#0C7075]`}>Scoring Result for {scoreResult.name}</span>
                  <p className={`font-black text-sm text-[#0C7075]`}>{scoreResult.potentialScore}</p>
                  <p className={`font-bold ${muted}`}>Action: {scoreResult.recommendedAction}</p>
                </div>
              )}
            </div>
          </div>

          {/* TOOL 4: Niche Intelligence & Market Keyword Finder */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 flex flex-col justify-between ${card}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] text-white flex items-center justify-center font-black text-sm">🎯</div>
                <div>
                  <h2 className={`text-lg font-black ${heading}`}>AI Niche & Keyword Intelligence</h2>
                  <p className={`text-xs ${muted}`}>Discover high-demand local SEO keywords and profitable niches.</p>
                </div>
              </div>

              <div className={`p-5 rounded-2xl border space-y-3 text-xs ${soft}`}>
                <span className={`text-[10px] font-bold uppercase text-[#0C7075]`}>Top Trending Pakistani Niches (AI Analyzed)</span>
                <ul className={`space-y-2 font-bold ${muted}`}>
                  <li className={`flex justify-between items-center p-2.5 rounded-xl border ${soft}`}>
                    <span>1. Software Houses & IT Agencies (Lahore/Islamabad)</span>
                    <span className="text-[#0C7075]">High Demand</span>
                  </li>
                  <li className={`flex justify-between items-center p-2.5 rounded-xl border ${soft}`}>
                    <span>2. Textile & Garment Exporters (Faisalabad/Karachi)</span>
                    <span className="text-[#0C7075]">Very High</span>
                  </li>
                  <li className={`flex justify-between items-center p-2.5 rounded-xl border ${soft}`}>
                    <span>3. E-commerce & Retail Brands (Nationwide)</span>
                    <span className="text-[#0C7075]">Growing Fast</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => triggerToast('AI Market Database updated successfully!')}
                className={`w-full py-3.5 rounded-xl font-black text-xs border transition-all shadow-sm ${isDarkMode ? 'bg-[#072E33] text-[#03F3DA] border-[#0C7075] hover:bg-[#0C7075] hover:text-white' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4] hover:bg-[#0C7075] hover:text-white'}`}
              >
                Refresh Market Insights 🔄
              </button>
            </div>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className={`p-8 rounded-3xl border shadow-2xl text-center space-y-4 ${card}`}>
          <h2 className={`text-xl sm:text-2xl font-black ${heading}`}>Ready to supercharge your client hunting?</h2>
          <p className={`text-xs sm:text-sm ${muted}`}>
            Combine these AI tools with the Lead Finder, CRM Hub, and Messages to close more deals.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/leadfinder" className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white font-black text-xs shadow-lg hover:scale-105 transition-transform border border-[#03F3DA]/50">
              🎯 Open Lead Finder
            </Link>
            <Link href="/messages" className="px-6 py-3 rounded-2xl bg-[#EAF4F7] text-[#0C7075] font-black text-xs border border-[#B9DDE4] hover:bg-[#D5ECF0] transition-all">
              💬 Open Messages
            </Link>
          </div>
        </div>

      </main>

    </div>
  );
}
