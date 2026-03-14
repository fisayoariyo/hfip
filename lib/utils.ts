import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// cn() merges Tailwind class names — used everywhere in shadcn components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
}
