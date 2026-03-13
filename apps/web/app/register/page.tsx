"use client";
export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md glass-card rounded-3xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.div
              className="text-3xl font-black text-gradient-brand mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              MEXX
            </motion.div>
            <h1 className="text-2xl font-black">Zarejestruj się</h1>
            <p className="text-white/30 text-sm mt-1">
              Dołącz do społeczności
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="twoj@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-premium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Nazwa użytkownika
              </label>
              <input
                type="text"
                placeholder="twoja_nazwa"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-premium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Hasło
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-premium"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-4 rounded-2xl text-sm font-bold disabled:opacity-50 mt-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Rejestracja..." : "Zarejestruj się"}
            </motion.button>
            {error && (
              <motion.p
                className="text-primary text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}
          </form>

          <p className="text-center text-white/30 text-sm mt-6">
            Masz już konto?{" "}
            <Link
              href="/login"
              className="text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              Zaloguj się
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
