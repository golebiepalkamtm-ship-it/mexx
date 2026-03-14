"use client";

import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";

const GET_PROFILE = gql`
  query GetProfile {
    me {
      id
      email
      username
      status
    }
  }
`;

const stats = [
  { label: "Followers", value: "0", icon: "👥" },
  { label: "Tips", value: "0", icon: "💎" },
  { label: "Streams", value: "0", icon: "📡" },
  { label: "Rating", value: "—", icon: "⭐" },
];

export default function ProfilePage() {
  const { data, loading, error } = useQuery(GET_PROFILE, {
    fetchPolicy: "network-only",
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-surface shimmer" />
      </div>
    );

  return (
    <div className="flex min-h-screen flex-col items-center px-4 pt-8 md:pt-24 pb-8">
      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Profile Header */}
        <div className="glass-card rounded-3xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="relative z-10 flex flex-col items-center">
            {/* Avatar with animated ring */}
            <div className="relative mb-5">
              <motion.div
                className="w-28 h-28 rounded-full bg-gradient-to-br from-primary via-accent-orange to-accent p-[3px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm shadow-glow-cyan">
                ✓
              </div>
            </div>

            <h1 className="text-2xl font-black text-gradient-brand mb-1">
              Tymczasowy Widok
            </h1>
            <p className="text-white/40 text-sm mb-6">
              Implementacja backendu w toku
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3 w-full">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.04]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <span className="text-lg">{stat.icon}</span>
                  <span className="font-bold text-sm">{stat.value}</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="btn-premium text-center py-3 rounded-2xl text-sm">
            Follow
          </button>
          <button className="btn-ghost text-center py-3 rounded-2xl text-sm border-white/10">
            Message
          </button>
          <button className="btn-ghost text-center py-3 rounded-2xl text-sm border-white/10">
            💎 Tip
          </button>
          <button className="btn-ghost text-center py-3 rounded-2xl text-sm border-white/10">
            📡 Private Show
          </button>
        </motion.div>

        {/* Content Tabs */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="flex border-b border-white/[0.04]">
            {["Photos", "Videos", "Streams", "Services"].map((tab, i) => (
              <button
                key={tab}
                className={`flex-1 py-4 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  i === 0
                    ? "text-primary border-b-2 border-primary"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-10 text-center">
            <p className="text-white/20 text-sm">Brak zawartości</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
