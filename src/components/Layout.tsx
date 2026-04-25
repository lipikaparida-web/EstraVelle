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
  Settings as SettingsIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* App Header */}
      <header className="w-full px-8 py-6 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-soft-pink/20 dark:border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <span className="text-2xl font-serif font-bold tracking-tight text-serenity-purple dark:text-slate-200 italic">EstraVelle</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 relative group">
            <Languages size={18} className="text-slate-400 group-hover:text-serenity-purple transition-colors" />
            <select 
              value={i18n.language} 
              onChange={(e) => changeLanguage(e.target.value)}
              className="appearance-none bg-transparent text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-serenity-purple focus:outline-none cursor-pointer pr-4"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
          <NavLink 
            to="/logs"
            className="hidden md:block px-6 py-2 rounded-full bg-tangerine text-white text-sm font-medium hover:opacity-90 transition-opacity shadow-sm shadow-tangerine/20"
          >
            {t('nav.logs')}
          </NavLink>
          {user?.photoURL ? (
            <NavLink to="/profile" className="w-10 h-10 rounded-full border-2 border-tangerine p-0.5 hover:scale-105 transition-transform">
              <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full" />
            </NavLink>
          ) : (
            <NavLink to="/profile" className="w-10 h-10 rounded-full bg-amber-50 border-2 border-tangerine flex items-center justify-center text-tangerine hover:scale-105 transition-transform">
              <UserIcon size={20} />
            </NavLink>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 flex flex-col">
        <div className="w-full h-full flex flex-col">
          {children}
        </div>
      </main>

      {/* Bottom Bar: Gentle Navigation */}
      <nav className="px-6 md:px-12 py-4 flex justify-between items-center bg-white dark:bg-slate-950 border-t border-soft-pink/10 dark:border-slate-800 sticky bottom-0 z-40 overflow-x-auto">
        <div className="flex items-center gap-6 md:gap-10 text-serenity-purple dark:text-slate-300">
          <BottomNavItem to="/" label={t('nav.dashboard')} />
          <BottomNavItem to="/logs" label={t('nav.logs')} />
          <BottomNavItem to="/assistant" label="Ask AI" />
          <BottomNavItem to="/consult" label="Consult" />
          <BottomNavItem to="/report" label={t('nav.insights')} />
          <BottomNavItem to="/history" label="History" />
          <BottomNavItem to="/hub" label="Library" />
          <BottomNavItem to="/community" label={t('nav.community')} />
          <BottomNavItem to="/profile" label={t('nav.profile')} />
          <BottomNavItem to="/settings" label="Settings" />
        </div>
        <button 
          onClick={handleLogout}
          className="text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-500 transition-colors ml-4 shrink-0"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

function BottomNavItem({ to, label }: { to: string, label: string }) {
  return (
    <NavLink 
      to={to}
      className="flex flex-col items-center gap-1 transition-all"
    >
      {({ isActive }) => (
        <>
          <div className={cn("w-1 h-1 bg-tangerine rounded-full transition-all mt-1", isActive ? "opacity-100 scale-100" : "opacity-0 scale-0")} />
          <span className={cn("text-xs font-bold uppercase tracking-wider transition-all", isActive ? "opacity-100" : "opacity-40 hover:opacity-100")}>{label}</span>
        </>
      )}
    </NavLink>
  );
}
