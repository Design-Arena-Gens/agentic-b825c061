import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";

export const metadata: Metadata = {
  title: "IA Marketing ? ?tude, Devis, Signature & Paiement",
  description:
    "Plateforme IA Marketing: ?tude concurrentielle Qu?bec & Am?rique du Nord, configurateur de devis, signature ?lectronique et paiement.",
  metadataBase: new URL("https://agentic-b825c061.vercel.app")
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className={clsx("min-h-screen antialiased")}>
        <header className="border-b border-white/10">
          <nav className="container flex h-16 items-center justify-between">
            <Link href="/" className="font-semibold">
              <span className="text-brand-light">IA</span> Marketing
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/etude" className="hover:underline">
                ?tude
              </Link>
              <Link href="/services" className="hover:underline">
                Services
              </Link>
              <Link href="/devis" className="hover:underline">
                Devis
              </Link>
              <Link href="/compte" className="hover:underline">
                Compte
              </Link>
              <Link href="/parametres" className="hover:underline">
                Param?tres
              </Link>
            </div>
          </nav>
        </header>
        <main className="container py-10">{children}</main>
        <footer className="border-t border-white/10">
          <div className="container py-6 text-xs text-white/70">
            ? {new Date().getFullYear()} IA Marketing ? Propuls? par Next.js
          </div>
        </footer>
      </body>
    </html>
  );
}

