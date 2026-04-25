import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, User as UserIcon, Shield, Cloud, Sparkle, Mail, Lock, ArrowRight, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import Logo from './Logo';

interface LandingProps {
  onGoogleSignIn: () => void;
  onGuestSignIn: () => void;
  onEmailSignIn: (email: string, pass: string) => Promise<void>;
  onEmailSignUp: (email: string, pass: string) => Promise<void>;
  onPasswordReset: (email: string) => Promise<void>;
}

type AuthMode = 'initial' | 'signin' | 'signup' | 'forgot';

export default function Landing({ onGoogleSignIn, onGuestSignIn, onEmailSignIn, onEmailSignUp, onPasswordReset }: LandingProps) {
  const [mode, setMode] = useState<AuthMode>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await onEmailSignIn(email, password);
      } else if (mode === 'signup') {
        await onEmailSignUp(email, password);
      } else if (mode === 'forgot') {
        await onPasswordReset(email);
        setSuccess('Password reset link sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FDF8F5] relative overflow-hidden p-6">
      {/* Background Decorative Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-soft-pink rounded-full blur-[100px]"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [90, 0, 90],
          opacity: [0.1, 0.2, 0.1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-lavender rounded-full blur-[100px]"
      />

      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] right-[15%] text-soft-pink/30 hidden md:block"
      >
        <Logo size={80} className="grayscale opacity-30" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[20%] left-[10%] text-lavender/40 hidden md:block"
      >
        <Sparkles size={40} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full text-center z-10 space-y-12"
      >
        {/* Dynamic Intro */}
        <div className="space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-soft-pink/20 flex items-center justify-center mx-auto mb-8 border border-white"
          >
            <Logo size={60} />
          </motion.div>

          <div className="space-y-3">
            <motion.h1 
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-7xl md:text-8xl font-serif font-bold text-cura-purple italic tracking-tighter"
            >
              EstraVelle
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-lg md:text-xl text-slate-600 font-medium tracking-wide max-w-md mx-auto leading-relaxed"
            >
              A gentle space to track your rhythms, understand your body, and <span className="text-serenity-purple font-bold italic underline decoration-soft-pink/30 decoration-4 underline-offset-4">bloom with confidence.</span>
            </motion.p>
          </div>
        </div>

        {/* Action Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white/60 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-2 border-white space-y-10 relative group min-h-[400px] flex flex-col justify-center"
        >
          <AnimatePresence mode="wait">
            {mode === 'initial' ? (
              <motion.div
                key="initial"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif text-slate-800 italic font-bold">Welcome back, sister.</h2>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Your journey toward hormonal harmony begins with a single step of mindfulness.</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={onGoogleSignIn}
                    className="w-full bg-cura-purple text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-lavender/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group"
                  >
                    <div className="bg-white rounded-full p-1 group-hover:rotate-12 transition-transform">
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/action/google.svg" className="w-5 h-5" alt="Google" />
                    </div>
                    Continue with Google
                  </button>

                  <button 
                    onClick={() => toggleMode('signin')}
                    className="w-full bg-white text-slate-700 border-2 border-lavender/20 py-5 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
                  >
                    <Mail size={20} className="text-lavender" />
                    Sign in with Email
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
                    <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-bold text-slate-300">
                      <span className="bg-white/60 px-4">Or explore anonymously</span>
                    </div>
                  </div>

                  <button 
                    onClick={onGuestSignIn}
                    className="w-full bg-slate-50 text-slate-500 py-5 rounded-2xl font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-3"
                  >
                    <UserIcon size={20} />
                    Enter Guest Mode
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <button 
                    onClick={() => toggleMode('initial')}
                    className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <h3 className="text-2xl font-serif text-slate-800 italic font-bold">
                    {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-slate-50 border-2 border-slate-50 focus:border-lavender/30 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-slate-700"
                      />
                    </div>
                  </div>

                  {mode !== 'forgot' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-50 border-2 border-slate-50 focus:border-lavender/30 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-slate-700"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-50 text-red-500 rounded-xl text-xs font-medium flex items-center gap-2"
                    >
                      <AlertCircle size={14} />
                      {error}
                    </motion.div>
                  )}

                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-green-50 text-green-600 rounded-xl text-xs font-medium flex items-center gap-2"
                    >
                      <Sparkles size={14} />
                      {success}
                    </motion.div>
                  )}

                  <button 
                    disabled={loading}
                    className="w-full bg-cura-purple text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-lavender/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {loading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>
                        {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-4 flex flex-col items-center gap-2">
                  {mode === 'signin' ? (
                    <>
                      <button onClick={() => toggleMode('forgot')} className="text-xs text-slate-400 hover:text-lavender font-bold">Forgot your password?</button>
                      <p className="text-xs text-slate-400">
                        Don't have an account? {' '}
                        <button onClick={() => toggleMode('signup')} className="text-lavender font-bold hover:underline">Sign up</button>
                      </p>
                    </>
                  ) : mode === 'signup' ? (
                    <p className="text-xs text-slate-400">
                      Already have an account? {' '}
                      <button onClick={() => toggleMode('signin')} className="text-lavender font-bold hover:underline">Sign in</button>
                    </p>
                  ) : (
                    <button onClick={() => toggleMode('signin')} className="text-xs text-slate-400 hover:text-lavender font-bold underline">Back to Sign In</button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-soft-pink/10 rounded-2xl text-soft-pink">
                <Shield size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Private</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-lavender/20 rounded-2xl text-serenity-purple">
                <Cloud size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Synced</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-amber-50 rounded-2xl text-amber-500">
                <Sparkle size={20} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Expert</span>
            </div>
          </div>
        </motion.div>

        {/* Footer dynamic text */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 2 }}
          className="text-[11px] text-slate-400 italic font-medium"
        >
          Designed for the sacred rhythm of womanhood. 💜
        </motion.p>
      </motion.div>
    </div>
  );
}
