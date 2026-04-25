import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLogs } from '../services/db';
import { HealthLog } from '../types';
import { FileText, Download, Sparkles, AlertCircle, TrendingUp, CheckCircle2, RefreshCcw, Heart, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { generateWellnessPlan, WellnessPlan as WellnessPlanType } from '../services/geminiService';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { differenceInDays, parseISO, startOfDay } from 'date-fns';

export default function HealthReport() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [report, setReport] = useState<WellnessPlanType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentLogs() {
      if (!user) return;
      try {
        const fetchedLogs = await getLogs(user.uid);
        setLogs(fetchedLogs.slice(0, 30));
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRecentLogs();
  }, []);

  const generateAIReport = async () => {
    if (logs.length === 0) return;
    setIsGenerating(true);
    try {
      // Calculate current context
      const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
      const latestPeriodStart = sortedLogs.find(l => l.periodStart);
      
      let phase = 'Follicular';
      let dayOfCycle = 13;
      
      if (latestPeriodStart) {
        const startDate = parseISO(latestPeriodStart.date);
        dayOfCycle = differenceInDays(startOfDay(new Date()), startOfDay(startDate)) + 1;
        
        if (dayOfCycle <= 5) phase = 'Menstrual';
        else if (dayOfCycle <= 13) phase = 'Follicular';
        else if (dayOfCycle <= 16) phase = 'Ovulation';
        else phase = 'Luteal';
      }

      const symptoms = Array.from(new Set(logs.flatMap(l => l.symptoms).filter(Boolean)));
      const recentMoods = Array.from(new Set(logs.map(l => l.mood).filter(Boolean)));

      const plan = await generateWellnessPlan({
        phase,
        symptoms,
        recentMoods,
        dayOfCycle,
        isPCODFocused: true
      });
      
      setReport(plan);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse flex space-y-4 flex-col p-8 bg-white/50 rounded-vibrant">
      <div className="h-8 bg-lavender/20 rounded w-1/4"></div>
      <div className="h-4 bg-lavender/20 rounded w-1/2"></div>
      <div className="h-64 bg-lavender/20 rounded"></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-700 italic">Health Report</h2>
          <p className="text-slate-500 mt-2 italic">Insights generated from your digital health signature. 📊</p>
        </div>
        
        {logs.length > 0 && !report && (
          <button 
            onClick={generateAIReport}
            disabled={isGenerating}
            className="bg-serenity-purple text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isGenerating ? 'Analyzing Patterns...' : 'Generate AI Insights'}
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Summary Grid */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-vibrant bg-white">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Log Overview</h3>
            <div className="space-y-4">
              <SummaryItem label="Total Check-ins" value={logs.length} icon={<CheckCircle2 size={16} className="text-green-400" />} />
              <SummaryItem label="Avg Sleep" value={(logs.reduce((acc, l) => acc + (l.sleep || 0), 0) / (logs.length || 1)).toFixed(1) + 'h'} icon={<TrendingUp size={16} className="text-indigo-400" />} />
              <SummaryItem label="Avg Hydration" value={(logs.reduce((acc, l) => acc + (l.water || 0), 0) / (logs.length || 1)).toFixed(1) + 'g'} icon={<TrendingUp size={16} className="text-blue-400" />} />
            </div>
          </div>

          <div className="card-vibrant bg-cura-purple/5 border-lavender/30 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-cura-purple">
              <Sparkles size={20} />
              <h4 className="font-bold uppercase tracking-wider text-[10px]">Hormonal Pattern Analysis</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed italic">
              Our AI analyzes your unique data points—cycle length, symptom clusters, and lifestyle factors—to help you navigate PCOD with clarity. Remember, these insights are a companion to professional medical care.
            </p>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-2">
          {report ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-vibrant bg-white min-h-[500px] border-soft-pink/30 relative"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-soft-pink/10">
                <div className="flex items-center gap-3 text-serenity-purple">
                  <FileText size={24} />
                  <h3 className="text-xl font-serif font-bold italic">EstraVelle Health Insights</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={generateAIReport}
                    disabled={isGenerating}
                    className="p-2 text-slate-400 hover:text-serenity-purple transition-colors disabled:opacity-50"
                    title="Regenerate Report"
                  >
                    {isGenerating ? <RefreshCcw size={20} className="animate-spin" /> : <RefreshCcw size={20} />}
                  </button>
                  <button className="p-2 text-slate-400 hover:text-serenity-purple transition-colors">
                    <Download size={20} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-8">
                {/* Insights Section */}
                <div className="bg-lavender/5 p-6 rounded-3xl border border-lavender/10">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles size={16} className="text-serenity-purple" />
                    AI Narrative & Insights
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic text-sm">
                    {report.insights}
                  </p>
                </div>

                {/* Weekly Focus */}
                <div className="bg-serenity-purple/5 p-6 rounded-3xl border border-serenity-purple/10">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Weekly Path</h4>
                  <p className="text-2xl font-serif font-bold text-serenity-purple italic">{report.weeklyFocus}</p>
                </div>

                {/* Activities List */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Personalized Recommendations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {report.dailyActivities.map((activity, idx) => {
                      const IconComponent = (LucideIcons as any)[activity.icon] || Heart;
                      return (
                        <div key={idx} className="p-5 bg-white border border-soft-pink/10 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                          <div className={cn(
                            "p-3 rounded-xl shrink-0",
                            activity.category === 'Nutrition' && "bg-amber-50 text-amber-500",
                            activity.category === 'Exercise' && "bg-emerald-50 text-emerald-500",
                            activity.category === 'Mindfulness' && "bg-indigo-50 text-indigo-500"
                          )}>
                            <IconComponent size={20} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.category}</span>
                            <h5 className="font-bold text-slate-700 text-sm">{activity.title}</h5>
                            <p className="text-xs text-slate-500 leading-relaxed italic">{activity.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-lavender/5 rounded-3xl border border-lavender/20">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold text-center">
                  Confidential • Digital Signature: {user?.uid.slice(0, 8)}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="card-vibrant bg-white/40 border-dashed border-2 border-soft-pink/40 h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12">
              <FileText size={48} className="text-soft-pink mb-4 opacity-40" />
              <h3 className="text-xl font-serif font-bold text-slate-700 mb-2 italic">No report yet</h3>
              <p className="text-sm text-slate-400 max-w-xs italic">
                {logs.length > 0 
                  ? "Click the button above to have EstraVelle analyze your 30-day patterns."
                  : "You need to log at least one day to generate a report summary."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{label}</span>
      </div>
      <span className="text-sm font-bold text-serenity-purple">{value}</span>
    </div>
  );
}
