import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User, signInWithEmailAndPassword, signOut as fbSignOut,
  onAuthStateChanged, AuthError
} from 'firebase/auth';
import { auth, isFirebaseReady } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, isAdmin: false, loading: false, error: '',
  signIn: async () => {}, signOut: async () => {}, clearError: () => {},
});

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseReady);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isFirebaseReady || !auth) { setLoading(false); return; }
    return onAuthStateChanged(auth, u => { setUser(u); setLoading(false); });
  }, []);

  const signIn = async (email: string, password: string) => {
    setError('');
    if (!auth) throw new Error('Firebase not configured');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      const err = e as AuthError;
      const msgs: Record<string, string> = {
        'auth/user-not-found': 'No account with that email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
        'auth/invalid-credential': 'Invalid email or password.',
      };
      setError(msgs[err.code] || 'Sign-in failed. Please try again.');
      throw e;
    }
  };

  const signOut = async () => {
    if (auth) await fbSignOut(auth);
    setUser(null);
  };

  // Admin = the one specific email set in env, OR any logged-in user if env not set
  const isAdmin = !!user && (ADMIN_EMAIL ? user.email === ADMIN_EMAIL : true);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signOut, error, clearError: () => setError('') }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
