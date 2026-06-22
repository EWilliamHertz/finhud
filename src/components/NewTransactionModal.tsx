"use client";

import React, { useState } from "react";
import { X, Plus, Tag, User, AlignLeft, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createTransaction } from "@/lib/transactions-actions";

export default function NewTransactionModal({ isOpen, onClose }: any) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("type", type);

    const result = await createTransaction(formData);

    setIsSubmitting(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || "Failed to create transaction");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-xl bg-hud-panel border border-neon-cyan/40 rounded-lg shadow-[0_0_80px_rgba(0,243,255,0.2)]"
      >
        {/* Terminal Header */}
        <div className="p-4 border-b border-neon-cyan/20 bg-neon-cyan/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-[10px] font-mono text-neon-cyan uppercase tracking-[0.3em]">Protocol::Initialize_Entry</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-neon-rose transition-colors">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="mx-8 mt-4 p-3 bg-neon-rose/10 border border-neon-rose/50 text-neon-rose text-xs font-mono uppercase text-center animate-pulse">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Amount Input */}
          <div className="text-center space-y-2">
            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Entry_Amount_SEK</label>
            <input 
              name="amount"
              type="number" 
              step="0.01"
              placeholder="0.00"
              className="w-full bg-transparent text-5xl font-mono font-black text-white text-center focus:outline-none focus:text-neon-cyan transition-colors"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button" 
                  onClick={() => setType("income")}
                  className={cn(
                    "hud-button py-2 transition-all",
                    type === "income" ? "border-neon-emerald/50 text-neon-emerald bg-neon-emerald/5" : "border-white/10 text-gray-500"
                  )}
                >INCOME</button>
                <button 
                  type="button" 
                  onClick={() => setType("expense")}
                  className={cn(
                    "hud-button py-2 transition-all",
                    type === "expense" ? "border-neon-rose/50 text-neon-rose bg-neon-rose/5" : "border-white/10 text-gray-500"
                  )}
                >EXPENSE</button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Category</label>
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select name="category" className="hud-input w-full pl-10 bg-black uppercase text-[10px]" required>
                  <option value="GENERAL">GENERAL</option>
                  <option value="POKEMON">POKEMON</option>
                  <option value="REPAYMENT">REPAYMENT</option>
                  <option value="LOAN">LOAN</option>
                  <option value="FOOD">FOOD</option>
                  <option value="RENT">RENT</option>
                  <option value="UTILITIES">UTILITIES</option>
                  <option value="TRANSPORT">TRANSPORT</option>
                  <option value="ENTERTAINMENT">ENTERTAINMENT</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Entity_Party</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="party" type="text" placeholder="NAME_OF_PARTY..." className="hud-input w-full pl-10" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Protocol_Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input name="date" type="date" className="hud-input w-full pl-10" defaultValue={new Date().toISOString().split('T')[0]} required />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Description</label>
              <div className="relative">
                <AlignLeft size={14} className="absolute left-3 top-3 text-gray-500" />
                <textarea name="description" placeholder="ENTRY_DETAILS..." className="hud-input w-full pl-10 h-20 pt-2 resize-none" />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={cn(
              "hud-button w-full py-4 bg-neon-cyan/10 border-neon-cyan text-base tracking-[0.2em] transition-all",
              isSubmitting ? "opacity-50 cursor-wait" : "hover:bg-neon-cyan/20"
            )}
          >
            {isSubmitting ? "EXECUTING..." : "EXECUTE_INITIALIZATION"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
