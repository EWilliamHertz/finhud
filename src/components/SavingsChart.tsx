"use client";

import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

export default function SavingsChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="rgba(255,255,255,0.3)" 
          fontSize={10} 
          fontFamily="monospace"
          tickLine={false}
          axisLine={false}
        />
        <YAxis hide />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "rgba(10, 15, 25, 0.9)", 
            border: "1px solid rgba(0, 243, 255, 0.2)",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "10px"
          }}
          itemStyle={{ color: "#00f3ff" }}
          labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}
        />
        <Area 
          type="monotone" 
          dataKey="balance" 
          stroke="#00f3ff" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorBalance)" 
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
