"use client";

import React, { useState } from "react";
import { 
  X, 
  ChevronRight, 
  History, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  CreditCard,
  Target
} from "lucide-react";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import LogDebtTransactionModal from "./LogDebtTransactionModal";

import { deleteDebtLog, deleteDebt } from "@/app/debts/actions";

export default function DebtDetailModal({ debt, isOpen, onClose, logs = [] }: any) {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!debt || !isOpen) return null;

  const handleDeleteLog = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this log entry?")) return;
    await deleteDebtLog(logId);
  };

  const handleDeleteDebt = async () => {
    if (!confirm("Are you sure you want to delete this debt/receivable entirely?")) return;
    setIsDeleting(true);
    const result = await deleteDebt(debt.id);
    setIsDeleting(false);
    if (result.success) onClose();
    else alert(result.error);
  };


  const progress = (1 - (Number(debt.remaining_amount) / Number(debt.total_amount))) * 100;
  const isReceivable = debt.id.startsWith('rcv');

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-hud-panel border border-neon-cyan/30 rounded-lg shadow-[0_0_50px_rgba(0,243,255,0.15)] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn(
                "text-[10px] font-mono px-2 py-0.5 rounded border uppercase tracking-widest",
                isReceivable ? "border-neon-emerald/30 text-neon-emerald bg-neon-emerald/5" : "border-neon-rose/30 text-neon-rose bg-neon-rose/5"
              )}>
                {isReceivable ? "RECEIVABLE_ASSET" : "PAYABLE_LIABILITY"}
              </span>
              <span className="text-[10px] font-mono text-gray-500">ID: {debt.id}</span>
            </div>
            <h2 className="text-3xl font-mono font-black tracking-tighter uppercase">{debt.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded border border-white/5 hover:border-neon-rose/50 hover:bg-neon-rose/5 transition-all group"
          >
            <X size={20} className="text-gray-500 group-hover:text-neon-rose transition-colors" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Financials */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 border border-white/5 rounded">
                <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Total_Value</p>
                <p className="text-xl font-mono font-bold">{formatCurrency(debt.total_amount)}</p>
              </div>
              <div className="p-4 bg-black/40 border border-white/5 rounded">
                <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Remaining</p>
                <p className={cn(
                  "text-xl font-mono font-bold",
                  isReceivable ? "text-neon-emerald" : "text-neon-rose"
                )}>{formatCurrency(debt.remaining_amount)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-gray-400 uppercase">Settlement_Progress</span>
                <span className="text-xs font-mono font-bold text-neon-cyan">{progress.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-1000",
                    isReceivable ? "bg-neon-emerald shadow-neon-emerald/50" : "bg-neon-rose shadow-neon-rose/50"
                  )} 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>

            <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded space-y-4">
              <div className="flex items-center gap-2 text-neon-cyan">
                <Target size={16} />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-white">System_Intelligence</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono uppercase">
                  <span className="text-gray-500">Interest_Rate</span>
                  <span className="text-white">{debt.interest_rate}% APR</span>
                </div>
                <div className="flex justify-between text-[10px] font-mono uppercase">
                  <span className="text-gray-500">Scheduled_Payment</span>
                  <span className="text-white">{formatCurrency(debt.monthly_payment)}/mo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Log Feed */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <History size={16} className="text-neon-cyan" />
              <h3 className="font-mono text-[10px] uppercase tracking-[0.2em]">Transaction_History</h3>
            </div>
            
            <div className="hud-panel p-1 max-h-[300px] overflow-y-auto border-white/5">
              <div className="divide-y divide-white/5">
                {logs.length > 0 ? (
                  logs.map((log: any) => (
                    <div key={log.id} className="p-3 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={cn(
                          "text-[9px] font-mono px-1.5 py-0.5 rounded uppercase tracking-tighter",
                          log.action_type === 'payment' ? "bg-neon-emerald/10 text-neon-emerald" : "bg-neon-rose/10 text-neon-rose"
                        )}>
                          {log.action_type === 'payment' ? (isReceivable ? 'collection' : 'payment') : (isReceivable ? 'lent_more' : 'borrowed_more')}
                        </span>
                        <span className="text-[9px] font-mono text-gray-600">{formatDate(log.date)}</span>
                      </div>
                      <div className="text-[10px] font-mono text-white leading-tight">{log.description || "Manual override logged."}</div>
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={() => handleDeleteLog(log.id)}
                          className="text-[9px] text-neon-rose hover:text-white transition-colors"
                        >Delete</button>
                        <div className={cn(
                          "text-xs font-mono font-bold text-right",
                          log.action_type === 'payment' ? "text-neon-emerald" : "text-neon-rose"
                        )}>
                          {log.action_type === 'payment' ? '-' : '+'}{formatCurrency(log.amount)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500 font-mono text-[10px] uppercase">No events logged in system.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-6 bg-white/[0.02] border-t border-white/10 flex justify-between gap-3">
          <button 
            onClick={handleDeleteDebt}
            disabled={isDeleting}
            className="px-4 py-2 border border-neon-rose/30 text-neon-rose hover:bg-neon-rose/10 text-[10px] font-mono uppercase rounded transition-all"
          >
            {isDeleting ? "Deleting..." : "Delete_Protocol"}
          </button>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-white/10 hover:bg-white/5 text-[10px] font-mono uppercase rounded transition-all">Export_Report</button>
            <button 
              onClick={() => setIsLogModalOpen(true)}
              className="hud-button py-2 px-6"
            >
              Log_Transaction
            </button>
          </div>
        </div>
      </motion.div>
      </div>

      <LogDebtTransactionModal 
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        debt={debt}
      />
    </>
  );
}
