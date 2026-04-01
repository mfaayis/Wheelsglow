import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, X } from "lucide-react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, isFirebaseReady } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = (import.meta as any).env?.VITE_ADMIN_EMAIL || "fayismuhammed001@gmail.com";
const googleProvider = new GoogleAuthProvider();

// ── Google "G" SVG logo
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export const Login = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectAfterLogin = (userEmail: string) => {
    if (userEmail === ADMIN_EMAIL) {
      navigate("/admin");
    } else {
      navigate("/account");
    }
  };

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      redirectAfterLogin(user.email || "");
    }
  }, [user, authLoading, navigate]);

  // Handle redirect result (for when popup was blocked)
  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth).then(result => {
      if (result?.user) {
        if (db) {
          setDoc(doc(db, "users", result.user.uid), {
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }
        redirectAfterLogin(result.user.email || "");
      }
    }).catch(() => {});
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseReady || !auth) return setError("Firebase not configured.");
    setLoading(true);
    setError("");
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      redirectAfterLogin(result.user.email || "");
    } catch (err: any) {
      const msgs: Record<string, string> = {
        "auth/invalid-credential": "Wrong email or password.",
        "auth/user-not-found":     "No account with that email.",
        "auth/wrong-password":     "Incorrect password.",
        "auth/too-many-requests":  "Too many attempts. Try again later.",
        "auth/invalid-email":      "Invalid email address.",
      };
      setError(msgs[err.code] || "Sign-in failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseReady || !auth) return setError("Firebase not configured.");
    setGoogleLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Non-blocking Firestore write — don't let permissions error block login
      if (db) {
        setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          updatedAt: serverTimestamp(),
        }, { merge: true }).catch(() => {}); // silent fail
      }
      redirectAfterLogin(user.email || "");
    } catch (err: any) {
      if (err.code === "auth/popup-blocked" || err.code === "auth/cancelled-popup-request") {
        try { await signInWithRedirect(auth, googleProvider); } catch { setError("Google sign-in failed."); }
      } else if (err.code !== "auth/popup-closed-by-user") {
        console.error("Google auth error:", err.code, err.message);
        setError("Google sign-in failed. Please try again.");
      }
    } finally { setGoogleLoading(false); }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FF003D 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00BFFF 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10">

        <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors mb-10 font-mono text-[10px] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3" /> Back to Store
        </Link>

        <div className="glass rounded-3xl p-10 border border-white/8">
          <div className="mb-8">
            <h1 className="text-4xl font-display tracking-tight mb-1.5">Welcome back</h1>
            <p className="text-white/35 text-sm">Sign in to your WheelsGlow account</p>
          </div>

          {/* Google Sign-In */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGoogleLogin} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium mb-6 disabled:opacity-50">
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </motion.button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/25 text-[10px] font-mono uppercase tracking-widest">or email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Email</label>
              <input type="email" required value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors placeholder:text-white/20" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-white/30">Password</label>
                <button type="button" className="text-[10px] font-mono uppercase tracking-widest text-neon-accent hover:text-white transition-colors">Forgot?</button>
              </div>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3.5 pr-12 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors placeholder:text-white/20" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-3 rounded-lg bg-neon-accent/10 border border-neon-accent/25 text-neon-accent text-xs font-mono flex items-center gap-2">
                  <X className="w-3.5 h-3.5 flex-shrink-0" />{error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-neon-accent hover:text-white transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</> : "Sign In"}
            </motion.button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-white hover:text-neon-accent transition-colors font-semibold">Create one →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export const Register = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (user.email === ADMIN_EMAIL) {
        navigate("/admin");
      } else {
        navigate("/account");
      }
    }
  }, [user, authLoading, navigate]);

  const saveUserToFirestore = (uid: string, userData: any) => {
    if (!db) return;
    setDoc(doc(db, "users", uid), {
      ...userData,
      createdAt: serverTimestamp(),
    }, { merge: true }).catch(() => {}); // non-blocking
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseReady || !auth) return setError("Firebase not configured.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName: name });
      saveUserToFirestore(result.user.uid, { name, email, photoURL: null });
      navigate("/account");
    } catch (err: any) {
      const msgs: Record<string, string> = {
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/invalid-email":        "Invalid email address.",
        "auth/weak-password":        "Password should be at least 6 characters.",
      };
      setError(msgs[err.code] || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleGoogleRegister = async () => {
    if (!isFirebaseReady || !auth) return setError("Firebase not configured.");
    setGoogleLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      saveUserToFirestore(user.uid, { name: user.displayName, email: user.email, photoURL: user.photoURL });
      navigate("/account");
    } catch (err: any) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError("Google sign-up failed. Please try again.");
      }
    } finally { setGoogleLoading(false); }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FF003D 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10">

        <Link to="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors mb-10 font-mono text-[10px] uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3" /> Back to Store
        </Link>

        <div className="glass rounded-3xl p-10 border border-white/8">
          <div className="mb-8">
            <h1 className="text-4xl font-display tracking-tight mb-1.5">Create account</h1>
            <p className="text-white/35 text-sm">Join WheelsGlow and track your orders</p>
          </div>

          {/* Google Sign-Up */}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleGoogleRegister} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all text-sm font-medium mb-6 disabled:opacity-50">
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon />}
            Sign up with Google
          </motion.button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/25 text-[10px] font-mono uppercase tracking-widest">or email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Full Name</label>
              <input type="text" required value={name} onChange={e => { setName(e.target.value); setError(""); }}
                placeholder="Arjun Sharma"
                className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors placeholder:text-white/20" />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Email</label>
              <input type="email" required value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors placeholder:text-white/20" />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/30 block mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Min. 6 characters"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3.5 pr-12 rounded-xl text-sm focus:outline-none focus:border-neon-accent/60 transition-colors placeholder:text-white/20" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-3 rounded-lg bg-neon-accent/10 border border-neon-accent/25 text-neon-accent text-xs font-mono flex items-center gap-2">
                  <X className="w-3.5 h-3.5 flex-shrink-0" />{error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-neon-accent hover:text-white transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account…</> : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center text-white/30 text-xs mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:text-neon-accent transition-colors font-semibold">Sign in →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
