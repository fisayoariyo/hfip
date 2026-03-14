"use client";
// components/admin/FarmerTable.tsx
// Main admin table showing all registered farmers.
// Features: search, filter by status, sort by name, verify/reject actions, CSV export.
import { useState, useMemo } from "react";
import type { Farmer } from "@/types";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/shared/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { exportCSV } from "@/lib/storage";
import {
  Search, Download, CheckCircle2, XCircle, Eye, Filter,
  ChevronUp, ChevronDown, Users
} from "lucide-react";

type SortField = "name" | "id" | "acreage" | "date";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "pending" | "verified" | "rejected";

export default function FarmerTable() {
  const { farmers, appVerifyFarmer, appRejectFarmer } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Farmer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  }

  const filtered = useMemo(() => {
    let arr = [...farmers];
    // Search by name, ID, phone
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(f =>
        `${f.personalInfo.firstName} ${f.personalInfo.lastName}`.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.personalInfo.phone.includes(q)
      );
    }
    // Status filter
    if (statusFilter !== "all") arr = arr.filter(f => f.status === statusFilter);
    // Sort
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortField === "name") cmp = `${a.personalInfo.firstName}${a.personalInfo.lastName}`.localeCompare(`${b.personalInfo.firstName}${b.personalInfo.lastName}`);
      else if (sortField === "id") cmp = a.id.localeCompare(b.id);
      else if (sortField === "acreage") cmp = a.farmInfo.acreage - b.farmInfo.acreage;
      else if (sortField === "date") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [farmers, search, statusFilter, sortField, sortDir]);

  function handleExport() {
    const csv = exportCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `HFIP-farmers-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ChevronUp className="h-3 w-3 opacity-30" />;
    return sortDir === "asc" ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />;
  }

  const counts = {
    all: farmers.length,
    pending: farmers.filter(f => f.status === "pending").length,
    verified: farmers.filter(f => f.status === "verified").length,
    rejected: farmers.filter(f => f.status === "rejected").length,
  };

  return (
    <div className="space-y-4">
      {/* Summary stat pills */}
      <div className="flex flex-wrap gap-2">
        {(["all","pending","verified","rejected"] as StatusFilter[]).map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all capitalize
              ${statusFilter === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"}`}>
            <Users className="h-3 w-3" />
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">
              {filtered.length} {filtered.length === 1 ? "Farmer" : "Farmers"} {search || statusFilter !== "all" ? "(filtered)" : ""}
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64 sm:flex-none">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, ID, phone…" className="pl-9 h-11" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" size="default" onClick={handleExport} className="shrink-0">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {[
                    { label: "Farmer", field: "name" as SortField },
                    { label: "ID", field: "id" as SortField },
                    { label: "Phone", field: null },
                    { label: "State", field: null },
                    { label: "Crop", field: null },
                    { label: "Farm Size", field: "acreage" as SortField },
                    { label: "Status", field: null },
                    { label: "Registered", field: "date" as SortField },
                    { label: "Actions", field: null },
                  ].map(col => (
                    <th key={col.label}
                      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground ${col.field ? "cursor-pointer hover:text-foreground" : ""}`}
                      onClick={() => col.field && toggleSort(col.field)}>
                      <div className="flex items-center gap-1">
                        {col.label}
                        {col.field && <SortIcon field={col.field} />}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="py-12 text-center text-muted-foreground">No farmers found</td></tr>
                ) : filtered.map(f => (
                  <tr key={f.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {f.personalInfo.firstName.charAt(0)}{f.personalInfo.lastName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{f.personalInfo.firstName} {f.personalInfo.lastName}</p>
                          <p className="text-xs text-muted-foreground">{f.personalInfo.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><code className="font-mono text-xs bg-muted px-2 py-1 rounded">{f.id}</code></td>
                    <td className="px-4 py-3 text-muted-foreground">{f.personalInfo.phone}</td>
                    <td className="px-4 py-3">{f.personalInfo.state}</td>
                    <td className="px-4 py-3">{f.farmInfo.cropType}</td>
                    <td className="px-4 py-3">{f.farmInfo.acreage} ha</td>
                    <td className="px-4 py-3"><StatusBadge status={f.status} /></td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(f.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Button size="sm" variant="ghost" onClick={() => { setSelected(f); setDialogOpen(true); }}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {f.status !== "verified" && (
                          <Button size="sm" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            onClick={() => appVerifyFarmer(f.id)}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        )}
                        {f.status !== "rejected" && (
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => appRejectFarmer(f.id)}>
                            <XCircle className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 p-4 md:hidden">
            {filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No farmers found</p>
            ) : filtered.map(f => (
              <div key={f.id} className="rounded-xl border border-border p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {f.personalInfo.firstName.charAt(0)}{f.personalInfo.lastName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{f.personalInfo.firstName} {f.personalInfo.lastName}</p>
                      <p className="font-mono text-xs text-muted-foreground">{f.id}</p>
                    </div>
                  </div>
                  <StatusBadge status={f.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-muted-foreground">State: </span>{f.personalInfo.state}</div>
                  <div><span className="text-muted-foreground">Crop: </span>{f.farmInfo.cropType}</div>
                  <div><span className="text-muted-foreground">Size: </span>{f.farmInfo.acreage} ha</div>
                  <div><span className="text-muted-foreground">Phone: </span>{f.personalInfo.phone}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => { setSelected(f); setDialogOpen(true); }}>
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  {f.status !== "verified" && (
                    <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => appVerifyFarmer(f.id)}>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Verify
                    </Button>
                  )}
                  {f.status !== "rejected" && (
                    <Button size="sm" variant="destructive" className="flex-1" onClick={() => appRejectFarmer(f.id)}>
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.personalInfo.firstName} {selected.personalInfo.lastName}</DialogTitle>
                <DialogDescription className="font-mono">{selected.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="mb-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Personal Info</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["Phone", selected.personalInfo.phone],
                      ["Gender", selected.personalInfo.gender],
                      ["DOB", selected.personalInfo.dob || "—"],
                      ["State", selected.personalInfo.state],
                      ["LGA", selected.personalInfo.lga],
                      ["Next of Kin", selected.personalInfo.nextOfKin],
                    ].map(([k, v]) => (
                      <div key={k}><span className="text-muted-foreground">{k}: </span><span className="font-medium">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Farm Details</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["Crop", selected.farmInfo.cropType],
                      ["Acreage", `${selected.farmInfo.acreage} ha`],
                      ["Soil", selected.farmInfo.soilType],
                      ["Season", selected.farmInfo.season],
                      ["Exp. Yield", `${selected.farmInfo.expectedYield} kg`],
                      ["GPS", selected.farmInfo.gpsLat ? `${selected.farmInfo.gpsLat?.toFixed(4)}, ${selected.farmInfo.gpsLng?.toFixed(4)}` : "—"],
                    ].map(([k, v]) => (
                      <div key={k}><span className="text-muted-foreground">{k}: </span><span className="font-medium">{v}</span></div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Biometric</p>
                  <div className="flex gap-3">
                    <span className={`text-xs font-medium ${selected.biometric.fingerprintCaptured ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {selected.biometric.fingerprintCaptured ? "✓" : "✗"} Fingerprint
                    </span>
                    <span className={`text-xs font-medium ${selected.biometric.faceCaptured ? "text-emerald-600" : "text-muted-foreground"}`}>
                      {selected.biometric.faceCaptured ? "✓" : "✗"} Face
                    </span>
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Documents</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ["Land Title", selected.documents.landTitleNumber || "—"],
                      ["Bank", selected.documents.bankName || "—"],
                      ["Account", selected.documents.accountNumber || "—"],
                      ["Cooperative", selected.documents.cooperativeName || "—"],
                    ].map(([k, v]) => (
                      <div key={k}><span className="text-muted-foreground">{k}: </span><span className="font-medium">{v}</span></div>
                    ))}
                  </div>
                  {selected.documents.inputsUsed.length > 0 && (
                    <p className="mt-2"><span className="text-muted-foreground">Inputs: </span>{selected.documents.inputsUsed.join(", ")}</p>
                  )}
                </div>
              </div>
              <DialogFooter className="gap-2">
                {selected.status !== "verified" && (
                  <Button className="flex-1" onClick={() => { appVerifyFarmer(selected.id); setDialogOpen(false); }}>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Verify
                  </Button>
                )}
                {selected.status !== "rejected" && (
                  <Button variant="destructive" className="flex-1" onClick={() => { appRejectFarmer(selected.id); setDialogOpen(false); }}>
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
