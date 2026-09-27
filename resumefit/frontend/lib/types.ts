export type FitCategory = "Strong Match" | "Partial Match" | "Weak Match";

export interface Qualification {
  claim: string;
  evidence_quote: string;
  verified: boolean;
}

export interface AnalysisInput {
  candidate_name: string;
  target_role: string;
  resume_text: string;
  company_name: string;
  job_title: string;
  job_description: string;
}

export interface Analysis extends AnalysisInput {
  id: number;
  fit_category: FitCategory;
  matching_qualifications: Qualification[];
  missing_requirements: string[];
  explanation: string;
  outreach_message: string;
  reliability_flag: string | null;
  created_at: string;
}

export interface AnalysisSummary {
  id: number;
  candidate_name: string;
  company_name: string;
  job_title: string;
  fit_category: FitCategory;
  created_at: string;
}

export interface ReliabilityResult {
  passed: boolean;
  raw_fit_category: FitCategory;
  raw_explanation: string;
  reasoning: string;
}

export interface FieldErrors { [field: string]: string; }
