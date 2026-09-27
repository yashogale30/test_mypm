# ResumeFit

ResumeFit evaluates how a candidate's resume maps to a job description, creates evidence-backed findings with Gemini, and drafts a recruiter outreach email. Every qualification claim is retained with its source quote and is deterministically marked verified or unverified before it reaches the UI.

## Setup

Requirements: Python 3.11+ and Node.js 20+.

1. Create environment files from the examples.

   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env.local
   ```

2. Set `GEMINI_API_KEY` in `backend/.env`. `DATABASE_PATH` is a SQLite path and defaults to `./resumefit.db` relative to the backend working directory. `NEXT_PUBLIC_API_URL` must point at the API, normally `http://localhost:8000`.

3. Start the API from `backend`.

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

4. In a separate terminal, start the frontend from `frontend`.

   ```bash
   npm install
   npm run dev
   ```

Open `http://localhost:3000`.

Run the backend quote-verification tests from `backend` with `pytest`.

## Quote verification design

Gemini is required to return a verbatim quote for every proposed matching qualification via native structured JSON output. The backend independently normalizes whitespace and case and looks for an exact substring in the resume. If that fails, it compares sliding windows near the quote length with RapidFuzz at an 85% similarity threshold. A claim is visible even if verification fails, but the interface explicitly marks it “Unverified, please review”; this preserves the audit trail rather than hiding a potentially important model error. Outreach generation receives only verified qualifications.

## Reliability check design

The Reliability page submits a job title and description against a fixed adversarial resume that attempts to override the evaluator. The endpoint does not write to SQLite. It evaluates the structured response with deterministic rules: it fails a Strong Match, any reported matching qualification (the adversarial text contains no job-relevant evidence), or an explanation that affirmatively states requirements are met. The raw fit category and explanation are returned for inspection; no second model is used to judge the first.

## Known limitations

- Quote verification checks textual support, not whether a verified quote is genuinely relevant to the specific job requirement; recruiter review remains important.
- Fuzzy matching is intentionally bounded around quote length and can be sensitive to heavily reformatted or OCR-corrupted resumes.
- Gemini availability, model behaviour, quotas, and latency are external dependencies. The API surfaces user-readable timeout, connectivity, and invalid-response failures.
- This assessment implementation is intentionally single-user: it has no authentication, authorization, email delivery, or deployment configuration.
