/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import DailyLog from './components/DailyLog';
import LearningHub from './components/LearningHub';
import Community from './components/Community';
import AIChatbot from './components/AIChatbot';
import HealthReport from './components/HealthReport';
import History from './components/History';
import Appointments from './components/Appointments';
import Profile from './components/Profile';
import Settings from './components/Settings';
import WellnessPlan from './components/WellnessPlan';
import { Heart, Sparkles, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './components/Logo';

import Landing from './components/Landing';

export default function App() {
  const { 
    user, 
    loading, 
    signInWithGoogle, 
    signInAsGuest, 
    signInWithEmail, 
    signUpWithEmail, 
    resetPassword 
  } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-warm-beige">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Logo size={80} />
        </motion.div>
        <p className="mt-4 text-purple-600 font-serif italic tracking-wide">EstraVelle is preparing your space...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Landing 
        onGoogleSignIn={signInWithGoogle} 
        onGuestSignIn={signInAsGuest} 
        onEmailSignIn={signInWithEmail}
        onEmailSignUp={signUpWithEmail}
        onPasswordReset={resetPassword}
      />
    );
  }

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/logs" element={<DailyLog />} />
          <Route path="/hub" element={<LearningHub />} />
          <Route path="/community" element={<Community />} />
          <Route path="/assistant" element={<AIChatbot />} />
          <Route path="/report" element={<HealthReport />} />
          <Route path="/history" element={<History />} />
          <Route path="/consult" element={<Appointments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/wellness" element={<WellnessPlan />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
