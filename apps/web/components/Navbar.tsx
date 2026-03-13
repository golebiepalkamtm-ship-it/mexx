"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path
      ? "text-white border-b-2 border-primary"
      : "text-gray-400 hover:text-white";

  return (
    <nav className="fixed bottom-0 w-full bg-black/90 backdrop-blur-md border-t border-gray-800 md:top-0 md:bottom-auto md:border-b md:border-t-0 p-4 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent hidden md:block"
        >
          Mexx
        </Link>

        <div className="flex w-full md:w-auto justify-around md:gap-8">
          <Link
            href="/"
            className={`flex flex-col items-center ${isActive("/")}`}
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs md:text-sm">Home</span>
          </Link>
          <Link
            href="/discover"
            className={`flex flex-col items-center ${isActive("/discover")}`}
          >
            <span className="text-xl">🔍</span>
            <span className="text-xs md:text-sm">Odkryj</span>
          </Link>
          <Link
            href="/marketplace"
            className={`flex flex-col items-center ${isActive("/marketplace")}`}
          >
            <span className="text-xl">🛒</span>
            <span className="text-xs md:text-sm">Market</span>
          </Link>
          <Link
            href="/messages"
            className={`flex flex-col items-center ${isActive("/messages")}`}
          >
            <span className="text-xl">💬</span>
            <span className="text-xs md:text-sm">Czat</span>
          </Link>
          <Link
            href="/profile"
            className={`flex flex-col items-center ${isActive("/profile")}`}
          >
            <span className="text-xl">👤</span>
            <span className="text-xs md:text-sm">Profil</span>
          </Link>
          <Link
            href="/wallet"
            className={`flex flex-col items-center ${isActive("/wallet")}`}
          >
            <span className="text-xl">💳</span>
            <span className="text-xs md:text-sm">Portfel</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
