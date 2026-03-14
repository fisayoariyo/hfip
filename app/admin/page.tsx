"use client";
// app/admin/page.tsx
// Admin dashboard. Shows summary KPIs and the full farmer management table.
import { useApp } from "@/context/AppContext";
import FarmerTable from "@/components/admin/FarmerTable";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, Clock, XCircle, TrendingUp } from "lucide-react";

export default function AdminPage() {
  const { farmers } = useApp();

  const verified = farmers.filter(f => f.status === "verified").length;
  const pending  = farmers.filter(f => f.status === "pending").length;
  const rejected = farmers.filter(f => f.status === "rejected").length;
  const complete = farmers.filter(f => f.onboardingComplete).length;
  const totalAcreage = farmers.reduce((sum, f) => sum + (f.farmInfo.acreage || 0), 0);

  const kpis = [
    { label: "Total Registered", value: farmers.length, icon: Users,         color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "Verified",         value: verified,        icon: CheckCircle2,  color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "Pending Review",   value: pending,         icon: Clock,         color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-950/30" },
    { label: "Rejected",         value: rejected,        icon: XCircle,       color: "text-red-500",     bg: "bg-red-50 dark:bg-red-950/30" },
    { label: "Total Farmland",   value: `${totalAcreage.toFixed(1)} ha`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/30" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Hashmar Farmer Identity Platform</p>
        <h1 className="text-2xl font-bold sm:text-3xl">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage farmer registrations and verifications</p>
      </div>

      {/* KPI cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map(k => (
          <Card key={k.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${k.bg}`}>
                <k.icon className={`h-5 w-5 ${k.color}`} />
              </div>
              <p className="text-2xl font-bold">{k.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Onboarding completion mini-stat */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">Onboarding Completion Rate</span>
            <span className="font-mono font-bold text-primary">{farmers.length ? Math.round((complete / farmers.length) * 100) : 0}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${farmers.length ? (complete / farmers.length) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{complete} of {farmers.length} farmers completed all 4 steps</p>
        </div>
      </div>

      {/* Farmer table */}
      <FarmerTable />
    </div>
  );
}
