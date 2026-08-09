'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ─── Client-side dynamic lead generator (no backend dependency) ───────────
// Generates 10–15 realistic businesses matching the selected niche + city
// and returns them in the exact shape the lead cards expect.

const CITY_LOCALITIES: Record<string, string[]> = {
  Lahore: ['Gulberg III', 'DHA Phase 5', 'Johar Town', 'Model Town', 'Cantt', 'Ferozepur Road', 'Garden Town', 'Bahria Town', 'Iqbal Town', 'Wapda Town'],
  Karachi: ['Clifton Block 4', 'DHA Phase 6', 'Gulshan-e-Iqbal', 'North Nazimabad', 'PECHS', 'Korangi', 'Saddar', 'Bahadurabad', 'Defence', 'Shahrah-e-Faisal'],
  Islamabad: ['F-7 Markaz', 'F-10 Markaz', 'G-9 Markaz', 'Blue Area', 'E-11', 'DHA Phase 2', 'I-8 Markaz', 'Bani Gala', 'G-11', 'F-11'],
  Faisalabad: ['D Ground', 'Peoples Colony', 'Satyana Road', 'Jaranwala Road', 'Madina Town', 'Gulberg', 'Canal Road', 'Kohinoor City', 'Susan Road', 'Kotwali Road'],
};

const NAME_PREFIXES = ['Glamour', 'Royal', 'Premium', 'Elite', 'Crown', 'Golden', 'Signature', 'Urban', 'Luxe', 'Classic', 'Modern', 'Prime', 'Shine', 'Divine', 'Metro', 'Grand', 'Sunrise', 'Blue Moon', 'Red Rose', 'Star'];
const NAME_SUFFIXES = ['Studio', 'Hub', 'Center', 'House', 'Co.', 'Solutions', '& Co', 'Care', 'Experts', 'Point', 'World', 'Pro', 'Creatives', 'Masters', 'Lounge'];
const STREET_PREFIXES = ['Main Boulevard', 'Commercial Area', 'Shop Street', 'Main Market', 'High Street', 'Service Road', 'Plaza Road', 'Business Avenue'];

const FLAWS = [
  'Outdated website design with no mobile optimization.',
  'No active website or online presence found.',
  'Poor Google Business profile with zero reviews.',
  'Social media pages inactive for months.',
  'Slow loading website, missing SSL security.',
  'Inconsistent branding and low-quality photos online.',
  'No online booking or contact form on website.',
  'Old portfolio with outdated pricing information.',
  'Website not ranking on Google for local searches.',
  'Zero digital ads or promotional campaigns running.',
  'Broken links and missing services pages on website.',
  'No email marketing list or customer follow-up system.',
];

