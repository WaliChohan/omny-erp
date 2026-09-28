export function cn(...inputs: any[]) {
  return inputs.flat().filter(Boolean).join(" ");
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return "$0";
  const rounded = Math.round(Number(amount));
  return `$${rounded.toLocaleString("en-US")}`;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}
