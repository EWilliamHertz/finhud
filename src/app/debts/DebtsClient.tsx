"use client";

import React, { useState } from "react";
import { db } from "@/lib/db";
import { formatCurrency, cn, formatDate } from "@/lib/utils";
import { 
  Wallet, 
  HandCoins, 
  ArrowRightLeft, 
  History, 
  Plus, 
  AlertCircle,
  CreditCard,
  Search,
  Filter
} from "lucide-react";
import { deleteDebtLog } from "@/app/debts/actions";
import DebtDetailModal from "@/components/DebtDetailModal";
import NewDebtModal from "@/components/NewDebtModal";

export default function DebtsPage({
  payables,
  receivables,
  recentLogs,
  stats
}: any) {
  const [selectedDebt, setSelectedDebt] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewDebtModalOpen, setIsNewDebtModalOpen] = useState(false);
  const [newDebtType, setNewDebtType] = useState<'liability' | 'receivable' | null>(null);

  const handleDeleteLog = async (e: React.MouseEvent, logId: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this log entry?")) return;
    await deleteDebtLog(logId);
  };

  const handleDebtClick = (debt: any) => {
    setSelectedDebt(debt);
    setIsModalOpen(true);
  };

  const handleNewDebtClick = (type: 'liability' | 'receivable') => {
    setNewDebtType(type);
    setIsNewDebtModalOpen(true);
  };

  const getFilteredLogs = (debtId: string) => {
    return recentLogs.filter((log: any) => log.debt_id === debtId);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xs font-mono text-neon-cyan uppercase tracking-[0.3em] mb-1">Credit & Obligations</h2>
          <h1 className="text-4xl font-mono font-black tracking-tighter">DEBT_PROTOCOLS</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleNewDebtClick('liability')}
            className="hud-button flex items-center gap-2 border-neon-rose/30 text-neon-rose hover:bg-neon-rose/10"
          >
            <Plus size={16} />
            <span>New_Liability</span>
          </button>
          <button 
            onClick={() => handleNewDebtClick('receivable')}
            className="hud-button flex items-center gap-2 border-neon-emerald/30 text-neon-emerald hover:bg-neon-emerald/10"
          >
            <Plus size={16} />
            <span>New_Receivable</span>
          </button>
        </div>
      </div>

      {/* Net Debt Overview */}
      <div className="hud-panel p-8 bg-gradient-to-br from-black to-hud-panel border-neon-cyan/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-2">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Aggregate Net Position</p>
            <p className={cn(
              "text-4xl font-mono font-black tracking-tighter",
              stats.netDebt >= 0 ? "text-neon-emerald" : "text-neon-rose"
            )}>
              {stats.netDebt > 0 ? '+' : ''}{formatCurrency(stats.netDebt)}
            </p>
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className={stats.netDebt >= 0 ? "text-neon-emerald" : "text-neon-rose"} />
              <span className="text-[10px] font-mono uppercase text-gray-400">
                {stats.netDebt >= 0 ? "Surplus Credit" : "Outstanding Liabilities"}
              </span>
            </div>
          </div>
          
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 border border-white/5 rounded">
              <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Total Payables (L)</p>
              <p className="text-xl font-mono font-bold text-neon-rose">{formatCurrency(stats.totalPayable)}</p>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded">
              <p className="text-[10px] font-mono text-gray-500 uppercase mb-1">Total Receivables (A)</p>
              <p className="text-xl font-mono font-bold text-neon-emerald">{formatCurrency(stats.totalReceivable)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Liabilities */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-neon-rose" />
              <h3 className="font-mono text-sm uppercase tracking-widest text-neon-rose">Active_Liabilities</h3>
            </div>
            <div className="hud-panel divide-y divide-white/5">
              {payables.map((debt: any) => (
                <DebtItem key={debt.id} debt={debt} color="rose" onClick={() => handleDebtClick(debt)} />
              ))}
              {payables.length === 0 && (
                <div className="p-8 text-center text-gray-500 font-mono text-xs uppercase">No active liabilities detected</div>
              )}
            </div>
          </div>

          {/* Receivables */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HandCoins size={18} className="text-neon-emerald" />
              <h3 className="font-mono text-sm uppercase tracking-widest text-neon-emerald">Pending_Receivables</h3>
            </div>
            <div className="hud-panel divide-y divide-white/5">
              {receivables.map((debt: any) => (
                <DebtItem key={debt.id} debt={debt} color="emerald" onClick={() => handleDebtClick(debt)} />
              ))}
              {receivables.length === 0 && (
                <div className="p-8 text-center text-gray-500 font-mono text-xs uppercase">No pending receivables detected</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History size={18} className="text-neon-cyan" />
            <h3 className="font-mono text-sm uppercase tracking-widest">Payment_Stream</h3>
          </div>
          <div className="hud-panel p-1">
            <div className="divide-y divide-white/5">
              {recentLogs.map((log: any) => (
                <div key={log.id} className="p-4 space-y-1 group hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-tighter">{log.action_type || "LOG_EVENT"}</span>
                    <span className="text-[10px] font-mono text-gray-500">{formatDate(log.date)}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white">{log.debt_name || "Unknown Entity"}</div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter truncate max-w-[100px]">{log.description || "System Log"}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => handleDeleteLog(e, log.id)}
                        className="text-[10px] font-mono text-neon-rose hover:text-white transition-colors uppercase"
                      >Delete</button>
                      <span className={cn(
                        "text-sm font-mono font-bold",
                        log.action_type === 'payment' ? "text-neon-emerald" : "text-neon-rose"
                      )}>
                        {log.action_type === 'payment' ? '-' : '+'}{formatCurrency(log.amount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <NewDebtModal 
        isOpen={isNewDebtModalOpen} 
        onClose={() => setIsNewDebtModalOpen(false)} 
        type={newDebtType} 
      />
      <DebtDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        debt={selectedDebt} 
        logs={selectedDebt ? getFilteredLogs(selectedDebt.id) : []} 
      />
    </div>
  );
}

function DebtItem({ debt, color, onClick }: any) {
  const progress = (1 - (Number(debt.remaining_amount) / Number(debt.total_amount))) * 100;
  
  return (
    <div 
      onClick={onClick}
      className="p-6 space-y-4 group hover:bg-white/[0.02] transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-10 w-10 rounded-sm border flex items-center justify-center",
            color === 'rose' ? "border-neon-rose/30 bg-neon-rose/5 text-neon-rose" : "border-neon-emerald/30 bg-neon-emerald/5 text-neon-emerald"
          )}>
            {color === 'rose' ? <CreditCard size={18} /> : <ArrowRightLeft size={18} />}
          </div>
          <div>
            <div className="text-sm font-mono font-bold group-hover:text-neon-cyan transition-colors uppercase tracking-widest">{debt.name}</div>
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">
              {debt.interest_rate}% APR • {formatCurrency(debt.monthly_payment)}/MO
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Remaining</div>
          <div className={cn(
            "text-lg font-mono font-bold",
            color === 'rose' ? "text-neon-rose" : "text-neon-emerald"
          )}>{formatCurrency(debt.remaining_amount)}</div>
        </div>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase">
          <span>Repayment_Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000",
              color === 'rose' ? "bg-neon-rose shadow-[0_0_10px_rgba(244,63,94,0.5)]" : "bg-neon-emerald shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            )} 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
