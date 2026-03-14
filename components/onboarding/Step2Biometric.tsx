"use client";
// components/onboarding/Step2Biometric.tsx
// Simulates biometric capture. In production, this integrates with
// a fingerprint SDK or camera API. For Phase 1 we simulate the process.
import { useState } from "react";
import type { BiometricData } from "@/types";
import { Button } from "@/components/ui/button";
import { Fingerprint, Camera, CheckCircle2, Upload, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: BiometricData;
  onNext: (data: BiometricData) => void;
  onBack: () => void;
}

export default function Step2Biometric({ data, onNext, onBack }: Props) {
  const [bio, setBio] = useState<BiometricData>(data);
  const [capturing, setCapturing] = useState<"fingerprint" | "face" | null>(null);

  // Simulates a 2-second capture delay
  function simulate(type: "fingerprint" | "face") {
    setCapturing(type);
    setTimeout(() => {
      setBio(b => ({
        ...b,
        fingerprintCaptured: type === "fingerprint" ? true : b.fingerprintCaptured,
        faceCaptured: type === "face" ? true : b.faceCaptured,
      }));
      setCapturing(null);
    }, 2000);
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setBio(b => ({ ...b, photoDataUrl: ev.target?.result as string, faceCaptured: true }));
    };
    reader.readAsDataURL(file);
  }

  const canContinue = bio.fingerprintCaptured || bio.faceCaptured;

  return (
    <div className="animate-fade-in space-y-6">
      <p className="text-sm text-muted-foreground">
        Your biometric data helps prevent duplicate registrations and keeps your identity secure.
        Capture at least one of the options below.
      </p>

      {/* Fingerprint */}
      <div className={cn(
        "relative rounded-2xl border-2 p-6 transition-all",
        bio.fingerprintCaptured ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-border"
      )}>
        {bio.fingerprintCaptured && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Captured
          </div>
        )}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className={cn(
            "flex h-20 w-20 items-center justify-center rounded-full",
            bio.fingerprintCaptured ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-muted",
            !bio.fingerprintCaptured && "animate-pulse-ring"
          )}>
            <Fingerprint className={cn("h-10 w-10", bio.fingerprintCaptured ? "text-emerald-600" : "text-muted-foreground")} />
          </div>
          <div>
            <h3 className="text-base font-semibold">Fingerprint Capture</h3>
            <p className="mt-1 text-xs text-muted-foreground">Place your right thumb on the fingerprint scanner</p>
          </div>
          <Button
            size="lg"
            variant={bio.fingerprintCaptured ? "secondary" : "default"}
            disabled={capturing === "fingerprint"}
            onClick={() => simulate("fingerprint")}
            className="w-full max-w-xs"
          >
            {capturing === "fingerprint" ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Scanning…</>
            ) : bio.fingerprintCaptured ? (
              <><CheckCircle2 className="h-4 w-4" /> Re-capture</>
            ) : (
              <><Fingerprint className="h-4 w-4" /> Capture Fingerprint</>
            )}
          </Button>
        </div>
      </div>

      {/* Face / Photo */}
      <div className={cn(
        "relative rounded-2xl border-2 p-6 transition-all",
        bio.faceCaptured ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20" : "border-border"
      )}>
        {bio.faceCaptured && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <CheckCircle2 className="h-4 w-4" /> Captured
          </div>
        )}
        <div className="flex flex-col items-center gap-4 text-center">
          {bio.photoDataUrl ? (
            // Show uploaded photo preview
            <img src={bio.photoDataUrl} alt="Farmer photo" className="h-20 w-20 rounded-full object-cover ring-2 ring-emerald-500" />
          ) : (
            <div className={cn("flex h-20 w-20 items-center justify-center rounded-full", bio.faceCaptured ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-muted")}>
              <Camera className={cn("h-10 w-10", bio.faceCaptured ? "text-emerald-600" : "text-muted-foreground")} />
            </div>
          )}
          <div>
            <h3 className="text-base font-semibold">Face / Photo Capture</h3>
            <p className="mt-1 text-xs text-muted-foreground">Look directly at the camera and hold still</p>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Button size="lg" variant={bio.faceCaptured ? "secondary" : "default"}
              disabled={capturing === "face"} onClick={() => simulate("face")} className="w-full">
              {capturing === "face" ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Capturing…</>
              ) : bio.faceCaptured ? (
                <><CheckCircle2 className="h-4 w-4" /> Re-capture</>
              ) : (
                <><Camera className="h-4 w-4" /> Capture Face</>
              )}
            </Button>
            {/* File upload fallback */}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
              <Upload className="h-4 w-4" />
              Upload photo from device
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>
        </div>
      </div>

      {!canContinue && (
        <p className="text-center text-xs font-medium text-amber-600 dark:text-amber-400">
          ⚠ Please capture at least a fingerprint or face photo to continue.
        </p>
      )}

      <div className="flex gap-3">
        <Button size="xl" variant="outline" className="flex-1" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>
        <Button size="xl" className="flex-1" disabled={!canContinue} onClick={() => onNext(bio)}>
          Continue <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
