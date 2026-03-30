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

Load [_shared/source-hierarchy.md](../../_shared/source-hierarchy.md) for the complete tiered source authority reference. Higher tier always wins.

## Steps

### 1. Identify Claims
Read the current file and extract every technical claim:
- Product/service names and descriptions
- Feature capabilities, limitations, and prerequisites
- Version numbers, API references, CLI commands
- Configuration values, default settings, quotas
- Code examples and syntax

For each claim, note the **WHAT** (assertion), **CONTEXT** (product/version), and **SCOPE** (applicability).

### 2. Verify Against Official Sources
For each claim, search in priority order per the source hierarchy:
- `microsoft_docs_search` — learn.microsoft.com
- `microsoft_docs_fetch` — full page retrieval
- `microsoft_code_sample_search` — code examples
- Search the workspace with `semantic_search` and `grep_search`
- Check for deprecation notices or recent changes
- Validate code examples using `get_errors`
- Test executable examples using `run_in_terminal` when possible

### 3. Assess Accuracy
For each verified claim, classify as:
- **✅ Accurate**: Matches current official documentation
- **⚠️ Partially Accurate**: Mostly correct but needs refinement
- **❌ Inaccurate**: Contradicted by official sources
- **🕐 Outdated**: Was correct but no longer current
- **❓ Unverifiable**: No authoritative source found — flag, do not remove

### 4. Make Corrections
For any inaccurate or outdated content:
- Edit the file directly with the corrected information
- Preserve the article's tone and style
- Update `ms.date` to today's date

### 5. Generate Report
Create `factcheck_[articlename]_YYYYMMDD.md` containing:
- **Executive Summary** — overview of findings
- **Per-issue details** — location, original text, corrected text, severity, type, source URL, status
- **Summary Table** — file, line, severity, status
- **Sources Used** — all URLs with access dates

### 6. Present Results
Summarize corrections made and ask if the user wants to commit changes.

## Quality

See [_shared/quality-checklist.md](../../_shared/quality-checklist.md) — verify the fact-check quality section before finishing.
