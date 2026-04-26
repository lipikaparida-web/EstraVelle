import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Users,
  LogOut,
  MessageSquare,
  FileText,
  History as HistoryIcon,
  Stethoscope,
  User as UserIcon,
  Settings as SettingsIcon,
  Languages,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'mr', name: 'मराठी' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' }
];

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await logout();
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    /* --- MASTER CONTAINER: REPLACED WHITE WITH MIST ROSE --- */
    <div className="min-h-screen flex bg-mist-rose transition-colors duration-300 relative overflow-hidden font-sans">

      {/* AMBIENT GLOWS: UPDATED TO NEW PALETTE */}
      <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-rose-dusty blur-[120px] opacity-30 z-0 animate-pulse" />
      <div className="absolute bottom-[5%] right-[-5%] w-[45%] h-[55%] rounded-full bg-[#E2D1D1] blur-[110px] opacity-40 z-0" />

      {/* --- SIDEBAR: UPDATED TO PLUM WINE --- */}
      <aside className="w-64 h-screen sticky top-0 hidden md:flex flex-col bg-white/40 backdrop-blur-2xl border-r border-rose-dusty/20 z-50 shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <Logo size={34} />
          <span className="text-2xl font-serif font-bold italic text-plum-wine tracking-tight">
            EstraVelle
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pt-2">
          <SideNavItem to="/" icon={<LayoutDashboard size={20} />} label={t('nav.dashboard')} />
          <SideNavItem to="/logs" icon={<CalendarDays size={20} />} label={t('nav.logs')} />
          <SideNavItem to="/assistant" icon={<Sparkles size={20} />} label="Ask AI" />
          <SideNavItem to="/consult" icon={<Stethoscope size={20} />} label="Consult" />
          <SideNavItem to="/report" icon={<FileText size={20} />} label={t('nav.insights')} />
          <SideNavItem to="/history" icon={<HistoryIcon size={20} />} label="History" />
          <SideNavItem to="/hub" icon={<BookOpen size={20} />} label="Library" />
          <SideNavItem to="/community" icon={<Users size={20} />} label={t('nav.community')} />
          <SideNavItem to="/profile" icon={<UserIcon size={20} />} label={t('nav.profile')} />
          <SideNavItem to="/settings" icon={<SettingsIcon size={20} />} label="Settings" />
        </nav>

        <div className="p-6 mt-auto border-t border-rose-dusty/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-plum-wine/60 hover:text-plum-wine hover:bg-white/40 rounded-2xl transition-all duration-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 z-10">

        {/* --- FLOATING HEADER PILL --- */}
        <header className="w-full px-10 py-8 flex justify-end items-center bg-transparent sticky top-0 z-40">
          <div className="flex items-center gap-6 bg-white/40 backdrop-blur-xl px-7 py-2.5 rounded-full border border-white/60 shadow-lg shadow-plum-wine/5">

            <div className="flex items-center gap-2 relative group">
              <Languages size={18} className="text-plum-wine/40 group-hover:text-plum-wine transition-colors" />
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="appearance-none bg-transparent text-[10px] font-black uppercase tracking-[0.15em] text-plum-wine/60 hover:text-plum-wine focus:outline-none cursor-pointer pr-4"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code} className="bg-mist-rose text-plum-deep">{lang.name}</option>
                ))}
              </select>
            </div>

            <NavLink
              to="/logs"
              className="px-6 py-2 rounded-full bg-rose-dusty text-white text-[10px] font-black uppercase tracking-[0.15em] hover:scale-[1.05] hover:shadow-lg hover:shadow-rose-dusty/30 transition-all duration-300"
            >
              {t('nav.logs')}
            </NavLink>

            <NavLink to="/profile" className="w-9 h-9 rounded-full border-2 border-rose-dusty p-0.5 hover:rotate-6 transition-transform overflow-hidden bg-white shadow-md">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-rose-dusty">
                  <UserIcon size={16} />
                </div>
              )}
            </NavLink>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      {/* --- MOBILE NAVIGATION --- */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 h-16 bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl flex justify-around items-center px-4 z-50">
        <MobileIconNavItem to="/" icon={<LayoutDashboard size={22} />} />
        <MobileIconNavItem to="/logs" icon={<CalendarDays size={22} />} />
        <MobileIconNavItem to="/assistant" icon={<Sparkles size={22} />} />
        <MobileIconNavItem to="/profile" icon={<UserIcon size={22} />} />
      </nav>
    </div>
  );
}

function SideNavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-4 px-5 py-3.5 rounded-[22px] transition-all duration-500 group relative",
        isActive
          ? "bg-white/80 text-plum-wine shadow-md shadow-plum-wine/5 border border-white/60"
          : "text-plum-wine/40 hover:bg-white/40 hover:text-plum-wine"
      )}
    >
      {({ isActive }) => (
        <>
          <div className={cn("transition-all duration-300", isActive ? "scale-110 text-plum-wine" : "group-hover:text-plum-wine")}>
            {icon}
          </div>
          <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-all", isActive ? "opacity-100" : "opacity-60")}>
            {label}
          </span>
          {isActive && (
            <div className="ml-auto w-1.5 h-1.5 bg-rose-dusty rounded-full shadow-[0_0_10px_#A6808C]" />
          )}
        </>
      )}
    </NavLink>
  );
}

function MobileIconNavItem({ to, icon }: { to: string, icon: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "p-3 rounded-2xl transition-all duration-300",
        isActive ? "text-plum-wine bg-plum-wine/10 scale-110" : "text-plum-wine/30"
      )}
    >
      {icon}
    </NavLink>
  );
}