"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Receipt, 
  TrendingUp, 
  Wallet, 
  PiggyBank, 
  Settings, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Terminal", href: "/dashboard", icon: LayoutDashboard },
  { name: "Ledger", href: "/transactions", icon: Receipt },
  { name: "Assets", href: "/investments", icon: TrendingUp },
  { name: "Debts", href: "/debts", icon: Wallet },
  { name: "Vault", href: "/savings", icon: PiggyBank },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo / System ID */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 bg-neon-cyan/20 border border-neon-cyan/50 rounded-sm flex items-center justify-center group-hover:bg-neon-cyan/30 transition-all">
            <div className="h-4 w-4 bg-neon-cyan animate-pulse-glow" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono tracking-tighter text-neon-cyan leading-none">SYSTEM</span>
            <span className="text-lg font-mono font-bold tracking-widest leading-none">FIN-HUD.v1</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300",
                  isActive ? "text-neon-cyan" : "text-gray-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon size={16} />
                <span className="text-xs font-mono uppercase tracking-wider">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* System Stats / Settings */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Operative</span>
            <span className="text-xs font-mono text-neon-emerald">ernst@hatake.eu</span>
          </div>
          <button className="h-10 w-10 flex items-center justify-center rounded-sm border border-white/5 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all">
            <Settings size={18} className="text-gray-400 hover:text-neon-cyan transition-colors" />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden h-10 w-10 flex items-center justify-center bg-black/40 border border-white/10 rounded-sm"
        >
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-4 right-4 md:hidden bg-black/90 backdrop-blur-xl border border-neon-cyan/20 p-4 rounded-lg flex flex-col gap-2 shadow-[0_0_30px_rgba(0,243,255,0.1)]"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsExpanded(false)}
                className={cn(
                  "flex items-center justify-between p-3 rounded border transition-all",
                  pathname === item.href 
                    ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan" 
                    : "border-transparent text-gray-400 hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} />
                  <span className="font-mono text-sm uppercase tracking-widest">{item.name}</span>
                </div>
                <ChevronRight size={14} className="opacity-50" />
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
