// Generates a unique farmer ID: HFIP-2026-0042
// In production this comes from the NestJS backend.
export function generateFarmerId(count: number): string {
  const year = new Date().getFullYear();
  const seq = String(count + 1).padStart(4, "0");
  return `HFIP-${year}-${seq}`;
}
