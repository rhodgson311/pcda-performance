import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PCDA Performance Tracker",
  description: "Public performance tracker for PCDA players",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b bg-white">
          <div className="container flex items-center justify-between py-4">
            <Link href="/" className="font-extrabold text-xl">PCDA Performance</Link>
            <nav className="flex gap-3">
              <Link href="/log" className="btn">Log Session</Link>
              <Link href="/players" className="btn-secondary">Players</Link>
              <Link href="/admin" className="btn-secondary">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="container py-8 text-sm text-gray-500">Built for PCDA motivation 💪</footer>
      </body>
    </html>
  );
}
