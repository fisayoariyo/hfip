// components/dashboard/DigitalIDCard.tsx
// The star of the farmer dashboard — their digital identity card.
// Styled like a premium physical card with gradient and shine effect.
import type { Farmer } from "@/types";
import { Leaf, MapPin, Fingerprint, CheckCircle2, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DigitalIDCard({ farmer }: { farmer: Farmer }) {
  const { personalInfo: p, farmInfo: f, id, status, createdAt, biometric } = farmer;
  const fullName = `${p.firstName} ${p.lastName}`;

  return (
    <div className="id-card-shine relative w-full max-w-sm overflow-hidden rounded-3xl gradient-emerald p-[2px] shadow-2xl shadow-emerald-500/30">
      {/* Inner card */}
      <div className="relative rounded-[22px] bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 p-6 text-white">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0 rounded-[22px] bg-grid-emerald opacity-20" />

        {/* Top row */}
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-200">HFIP</p>
              <p className="text-[9px] text-emerald-300">Federal Republic of Nigeria</p>
            </div>
          </div>
          {status === "verified" && (
            <div className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
              <CheckCircle2 className="h-3 w-3" /> Verified
            </div>
          )}
        </div>

        {/* Photo area + name */}
        <div className="relative mt-5 flex items-end gap-4">
          {/* Avatar / photo */}
          <div className="relative">
            {biometric.photoDataUrl ? (
              <img src={biometric.photoDataUrl} alt={fullName}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white/30" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-2 ring-white/20 text-3xl font-bold text-white/80">
                {p.firstName.charAt(0)}{p.lastName.charAt(0)}
              </div>
            )}
            {biometric.fingerprintCaptured && (
              <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow">
                <Fingerprint className="h-3.5 w-3.5 text-emerald-600" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="truncate text-xl font-bold leading-tight">{fullName}</p>
            <p className="mt-0.5 text-xs text-emerald-200">{p.gender === "male" ? "Male" : p.gender === "female" ? "Female" : "Other"}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-200">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{p.lga}, {p.state}</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-white/20" />

        {/* Farm info row */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-emerald-300">Crop</p>
            <p className="mt-0.5 text-sm font-semibold">{f.cropType}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-emerald-300">Farm Size</p>
            <p className="mt-0.5 text-sm font-semibold">{f.acreage} ha</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-emerald-300">State</p>
            <p className="mt-0.5 text-sm font-semibold">{p.state}</p>
          </div>
        </div>

        {/* Bottom: ID + date */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-emerald-300">Farmer ID</p>
            <p className="font-mono text-lg font-bold tracking-widest">{id}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-emerald-300">Registered</p>
            <div className="flex items-center gap-1 text-xs">
              <Calendar className="h-3 w-3" />
              {formatDate(createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
