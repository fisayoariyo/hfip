"use client";
// components/shared/Footer.tsx — Homepage footer with links and copyright.
import Link from "next/link";
import { Leaf } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Register", href: "/onboarding" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left">
          {/* Logo + tagline */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">HFIP</span>
            <span className="hidden text-sm font-normal text-muted-foreground sm:inline">
              — Hashmar Farmer Identity Platform
            </span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1" aria-label="Footer navigation">
            {footerLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 border-t border-border/80 pt-8 sm:flex-row sm:justify-between sm:gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} Hashmar. Phase 1 — Digital Farmer Identity.
          </p>
          <p className="text-xs text-muted-foreground">
            In partnership with Federal Ministry of Agriculture, CBN AgriFinance & NIRSAL.
          </p>
        </div>
      </div>
    </footer>
  );
}
