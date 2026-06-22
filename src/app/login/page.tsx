"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, User, Cpu, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("ernst@hatake.eu");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in zoom-in-95 duration-500">
      <div className="hud-panel p-8 w-full max-w-md space-y-8 bg-black/60">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-12 w-12 rounded border border-neon-cyan/50 flex items-center justify-center bg-neon-cyan/5">
            <Cpu size={24} className="text-neon-cyan" />
          </div>
          <h2 className="text-2xl font-mono font-bold tracking-tighter uppercase">Authorized_Access_Only</h2>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Identify_Yourself_Operative</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Secure_Email</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="hud-input w-full pl-10"
                placeholder="USER@DOMAIN.COM"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Cipher_Key</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="hud-input w-full pl-10"
                placeholder="********"
              />
            </div>
          </div>

          <button 
            type="button"
            className="hud-button w-full py-3 flex items-center justify-center gap-2 group"
          >
            <span>Initialize_Session</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-4 flex flex-col items-center gap-2">
          <Link href="/register" className="text-[10px] font-mono text-gray-500 hover:text-neon-cyan transition-colors uppercase">
            New_Operative?_Request_Access
          </Link>
          <Link href="/" className="text-[10px] font-mono text-gray-500 hover:text-white transition-colors uppercase">
            Return_to_Command_Center
          </Link>
        </div>
      </div>
      
      {/* Decorative corners */}
      <div className="fixed top-1/4 left-1/4 h-2 w-2 border-t border-l border-neon-cyan/30" />
      <div className="fixed top-1/4 right-1/4 h-2 w-2 border-t border-r border-neon-cyan/30" />
      <div className="fixed bottom-1/4 left-1/4 h-2 w-2 border-b border-l border-neon-cyan/30" />
      <div className="fixed bottom-1/4 right-1/4 h-2 w-2 border-b border-r border-neon-cyan/30" />
    </div>
  );
}
