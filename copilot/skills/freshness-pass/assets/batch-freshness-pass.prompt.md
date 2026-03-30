---
mode: agent
description: "Run a comprehensive freshness pass on multiple articles — composes doc-verifier fact-check + documentor-workflow editorial review across a folder, glob, or file list"
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

# Batch Freshness Pass — Multiple Articles

Run a comprehensive freshness pass on multiple documentation articles. Each article receives the full three-phase treatment from `freshness-pass/SKILL.md`: fact-check (Phase A) + editorial review (Phase B) + consolidation (Phase C).

## Setup

Load these references as needed:
- [_shared/source-hierarchy.md](../../_shared/source-hierarchy.md) — Source authority tiers
- [sources/routing-index.md](../../sources/routing-index.md) — Category lookup for Tier 2 repos

---

## Step 0 — Scope and file discovery

1. **Determine file set** — folder (recursive `.md`), glob pattern, or explicit file list
2. **Confirm scope**: Present file list with count, ask for confirmation
3. **Product area** (optional): Detect from `ms.service`/`ms.prod` metadata or ask

## Step 1 — Catalog and group files

For each file:
1. Extract frontmatter: `ms.service`, `ms.prod`, `ms.topic`, `ms.date`, `title`
2. Group by service area
3. Build tracking table: File | Service | Topic type | ms.date | Status
4. Load matching category YAML from sources for each service area (only if Tier 2 repo lookup needed)

## Step 2 — Process files

### Small batches (< 5 files or single service group)

Process each file sequentially through all three phases per `freshness-pass/SKILL.md`:
- **Phase A**: Fact-check per `doc-verifier` methodology
- **Phase B**: Editorial pass per `documentor-workflow` methodology
- **Phase C**: Record findings (collect for consolidated report — don't apply edits yet)

### Large batches (5+ files across multiple service groups)

Use multi-agent parallelization:
1. Group files by `ms.service`
2. Spawn one `runSubagent` per service group with: file list, source hierarchy, matching category YAML, Phase A + B instructions
3. Collect and merge results into consolidated tracking table

## Step 3 — Generate consolidated report

Create `freshness_[scope]_YYYYMMDD.md`:

1. **Executive summary** — Total files, findings (fact-check + editorial), files needing corrections
2. **Critical findings** — Each with: file, line, issue, correction, source
3. **Per-file summary table** — File | Fact-check | Editorial | Critical | Important | Suggestion | Status
4. **Findings by file** — Fact-check findings table + Editorial findings table per file
5. **Link audit** — URL | File | Status | Replacement
6. **Sources consulted** — Source | Tier | URL | Accessed

## Step 4 — Apply corrections (optional)

Ask: **"Apply all corrections to the files?"**

If yes: Apply all corrections, update `ms.date` on every edited file, preserve tone/structure.
If no: Leave report as deliverable for selective application.

## Step 5 — Git workflow (optional)

If user wants to commit:
1. Create branch: `freshness/[scope]-MMDDYYYY`
2. Commit each file individually: `freshness: [filename] — fact-check + editorial pass`
3. Commit report: `freshness: add batch freshness report for [scope]`
4. Push and open PR with executive summary

---

## Quality

See [_shared/quality-checklist.md](../../_shared/quality-checklist.md) — verify all sections (fact-check, editorial, batch) before finishing.
