"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/", icon: "🏠", label: "Home" },
  { href: "/live", icon: "📡", label: "Live" },
  { href: "/marketplace", icon: "💎", label: "Market" },
  { href: "/messages", icon: "💬", label: "Czat" },
  { href: "/profile", icon: "👤", label: "Profil" },
  { href: "/wallet", icon: "🪙", label: "Portfel" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full glass-strong border-t border-white/[0.04] md:top-0 md:bottom-auto md:border-b md:border-t-0 p-3 md:p-4 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="hidden md:flex items-center gap-2 group">
          <motion.span
            className="text-2xl font-black tracking-tight text-gradient-brand"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            MEXX
          </motion.span>
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </Link>

        {/* Nav Items */}
        <div className="flex w-full md:w-auto justify-around md:gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="relative">
                <motion.div
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors duration-300 ${
                    active
                      ? "text-white"
                      : "text-white/40 hover:text-white/70"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="text-xl relative">
                    {item.icon}
                    {active && (
                      <motion.span
                        layoutId="nav-glow"
                        className="absolute -inset-2 rounded-full bg-primary/20 blur-md"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                  </span>
                  <span className="text-[10px] md:text-xs font-medium tracking-wide">
                    {item.label}
                  </span>
                </motion.div>

                {/* Active indicator dot */}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-glow-sm"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
