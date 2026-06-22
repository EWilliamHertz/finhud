import React from "react";
import { db } from "@/lib/db";
import { formatCurrency, cn, formatDate } from "@/lib/utils";
import { 
  PiggyBank, 
  Target, 
  ArrowUp, 
  ArrowDown, 
  History, 
  Plus, 
  LineChart as ChartIcon
} from "lucide-react";
import SavingsChart from "@/components/SavingsChart";

async function getSavingsData(userId: number) {
  const [accountsRes, transactionsRes] = await Promise.all([
    db.query("SELECT * FROM savings_accounts WHERE user_id = $1 ORDER BY balance DESC", [userId]),
    db.query(`
      SELECT st.*, s.name as account_name 
      FROM savings_transactions st 
      JOIN savings_accounts s ON st.savings_id = s.id 
      WHERE st.user_id = $1 
      ORDER BY st.date DESC LIMIT 15
    `, [userId])
  ]);

  const accounts = accountsRes.rows;
  const recentTransactions = transactionsRes.rows;

  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
  const totalTarget = accounts.reduce((sum, acc) => sum + Number(acc.target_amount), 0);
  const aggregateProgress = totalTarget > 0 ? (totalBalance / totalTarget) * 100 : 0;

  // Mock data for the chart (in a real app, this would be calculated from historical logs)
  const chartData = [
    { date: "JAN", balance: totalBalance * 0.8 },
    { date: "FEB", balance: totalBalance * 0.85 },
    { date: "MAR", balance: totalBalance * 0.82 },
    { date: "APR", balance: totalBalance * 0.9 },
    { date: "MAY", balance: totalBalance * 0.95 },
    { date: "JUN", balance: totalBalance },
  ];

  return {
    accounts,
    recentTransactions,
    stats: {
      totalBalance,
      totalTarget,
      aggregateProgress
    },
    chartData
  };
}

export default async function SavingsPage() {
  const userId = "13bfe2bb-dd03-4877-abca-4be70b058c3a"; // Hardcoded
  const data = await getSavingsData(userId);

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xs font-mono text-neon-cyan uppercase tracking-[0.3em] mb-1">Liquidity Reserve</h2>
          <h1 className="text-4xl font-mono font-black tracking-tighter">THE_VAULT</h1>
        </div>
        <button className="hud-button flex items-center gap-2">
          <Plus size={16} />
          <span>Establish_Goal</span>
        </button>
      </div>

      {/* Aggregate Progress Panel */}
      <div className="hud-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <PiggyBank size={120} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Aggregate Savings Balance</p>
              <p className="text-5xl font-mono font-black tracking-tighter text-neon-emerald">{formatCurrency(data.stats.totalBalance)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-neon-cyan" />
                  <span className="text-[10px] font-mono text-gray-400 uppercase">Target: {formatCurrency(data.stats.totalTarget)}</span>
                </div>
                <span className="text-xs font-mono font-bold text-neon-cyan">{data.stats.aggregateProgress.toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all duration-1000" 
                  style={{ width: `${data.stats.aggregateProgress}%` }} 
                />
              </div>
            </div>
          </div>
          
          <div className="h-[200px] w-full">
            <SavingsChart data={data.chartData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Accounts List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <PiggyBank size={18} className="text-neon-cyan" />
            <h3 className="font-mono text-sm uppercase tracking-widest">Active_Accounts</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.accounts.map((acc) => (
              <div key={acc.id} className="hud-panel p-6 space-y-4 group hover:border-neon-cyan/50 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-mono font-bold text-white group-hover:text-neon-cyan transition-colors">{acc.name}</h4>
                    <p className="text-[10px] font-mono text-gray-500 uppercase">{acc.currency}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-mono font-bold text-white">{formatCurrency(acc.balance)}</p>
                    <p className="text-[10px] font-mono text-gray-500 uppercase">Balance</p>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-mono text-gray-400">
                    <span>GOAL_METRIC</span>
                    <span>{((Number(acc.balance) / Number(acc.target_amount)) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-neon-emerald transition-all duration-1000" 
                      style={{ width: `${Math.min(100, (Number(acc.balance) / Number(acc.target_amount)) * 100)}%` }} 
                    />
                  </div>
                </div>
                
                <div className="pt-2 flex justify-end gap-2">
                  <button className="hud-button py-1 px-3 text-[10px]">DEPOSIT</button>
                  <button className="hud-button py-1 px-3 text-[10px] border-white/10 text-white hover:bg-white/5">WITHDRAW</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History size={18} className="text-neon-cyan" />
            <h3 className="font-mono text-sm uppercase tracking-widest">Vault_Activity</h3>
          </div>
          
          <div className="hud-panel p-1 max-h-[500px] overflow-y-auto">
            <div className="divide-y divide-white/5">
              {data.recentTransactions.map((tx: any) => (
                <div key={tx.id} className="p-4 space-y-1 group hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {tx.type === 'deposit' ? <ArrowUp size={12} className="text-neon-emerald" /> : <ArrowDown size={12} className="text-neon-rose" />}
                      <span className={cn(
                        "text-[10px] font-mono uppercase tracking-tighter",
                        tx.type === 'deposit' ? "text-neon-emerald" : "text-neon-rose"
                      )}>
                        {tx.type}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">{formatDate(tx.date)}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white">{tx.description}</div>
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">{tx.account_name}</span>
                    <span className={cn(
                      "text-sm font-mono font-bold",
                      tx.type === 'deposit' ? "text-neon-emerald" : "text-neon-rose"
                    )}>
                      {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
