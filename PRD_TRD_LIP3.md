# Product Requirements + Technical Requirements Document

## 1) Document Metadata

- Project: App Review Intelligence Pipeline
- Repository: `LIP--3`
- Version: 1.0
- Date: 2026-04-26
- Audience: Product, Engineering, Data, QA, Operations

---

## 2) Executive Summary

This project is an automated weekly pipeline that converts raw App Store and Google Play reviews into concise product intelligence. The system scrapes public reviews, groups feedback into actionable themes using an LLM, generates a short executive note, and drafts delivery through a remote MCP-backed email and Google Docs workflow.

The primary value is reducing manual review effort while improving issue visibility and product prioritization speed. The pipeline is designed for reliability (retries, partial-failure handling), safety (PII scrubbing), and idempotency (run ledger for duplicate-send prevention).

---

## 3) Problem Statement

Product and growth teams struggle to read hundreds of weekly reviews manually. Key pain points:

- Important trends are buried in volume.
- Teams react late to recurring user issues.
- Insights are inconsistent and person-dependent.
- Leadership lacks a quick recurring signal.

The project solves this by automating collection, synthesis, and delivery of recurring review intelligence.

---

## 4) Product Requirements (PRD)

## 4.1 Product Goals

- Produce a weekly, scannable review pulse.
- Identify at most five concrete product themes.
- Generate a note under 250 words with actionable suggestions.
- Avoid personal data exposure in generated outputs.
- Prevent duplicate weekly sends.

## 4.2 Users and Stakeholders

- Product managers: prioritize fixes and roadmap.
- Growth teams: identify friction affecting conversion/retention.
- Support teams: understand top user complaints quickly.
- Leadership: track high-level product health signal.

## 4.3 Scope

In scope:

- Public review scraping from Apple RSS and Google Play.
- Theme extraction via Groq-hosted LLM.
- Short weekly note generation.
- Draft email + Google Doc append via remote REST endpoint.
- Weekly orchestration and GitHub Actions scheduling.

Out of scope (current repository):

- Dashboard UI.
- Manual theme editing workflow.
- Human-in-the-loop approval gate.
- Multi-tenant account management.

## 4.4 Functional Requirements

### FR-1: Ingest Reviews
- Collect reviews from Apple and Google using configured app identifiers.
- Respect lookback window configuration.
- Normalize to a unified schema.
- Deduplicate by `review_id`.

### FR-2: Protect Sensitive Data
- Hash author names.
- Scrub PII from review text before LLM use.
- Validate/scrub final note for PII before delivery.

### FR-3: Extract Themes
- Group reviews into <= 5 themes.
- Preserve supporting `review_ids`.
- Include representative quote and sentiment.
- Merge overlapping themes.

### FR-4: Generate Note
- Include top themes by volume (target 3 in final note).
- Include one quote per theme.
- Include three specific, feature-referenced action ideas.
- Enforce <= 250 words.

### FR-5: Deliver Outputs
- Save generated markdown/html/text artifacts.
- Create email draft via remote endpoint.
- Append summary to configured Google Doc.
- Honor dry-run mode.

### FR-6: Idempotency and Run Tracking
- Prevent duplicate sends for same week when already sent.
- Record run status and metadata in ledger.

## 4.5 Non-Functional Requirements

- Reliability: retries for transient errors and rate limits.
- Resilience: continue with one source if the other fails.
- Observability: structured logs and metadata files.
- Maintainability: phase-wise modules with unit/integration tests.
- Security: no raw credentials in code; env/config separation.

## 4.6 Success Metrics (Suggested)

- Weekly run success rate >= 95%.
- Duplicate send rate = 0.
- PII leakage in outputs = 0 known incidents.
- Time-to-insight reduction from manual baseline.
- Actionability quality score from product team feedback.

## 4.7 Risks and Mitigations

- LLM output quality variance -> validation, retries, constrained prompts.
- API/rate-limit instability -> backoff, partial platform fallback.
- Remote delivery endpoint availability -> retries + retained local artifacts.
- Review language/noise variance -> language tagging + robust preprocessing.

---

## 5) Technical Requirements (TRD)

## 5.1 System Architecture

Pipeline phases:

1. Phase 1: Scraping (`src/scraper`)
2. Phase 2: Theme extraction (`src/themes`)
3. Phase 3: Note generation (`src/notes`)
4. Phase 4: Delivery + ledger (`src/email`)
5. Global orchestration (`src/orchestrator.py`)

## 5.2 Core Modules and Responsibilities

- `src/orchestrator.py`: End-to-end coordinator.
- `src/scraper/apple_scraper.py`: Apple RSS ingestion.
- `src/scraper/google_scraper.py`: Google Play ingestion.
- `src/scraper/normalizer.py`: schema, date filtering, language, hashing.
- `src/scraper/rate_limiter.py`: request pacing and retry.
- `src/scraper/orchestrator.py`: source merge, normalization, metadata outputs.
- `src/themes/extractor.py`: LLM calls, batching, prep, consolidation.
- `src/themes/validator.py`: overlap/specificity/quote validation.
- `src/themes/pii_scrubber.py`: regex-based text redaction.
- `src/notes/generator.py`: note drafting, retries, formatting outputs.
- `src/notes/validator.py`: word count, specificity, PII and quote checks.
- `src/email/rest_client.py`: remote API calls for draft/doc append.
- `src/email/ledger.py`: idempotent run recording and duplicate prevention.

