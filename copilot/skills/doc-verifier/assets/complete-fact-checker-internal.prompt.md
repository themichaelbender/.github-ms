---
mode: agent
description: Fact-check the current article using both public and internal Microsoft resources
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

# Complete Fact-Check (Internal)

Fact-check the currently open article against **both public and internal** Microsoft resources. Internal-sourced findings are isolated in a dedicated confidential section to prevent accidental public disclosure.

## Setup

Load [_shared/source-hierarchy.md](../../_shared/source-hierarchy.md) for the complete tiered source authority reference (Tiers 1–3 public + Tiers 5–7 internal).

> **Rule**: Internal sources (Tiers 5–7) must **never** be cited in public-facing documentation. Internal findings go in the **Internal Findings (Confidential)** report section and require author approval before applying.

## Steps

### 1. Identify Claims

Read the current file and extract every technical claim:
- Product/service names, feature capabilities, limitations, prerequisites
- Version numbers, API references, CLI/PowerShell commands
- Configuration values, default settings, quotas and limits
- Code examples and syntax
- Pricing tiers, SKUs, regional availability
- Deprecation or preview/GA status

For each claim, note the **WHAT** (assertion), **CONTEXT** (product/version), and **SCOPE** (applicability).

### 2. Verify Against Public Sources

For each claim, search in priority order per the source hierarchy:
- `microsoft_docs_search` — learn.microsoft.com
- `microsoft_docs_fetch` — full page retrieval
- `microsoft_code_sample_search` — code examples
- `web/githubRepo` — REST API specs, SDK repos, CLI repos
- `web/fetch` — TechCommunity, DevBlogs
- Check for deprecation notices or recent changes
- Validate code examples using `get_errors`

### 3. Verify Against Internal Sources

For claims not fully verifiable via public sources:
- **Internal documentation** — SharePoint sites, engineering wikis, design docs
- **Internal codebases** — Product source code for default values, flags, error messages
- **Internal product metadata** — Service Tree, Eco Manager for SKUs, API versions, limits

> Tag every internal finding with `[INTERNAL]` and record the source type.

### 4. Assess Accuracy

Classify each claim:
- **✅ Accurate** — Matches current docs and internal implementation
- **⚠️ Partially Accurate** — Needs refinement
- **❌ Inaccurate** — Contradicted by official or internal sources
- **🕐 Outdated** — Was correct but superseded
- **❓ Unverifiable (Public)** — Cannot be confirmed with public sources alone

### 5. Make Corrections

**Public-source corrections**: Edit the file directly. Update `ms.date`.

**Internal-source corrections**: Do NOT auto-edit. Record in the Internal Findings section. Flag for author review.

### 6. Generate Report

Create `factcheck_[articlename]_YYYYMMDD.md` with two clearly separated sections:

**Public Findings** — Per-issue: location, original, corrected, severity, source URL, source tier, status.

**⛔ Internal Findings (Microsoft Confidential)** — Per-issue: location, original, suggested correction, severity, internal source type, rationale, whether a public source is available, status (Pending Author Review).

> **WARNING**: Internal section must never appear in public docs, PR descriptions, or external communication.

### 7. Present Results

Summarize and ask if user wants to:
1. Commit public-source corrections
2. Review internal suggestions one by one
3. Strip internal section for a public-safe report

## Quality

See [_shared/quality-checklist.md](../../_shared/quality-checklist.md). Additionally:
- [ ] Internal sources consulted for claims not fully verifiable publicly
- [ ] Internal findings isolated in confidential report section
- [ ] No internal source links appear outside Internal Findings
- [ ] Author notified of pending internal-source suggestions
