# .github

Personal GitHub profile repo containing Copilot skills for Azure documentation workflows.

## Skills

All skills live in `copilot/skills/` and are automatically available in VS Code via GitHub Copilot.

| Skill | Files | Size | Description |
|-------|-------|------|-------------|
| **ado-work-items** | 3 | 45 KB | Create and validate ADO work items per Azure Core Content Standards |
| **article-integrity** | 3 | 20 KB | Audit article integrity for contradictions, naming issues, typos, and link text mismatches |
| **azure-quickstart-templates** | 2 | 32 KB | Review, validate, or create Azure Quickstart Templates |
| **doc-verifier** | 18 | 180 KB | Verify technical accuracy of Microsoft documentation (10 workflows, 3 agent variants) |
| **doc-writer** | 5 | 65 KB | Scaffold and write Azure documentation articles (how-to, concept, quickstart, tutorial, overview) |
| **documentor-workflow** | 7 | 72 KB | Editorial quality workflows — SEO, metadata, engagement, markdown auto-fix, link validation |
| **freshness-pass** | 4 | 68 KB | Full content freshness workflow — fact-check + editorial + SEO + style in 3 phases |
| **my-workflow** | 4 | 42 KB | Personal working context — role, services, repos, conventions, task routing |

### Supporting directories

