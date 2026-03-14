"use client";
// components/onboarding/Step3Farm.tsx
// Farm mapping + details. The map is a placeholder showing GPS coordinates.
// In production, swap the placeholder div for a real Mapbox/Google Maps component.
import { useState } from "react";
import type { FarmInfo } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormField from "@/components/shared/FormField";
import { CROP_TYPES, SOIL_TYPES } from "@/lib/fakeData";
import { MapPin, ArrowRight, ArrowLeft, Navigation, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  data: FarmInfo;
  onNext: (data: FarmInfo) => void;
  onBack: () => void;
}

export default function Step3Farm({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState<FarmInfo>(data);
  const [errors, setErrors] = useState<Partial<Record<keyof FarmInfo, string>>>({});
  const [locating, setLocating] = useState(false);

  function set<K extends keyof FarmInfo>(key: K, val: FarmInfo[K]) {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  }

  // Use browser Geolocation API to auto-fill GPS
  function detectLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported on this device.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        set("gpsLat", pos.coords.latitude);
        set("gpsLng", pos.coords.longitude);
        setLocating(false);
      },
      () => {
        // Demo fallback coordinates (Abuja, Nigeria)
        set("gpsLat", 9.0579);
        set("gpsLng", 7.4951);
        setLocating(false);
      }
    );
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.gpsLat || !form.gpsLng) e.gpsLat = "Please set or detect the farm GPS location";
    if (!form.acreage || form.acreage <= 0) e.acreage = "Enter a valid acreage greater than 0";
    if (!form.cropType) e.cropType = "Please select a crop type";
    if (!form.soilType) e.soilType = "Please select a soil type";
    if (!form.season) e.season = "Please select a season";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const hasGPS = form.gpsLat !== null && form.gpsLng !== null;

  return (
    <div className="animate-fade-in space-y-5">
      {/* Map placeholder */}
      <div className="overflow-hidden rounded-2xl border-2 border-dashed border-border">
        <div className="relative flex h-52 flex-col items-center justify-center gap-3 bg-emerald-50/50 dark:bg-emerald-950/10">
          {/* Fake map grid lines */}
          <div className="pointer-events-none absolute inset-0 bg-grid-emerald opacity-60" />

          {hasGPS ? (
            <div className="relative z-10 flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="rounded-lg bg-background/90 px-3 py-1.5 text-sm font-semibold backdrop-blur">
                <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />
                GPS Set: {form.gpsLat?.toFixed(4)}°N, {form.gpsLng?.toFixed(4)}°E
              </div>
              <p className="text-xs text-muted-foreground">
                🗺 Full map integration (Mapbox/Google Maps) coming in Phase 2
              </p>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center gap-2 text-center">
              <MapPin className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">No GPS location set yet</p>
              <p className="text-xs text-muted-foreground">Tap "Detect My Location" below</p>
            </div>
          )}
        </div>

        <div className="border-t border-border p-3">
          <Button
            size="lg"
            variant={hasGPS ? "outline" : "default"}
            className="w-full"
            onClick={detectLocation}
            disabled={locating}
          >
            <Navigation className={cn("h-4 w-4", locating && "animate-spin")} />
            {locating ? "Detecting location…" : hasGPS ? "Update GPS Location" : "Detect My Location"}
          </Button>
          {errors.gpsLat && <p className="mt-1.5 text-xs font-medium text-destructive">{errors.gpsLat}</p>}
        </div>
      </div>

      {/* Manual GPS entry */}
      <details className="rounded-xl border border-border">
        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
          Enter GPS coordinates manually
        </summary>
        <div className="grid grid-cols-2 gap-3 p-4 pt-2">
          <FormField label="Latitude">
            <Input type="number" step="0.0001" placeholder="9.0579"
              value={form.gpsLat ?? ""} onChange={e => set("gpsLat", parseFloat(e.target.value) || null)} />
          </FormField>
          <FormField label="Longitude">
            <Input type="number" step="0.0001" placeholder="7.4951"
              value={form.gpsLng ?? ""} onChange={e => set("gpsLng", parseFloat(e.target.value) || null)} />
          </FormField>
        </div>
      </details>

      {/* Farm details */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Farm Size (Hectares)" required error={errors.acreage}>
          <Input type="number" step="0.1" min="0" placeholder="e.g. 4.5" inputMode="decimal"
            value={form.acreage || ""} onChange={e => set("acreage", parseFloat(e.target.value) || 0)} />
        </FormField>

        <FormField label="Primary Crop" required error={errors.cropType}>
          <Select value={form.cropType} onValueChange={v => set("cropType", v)}>
            <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
            <SelectContent>
              {CROP_TYPES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Soil Type" required error={errors.soilType}>
          <Select value={form.soilType} onValueChange={v => set("soilType", v)}>
            <SelectTrigger><SelectValue placeholder="Select soil type" /></SelectTrigger>
            <SelectContent>
              {SOIL_TYPES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Growing Season" required error={errors.season}>
          <Select value={form.season} onValueChange={v => set("season", v as FarmInfo["season"])}>
            <SelectTrigger><SelectValue placeholder="Select season" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="wet">Wet Season</SelectItem>
              <SelectItem value="dry">Dry Season</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <FormField label="Expected Yield (kg)" hint="Estimated total harvest for this season">
        <Input type="number" min="0" inputMode="numeric" placeholder="e.g. 2700"
          value={form.expectedYield || ""} onChange={e => set("expectedYield", parseInt(e.target.value) || 0)} />
      </FormField>

      <div className="flex gap-3">
        <Button size="xl" variant="outline" className="flex-1" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" /> Back
        </Button>
        <Button size="xl" className="flex-1" onClick={() => validate() && onNext(form)}>
          Continue <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
