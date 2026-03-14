// components/dashboard/ProductivitySummary.tsx
// Shows fake productivity metrics on the farmer dashboard.
// Each KPI card displays a stat with a trend indicator.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wheat, DollarSign, Minus, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PRODUCTIVITY } from "@/lib/fakeData";
import type { FarmInfo } from "@/types";

export default function ProductivitySummary({ farmInfo }: { farmInfo: FarmInfo }) {
  const p = PRODUCTIVITY;
  const yieldPct = Math.round((p.actualYield / p.expectedYield) * 100);

  const stats = [
    {
      label: "Actual Yield",
      value: `${p.actualYield.toLocaleString()} kg`,
      sub: `Target: ${p.expectedYield.toLocaleString()} kg`,
      trend: yieldPct >= 90 ? "up" : "down",
      trendVal: `${yieldPct}% of target`,
      icon: Wheat,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Estimated Revenue",
      value: formatCurrency(p.revenue),
      sub: `Input cost: ${formatCurrency(p.inputCost)}`,
      trend: "up",
      trendVal: `Profit: ${formatCurrency(p.profit)}`,
      icon: DollarSign,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Farm Size",
      value: `${farmInfo.acreage} ha`,
      sub: farmInfo.cropType,
      trend: "neutral",
      trendVal: `${farmInfo.soilType} soil`,
      icon: Activity,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Productivity Summary</h2>
      <p className="text-xs text-muted-foreground -mt-2">Based on Wet Season 2026 data</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(s => (
          <Card key={s.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  s.trend === "up" ? "text-emerald-600" : s.trend === "down" ? "text-red-500" : "text-muted-foreground"
                }`}>
                  {s.trend === "up" ? <TrendingUp className="h-3.5 w-3.5" /> :
                   s.trend === "down" ? <TrendingDown className="h-3.5 w-3.5" /> :
                   <Minus className="h-3.5 w-3.5" />}
                  {s.trendVal}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Yield trend mini chart — pure CSS bars */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Yield Trend (kg)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3 h-24">
            {PRODUCTIVITY.trends.map((t, i) => {
              const max = Math.max(...PRODUCTIVITY.trends.map(x => x.yield));
              const pct = (t.yield / max) * 100;
              const isLast = i === PRODUCTIVITY.trends.length - 1;
              return (
                <div key={t.season} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold text-muted-foreground">{t.yield.toLocaleString()}</span>
                  <div
                    className={`w-full rounded-t-md transition-all ${isLast ? "bg-primary" : "bg-primary/30"}`}
                    style={{ height: `${pct}%` }}
                  />
                  <span className="text-[9px] text-center text-muted-foreground leading-tight">{t.season}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
