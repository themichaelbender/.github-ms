---
name: article-integrity
description: "Article integrity analysis for documentation — detect contradictory statements, obvious naming inconsistencies, clear typos, and link text mismatches in the current article. Use for internal consistency audits, Content Mentor integrity checks, and evidence-based two-phase review before applying edits."
argument-hint: "Describe the integrity task: 'run article integrity analysis on this file', 'check this article for contradictions and typos', or 'Content Mentor integrity audit on the current article'"
user-invocable: true
---

# Article Integrity

Run a focused integrity audit on the currently open article. This skill is for high-confidence, text-internal issues only: contradictions, obvious naming mistakes, clear typos, and link text mismatches.

> **Two-phase workflow**: Phase 1 analyzes and reports issues. Phase 2 applies fixes only after user confirmation.

## Workflow

| Workflow | When to use | Slash-command |
|---|---|---|
| **Article integrity analysis** | Audit one open article for internal consistency and obvious errors | `/article-integrity-analysis` |

## What this skill checks

1. **Contradictory statements** — conflicting facts, defaults, limits, versions, or procedural guidance within the same article
2. **Obvious naming inconsistencies** — wrong product, service, language, or technology references that look like copy/paste remnants
3. **Obvious typos** — clear spelling errors, duplicate words, broken commands, and typographic characters in code that break copy/paste
4. **Link text mismatches** — link text that clearly contradicts the target it points to

## What this skill does not do

- It does **not** fact-check against external sources
- It does **not** review frontmatter metadata
- It does **not** flag style, tone, grammar preferences, or vague readability issues
- It does **not** speculate when the text does not provide clear evidence

## Phase 1 — Analysis

1. Read the full article body and ignore YAML frontmatter
2. Evaluate only the four integrity dimensions above
3. Report only high-confidence issues with direct textual evidence
4. Use this output format for each issue:

```md
### Issue <number>: <short title>

- **Type**: contradiction | naming | typo | link_mismatch
- **Location**: <section heading and element hint>
- **Evidence**: <problematic text>
- **Problem**: <what is wrong and why it matters>
- **Fix**: <specific correction>
- **Action**: auto-fix | needs author clarification
```

5. If nothing qualifies, respond exactly: `No integrity issues found.`
6. If issues are found, stop and ask: `Ready to apply these fixes. Proceed?`

## Phase 2 — Implementation

After the user confirms:

1. Apply only issues marked `auto-fix`
2. Skip issues marked `needs author clarification`
3. Make minimal edits only at the exact matching text
4. Preserve markdown structure, whitespace, code fence syntax, and surrounding formatting
5. Apply fixes in a single batch when possible
6. Summarize which issues were fixed and which were skipped

## Exclusions to enforce

- Ignore the YAML frontmatter block entirely
- Do not flag metadata fields such as `author`, `ms.author`, `ms.reviewer`, `ms.date`, `title`, or similar
- Do not flag context-dependent value differences when the context is clearly different
- Do not flag historical vs. current distinctions when the distinction is explicit
- Do not flag external link mismatches that require fetching or validating external content
- Do not flag minor capitalization or stylistic variations unless they clearly indicate the wrong technology or service

## Prompt assets

| File | Workflow |
|------|----------|
| `assets/article-integrity-analysis.prompt.md` | Article integrity analysis |

## Relationship to other skills

| Skill | Relationship |
|---|---|
| `doc-verifier` | Verifies external technical accuracy against sources. `article-integrity` checks only the article's internal consistency and obvious textual errors. |
| `documentor-workflow` | Reviews editorial quality, SEO, formatting, and links. `article-integrity` is narrower and evidence-only. |
| `freshness-pass` | Runs broad freshness and editorial workflows. `article-integrity` is the lightweight preflight for high-confidence integrity issues. |