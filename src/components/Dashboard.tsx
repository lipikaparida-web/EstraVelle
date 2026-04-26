import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { getLogs } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { HealthLog } from '../types';
import { Sparkles, Activity, Moon, Droplets, ArrowUpRight, TrendingUp, Brain, Utensils, Heart, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO, addDays, subDays, isAfter, startOfWeek, differenceInDays, startOfDay } from 'date-fns';
import { cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [cycleLength, setCycleLength] = useState<number | null>(null);
  const [predictedNextPeriod, setPredictedNextPeriod] = useState<Date | null>(null);
  const [predictedOvulation, setPredictedOvulation] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const [currentDay, setCurrentDay] = useState<number | null>(null);

  const startOfThisWeek = startOfWeek(new Date(), { weekStartsOn: 0 });
  const logsThisWeekCount = logs.filter(l => {
    const logDate = parseISO(l.date);
    return isAfter(logDate, subDays(startOfThisWeek, 1)); // Include today
  }).length;
  const weeklyProgress = (Math.min(logsThisWeekCount, 7) / 7) * 100;

  useEffect(() => {
    const fetchLogs = async () => {
      if (user) {
        const data = await getLogs(user.uid);
        const sortedLogs = [...data].sort((a, b) => b.date.localeCompare(a.date));
        setLogs(sortedLogs.reverse());

        // Find most recent period start
        const latestPeriodStart = sortedLogs.find(l => l.periodStart);
        if (latestPeriodStart) {
          const startDate = parseISO(latestPeriodStart.date);
          const diffDays = differenceInDays(startOfDay(new Date()), startOfDay(startDate)) + 1;
          setCurrentDay(diffDays);
        }

        // Basic Cycle Length Logic
        const periodStartDays = data
          .filter(l => l.periodStart)
          .map(l => parseISO(l.date).getTime())
          .sort((a, b) => b - a);

        if (periodStartDays.length >= 2) {
          const diff = (periodStartDays[0] - periodStartDays[1]) / (1000 * 60 * 60 * 24);
          const length = Math.round(diff);
          setCycleLength(length);

          if (latestPeriodStart) {
            const startDate = parseISO(latestPeriodStart.date);
            setPredictedNextPeriod(addDays(startDate, length));
            setPredictedOvulation(addDays(startDate, length - 14));
          }
        } else if (latestPeriodStart) {
          // Standard 28 day prediction if only one period is logged
          const startDate = parseISO(latestPeriodStart.date);
          setPredictedNextPeriod(addDays(startDate, 28));
          setPredictedOvulation(addDays(startDate, 14));
        }
      }
      setLoading(false);
    };
    fetchLogs();
  }, [user]);

  const getPhaseInfo = () => {
    const day = currentDay || 1;
    const length = cycleLength || 28;
    const ovulationDay = Math.max(14, length - 14);

    if (day <= 5) return {
      id: 'menstrual',
      name: t('phases.menstrual'),
      color: 'text-rose-500',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100',
      gradient: 'from-rose-400 to-rose-600',
      icon: <Droplets size={24} />,
      progress: (day / 5) * 100,
      description: "Your period is here. Your body is shedding and resetting.",
      quote: "Rest is a productive act. Honor your body's silence.",
      tips: [
        { type: 'emotional', icon: <Brain size={14} />, title: 'Inner Reflection', content: 'A time for introspection and honoring your inner landscape.' },
        { type: 'physical', icon: <Utensils size={14} />, title: 'Nourishment', content: 'Prioritize warm magnesium-rich foods and iron (spinach, lentils).' },
        { type: 'movement', icon: <Activity size={14} />, title: 'Gentle Care', content: 'Focus on very gentle movement like stretching or slow walks.' }
      ]
    };
    if (day < ovulationDay) return {
      id: 'follicular',
      name: t('phases.follicular'),
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      gradient: 'from-emerald-400 to-emerald-600',
      icon: <Sparkles size={24} />,
      progress: ((day - 5) / (ovulationDay - 5)) * 100,
      description: t('dashboard.phase_description'),
      quote: "New ideas are blooming. Your energy is rising like the sun.",
      tips: [
        { type: 'emotional', icon: <Brain size={14} />, title: 'Confidence', content: 'Your brain is primed for brainstorming and starting new projects.' },
        { type: 'physical', icon: <Utensils size={14} />, title: 'Metabolism', content: 'Focus on fermented foods to support healthy hormone metabolism.' },
        { type: 'movement', icon: <Activity size={14} />, title: 'Energy', content: 'Light cardio and strength training feel particularly good now.' }
      ]
    };
    if (day >= ovulationDay && day <= ovulationDay + 2) return {
      id: 'ovulation',
      name: t('phases.ovulation'),
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100',
      gradient: 'from-amber-400 to-amber-600',
      icon: <Activity size={24} />,
      progress: 100,
      description: "The peak of your cycle. You might feel more social, energetic, and magnetic.",
      quote: "You are glowing. Your magnetism is at its peak.",
      tips: [
        { type: 'emotional', icon: <Brain size={14} />, title: 'Connection', content: 'Great for networking, social events, or difficult conversations.' },
        { type: 'physical', icon: <Utensils size={14} />, title: 'Liver Support', content: 'Support your liver with plenty of cruciferous vegetables.' },
        { type: 'movement', icon: <Activity size={14} />, title: 'Power', content: 'Peak energy window! Test your limits with HIIT or power yoga.' }
      ]
    };
    return {
      id: 'luteal',
      name: t('phases.luteal'),
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100',
      gradient: 'from-indigo-400 to-indigo-600',
      icon: <Moon size={24} />,
      progress: ((day - (ovulationDay + 2)) / (length - (ovulationDay + 2))) * 100,
      description: "Progesterone is high. You're nesting and your body is preparing for rest.",
      quote: "Turn inward. Create a cozy sanctuary for your soul.",
      tips: [
        { type: 'emotional', icon: <Brain size={14} />, title: 'Self-Care', content: 'Practice radical self-compassion and slow down your social calendar.' },
        { type: 'physical', icon: <Utensils size={14} />, title: 'Stability', content: 'Opt for complex carbs to stabilize mood and energy levels.' },
        { type: 'movement', icon: <Activity size={14} />, title: 'Recuperation', content: 'Restorative yoga and long, mindful walks are your best friends.' }
      ]
    };
  };

  const phase = getPhaseInfo();

  const moodScore = { happy: 4, low: 1, anxious: 2, irritated: 2 };

  const filteredLogs = logs.filter(l => {
    const logDate = parseISO(l.date);
    if (timeRange === 'week') return isAfter(logDate, subDays(new Date(), 7));
    if (timeRange === 'month') return isAfter(logDate, subDays(new Date(), 30));
    return true;
  });

  const chartData = filteredLogs.map(l => ({
    date: format(parseISO(l.date), 'MMM d'),
    fullDate: format(parseISO(l.date), 'MMMM d, yyyy'),
    mood: l.mood ? (moodScore[l.mood as keyof typeof moodScore] || 0) : 0,
    moodLabel: l.mood || 'None',
    symptoms: l.symptoms?.join(', ') || 'None',
    sleep: l.sleep || 0,
    water: l.water || 0
  }));

  // Correlation Logic
  const symptomsList = Array.from(new Set(logs.flatMap(l => l.symptoms || [])));

  // Symptom Frequency for BarChart
  const symptomFrequencyData = symptomsList.map(symptom => {
    const count = filteredLogs.filter(l => l.symptoms?.includes(symptom)).length;
    return { symptom, count };
  }).filter(d => d.count > 0).sort((a, b) => b.count - a.count);
  const correlationData = symptomsList.map(symptom => {
    const symptomDays = logs.filter(l => l.symptoms?.includes(symptom));
    const avgSleep = symptomDays.length > 0
      ? symptomDays.reduce((acc, l) => acc + (l.sleep || 0), 0) / symptomDays.length
      : 0;
    const avgWater = symptomDays.length > 0
      ? symptomDays.reduce((acc, l) => acc + (l.water || 0), 0) / symptomDays.length
      : 0;

    return { symptom, avgSleep, avgWater, count: symptomDays.length };
  }).sort((a, b) => b.count - a.count).slice(0, 5);

  const getObservation = () => {
    const fatigue = correlationData.find(d => d.symptom === 'Fatigue');
    if (fatigue && fatigue.avgSleep < 7) {
      return `We noticed fatigue often appears after less than ${fatigue.avgSleep.toFixed(1)} hours of sleep. Want to explore tips for better sleep? 🌙`;
    }
    const bloating = correlationData.find(d => d.symptom === 'Bloating');
    if (bloating && bloating.avgWater < 6) {
      return `Your bloating seems to correlate with lower water intake (${bloating.avgWater.toFixed(1)} glasses). Increasing hydration might help support your digestion. 💧`;
    }
    return "You're doing great! Keep logging to uncover more beautiful insights about your body's rhythm. ✨";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-700 dark:text-slate-200">{t('dashboard.title')}, {user?.displayName?.split(' ')[0]}.</h2>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-6">
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">{t('dashboard.subtitle')} 💜</p>

            {/* Weekly Progress Bar */}
            <div className="flex-1 max-w-[240px] space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span>Weekly Progress</span>
                <span className="text-cura-purple">{logsThisWeekCount}/7 Logs</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${weeklyProgress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-lavender to-cura-purple rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className={cn(
            "px-4 py-2 rounded-2xl flex items-center gap-3 font-medium text-sm border transition-all duration-500",
            phase.bgColor,
            phase.color,
            "border-current/20 shadow-sm"
          )}>
            <div className="opacity-80 scale-75 origin-center">{phase.icon}</div>
            <span className="tracking-wide">{t('dashboard.stage')}: <span className="font-bold">{phase.name}</span></span>
          </div>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Droplets className="text-red-400" />} label="Last Period" value={logs.filter(l => l.periodStart).length > 0 ? format(parseISO(logs.filter(l => l.periodStart).sort((a, b) => b.date.localeCompare(a.date))[0].date), 'MMM d') : 'No data'} />
        <StatCard icon={<Calendar size={18} className="text-cura-purple" />} label={t('dashboard.next_period')} value={predictedNextPeriod ? format(predictedNextPeriod, 'MMM d') : 'Predicting...'} />
        <StatCard icon={<Activity className="text-pink-400" />} label="Avg Cycle" value={cycleLength ? `${cycleLength} ${t('dashboard.days')}` : 'Calculating...'} />
        <StatCard icon={<Sparkles className="text-amber-400" />} label="Ovulation" value={predictedOvulation ? format(predictedOvulation, 'MMM d') : 'Predicting...'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Mood Trends Overlay Card */}
        <div className="lg:col-span-8 card-vibrant dark:bg-slate-900 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-soft-pink/20 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <Activity className="text-lavender" size={20} />
                Symptom & Mood Trends
              </h3>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start">
                {(['week', 'month', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                      timeRange === range
                        ? "bg-white dark:bg-slate-700 text-serenity-purple shadow-sm"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    )}
                  >
                    {range === 'all' ? 'Historical' : `Last ${range === 'week' ? '7 Days' : '30 Days'}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FC8B5D" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FC8B5D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-soft-pink/10 dark:border-slate-700 space-y-2">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{data.fullDate}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-tangerine" />
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Mood: <span className="capitalize text-serenity-purple dark:text-lavender">{data.moodLabel}</span></p>
                            </div>
                            {data.symptoms !== 'None' && (
                              <div className="flex items-start gap-2 max-w-[150px]">
                                <Activity size={12} className="text-lavender mt-0.5 shrink-0" />
                                <p className="text-[10px] italic text-slate-500 leading-tight">Symptoms: {data.symptoms}</p>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                    cursor={{ stroke: '#FC8B5D', strokeWidth: 2, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="mood" stroke="#FC8B5D" strokeWidth={3} fillOpacity={1} fill="url(#colorMood)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold px-4">
              <span>{timeRange === 'week' ? '7-Day View' : timeRange === 'month' ? '30-Day View' : 'Full History'}</span>
              <span>Emotional Resonance</span>
            </div>
          </div>
        </div>

        {/* Symptom Frequency Bar Chart */}
        <div className="lg:col-span-12 card-vibrant bg-white dark:bg-slate-900 shadow-sm border border-soft-pink/20 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h3 className="text-2xl font-serif font-bold text-slate-700 dark:text-slate-200 italic flex items-center gap-2">
                <TrendingUp size={20} className="text-tangerine" />
                Symptom Frequency
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">Most commonly experienced symptoms in this period</p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {symptomFrequencyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={symptomFrequencyData} layout="vertical" margin={{ left: 20, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="symptom"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    width={100}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-xl shadow-lg border border-soft-pink/10 dark:border-slate-700">
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                              {payload[0].payload.symptom}: <span className="text-tangerine">{payload[0].value} times</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={20}>
                    {symptomFrequencyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#FC8B5D', '#9381FF', '#FFB7C5', '#7FBDD2', '#C689C6'][index % 5]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
                <Activity size={48} className="text-slate-300" />
                <p className="text-slate-400 italic">No symptoms logged for this period yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Cycle Visualization */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-vibrant p-1 space-y-1 shadow-xl border border-soft-pink/10 dark:border-slate-800 overflow-hidden h-full flex flex-col">
            <div className={cn(
              "rounded-[1.75rem] p-8 text-white relative overflow-hidden flex-1 flex flex-col justify-between transition-all duration-700 bg-gradient-to-br",
              phase.gradient
            )}>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl animate-pulse"></div>

              <div className="relative">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs uppercase tracking-widest font-bold opacity-70">Cycle Status</h4>
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                    {phase.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-serif font-bold italic tracking-tight">{phase.name}</h3>
                <p className="text-xs opacity-80 mt-1 max-w-[200px] leading-relaxed">{phase.description}</p>
              </div>

              <div className="relative my-8 flex items-end gap-2">
                <div className="text-8xl font-serif font-bold tracking-tighter leading-none">{currentDay || '–'}</div>
                <div className="mb-3 text-sm font-bold opacity-70">Day</div>
              </div>

              <div className="relative space-y-4">
                <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden backdrop-blur-md border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${phase.progress}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  />
                </div>
                <p className="text-sm italic opacity-90 font-medium leading-snug">
                  "{phase.quote}"
                </p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-full justify-between gap-1 mb-8">
                {[
                  { id: 'menstrual', icon: <Droplets size={14} />, color: 'text-rose-500', bgColor: 'bg-rose-50' },
                  { id: 'follicular', icon: <Sparkles size={14} />, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
                  { id: 'ovulation', icon: <Activity size={14} />, color: 'text-amber-500', bgColor: 'bg-amber-50' },
                  { id: 'luteal', icon: <Moon size={14} />, color: 'text-indigo-500', bgColor: 'bg-indigo-50' }
                ].map((p) => (
                  <div
                    key={p.id}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all duration-500 border",
                      phase.id === p.id
                        ? `${p.bgColor} ${p.color} border-${p.id === 'menstrual' ? 'rose' : p.id === 'follicular' ? 'emerald' : p.id === 'ovulation' ? 'amber' : 'indigo'}-200 shadow-sm scale-105 z-10`
                        : "bg-transparent text-slate-300 border-transparent saturate-0 opacity-50"
                    )}
                  >
                    {p.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:block">
                      {p.id}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {phase.tips.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="space-y-1.5 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group/tip hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg transition-transform group-hover/tip:scale-110",
                        tip.type === 'emotional' ? 'bg-blue-100 text-blue-500' :
                          tip.type === 'physical' ? 'bg-rose-100 text-rose-500' :
                            'bg-emerald-100 text-emerald-500'
                      )}>
                        {tip.icon}
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest">
                        {tip.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic pl-11">
                      {tip.content}
                    </p>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/wellness"
                className="flex items-center justify-between w-full p-4 bg-lavender/10 hover:bg-lavender/20 dark:bg-slate-800 dark:hover:bg-slate-700 border border-lavender/20 dark:border-slate-700 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg group-hover:scale-110 transition-transform shadow-sm">
                    <Sparkles size={16} className="text-serenity-purple" />
                  </div>
                  <span className="text-sm font-bold tracking-wide text-slate-700 dark:text-slate-200">View Wellness Rituals</span>
                </div>
                <ArrowUpRight size={18} className="text-slate-400 group-hover:text-serenity-purple group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Caution System */}
      <div className="card-vibrant dark:bg-slate-900/60 dark:border-slate-800/50 bg-white/40 border-none relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-20 h-20 bg-lavender/20 rounded-3xl flex items-center justify-center text-cura-purple shrink-0">
            <Sparkles size={36} />
          </div>
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-lavender/20 px-3 py-1 rounded-full border border-lavender/30">
              <div className="w-2 h-2 rounded-full bg-lavender animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-serenity-purple dark:text-lavender">Gentle Note</span>
            </div>
            <p className="text-xl font-serif text-slate-700 dark:text-slate-200 italic leading-relaxed">
              "{getObservation()}"
            </p>
          </div>
        </div>
      </div>

      {/* Symptom Correlation Analysis */}
      <div className="card-vibrant dark:bg-slate-900 dark:border-slate-800 bg-white shadow-sm border border-soft-pink/30">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-2xl font-serif font-bold text-slate-700 dark:text-slate-200 italic">Symptom Insights</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500">How your lifestyle & physical symptoms connect</p>
          </div>
          <div className="bg-warm-beige/30 dark:bg-slate-800 px-4 py-2 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-serenity-purple dark:text-lavender">
            Last 30 Days
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {correlationData.length > 0 ? (
            correlationData.map((data, i) => (
              <div
                key={data.symptom}
                className="p-5 rounded-3xl bg-warm-beige/10 dark:bg-slate-950/40 border border-transparent hover:border-soft-pink/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{data.symptom}</span>
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-cura-purple shadow-sm">
                    {data.count}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span>Sleep</span>
                      <span className={cn(data.avgSleep < 7 ? "text-red-400" : "text-indigo-400")}>{data.avgSleep.toFixed(1)}h</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400/60 rounded-full" style={{ width: `${Math.min((data.avgSleep / 10) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <span>Water</span>
                      <span className={cn(data.avgWater < 6 ? "text-orange-400" : "text-blue-400")}>{data.avgWater.toFixed(1)}g</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400/60 rounded-full" style={{ width: `${Math.min((data.avgWater / 15) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="lg:col-span-5 py-12 text-center space-y-4">
              <Activity className="mx-auto text-slate-200" size={48} />
              <p className="text-slate-400 italic">Log your symptoms daily to unlock these personal insights. 💜</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="card-vibrant-sm dark:bg-slate-900 dark:border-slate-800 flex flex-col items-center text-center space-y-3 group hover:bg-soft-pink/5 dark:hover:bg-slate-800/80 cursor-default">
      <div className="p-4 bg-warm-beige/40 dark:bg-slate-800 rounded-2xl shadow-inner transition-transform group-hover:scale-110">{icon}</div>
      <div className="space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold">{label}</p>
        <p className="text-xl font-serif font-bold text-slate-700 dark:text-slate-200 italic">{value}</p>
      </div>
    </div>
  );
}