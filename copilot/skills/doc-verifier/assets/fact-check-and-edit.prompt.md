---
mode: agent
description: Fact-check and edit the current article in-place, with inline reference comments
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

# Fact-Check & Edit

Fact-check the currently open article against official Microsoft documentation and make corrections directly in the file. Do NOT generate a separate report file. Present all references and reasoning in the chat.

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

#### 1a. Resolve INCLUDES

Scan for `[!INCLUDE ...]` references. For each:
- Open and read the referenced include file
- Extract technical claims from include content
- Track which claims originate from which include file

### 2. Verify Against Official Sources

For each claim, search in priority order per the source hierarchy:
- `microsoft_docs_search` — learn.microsoft.com
- `microsoft_docs_fetch` — full page retrieval
- `microsoft_code_sample_search` — code examples
- `web/githubRepo` — REST API specs, SDK repos
- `web/fetch` — TechCommunity, DevBlogs
- Check for deprecation notices or recent changes
- Validate code examples using `get_errors`

### 3. Edit the File Directly

For any inaccurate, outdated, or incomplete content:
- Make the correction directly in the current file
- Preserve the article's existing tone, style, and formatting
- Update `ms.date` to today's date
- Do NOT add HTML comments or reference markers

#### 3a. Edit INCLUDES Files

If an inaccuracy originates from an INCLUDES file:
- Make the correction directly in the include file
- Note in the chat summary which file was edited

### 4. Present References in Chat

After ALL edits are complete, present a single summary for each change:

---

**Edit N: [brief description]**
- **File**: [main article or include file path]
- **Line(s)**: [approximate line number(s)]
- **What changed**: [original text] → [new text]
- **Why**: [brief explanation]
- **Source(s)**:
  - [Title](URL)

---

### 5. Final Summary

End with:
- Total number of edits made
- Reminder to review via **Source Control** (Ctrl+Shift+G) or `git diff`
- Ask if they want to accept, revert, or commit

## Rules

- **DO** edit the file directly
- **DO NOT** create a separate report file
- **DO NOT** embed references inside the article markdown
- **DO** present all sources in the chat response
- **DO** resolve and fact-check all `[!INCLUDE ...]` referenced files
- **DO** update `ms.date` in YAML front matter

## Quality

See [_shared/quality-checklist.md](../../_shared/quality-checklist.md) — verify the fact-check quality section before finishing.
