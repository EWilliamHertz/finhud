import React from "react";
import { db } from "@/lib/db";
import { formatCurrency, cn, formatDate } from "@/lib/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  History, 
  Plus, 
  Edit3,
  BarChart3,
  PieChart
} from "lucide-react";

async function getInvestmentData(userId: string) {
  const [investmentsRes, logsRes] = await Promise.all([
    db.query("SELECT * FROM investments WHERE user_id = $1 ORDER BY current_value DESC", [userId]),
    db.query(`
      SELECT ih.*, i.name as investment_name 
      FROM investment_history ih 
      JOIN investments i ON ih.investment_id = i.id 
      WHERE i.user_id = $1 
      ORDER BY ih.recorded_date DESC LIMIT 10
    `, [userId])
  ]);

  const investments = investmentsRes.rows.map(inv => {
    const costBasis = Number(inv.quantity) * Number(inv.buy_price);
    const currentValue = Number(inv.current_value);
    const profitLoss = currentValue - costBasis;
    const profitLossPercentage = costBasis > 0 ? (profitLoss / costBasis) * 100 : 0;

    return {
      ...inv,
      costBasis,
      profitLoss,
      profitLossPercentage
    };
  });

  const totalPortfolioValue = investments.reduce((sum, inv) => sum + Number(inv.current_value), 0);
  const totalCostBasis = investments.reduce((sum, inv) => sum + inv.costBasis, 0);
  const totalPL = totalPortfolioValue - totalCostBasis;

  return {
    investments,
    recentLogs: logsRes.rows,
    stats: {
      totalPortfolioValue,
      totalPL,
      plPercentage: totalCostBasis > 0 ? (totalPL / totalCostBasis) * 100 : 0
    }
  };
}

export default async function InvestmentsPage() {
  const userId = "13bfe2bb-dd03-4877-abca-4be70b058c3a"; // Hardcoded
  const data = await getInvestmentData(userId);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xs font-mono text-neon-cyan uppercase tracking-[0.3em] mb-1">Asset Management</h2>
          <h1 className="text-4xl font-mono font-black tracking-tighter">PORTFOLIO_TRACKER</h1>
        </div>
        <div className="flex gap-2">
          <button className="hud-button flex items-center gap-2">
            <Plus size={16} />
            <span>Open_Position</span>
          </button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="hud-panel p-6 border-neon-cyan/30">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Total Market Value</p>
          <p className="text-3xl font-mono font-bold text-white tracking-tighter">{formatCurrency(data.stats.totalPortfolioValue)}</p>
          <div className="mt-4 flex items-center gap-2">
            <BarChart3 size={14} className="text-neon-cyan" />
            <span className="text-[10px] font-mono text-neon-cyan uppercase">Across {data.investments.length} Assets</span>
          </div>
        </div>
        <div className={cn(
          "hud-panel p-6 border-l-4",
          data.stats.totalPL >= 0 ? "border-l-neon-emerald" : "border-l-neon-rose"
        )}>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">All-Time Profit/Loss</p>
          <p className={cn(
            "text-3xl font-mono font-bold tracking-tighter",
            data.stats.totalPL >= 0 ? "text-neon-emerald" : "text-neon-rose"
          )}>
            {data.stats.totalPL >= 0 ? '+' : ''}{formatCurrency(data.stats.totalPL)}
          </p>
          <div className="mt-4 flex items-center gap-2">
            {data.stats.totalPL >= 0 ? <TrendingUp size={14} className="text-neon-emerald" /> : <TrendingDown size={14} className="text-neon-rose" />}
            <span className={cn(
              "text-[10px] font-mono uppercase",
              data.stats.totalPL >= 0 ? "text-neon-emerald" : "text-neon-rose"
            )}>
              {data.stats.totalPL >= 0 ? '+' : ''}{data.stats.plPercentage.toFixed(2)}% Return
            </span>
          </div>
        </div>
        <div className="hud-panel p-6 border-neon-amber/30">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Risk Profile</p>
          <p className="text-3xl font-mono font-bold text-neon-amber tracking-tighter">MODERATE</p>
          <div className="mt-4 flex items-center gap-2">
            <PieChart size={14} className="text-neon-amber" />
            <span className="text-[10px] font-mono text-neon-amber uppercase">Balanced Distribution</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Asset List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-neon-cyan" />
            <h3 className="font-mono text-sm uppercase tracking-widest">Active_Positions</h3>
          </div>
          
          <div className="hud-panel divide-y divide-white/5">
            {data.investments.map((inv) => (
              <div key={inv.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded bg-black border border-white/10 flex items-center justify-center text-xl font-black text-neon-cyan">
                    {inv.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-lg font-mono font-bold group-hover:text-neon-cyan transition-colors">{inv.name}</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">
                      {inv.category} • {inv.quantity} UNITS @ {formatCurrency(inv.buy_price)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">Market Value</div>
                    <div className="text-sm font-mono font-bold">{formatCurrency(inv.current_value)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-gray-500 uppercase mb-1">P/L</div>
                    <div className={cn(
                      "text-sm font-mono font-bold",
                      inv.profitLoss >= 0 ? "text-neon-emerald" : "text-neon-rose"
                    )}>
                      {inv.profitLoss >= 0 ? '+' : ''}{inv.profitLossPercentage.toFixed(1)}%
                    </div>
                  </div>
                  <button className="h-8 w-8 flex items-center justify-center rounded border border-white/5 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all">
                    <Edit3 size={14} className="text-gray-500 hover:text-neon-cyan" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History size={18} className="text-neon-cyan" />
            <h3 className="font-mono text-sm uppercase tracking-widest">Activity_Log</h3>
          </div>
          
          <div className="hud-panel p-1">
            <div className="divide-y divide-white/5">
              {data.recentLogs.map((log: any) => (
                <div key={log.id} className="p-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-tighter bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                      VALUATION_UPDATE
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">{formatDate(log.recorded_date)}</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white">{log.investment_name}</div>
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                    NEW_VALUE: {formatCurrency(log.recorded_value)}
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