## 5.3 Data Contracts

### Normalized Review (Phase 1 output)
- `review_id`, `platform`, `author_anonymous_hash`, `rating`, `title`, `body`, `date`, `language`, `app_version`, `scraped_at`.

### Theme Output (Phase 2 output)
- `run_date`, `review_window`, `total_reviews_analyzed`, `themes[]`, `metadata`.

Each theme includes:
- `theme_name`, `description`, `review_ids[]`, `sentiment`, `volume`, `representative_quote`.

### Note Output (Phase 3 output)
- markdown body
- html body
- plain text body
- metadata: word_count, PII catches, quote validations, runtime info

### Run Ledger (Phase 4 state)
- array of run records with `run_id`, `week_key`, `run_date`, `status`, optional error and metrics.

## 5.4 External Dependencies

- Groq API (`groq` package, `GROQ_API_KEY`)
- Apple RSS public endpoint
- Google Play public endpoints via `google-play-scraper`
- Remote MCP service for email/doc delivery (configured in `rest_client.py`)

## 5.5 Configuration Requirements

- YAML: `config/pipeline_config.yaml`
  - Scraper app IDs and rate limits
  - LLM model/retry settings
  - Delivery targets and dry-run toggle
- Env:
  - `GROQ_API_KEY` required
  - Optional local run toggles in `.env` file

## 5.6 Error Handling and Recovery

- Transient request failures -> exponential backoff/retry.
- Single-platform scrape failure -> continue with available platform.
- Empty scrape/theme/note outputs -> fail fast with run record.
- Delivery failure -> log and record status, keep generated artifacts.
- Corrupt ledger file -> backup and recreate.

## 5.7 Operational Flow

1. Load configuration and compute `week_key`.
2. Optional idempotency check (if not dry run).
3. Run phase 1 and persist raw outputs.
4. Run phase 2 and persist themes.
5. Run phase 3 and persist note artifacts.
6. Run phase 4 delivery actions.
7. Record final run status in ledger.

## 5.8 CI/CD and Scheduling

- GitHub Actions workflow: `.github/workflows/pipeline.yml`
- Trigger:
  - Scheduled weekly (Monday 09:00 UTC)
  - Manual dispatch
- Job:
  - Setup Python 3.11
  - Install dependencies
  - Execute full pipeline module
  - Upload selected artifacts

## 5.9 Testing Strategy

Implemented phase-wise tests in `tests/`:

- Scraping tests: parser behavior, retries, normalization, dedup.
- Theme tests: PII scrubber, theme validation/merge, extraction plumbing.
- Note tests: word count and action specificity constraints.
- Delivery tests: REST client behavior and ledger logic.

Documentation-driven evaluation criteria are in:
- `eval_phase1_scraping.md`
- `eval_phase2_themes.md`
- `eval_phase3_notes.md`
- `eval_phase4_email.md`

## 5.10 Security and Compliance Considerations

- PII minimization via hashing and regex scrubbing.
- Credentials externalized from source code.
- Outputs constrained to non-sensitive summary content.
- Risks remain for imperfect regex/LLM behavior; layered checks reduce exposure.

---

## 6) Assumptions and Open Questions

Assumptions inferred from current codebase:

- Remote delivery API remains stable and reachable.
- Weekly `week_key` generation aligns with expected business timezone.
- LLM output quality is acceptable with prompt+validator controls.
- App IDs in config represent production targets.

Open questions / gaps:

- No consolidated README runbook for first-time setup.
- Env/docs mismatch for delivery (YAML vs `.env.example` completeness).
- Some architecture/eval docs mention components no longer present.
- No explicit SLO/error-budget definitions for production operation.

---

## 7) Runbook (Practical)

1. Create virtual environment and install dependencies.
2. Add `.env` with valid `GROQ_API_KEY`.
3. Update `config/pipeline_config.yaml`:
   - scraper app IDs
   - recipient email
   - doc ID
   - dry-run preference
4. Execute:
   - Full run: `python -m src.orchestrator`
   - Optional phase scripts: `run_phase2.py`, `run_phase3.py`, `run_phase4.py`
5. Validate artifacts in `data/` and `output/` (if generated).
6. Run tests with `pytest`.

---

## 8) Future Enhancements (Recommended)

- Add README with one-command setup and troubleshooting.
- Move remote delivery URL to config/env instead of hardcoding.
- Add typed schemas (e.g., Pydantic) at phase boundaries.
- Add richer observability (metrics, run dashboard).
- Add confidence scoring and trend deltas week-over-week.
- Add approval workflow before send in production mode.

---

## 9) Sign-off Template

- Product Owner: ____________________
- Engineering Owner: ____________________
- Data/AI Owner: ____________________
- QA Owner: ____________________
- Date: ____________________

