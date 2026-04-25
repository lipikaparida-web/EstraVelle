import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings as SettingsIcon, Bell, Shield, Lock, Eye, Download, Trash2, Smartphone, Globe, Sun, Moon, Palette, RefreshCcw, LogOut, Plus, Clock, X, Database, Sparkles } from 'lucide-react';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import { seedData } from '../services/seedData';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'privacy'>('general');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [reminders, setReminders] = useState<{ id: string; text: string; frequency: 'daily' | 'weekly' }[]>([
    { id: '1', text: 'Drink morning turmeric water', frequency: 'daily' },
    { id: '2', text: 'Evening moon meditation', frequency: 'weekly' }
  ]);
  const [newReminder, setNewReminder] = useState('');
  const [newFreq, setNewFreq] = useState<'daily' | 'weekly'>('daily');
  const { theme, setTheme } = useTheme();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const handleSeed = async () => {
    if (!auth.currentUser) return;
    setIsSeeding(true);
    setSeedResult(null);
    try {
      await seedData(auth.currentUser.uid, auth.currentUser.displayName || 'Demo User');
      setSeedResult('Successfully seeded 50 test records! 🚀');
    } catch (error) {
      console.error(error);
      setSeedResult('Failed to seed data. Check console.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-700 dark:text-slate-200 italic">Core Wisdom</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 italic">Refine your EstraVelle experience to match your frequency. ✨</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-4 bg-white dark:bg-slate-900 text-slate-400 hover:text-serenity-purple border border-soft-pink/20 dark:border-slate-800 rounded-2xl shadow-sm transition-all flex items-center gap-2 group"
          >
            <motion.div animate={isRefreshing ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
              <RefreshCcw size={20} className={cn("transition-transform group-active:rotate-180")} />
            </motion.div>
            <span className="text-sm font-bold uppercase tracking-widest">{isRefreshing ? "Syncing..." : "Sync Systems"}</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all",
              activeTab === 'general' ? "bg-serenity-purple text-white shadow-lg shadow-purple-100" : "text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            <Smartphone size={18} />
            General
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all",
              activeTab === 'notifications' ? "bg-serenity-purple text-white shadow-lg shadow-purple-100" : "text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            <Bell size={18} />
            Alerts
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={cn(
              "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all",
              activeTab === 'privacy' ? "bg-serenity-purple text-white shadow-lg shadow-purple-100" : "text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
            )}
          >
            <Shield size={18} />
            Privacy
          </button>
          <div className="pt-8 space-y-2">
            <button 
              onClick={() => import('../lib/firebase').then(m => {
                m.auth.signOut();
                window.location.href = '/';
              })}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs text-red-400 hover:bg-red-50 transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
            <button className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs text-red-600/50 hover:bg-red-50 transition-all">
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </aside>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="card-soft p-8 bg-white/40 dark:bg-slate-900/40 border border-soft-pink/10 dark:border-slate-800/50 space-y-10"
            >
              {activeTab === 'general' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-700 dark:text-slate-200 italic mb-2">General Experience</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">Personalize how EstraVelle feels and flows.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SettingItem 
                      label="Visual Theme"
                      description="Switch between light and ethereal dark modes."
                      type="select"
                      value={theme === 'dark' ? 'Ethereal Dark' : theme === 'system' ? 'System Default' : 'Serenity Light'}
                      onChange={(val) => {
                        if (val === 'Ethereal Dark') setTheme('dark');
                        else if (val === 'System Default') setTheme('system');
                        else setTheme('light');
                      }}
                      options={['Serenity Light', 'Ethereal Dark', 'System Default']}
                    />
                    <SettingItem 
                      label="Primary Language"
                      description="Choose your preferred language."
                      type="select"
                      options={['English', 'Spanish', 'French', 'Hindi']}
                    />
                    <SettingItem 
                      label="Measurement Units"
                      description="Metric or Imperial systems for tracking."
                      type="select"
                      options={['Metric', 'Imperial']}
                    />
                    <SettingItem 
                      label="Cycle Tracking Mode"
                      description="Adjust insights based on your journey."
                      type="select"
                      options={['Natural Cycle', 'PCOS/PCOD Support', 'Pregnancy Mode', 'Perimenopause']}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-700 dark:text-slate-200 italic mb-2">Gentle Reminders</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">Stay connected without feeling overwhelmed.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SettingItem 
                      label="Period Predictions"
                      description="Early alerts before your cycle begins."
                      type="toggle"
                      active
                    />
                    <SettingItem 
                      label="Daily Check-in"
                      description="A friendly nudge to log your vitals."
                      type="toggle"
                      active
                    />
                    <SettingItem 
                      label="Health Insights"
                      description="Weekly summaries of your patterns."
                      type="toggle"
                    />
                    <SettingItem 
                      label="Community Circles"
                      description="Mentions and replies in discussions."
                      type="toggle"
                      active
                    />
                  </div>

                  <div className="pt-10 border-t border-soft-pink/10 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-serif font-bold text-slate-700 dark:text-slate-200 italic">Custom Reminders</h4>
                        <p className="text-xs text-slate-400 italic">Personalized nudges for your self-care rituals.</p>
                      </div>
                      <Plus size={20} className="text-soft-pink" />
                    </div>

                    <div className="space-y-3">
                      {reminders.map(r => (
                        <div key={r.id} className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-900/60 border border-soft-pink/10 rounded-2xl group transition-all hover:border-soft-pink/30">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-soft-pink/10 flex items-center justify-center text-soft-pink">
                              <Clock size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{r.text}</p>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{r.frequency}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setReminders(prev => prev.filter(item => item.id !== r.id))}
                            className="p-2 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-4 items-end bg-lavender/5 p-6 rounded-3xl border border-lavender/10">
                      <div className="flex-1 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block ml-1">New Ritual Reminder</label>
                        <input 
                          type="text" 
                          placeholder="e.g., Afternoon tea break"
                          value={newReminder}
                          onChange={(e) => setNewReminder(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-lavender/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/30 transition-all dark:text-slate-200"
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block ml-1">Frequency</label>
                        <select 
                          value={newFreq}
                          onChange={(e) => setNewFreq(e.target.value as 'daily' | 'weekly')}
                          className="w-full bg-white dark:bg-slate-900 border border-lavender/20 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/30 transition-all dark:text-slate-200"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => {
                          if (newReminder.trim()) {
                            setReminders(prev => [...prev, { id: Date.now().toString(), text: newReminder, frequency: newFreq }]);
                            setNewReminder('');
                          }
                        }}
                        className="p-2.5 bg-serenity-purple text-white rounded-xl hover:shadow-lg transition-all"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-slate-700 dark:text-slate-200 italic mb-2">Privacy & Security</h3>
                    <p className="text-sm text-slate-400 dark:text-slate-500 italic">Your data sovereignty is our priority.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <SettingItem 
                      label="FaceID / TouchID"
                      description="Require biometrics to open the app."
                      type="toggle"
                    />
                    <SettingItem 
                      label="Anonymous Analytics"
                      description="Help us improve EstraVelle without identifying you."
                      type="toggle"
                      active
                    />
                    <SettingItem 
                      label="Google Fit Sync"
                      description="Import activity and sleep data."
                      type="toggle"
                    />
                    <SettingItem 
                      label="Public Profile"
                      description="Make your bio visible in community circles."
                      type="toggle"
                    />
                  </div>

                  <div className="pt-10 border-t border-soft-pink/10 space-y-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-slate-700 dark:text-slate-200 italic flex items-center gap-2">
                        <Database size={20} className="text-cura-purple" />
                        Developer Tools
                      </h3>
                      <p className="text-xs text-slate-400 italic mt-1">Special tools for panelists and reviewers to expedite platform testing.</p>
                    </div>

                    <div className="p-6 bg-lavender/5 dark:bg-slate-800/20 rounded-[2rem] border border-lavender/20 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Seed Demo Data</p>
                          <p className="text-[11px] text-slate-500 italic max-w-sm">
                            Instantly populate your account with 40 health logs (simulating a full cycle) and 10 community posts.
                          </p>
                        </div>
                        <button 
                          onClick={handleSeed}
                          disabled={isSeeding}
                          className={cn(
                            "px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap shadow-lg",
                            isSeeding ? "bg-slate-200 text-slate-400" : "bg-cura-purple text-white hover:bg-serenity-purple shadow-cura-purple/20"
                          )}
                        >
                          {isSeeding ? (
                            <>
                              <RefreshCcw size={16} className="animate-spin" />
                              Populating...
                            </>
                          ) : (
                            <>
                              <Sparkles size={16} />
                              Seed 50 Records
                            </>
                          )}
                        </button>
                      </div>
                      
                      {seedResult && (
                        <motion.p 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[11px] font-bold text-green-500 bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-800/50 italic text-center"
                        >
                          {seedResult}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="card-vibrant p-10 bg-gradient-to-br from-serenity-purple to-cura-purple text-white space-y-6 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-2">
              <h4 className="text-2xl font-serif font-bold italic">Deep Data Export</h4>
              <p className="text-white/80 text-sm italic">Download your entire health history in PDF or CSV format for your healthcare provider. 💜</p>
            </div>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-2xl font-bold shadow-2xl transition-all whitespace-nowrap">
              Export My Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingItem({ label, description, type, options, active = false, value, onChange }: { 
  label: string; 
  description: string; 
  type: 'toggle' | 'select' | 'input';
  options?: string[];
  active?: boolean;
  value?: string;
  onChange?: (value: any) => void;
}) {
  const [enabled, setEnabled] = useState(active);

  return (
    <div className="group p-4 rounded-3xl hover:bg-white/40 dark:hover:bg-slate-800/40 transition-colors border border-transparent hover:border-soft-pink/10">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-bold text-slate-600 dark:text-slate-300">{label}</label>
        {type === 'toggle' && (
          <button 
            onClick={() => {
              const next = !enabled;
              setEnabled(next);
              onChange?.(next);
            }}
            className={cn(
              "w-12 h-6 rounded-full relative p-1 transition-all duration-300",
              (value !== undefined ? value : enabled) ? "bg-serenity-purple" : "bg-lavender/30"
            )}
          >
            <div className={cn(
              "w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300",
              (value !== undefined ? value : enabled) ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
        )}
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed italic mb-3">{description}</p>
      
      {type === 'select' && (
        <select 
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-white/60 dark:bg-slate-900/60 border border-soft-pink/20 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-lavender transition-all dark:text-slate-300"
        >
          {options?.map(opt => <option key={opt}>{opt}</option>)}
        </select>
      )}
    </div>
  );
}
