# CLAUDE.md — Michael Bender (@mbender-ms)

Project context for Claude Code. Mirrors `copilot-instructions.md` with Claude Code–specific additions.

## Core rules

1. **Delegate before doing** — Route tasks using the table below. Don't re-implement skill logic inline.
2. **Never commit to main** — Always create a feature branch (`mbender-ms/<service>-<description>-<id>`).
3. **One commit per file** — Format: `docs: <imperative verb> <what changed>`. No AB# in commits.
4. **Ask before pushing** — Get approval before `git push`.
5. **Sentence casing** for all H2+ headings in documentation articles.
6. **Lazy-load** — Don't pre-read reference files, source YAMLs, or repo catalogs unless the task requires them.
7. **Efficiency over verbosity** — Use direct commands and tools, but never sacrifice research depth or clarity.
8. **Microsoft Style Guide** — Contractions, active voice, Oxford comma, imperative verbs in procedures. "Select" not "click".
9. **When uncertain** — State what you'd do, why you're unsure, and ask for confirmation. Never silently guess on publish-facing content.

## Task routing

| Task type | Route to | Trigger words |
|-----------|----------|---------------|
| Write / scaffold article | `doc-writer` skill | "write", "draft", "scaffold", "new article" |
| Fact-check / verify accuracy | `doc-verifier` skill | "verify", "fact-check", "validate", "check accuracy" |
| Full freshness pass | `freshness-pass` skill | "freshness", "refresh", "update article" |
| ADO work items | `ado-work-items` skill | "work item", "ADO", "task", "user story" |
| SEO / editorial review | `documentor-workflow` skill | "SEO", "metadata", "editorial", "engagement" |
| Research / exploration | Spawn `Explore` subagent | "explore", "research", "investigate" |
| Git operations | `git-workflow` prompt | "commit", "push", "branch", "PR" |
| PR description | `pr-description-template` prompt | "PR description", "PR body" |

Skills live in `copilot/skills/<skill-name>/SKILL.md`. Load them on demand — don't pre-read.

## Model selection

| Task complexity | Recommended model | Examples |
|----------------|-------------------|---------|
| Simple lookups, quick edits, date updates | claude-haiku-4-5 | `ms.date` update, typo fix, link correction |
| Standard fact-checking, writing, editorial review | claude-sonnet-4-6 | Workflows 1–3, 5, 7–9; doc-writer; documentor-workflow |
| Deep verification, complex research, CIA analysis | claude-opus-4-7 | Workflow 4 (internal), Workflow 6 (deep agent), Workflow 10 (CIA) |

## Claude Code tool mapping

GitHub Copilot agent files (`.agent.md`) use Copilot tool syntax. The equivalents for Claude Code are:

| Copilot tool | Claude Code equivalent |
|---|---|
| `read/readFile`, `gitkraken/repository_get_file_content` | `Read` tool |
| `edit/editFiles` | `Edit` tool |
| `edit/createFile` | `Write` tool |
| `search/codebase`, `search/fileSearch`, `search/textSearch`, `search/usages`, `search/listDirectory`, `search/changes` | `Bash` (grep, find, git diff) |
| `execute/runInTerminal`, `execute/getTerminalOutput` | `Bash` tool |
| `web/fetch` | `WebFetch` tool |
| `web/githubRepo` | `WebFetch` or `mcp__github__*` MCP tools |
| `github/get_file_contents` | `mcp__github__get_file_contents` |
| `github/search_code` | `mcp__github__search_code` |
| `github/search_repositories` | `mcp__github__search_repositories` |
| `agent/runSubagent` | `Agent` tool |
| `todo` | `TodoWrite` tool |
| `gitkraken/git_log_or_diff`, `gitkraken/git_status` | `Bash` (git log, git diff, git status) |
| `microsoft-learn-mcp-server/*` | Same — MCP server must be configured in `.vscode/mcp.json` |
| `ado-content/*` | Same — ADO MCP server required (CIA workflow only) |

## Skill loading in Claude Code

Skills are standard markdown files — invoke them by reading the SKILL.md and following its instructions:

```
Read copilot/skills/doc-verifier/SKILL.md
```

Agent files (`.agent.md`) define tool lists and system prompts for Copilot agent mode. In Claude Code, use the agent file as a system-prompt reference and map tools using the table above.

## Personal context

Load `copilot/skills/my-workflow/SKILL.md` for: service ownership, repo paths, ADO conventions, branch naming, commit format, and quick commands. Don't load it unless the task needs it.

## MCP servers

Configured in `.vscode/mcp.json`:
- `microsoft-learn-mcp-server` — Microsoft Docs search and fetch (required for fact-checking)
- `mcp-pdf` — PDF processing (`npx mcp-pdf`)
