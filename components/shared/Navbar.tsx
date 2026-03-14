"use client";
// components/shared/Navbar.tsx
// Top nav: logo, role toggle (Farmer/Admin), Register/Dashboard, dark mode.
// On mobile these collapse into a hamburger menu.
import { useState, useRef, useEffect, useCallback } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Leaf, Moon, Sun, ShieldCheck, User, LogIn, Menu, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { activeRole, setRole, darkMode, toggleDarkMode, currentFarmer } = useApp();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  function handleRoleSwitch(role: "farmer" | "admin") {
    setRole(role);
    if (role === "admin") router.push("/admin");
    else router.push(currentFarmer?.onboardingComplete ? "/dashboard" : "/");
    setMenuOpen(false);
  }

  // Stable listener: same reference so add/remove never leaks
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!menuOpenRef.current) return;
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  // Prevent body scroll when menu is open on mobile
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navItems = (
    <>
      <div className="flex items-center rounded-xl border border-border bg-muted p-1">
        <button
          onClick={() => handleRoleSwitch("farmer")}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
            activeRole === "farmer"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Switch to Farmer view"
        >
          <User className="h-4 w-4 shrink-0" />
          Farmer
        </button>
        <button
          onClick={() => handleRoleSwitch("admin")}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
            activeRole === "admin"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Switch to Admin view"
        >
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Admin
        </button>
      </div>

      {activeRole === "farmer" && !currentFarmer?.onboardingComplete && (
        <Button size="sm" className="w-full justify-center sm:w-auto" asChild>
          <Link href="/onboarding" onClick={() => setMenuOpen(false)}>
            <LogIn className="h-4 w-4 shrink-0" />
            Register
          </Link>
        </Button>
      )}
      {activeRole === "farmer" && currentFarmer?.onboardingComplete && (
        <Button size="sm" variant="outline" className="w-full justify-center sm:w-auto" asChild>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        </Button>
      )}

      <button
        onClick={() => { toggleDarkMode(); setMenuOpen(false); }}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:h-9 sm:w-9 sm:rounded-lg"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span className="sm:sr-only">Dark mode</span>
      </button>
    </>
  );

  // Mobile menu: 2026-style grouped sections, clear hierarchy
  const mobileMenuItems = (
    <nav className="flex flex-col gap-1" aria-label="Navigation menu">
      {/* Role switch — compact segment */}
      <div className="rounded-xl bg-muted/60 p-1.5">
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          View as
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={() => handleRoleSwitch("farmer")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
              activeRole === "farmer"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground active:bg-background/60"
            }`}
            aria-label="Switch to Farmer view"
          >
            <User className="h-4 w-4 shrink-0" />
            Farmer
          </button>
          <button
            onClick={() => handleRoleSwitch("admin")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
              activeRole === "admin"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground active:bg-background/60"
            }`}
            aria-label="Switch to Admin view"
          >
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Admin
          </button>
        </div>
      </div>

      {/* Primary actions */}
      <div className="rounded-xl bg-muted/40 p-1.5">
        <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Actions
        </p>
        <div className="flex flex-col gap-0.5">
          {activeRole === "farmer" && !currentFarmer?.onboardingComplete && (
            <Link
              href="/onboarding"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors active:bg-background/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <LogIn className="h-4 w-4 text-primary" />
              </span>
              Register
            </Link>
          )}
          {activeRole === "farmer" && currentFarmer?.onboardingComplete && (
            <Link
              href="/dashboard"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition-colors active:bg-background/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <ShieldCheck className="h-4 w-4 text-primary" />
              </span>
              Dashboard
            </Link>
          )}
          <button
            onClick={() => { toggleDarkMode(); setMenuOpen(false); }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-muted-foreground transition-colors active:bg-background/60"
            aria-label="Toggle dark mode"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </span>
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl" ref={menuRef}>
      <div className="mx-auto flex h-14 min-h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6">
        <Link href="/" className="flex min-w-0 shrink items-center gap-2 font-semibold">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary sm:h-8 sm:w-8">
            <Leaf className="h-3.5 w-3.5 text-white sm:h-4 sm:w-4" />
          </div>
          <span className="truncate text-sm font-bold tracking-tight sm:text-base">
            HFIP
            <span className="ml-1 hidden text-xs font-normal text-muted-foreground sm:inline">
              Hashmar Farmer Identity Platform
            </span>
          </span>
        </Link>

        {/* Desktop: inline nav */}
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {navItems}
        </div>

        {/* Mobile: hamburger — instant tap feedback, no delay */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-transparent text-foreground transition-colors hover:bg-accent active:scale-95 active:bg-accent"
            style={{ touchAction: "manipulation" }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu: overlay + frosted panel (Apple-style), only when open */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-14 z-30 md:hidden sm:top-16"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Backdrop visible immediately, no fade delay */}
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            aria-label="Close menu"
          />
          {/* Panel animates in; backdrop already visible for instant feedback */}
          <div
            className="relative mx-3 mt-1 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/15 ring-1 ring-black/5 dark:ring-white/10"
            style={{ animation: "menu-panel-in 0.25s cubic-bezier(0.32, 0.72, 0, 1) forwards" }}
          >
            <div className="px-2 pb-5 pt-2">
              {mobileMenuItems}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
