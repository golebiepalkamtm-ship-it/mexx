import React from "react";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

import { Navbar } from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Providers>
          <Navbar />
          <div className="pb-20 md:pt-20 md:pb-0">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
