import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle as firebaseSignInWithGoogle, 
  signInGuest as firebaseSignInGuest,
  signUpWithEmail as firebaseSignUpWithEmail,
  signInEmail as firebaseSignInEmail,
  resetPassword as firebaseResetPassword
} from '../lib/firebase';
import { getUserProfile, createUserProfile } from '../services/db';

interface AuthUser {
  uid: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  isAnonymous?: boolean;
  birthDate?: string;
  cycleLength?: number;
  intentions?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        // Authenticated via Firebase (Anonymous or Google)
        let profile = await getUserProfile(u.uid);
        if (!profile) {
          profile = {
            displayName: u.displayName || 'Friend',
            photoURL: u.photoURL || undefined,
            joinedAt: new Date().toISOString()
          };
          await createUserProfile(u.uid, profile);
        }
        
        setUser({
          uid: u.uid,
          displayName: profile.displayName || u.displayName || 'Friend',
          email: u.email || undefined,
          photoURL: profile.photoURL || u.photoURL || undefined,
          isAnonymous: u.isAnonymous,
          birthDate: profile.birthDate,
          cycleLength: profile.cycleLength,
          intentions: profile.intentions
        });
        setIsGuest(u.isAnonymous);
      } else {
        // Not authenticated via Firebase
        // Check local storage for local guest session
        const localGuest = localStorage.getItem('cura_guest_session');
        if (localGuest) {
          setUser(JSON.parse(localGuest));
          setIsGuest(true);
        } else {
          setUser(null);
          setIsGuest(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      localStorage.removeItem('cura_guest_session');
      await firebaseSignInWithGoogle();
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      localStorage.removeItem('cura_guest_session');
      await firebaseSignInEmail(email, pass);
    } catch (error) {
      console.error('Email Sign In Error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
      localStorage.removeItem('cura_guest_session');
      await firebaseSignUpWithEmail(email, pass);
    } catch (error) {
      console.error('Email Sign Up Error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await firebaseResetPassword(email);
    } catch (error) {
      console.error('Password Reset Error:', error);
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      const result = await firebaseSignInGuest();
      if (!result) {
        // Fallback to local guest if Firebase Anonymous is disabled
        const guestUser = {
          uid: 'guest_' + Math.random().toString(36).substr(2, 9),
          displayName: 'Guest Sister',
          isAnonymous: true
        };
        localStorage.setItem('cura_guest_session', JSON.stringify(guestUser));
        setUser(guestUser);
        setIsGuest(true);
      }
    } catch (error) {
      console.error('Guest Sign In Error:', error);
    }
  };

  const logout = async () => {
    localStorage.removeItem('cura_guest_session');
    await signOut(auth);
    setUser(null);
    setIsGuest(false);
  };

  const updateUser = (data: Partial<AuthUser>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isGuest, 
      signInWithGoogle, 
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signInAsGuest, 
      updateUser, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
