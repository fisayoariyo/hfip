// components/shared/StatusBadge.tsx
// Renders a coloured pill for farmer verification status
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

type Status = "verified" | "pending" | "rejected";

export default function StatusBadge({ status }: { status: Status }) {
  const map = {
    verified: { label: "Verified", icon: CheckCircle2, variant: "verified" as const },
    pending:  { label: "Pending",  icon: Clock,       variant: "pending"  as const },
    rejected: { label: "Rejected", icon: XCircle,     variant: "rejected" as const },
  };
  const { label, icon: Icon, variant } = map[status];
  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
