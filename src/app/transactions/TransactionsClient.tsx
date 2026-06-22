"use client";

import React, { useState } from "react";
import { formatCurrency, cn, formatDate } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import NewTransactionModal from "@/components/NewTransactionModal";

export default function TransactionsClient({ transactions, totalCount, page, totalPages, limit, offset }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xs font-mono text-neon-cyan uppercase tracking-[0.3em] mb-1">Financial Log</h2>
          <h1 className="text-4xl font-mono font-black tracking-tighter">LEDGER_PROTOCOL</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="hud-button flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Initialize_Entry</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="hud-panel p-4 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            type="text" 
            placeholder="SEARCH_BY_DESCRIPTION_OR_TAG..." 
            className="hud-input w-full pl-10"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select className="hud-input flex-1 md:w-40 bg-black">
            <option value="">ALL_TYPES</option>
            <option value="income">INCOME</option>
            <option value="expense">EXPENSE</option>
          </select>
          <button className="hud-button p-2 flex items-center justify-center">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="hud-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Entity / Description</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="group hover:bg-white/[0.03] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-gray-400">{formatDate(tx.date)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-sm flex items-center justify-center border",
                        tx.type === 'income' ? "border-neon-emerald/30 bg-neon-emerald/5" : "border-neon-rose/30 bg-neon-rose/5"
                      )}>
                        {tx.type === 'income' ? <ArrowUpRight className="text-neon-emerald" size={14} /> : <ArrowDownRight className="text-neon-rose" size={14} />}
                      </div>
                      <div>
                        <div className="text-sm font-mono font-bold group-hover:text-neon-cyan transition-colors">{tx.party || "Unknown Entity"}</div>
                        <div className="text-[10px] font-mono text-gray-500 uppercase truncate max-w-[200px]">{tx.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-sm font-mono font-bold",
                      tx.type === 'income' ? "text-neon-emerald" : "text-neon-rose"
                    )}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between bg-white/[0.01]">
          <span className="text-[10px] font-mono text-gray-500 uppercase">
            Showing {offset + 1}-{Math.min(offset + limit, totalCount)} of {totalCount} records
          </span>
          <div className="flex items-center gap-2">
            <button className="hud-button p-1 disabled:opacity-30" disabled={page <= 1}>
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                <button 
                  key={i} 
                  className={cn(
                    "h-8 w-8 flex items-center justify-center font-mono text-xs rounded",
                    page === i + 1 ? "bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan" : "hover:bg-white/5 text-gray-500"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button className="hud-button p-1 disabled:opacity-30" disabled={page >= totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <NewTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
