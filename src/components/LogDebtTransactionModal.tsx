"use client";

import React, { useState } from "react";
import { X, Plus, Minus, Calendar, AlignLeft, CreditCard, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { logDebtTransaction } from "@/app/debts/actions";

export default function LogDebtTransactionModal({ isOpen, onClose, debt }: any) {
  const [amount, setAmount] = useState("");
  const [actionType, setActionType] = useState("payment"); // 'payment' or 'increase'
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !debt) return null;

  const isReceivable = debt.id.startsWith('rcv');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("debtId", debt.id);
    formData.append("amount", amount);
    formData.append("actionType", actionType);
    formData.append("description", description);
    formData.append("date", date);

    const result = await logDebtTransaction(formData);
    
    setIsSubmitting(false);
    if (result.success) {
      onClose();
      // Reset form
      setAmount("");
      setActionType("payment");
      setDescription("");
      setDate(new Date().toISOString().split('T')[0]);
    } else {
      alert(result.error || "Failed to log transaction");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-hud-panel border border-neon-cyan/40 rounded-lg shadow-[0_0_80px_rgba(0,243,255,0.2)]"
      >
        <div className="p-4 border-b border-neon-cyan/20 bg-neon-cyan/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-[0.3em]">Protocol::Update_Ledger</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-neon-rose transition-colors">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Entry_Amount_SEK</label>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full bg-transparent text-5xl font-mono font-black text-white text-center focus:outline-none focus:text-neon-cyan transition-colors"
              autoFocus
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button" 
                onClick={() => setActionType("payment")}
                className={cn(
                  "hud-button py-2 flex items-center justify-center gap-2",
                  actionType === "payment" ? "border-neon-emerald text-neon-emerald bg-neon-emerald/10" : "border-white/10 text-gray-500"
                )}
              >
                <Minus size={14} />
                <span className="text-[10px] tracking-widest uppercase">{isReceivable ? "COLLECTED" : "REPAYMENT"}</span>
              </button>
              <button 
                type="button" 
                onClick={() => setActionType("increase")}
                className={cn(
                  "hud-button py-2 flex items-center justify-center gap-2",
                  actionType === "increase" ? "border-neon-rose text-neon-rose bg-neon-rose/10" : "border-white/10 text-gray-500"
                )}
              >
                <Plus size={14} />
                <span className="text-[10px] tracking-widest uppercase">{isReceivable ? "LENT_MORE" : "BORROWED_MORE"}</span>
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Protocol_Date</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="hud-input w-full pl-10" 
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Transmission_Details</label>
              <div className="relative">
                <AlignLeft size={14} className="absolute left-3 top-3 text-gray-500" />
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="LOG_SPECIFICATIONS..." 
                  className="hud-input w-full pl-10 h-24 pt-2 resize-none" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={cn(
              "hud-button w-full py-4 text-base tracking-[0.2em] transition-all",
              isSubmitting ? "opacity-50 cursor-not-allowed" : "bg-neon-cyan/10 border-neon-cyan hover:bg-neon-cyan/20"
            )}
          >
            {isSubmitting ? "TRANSMITTING..." : "EXECUTE_UPDATE"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
