"use client";
// app/page.tsx — Landing / Home page
// Shows a hero section with CTA buttons. Farmers can start registration
// or view their dashboard if already onboarded.
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, ShieldCheck, Fingerprint, MapPin, FileText, CheckCircle2 } from "lucide-react";
import { createFarmer } from "@/lib/storage";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { currentFarmer, setCurrentFarmerId, activeRole } = useApp();
  const router = useRouter();

  function handleStartRegistration() {
    // Create a new farmer record and go to onboarding
    const farmer = createFarmer();
    setCurrentFarmerId(farmer.id);
    router.push("/onboarding");
  }

  const features = [
    { icon: Fingerprint, title: "Biometric Identity", desc: "Secure fingerprint and face capture prevent duplicate registration" },
    { icon: MapPin, title: "GPS Farm Mapping", desc: "Precisely map farm boundaries and record soil & crop data" },
    { icon: ShieldCheck, title: "Digital ID Card", desc: "Instant verifiable farmer ID — HFIP-2026-XXXX format" },
    { icon: FileText, title: "Document Vault", desc: "Store land titles, bank details, and input history securely" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 bg-grid-emerald opacity-50" />

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
        {/* Pill badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
          <Leaf className="h-3.5 w-3.5" />
          Phase 1 — Digital Farmer Identity System
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Every Farmer Deserves
          <span className="block text-primary">a Digital Identity</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          HFIP gives every Nigerian farmer a secure, verifiable digital identity card —
          unlocking access to credit, inputs, and government support programmes.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {activeRole === "admin" ? (
            <Button size="xl" asChild>
              <Link href="/admin">
                <ShieldCheck className="h-5 w-5" />
                Open Admin Dashboard
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          ) : currentFarmer?.onboardingComplete ? (
            <Button size="xl" asChild>
              <Link href="/dashboard">
                View My Dashboard <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          ) : currentFarmer ? (
            <Button size="xl" asChild>
              <Link href="/onboarding">
                Continue Registration <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button size="xl" onClick={handleStartRegistration}>
              Start Registration <ArrowRight className="h-5 w-5" />
            </Button>
          )}
          <Button size="xl" variant="outline" asChild>
            <Link href="/admin">
              Admin Demo
            </Link>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          {["Federal Ministry of Agriculture", "CBN AgriFinance", "NIRSAL Microfinance"].map(b => (
            <div key={b} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              {b}
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid */}
      <section className="relative mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
              style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative border-t border-border bg-muted/30 py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {[
              { value: "2.5M+", label: "Target Farmers" },
              { value: "37", label: "States Covered" },
              { value: "<2s", label: "Registration Time" },
              { value: "100%", label: "Offline Capable" },
            ].map(s => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-primary">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
