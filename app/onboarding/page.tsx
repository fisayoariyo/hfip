"use client";
// app/onboarding/page.tsx
// The 4-step onboarding wizard. Manages which step is active,
// persists progress to localStorage after each step.
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import type { Farmer, WizardStep } from "@/types";
import { createFarmer } from "@/lib/storage";

import Step1Personal from "@/components/onboarding/Step1Personal";
import Step2Biometric from "@/components/onboarding/Step2Biometric";
import Step3Farm from "@/components/onboarding/Step3Farm";
import Step4Documents from "@/components/onboarding/Step4Documents";

import { Progress } from "@/components/ui/progress";
import { CheckCircle2, User, Fingerprint, MapPin, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { num: 1, label: "Personal Info",    icon: User },
  { num: 2, label: "Biometrics",       icon: Fingerprint },
  { num: 3, label: "Farm Mapping",     icon: MapPin },
  { num: 4, label: "Documents",        icon: FileText },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { currentFarmer, saveFarmer, setCurrentFarmerId } = useApp();

  // Active step (1-4)
  const [step, setStep] = useState<WizardStep>(1);
  const [submitting, setSubmitting] = useState(false);

  // If no current farmer, create one on mount
  useEffect(() => {
    if (!currentFarmer) {
      const f = createFarmer();
      setCurrentFarmerId(f.id);
    } else {
      // Resume from where they left off
      const resume = Math.min((currentFarmer.completedStep || 0) + 1, 4) as WizardStep;
      setStep(resume);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If already complete, redirect to dashboard
  useEffect(() => {
    if (currentFarmer?.onboardingComplete) router.replace("/dashboard");
  }, [currentFarmer, router]);

  // ── Step completion handlers ─────────────────────────────
  function completeStep(updates: Partial<Farmer>, nextStep: WizardStep | "done") {
    if (!currentFarmer) return;
    const updated: Farmer = { ...currentFarmer, ...updates };
    if (nextStep === "done") {
      updated.onboardingComplete = true;
      updated.completedStep = 4;
    } else {
      updated.completedStep = Math.max(updated.completedStep, step) as Farmer["completedStep"];
    }
    saveFarmer(updated);
    if (nextStep !== "done") setStep(nextStep);
  }

  function handleStep1(personalInfo: Farmer["personalInfo"]) {
    completeStep({ personalInfo }, 2);
  }
  function handleStep2(biometric: Farmer["biometric"]) {
    completeStep({ biometric }, 3);
  }
  function handleStep3(farmInfo: Farmer["farmInfo"]) {
    completeStep({ farmInfo }, 4);
  }
  async function handleStep4(documents: Farmer["documents"]) {
    setSubmitting(true);
    // Simulate API call delay
    await new Promise(r => setTimeout(r, 1500));
    completeStep({ documents }, "done");
    setSubmitting(false);
    router.push("/dashboard");
  }

  if (!currentFarmer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const progressPct = ((step - 1) / 4) * 100;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="font-mono text-xs font-semibold text-muted-foreground">{currentFarmer.id}</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Farmer Registration</h1>
        <p className="mt-1 text-sm text-muted-foreground">Step {step} of 4 — {STEPS[step - 1].label}</p>
      </div>

      {/* Progress bar */}
      <Progress value={progressPct} className="mb-6 h-2" />

      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((s, i) => {
          const done = s.num < step;
          const active = s.num === step;
          return (
            <div key={s.num} className="flex flex-1 flex-col items-center gap-1.5">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                done  ? "border-primary bg-primary text-white" :
                active ? "border-primary bg-primary/10 text-primary" :
                         "border-border bg-background text-muted-foreground"
              )}>
                {done ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
              </div>
              <span className={cn("hidden text-[10px] font-semibold text-center sm:block",
                active ? "text-primary" : done ? "text-muted-foreground" : "text-muted-foreground/60"
              )}>
                {s.label}
              </span>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="absolute" style={{ display: "none" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="mb-6 text-lg font-semibold">{STEPS[step - 1].label}</h2>

        {step === 1 && <Step1Personal data={currentFarmer.personalInfo} onNext={handleStep1} />}
        {step === 2 && <Step2Biometric data={currentFarmer.biometric} onNext={handleStep2} onBack={() => setStep(1)} />}
        {step === 3 && <Step3Farm data={currentFarmer.farmInfo} onNext={handleStep3} onBack={() => setStep(2)} />}
        {step === 4 && <Step4Documents data={currentFarmer.documents} onSubmit={handleStep4} onBack={() => setStep(3)} isSubmitting={submitting} />}
      </div>
    </div>
  );
}
