import React from "react";
import { db } from "@/lib/db";
import DebtsClient from "./DebtsClient";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function getDebtData(userId: string) {
  const [debtsRes, receivablesRes, logsRes] = await Promise.all([
    db.query("SELECT * FROM debts WHERE user_id = $1 ORDER BY remaining_amount DESC", [userId]),
    db.query("SELECT * FROM receivables WHERE user_id = $1 ORDER BY remaining_amount DESC", [userId]),
    db.query(`
      SELECT dl.*, COALESCE(d.name, r.name) as debt_name 
      FROM debt_logs dl 
      LEFT JOIN debts d ON dl.debt_id = d.id 
      LEFT JOIN receivables r ON dl.debt_id = r.id
      WHERE dl.user_id = $1 
      ORDER BY dl.date DESC LIMIT 10
    `, [userId])
  ]);

  const payables = debtsRes.rows;
  const receivables = receivablesRes.rows;

  const totalPayable = payables.reduce((sum, d) => sum + Number(d.remaining_amount), 0);
  const totalReceivable = receivables.reduce((sum, d) => sum + Number(d.remaining_amount), 0);
  const netDebt = totalReceivable - totalPayable;

  return {
    payables,
    receivables,
    recentLogs: logsRes.rows,
    stats: {
      totalPayable,
      totalReceivable,
      netDebt
    }
  };
}

export default async function DebtsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const userId = session.userId as string;
  const data = await getDebtData(userId);

  return (
    <DebtsClient 
      payables={data.payables} 
      receivables={data.receivables} 
      recentLogs={data.recentLogs} 
      stats={data.stats} 
    />
  );
}
