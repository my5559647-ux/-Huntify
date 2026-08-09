'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export default function CityHubsPage() {
  const { theme } = useAuth();
  const isDarkMode = theme === 'dark';
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [activeCityDetail, setActiveCityDetail] = useState<any | null>(null);

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Comprehensive Pakistan Cities Dataset spanning major hubs, small towns, tehsils and districts
  const [allPakistanCities] = useState([
    // --- PUNJAB ---
    { id: 1, cityName: 'Lahore', province: 'Punjab', commercialZone: 'Gulberg & DHA', activeLeads: 42, topNiche: 'IT & Corporate', potential: 'Very High' },
    { id: 2, cityName: 'Faisalabad', province: 'Punjab', commercialZone: 'D-Ground & Susan Road', activeLeads: 28, topNiche: 'Textile & Manufacturing', potential: 'High' },
    { id: 3, cityName: 'Rawalpindi', province: 'Punjab', commercialZone: 'Saddar & Murree Road', activeLeads: 25, topNiche: 'Retail & Services', potential: 'High' },
    { id: 4, cityName: 'Multan', province: 'Punjab', commercialZone: 'Abdali Road & Bosan Road', activeLeads: 19, topNiche: 'Agriculture & Trade', potential: 'Medium' },
    { id: 5, cityName: 'Gujranwala', province: 'Punjab', commercialZone: 'GT Road & Civil Lines', activeLeads: 22, topNiche: 'Engineering & Ceramics', potential: 'High' },
    { id: 6, cityName: 'Sialkot', province: 'Punjab', commercialZone: 'Paris Road & Cantt', activeLeads: 20, topNiche: 'Sports Goods & Export', potential: 'High' },
    { id: 7, cityName: 'Bahawalpur', province: 'Punjab', commercialZone: 'Model Town', activeLeads: 12, topNiche: 'Education & Handicrafts', potential: 'Medium' },
    { id: 8, cityName: 'Sargodha', province: 'Punjab', commercialZone: 'University Road', activeLeads: 14, topNiche: 'Citrus Trade & Retail', potential: 'Medium' },
    { id: 9, cityName: 'Sheikhupura', province: 'Punjab', commercialZone: 'Lahore Road', activeLeads: 10, topNiche: 'Rice Mills & Industry', potential: 'Medium' },
    { id: 10, cityName: 'Rahim Yar Khan', province: 'Punjab', commercialZone: 'Shahi Road', activeLeads: 11, topNiche: 'Cotton & Edible Oil', potential: 'Medium' },
    { id: 11, cityName: 'Jhang', province: 'Punjab', commercialZone: 'Civil Lines', activeLeads: 8, topNiche: 'Agriculture', potential: 'Growing' },
    { id: 12, cityName: 'Dera Ghazi Khan', province: 'Punjab', commercialZone: 'Jampur Road', activeLeads: 9, topNiche: 'Local Trade', potential: 'Growing' },
    { id: 13, cityName: 'Gujrat', province: 'Punjab', commercialZone: 'GT Road', activeLeads: 16, topNiche: 'Fans & Furniture Export', potential: 'High' },
    { id: 14, cityName: 'Sahiwal', province: 'Punjab', commercialZone: 'High Street', activeLeads: 9, topNiche: 'Agro-Based Industry', potential: 'Medium' },
    { id: 15, cityName: 'Wah Cantonment', province: 'Punjab', commercialZone: 'Aslam Market', activeLeads: 11, topNiche: 'Defense Manufacturing', potential: 'Medium' },
    { id: 16, cityName: 'Kasur', province: 'Punjab', commercialZone: 'Railway Road', activeLeads: 10, topNiche: 'Leather & Tannery', potential: 'Medium' },
    { id: 17, cityName: 'Okara', province: 'Punjab', commercialZone: 'M.A Jinnah Road', activeLeads: 8, topNiche: 'Potato & Dairy Farming', potential: 'Growing' },
    { id: 18, cityName: 'Chiniot', province: 'Punjab', commercialZone: 'Muslim Bazar', activeLeads: 7, topNiche: 'Wooden Furniture', potential: 'Medium' },
    { id: 19, cityName: 'Kamike', province: 'Punjab', commercialZone: 'Main GT Road', activeLeads: 6, topNiche: 'Rice Husking', potential: 'Growing' },
    { id: 20, cityName: 'Hafizabad', province: 'Punjab', commercialZone: 'Gujranwala Road', activeLeads: 6, topNiche: 'Rice Mills', potential: 'Growing' },
    { id: 21, cityName: 'Sadiqabad', province: 'Punjab', commercialZone: 'KLP Road', activeLeads: 7, topNiche: 'Fertilizer & Cotton', potential: 'Growing' },
    { id: 22, cityName: 'Burewala', province: 'Punjab', commercialZone: 'Arifwala Road', activeLeads: 5, topNiche: 'Cotton Ginning', potential: 'Growing' },
    { id: 23, cityName: 'Khanewal', province: 'Punjab', commercialZone: 'Kutchery Road', activeLeads: 6, topNiche: 'Grain Market', potential: 'Growing' },
    { id: 24, cityName: 'Muzaffargarh', province: 'Punjab', commercialZone: 'Main Bazar', activeLeads: 5, topNiche: 'Thermal Power & Cotton', potential: 'Growing' },
    { id: 25, cityName: 'Mandi Bahauddin', province: 'Punjab', commercialZone: 'Phalia Road', activeLeads: 6, topNiche: 'Rice Production', potential: 'Growing' },
    { id: 26, cityName: 'Toba Tek Singh', province: 'Punjab', commercialZone: 'Mission Road', activeLeads: 6, topNiche: 'Agriculture Trade', potential: 'Growing' },
    { id: 27, cityName: 'Vehari', province: 'Punjab', commercialZone: 'Grain Market', activeLeads: 5, topNiche: 'Cotton & Wheat', potential: 'Growing' },
    { id: 28, cityName: 'Attock', province: 'Punjab', commercialZone: 'Civil Bazaar', activeLeads: 7, topNiche: 'Cement & Oil Exploration', potential: 'Medium' },
    { id: 29, cityName: 'Jhelum', province: 'Punjab', commercialZone: 'Civil Lines', activeLeads: 8, topNiche: 'Tobacco & Marble', potential: 'Medium' },
    { id: 30, cityName: 'Chakwal', province: 'Punjab', commercialZone: 'Talagang Road', activeLeads: 5, topNiche: 'Cement Plants', potential: 'Growing' },
    { id: 31, cityName: 'Mianwali', province: 'Punjab', commercialZone: 'Ballur Khanwala', activeLeads: 6, topNiche: 'Minerals & Power', potential: 'Growing' },
    { id: 32, cityName: 'Bhakkar', province: 'Punjab', commercialZone: 'Darya Khan Road', activeLeads: 4, topNiche: 'Gram Production', potential: 'Growing' },
    { id: 33, cityName: 'Khushab', province: 'Punjab', commercialZone: 'Nowshera Road', activeLeads: 4, topNiche: 'Mining & Agriculture', potential: 'Growing' },
    { id: 34, cityName: 'Narowal', province: 'Punjab', commercialZone: 'Kutchery Road', activeLeads: 5, topNiche: 'Rice & Wheat', potential: 'Growing' },
    { id: 35, cityName: 'Pakpattan', province: 'Punjab', commercialZone: 'Grain Market', activeLeads: 5, topNiche: 'Agriculture', potential: 'Growing' },
    { id: 36, cityName: 'Rajanpur', province: 'Punjab', commercialZone: 'Indus Highway', activeLeads: 3, topNiche: 'Cotton & Dates', potential: 'Emerging' },
    { id: 37, cityName: 'Layyah', province: 'Punjab', commercialZone: 'Chobara Road', activeLeads: 4, topNiche: 'Sugarcane', potential: 'Emerging' },
    { id: 38, cityName: 'Lodhran', province: 'Punjab', commercialZone: 'Multan Road', activeLeads: 4, topNiche: 'Cotton Farming', potential: 'Emerging' },
    { id: 39, cityName: 'Kallar Syedan', province: 'Punjab', commercialZone: 'Main Bazar', activeLeads: 3, topNiche: 'Local Services', potential: 'Emerging' },
    { id: 40, cityName: 'Murree', province: 'Punjab', commercialZone: 'Mall Road', activeLeads: 12, topNiche: 'Tourism & Hospitality', potential: 'High' },

    // --- SINDH ---
    { id: 41, cityName: 'Karachi', province: 'Sindh', commercialZone: 'I.I. Chundrigar & Clifton', activeLeads: 55, topNiche: 'Corporate Finance & Ports', potential: 'Very High' },
    { id: 42, cityName: 'Hyderabad', province: 'Sindh', commercialZone: 'Thandi Sarak & Saddar', activeLeads: 20, topNiche: 'Glass & Textile Trade', potential: 'High' },
    { id: 43, cityName: 'Sukkur', province: 'Sindh', commercialZone: 'Military Road', activeLeads: 12, topNiche: 'Dates & Rice Milling', potential: 'Medium' },
    { id: 44, cityName: 'Larkana', province: 'Sindh', commercialZone: 'Bunder Road', activeLeads: 10, topNiche: 'Rice & Agriculture', potential: 'Medium' },
    { id: 45, cityName: 'Nawabshah (Shaheed Benazirabad)', province: 'Sindh', commercialZone: 'Station Road', activeLeads: 9, topNiche: 'Sugarcane & Cotton', potential: 'Medium' },
    { id: 46, cityName: 'Mirpur Khas', province: 'Sindh', commercialZone: 'Station Road', activeLeads: 8, topNiche: 'Mango Orchards & Trade', potential: 'Medium' },
    { id: 47, cityName: 'Shikarpur', province: 'Sindh', commercialZone: 'Hazari Gate', activeLeads: 6, topNiche: 'Pickle & Rice Trade', potential: 'Growing' },
    { id: 48, cityName: 'Jacobabad', province: 'Sindh', commercialZone: 'Quetta Road', activeLeads: 5, topNiche: 'Grain Market', potential: 'Growing' },
    { id: 49, cityName: 'Khairpur', province: 'Sindh', commercialZone: 'Mall Road', activeLeads: 7, topNiche: 'Dates Export', potential: 'Medium' },
    { id: 50, cityName: 'Dadu', province: 'Sindh', commercialZone: 'Station Road', activeLeads: 5, topNiche: 'Agriculture', potential: 'Growing' },
    { id: 51, cityName: 'Tando Adam', province: 'Sindh', commercialZone: 'Railway Road', activeLeads: 6, topNiche: 'Cotton Ginning', potential: 'Growing' },
    { id: 52, cityName: 'Ghotki', province: 'Sindh', commercialZone: 'National Highway', activeLeads: 6, topNiche: 'Fertilizer & Gas', potential: 'Medium' },
    { id: 53, cityName: 'Badin', province: 'Sindh', commercialZone: 'Main Hyderabad Road', activeLeads: 5, topNiche: 'Sugar Mills & Agriculture', potential: 'Growing' },
    { id: 54, cityName: 'Kotri', province: 'Sindh', commercialZone: 'Industrial Area', activeLeads: 8, topNiche: 'Textile & Chemical', potential: 'Medium' },
    { id: 55, cityName: 'Jamshoro', province: 'Sindh', commercialZone: 'University Campus', activeLeads: 9, topNiche: 'Higher Education & Cement', potential: 'Medium' },
    { id: 56, cityName: 'Kamber Ali Khan', province: 'Sindh', commercialZone: 'Main Bazaar', activeLeads: 4, topNiche: 'Rice Trade', potential: 'Emerging' },
    { id: 57, cityName: 'Mirpur Mathelo', province: 'Sindh', commercialZone: 'Station Road', activeLeads: 5, topNiche: 'Fertilizer Industry', potential: 'Growing' },
    { id: 58, cityName: 'Sanghar', province: 'Sindh', commercialZone: 'Tharparkar Road', activeLeads: 5, topNiche: 'Cotton Production', potential: 'Growing' },
    { id: 59, cityName: 'Umerkot', province: 'Sindh', commercialZone: 'Amarkot Road', activeLeads: 4, topNiche: 'Historical Tourism & Agro', potential: 'Emerging' },
    { id: 60, cityName: 'Matiari', province: 'Sindh', commercialZone: 'National Highway', activeLeads: 4, topNiche: 'Handicrafts & Agriculture', potential: 'Emerging' },

    // --- KHYBER PAKHTUNKHWA (KP) ---
    { id: 61, cityName: 'Peshawar', province: 'Khyber Pakhtunkhwa', commercialZone: 'University Road & Saddar', activeLeads: 32, topNiche: 'Gemstones, Trade & Education', potential: 'Very High' },
    { id: 62, cityName: 'Abbottabad', province: 'KP', commercialZone: 'Mansehra Road & Jinnahabad', activeLeads: 18, topNiche: 'Tourism & Education', potential: 'High' },
    { id: 63, cityName: 'Mardan', province: 'KP', commercialZone: 'Nowshera Road', activeLeads: 14, topNiche: 'Sugarcane & Tobacco', potential: 'Medium' },
    { id: 64, cityName: 'Swat (Mingora)', province: 'KP', commercialZone: 'Green Square', activeLeads: 20, topNiche: 'Tourism & Hospitality', potential: 'High' },
    { id: 65, cityName: 'Charsadda', province: 'KP', commercialZone: 'Main Bazaar', activeLeads: 8, topNiche: 'Khaddar & Agriculture', potential: 'Growing' },
    { id: 66, cityName: 'Nowshera', province: 'KP', commercialZone: 'GT Road', activeLeads: 10, topNiche: 'Paper Mills & Cantonment', potential: 'Medium' },
    { id: 67, cityName: 'Kohat', province: 'KP', commercialZone: 'Bannu Road', activeLeads: 9, topNiche: 'Cement & Oil/Gas', potential: 'Medium' },
    { id: 68, cityName: 'Bannu', province: 'KP', commercialZone: 'Pre-Tariq Road', activeLeads: 7, topNiche: 'Cotton & Local Trade', potential: 'Growing' },
    { id: 69, cityName: 'Dera Ismail Khan (D.I. Khan)', province: 'KP', commercialZone: 'Circular Road', activeLeads: 10, topNiche: 'Dates & Grain Market', potential: 'Medium' },
    { id: 73, cityName: 'Chitral', province: 'KP', commercialZone: 'Shahi Bazaar', activeLeads: 7, topNiche: 'Eco-Tourism & Dry Fruits', potential: 'Growing' },
    { id: 74, cityName: 'Dir', province: 'KP', commercialZone: 'Main Bazaar', activeLeads: 5, topNiche: 'Timber & Agriculture', potential: 'Emerging' },
    { id: 75, cityName: 'Battagram', province: 'KP', commercialZone: 'Karakoram Highway', activeLeads: 4, topNiche: 'Local Retail', potential: 'Emerging' },

    // --- BALOCHISTAN ---
    { id: 76, cityName: 'Quetta', province: 'Balochistan', commercialZone: 'Jinnah Road & Zarghun Road', activeLeads: 21, topNiche: 'Dry Fruits & Minerals', potential: 'High' },
    { id: 77, cityName: 'Gwadar', province: 'Balochistan', commercialZone: 'Port Commercial Area', activeLeads: 16, topNiche: 'Maritime & Real Estate', potential: 'Very High' },
    { id: 78, cityName: 'Turbat', province: 'Balochistan', commercialZone: 'Main Bazar', activeLeads: 6, topNiche: 'Date Palm & Border Trade', potential: 'Growing' },
    { id: 79, cityName: 'Khuzdar', province: 'Balochistan', commercialZone: 'RCD Highway', activeLeads: 5, topNiche: 'Minerals & Marble', potential: 'Growing' },
    { id: 80, cityName: 'Sibi', province: 'Balochistan', commercialZone: 'Station Road', activeLeads: 4, topNiche: 'Agriculture & Livestock', potential: 'Emerging' },
    { id: 81, cityName: 'Loralai', province: 'Balochistan', commercialZone: 'Bazaar Road', activeLeads: 4, topNiche: 'Fruit Orchards', potential: 'Emerging' },
    { id: 82, cityName: 'Chaman', province: 'Balochistan', commercialZone: 'Border Road', activeLeads: 7, topNiche: 'Transit Trade', potential: 'Medium' },
    { id: 83, cityName: 'Zhob', province: 'Balochistan', commercialZone: 'Main Road', activeLeads: 3, topNiche: 'Livestock', potential: 'Emerging' },

    // --- AZAD KASHMIR & GILGIT-BALTISTAN ---
    { id: 84, cityName: 'Muzaffarabad', province: 'Azad Kashmir', commercialZone: 'Bank Road & Madina Market', activeLeads: 14, topNiche: 'Tourism & Government Offices', potential: 'High' },
    { id: 85, cityName: 'Mirpur (AK)', province: 'Azad Kashmir', commercialZone: 'Allama Iqbal Road', activeLeads: 17, topNiche: 'Overseas Remittance & Real Estate', potential: 'High' },
    { id: 86, cityName: 'Rawalakot', province: 'Azad Kashmir', commercialZone: 'Peer Chanasi Road', activeLeads: 8, topNiche: 'Education & Hospitality', potential: 'Medium' },
    { id: 87, cityName: 'Kotli', province: 'Azad Kashmir', commercialZone: 'Old Bus Stand', activeLeads: 7, topNiche: 'Retail & Local Business', potential: 'Medium' },
    { id: 88, cityName: 'Gilgit', province: 'Gilgit-Baltistan', commercialZone: 'NLI Market', activeLeads: 15, topNiche: 'Mountain Tourism & Trekking', potential: 'High' },
    { id: 89, cityName: 'Skardu', province: 'Gilgit-Baltistan', commercialZone: 'Bazaar Road', activeLeads: 13, topNiche: 'Adventure Tourism & Gems', potential: 'High' },
    { id: 90, cityName: 'Hunza (Aliabad)', province: 'Gilgit-Baltistan', commercialZone: 'Main Karakoram Hwy', activeLeads: 12, topNiche: 'Hospitality & Organic Farming', potential: 'High' }
  ]);

  // Filter cities based on province tab and search query
  const filteredCities = allPakistanCities.filter(city => {
    const matchesProvince = selectedProvince === 'All Provinces' || city.province === selectedProvince;
    const matchesSearch = city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          city.commercialZone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          city.topNiche.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProvince && matchesSearch;
  });

  const totalLeadsCount = allPakistanCities.reduce((sum, c) => sum + c.activeLeads, 0);

  const provinceTabs = ['All Provinces', 'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Azad Kashmir', 'Gilgit-Baltistan'];

  return (
<div className="min-h-screen bg-[#F4FAFC] text-[#072E33] font-sans selection:bg-[#0C7075] selection:text-white">
      
      {/* Universal Light Theme Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#B9DDE4] px-6 lg:px-12 py-4 flex justify-between items-center shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center font-black text-white text-base shadow-md">H</div>
          <span className="text-xl font-black text-[#072E33]">Hunt<span className="text-[#0C7075]">ify</span></span>
        </Link>
        
<nav className="hidden md:flex items-center gap-1 lg:gap-2 text-[13px] font-bold text-[#294D61]">
          <Link href="/" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">Home</Link>
          <Link href="/messages" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">Chat</Link>
          <Link href="/leadfinder" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">Lead Finder</Link>
          <Link href="/crm" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">CRM Hub</Link>
          <Link href="/pipeline" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">Pipeline</Link>
          <Link href="/cities" className="px-3 py-1.5 rounded-xl bg-[#EAF4F7] text-[#0C7075] border border-[#B9DDE4] shadow-sm">City Hubs</Link>
          <Link href="/ai-features" className="px-3.5 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">AI Features</Link>
          <Link href="/about" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">About Us</Link>
          <Link href="/faq" className="px-3 py-1.5 rounded-xl hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all">FAQ</Link>
        </nav>

        <Link href="/" className="px-4 py-2 rounded-xl bg-[#EAF4F7] text-xs font-bold text-[#0C7075] border border-[#B9DDE4] hover:bg-[#D5ECF0] transition-all">
          ← Dashboard
        </Link>
      </header>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C7075] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl animate-bounce">
          ✨ {notification}
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        
{/* Page Purpose & Guide Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#EAF4F7] to-[#F4FAFC] border border-[#B9DDE4] shadow-sm space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-white text-[#0C7075] text-xs font-bold border border-[#B9DDE4] shadow-sm inline-block">
            📌 Page Purpose & Guide: Pakistan Nationwide City & District Hubs
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#072E33]">Nationwide Pakistani Cities & Commercial Markets</h1>
          <p className="text-xs sm:text-sm text-[#294D61] leading-relaxed max-w-4xl">
            This master database covers all major metropolitan hubs, industrial cities, and regional towns across Pakistan. Use the province filters or instant search bar to target local business prospects in any specific region.
          </p>
        </div>

        {/* Top Control Bar with Stats & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-[#B9DDE4] shadow-md">
          <div className="flex items-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] text-xs font-bold text-[#072E33]">
              Total Nationwide Prospect Hubs: <span className="text-[#0C7075] text-sm font-black">{totalLeadsCount} Leads Available</span>
            </div>
          </div>
          
          <div className="w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search any city, district, or market..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] text-xs text-[#072E33] outline-none focus:border-[#0C7075]"
            />
          </div>
        </div>

        {/* Province Filter Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-3 rounded-3xl border border-[#B9DDE4] shadow-sm">
          {provinceTabs.map((prov) => (
            <button
              key={prov}
              onClick={() => setSelectedProvince(prov)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                selectedProvince === prov 
                  ? 'bg-[#0C7075] text-white shadow-md' 
                  : 'bg-[#F4FAFC] text-[#294D61] hover:bg-[#EAF4F7] hover:text-[#0C7075]'
              }`}
            >
              {prov}
            </button>
          ))}
        </div>

        {/* Professional Table Container */}
        <div className="bg-white rounded-3xl border border-[#B9DDE4] shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4FAFC] border-b border-[#B9DDE4] text-[11px] font-bold text-[#0C7075] uppercase tracking-wider">
                  <th className="p-5">City / Town Name</th>
                  <th className="p-5">Province / Territory</th>
                  <th className="p-5">Primary Commercial Market</th>
                  <th className="p-5">Active Leads Density</th>
                  <th className="p-5">Top Industry Niche</th>
                  <th className="p-5 text-right">Hub Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B9DDE4] text-xs">
                {filteredCities.map((city) => (
                  <tr key={city.id} className="hover:bg-[#F4FAFC] transition-colors">
                    <td className="p-5 font-black text-[#072E33]">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0C7075]"></div>
                        <span>{city.cityName}</span>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-[#294D61]">{city.province}</td>
                    <td className="p-5 text-[#294D61] font-medium">{city.commercialZone}</td>
                    <td className="p-5 font-black text-[#0C7075]">{city.activeLeads} Prospects</td>
                    <td className="p-5">
                      <span className="px-3 py-1 rounded-full bg-[#EAF4F7] text-[#0C7075] font-bold text-[10px] border border-[#B9DDE4]">
                        {city.topNiche}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button 
                        onClick={() => {
                          setActiveCityDetail(city);
                          setIsCityModalOpen(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#F4FAFC] text-[#0C7075] font-bold border border-[#B9DDE4] hover:bg-[#0C7075] hover:text-white transition-all"
                      >
                        Inspect Hub ↗
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredCities.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-xs text-[#6DA5C0]">
                      No cities found matching your search or province filter. Try searching for another city.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* CITY INSPECTION MODAL */}
      {isCityModalOpen && activeCityDetail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#B9DDE4] space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start border-b border-[#B9DDE4] pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#EAF4F7] text-[#0C7075] font-bold text-xs">{activeCityDetail.province} Hub</span>
                <h2 className="text-xl font-black text-[#072E33] mt-1">{activeCityDetail.cityName} Market Intelligence</h2>
              </div>
              <button 
                onClick={() => setIsCityModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-[#F4FAFC] text-[#072E33] font-black border border-[#B9DDE4] hover:bg-[#EAF4F7] hover:text-[#0C7075] transition-all flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] flex justify-between items-center">
                <span className="text-[#6DA5C0] font-bold">Active Prospects:</span>
                <span className="text-sm font-black text-[#0C7075]">{activeCityDetail.activeLeads} Leads</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] flex justify-between items-center">
                <span className="text-[#6DA5C0] font-bold">Commercial Market:</span>
                <span className="font-bold text-[#072E33]">{activeCityDetail.commercialZone}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F4FAFC] border border-[#B9DDE4] flex justify-between items-center">
                <span className="text-[#6DA5C0] font-bold">Market Potential:</span>
                <span className="font-bold text-[#0C7075]">{activeCityDetail.potential}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                triggerToast(`Targeting active campaigns in ${activeCityDetail.cityName}!`);
                setIsCityModalOpen(false);
              }}
              className="w-full py-3.5 rounded-xl bg-[#0C7075] text-white font-black text-xs hover:bg-[#0A5A5E] transition-all shadow-md"
            >
              Close & Target City 🚀
            </button>
          </div>
        </div>
      )}

    </div>
  );
}