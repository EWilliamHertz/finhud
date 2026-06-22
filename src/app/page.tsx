import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Wallet, 
  PiggyBank, 
  ArrowRight,
  Lock,
  Cpu
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-24 py-12 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center text-center space-y-8 py-20">
        <div className="absolute inset-0 bg-neon-cyan/5 blur-[120px] rounded-full -z-10" />
        
        <div className="flex items-center gap-2 px-4 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 mb-4">
          <Cpu size={14} className="text-neon-cyan animate-pulse" />
          <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">System_Protocol_v1.0.4</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-mono font-black tracking-tighter leading-tight">
          COMMAND_YOUR <br />
          <span className="neon-text-cyan">FINANCIAL_HUD</span>
        </h1>
        
        <p className="max-w-2xl text-gray-400 font-mono text-sm md:text-base leading-relaxed">
          The elite financial command center for high-value asset monitoring, 
          real-time debt tracking, and strategic liquidity management.
          Built for the modern operative.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <Link href="/dashboard" className="hud-button px-12 py-4 text-base">
            Access_Terminal
          </Link>
          <Link href="/login" className="px-12 py-4 rounded border border-white/10 hover:border-white/20 transition-all font-mono text-sm uppercase tracking-widest bg-white/5">
            Log_In
          </Link>
        </div>
      </section>

      {/* Tools / Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          icon={ShieldCheck} 
          title="Command_Center" 
          desc="Unified dashboard for Net Worth tracking and mission-critical metrics."
          color="cyan"
        />
        <FeatureCard 
          icon={TrendingUp} 
          title="Asset_Tracker" 
          desc="High-fidelity portfolio monitoring with P/L analytics and activity logs."
          color="emerald"
        />
        <FeatureCard 
          icon={Wallet} 
          title="Debt_Protocols" 
          desc="Strategic debt management with automated payment streams and net positioning."
          color="rose"
        />
        <FeatureCard 
          icon={PiggyBank} 
          title="Liquidity_Vault" 
          desc="Deep reserve monitoring with growth projections and target goal tracking."
          color="amber"
        />
      </section>

      {/* Auth Prompt Section */}
      <section className="hud-panel p-12 text-center space-y-8 bg-gradient-to-b from-transparent to-neon-cyan/[0.02]">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full border border-neon-cyan/30 flex items-center justify-center bg-neon-cyan/5">
            <Lock size={32} className="text-neon-cyan" />
          </div>
        </div>
        <h2 className="text-3xl font-mono font-bold tracking-tighter">SECURE_YOUR_IDENTITY</h2>
        <p className="max-w-md mx-auto text-gray-400 font-mono text-xs uppercase tracking-widest">
          Join the network to begin tracking your assets with military-grade precision. 
          Your data is encrypted and accessible only through your secure neural-link.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/register" className="hud-button">Register_Account</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-neon-cyan animate-pulse-glow rounded-sm" />
          <span className="font-mono font-bold tracking-widest">FIN-HUD</span>
        </div>
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
          © 2026 HATAKE_EU_RESERVED. TERMINAL_AUTHORIZED_PERSONNEL_ONLY.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color }: any) {
  const colors = {
    cyan: "text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5 shadow-neon-cyan/10",
    emerald: "text-neon-emerald border-neon-emerald/20 bg-neon-emerald/5 shadow-neon-emerald/10",
    rose: "text-neon-rose border-neon-rose/20 bg-neon-rose/5 shadow-neon-rose/10",
    amber: "text-neon-amber border-neon-amber/20 bg-neon-amber/5 shadow-neon-amber/10",
  };

  return (
    <div className={`hud-panel p-8 group hover:scale-[1.02] transition-all duration-300 ${colors[color as keyof typeof colors]}`}>
      <div className="mb-6 p-3 rounded-sm border w-fit">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-mono font-bold mb-4 uppercase tracking-tighter">{title}</h3>
      <p className="text-xs font-mono text-gray-500 leading-relaxed uppercase tracking-tighter">
        {desc}
      </p>
      <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
        <span>Initialize</span>
        <ArrowRight size={10} />
      </div>
    </div>
  );
}
