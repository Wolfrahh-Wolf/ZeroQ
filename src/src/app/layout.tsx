import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZeroQ — Skip the queue. Order on the way.",
  description:
    "ZeroQ lets campus students pre-order canteen food while walking to the venue. Food is ready on arrival — zero waiting time.",
  keywords: ["canteen", "pre-order", "campus", "food", "zero queue"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen">
        <div className="mesh-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
