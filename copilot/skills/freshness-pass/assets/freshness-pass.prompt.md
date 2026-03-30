---
mode: agent
description: "Run a comprehensive freshness pass on the currently open article — composes doc-verifier fact-check + documentor-workflow editorial review + consolidation with corrections applied"
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

# Freshness Pass — Single Article

Run a comprehensive freshness pass on the currently open article. Composes a full fact-check with a complete editorial review, then applies all corrections directly.

## Setup

Load these references as needed during the pass:
- [_shared/source-hierarchy.md](../../_shared/source-hierarchy.md) — Source authority tiers
- [_shared/seo-and-metadata.md](../../_shared/seo-and-metadata.md) — SEO and metadata rules
- [_shared/formatting-rules.md](../../_shared/formatting-rules.md) — Markdown formatting
- [_shared/writing-style.md](../../_shared/writing-style.md) — Microsoft writing style

---

## Phase A — Fact-check

Execute the `doc-verifier` Single Article methodology:

1. **Read and extract claims** — Every technical claim: product names, features, versions, CLI commands, configuration values, code examples, URLs
2. **Verify against sources** — Search in priority order per source hierarchy using `microsoft_docs_search`, `microsoft_docs_fetch`, `microsoft_code_sample_search`, `web/fetch`, `web/githubRepo`
3. **Classify**: ✅ Accurate, ⚠️ Partial, ❌ Inaccurate, 🕐 Outdated, ❓ Unverifiable, 🔗 Broken link
4. **Freshness-specific scans** — ms.date staleness, deprecated features, old versions, broken/redirected links, outdated UI references

---

## Phase B — Editorial pass

Execute the `documentor-workflow` Full Edit Review methodology across five dimensions:

1. **Editorial review** — Frontmatter completeness, title (30–65 chars, title case), description (120–165 chars, CTA), passive voice, procedures (≤ 7 steps, imperative verbs), sensitive identifiers
2. **SEO audit** — Title, description, H1 (sentence case), intro keyword placement, subheadings, image alt text, internal linking
3. **Auto-fix markdown** — Heading hierarchy, blank lines, code fence identifiers (`azurecli`, `azurepowershell`), alert syntax, table formatting, trailing whitespace
4. **Content suggestions** — Bounce rate, CTR, copy-try-scroll, dwell, exit rate
5. **MS Style Guide** — Voice/tone, contractions, sentence-style capitalization on H2+, active voice, Oxford comma

---

## Phase C — Consolidation

### Apply corrections

- Make all corrections directly in the file
- Preserve tone, style, and structure
- Update `ms.date` to today's date (MM/DD/YYYY)
- Do NOT add HTML comments or reference markers

### Present summary

For each change:

**Edit N: [brief description]**
- **Line(s)**: [approximate line number(s)]
- **What changed**: [original text] → [new text]
- **Why**: [brief explanation]
- **Type**: [Fact: Outdated | Inaccurate | Broken Link] or [Editorial: SEO | Style | Markdown | Metadata | Engagement | Sensitivity]
- **Source(s)**: [Title](URL) — fact-check edits only

End with:
- **Phase A summary**: Findings by classification (✅ ⚠️ ❌ 🕐 ❓ 🔗)
- **Phase B summary**: Findings by severity (Critical / Important / Suggestion)
- **Edit totals**: Count by type
- Reminder to review via **Source Control** (Ctrl+Shift+G) or `git diff`

### Offer git workflow

Ask to commit. If yes:
1. Create branch: `freshness/[article-name]-MMDDYYYY`
2. Commit: `freshness: [article-name] — fact-check + editorial pass`
3. Push and open PR with summary

---

## Quality

See [_shared/quality-checklist.md](../../_shared/quality-checklist.md) — verify all sections before finishing.
