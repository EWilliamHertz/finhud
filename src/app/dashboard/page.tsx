import React from "react";
import { db } from "@/lib/db";
import { formatCurrency, cn } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  Activity,
  Zap,
  ShieldCheck
} from "lucide-react";

async function getDashboardData(userId: string) {
  // Parallel fetching for performance
  const [
    investmentsRes,
    savingsRes,
    debtsRes,
    receivablesRes,
    transactionsRes,
    recentTransactionsRes
  ] = await Promise.all([
    db.query("SELECT SUM(current_value) as total FROM investments WHERE user_id = $1", [userId]),
    db.query("SELECT SUM(balance) as total FROM savings_accounts WHERE user_id = $1", [userId]),
    db.query("SELECT SUM(remaining_amount) as total FROM debts WHERE user_id = $1", [userId]),
    db.query("SELECT SUM(remaining_amount) as total FROM receivables WHERE user_id = $1", [userId]),
    db.query(`
      SELECT 
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as monthly_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as monthly_expenses
      FROM transactions 
      WHERE user_id = $1 AND month = EXTRACT(MONTH FROM CURRENT_DATE) AND year = EXTRACT(YEAR FROM CURRENT_DATE)
    `, [userId]),
    db.query("SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC LIMIT 5", [userId])
  ]);

  const investments = Number(investmentsRes.rows[0]?.total || 0);
  const savings = Number(savingsRes.rows[0]?.total || 0);
  
  const liabilities = Number(debtsRes.rows[0]?.total || 0);
  const receivables = Number(receivablesRes.rows[0]?.total || 0);
  
  // Assuming 'Cash' is a fixed value for this demo or we can track it via a special account
  const cash = 0; 
  
  const netWorth = investments + savings + cash + receivables - liabilities;
  const liquidBalance = savings + cash;
  
  const monthlyIncome = Number(transactionsRes.rows[0]?.monthly_income || 0);
  const monthlyExpenses = Number(transactionsRes.rows[0]?.monthly_expenses || 0);

  return {
    netWorth,
    liquidBalance,
    monthlyIncome,
    monthlyExpenses,
    recentTransactions: recentTransactionsRes.rows,
    metrics: {
      investments,
      savings,
      receivables,
      liabilities
    }
  };
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const userId = session.userId as string;
  const data = await getDashboardData(userId);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xs font-mono text-neon-cyan uppercase tracking-[0.3em] mb-1">Central Intelligence</h2>
          <h1 className="text-4xl font-mono font-black tracking-tighter">COMMAND_CENTER</h1>
        </div>
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-sm border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-500 uppercase">System Status</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-neon-emerald animate-pulse" />
              <span className="text-xs font-mono text-neon-emerald uppercase">Operational</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-gray-500 uppercase">Last Sync</span>
            <span className="text-xs font-mono text-white">JUST NOW</span>
          </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Net Worth" 
          value={data.netWorth} 
          icon={ShieldCheck} 
          trend="+2.4%" 
          isPrimary 
        />
        <StatCard 
          label="Liquid Assets" 
          value={data.liquidBalance} 
          icon={Zap} 
          trend="+0.8%" 
        />
        <StatCard 
          label="Monthly Revenue" 
          value={data.monthlyIncome} 
          icon={TrendingUp} 
          color="emerald" 
        />
        <StatCard 
          label="Monthly Burn" 
          value={data.monthlyExpenses} 
          icon={TrendingDown} 
          color="rose" 
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Log */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-neon-cyan" />
              <h3 className="font-mono text-sm uppercase tracking-widest">Transaction_Feed</h3>
            </div>
            <button className="text-[10px] font-mono text-neon-cyan hover:underline uppercase tracking-tighter">View_All_Logs</button>
          </div>
          
          <div className="hud-panel divide-y divide-white/5 overflow-hidden">
            {data.recentTransactions.length > 0 ? (
              data.recentTransactions.map((tx: any) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "h-10 w-10 rounded-sm flex items-center justify-center border",
                      tx.type === 'income' ? "border-neon-emerald/30 bg-neon-emerald/5" : "border-neon-rose/30 bg-neon-rose/5"
                    )}>
                      {tx.type === 'income' ? <ArrowUpRight className="text-neon-emerald" size={18} /> : <ArrowDownRight className="text-neon-rose" size={18} />}
                    </div>
                    <div>
                      <div className="text-sm font-mono font-bold group-hover:text-neon-cyan transition-colors">{tx.description}</div>
                      <div className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">{tx.category} • {new Date(tx.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={cn(
                    "text-sm font-mono font-bold",
                    tx.type === 'income' ? "text-neon-emerald" : "text-neon-rose"
                  )}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500 font-mono text-xs uppercase tracking-widest">
                No recent activity detected
              </div>
            )}
          </div>
        </div>

        {/* Breakdown Panel */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-neon-cyan" />
            <h3 className="font-mono text-sm uppercase tracking-widest">System_Breakdown</h3>
          </div>
          
          <div className="hud-panel p-6 space-y-6">
            <BreakdownItem label="Investments" value={data.metrics.investments} percentage={data.netWorth > 0 ? (data.metrics.investments / data.netWorth) * 100 : 0} color="cyan" />
            <BreakdownItem label="Savings" value={data.metrics.savings} percentage={data.netWorth > 0 ? (data.metrics.savings / data.netWorth) * 100 : 0} color="emerald" />
            <BreakdownItem label="Receivables" value={data.metrics.receivables} percentage={data.netWorth > 0 ? (data.metrics.receivables / data.netWorth) * 100 : 0} color="amber" />
            <BreakdownItem label="Liabilities" value={data.metrics.liabilities} percentage={data.netWorth > 0 ? (data.metrics.liabilities / data.netWorth) * 100 : 0} color="rose" isNegative />
            
            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Confidence_Score</span>
                <span className="text-xs font-mono text-neon-emerald">98.2%</span>
              </div>
              <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-neon-emerald w-[98.2%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, isPrimary, color = "cyan" }: any) {
  const colorMap = {
    cyan: "text-neon-cyan border-neon-cyan/20 bg-neon-cyan/5",
    emerald: "text-neon-emerald border-neon-emerald/20 bg-neon-emerald/5",
    rose: "text-neon-rose border-neon-rose/20 bg-neon-rose/5",
    amber: "text-neon-amber border-neon-amber/20 bg-neon-amber/5",
  };

  return (
    <div className={cn(
      "hud-panel p-5 relative overflow-hidden group hover:border-white/20 transition-all",
      isPrimary && "border-neon-cyan/40 bg-neon-cyan/[0.02]"
    )}>
      {isPrimary && (
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <Icon size={80} />
        </div>
      )}
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-sm", colorMap[color as keyof typeof colorMap])}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className="text-[10px] font-mono text-neon-emerald bg-neon-emerald/10 px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className={cn(
          "text-2xl font-mono font-bold tracking-tighter",
          isPrimary ? "text-neon-cyan" : "text-white"
        )}>
          {formatCurrency(value)}
        </p>
      </div>
    </div>
  );
}

function BreakdownItem({ label, value, percentage, color, isNegative }: any) {
  const colorMap = {
    cyan: "bg-neon-cyan",
    emerald: "bg-neon-emerald",
    rose: "bg-neon-rose",
    amber: "bg-neon-amber",
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{label}</span>
        <span className={cn(
          "text-xs font-mono font-bold",
          isNegative ? "text-neon-rose" : "text-white"
        )}>
          {isNegative ? '-' : ''}{formatCurrency(value)}
        </span>
      </div>
      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000", colorMap[color as keyof typeof colorMap])} 
          style={{ width: `${Math.min(100, percentage)}%` }} 
        />
      </div>
    </div>
  );
}
