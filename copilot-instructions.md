# Global Copilot Instructions — Michael Bender (@mbender-ms)

These instructions are loaded into **every** Copilot conversation automatically. Keep this file minimal — detailed context lives in skills (lazy-loaded on demand).

## Core Rules

1. **Delegate before doing** — Route tasks using the table below. Don't re-implement skill logic inline.
2. **Never commit to main** — always create a feature branch (`mbender-ms/<service>-<description>-<id>`).
3. **One commit per file** — format: `docs: <imperative verb> <what changed>`. No AB# in commits.
4. **Ask before pushing** — get approval before `git push`.
5. **Sentence casing** for all H2+ headings in documentation articles.
6. **Lazy-load** — don't pre-read reference files, source YAMLs, or repo catalogs unless the task requires them.
7. **Efficiency over verbosity** — use direct commands and tools, but never sacrifice research depth or clarity.
8. **Git workflow** — For branch/commit/push/PR tasks, use the `git-workflow` prompt. Prefer `gh` CLI for PR creation.
9. **Microsoft Style Guide** — Use contractions, active voice, Oxford comma, imperative verbs in procedures. "select" not "click".
10. **When uncertain** — State what you'd do, why you're unsure, and ask for confirmation. Never silently guess on publish-facing content.

## Task Routing

| Task type | Route to | Trigger words |
|-----------|----------|---------------|
| Write / scaffold article | `doc-writer` skill | "write", "draft", "scaffold", "new article" |
| Fact-check / verify accuracy | `doc-verifier` skill | "verify", "fact-check", "validate", "check accuracy" |
| Full freshness pass | `freshness-pass` skill | "freshness", "refresh", "update article" |
| ADO work items | `ado-work-items` skill | "work item", "ADO", "task", "user story" |
| SEO / editorial review | `documentor-workflow` skill | "SEO", "metadata", "editorial", "engagement" |
| Research / exploration | `Explore` agent | "explore", "research", "investigate" |
| Git operations | `git-workflow` prompt | "commit", "push", "branch", "PR" |
| PR description | `pr-description-template` prompt | "PR description", "PR body" |

## Skill Loading

For deeper context (services, repos, conventions, sub-agent patterns), load the `my-workflow` skill (`copilot/skills/my-workflow/SKILL.md`). Don't load it unless the task needs it — these global rules cover most interactions.
