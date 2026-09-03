'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Home, Target, Folder, BarChart3, Settings, User, Briefcase, Mail, Trophy, ArrowRight, X, Sun, Moon, ChevronDown, Dot } from 'lucide-react';

type SectionKey = 'overview' | 'leadfinder' | 'crm' | 'pipeline' | 'settings' | 'profile';

const initialsOf = (name?: string) =>
  name
    ? name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

export default function DashboardPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    theme,
    toggleTheme,
    logout,
    deleteAccount,
    updateAvatar,
    updateProfile,
  } = useAuth();

  const [activeSection, setActiveSection] = useState<SectionKey>('overview');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notify, setNotify] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Local editable profile state
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');

  const isDark = theme === 'dark';

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      home: <Home className="w-5 h-5" />,
      target: <Target className="w-5 h-5" />,
      folder: <Folder className="w-5 h-5" />,
      chart: <BarChart3 className="w-5 h-5" />,
      settings: <Settings className="w-5 h-5" />,
      user: <User className="w-5 h-5" />,
      briefcase: <Briefcase className="w-5 h-5" />,
      mail: <Mail className="w-5 h-5" />,
      trophy: <Trophy className="w-5 h-5" />,
    };
    return icons[iconName] || icons.home;
  };

  const triggerNotify = (msg: string) => {
    setNotify(msg);
    setTimeout(() => setNotify(null), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDelete = () => {
    deleteAccount();
    router.push('/');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setEditAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    if (editAvatar && editAvatar !== user?.avatar) updateAvatar(editAvatar);
    updateProfile({ name: editName || user?.name, email: editEmail || user?.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    triggerNotify('Profile updated successfully!');
  };

  const navItems: { key: SectionKey; label: string; icon: string; href?: string }[] = [
    { key: 'overview', label: 'Overview', icon: 'home' },
    { key: 'leadfinder', label: 'Lead Finder', icon: 'target', href: '/leadfinder' },
    { key: 'crm', label: 'CRM Hub', icon: 'folder', href: '/crm' },
    { key: 'pipeline', label: 'Deal Pipeline', icon: 'chart', href: '/pipeline' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
    { key: 'profile', label: 'Profile', icon: 'user' },
  ];

  const statCards = [
    { label: 'Active Leads', value: '48', delta: '+12 this week', icon: 'target', color: 'from-[#0C7075] to-[#0A5A5E]' },
    { label: 'Open Deals', value: '12', delta: '≈ $4,800 value', icon: 'briefcase', color: 'from-[#0A5A5E] to-[#072E33]' },
    { label: 'Pitched', value: '137', delta: '62% reply rate', icon: 'mail', color: 'from-[#03F3DA] to-[#0C7075]' },
    { label: 'Closed Wins', value: '9', delta: 'Avg. $520 / deal', icon: 'trophy', color: 'from-[#50C878] to-[#2E8B57]' },
  ];

  const recentLeads = [
    { name: 'Lahore Gourmet Bakers & Cafe', status: 'New', value: '$450' },
    { name: 'Zenith Tech Software House', status: 'In Progress', value: '$900' },
    { name: 'Glamour Bridal Studio & Salon', status: 'Pitched', value: '$600' },
    { name: 'Punjab Organic Honey & Foods', status: 'Closed', value: '$520' },
  ];

  const base = isDark
    ? 'bg-[#05161A] text-[#FAF8F5]'
    : 'bg-[#F4FAFC] text-[#072E33]';

  const card = isDark
    ? 'bg-[#05161A] border-[#294D61]'
    : 'bg-white border-[#B9DDE4]';

  const muted = isDark ? 'text-[#A9C6D4]' : 'text-[#294D61]';
  const heading = isDark ? 'text-white' : 'text-[#072E33]';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${base}`}>
      {/* Toast */}
      {notify && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C7075] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl animate-bounce">
          {notify}
        </div>
      )}

      <div className="flex min-h-screen">
        {/* ===== SIDEBAR ===== */}
        <aside
          className={`w-64 shrink-0 hidden md:flex flex-col border-r transition-colors ${
            isDark ? 'bg-[#05161A] border-[#294D61]' : 'bg-white border-[#B9DDE4]'
          }`}
        >
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 px-6 py-5 border-b border-[#B9DDE4] dark:border-[#294D61]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] flex items-center justify-center font-black text-white text-base shadow-md">H</div>
            <span className={`text-xl font-black ${heading}`}>Hunt<span className="text-[#03F3DA]">ify</span></span>
          </Link>

          {/* User mini card */}
          <div className={`mx-4 mt-4 p-3 rounded-2xl border flex items-center gap-3 ${card}`}>
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-[#B9DDE4] dark:border-[#294D61]" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] text-white font-black text-sm flex items-center justify-center shadow">
                {initialsOf(user?.name)}
              </div>
            )}
            <div className="min-w-0">
              <p className={`text-xs font-black truncate ${heading}`}>{user?.name || 'Guest'}</p>
              <p className="text-[10px] text-[#03F3DA] truncate">{user?.email || 'Not signed in'}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const active = activeSection === item.key;
              const content = (
                <span
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-[#0C7075] text-white shadow-md'
                      : isDark
                      ? 'text-[#A9C6D4] hover:bg-[#072E33] hover:text-[#03F3DA]'
                      : 'text-[#294D61] hover:bg-[#EAF4F7] hover:text-[#0C7075]'
                  }`}
                >
                  <span className="text-sm">{getIcon(item.icon)}</span>
                  {item.label}
                </span>
              );
              return item.href ? (
                <Link key={item.key} href={item.href} onClick={() => setActiveSection(item.key)}>
                  {content}
                </Link>
              ) : (
                <button key={item.key} onClick={() => setActiveSection(item.key)} className="block w-full text-left">
                  {content}
                </button>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="px-4 pb-5 space-y-2 border-t border-[#B9DDE4] dark:border-[#294D61] pt-4">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-[#EAF4F7] text-[#0C7075] dark:hover:bg-[#072E33] dark:text-[#03F3DA]"
            >
              <span className="flex items-center gap-3">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
              <span className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isDark ? 'bg-[#0A5A5E]' : 'bg-[#03F3DA]'}`}>
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black text-emerald-500 hover:bg-emerald-500/10 transition-all"
            >
              <ArrowRight className="w-4 h-4" /> Logout Session
            </button>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/10 transition-all"
              >
                <X className="w-4 h-4" /> Delete Account
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <p className="text-[11px] font-bold text-emerald-500">Permanently delete your account?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-[11px] font-black hover:bg-emerald-700 transition-all"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 py-2 rounded-xl bg-[#EAF4F7] text-[#0C7075] text-[11px] font-bold hover:bg-[#B9DDE4] transition-all dark:bg-[#294D61] dark:text-[#03F3DA]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 min-w-0">
          {/* Top bar */}
          <header
            className={`sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 py-4 border-b backdrop-blur-md transition-colors ${
              isDark ? 'bg-[#05161A]/90 border-[#294D61]' : 'bg-white/90 border-[#B9DDE4]'
            }`}
          >
            <div>
              <h1 className={`text-xl font-black capitalize ${heading}`}>{activeSection}</h1>
              <p className={`text-[11px] ${muted}`}>Welcome back, {user?.name || 'Guest'}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border text-sm transition-all ${card}`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl bg-[#0C7075] text-white text-xs font-black hover:bg-[#0A5A5E] transition-all shadow-md"
              >
                Logout
              </button>
            </div>
          </header>

          {/* Mobile nav tabs */}
          <div className={`md:hidden flex overflow-x-auto gap-2 px-4 py-3 border-b ${isDark ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => (item.href ? router.push(item.href) : setActiveSection(item.key))}
                className={`shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${
                  activeSection === item.key
                    ? 'bg-[#0C7075] text-white'
                    : isDark
                    ? 'bg-[#05161A] text-[#A9C6D4] border border-[#294D61]'
                    : 'bg-white text-[#294D61] border border-[#B9DDE4]'
                }`}
              >
                {getIcon(item.icon)} {item.label}
              </button>
            ))}
          </div>

          <div className="p-6 lg:p-10 space-y-8">
            {/* ===== OVERVIEW ===== */}
            {activeSection === 'overview' && (
              <>
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {statCards.map((s, i) => (
                    <div key={i} className={`p-5 rounded-3xl border shadow-sm space-y-3 ${card}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-lg`}>{getIcon(s.icon)}</span>
                        <span className={`text-[10px] font-bold ${isDark ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>{s.delta}</span>
                      </div>
                      <div>
                        <p className={`text-3xl font-black ${heading}`}>{s.value}</p>
                        <p className={`text-xs font-semibold mt-1 ${muted}`}>{s.label}</p>
                      </div>
                      <div className={`h-1.5 rounded-full bg-gradient-to-r ${s.color}`}></div>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${card}`}>
                  <h2 className={`text-sm font-black ${heading}`}>Quick Actions</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Link href="/leadfinder" className="p-4 rounded-2xl bg-[#0C7075] text-white text-xs font-black hover:bg-[#0A5A5E] transition-all shadow-md text-center">
                      Scout New Leads
                    </Link>
                    <Link href="/crm" className="p-4 rounded-2xl bg-[#EAF4F7] text-[#0C7075] text-xs font-black hover:bg-[#B9DDE4] transition-all text-center dark:bg-[#294D61] dark:text-[#03F3DA]">
                      Open CRM Hub
                    </Link>
                    <Link href="/pipeline" className={`p-4 rounded-2xl border text-xs font-black transition-all text-center ${isDark ? 'border-[#294D61] hover:border-[#0C7075]' : 'border-[#B9DDE4] hover:border-[#0C7075]'}`}>
                      View Pipeline
                    </Link>
                  </div>
                </div>

                {/* Recent leads */}
                <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${card}`}>
                  <h2 className={`text-sm font-black ${heading}`}>Recent Leads</h2>
                  <div className="space-y-3">
                    {recentLeads.map((l, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-[#B9DDE4] dark:border-[#294D61]">
                        <div>
                          <p className={`text-xs font-black ${heading}`}>{l.name}</p>
                          <p className={`text-[10px] ${muted}`}>Value: {l.value}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-black border ${
                            l.status === 'Closed'
                              ? 'bg-[#E8F7EE] text-[#1F7A3D] border-[#A7E3C0]'
                              : l.status === 'New'
                              ? 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'
                              : isDark
                              ? 'bg-[#072E33] text-[#03F3DA] border-[#0C7075]'
                              : 'bg-[#FFF5E6] text-[#B7791F] border-[#FBD38D]'
                          }`}
                        >
                          {l.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ===== SETTINGS ===== */}
            {activeSection === 'settings' && (
              <div className={`p-6 lg:p-8 rounded-3xl border shadow-sm space-y-6 ${card}`}>
                <h2 className={`text-lg font-black ${heading}`}>Settings</h2>
                <div className="flex items-center justify-between p-5 rounded-2xl border border-[#B9DDE4] dark:border-[#294D61]">
                  <div>
                    <p className={`text-sm font-black ${heading}`}>Appearance</p>
                    <p className={`text-xs mt-0.5 ${muted}`}>Switch between light and dark theme.</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-4 py-2.5 rounded-xl bg-[#0C7075] text-white text-xs font-black hover:bg-[#0A5A5E] transition-all shadow-md"
                  >
                    {isDark ? 'Switch to Light' : 'Switch to Dark'}
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                  <div>
                    <p className="text-sm font-black text-emerald-500">Account Actions</p>
                    <p className={`text-xs mt-0.5 ${muted}`}>Log out of your session or permanently delete your account.</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={handleLogout} className="px-4 py-2.5 rounded-xl bg-[#0C7075] text-white text-xs font-black hover:bg-[#0A5A5E] transition-all shadow-md">
                      Logout
                    </button>
                    <button onClick={() => setConfirmDelete(true)} className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black hover:bg-emerald-700 transition-all shadow-md">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ===== PROFILE ===== */}
            {activeSection === 'profile' && (
              <div className={`p-6 lg:p-8 rounded-3xl border shadow-sm space-y-6 ${card}`}>
                <h2 className={`text-lg font-black ${heading}`}>Profile</h2>

                {/* Avatar editor */}
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] border-[3px] border-[#B9DDE4] flex items-center justify-center overflow-hidden shadow-md">
                    {editAvatar ? (
                      <img src={editAvatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl text-white/90">{initialsOf(user?.name)}</span>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <span className="inline-block px-5 py-2.5 rounded-xl bg-[#EAF4F7] text-[#0C7075] text-xs font-black hover:bg-[#B9DDE4] transition-all dark:bg-[#294D61] dark:text-[#03F3DA]">
                      Change Photo
                    </span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                {/* Editable fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={`text-[11px] font-bold uppercase tracking-wider text-[#0C7075]`}>Full Name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#0C7075] ${
                        isDark ? 'bg-[#05161A] border-[#294D61] text-white' : 'bg-[#F4FAFC] border-[#B9DDE4] text-[#072E33]'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className={`text-[11px] font-bold uppercase tracking-wider text-[#0C7075]`}>Email Address</label>
                    <input
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none focus:border-[#0C7075] ${
                        isDark ? 'bg-[#05161A] border-[#294D61] text-white' : 'bg-[#F4FAFC] border-[#B9DDE4] text-[#072E33]'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={saveProfile}
                    className="px-6 py-3 rounded-2xl bg-[#0C7075] text-white text-xs font-black hover:bg-[#0A5A5E] transition-all shadow-md"
                  >
                    Save Changes
                  </button>
                  {saved && (
                    <span className="text-xs font-bold text-[#1F7A3D]">Profile saved!</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-[#EAF4F7] border border-[#B9DDE4] text-xs text-[#0C7075] dark:bg-[#294D61] dark:text-[#03F3DA]">
                  Your profile, avatar, and settings are stored securely on this device and synced with your Huntify account.
                </div>
              </div>
            )}

            {/* ===== OTHER TABS (routed pages) ===== */}
            {(activeSection === 'leadfinder' || activeSection === 'crm' || activeSection === 'pipeline') && (
              <div className={`p-10 rounded-3xl border shadow-sm text-center space-y-4 ${card}`}>
                <span className="text-4xl">
                  <Dot className="w-10 h-10 fill-[#0C7075]" />
                </span>
                <h2 className={`text-xl font-black ${heading}`}>
                  {activeSection === 'leadfinder' ? 'Lead Finder' : activeSection === 'crm' ? 'CRM Hub' : 'Deal Pipeline'}
                </h2>
                <p className={`text-sm ${muted}`}>This module has its own dedicated page.</p>
                <Link
                  href={activeSection === 'leadfinder' ? '/leadfinder' : activeSection === 'crm' ? '/crm' : '/pipeline'}
                  className="inline-block px-6 py-3 rounded-2xl bg-[#0C7075] text-white text-xs font-black hover:bg-[#0A5A5E] transition-all shadow-md"
                >
                  Open {activeSection === 'leadfinder' ? 'Lead Finder' : activeSection === 'crm' ? 'CRM Hub' : 'Pipeline'} <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
