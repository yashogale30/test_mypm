import type { FitCategory } from "@/lib/types";

const colors: Record<FitCategory, string> = {
  "Strong Match": "bg-emerald-100 text-emerald-800 ring-emerald-200",
  "Partial Match": "bg-amber-100 text-amber-800 ring-amber-200",
  "Weak Match": "bg-red-100 text-red-800 ring-red-200"
};

export function FitBadge({ category }: { category: FitCategory }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ${colors[category]}`}>{category}</span>;
}
