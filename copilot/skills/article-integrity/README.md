# Article Integrity Skill

Focused integrity analysis for documentation articles. This skill audits the currently open file for high-confidence internal issues only:

- Contradictory statements
- Obvious naming inconsistencies
- Obvious typos
- Link text mismatches

It is designed for Content Mentor style reviews where the goal is precision, not breadth. The workflow ignores YAML frontmatter and does not fact-check against external sources.

## Workflow

| Workflow | Prompt asset | Slash-command | Scope |
|----------|-------------|---------------|-------|
| Article integrity analysis | `assets/article-integrity-analysis.prompt.md` | `/article-integrity-analysis` | Currently open article |

## How it works

### Phase 1 — Analysis

- Reads the full article body and ignores YAML frontmatter
- Reports only evidence-based, high-confidence integrity issues
- Uses a fixed issue template with type, location, evidence, problem, fix, and action
- Stops after analysis and asks for confirmation before editing

### Phase 2 — Implementation

- Applies only issues marked `auto-fix`
- Skips issues marked `needs author clarification`
- Makes minimal, precise edits in a single batch when possible
- Preserves surrounding Markdown formatting and code syntax

## When to use this instead of other skills

| Use this skill when... | Use another skill when... |
|---|---|
| You want a narrow integrity audit of the article text itself | You need external fact-checking against Microsoft Learn (`doc-verifier`) |
| You want a confirmation gate before any edits are applied | You want a broad editorial pass with SEO/style/markdown checks (`documentor-workflow`) |
| You want to catch obvious contradictions and copy/paste artifacts quickly | You want a full freshness workflow (`freshness-pass`) |

## Deploying to VS Code

Run `sync-prompts.ps1` to copy the prompt asset into your VS Code prompts directory:

```powershell
cd C:\github\.github
.\sync-prompts.ps1
```

After sync, invoke the workflow with `/article-integrity-analysis`.