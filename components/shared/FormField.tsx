// components/shared/FormField.tsx
// Wraps a Label + Input + optional error message.
// Large fonts for low-literacy users on low-end Android.
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  hint?: string;
}

export default function FormField({ label, error, required, children, className, hint }: Props) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-sm font-semibold text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {children}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
