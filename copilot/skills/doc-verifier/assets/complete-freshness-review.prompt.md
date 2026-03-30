---
mode: agent
description: Perform a complete freshness review — update outdated content, fact-check against official Microsoft docs, fix links, and optionally commit + PR
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
  - execute/runInTerminal
  - execute/getTerminalOutput
  - todo
---

# Complete Freshness Review

Perform a full freshness review on the currently open article. Combines content freshness analysis with fact-checking, then makes all corrections directly in the file.

## Setup

Load [_shared/source-hierarchy.md](../../_shared/source-hierarchy.md) for the complete tiered source authority reference. Higher tier always wins.

## Steps

### 1. Analyze the Article for Freshness Issues

Read the current file and scan for:
- **Outdated information**: dates, version numbers, deprecated features, retired services, old UI references
- **Broken or suspect links**: fetch absolute URLs; flag errors or redirects
- **ms.date**: note current value — will be updated after edits
- **Metadata**: verify `ms.service`, `ms.topic`, `ms.author`, and other YAML fields
- **Style**: flag obvious grammar, clarity, or formatting issues

### 2. Fact-Check Technical Claims

Extract every technical claim and verify each one against the source hierarchy:
- `microsoft_docs_search`, `microsoft_docs_fetch`, `microsoft_code_sample_search`
- Check for deprecation notices or recent changes
- Validate code examples using `get_errors`

Classify each claim: ✅ Accurate, ⚠️ Partially Accurate, ❌ Inaccurate, 🕐 Outdated.

### 3. Edit the File Directly

For any inaccurate, outdated, or incomplete content:
- Make corrections directly in the current file
- Preserve the article's existing tone, style, and formatting
- Update `ms.date` to today's date (MM/DD/YYYY)
- Fix broken links, update version numbers, correct deprecated references
- Do NOT add HTML comments or reference markers

### 4. Present a Summary in Chat

For each change:

**Edit N: [brief description]**
- **Line(s)**: [approximate line number(s)]
- **What changed**: [original text] → [new text]
- **Why**: [brief explanation]
- **Type**: [Outdated | Inaccurate | Broken Link | Style | Metadata]
- **Source(s)**: [Title](URL)

End with totals by type and a reminder to review via Source Control or `git diff`.

### 5. Offer to Save Changes

Ask if the user wants to:
- Create branch (`freshness/article-name-MMDDYYYY`)
- Commit with descriptive message
- Push and open a PR

## Quality

See [_shared/quality-checklist.md](../../_shared/quality-checklist.md) — verify both fact-check and editorial quality sections before finishing.
