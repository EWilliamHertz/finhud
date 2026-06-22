import React from "react";
import { db } from "@/lib/db";
import TransactionsClient from "./TransactionsClient";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  const userId = session.userId as string;

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;
  const type = params.type as string | undefined;
  const query = params.q as string | undefined;

  // Build the query
  let sql = "SELECT * FROM transactions WHERE user_id = $1";
  const sqlParams: any[] = [userId];

  if (type) {
    sql += ` AND type = $${sqlParams.length + 1}`;
    sqlParams.push(type);
  }

  if (query) {
    sql += ` AND (description ILIKE $${sqlParams.length + 1} OR category ILIKE $${sqlParams.length + 1} OR party ILIKE $${sqlParams.length + 1})`;
    sqlParams.push(`%${query}%`);
  }

  sql += ` ORDER BY date DESC LIMIT $${sqlParams.length + 1} OFFSET $${sqlParams.length + 2}`;
  sqlParams.push(limit, offset);

  const transactionsRes = await db.query(sql, sqlParams);
  const countRes = await db.query("SELECT COUNT(*) FROM transactions WHERE user_id = $1", [userId]);
  const totalCount = Number(countRes.rows[0].count);
  const totalPages = Math.ceil(totalCount / limit);

  return (
    <TransactionsClient 
      transactions={transactionsRes.rows}
      totalCount={totalCount}
      page={page}
      totalPages={totalPages}
      limit={limit}
      offset={offset}
    />
  );
}
