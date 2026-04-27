import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Camera, Mail, MapPin, Calendar, Heart, Shield, Save, CheckCircle2, RefreshCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../lib/firebase';
import { updateUserProfile } from '../services/db';
import { cn } from '../lib/utils';

export default function Profile() {
  const { user, isGuest, updateUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    birthDate: user?.birthDate || '',
    cycleLength: user?.cycleLength?.toString() || '28',
    intentions: user?.intentions || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        birthDate: user.birthDate || '',
        cycleLength: user.cycleLength?.toString() || '28',
        intentions: user.intentions || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user || isGuest) {
      alert("Please sign in with Google to save your profile permanently. ✨");
      return;
    }

    setIsSaving(true);
    try {
      const updates = {
        displayName: formData.displayName,
        birthDate: formData.birthDate,
        cycleLength: parseInt(formData.cycleLength),
        intentions: formData.intentions
      };
      
      await updateUserProfile(user.uid, updates);
      updateUser(updates);
      alert("Profile updated with care! ✨");
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureClick = () => {
    alert("Profile picture editing will be available soon! 📸");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-700 italic">Personal Sanctuary</h2>
          <p className="text-slate-500 mt-2 italic">Your space, your data, your journey. 🌿</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || isGuest}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-accent-brown text-white rounded-2xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
        >
          {isSaving ? (
            <RefreshCcw size={20} className="animate-spin" />
          ) : <Save size={20} />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Avatar and Quick Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="card-vibrant p-10 text-center space-y-6 shadow-2xl">
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-copper/20 to-accent-brown/20 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all" />
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Avatar" 
                  className="w-40 h-40 rounded-[3rem] object-cover border-4 border-card-dark shadow-xl mx-auto relative z-10" 
                />
              ) : (
                <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-card-dark to-brand-dark flex items-center justify-center text-accent-copper border-4 border-border-dark shadow-xl mx-auto relative z-10">
                  <User size={80} />
                </div>
              )}
              <button 
                onClick={handleProfilePictureClick}
                className="absolute -bottom-2 -right-2 p-4 bg-brand-dark text-accent-copper rounded-2xl shadow-xl border border-border-dark hover:scale-110 active:scale-90 transition-all z-20"
              >
                <Camera size={24} />
              </button>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-3xl font-serif font-bold text-slate-800 italic">{user?.displayName || "Sister"}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">{user?.isAnonymous || !user ? "Guest Journey" : "Verified Heart"}</p>
            </div>

            <div className="pt-8 border-t border-slate-100 text-left space-y-5">
              {[
                { icon: Mail, label: user?.email || "Guest User" },
                { icon: MapPin, label: "Celestial Orbit" },
                { icon: Calendar, label: "Started: " + (user?.uid ? "April 2026" : "Today") }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 text-slate-500 font-medium">
                  <div className="p-2.5 bg-slate-50 rounded-xl">
                    <item.icon size={18} className="text-lavender" />
                  </div>
                  <span className="truncate text-sm">{item.label}</span>
                </div>
              ))}
            </div>

            {isGuest && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card-dark p-6 rounded-3xl text-left border border-border-dark shadow-xl"
              >
                <p className="text-[10px] uppercase font-black tracking-widest text-accent-copper mb-2">Temporary Aura</p>
                <p className="text-xs text-slate-400 italic leading-relaxed">Your healing data is currently floating. Sign in to ground it safely.</p>
                <button 
                  onClick={signInWithGoogle}
                  className="w-full mt-4 py-3 bg-accent-copper text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Anchor Your Journey
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Edit Forms with Card Layout */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity Card */}
            <div className="card-soft space-y-6 group hover:bg-card-light transition-colors duration-500">
              <div className="flex items-center gap-3 text-slate-200">
                <div className="p-2 bg-card-dark rounded-xl border border-border-dark">
                  <User size={18} />
                </div>
                <h4 className="font-serif font-bold italic text-lg">My Identity</h4>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="How should we call you?"
                    className="w-full bg-brand-dark border border-border-dark rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-accent-copper focus:ring-1 focus:ring-accent-copper transition-all font-medium text-slate-200"
                  />
                </div>
                <div className="space-y-2 opacity-60">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email (Immutable)</label>
                  <div className="w-full bg-brand-dark/50 border border-border-dark rounded-2xl px-5 py-3.5 text-sm text-slate-400 font-medium cursor-not-allowed italic">
                    {user?.email || "No email linked"}
                  </div>
                </div>
              </div>
            </div>

            {/* Rhythm Card */}
            <div className="card-soft space-y-6 group hover:bg-card-light transition-colors duration-500">
              <div className="flex items-center gap-3 text-slate-200">
                <div className="p-2 bg-card-dark rounded-xl border border-border-dark">
                  <Heart size={18} className="text-red-400" />
                </div>
                <h4 className="font-serif font-bold italic text-lg">Hormonal Rhythm</h4>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Birth Date</label>
                  <input 
                    type="date" 
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full bg-brand-dark border border-border-dark rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-accent-copper focus:ring-1 focus:ring-accent-copper transition-all font-medium text-slate-200 uppercase text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Avg Cycle Length</label>
                  <select 
                    value={formData.cycleLength}
                    onChange={(e) => setFormData({ ...formData, cycleLength: e.target.value })}
                    className="w-full bg-brand-dark border border-border-dark rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-accent-copper focus:ring-1 focus:ring-accent-copper transition-all font-medium text-slate-200"
                  >
                    {[...Array(20)].map((_, i) => {
                      const val = 20 + i;
                      return <option key={val} value={val}>{val} Days {val === 28 ? "(Default)" : ""}</option>
                    })}
                    <option value="irregular">Irregular / PCOD Pattern</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Intentions Card */}
          <div className="card-soft space-y-6 group hover:bg-card-light transition-colors duration-500">
            <div className="flex items-center gap-3 text-slate-200">
              <div className="p-2 bg-card-dark rounded-xl border border-border-dark">
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <h4 className="font-serif font-bold italic text-lg">Healing Intentions</h4>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">My Journey Goals</label>
              <textarea 
                rows={5}
                value={formData.intentions}
                onChange={(e) => setFormData({ ...formData, intentions: e.target.value })}
                placeholder="E.g., I want to balance my energy, manage PCOD symptoms with grace, or simply understand my body's secret language..."
                className="w-full bg-brand-dark border border-border-dark rounded-3xl px-6 py-4 text-sm focus:outline-none focus:border-accent-copper focus:ring-1 focus:ring-accent-copper transition-all placeholder:italic resize-none font-medium leading-loose text-slate-200"
              />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-8 bg-slate-900 rounded-[3rem] border border-slate-800 flex items-start gap-5 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-serenity-purple/10 blur-[80px] group-hover:bg-serenity-purple/20 transition-all" />
            <Shield size={32} className="text-serenity-purple shrink-0" />
            <div className="space-y-1">
              <p className="text-white font-serif font-bold italic text-lg">Your sovereignty is absolute.</p>
              <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
                EstraVelle is built on a foundation of trust. Your data is encrypted and used solely to personalize your experience. We never monetize your health history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
