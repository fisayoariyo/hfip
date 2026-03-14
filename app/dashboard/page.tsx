"use client";
// app/dashboard/page.tsx
// The farmer's personal dashboard. Shows their digital ID card,
// farm map preview, and productivity statistics.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import DigitalIDCard from "@/components/dashboard/DigitalIDCard";
import FarmMapPreview from "@/components/dashboard/FarmMapPreview";
import ProductivitySummary from "@/components/dashboard/ProductivitySummary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/shared/StatusBadge";
import { Download, Share2, ClipboardList, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { createFarmer } from "@/lib/storage";

export default function DashboardPage() {
  const router = useRouter();
  const { currentFarmer, setCurrentFarmerId, saveFarmer } = useApp();

  useEffect(() => {
    // If no completed farmer, redirect to onboarding
    if (!currentFarmer) {
      router.replace("/onboarding");
    }
  }, [currentFarmer, router]);

  if (!currentFarmer) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Allow switching to a different demo farmer (useful for testing)
  function handleNewRegistration() {
    const f = createFarmer();
    setCurrentFarmerId(f.id);
    router.push("/onboarding");
  }

  const { personalInfo: p } = currentFarmer;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="text-2xl font-bold sm:text-3xl">{p.firstName} {p.lastName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <code className="rounded-lg bg-muted px-3 py-1 font-mono text-sm font-semibold">{currentFarmer.id}</code>
            <StatusBadge status={currentFarmer.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-3.5 w-3.5 mr-1.5" /> Download ID
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleNewRegistration}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> New Registration (Demo)
          </Button>
        </div>
      </div>

      {/* Pending warning banner */}
      {currentFarmer.status === "pending" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20">
          <ClipboardList className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-400">Verification Pending</p>
            <p className="mt-0.5 text-sm text-amber-700 dark:text-amber-300">
              Your registration has been received. An admin will verify your details within 2–3 working days.
              You will be notified via SMS to {p.phone}.
            </p>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left column: ID card + quick info */}
        <div className="flex flex-col items-center gap-5 lg:items-start">
          <DigitalIDCard farmer={currentFarmer} />

          {/* Quick profile details */}
          <Card className="w-full max-w-sm lg:max-w-none">
            <CardContent className="p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile Details</p>
              <dl className="space-y-2.5 text-sm">
                {[
                  ["Phone", p.phone],
                  ["Gender", p.gender],
                  ["State / LGA", `${p.state} / ${p.lga}`],
                  ["Next of Kin", p.nextOfKin],
                  ["Registered", formatDate(currentFarmer.createdAt)],
                  ["Bank", currentFarmer.documents.bankName || "—"],
                  ["Cooperative", currentFarmer.documents.cooperativeName || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-medium text-right">{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Right column: map + productivity */}
        <div className="space-y-6 animate-fade-in">
          <FarmMapPreview farmInfo={currentFarmer.farmInfo} />
          <ProductivitySummary farmInfo={currentFarmer.farmInfo} />
        </div>
      </div>
    </div>
  );
}
