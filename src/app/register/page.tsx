"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, User, Cpu, ArrowRight, Mail } from "lucide-react";

import { register } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    const result = await register(formData);
    
    if (result?.success) {
      router.push("/login");
    } else {
      setError(result?.error || "Registration failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-in zoom-in-95 duration-500">
      <div className="hud-panel p-8 w-full max-w-md space-y-8 bg-black/60">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-12 w-12 rounded border border-neon-emerald/50 flex items-center justify-center bg-neon-emerald/5">
            <Cpu size={24} className="text-neon-emerald" />
          </div>
          <h2 className="text-2xl font-mono font-bold tracking-tighter uppercase">New_Operative_Registration</h2>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Request_System_Clearance</p>
        </div>

        {error && (
          <div className="p-3 bg-neon-rose/10 border border-neon-rose/50 text-neon-rose text-xs font-mono uppercase text-center animate-pulse">
            Error: {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Secure_Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="hud-input w-full pl-10"
                placeholder="USER@DOMAIN.COM"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Cipher_Key</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="hud-input w-full pl-10"
                placeholder="********"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest ml-1">Confirm_Cipher</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="hud-input w-full pl-10"
                placeholder="********"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={cn(
              "hud-button w-full py-3 flex items-center justify-center gap-2 group border-neon-emerald/30 text-neon-emerald hover:bg-neon-emerald/10 hover:border-neon-emerald transition-all",
              isLoading ? "opacity-50 cursor-wait" : ""
            )}
          >
            <span>{isLoading ? "Enlisting..." : "Request_Clearance"}</span>
            {!isLoading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="pt-4 flex flex-col items-center gap-2">
          <Link href="/login" className="text-[10px] font-mono text-gray-500 hover:text-neon-emerald transition-colors uppercase">
            Already_Authorized?_Identify_Yourself
          </Link>
          <Link href="/" className="text-[10px] font-mono text-gray-500 hover:text-white transition-colors uppercase">
            Return_to_Command_Center
          </Link>
        </div>
      </div>
    </div>
  );
}
