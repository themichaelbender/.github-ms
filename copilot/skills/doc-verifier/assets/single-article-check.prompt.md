---
mode: agent
description: Fact-check the current article against official Microsoft documentation
tools:
  - microsoft-learn-mcp-server/microsoft_docs_search
  - microsoft-learn-mcp-server/microsoft_docs_fetch
  - microsoft-learn-mcp-server/microsoft_code_sample_search
  - read/readFile
  - read/problems
  - search/codebase
  - search/fileSearch
  - search/textSearch
  - edit/editFiles
  - todo
---

# Single Article Fact-Check

Fact-check the currently open article against official Microsoft documentation. Verify every technical claim, apply corrections in-place, and present a summary with source citations.

## Setup

Source authority: Tier 1 (learn.microsoft.com, azure.microsoft.com) → Tier 2 (TechCommunity, DevBlogs, GitHub Azure/MicrosoftDocs) → Tier 3 (developer.microsoft.com) → Tier 4 (MS Q&A / Stack Overflow, verified Microsoft employees only). Higher tier always wins. Load [_shared/source-hierarchy.md](../../_shared/source-hierarchy.md) if you need the full reference including repository catalog details.

For product-area-specific repo lookups, consult [sources/routing-index.md](../../sources/routing-index.md) and load the matching category YAML only if you need repo-level detail.

## Step 0 — Scope

Before starting, determine:
1. **Product area** — Read the file's `ms.service`, `ms.prod`, or content to identify the product area.
2. **Service focus** — Identify the specific service or feature.
3. **Depth** — Ask the user: "Quick check or thorough verification?"

Use the product area to select search domains (see SKILL.md → Product Area Search Domains).

## Steps 1–4 — Core workflow

Follow [_shared/fact-check-base.md](../../_shared/fact-check-base.md) for steps 1–4: claim identification, source verification (2–3 passes), accuracy classification, and corrections.

## Step 5 — Present results

Summarize: total claims checked, issues by severity, per-issue details with source URLs. Ask to commit.

## Quality

See [_shared/quality-checklist.md](../../_shared/quality-checklist.md) — verify the fact-check quality section.
