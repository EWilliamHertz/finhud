"use server";

import { db } from "./db";
import { createToken } from "./auth";
import { hashPassword, verifyPassword } from "./password";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password required" };
  }

  try {
    const res = await db.query('SELECT * FROM "user" WHERE email = $1', [email]);
    const user = res.rows[0];

    if (!user || !(await verifyPassword(password, user.hashed_password))) {
      return { error: "Invalid credentials" };
    }

    const token = await createToken({ 
      userId: user.id, 
      email: user.email,
      name: user.name 
    });

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Authentication failed" };
  }
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !password) {
    return { error: "All fields required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const existing = await db.query('SELECT id FROM "user" WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return { error: "User already exists" };
    }

    const passwordHash = await hashPassword(password);
    const id = crypto.randomUUID();

    await db.query(
      'INSERT INTO "user" (id, email, hashed_password, is_active, is_superuser, is_verified) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, email, passwordHash, true, false, false]
    );

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed" };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/login");
}
