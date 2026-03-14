// components/dashboard/FarmMapPreview.tsx
// Shows a placeholder map card with GPS coordinates.
// Phase 2: replace the inner div with a real Mapbox or Google Maps embed.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Navigation, ExternalLink } from "lucide-react";
import type { FarmInfo } from "@/types";
import { Button } from "@/components/ui/button";

export default function FarmMapPreview({ farmInfo }: { farmInfo: FarmInfo }) {
  const { gpsLat, gpsLng, acreage, cropType, soilType } = farmInfo;
  const hasCoords = gpsLat !== null && gpsLng !== null;

  const googleMapsUrl = hasCoords
    ? `https://maps.google.com/?q=${gpsLat},${gpsLng}`
    : "#";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Farm Location</CardTitle>
          {hasCoords && (
            <Button variant="ghost" size="sm" asChild>
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open in Maps
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Map placeholder */}
        <div className="relative h-48 overflow-hidden bg-emerald-50 dark:bg-emerald-950/20">
          <div className="pointer-events-none absolute inset-0 bg-grid-emerald" />

          {/* Fake map features */}
          <div className="absolute inset-0 flex items-center justify-center">
            {hasCoords ? (
              <div className="flex flex-col items-center gap-2">
                {/* Farm boundary blob */}
                <div className="absolute h-28 w-36 rounded-3xl border-2 border-emerald-500 bg-emerald-500/10" style={{ transform: "rotate(-8deg)" }} />
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="relative z-10 rounded-lg bg-background/90 px-3 py-1.5 text-xs font-semibold shadow backdrop-blur">
                  {gpsLat?.toFixed(4)}°N, {gpsLng?.toFixed(4)}°E
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <Navigation className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground">No GPS location recorded</p>
              </div>
            )}
          </div>
        </div>

        {/* Farm details below map */}
        <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
          {[
            { label: "Size", value: `${acreage} ha` },
            { label: "Crop", value: cropType },
            { label: "Soil", value: soilType || "—" },
          ].map(item => (
            <div key={item.label} className="px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
              <p className="mt-0.5 text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
