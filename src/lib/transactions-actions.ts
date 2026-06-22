"use server";

import { db } from "./db";
import { getSession } from "./auth";
import { revalidatePath } from "next/cache";

export async function createTransaction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Not authorized" };
  const userId = session.userId as string;

  const type = formData.get("type") as string; // 'income' or 'expense'
  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const party = formData.get("party") as string;
  const dateStr = formData.get("date") as string || new Date().toISOString().split('T')[0];

  if (!type || isNaN(amount) || !category) {
    return { error: "Missing required fields" };
  }

  const dateObj = new Date(dateStr);
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  const id = `tx_${Math.random().toString(36).substr(2, 9)}`;

  try {
    await db.query(
      `INSERT INTO transactions (id, user_id, type, amount, category, description, date, party, month, year) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [id, userId, type, amount, category, description, dateStr, party, month, year]
    );

    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { error: "Database error" };
  }
}

export async function deleteTransaction(txId: string) {
  const session = await getSession();
  if (!session) return { error: "Not authorized" };
  const userId = session.userId as string;

  try {
    await db.query("DELETE FROM transactions WHERE id = $1 AND user_id = $2", [txId, userId]);
    revalidatePath("/dashboard");
    revalidatePath("/transactions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { error: "Database error" };
  }
}
