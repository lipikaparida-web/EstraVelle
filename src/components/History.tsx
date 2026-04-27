import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLogs } from '../services/db';
import { HealthLog } from '../types';
import { format, parseISO } from 'date-fns';
import { Calendar, Moon, Droplets, Activity, MessageSquare, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function History() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserLogs() {
      if (!user) return;
      try {
        const fetchedLogs = await getLogs(user.uid);
        setLogs(fetchedLogs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl font-serif font-bold text-slate-200 italic">History</h2>
        <p className="text-slate-500 mt-2 italic">A detailed look back at your health journey. 📖</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {logs.length > 0 ? (
          logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-vibrant bg-card-dark flex flex-col md:flex-row md:items-center gap-6 group hover:border-slate-700"
            >
              <div className="flex flex-col items-center justify-center p-4 bg-brand-dark/50 rounded-3xl min-w-[100px] border border-border-dark">
                <span className="text-2xl font-serif font-bold text-accent-copper italic">{format(parseISO(log.date), 'dd')}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{format(parseISO(log.date), 'MMM yyyy')}</span>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-dark border border-border-dark shadow-sm flex items-center justify-center text-red-400">
                    <Droplets size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none">Period</p>
                    <p className="text-sm font-bold text-slate-200 mt-1">{log.periodStart ? 'Day 1' : log.periodEnd ? 'Last Day' : 'None'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-dark border border-border-dark shadow-sm flex items-center justify-center text-indigo-400">
                    <Moon size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none">Sleep</p>
                    <p className="text-sm font-bold text-slate-200 mt-1">{log.sleep} hrs</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-dark border border-border-dark shadow-sm flex items-center justify-center text-blue-400">
                    <Activity size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none">Mood</p>
                    <p className="text-sm font-bold text-slate-200 mt-1">Level {log.mood}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-dark border border-border-dark shadow-sm flex items-center justify-center text-amber-400">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold leading-none">Symptoms</p>
                    <p className="text-sm font-bold text-slate-200 mt-1 truncate max-w-[100px]">
                      {log.symptoms?.length ? log.symptoms.join(', ') : 'None'}
                    </p>
                  </div>
                </div>
              </div>

              {log.notes && (
                <div className="md:border-l border-border-dark md:pl-6 max-w-md">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={12} className="text-slate-400" />
                    <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Notes</span>
                  </div>
                  <p className="text-sm text-slate-500 italic line-clamp-2">"{log.notes}"</p>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center space-y-4">
            <Calendar className="mx-auto text-slate-200" size={64} />
            <p className="text-slate-400 italic">No logs found yet. Start your journey by checking in today! 💜</p>
          </div>
        )}
      </div>
    </div>
  );
}