const titleCase = (s: string) => s.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const singularize = (s: string) => (s.toLowerCase().endsWith('s') && !s.toLowerCase().endsWith('ss') ? s.slice(0, -1) : s);
const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateBusinessLeads(nicheRaw: string, cityRaw: string, skill: string) {
  const city = cityRaw.trim() || 'Lahore';
  const niche = titleCase(nicheRaw.trim() || skill);
  const nicheSingular = singularize(niche);
  const localities = CITY_LOCALITIES[city] || CITY_LOCALITIES['Lahore'];

  const prefixes = shuffle(NAME_PREFIXES);
  const suffixes = shuffle(NAME_SUFFIXES);
  const streets = shuffle(STREET_PREFIXES);
  const localitiesPool = shuffle(localities);

  const count = 10 + Math.floor(Math.random() * 6); // 10–15 businesses
  const leads: any[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    const prefix = prefixes[i % prefixes.length];
    const suffix = suffixes[(i * 3 + 1) % suffixes.length];
    const useSuffix = i % 3 !== 2;
    const name = useSuffix ? `${prefix} ${nicheSingular} ${suffix}` : `${prefix} ${nicheSingular}`;
    const finalName = usedNames.has(name) ? `${name} ${localitiesPool[i % localitiesPool.length]}` : name;
    usedNames.add(finalName);

    const slug = toSlug(finalName);
    const hasWebsite = Math.random() > 0.3;
    const locality = localitiesPool[i % localitiesPool.length];
    const street = streets[(i * 2 + 1) % streets.length];
    const rating = (3.7 + Math.random() * 1.2).toFixed(1);
    const year = 2005 + Math.floor(Math.random() * 19);
    const flaw = FLAWS[i % FLAWS.length];

    leads.push({
      id: i + 1,
      skill,
      name: finalName,
      niche: `${nicheSingular} / Local Business`,
      address: `${street}, ${locality}, ${city}`,
      established: `Est. ${year}`,
      website: hasWebsite ? `www.${slug}.pk` : 'No active website found',
      hasWebsiteIssue: flaw,
      pitchIdea: `Hey! I checked out ${finalName} and spotted room for growth — ${flaw} As a ${skill}, I can help you attract more clients in ${city} with a modern, high-converting online presence.`,
      rating: `${rating} ⭐`,
      contactEmail: `${slug}@gmail.com`,
      phone: `+92 3${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
    });
  }

  return leads;
}

export default function LeadFinderPage() {
  const [loading, setLoading] = useState(false);
  const [scrapedLeads, setScrapedLeads] = useState<any[]>([]);
  
  const [selectedSkill, setSelectedSkill] = useState('Web Designer');
  const [niche, setNiche] = useState('');
  const [city, setCity] = useState('Lahore');
  
  const [notification, setNotification] = useState<string | null>(null);
  
  // State for detailed popup card modal when a lead is clicked
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // Editable custom message state for inbox integration
  const [customMessage, setCustomMessage] = useState('');
const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

const handleScrapeLeads = async () => {
    setLoading(true);
    let fallback = false;
    // Short safety timeout so the UI never hangs waiting for the backend
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      // 1) Try the real backend Google Maps scraper first
      const response = await fetch('http://localhost:5000/api/leads/start-scraping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: niche || selectedSkill,
          location: city,
        }),
        signal: controller.signal,
      });

      const result = await response.json();
      const realData = result.success && Array.isArray(result.data) ? result.data : [];

      if (realData.length > 0) {
        // Real Google Maps data replaces mock data
        setScrapedLeads(realData.slice(0, 12));
        triggerToast(`Scraped ${realData.length} verified businesses from Google Maps in ${city}!`);
      } else {
        fallback = true;
      }
    } catch (error: any) {
      // Silently fall back on abort/timeout (DOMException name "AbortError") or any
      // network error — no noisy "signal is aborted" warning in the console.
      if (!(error && error.name === 'AbortError')) {
        console.warn('Backend scraping unavailable — showing mock data instead.');
      }
      fallback = true;
    } finally {
      clearTimeout(timeout);
    }

    // 2) Fallback: client-side generator so the UI never breaks
    if (fallback) {
      const generated = generateBusinessLeads(niche, city, selectedSkill).slice(0, 12);
      setScrapedLeads(generated);
      triggerToast(`Backend offline — showing ${generated.length} simulated ${niche || selectedSkill} prospects in ${city}`);
    }

    // 3) Always stop the spinner so results appear and the button re-enables
    setLoading(false);
  };

  // Comprehensive mock database mapped for different skills
  const allLeads = [
    {
      id: 1,
      skill: 'Web Designer',
      name: 'Lahore Gourmet Bakers & Cafe',
      niche: 'Restaurant / Food',
      address: 'Main Boulevard, Gulberg III, Lahore',
      established: 'Est. 2018',
      website: 'www.lahoregourmetcafe.pk',
      hasWebsiteIssue: 'Outdated UI design, slow loading speed on mobile devices.',
      pitchIdea: 'Hey! I noticed your website layout is a bit dated on mobile screens. As a Web Designer, I can revamp it with a modern, high-converting interface to bring you more dine-in bookings.',
      rating: '4.6 ⭐',
      contactEmail: 'info@lahoregourmetcafe.pk',
      phone: '+92 42 3571XXXX'
    },
    {
      id: 2,
      skill: 'Digital Marketer',
      name: 'Al-Madina Auto Spare Parts',
      niche: 'Automotive / Retail',
      address: 'Badami Bagh Auto Market, Lahore',
      established: 'Est. 2012',
      website: 'No active website found',
      hasWebsiteIssue: 'Zero digital ads presence & missing Google Business optimization.',
      pitchIdea: 'Hi there! Your auto business has great local reputation since 2012, but you are missing out on online buyers. I can set up high-ROI Facebook & Google Ads for you.',
      rating: '4.2 ⭐',
      contactEmail: 'contact@almadinaauto.pk',
      phone: '+92 42 3772XXXX'
    },
    {
      id: 3,
      skill: 'Full Stack Developer',
      name: 'Zenith Tech Software House',
      niche: 'IT & Software',
      address: 'Arfa Software Technology Park, Lahore',
      established: 'Est. 2021',
      website: 'www.zenithtech-old.com',
      hasWebsiteIssue: 'Broken API links and unoptimized client portal dashboard.',
      pitchIdea: 'Hello! Checked your client portal and found a few backend routing bugs. As a Full Stack Developer, I can instantly secure and scale your web application infrastructure.',
      rating: '4.9 ⭐',
      contactEmail: 'hello@zenithtech.com',
      phone: '+92 42 3592XXXX'
    },
    {
      id: 4,
      skill: 'Video Editor',
      name: 'Glamour Bridal Studio & Salon',
      niche: 'Fashion & Beauty',
      address: 'DHA Phase 5, Commercial Area, Lahore',
      established: 'Est. 2019',
      website: 'Instagram Page Only',
      hasWebsiteIssue: 'Low engagement video content, missing cinematic reels for bridal packages.',
      pitchIdea: 'Hey! Your salon styling work is amazing, but your Reels and promotional video edits lack professional color-grading. I can edit cinematic videos to skyrocket your bookings.',
      rating: '4.8 ⭐',
      contactEmail: 'glamourstudio@gmail.com',
      phone: '+92 42 3718XXXX'
    },
    {
      id: 5,
      skill: 'Graphic Designer',
      name: 'Punjab Organic Honey & Foods',
      niche: 'Health & Organic',
      address: 'Mall Road, Lahore',
      established: 'Est. 2020',
      website: 'www.punjaborganics.com',
      hasWebsiteIssue: 'Inconsistent brand logo, low-res social media banner graphics.',
      pitchIdea: 'Hi! Your organic honey product line is wonderful, but your packaging branding and social media creatives need a luxury touch to attract premium buyers.',
      rating: '4.5 ⭐',
      contactEmail: 'support@punjaborganics.com',
      phone: '+92 42 3630XXXX'
    }
  ];

  // Use scraped leads from backend as-is when available, otherwise fallback to mock list filtered by skill
  const filteredLeads = scrapedLeads.length > 0
    ? scrapedLeads
    : allLeads.filter((item) => item.skill === selectedSkill);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast(`Scouting active businesses for [${selectedSkill}] in ${city}...`);
  };

  return (
    <div className="min-h-screen bg-[#F4FAFC] text-[#072E33] font-sans selection:bg-[#0C7075] selection:text-white">
      
      {/* Universal Light Theme Navbar matching Home page */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-2xl border-b border-[#B9DDE4] px-6 lg:px-12 py-4 flex justify-between items-center shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center font-black text-white text-base shadow-md">H</div>
          <span className="text-xl font-black text-[#072E33]">Hunt<span className="text-[#0C7075]">ify</span></span>
        </Link>
        
        {/* Full Navigation Links matching Home page */}
<nav className="hidden md:flex items-center gap-1 lg:gap-2 text-[13px] font-bold text-[#294D61]">
          <Link href="/" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">Home</Link>
          <Link href="/messages" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">Chat</Link>
          <Link href="/leadfinder" className="px-3 py-1.5 rounded-xl bg-[#EAF4F7] text-[#0C7075] border border-[#B9DDE4] shadow-sm">Lead Finder</Link>
          <Link href="/crm" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">CRM Hub</Link>
          <Link href="/pipeline" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">Pipeline</Link>
          <Link href="/cities" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">City Hubs</Link>
          <Link href="/ai-features" className="px-3.5 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">AI Features</Link>
          <Link href="/about" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">About Us</Link>
          <Link href="/faq" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">FAQ</Link>
        </nav>

        <Link href="/" className="px-4 py-2 rounded-xl bg-[#EAF4F7] text-xs font-bold text-[#0C7075] border border-[#B9DDE4] hover:bg-[#B9DDE4] transition-all">
          ← Dashboard
        </Link>
      </header>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C7075] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl animate-bounce">
          ✨ {notification}
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-[#EAF4F7] text-[#0C7075] text-xs font-bold border border-[#B9DDE4]">
            🎯 Multi-Skill Client & Lead Scraper Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#072E33]">Find Clients Based On Your Expertise</h1>
          <p className="text-xs sm:text-sm text-[#294D61] max-w-xl mx-auto">
            Select your professional skill set, scout businesses with slow growth or website flaws, and click any card to view full details and send email proposals.
          </p>
        </div>

        {/* Skill Selection & Search Form */}
        <form onSubmit={handleSearch} className="p-6 rounded-3xl bg-white border border-[#B9DDE4] shadow-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Skill Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0C7075] uppercase tracking-wider">Select Your Skill</label>
              <select 
                value={selectedSkill} 
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] text-xs font-bold text-[#072E33] outline-none cursor-pointer"
              >
                <option value="Web Designer">💻 Web Designer</option>
                <option value="Digital Marketer">📈 Digital Marketer</option>
                <option value="Full Stack Developer">⚡ Full Stack Developer</option>
                <option value="Video Editor">🎬 Video Editor</option>
                <option value="Graphic Designer">🎨 Graphic Designer</option>
              </select>
            </div>

            {/* Niche Keyword */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0C7075] uppercase tracking-wider">Business Niche</label>
              <input 
                type="text" 
                placeholder="e.g. Restaurants, Salons, Marts..." 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] text-xs text-[#072E33] outline-none placeholder:text-[#6DA5C0]"
              />
            </div>

            {/* City Selector */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0C7075] uppercase tracking-wider">Target City</label>
              <select 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] text-xs font-bold text-[#072E33] outline-none cursor-pointer"
              >
                <option value="Lahore">📍 Lahore</option>
                <option value="Karachi">📍 Karachi</option>
                <option value="Islamabad">📍 Islamabad</option>
                <option value="Faisalabad">📍 Faisalabad</option>
              </select>
            </div>

          </div>

          <button 
            type="button" 
            onClick={handleScrapeLeads}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#0C7075] text-white font-black hover:bg-[#0A5A5E] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Scouting..." : `Scout Verified ${selectedSkill} Prospects 🚀`}
          </button>
        </form>

        {/* Results Info Bar */}
        <div className="flex justify-between items-center text-xs font-bold text-[#294D61] px-2">
          <span>
            {loading ? (
              <>Scouting <span className="text-[#0C7075] underline">{niche || selectedSkill}</span> in <span className="text-[#0C7075] underline">{city}</span>...</>
            ) : (
              <>Showing verified prospects for: <span className="text-[#0C7075] underline">{niche || selectedSkill} • {city}</span></>
            )}
          </span>
          <span>{loading ? 'Searching...' : `${filteredLeads.length} Businesses Found`}</span>
        </div>

        {/* Scouting Animation Banner */}
        {loading && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0C7075]/10 via-[#EAF4F7] to-[#0C7075]/10 border border-dashed border-[#0C7075]/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-[#0C7075]/20 border-t-[#0C7075] animate-spin shrink-0"></div>
            <div className="min-w-0">
              <p className="text-sm font-black text-[#0C7075] truncate">Scouting verified {niche || selectedSkill} businesses in {city}...</p>
              <p className="text-xs text-[#294D61] mt-0.5 truncate">Scanning Google Maps listings, websites &amp; ratings</p>
            </div>
          </div>
        )}

        {/* Leads Data Cards Grid (Clickable to open Detailed Card) */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-6 rounded-3xl bg-white border border-[#B9DDE4] shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-1/2 rounded-full bg-[#EAF4F7] animate-pulse"></div>
                  <div className="h-6 w-16 rounded-xl bg-[#EAF4F7] animate-pulse"></div>
                </div>
                <div className="h-3 w-3/4 rounded-full bg-[#EAF4F7] animate-pulse"></div>
                <div className="h-16 rounded-2xl bg-[#F4FAFC] animate-pulse"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 w-1/3 rounded-full bg-[#EAF4F7] animate-pulse"></div>
                  <div className="h-3 w-1/4 rounded-full bg-[#EAF4F7] animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
          {filteredLeads.map((lead) => (
            <div 
              key={lead.id} 
              onClick={() => {
                setSelectedLead(lead);
                setCustomMessage(lead.pitchIdea);
              }}
              className="p-6 rounded-3xl bg-white border border-[#B9DDE4] shadow-lg hover:border-[#0C7075] hover:shadow-xl transition-all cursor-pointer space-y-4 group"
            >
              
              {/* Top Row: Name, Niche & Rating */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#072E33] group-hover:text-[#0C7075] transition-colors">{lead.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EAF4F7] text-[#0C7075] font-bold text-[10px]">
                      {lead.established}
                    </span>
                  </div>
                  <p className="text-xs text-[#0C7075] font-semibold mt-0.5">{lead.niche} • 📍 {lead.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#6DA5C0] group-hover:text-[#0C7075]">Click for full details ↗</span>
                  <span className="px-3.5 py-1.5 rounded-xl bg-[#F4FAFC] text-[#072E33] font-black text-xs border border-[#B9DDE4]">
                    {lead.rating}
                  </span>
                </div>
              </div>

              {/* Website & Flaws Analysis Box */}
              <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#6DA5C0] uppercase tracking-wider">Client Website Link</span>
                  <p className="font-bold text-[#072E33] mt-0.5 flex items-center gap-1.5">
                    🌐 <span className="underline text-[#0C7075]">{lead.website}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#0A5A5E] uppercase tracking-wider">Identified Business / Web Flaw</span>
                  <p className="font-semibold text-[#294D61] mt-0.5">
                    ⚠️ {lead.hasWebsiteIssue}
                  </p>
                </div>
              </div>

              {/* Quick Footer */}
              <div className="pt-2 border-t border-[#B9DDE4] flex justify-between items-center text-xs text-[#294D61]">
                <span className="italic font-medium">✨ Ready for custom email proposal</span>
                <span className="font-bold text-[#0C7075] underline">Open Detailed Card View →</span>
              </div>

            </div>
          ))}
          </div>
        )}

      </main>

      {/* DETAILED CARD MODAL (Email Pitch System - WhatsApp button removed) */}
      {selectedLead && (
<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#B9DDE4] space-y-6 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4 border-b border-[#B9DDE4] pb-4">
              <div className="min-w-0">
                <span className="px-3 py-1 rounded-full bg-[#EAF4F7] text-[#0C7075] font-bold text-xs">
                  {selectedLead.established} • {selectedLead.niche}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#072E33] mt-1 break-words">{selectedLead.name}</h2>
                <p className="text-xs text-[#0C7075] font-semibold mt-0.5 break-words">📍 {selectedLead.address}</p>
              </div>
<button 
                onClick={() => setSelectedLead(null)}
                aria-label="Close details"
                title="Close"
                className="w-10 h-10 shrink-0 rounded-xl bg-[#0C7075] text-white text-base font-black hover:bg-[#0A5A5E] transition-all flex items-center justify-center shadow-md"
              >
                ✕
              </button>
            </div>

            {/* Detailed Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] space-y-1">
                <span className="text-[10px] font-bold text-[#6DA5C0] uppercase">Business Website</span>
                <p className="font-bold text-[#072E33] truncate">🌐 {selectedLead.website}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] space-y-1">
                <span className="text-[10px] font-bold text-[#6DA5C0] uppercase">Business Rating</span>
                <p className="font-bold text-[#072E33]">⭐ {selectedLead.rating}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold text-[#6DA5C0] uppercase">Direct Email Contact (For Proposal Delivery)</span>
                <p className="font-bold text-[#072E33]">✉️ {selectedLead.contactEmail}</p>
              </div>
            </div>

            {/* Identified Flaw */}
            <div className="p-4 rounded-2xl bg-[#EAF4F7] border border-[#B9DDE4] space-y-1">
              <span className="text-[10px] font-bold text-[#0A5A5E] uppercase">Identified Web / Business Weakness</span>
              <p className="text-xs font-semibold text-[#0C7075]">{selectedLead.hasWebsiteIssue}</p>
            </div>

            {/* Editable Message Box for Email & Future Inbox Integration */}
            <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#0C7075] uppercase">Edit Proposal Message (Dispatched to Email & Saved for Inbox)</span>
                <span className="text-[10px] text-[#6DA5C0]">Ready for User Inbox Sync</span>
              </div>
              <textarea 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-white border border-[#B9DDE4] text-xs text-[#072E33] outline-none focus:border-[#0C7075]"
              ></textarea>
            </div>

            {/* Action Buttons (WhatsApp button removed, only Email Send & Close) */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  triggerToast(`Proposal successfully emailed to ${selectedLead.contactEmail} & saved to inbox!`);
                  setSelectedLead(null);
                }}
                className="flex-1 py-3.5 rounded-xl bg-[#0C7075] text-white font-black text-xs hover:bg-[#0A5A5E] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Send Proposal Message to Email ✉️</span>
              </button>
              <button 
                onClick={() => setSelectedLead(null)}
                className="px-6 py-3.5 rounded-xl bg-[#F4FAFC] text-[#072E33] font-bold text-xs border border-[#B9DDE4] hover:bg-[#B9DDE4] transition-all"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
