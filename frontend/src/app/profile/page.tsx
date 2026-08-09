'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

const initialsOf = (name?: string) =>
  name
    ? name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

type SectionKey = 'account' | 'security' | 'activity' | 'preferences';

const SECTIONS: { key: SectionKey; label: string; icon: string }[] = [
  { key: 'account', label: 'Account Details', icon: '👤' },
  { key: 'security', label: 'Security & Password', icon: '🔒' },
  { key: 'activity', label: 'Activity Logs', icon: '📜' },
  { key: 'preferences', label: 'Preferences', icon: '⚙️' },
];

export default function ProfilePage() {
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
    openGuardModal,
  } = useAuth();

  const [activeSection, setActiveSection] = useState<SectionKey>('account');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notify, setNotify] = useState<string | null>(null);

  // Account state
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editPhone, setEditPhone] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editBio, setEditBio] = useState('');

  // Security state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [twoFactor, setTwoFactor] = useState(true);

  // Preferences state
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyLead, setNotifyLead] = useState(true);
  const [notifyDeal, setNotifyDeal] = useState(false);

  const isDark = theme === 'dark';

  // If not authenticated, show guard modal and a fallback view
  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen font-sans flex flex-col ${isDark ? 'bg-[#05161A] text-white' : 'bg-[#F4FAFC] text-[#072E33]'}`}>
        <Navbar active="profile" />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className={`p-8 rounded-3xl border shadow-xl text-center space-y-4 max-w-sm ${isDark ? 'bg-[#072E33] border-[#294D61]' : 'bg-white border-[#B9DDE4]'}`}>
            <span className="text-4xl">🔒</span>
            <h1 className="text-xl font-black">Login Required</h1>
            <p className={`text-xs ${isDark ? 'text-[#A9C6D4]' : 'text-[#294D61]'}`}>Sign in to view and manage your account dashboard.</p>
            <button
              onClick={openGuardModal}
              className="w-full py-3 rounded-2xl bg-[#0C7075] text-white text-xs font-black hover:bg-[#0A5A5E] transition-all shadow-md"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      setEditName(editName);
      updateAvatar(dataUrl);
      triggerNotify('Profile picture updated!');
    };
    reader.readAsDataURL(file);
  };

  const saveAccount = () => {
    updateProfile({ name: editName || user?.name, email: editEmail || user?.email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    triggerNotify('Account details saved successfully!');
  };

  const saveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      triggerNotify('New password and confirmation do not match!');
      return;
    }
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    triggerNotify('Password updated successfully!');
  };

  const base = isDark ? 'bg-[#05161A] text-[#FAF8F5]' : 'bg-[#F4FAFC] text-[#072E33]';
  const card = isDark ? 'bg-[#072E33] border-[#294D61]' : 'bg-white border-[#B9DDE4]';
  const muted = isDark ? 'text-[#A9C6D4]' : 'text-[#294D61]';
  const heading = isDark ? 'text-white' : 'text-[#072E33]';
  const inputCls = isDark
    ? 'bg-[#05161A] border-[#294D61] text-white placeholder:text-[#6DA5C0] focus:border-[#03F3DA]'
    : 'bg-[#F4FAFC] border-[#B9DDE4] text-[#072E33] placeholder:text-[#6DA5C0] focus:border-[#0C7075]';
  const labelCls = 'text-[11px] font-bold text-[#0C7075] uppercase tracking-wider';
  const btnPrimary = 'px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white text-xs font-black hover:from-[#0C7075] hover:to-[#03F3DA] transition-all shadow-lg hover:scale-[1.02]';

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${base}`}>
      {/* Ambient teal glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#0C7075]/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#6DA5C0]/15 blur-[180px] rounded-full pointer-events-none -z-10"></div>

      {notify && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0C7075] text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl animate-bounce border border-[#03F3DA]/50">
          ✨ {notify}
        </div>
      )}

      {/* Shared Navbar */}
      <Navbar active="profile" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Page Banner */}
        <div className="text-center space-y-2">
          <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border inline-block ${isDark ? 'bg-[#072E33] text-[#03F3DA] border-[#0C7075]/60' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'}`}>
            👤 Account Dashboard
          </span>
          <h1 className={`text-3xl font-black ${heading}`}>Your Account Hub</h1>
          <p className={`text-xs sm:text-sm ${muted}`}>Manage your profile, security, logs, and preferences in one place.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ===== SIDEBAR ===== */}
          <aside className={`lg:w-72 shrink-0 rounded-3xl border shadow-xl p-4 h-fit ${card}`}>
            {/* Profile mini card */}
            <div className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-[#B9DDE4] dark:border-[#294D61] mb-4">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#0C7075] to-[#6DA5C0] border-4 border-[#03F3DA]/40 flex items-center justify-center overflow-hidden shadow-lg">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-white/95">{initialsOf(user?.name)}</span>
                )}
              </div>
              <div className="text-center">
                <p className={`text-sm font-black ${heading}`}>{user?.name || 'User'}</p>
                <p className={`text-[11px] ${muted}`}>{user?.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${isDark ? 'bg-[#072E33] text-[#03F3DA] border-[#0C7075]' : 'bg-[#EAF4F7] text-[#0C7075] border-[#B9DDE4]'}`}>
                Pro Member
              </span>
            </div>

            {/* Sidebar nav */}
            <nav className="space-y-1">
              {SECTIONS.map((sec) => {
                const active = activeSection === sec.key;
                return (
                  <button
                    key={sec.key}
                    onClick={() => setActiveSection(sec.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white shadow-md'
                        : isDark
                          ? 'text-[#A9C6D4] hover:bg-[#294D61] hover:text-[#03F3DA]'
                          : 'text-[#294D61] hover:bg-[#EAF4F7] hover:text-[#0C7075]'
                    }`}
                  >
                    <span className="text-sm">{sec.icon}</span>
                    {sec.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-[#B9DDE4] dark:border-[#294D61] space-y-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black text-[#0C7075] hover:bg-[#EAF4F7] transition-all dark:text-[#03F3DA] dark:hover:bg-[#294D61]"
              >
                🚪 Logout Session
              </button>
              {!confirmDelete ? (
<button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-500 hover:bg-emerald-500/10 transition-all"
                >
                  🗑️ Delete Account
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <p className="text-[11px] font-bold text-emerald-500">Permanently delete your account?</p>
                  <div className="flex gap-2">
                    <button onClick={handleDelete} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-[11px] font-black hover:bg-emerald-700 transition-all">
                      Yes, Delete
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="flex-1 py-2 rounded-xl bg-[#EAF4F7] text-[#0C7075] text-[11px] font-bold hover:bg-[#D5ECF0] transition-all">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ===== MAIN CONTENT ===== */}
          <section className="flex-1 min-w-0 space-y-6">
            {/* Mobile nav tabs */}
            <div className={`lg:hidden flex overflow-x-auto gap-2 p-2 rounded-2xl border ${card}`}>
              {SECTIONS.map((sec) => (
                <button
                  key={sec.key}
                  onClick={() => setActiveSection(sec.key)}
                  className={`shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold transition-all ${
                    activeSection === sec.key
                      ? 'bg-[#0C7075] text-white'
                      : isDark
                        ? 'bg-[#05161A] text-[#A9C6D4] border border-[#294D61]'
                        : 'bg-white text-[#294D61] border border-[#B9DDE4]'
                  }`}
                >
                  {sec.icon} {sec.label}
                </button>
              ))}
            </div>

            {/* ===== ACCOUNT DETAILS ===== */}
            {activeSection === 'account' && (
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${card}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-lg font-black ${heading}`}>👤 Account Details</h2>
                    <p className={`text-xs mt-0.5 ${muted}`}>Update your personal information.</p>
                  </div>
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EAF4F7] text-[#0C7075] text-xs font-black hover:bg-[#D5ECF0] transition-all dark:bg-[#294D61] dark:text-[#03F3DA]">
                      📷 Change Photo
                    </span>
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className={labelCls}>Full Name</label>
                    <input value={editName} onChange={(e) => setEditName(e.target.value)} className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${inputCls}`} />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Email Address</label>
                    <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${inputCls}`} />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Phone Number</label>
                    <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+92 3XX XXXXXXX" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${inputCls}`} />
                  </div>
                  <div className="space-y-1">
                    <label className={labelCls}>Company / Agency</label>
                    <input value={editCompany} onChange={(e) => setEditCompany(e.target.value)} placeholder="e.g. Ismab Studios" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${inputCls}`} />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className={labelCls}>Professional Bio</label>
                    <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} rows={3} placeholder="Tell prospects and clients about your services..." className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none resize-none ${inputCls}`}></textarea>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={saveAccount} className={btnPrimary}>
                    💾 Save Changes
                  </button>
                  {saved && <span className="text-xs font-bold text-[#1F7A3D]">✓ Saved!</span>}
                </div>
              </div>
            )}

            {/* ===== SECURITY & PASSWORD ===== */}
            {activeSection === 'security' && (
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${card}`}>
                <div>
                  <h2 className={`text-lg font-black ${heading}`}>🔒 Security & Password</h2>
                  <p className={`text-xs mt-0.5 ${muted}`}>Protect your account with a strong password and extra security.</p>
                </div>

                <form onSubmit={saveSecurity} className="space-y-4">
                  <div className="space-y-1">
                    <label className={labelCls}>Current Password</label>
                    <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="Enter current password" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${inputCls}`} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelCls}>New Password</label>
                      <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 8 characters" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${inputCls}`} />
                    </div>
                    <div className="space-y-1">
                      <label className={labelCls}>Confirm New Password</label>
                      <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter new password" className={`w-full px-4 py-3 rounded-2xl border text-sm outline-none ${inputCls}`} />
                    </div>
                  </div>
                  <button type="submit" className={btnPrimary}>
                    🔑 Update Password
                  </button>
                </form>

                <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${isDark ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
                  <div>
                    <p className={`text-sm font-black ${heading}`}>🛡️ Two-Factor Authentication</p>
                    <p className={`text-xs mt-0.5 ${muted}`}>Add an extra layer of security to your sign-ins.</p>
                  </div>
                  <button
                    onClick={() => { setTwoFactor(!twoFactor); triggerNotify(twoFactor ? '2FA disabled' : '2FA enabled'); }}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors shrink-0 ${twoFactor ? 'bg-[#0C7075]' : isDark ? 'bg-[#294D61]' : 'bg-[#B9DDE4]'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            )}

            {/* ===== ACTIVITY LOGS ===== */}
            {activeSection === 'activity' && (
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${card}`}>
                <div>
                  <h2 className={`text-lg font-black ${heading}`}>📜 Activity Logs</h2>
                  <p className={`text-xs mt-0.5 ${muted}`}>A record of recent actions and security events on your account.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: '🔑', title: 'Password changed', desc: 'You updated your account password.', time: '2 hours ago', color: 'text-[#0C7075]' },
                    { icon: '📧', title: 'Email updated', desc: 'Your primary email address was changed.', time: 'Yesterday', color: 'text-[#0C7075]' },
                    { icon: '🎯', title: 'New leads scouted', desc: 'Scanned 12 verified businesses in Lahore.', time: 'Yesterday', color: 'text-[#0C7075]' },
                    { icon: '📊', title: 'Deal stage updated', desc: 'Zenith Tech moved to Negotiation.', time: '2 days ago', color: 'text-[#0C7075]' },
                    { icon: '🌙', title: 'Theme preference changed', desc: 'Switched to dark mode.', time: '3 days ago', color: 'text-[#0C7075]' },
                  ].map((log, i) => (
                    <div key={i} className={`p-4 rounded-2xl border flex items-start gap-3 ${isDark ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
                      <div className={`w-9 h-9 rounded-xl bg-[#EAF4F7] dark:bg-[#294D61] flex items-center justify-center text-base shrink-0 ${log.color}`}>
                        {log.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-black ${heading}`}>{log.title}</p>
                        <p className={`text-[11px] mt-0.5 ${muted}`}>{log.desc}</p>
                      </div>
                      <span className={`text-[10px] font-bold shrink-0 ${isDark ? 'text-[#6DA5C0]' : 'text-[#6DA5C0]'}`}>{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== PREFERENCES ===== */}
            {activeSection === 'preferences' && (
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${card}`}>
                <div>
                  <h2 className={`text-lg font-black ${heading}`}>⚙️ Preferences</h2>
                  <p className={`text-xs mt-0.5 ${muted}`}>Customize your experience, notifications, and appearance.</p>
                </div>

                {/* Appearance */}
                <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${isDark ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
                  <div>
                    <p className={`text-sm font-black ${heading}`}>🌙 Theme Appearance</p>
                    <p className={`text-xs mt-0.5 ${muted}`}>Switch between light and dark mode.</p>
                  </div>
                  <button onClick={toggleTheme} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0C7075] to-[#6DA5C0] text-white text-xs font-black hover:scale-105 transition-all shadow-md shrink-0">
                    {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                  </button>
                </div>

                {/* Notifications */}
                <div className="space-y-3">
                  <p className={`text-sm font-black ${heading}`}>🔔 Notifications</p>
                  {[
                    { label: 'Email me about new available leads', state: notifyEmail, set: setNotifyEmail },
                    { label: 'Notify me when a lead opens my proposal', state: notifyLead, set: setNotifyLead },
                    { label: 'Deal stage change alerts', state: notifyDeal, set: setNotifyDeal },
                  ].map((n, i) => (
                    <div key={i} className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${isDark ? 'border-[#294D61]' : 'border-[#B9DDE4]'}`}>
                      <p className={`text-xs font-bold ${heading}`}>{n.label}</p>
                      <button
                        onClick={() => n.set(!n.state)}
                        className={`w-12 h-6 rounded-full p-0.5 transition-colors shrink-0 ${n.state ? 'bg-[#0C7075]' : isDark ? 'bg-[#294D61]' : 'bg-[#B9DDE4]'}`}
                      >
                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${n.state ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>

                <button onClick={() => triggerNotify('Preferences saved successfully!')} className={btnPrimary}>
                  💾 Save Preferences
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
