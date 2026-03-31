import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, User, Eye, EyeOff } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) => (
  <div className="px-6 md:px-20 py-12 min-h-[85vh] flex items-center justify-center relative overflow-hidden">
    {/* Abstract Tech Background */}
    <div className="absolute inset-0 pointer-events-none opacity-20">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-accent/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[100px]" />
    </div>

    <div className="max-w-md w-full relative z-10 glass p-10 md:p-14 rounded-3xl border border-white/10 shadow-2xl">
      <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 uppercase tracking-[0.3em] font-mono text-[10px]">
        <ArrowLeft className="w-3 h-3" />
        Return to Core
      </Link>

      <div className="mb-10">
        <h1 className="text-4xl font-display uppercase tracking-[-0.05em] mb-2">{title}</h1>
        <p className="text-white/40 font-mono text-[11px] uppercase tracking-widest">{subtitle}</p>
      </div>

      {children}
    </div>
  </div>
);

export const Login = () => {
  const [showPass, setShowPass] = useState(false);

  return (
    <AuthLayout title="Identify" subtitle="Auth.01 // Access Protocol">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 pl-2">Email Designation</label>
          <input 
            type="email" 
            placeholder="OPERATIVE@SYSTEM.CC" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-neon-accent transition-colors font-mono text-sm placeholder:text-white/20 uppercase"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-2">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">Cypher Key</label>
            <a href="#" className="text-[10px] font-mono text-neon-accent hover:text-white transition-colors uppercase tracking-widest">Forgot?</a>
          </div>
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="••••••••" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-neon-accent transition-colors font-mono tracking-widest placeholder:text-white/20"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neon-accent hover:text-white transition-all mt-4">
          Authenticate
        </button>

        <p className="text-center text-white/40 font-mono text-[10px] uppercase tracking-widest mt-8">
          No Access? <Link to="/register" className="text-white hover:text-neon-accent transition-colors">Register Profile</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export const Register = () => {
  const [showPass, setShowPass] = useState(false);

  return (
    <AuthLayout title="Initialize" subtitle="Root.02 // Create Profile">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="flex gap-4">
          <div className="space-y-2 flex-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 pl-2">First Unit</label>
            <input 
              type="text" 
              placeholder="NAME" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-neon-accent transition-colors font-mono text-sm placeholder:text-white/20 uppercase"
              required
            />
          </div>
          <div className="space-y-2 flex-1">
            <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 pl-2">Last Unit</label>
            <input 
              type="text" 
              placeholder="NAME" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-neon-accent transition-colors font-mono text-sm placeholder:text-white/20 uppercase"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 pl-2">Comm. Link (Email)</label>
          <input 
            type="email" 
            placeholder="OPERATIVE@SYSTEM.CC" 
            className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-neon-accent transition-colors font-mono text-sm placeholder:text-white/20 uppercase"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 pl-2">Cypher Key Creation</label>
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"} 
              placeholder="••••••••" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-neon-accent transition-colors font-mono tracking-widest placeholder:text-white/20"
              required
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-neon-accent hover:text-white transition-all mt-4">
          Establish Connection
        </button>

        <p className="text-center text-white/40 font-mono text-[10px] uppercase tracking-widest mt-8">
          Unit Existing? <Link to="/login" className="text-white hover:text-neon-accent transition-colors">Authenticate</Link>
        </p>
      </form>
    </AuthLayout>
  );
};
