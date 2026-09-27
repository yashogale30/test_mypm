"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, createAnalysis } from "@/lib/api";
import type { AnalysisInput, FieldErrors } from "@/lib/types";

const initialForm: AnalysisInput = { candidate_name: "", target_role: "", resume_text: "", company_name: "", job_title: "", job_description: "" };
const labels: Record<keyof AnalysisInput, string> = { candidate_name: "Candidate name", target_role: "Target role", resume_text: "Resume text", company_name: "Company name", job_title: "Job title", job_description: "Job description" };

export default function HomePage() {
  const router = useRouter();
  const [form, setForm] = useState<AnalysisInput>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [requestError, setRequestError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (field: keyof AnalysisInput, value: string): void => { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: "" })); };
  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault(); setRequestError("");
    const clientErrors: FieldErrors = {};
    (Object.keys(form) as Array<keyof AnalysisInput>).forEach((field) => { if (!form[field].trim()) clientErrors[field] = `${labels[field]} is required.`; });
    if (Object.keys(clientErrors).length) { setErrors(clientErrors); return; }
    setLoading(true);
    try { const analysis = await createAnalysis(form); router.push(`/analysis/${analysis.id}`); }
    catch (error: unknown) { if (error instanceof ApiError) { setErrors(error.fieldErrors); setRequestError(error.message); } else setRequestError("An unexpected error occurred. Please try again."); }
    finally { setLoading(false); }
  };
  const field = (name: keyof AnalysisInput, large = false) => <label className={large ? "md:col-span-2" : ""}><span className="mb-1 block text-sm font-medium text-slate-700">{labels[name]}</span>{large ? <textarea rows={name === "resume_text" ? 12 : 9} value={form[name]} onChange={(event) => update(name, event.target.value)} aria-invalid={Boolean(errors[name])} /> : <input value={form[name]} onChange={(event) => update(name, event.target.value)} aria-invalid={Boolean(errors[name])} />}{errors[name] && <span className="mt-1 block text-sm text-red-600">{errors[name]}</span>}</label>;
  return <section><div className="mb-8 max-w-2xl"><h1 className="text-3xl font-bold tracking-tight">Evidence-based resume fit</h1><p className="mt-2 text-slate-600">Evaluate a candidate against a role, with every claimed qualification checked against their resume.</p></div><form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="grid gap-5 md:grid-cols-2">{field("candidate_name")}{field("target_role")}{field("company_name")}{field("job_title")}{field("resume_text", true)}{field("job_description", true)}</div>{requestError && <p role="alert" className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-700">{requestError}</p>}<div className="mt-6 flex items-center gap-3"><button type="submit" disabled={loading} className="bg-indigo-600 px-5 py-2.5 text-sm text-white hover:bg-indigo-700">{loading ? "Analyzing resume…" : "Analyze fit"}</button>{loading && <div aria-label="Loading" className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />}</div></form></section>;
}
