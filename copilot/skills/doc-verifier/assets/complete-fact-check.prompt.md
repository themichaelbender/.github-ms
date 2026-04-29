---
mode: agent
description: Fact-check the current article against official Microsoft documentation
tools:
  - microsoft-learn-mcp-server/microsoft_docs_search
  - microsoft-learn-mcp-server/microsoft_docs_fetch
  - microsoft-learn-mcp-server/microsoft_code_sample_search
  - web/fetch
  - web/githubRepo
  - read/readFile
  - read/problems
  - search/codebase
  - search/fileSearch
  - search/textSearch
  - search/usages
  - edit/editFiles
  - edit/createFile
  - execute/runInTerminal
  - execute/getTerminalOutput
  - todo
---

# Complete Fact-Check

Fact-check the currently open article against official Microsoft documentation. Verify every technical claim, provide evidence-based corrections, and generate a standalone report.

## Setup

Source authority: Tier 1 (learn.microsoft.com, azure.microsoft.com) → Tier 2 (TechCommunity, DevBlogs, GitHub Azure/MicrosoftDocs) → Tier 3 (developer.microsoft.com) → Tier 4 (MS Q&A / Stack Overflow, verified Microsoft employees only). Higher tier always wins. Load [_shared/source-hierarchy.md](../../_shared/source-hierarchy.md) if you need the full reference including repository catalog details.

## Steps

### Steps 1–4 — Core workflow

Follow [_shared/fact-check-base.md](../../_shared/fact-check-base.md) for steps 1–4: claim identification, source verification (2–3 passes), accuracy classification, and corrections.

Additionally in step 2: validate code examples using `get_errors` and test executable examples with `run_in_terminal` when possible.

### Step 5 — Generate report
Create `factcheck_[articlename]_YYYYMMDD.md` containing:
- **Executive Summary** — overview of findings
- **Per-issue details** — location, original text, corrected text, severity, type, source URL, status
- **Summary Table** — file, line, severity, status
- **Sources Used** — all URLs with access dates

### 6. Present Results
Summarize corrections made and ask if the user wants to commit changes.

## Quality

See [_shared/quality-checklist.md](../../_shared/quality-checklist.md) — verify the fact-check quality section before finishing.
