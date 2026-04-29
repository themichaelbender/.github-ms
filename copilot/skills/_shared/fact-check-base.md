# Fact-check base workflow

Shared steps used by `complete-fact-check.prompt.md` and `single-article-check.prompt.md`. Both prompts reference this file for the core claim-verification loop.

---

## Step 1 — Identify claims

Read the current file and extract every verifiable technical claim:
- Product/service names, feature capabilities, limitations, SKU/tier requirements
- Version numbers, API references, CLI/PowerShell commands
- Configuration values, defaults, quotas, limits, pricing, regional availability
- Preview/GA/deprecated status
- Code examples and syntax

For each claim, note: **WHAT** (assertion), **CONTEXT** (product/version), **SCOPE** (applicability).

## Step 2 — Verify against sources

For each claim, search in priority order per the source authority (see Setup):

1. `microsoft_docs_search` — product-area-specific terms
2. `microsoft_docs_fetch` — full pages when snippets are insufficient
3. `microsoft_code_sample_search` — validate code examples
4. `grep_search` / `semantic_search` — cross-reference workspace content
5. Check for deprecation, preview/GA status, retirement notices

Complete 2–3 passes per claim group to ensure coverage.

## Step 3 — Classify accuracy

| Icon | Status | Action |
|------|--------|--------|
| ✅ | Accurate | No change |
| ⚠️ | Partially accurate | Edit with correction |
| ❌ | Inaccurate | Edit + cite source |
| 🕐 | Outdated | Update + cite source |
| ❓ | Unverifiable | Flag — do not remove |
| 🔗 | Broken link | Fix or flag |

## Step 4 — Apply corrections

Edit the file directly. Preserve tone and style. Update `ms.date` to today's date (MM/DD/YYYY). Do NOT remove unverifiable claims — flag them instead.
