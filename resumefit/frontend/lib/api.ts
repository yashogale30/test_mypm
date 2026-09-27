import type { Analysis, AnalysisInput, AnalysisSummary, FieldErrors, ReliabilityResult } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(message: string, public readonly fieldErrors: FieldErrors = {}) {
    super(message);
  }
}

interface ValidationIssue { loc: Array<string | number>; msg: string; }
interface ErrorBody { detail?: string | ValidationIssue[]; }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  } catch {
    throw new ApiError("Unable to reach the ResumeFit API. Check that the backend is running.");
  }
  if (!response.ok) {
    const body = await response.json().catch((): ErrorBody => ({})) as ErrorBody;
    if (Array.isArray(body.detail)) {
      const fieldErrors: FieldErrors = {};
      body.detail.forEach((issue) => { fieldErrors[String(issue.loc.at(-1) ?? "form")] = issue.msg; });
      throw new ApiError("Please correct the highlighted fields.", fieldErrors);
    }
    throw new ApiError(typeof body.detail === "string" ? body.detail : "The request could not be completed.");
  }
  return response.json() as Promise<T>;
}

export const createAnalysis = (payload: AnalysisInput): Promise<Analysis> => request("/api/analyze", { method: "POST", body: JSON.stringify(payload) });
export const getAnalysis = (id: string): Promise<Analysis> => request(`/api/analyses/${id}`);
export const getAnalyses = (): Promise<AnalysisSummary[]> => request("/api/analyses");
export const updateOutreach = (id: number, outreach_message: string): Promise<Analysis> => request(`/api/analyses/${id}`, { method: "PATCH", body: JSON.stringify({ outreach_message }) });
export const runReliability = (job_title: string, job_description: string): Promise<ReliabilityResult> => request("/api/reliability-check", { method: "POST", body: JSON.stringify({ job_title, job_description }) });
