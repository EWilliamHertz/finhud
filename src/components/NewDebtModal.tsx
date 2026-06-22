"use client";

import React, { useState } from "react";
import { X, Plus, DollarSign, Percent, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { createDebt } from "@/app/debts/actions";

export default function NewDebtModal({ isOpen, onClose, type }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !type) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("type", type);
    
    const result = await createDebt(formData);
    
    setIsSubmitting(false);
    if (result.success) {
      onClose();
    } else {
      alert(result.error || "Failed to create");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative w-full max-w-lg bg-hud-panel border border-neon-cyan/40 rounded-lg p-8 space-y-6">
        <h2 className="text-xl font-mono font-bold uppercase tracking-widest text-neon-cyan">New {type === 'liability' ? 'Liability' : 'Receivable'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" placeholder="Debt Name (e.g. Student Loan)" className="hud-input w-full p-2" required />
          <input name="debtType" placeholder="Type (e.g. personal_loan, credit_card)" className="hud-input w-full p-2" required defaultValue="personal_loan" />
          <input name="totalAmount" type="number" placeholder="Total Amount" className="hud-input w-full p-2" required />
          <input name="interestRate" type="number" placeholder="Interest Rate (%)" className="hud-input w-full p-2" required />
          <input name="monthlyPayment" type="number" placeholder="Monthly Payment" className="hud-input w-full p-2" required />
          <input name="date" type="date" className="hud-input w-full p-2" required defaultValue={new Date().toISOString().split('T')[0]} />
          <button type="submit" disabled={isSubmitting} className="hud-button w-full p-3">{isSubmitting ? "CREATING..." : "CREATE"}</button>
        </form>
      </motion.div>
    </div>
  );
}
