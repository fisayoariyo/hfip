"use client";
// components/shared/Navbar.tsx
// The top navigation bar. Shows the HFIP logo, role toggle (Farmer/Admin),
// and a dark mode button. Role toggle is a demo shortcut — in production
// this would be replaced by proper JWT-based auth.
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Leaf, Moon, Sun, ShieldCheck, User, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { activeRole, setRole, darkMode, toggleDarkMode, currentFarmer } = useApp();
  const router = useRouter();

  function handleRoleSwitch(role: "farmer" | "admin") {
    setRole(role);
    if (role === "admin") router.push("/admin");
    else router.push(currentFarmer?.onboardingComplete ? "/dashboard" : "/");
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Leaf className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold tracking-tight">
            HFIP
            <span className="ml-1.5 hidden text-xs font-normal text-muted-foreground sm:inline">
              Hashmar Farmer Identity Platform
            </span>
          </span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Role toggle — demo only */}
          <div className="flex items-center rounded-xl border border-border bg-muted p-1 gap-1">
            <button
              onClick={() => handleRoleSwitch("farmer")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeRole === "farmer"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              Farmer
            </button>
            <button
              onClick={() => handleRoleSwitch("admin")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeRole === "admin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin
            </button>
          </div>

          {/* Quick-start onboarding button for farmers */}
          {activeRole === "farmer" && !currentFarmer?.onboardingComplete && (
            <Button size="sm" asChild>
              <Link href="/onboarding">
                <LogIn className="h-3.5 w-3.5" />
                Register
              </Link>
            </Button>
          )}
          {activeRole === "farmer" && currentFarmer?.onboardingComplete && (
            <Button size="sm" variant="outline" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
