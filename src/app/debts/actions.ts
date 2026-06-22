"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteDebtLog(logId: string) {
  const userId = "13bfe2bb-dd03-4877-abca-4be70b058c3a";
  try {
    await db.query("DELETE FROM debt_logs WHERE id = $1 AND user_id = $2", [logId, userId]);
    revalidatePath("/debts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting log:", error);
    return { error: "Database error" };
  }
}

export async function deleteDebt(debtId: string) {
  const userId = "13bfe2bb-dd03-4877-abca-4be70b058c3a";
  const isReceivable = debtId.startsWith('rcv');
  const table = isReceivable ? 'receivables' : 'debts';
  try {
    // Note: Assuming ON DELETE CASCADE in DB or need to handle logs separately.
    await db.query(`DELETE FROM ${table} WHERE id = $1 AND user_id = $2`, [debtId, userId]);
    revalidatePath("/debts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting debt:", error);
    return { error: "Database error" };
  }
}

export async function createDebt(formData: FormData) {
  const userId = "13bfe2bb-dd03-4877-abca-4be70b058c3a";
  const type = formData.get("type") as 'liability' | 'receivable'; 
  const name = formData.get("name") as string;
  const debtType = (formData.get("debtType") as string) || "loan";
  const totalAmount = parseFloat(formData.get("totalAmount") as string);
  const interestRate = parseFloat(formData.get("interestRate") as string);
  const monthlyPayment = parseFloat(formData.get("monthlyPayment") as string);
  const date = formData.get("date") as string || new Date().toISOString().split('T')[0];

  const table = type === 'receivable' ? 'receivables' : 'debts';
  const idPrefix = type === 'receivable' ? 'rcv' : 'deb';
  const id = `${idPrefix}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    await db.query(
      `INSERT INTO ${table} (id, user_id, name, type, total_amount, remaining_amount, interest_rate, monthly_payment, created_at) 
       VALUES ($1, $2, $3, $4, $5, $5, $6, $7, $8)`,
      [id, userId, name, debtType, totalAmount, interestRate, monthlyPayment, date]
    );
    revalidatePath("/debts");
    return { success: true };
  } catch (error) {
    console.error("Error creating debt:", error);
    return { error: "Database error" };
  }
}

export async function logDebtTransaction(formData: FormData) {
  const userId = "13bfe2bb-dd03-4877-abca-4be70b058c3a"; // Hardcoded for now
  const debtId = formData.get("debtId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const actionType = formData.get("actionType") as string; // 'payment' or 'increase'
  const description = formData.get("description") as string;
  const date = formData.get("date") as string || new Date().toISOString().split('T')[0];

  if (!debtId || isNaN(amount)) {
    return { error: "Invalid input" };
  }

  const isReceivable = debtId.startsWith('rcv');
  const table = isReceivable ? 'receivables' : 'debts';
  
  // Calculate adjustment: payments reduce debt, increases... increase it.
  // For receivables, a 'payment' means someone paid us back (remaining decreases).
  // An 'increase' means we lent more (remaining increases).
  const adjustment = actionType === 'payment' ? -amount : amount;
  const logId = `log_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // 1. Update the debt/receivable balance
    await db.query(
      `UPDATE ${table} SET remaining_amount = remaining_amount + $1 WHERE id = $2 AND user_id = $3`,
      [adjustment, debtId, userId]
    );

    // 2. Add log entry
    await db.query(
      `INSERT INTO debt_logs (id, user_id, debt_id, amount, action_type, description, date) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [logId, userId, debtId, amount, actionType, description, date]
    );

    revalidatePath("/debts");
    return { success: true };
  } catch (error) {
    console.error("Error logging debt transaction:", error);
    return { error: "Database error" };
  }
}
