"use client";
// components/shared/Navbar.tsx
// Top nav: logo, role toggle (Farmer/Admin), Register/Dashboard, dark mode.
// On mobile these collapse into a hamburger menu.
import { useState, useRef, useEffect } from "react";
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

  function handleRoleSwitch(role: "farmer" | "admin") {
    setRole(role);
    if (role === "admin") router.push("/admin");
    else router.push(currentFarmer?.onboardingComplete ? "/dashboard" : "/");
    setMenuOpen(false);
  }

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

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

        {/* Mobile: hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-accent"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu — only in DOM when open to avoid any peek */}
      {menuOpen && (
        <div className="grid overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3 px-3 pb-4 pt-3">
            {navItems}
          </div>
        </div>
      )}
    </header>
  );
}
