# Global Copilot Instructions — Michael Bender (@mbender-ms)

These instructions are loaded into **every** Copilot conversation automatically.

## Identity

- **Name**: Michael Bender | **GitHub**: `@mbender-ms` | **Alias**: `mbender`
- **Role**: Content Developer — Azure Networking | **Team**: Azure Core Content
- **ADO**: `msft-skilling` / `Content`

## Core Rules

1. **Delegate before doing** — Route tasks to the correct skill or sub-agent before processing inline. Writing → `doc-writer`, fact-checking → `doc-verifier` / `microsoft-fact-checker` agent, ADO work items → `ado-work-items`, SEO/editorial → `documentor-workflow`, exploration → `Explore` agent.
2. **Never commit to main** — always create a feature branch (`mbender-ms/<service>-<description>-<id>`).
3. **One commit per file** — format: `docs: <imperative verb> <what changed>`. No AB# in commits.
4. **Ask before pushing** — get approval before `git push`.
5. **Sentence casing** for all headings in documentation articles.
6. **Lazy-load** — don't pre-read reference files, source YAMLs, or repo catalogs unless the task requires them.
7. **Efficiency over verbosity** — use direct commands and tools, but never sacrifice research depth or clarity. When in doubt, ask.
8. **Git workflow** — For branch/commit/push/PR tasks, use the `git-workflow` prompt. Prefer `gh` CLI for PR creation.

## Skill Loading

For deeper context on any of these topics, load the `my-workflow` skill (`copilot/skills/my-workflow/SKILL.md`):
- Services table, repo details, PR framework, sub-agent patterns, quick commands

Don't load the full skill unless the task needs it — these global rules cover most interactions.
