---
name: freshness-pass
description: "Content freshness workflow — composes doc-verifier (fact-check) + documentor-workflow (editorial) into a single three-phase pass. Single-article and batch modes available as slash-commands."
argument-hint: "Describe the freshness task: 'freshness pass on this article', 'batch freshness pass on articles/container-apps/', or 'freshness pass — focus on API accuracy'"
user-invocable: true
---

# Freshness Pass — Content Freshness Workflow

Run a comprehensive freshness pass on Microsoft documentation articles. **Composes** a full fact-check (`doc-verifier`) with a full editorial pass (`documentor-workflow`) in a single workflow.

> **Slash-commands**: Both workflows are available as VS Code slash-commands after running `sync-prompts.ps1`.

## Workflow selection

| # | Workflow | When to use | Slash-command |
|---|---------|-------------|---------------|
| 1 | **Single Article** | Freshness pass on the currently open article | `/freshness-pass` |
| 2 | **Batch** | Freshness pass on a folder, glob, or file list | `/batch-freshness-pass` |

## Prompt assets

| File | Workflow |
|------|----------|
| `assets/freshness-pass.prompt.md` | 1 — Single Article |
| `assets/batch-freshness-pass.prompt.md` | 2 — Batch |

---

## Phases (shared by both workflows)

Both workflows execute three phases in sequence. **Phases A and B delegate to existing skills — do not re-implement their logic.**

### Phase A — Fact-check (delegates to doc-verifier)

Execute the `doc-verifier` **Single Article** workflow (Workflow 2 from `doc-verifier/SKILL.md`).

Key steps:
1. Extract all technical claims from the article
2. Verify each claim against the [source authority hierarchy](../_shared/source-hierarchy.md)
3. Use Microsoft Learn MCP tools: `microsoft_docs_search`, `microsoft_docs_fetch`, `microsoft_code_sample_search`
4. Check for deprecation, retirement, version changes
5. Validate code examples
6. Classify each claim: ✅ Accurate, ⚠️ Partial, ❌ Inaccurate, 🕐 Outdated, ❓ Unverifiable, 🔗 Broken link

Additionally scan for freshness-specific issues:
- `ms.date` staleness
- Deprecated or retired services/features
- Old version numbers
- Broken/redirected links
- Outdated UI references

### Phase B — Editorial pass (delegates to documentor-workflow)

Execute the `documentor-workflow` **Full Edit Review** workflow from `documentor-workflow/SKILL.md`.

This covers five review dimensions:
1. **Editorial review** — Frontmatter, title, description, passive voice, procedures, sensitive identifiers
2. **SEO audit** — Per [_shared/seo-and-metadata.md](../_shared/seo-and-metadata.md)
3. **Auto-fix markdown** — Per [_shared/formatting-rules.md](../_shared/formatting-rules.md)
4. **Content suggestions** — Per `documentor-workflow/references/engagement-checklist.md`
5. **MS Style Guide checks** — Per [_shared/writing-style.md](../_shared/writing-style.md)

> **Multi-agent optimization**: For full freshness passes, consider spawning parallel `runSubagent` tasks — one for Phase A (fact-check) and one for Phase B (editorial) — then merge results in Phase C.

### Phase C — Consolidation (unique to freshness-pass)

This phase is the value-add of freshness-pass over running doc-verifier and documentor-workflow separately.

1. **Apply all corrections** directly to the file(s):
   - Preserve the article's existing tone, style, and structure
   - Update `ms.date` to today's date (MM/DD/YYYY)
   - Do NOT add HTML comments or reference markers

2. **Present per-edit summary** in chat:

   **Edit N: [brief description]**
   - **Line(s)**: [approximate line number(s)]
   - **What changed**: [original text] → [new text]
   - **Why**: [brief explanation]
   - **Type**: Fact-check (Outdated | Inaccurate | Broken Link) or Editorial (SEO | Style | Markdown | Metadata | Engagement | Sensitivity)
   - **Source(s)**: [Title](URL) — for fact-check edits only

3. **Summary totals**:
   - Total edits by phase (fact-check vs. editorial)
   - Count by type
   - Reminder to review via Source Control (Ctrl+Shift+G) or `git diff`

4. **Offer git workflow**:
   - Create branch: `freshness/[article-name]-MMDDYYYY`
   - Commit with descriptive message
   - Push branch
   - Open pull request with freshness review summary

---

## Quality checklist

See [_shared/quality-checklist.md](../_shared/quality-checklist.md) — verify all sections (fact-check, editorial, and batch if applicable) before finishing.

Additionally confirm:
- [ ] Engagement improvements suggested
- [ ] No passive voice without justification
- [ ] Freshness-specific issues addressed (deprecated features, old versions, stale dates)

## Reference files

Load these resources as needed (lazy-load — don't pre-read):

- [_shared/source-hierarchy.md](../_shared/source-hierarchy.md) — Source authority tiers
- [_shared/seo-and-metadata.md](../_shared/seo-and-metadata.md) — SEO optimization and metadata
- [_shared/formatting-rules.md](../_shared/formatting-rules.md) — Markdown formatting standards
- [_shared/writing-style.md](../_shared/writing-style.md) — Microsoft writing style
- [documentor-workflow/references/engagement-checklist.md](../documentor-workflow/references/engagement-checklist.md) — Engagement metrics
- [documentor-workflow/references/sensitive-identifiers.md](../documentor-workflow/references/sensitive-identifiers.md) — Approved placeholder values
- [sources/routing-index.md](../sources/routing-index.md) — Category lookup for Tier 2 repos

## Relationship to other skills

| Skill | Relationship |
|-------|-------------|
| `doc-verifier` | Phase A delegates to doc-verifier methodology. Use doc-verifier directly for fact-checking without editorial review. |
| `documentor-workflow` | Phase B delegates to documentor-workflow methodology. Use documentor-workflow directly for individual editorial workflows. |
| `doc-verifier/complete-freshness-review.prompt.md` | Covers fact-check + staleness only. Freshness-pass is the superset — adding full editorial, SEO, and Style Guide checks. |
