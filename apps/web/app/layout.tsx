import React from "react";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

import { Navbar } from "../components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Mexx - Premium Social Platform",
  description: "Discover, connect, stream, and earn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={inter.variable}>
      <body
        className={`${inter.className} bg-background text-white antialiased noise-overlay`}
      >
        <Providers>
          {/* Ambient orbs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="orb orb-primary w-[600px] h-[600px] -top-[200px] -left-[200px]" />
            <div className="orb orb-secondary w-[500px] h-[500px] top-[40%] -right-[150px]" />
            <div className="orb orb-accent w-[400px] h-[400px] -bottom-[100px] left-[30%]" />
          </div>

          <div className="relative z-10 bg-mesh min-h-screen">
            <Navbar />
            <div className="pb-24 md:pt-20 md:pb-0">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
