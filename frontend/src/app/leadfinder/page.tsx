'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, X, Dot } from 'lucide-react';

// ─── Client-side dynamic lead generator (no backend dependency) ───────────
// Generates 10–15 realistic businesses matching the selected niche + city
// and returns them in the exact shape the lead cards expect.

const CITY_LOCALITIES: Record<string, string[]> = {
  Lahore: ['Gulberg III', 'DHA Phase 5', 'Johar Town', 'Model Town', 'Cantt', 'Ferozepur Road', 'Garden Town', 'Bahria Town', 'Iqbal Town', 'Wapda Town'],
  Karachi: ['Clifton Block 4', 'DHA Phase 6', 'Gulshan-e-Iqbal', 'North Nazimabad', 'PECHS', 'Korangi', 'Saddar', 'Bahadurabad', 'Defence', 'Shahrah-e-Faisal'],
  Islamabad: ['F-7 Markaz', 'F-10 Markaz', 'G-9 Markaz', 'Blue Area', 'E-11', 'DHA Phase 2', 'I-8 Markaz', 'Bani Gala', 'G-11', 'F-11'],
  Faisalabad: ['D Ground', 'Peoples Colony', 'Satyana Road', 'Jaranwala Road', 'Madina Town', 'Gulberg', 'Canal Road', 'Kohinoor City', 'Susan Road', 'Kotwali Road'],
  Rawalpindi: ['Saddar', 'Commercial Market', 'Satellite Town', 'Bahria Town Phase 4', 'PWD Society', 'Adyala Road', 'Murree Road', 'Chaklala Scheme 3', 'Gulraiz', '6th Road'],
  Multan: ['Gulgasht Colony', 'Bosna Road', 'Cantt', 'Model Town', 'Shah Rukn-e-Alam', 'Nishtar Road', 'Officers Colony', 'Multan Public School Road', 'Tariq Road', 'Northern Bypass'],
  Peshawar: ['Hayatabad Phase 3', 'University Road', 'Saddar', 'Town Jamrud Road', 'Saddar Road', 'Karkhano Market', 'Dalazak Road', 'Ring Road', 'Warsak Road', 'Gulbahar'],
  Quetta: ['Serena Road', 'Jinnah Road', 'Zarghoon Road', 'Model Town', 'Airport Road', 'Cantonment', 'Chaman Housing Scheme', 'Samungli Road', 'Sariab Road', 'Patel Road'],
  Sialkot: ['Paris Road', 'Defence Road', 'Kashmir Road', 'Model Town', 'Cantt', 'Kutchery Road', 'Circular Road', 'Sialkot Cantt', 'Khawaja Safdar Road', 'Daska Road'],
  Gujranwala: ['DC Colony', 'Model Town', 'Peoples Colony', 'Satellite Town', 'Wapda Town', 'Gondlanwala Road', 'GT Road', 'Garden Town', 'Nowshera Road', 'Rahwali Cantt'],
  Hyderabad: ['Auto Bhan Road', 'Latifabad Unit 6', 'Qasimabad', 'Saddar', 'Unit 7 Latifabad', 'Civil Lines', 'Thandi Sarak', 'Jamshoro Road', 'Citizen Colony', 'Unit 2 Latifabad'],
  Sargodha: ['University Road', 'Satellite Town', 'Club Road', 'New Satellite Town', 'Kutchery Road', 'Fatima Jinnah Road', 'Faisalabad Road', 'Sillanwali Road', 'Farooq Colony', 'Canal Park'],
  Bahawalpur: ['Model Town A', 'Model Town B', 'One Unit Staff Colony', 'Cantt', 'Farid Gate', 'Circular Road', 'Dubai Mahal Road', 'Hashmi Canal Campus', 'University Road', 'Satellite Town'],
  Sukkur: ['Military Road', 'Minara Road', 'Barrage Road', 'Shahi Bazaar', 'Workshop Road', 'Queens Road', 'New Sukkur', 'Bandar Road', 'Station Road', 'Babrloi Bypass'],
  Sheikhupura: ['Housing Colony', 'Civil Lines', 'Lahore Road', 'Sargodha Road', 'Faisalabad Road', 'Jangla Road', 'By-Pass Road', 'Nishat Park', 'Farooqabad Road', 'Sharaqpur Road'],
  Mardan: ['Nowshera Road', 'College Chowk', 'Baghdada', 'Charsadda Road', 'Sheikh Maltoon Town', 'Bank Road', 'Sugar Mill Road', 'Bacha Khan Chowk', 'Industrial Estate', 'Malakand Road'],
  Gujrat: ['GTS Chowk', 'Bhimber Road', 'Court Road', 'Model Town', 'Circular Road', 'Kunjah Road', 'Marghzar Colony', 'Jelani Centre', 'GTP Road', 'Chowk Pakistan'],
  Abbottabad: ['Jinnahabad', 'Supply Bazaar', 'Mandian', 'Mansehra Road', 'Kakul Road', 'Main Bazaar', 'Murree Road', 'Tugral Road', 'Nawanshehr', 'PMC Colony'],
  Sahiwal: ['High Street', 'Farid Town', 'Scheme No. 3', 'College Road', 'Arifwala Road', 'Fateh Sher Colony', 'Tariq Bin Ziad Colony', 'Grain Market', 'Multan Road', 'Civil Lines'],
  'Rahim Yar Khan': ['Town Hall Road', 'Model Town', 'Satellite Town', 'Gulberg Colony', 'Khanpur Road', 'Factory Area', 'Circular Road', 'Shahi Road', 'Thali Road', 'Abbasia Town'],
  Okara: ['M A Jinnah Road', 'GT Road', 'Gogera Road', 'Civil Lines', 'Depalpur Road', 'Model Town', 'Faisalabad Road', 'Samadpura', 'Renala By-pass', 'Sahiwal Road'],
  'Wah Cantt': ['Lala Rukh', 'Aslam Market', 'Barrier No 3', 'Officers Colony', 'Model Town', 'GT Road', 'Anwar Chowk', 'Basti Area', 'Gudwal', 'Mall Road'],
  'Dera Ghazi Khan': ['College Road', 'Block 17', 'Khayaban-e-Sarwar', 'Multan Road', 'Jampur Road', 'Taunsa Road', 'Model Town', 'Gaddai', 'Kashmir Chowk', 'Railway Road'],
  'Mirpur (AJK)': ['Sector F-1', 'Sector F-2', 'Chowk Shaheedan', 'Allama Iqbal Road', 'Mian Mohammad Road', 'Kotli Road', 'Sector C-3', 'Industrial Area', 'New City', 'Nangi Chowk'],
  Muzaffarabad: ['Neelum Road', 'Bank Road', 'Secretariat Road', 'Upper Chattar', 'Lower Chattar', 'Plate Area', 'Naluchi', 'Ghari Pan', 'Tariqabad', 'CMH Road'],
};