| Directory | Files | Size | Purpose |
|-----------|-------|------|---------|
| **_shared/** | 5 | 95 KB | Canonical shared references — formatting rules, SEO & metadata, writing style, source hierarchy |
| **sources/** | 27 | 120 KB | Microsoft GitHub repo catalog — 3,000+ repos across 4 orgs with classification taxonomy |

## Usage

Skills are invoked in VS Code Copilot Chat:

- Reference a skill with `#` prefix: `#doc-verifier`, `#doc-writer`, `#ado-work-items`
- Each skill's `SKILL.md` describes workflows and when-to-use guidance
- See individual skill `README.md` files for detailed usage examples

## Structure

```
copilot/skills/<skill-name>/
├── SKILL.md          # Skill definition (read by Copilot)
├── README.md         # Usage documentation
├── assets/           # Prompt files for specific workflows
└── references/       # On-demand reference material
```

## Prompts

| Prompt | Description |
|--------|-------------|
| **git-workflow** | Stage, commit, push, branch, and create PRs — one commit per file, `gh` CLI for PRs |
| **pr-description-template** | Generate PR title and description following Azure Core Content standards |

Prompts live in `prompts/` and are deployed to VS Code via `sync-prompts.ps1`.

## Deployment

Run `sync-prompts.ps1` to copy all `.prompt.md` and `.agent.md` files from skill assets and prompts to the VS Code prompts directory:

```powershell
cd C:\github\.github && git pull origin main && .\sync-prompts.ps1
```

---

## Changelog

### March 2026 — Agent efficiency improvements

**New skills:**
- **article-integrity** — Focused two-phase article integrity analysis for contradictions, naming inconsistencies, obvious typos, and link text mismatches. Ignores frontmatter, reports evidence first, and waits for confirmation before applying edits.
- **freshness-pass** — Full content freshness workflow combining fact-check (Phase A) + editorial review, SEO audit, markdown auto-fix, content suggestions, MS Style Guide checks (Phase B) + consolidation with git workflow (Phase C). Available as single-article and batch slash-commands.
- **my-workflow** — Personal working context providing baseline identity, owned services, curated repo list, PR framework, task routing table, agent rules, and quick commands.

**New supporting infrastructure:**
- **_shared/** — Consolidated shared reference directory. Extracted formatting-rules, seo-and-metadata, source-hierarchy, and writing-style from per-skill copies into canonical shared versions. Per-skill reference files now contain summaries with consolidation notices pointing to `_shared/`.
- **sources/** — Microsoft GitHub repository catalog. 3,000+ repos across Azure, microsoft, MicrosoftDocs, and MicrosoftCopilot orgs. Classified by product area (21 categories) and function type (10 types). Built with `classify-repos.mjs` and `build-crossrefs.mjs` scripts. Master index at `categories-index.yml`.

**New prompts:**
- **git-workflow.prompt.md** — Full git automation: sync upstream → create branch → stage + commit per file → push (with confirmation gate) → create PR via `gh` CLI. Supports partial execution ("just commit", "commit and push", "create PR").
- **pr-description-template.prompt.md** — PR title and description generator following Azure Core Content standards. Structured format: Summary → Changes → Impact → Testing → Related work items.

**Skill enhancements:**
- **doc-verifier** — Consolidated from previous `fact-checker` and `microsoft-doc-verifier` skills. Expanded to 10 workflows (Quick In-Place, Single Article, Full Report, Internal + Public, Freshness Review, Deep Agent, Batch Report, PR Review, Research, CIA Analysis). Three agent variants: full (~95 tools), slim (25 tools, default), CIA (31 tools with ADO access).
- **doc-writer** — Reference files updated with consolidation notices pointing to `_shared/` canonical versions for formatting-rules and writing-style.
- **documentor-workflow** — Reference files updated with consolidation notices pointing to `_shared/` canonical versions for formatting-rules, seo-and-metadata, and writing-style. Added sensitive-identifiers reference with approved GUID replacement values.

**Global configuration:**
- **copilot-instructions.md** — Added delegation-first rules (route to appropriate skills before acting), lazy-load (don't pre-read references unless needed), efficiency-over-verbosity, one-commit-per-file convention, git-workflow prompt reference.
- **sync-prompts.ps1** — Syncs `.prompt.md` and `.agent.md` files from `copilot/skills/*/assets/` and `prompts/` to `%APPDATA%\Code\User\prompts`.

### Earlier — Foundation skills

- **doc-verifier** — Initial creation with single-article fact-checking against Microsoft Learn sources. Expanded to multi-workflow system with standalone report generation, batch verification, and PR review capabilities.
- **doc-writer** — Article scaffolding for 5 article types (how-to, concept, quickstart, tutorial, overview) with frontmatter generation and Microsoft writing style compliance.
- **documentor-workflow** — Editorial quality workflows replicating DocuMentor VS Code extension capabilities: SEO review, metadata generation, engagement analysis, markdown auto-fix, link validation, date updates.
- **ado-work-items** — ADO work item creation and validation per Azure Core Content Standards. Includes description templates, repo URL lookup from sources catalog, and quality standards.
- **azure-quickstart-templates** — Azure Quickstart Template review, creation, and validation following the `Azure/azure-quickstart-templates` contribution guide. 14-point validation checklist.

---

## Development history

This section reconstructs the iterative Copilot Chat sessions that built each tool in this repository. Each entry represents a conversation thread or series of related sessions.

### Thread 1 — Fact-checking skill
**Goal:** "Create a skill that fact-checks Microsoft documentation against official sources."
- Started with single-article verification against learn.microsoft.com
- Added source authority hierarchy (Tier 1–4 public, Tier 5–7 internal)
- Expanded to 10 distinct workflows covering different verification scopes
- Created 3 agent variants (full/slim/CIA) for different tool environments
- Built 10 prompt assets for workflow-specific automation
- Consolidated earlier `fact-checker` and `microsoft-doc-verifier` experiments into unified `doc-verifier`

### Thread 2 — Documentation writing skill
**Goal:** "Build a skill that scaffolds Azure documentation articles following Microsoft Learn standards."
- Defined 5 article types with distinct structures (how-to, concept, quickstart, tutorial, overview)
- Created complete article templates with frontmatter, heading patterns, and section scaffolds
- Added formatting rules, SEO metadata standards, and writing style guidelines as reference files
- Integrated Microsoft brand voice (warm, crisp, ready to help) and word choice tables

### Thread 3 — Editorial workflow skill
**Goal:** "Replicate my DocuMentor VS Code extension as a Copilot skill."
- Built 10 editorial workflows: Quick Edit, Full Edit, Suggest Title/Description/Customer Intent, SEO Review, Engagement Review, Auto-Fix Markdown, Validate Links, Update Date
- Created engagement checklist with 5 diagnostic metrics (bounce, CTR, copy-try-scroll, dwell, exit)
- Added sensitive identifier reference with approved replacement GUIDs by severity level
- Created auto-fix rules for headings, code fences, alerts, lists, tables, links, images, spacing

### Thread 4 — ADO work item automation
**Goal:** "Create a skill for standardized ADO work items."
- Defined work item hierarchy: Content Portfolio → Initiative → Epic → Feature → User Story → Task
- Created description template: customer problem, solution approach, success criteria, measurement
- Added repo URL lookup integration with the sources catalog
- Established quality standards: sentence casing, specific file paths, measurable outcomes

### Thread 5 — Azure Quickstart Template reviewer
**Goal:** "Build a skill that reviews and creates Azure Quickstart Templates."
- Mapped the azure-quickstart-templates contribution guide into skill format
- Created 14-point validation checklist covering folder structure, naming, Bicep/JSON, metadata, README
- Added parameter rules, element ordering, and CI validation requirements

### Thread 6 — Shared reference consolidation
**Goal:** "Multiple skills have duplicate formatting and style references. Consolidate them."
- Extracted formatting-rules.md, seo-and-metadata.md, writing-style.md, source-hierarchy.md into `_shared/`
- Added consolidation notices to per-skill copies pointing to canonical `_shared/` versions
- Created `_shared/README.md` with usage guidelines: add shared files only when 2+ skills use stable content
- Established reference pattern: skills link using relative paths to `_shared/`

### Thread 7 — Microsoft GitHub repository catalog
**Goal:** "Build a catalog of Microsoft GitHub repos so agents can look up relevant repos without broad searches."
- Fetched 1,000 most active repos per org (Azure, microsoft, MicrosoftDocs, MicrosoftCopilot) via `gh repo list`
- Built classification pipeline: `classify-repos.mjs` (keyword-based product area + function type tagging) and `build-crossrefs.mjs` (cross-org category aggregation)
- Generated 21 product area category files + 4 org files + master index
- Total: 3,000 repos indexed with tags for product_area, function_type, language, stars, forks, last_pushed

### Thread 8 — Freshness pass workflow
**Goal:** "Create a single workflow that combines fact-checking and editorial review into one command."
- Designed 3-phase architecture: Phase A (fact-check) + Phase B (editorial + SEO + auto-fix + suggestions + style) + Phase C (consolidation + git workflow)
- Reused doc-verifier methodology for Phase A and documentor-workflow logic for Phase B
- Created single-article (`freshness-pass`) and batch (`batch-freshness-pass`) slash-commands
- Auto-parallelization for batch runs with 5+ files

### Thread 9 — Git workflow automation
**Goal:** "Automate my git workflow: branch, commit per file, push, PR."
- Created `git-workflow.prompt.md` with 7 steps: prereq checks → sync upstream → create branch → analyze changes → stage + commit per file → push (confirmation gate) → create PR (confirmation gate)
- Defined branch naming convention: `mbender-ms/<service>-<description>-<id>`
- Commit message format: `docs: <imperative verb> <what changed>`
- Partial execution support: maps user intent ("commit", "push", "create PR", "full workflow") to step subsets

### Thread 10 — PR description standards
**Goal:** "Standardize PR descriptions across my content work."
- Created `pr-description-template.prompt.md` based on Azure Core Content PR conventions
- PR title format: `<Service Name> | <Type> | Short description`
- Structured body: Summary → Documentation Updates → Files Modified → Impact → Testing → Related Work Items
- Added examples for new articles, freshness reviews, and bug fixes

### Thread 11 — Personal workflow context
**Goal:** "Set up a default skill with my personal working context so every agent knows my role and conventions."
- Created `my-workflow` with identity, role, owned services (Load Balancer, Virtual Network Manager, Networking, Network Security Perimeter, Application Gateway)
- Built task routing table mapping work types to specific skills and agents
- Added quick commands, branch naming conventions, and agent rules
- Created PR framework reference and curated repos list

### Thread 12 — Global efficiency rules
**Goal:** "Optimize copilot-instructions.md for agent efficiency."
- Added "delegate before doing" rule with skill routing
- Added lazy-load rule: don't pre-read reference files unless needed
- Added efficiency-over-verbosity rule
- Established one-commit-per-file convention and git-workflow prompt reference
- Set identity context: GitHub handle, MS alias, ADO org
