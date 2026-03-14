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
import Footer from "@/components/shared/Footer";

export default function HomePage() {
  const { currentFarmer, setCurrentFarmerId, refreshFarmers, activeRole } = useApp();
  const router = useRouter();

  function handleStartRegistration() {
    const farmer = createFarmer();
    setCurrentFarmerId(farmer.id);
    refreshFarmers();
    // Defer nav so React commits state before onboarding reads context
    queueMicrotask(() => router.push("/onboarding"));
  }

  const features = [
    { icon: Fingerprint, title: "Biometric Identity", desc: "Secure fingerprint and face capture prevent duplicate registration" },
    { icon: MapPin, title: "GPS Farm Mapping", desc: "Precisely map farm boundaries and record soil & crop data" },
    { icon: ShieldCheck, title: "Digital ID Card", desc: "Instant verifiable farmer ID — HFIP-2026-XXXX format" },
    { icon: FileText, title: "Document Vault", desc: "Store land titles, bank details, and input history securely" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background grid — full height so footer has subtle continuation */}
      <div className="pointer-events-none absolute inset-0 bg-grid-emerald opacity-30 sm:opacity-40" />

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-4 pb-16 pt-10 text-center sm:px-6 sm:pb-20 sm:pt-20 lg:pt-28">
        {/* Pill badge — opacity-0 so hidden until hero-in runs; keyframes in globals.css */}
        <div
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 opacity-0 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 sm:mb-6 sm:px-4"
          style={{ animation: "hero-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards" }}
        >
          <Leaf className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">Phase 1 — Digital Farmer Identity</span>
        </div>

        <h1
          className="text-3xl font-bold tracking-tight text-balance opacity-0 sm:text-5xl lg:text-6xl lg:leading-[1.15]"
          style={{ animation: "hero-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards" }}
        >
          <span className="block leading-tight">Every Farmer Deserves</span>
          <span className="mt-2 block leading-tight text-primary sm:mt-2.5 lg:mt-3">a Digital Identity</span>
        </h1>

        <p
          className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground opacity-0 sm:mt-6 sm:text-lg lg:text-xl"
          style={{ animation: "hero-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards" }}
        >
          HFIP gives every Nigerian farmer a secure, verifiable digital identity card —
          unlocking access to credit, inputs, and government support programmes.
        </p>

        <div
          className="mt-8 flex w-full max-w-sm flex-col gap-3 opacity-0 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center"
          style={{ animation: "hero-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.35s forwards" }}
        >
          {activeRole === "admin" ? (
            <Button size="xl" className="w-full sm:w-auto" asChild>
              <Link href="/admin">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                Open Admin Dashboard
                <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            </Button>
          ) : currentFarmer?.onboardingComplete ? (
            <Button size="xl" className="w-full sm:w-auto" asChild>
              <Link href="/dashboard">
                View My Dashboard <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            </Button>
          ) : currentFarmer ? (
            <Button size="xl" className="w-full sm:w-auto" asChild>
              <Link href="/onboarding">
                Continue Registration <ArrowRight className="h-5 w-5 shrink-0" />
              </Link>
            </Button>
          ) : (
            <Button size="xl" className="w-full sm:w-auto" onClick={handleStartRegistration}>
              Start Registration <ArrowRight className="h-5 w-5 shrink-0" />
            </Button>
          )}
          <Button size="xl" variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/admin">Admin Demo</Link>
          </Button>
        </div>

        {/* Trust badges */}
        <div
          className="mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground opacity-0 sm:mt-10"
          style={{ animation: "hero-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.45s forwards" }}
        >
          {["Federal Ministry of Agriculture", "CBN AgriFinance", "NIRSAL Microfinance"].map(b => (
            <div key={b} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              <span className="truncate">{b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature grid — animated cards */}
      <section className="relative mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8" aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          How HFIP works
        </h2>
        <p
          className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground opacity-0 sm:mb-10"
          style={{ animation: "hero-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards" }}
        >
          How it works
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm opacity-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 sm:p-6"
              style={{
                animation: "card-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards",
                animationDelay: `${0.5 + i * 0.08}s`,
              }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12">
                <f.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
              <h3 className="mt-4 font-semibold tracking-tight sm:text-base">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative border-t border-border bg-muted/30 py-10 sm:py-12" aria-label="Platform stats">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            {[
              { value: "2.5M+", label: "Target Farmers" },
              { value: "37", label: "States Covered" },
              { value: "<2s", label: "Registration Time" },
              { value: "100%", label: "Offline Capable" },
            ].map(s => (
              <div key={s.label} className="transition-transform duration-200 hover:scale-105">
                <p className="text-2xl font-bold text-primary sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