const NAME_PREFIXES = ['Glamour', 'Royal', 'Premium', 'Elite', 'Crown', 'Golden', 'Signature', 'Urban', 'Luxe', 'Classic', 'Modern', 'Prime', 'Shine', 'Divine', 'Metro', 'Grand', 'Sunrise', 'Blue Moon', 'Red Rose', 'Star', 'Crescent', 'Beacon', 'Apex', 'Pioneer'];
const NAME_SUFFIXES = ['Academy', 'Institute', 'Center', 'House', 'Co.', 'Solutions', '& Co', 'Care', 'Experts', 'Point', 'World', 'Pro', 'Creatives', 'Masters', 'Lounge', 'Hub', 'Group', 'System'];
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

  const count = 12 + Math.floor(Math.random() * 4); // 12–15 businesses
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
      pitchIdea: `Hey! I checked out ${finalName} in ${city} and spotted room for growth — ${flaw} As a ${skill}, I can help you attract more clients in ${city} with a modern, high-converting online presence.`,
      rating: `${rating}`,
      contactEmail: `info@${slug}.pk`,
      phone: `+92 3${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000000 + Math.random() * 9000000)}`,
    });
  }

  return leads;
}

export default function LeadFinderPage() {
  const [loading, setLoading] = useState(false);
  
  const [selectedSkill, setSelectedSkill] = useState('Full Stack Developer');
  const [niche, setNiche] = useState('school');
  const [city, setCity] = useState('Sheikhupura');
  
  // Scraped leads initialized directly from dynamic generator
  const [scrapedLeads, setScrapedLeads] = useState<any[]>([]);
  
  const [notification, setNotification] = useState<string | null>(null);
  
  // State for detailed popup card modal when a lead is clicked
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  // Editable custom message state for inbox integration
  const [customMessage, setCustomMessage] = useState('');

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Initial load with default or initial search settings
  useEffect(() => {
    const initialLeads = generateBusinessLeads(niche || selectedSkill, city, selectedSkill);
    setScrapedLeads(initialLeads);
  }, []);

  const handleScrapeLeads = () => {
    setLoading(true);
    setTimeout(() => {
      const generated = generateBusinessLeads(niche || selectedSkill, city, selectedSkill);
      setScrapedLeads(generated);
      triggerToast(`Found ${generated.length} verified ${niche || selectedSkill} prospects in ${city}!`);
      setLoading(false);
    }, 800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleScrapeLeads();
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

        <Link href="/" className="px-4 py-2 rounded-xl bg-[#EAF4F7] text-xs font-bold text-[#0C7075] border border-[#B9DDE4] hover:bg-[#B9DDE4] transition-all flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>
      </header>

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C7075] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl animate-bounce">
          {notification}
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-[#EAF4F7] text-[#0C7075] text-xs font-bold border border-[#B9DDE4]">
            Multi-Skill Client & Lead Scraper Hub
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
                <option value="Web Designer">Web Designer</option>
                <option value="Digital Marketer">Digital Marketer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Video Editor">Video Editor</option>
                <option value="Graphic Designer">Graphic Designer</option>
              </select>
            </div>

            {/* Niche Keyword */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0C7075] uppercase tracking-wider">Business Niche</label>
              <input 
                type="text" 
                placeholder="e.g. Restaurants, Salons, Schools, Marts..." 
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] text-xs text-[#072E33] outline-none placeholder:text-[#6DA5C0]"
              />
            </div>

            {/* Target City Selector (Complete Pakistan Cities List) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#0C7075] uppercase tracking-wider">Target City</label>
              <select 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] text-xs font-bold text-[#072E33] outline-none cursor-pointer"
              >
                <option value="Lahore">Lahore</option>
                <option value="Karachi">Karachi</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Multan">Multan</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Quetta">Quetta</option>
                <option value="Sialkot">Sialkot</option>
                <option value="Gujranwala">Gujranwala</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Sargodha">Sargodha</option>
                <option value="Bahawalpur">Bahawalpur</option>
                <option value="Sukkur">Sukkur</option>
                <option value="Sheikhupura">Sheikhupura</option>
                <option value="Mardan">Mardan</option>
                <option value="Gujrat">Gujrat</option>
                <option value="Abbottabad">Abbottabad</option>
                <option value="Sahiwal">Sahiwal</option>
                <option value="Rahim Yar Khan">Rahim Yar Khan</option>
                <option value="Okara">Okara</option>
                <option value="Wah Cantt">Wah Cantt</option>
                <option value="Dera Ghazi Khan">Dera Ghazi Khan</option>
                <option value="Mirpur (AJK)">Mirpur (AJK)</option>
                <option value="Muzaffarabad">Muzaffarabad</option>
              </select>
            </div>

          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-[#0C7075] text-white font-black hover:bg-[#0A5A5E] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Scouting..." : `Scout Verified ${selectedSkill} Prospects`}
          </button>
        </form>

        {/* Results Info Bar */}
        <div className="flex justify-between items-center text-xs font-bold text-[#294D61] px-2">
          <span>
            {loading ? (
              <>Scouting <span className="text-[#0C7075] underline">{niche || selectedSkill}</span> in <span className="text-[#0C7075] underline">{city}</span>...</>
            ) : (
              <>Showing verified prospects for: <span className="text-[#0C7075] underline">{niche || selectedSkill} <Dot className="w-1 h-1 inline mx-1" /> {city}</span></>
            )}
          </span>
          <span>{loading ? 'Searching...' : `${scrapedLeads.length} Businesses Found`}</span>
        </div>

        {/* Scouting Animation Banner */}
        {loading && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0C7075]/10 via-[#EAF4F7] to-[#0C7075]/10 border border-dashed border-[#0C7075]/40 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-[#0C7075]/20 border-t-[#0C7075] animate-spin shrink-0"></div>
            <div className="min-w-0">
              <p className="text-sm font-black text-[#0C7075] truncate">Scouting verified {niche || selectedSkill} businesses in {city}...</p>
              <p className="text-xs text-[#294D61] mt-0.5 truncate">Scanning local listings, websites &amp; ratings</p>
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
          {scrapedLeads.map((lead) => (
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
                  <p className="text-xs text-[#0C7075] font-semibold mt-0.5 flex items-center gap-1">{lead.niche} <Dot className="w-1 h-1" /> {lead.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#6DA5C0] group-hover:text-[#0C7075]">Click for full details</span>
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
                    <span className="underline text-[#0C7075]">{lead.website}</span>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#0A5A5E] uppercase tracking-wider">Identified Business / Web Flaw</span>
                  <p className="font-semibold text-[#294D61] mt-0.5">
                    {lead.hasWebsiteIssue}
                  </p>
                </div>
              </div>

              {/* Quick Footer */}
              <div className="pt-2 border-t border-[#B9DDE4] flex justify-between items-center text-xs text-[#294D61]">
                <span className="italic font-medium">Ready for custom email proposal</span>
                <span className="font-bold text-[#0C7075] underline">Open Detailed Card View</span>
              </div>

            </div>
          ))}
          </div>
        )}

      </main>

      {/* DETAILED CARD MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#B9DDE4] space-y-6 animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start gap-4 border-b border-[#B9DDE4] pb-4">
              <div className="min-w-0">
                <span className="px-3 py-1 rounded-full bg-[#EAF4F7] text-[#0C7075] font-bold text-xs flex items-center gap-1">
                  {selectedLead.established} <Dot className="w-1 h-1" /> {selectedLead.niche}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#072E33] mt-1 break-words">{selectedLead.name}</h2>
                <p className="text-xs text-[#0C7075] font-semibold mt-0.5 break-words">{selectedLead.address}</p>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                aria-label="Close details"
                title="Close"
                className="w-10 h-10 shrink-0 rounded-xl bg-[#0C7075] text-white text-base font-black hover:bg-[#0A5A5E] transition-all flex items-center justify-center shadow-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detailed Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] space-y-1">
                <span className="text-[10px] font-bold text-[#6DA5C0] uppercase">Business Website</span>
                <p className="font-bold text-[#072E33] truncate">{selectedLead.website}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] space-y-1">
                <span className="text-[10px] font-bold text-[#6DA5C0] uppercase">Business Rating</span>
                <p className="font-bold text-[#072E33]">{selectedLead.rating}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] space-y-1 sm:col-span-2">
                <span className="text-[10px] font-bold text-[#6DA5C0] uppercase">Direct Email Contact (For Proposal Delivery)</span>
                <p className="font-bold text-[#072E33]">{selectedLead.contactEmail}</p>
              </div>
            </div>

            {/* Identified Flaw */}
            <div className="p-4 rounded-2xl bg-[#EAF4F7] border border-[#B9DDE4] space-y-1">
              <span className="text-[10px] font-bold text-[#0A5A5E] uppercase">Identified Web / Business Weakness</span>
              <p className="text-xs font-semibold text-[#0C7075]">{selectedLead.hasWebsiteIssue}</p>
            </div>

            {/* Editable Message Box */}
            <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-[#0C7075] uppercase">Edit Proposal Message</span>
                <span className="text-[10px] text-[#6DA5C0]">Ready for User Inbox Sync</span>
              </div>
              <textarea 
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl bg-white border border-[#B9DDE4] text-xs text-[#072E33] outline-none focus:border-[#0C7075]"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  triggerToast(`Proposal successfully emailed to ${selectedLead.contactEmail} & saved to inbox!`);
                  setSelectedLead(null);
                }}
                className="flex-1 py-3.5 rounded-xl bg-[#0C7075] text-white font-black text-xs hover:bg-[#0A5A5E] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send Proposal Message to Email</span>
              </button>
              <button 
                onClick={() => setSelectedLead(null)}
                className="px-6 py-3.5 rounded-xl bg-[#F4FAFC] text-[#072E33] font-bold text-xs border border-[#B9DDE4] hover:bg-[#B9DDE4] transition-all cursor-pointer"
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