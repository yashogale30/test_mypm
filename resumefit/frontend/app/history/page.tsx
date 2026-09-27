"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, getAnalyses } from "@/lib/api";
import type { AnalysisSummary } from "@/lib/types";
import { FitBadge } from "@/components/FitBadge";

export default function HistoryPage() {
  const [items, setItems] = useState<AnalysisSummary[] | null>(null); const [error, setError] = useState("");
  useEffect(() => { let active = true; getAnalyses().then((result) => { if (active) setItems(result); }).catch((cause: unknown) => { if (active) setError(cause instanceof ApiError ? cause.message : "Unable to load analysis history."); }); return () => { active = false; }; }, []);
  return <section><h1 className="text-3xl font-bold">Analysis history</h1><p className="mt-2 text-slate-600">Your most recent evaluations, kept lightweight for quick review.</p>{error && <p role="alert" className="mt-6 rounded-md bg-red-50 p-4 text-red-700">{error}</p>}{!items && !error && <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-200" />}{items && <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-slate-600"><tr><th className="px-5 py-3 font-medium">Candidate</th><th className="px-5 py-3 font-medium">Company</th><th className="px-5 py-3 font-medium">Role</th><th className="px-5 py-3 font-medium">Fit</th><th className="px-5 py-3 font-medium">Date</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50"><td className="px-5 py-4 font-medium"><Link className="text-indigo-700 hover:underline" href={`/analysis/${item.id}`}>{item.candidate_name}</Link></td><td className="px-5 py-4">{item.company_name}</td><td className="px-5 py-4">{item.job_title}</td><td className="px-5 py-4"><FitBadge category={item.fit_category} /></td><td className="px-5 py-4 text-slate-600">{new Date(item.created_at).toLocaleDateString()}</td></tr>)}{!items.length && <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-500">No analyses yet. Start on the Home page.</td></tr>}</tbody></table></div>}</section>;
}
