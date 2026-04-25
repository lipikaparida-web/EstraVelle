import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Calendar, Activity, Wind, Apple, Heart, ChevronRight, RefreshCw, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { auth } from '../lib/firebase';
import { getLogs } from '../services/db';
import { generateWellnessPlan, WellnessPlan as WellnessPlanType } from '../services/geminiService';
import { cn } from '../lib/utils';
import { format, parseISO, subDays } from 'date-fns';

export default function WellnessPlanComponent() {
  const [plan, setPlan] = useState<WellnessPlanType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPlanData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Get recent logs for context
      const logs = await getLogs(user.uid);
      const recentLogs = logs.slice(0, 14); // Last 2 weeks

      // Calculate current cycle info (this logic should ideally be shared with Dashboard)
      const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
      const latestPeriodStart = sortedLogs.find(l => l.periodStart);
      
      let phase = 'Follicular';
      let dayOfCycle = 1;
      
      if (latestPeriodStart) {
        const startDate = parseISO(latestPeriodStart.date);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - startDate.getTime());
        dayOfCycle = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (dayOfCycle <= 5) phase = 'Menstrual';
        else if (dayOfCycle <= 13) phase = 'Follicular';
        else if (dayOfCycle <= 15) phase = 'Ovulation';
        else phase = 'Luteal';
      }

      const symptoms = Array.from(new Set(recentLogs.flatMap(l => l.symptoms)));
      const recentMoods = Array.from(new Set(recentLogs.map(l => l.mood)));

      const generatedPlan = await generateWellnessPlan({
        phase,
        symptoms,
        recentMoods,
        dayOfCycle
      });

      setPlan(generatedPlan);
    } catch (error) {
      console.error("Error fetching wellness plan:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPlanData();
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-serenity-purple animate-spin" />
        <p className="text-slate-400 italic">EstraVelle is crafting your cosmic wellness plan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-lavender/20 px-3 py-1 rounded-full border border-lavender/30 mb-2">
            <Sparkles size={14} className="text-serenity-purple" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-serenity-purple">AI Powered</span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-slate-700 dark:text-slate-200 italic">Your Wellness Orbit</h2>
          <p className="text-slate-500 dark:text-slate-400 italic">Tailored daily nourishment for your soul and body. ✨</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 text-serenity-purple border border-soft-pink/20 rounded-2xl shadow-sm hover:shadow-md transition-all group disabled:opacity-50"
        >
          <RefreshCw size={18} className={cn("transition-transform", isRefreshing && "animate-spin")} />
          <span className="text-sm font-bold uppercase tracking-widest">Re-align Plan</span>
        </button>
      </header>

      {/* Weekly Focus */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-vibrant bg-gradient-to-br from-serenity-purple to-cura-purple text-white p-10 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center shrink-0 shadow-xl">
            <Calendar size={48} className="text-white" />
          </div>
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-sm font-bold uppercase tracking-[0.3em] opacity-70">Focus for the Week</h3>
            <p className="text-3xl font-serif italic leading-tight">{plan?.weeklyFocus}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Activities */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-serif font-bold text-slate-700 dark:text-slate-200 italic flex items-center gap-3">
            <Heart size={20} className="text-soft-pink" />
            Today's Sacred Acts
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {plan?.dailyActivities.map((activity, idx) => {
              // Dynamic icon lookup
              const IconComponent = (LucideIcons as any)[activity.icon] || Heart;
              
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group card-soft bg-white/40 dark:bg-slate-900/40 border border-soft-pink/10 dark:border-slate-800 p-6 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-all flex items-start gap-6 cursor-default"
                >
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110",
                    activity.category === 'Nutrition' && "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
                    activity.category === 'Exercise' && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                    activity.category === 'Mindfulness' && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                  )}>
                    <IconComponent size={28} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{activity.category}</span>
                    </div>
                    <h4 className="text-lg font-serif font-bold text-slate-700 dark:text-slate-200 italic">{activity.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">{activity.description}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* AI Insight Sidebar */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-slate-700 dark:text-slate-200 italic flex items-center gap-3">
            <Activity size={20} className="text-lavender" />
            EstraVelle's Reflection
          </h3>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-soft bg-lavender/10 dark:bg-slate-900/30 border-lavender/20 dark:border-lavender/10 p-8 space-y-6"
          >
            <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm text-serenity-purple">
              <Sparkles size={24} />
            </div>
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                {plan?.insights}
              </p>
              <div className="pt-4 border-t border-lavender/20 italic text-[11px] text-slate-400">
                “This plan is attuned to your current cycle phase and recent reports. Healing is not a straight line, it's a circle.”
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
