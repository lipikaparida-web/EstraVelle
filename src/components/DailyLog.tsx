import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Check, Droplets, Moon, Coffee, Heart, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { saveLog, getLogs } from '../services/db';
import { HealthLog, Mood } from '../types';
import { cn } from '../lib/utils';

const SYMPTOMS = ['Acne', 'Bloating', 'Fatigue', 'Cravings', 'Cramps', 'Headache', 'Mood Swings'];
const MOODS: { type: Mood; emoji: string; label: string; color: string }[] = [
  { type: 'happy', emoji: '😊', label: 'Happy', color: 'bg-green-100 text-green-600' },
  { type: 'low', emoji: '😔', label: 'Low', color: 'bg-blue-100 text-blue-600' },
  { type: 'anxious', emoji: '😰', label: 'Anxious', color: 'bg-purple-100 text-purple-600' },
  { type: 'irritated', emoji: '😤', label: 'Irritated', color: 'bg-red-100 text-red-600' },
];

export default function DailyLog() {
  const { user, isGuest } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [isLogging, setIsLogging] = useState(false);

  // Form State
  const [mood, setMood] = useState<Mood | undefined>();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [sleep, setSleep] = useState(8);
  const [water, setWater] = useState(8);
  const [periodStart, setPeriodStart] = useState(false);
  const [periodEnd, setPeriodEnd] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    if (user) {
      const data = await getLogs(user.uid);
      setLogs(data);
    }
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const selectedLog = logs.find(l => isSameDay(parseDate(l.date), selectedDate));

  function parseDate(d: string) {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day);
  }

  const handleSave = async () => {
    if (!user) return;
    if (isGuest) {
      alert("Guest Mode: Your logs are for testing only and will not be saved permanently. 💜");
      return;
    }
    const dateStr = format(selectedDate, 'yyyy-MM-dd');

    // 1. Keep the original UI save intact so the visual Calendar works perfectly
    const logData: any = {
      date: dateStr,
      symptoms: selectedSymptoms,
      sleep,
      water,
      periodStart,
      periodEnd
    };
    if (mood) logData.mood = mood;
    await saveLog(user.uid, logData);

    // 2. 🧠 THE ML BRIDGE: Send data to your Python Intelligence Engine
    const mlPayload = {
      uid: user.uid,
      mood: mood || "Neutral",
      symptoms: selectedSymptoms,
      flow: periodStart ? "Medium" : "None", // Defaulting flow based on start
      is_start: periodStart,
      // Sneaking the extra UI data into the notes field for the backend to store!
      notes: `Sleep: ${sleep}h, Water: ${water} glasses`
    };

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/api/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mlPayload)
      });

      const mlResult = await response.json();
      console.log("🧠 ML Prediction Status:", mlResult);
    } catch (error) {
      console.error("ML Backend is currently offline:", error);
    }

    fetchLogs();
    setIsLogging(false);
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]
    );
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-serif font-bold text-cura-purple italic">Daily Log</h2>
        <p className="text-gray-500 mt-1">Check in with yourself, {user?.displayName?.split(' ')[0]}.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Side */}
        <div className="lg:col-span-2 card-vibrant">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif italic text-slate-700">{format(currentMonth, 'MMMM yyyy')}</h3>
            <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-soft-pink/20 rounded-full transition-colors"><ChevronLeft size={20} /></button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-soft-pink/20 rounded-full transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={`${d}-${i}`} className="text-center text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">{d}</div>
            ))}
            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
            {days.map(day => {
              const log = logs.find(l => isSameDay(parseDate(l.date), day));
              const isSelected = isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toString()}
                  onClick={() => {
                    setSelectedDate(day);
                    if (log) {
                      setMood(log.mood);
                      setSelectedSymptoms(log.symptoms);
                      setSleep(log.sleep || 8);
                      setWater(log.water || 8);
                      setPeriodStart(log.periodStart || false);
                      setPeriodEnd(log.periodEnd || false);
                    } else {
                      setMood(undefined);
                      setSelectedSymptoms([]);
                      setSleep(8);
                      setWater(8);
                      setPeriodStart(false);
                      setPeriodEnd(false);
                    }
                  }}
                  className={cn(
                    "aspect-square flex flex-col items-center justify-center rounded-2xl relative transition-all duration-300",
                    isSelected ? "bg-cura-purple text-white shadow-lg scale-110 z-10" : "hover:bg-white/60",
                    log ? (isSelected ? "" : "bg-lavender/20 text-cura-purple") : "text-gray-600"
                  )}
                >
                  <span className="text-sm font-medium">{format(day, 'd')}</span>
                  {log && !isSelected && (
                    <div className="absolute bottom-1.5 flex gap-0.5">
                      {log.periodStart && <div className="w-1 h-1 bg-red-400 rounded-full" />}
                      {log.mood && <div className="w-1 h-1 bg-cura-purple rounded-full opacity-50" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Side */}
        <div className="space-y-6">
          <div className="card-vibrant bg-gradient-to-br from-white to-soft-pink/10">
            <h3 className="text-2xl font-serif italic text-slate-800 mb-2">{format(selectedDate, 'MMM d, yyyy')}</h3>
            <p className="text-sm text-slate-400 mb-8 font-medium italic">How is your energy today?</p>

            <div className="space-y-8">
              {/* Mood Pick */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 block">Current Mood</label>
                <div className="grid grid-cols-4 gap-3">
                  {MOODS.map(m => (
                    <button
                      key={m.type}
                      onClick={() => setMood(m.type)}
                      className={cn(
                        "p-4 rounded-3xl flex flex-col items-center border-2 transition-all relative overflow-hidden group",
                        mood === m.type
                          ? cn("border-cura-purple scale-105 shadow-lg shadow-purple-100", m.color.split(' ')[0])
                          : "border-transparent bg-white/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:bg-white/80"
                      )}
                    >
                      <span className="text-3xl mb-2 transition-transform group-hover:scale-110 group-active:scale-90">{m.emoji}</span>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest transition-colors",
                        mood === m.type ? m.color.split(' ')[1] : "text-gray-400"
                      )}>{m.label}</span>

                      {mood === m.type && (
                        <motion.div
                          layoutId="active-mood-indicator"
                          className="absolute bottom-1 w-1 h-1 rounded-full bg-cura-purple"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <label className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4 block">Physical Symptoms</label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map(s => (
                    <button
                      key={s}
                      onClick={() => toggleSymptom(s)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        selectedSymptoms.includes(s)
                          ? "bg-cura-purple text-white shadow-md shadow-purple-100"
                          : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-100"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                      <Moon size={14} /> Sleep Hours
                    </label>
                    <span className="text-cura-purple font-bold font-serif">{sleep}h</span>
                  </div>
                  <input
                    type="range" min="0" max="15" value={sleep}
                    onChange={(e) => setSleep(parseInt(e.target.value))}
                    className="w-full accent-cura-purple h-2 bg-white rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                      <Droplets size={14} /> Water Intake
                    </label>
                    <span className="text-cura-purple font-bold font-serif">{water} glasses</span>
                  </div>
                  <input
                    type="range" min="0" max="20" value={water}
                    onChange={(e) => setWater(parseInt(e.target.value))}
                    className="w-full accent-cura-purple h-2 bg-white rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={handleSave}
                className="w-full bg-cura-purple text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Check size={20} />
                Save Log
              </button>
            </div>
          </div>

          <div className="card-soft p-6 flex items-center gap-4 border-l-4 border-red-300">
            <Droplets className="text-red-400" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-700">Period Tracking</h4>
              <p className="text-xs text-gray-500">Track your bleeding days for accuracy.</p>
            </div>
            <button
              onClick={() => setPeriodStart(!periodStart)}
              className={cn(
                "p-2 rounded-xl transition-all",
                periodStart ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-400"
              )}
            >
              <Droplets size={18} fill={periodStart ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}