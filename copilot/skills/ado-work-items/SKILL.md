---
name: ado-work-items
description: >-
  Create or validate Azure DevOps work items per Azure Core Content Standards.
  Ensures required fields (customer problem, solution, success criteria, metrics),
  proper markdown descriptions, acceptance criteria checklists, and linked GitHub PRs.
argument-hint: "e.g., 'create a work item for Load Balancer freshness review', 'validate work item 554937'"
user-invocable: true
---

# ADO Work Items Skill

Create and validate Azure DevOps work items that comply with Azure Core Content Standards.

## When to use

- Creating new User Story work items for content work
- Validating existing work items for completeness and quality
- Standardizing work item descriptions across the team

## Workflows

| # | Workflow | When to use | Output |
|---|---------|-------------|--------|
| 1 | **Create Work Item** | New content task (freshness, new article, rewrite, etc.) | ADO work item with templates applied |
| 2 | **Validate Work Item** | Check existing work item for completeness | Gap analysis + improvement suggestions |

## Required fields

Every work item must have these fields populated:

| Field | Work item type | Description |
|-------|---------------|-------------|
| **Title** | All | Short description that immediately conveys the work |
| **State** | All | Current status (New → Committed → Active → Review → Closed / Removed) |
| **Area** | All | Correct area path for your team (for queries and boards) |
| **Iteration** | All | Correct iteration/sprint (for queries and sprint boards) |
| **Description** | All | Customer problem, solution, success criteria, measurement plan |
| **Tags** | All | Classify the work (see Tags section below) |
| **Story Points** | User Stories | Level of effort estimate |
| **Tee Shirt Size** | Features | Estimated level of effort (S/M/L/XL) |
| **Parent** | All | Epic or Feature this work item belongs to |
| **Development** | User Stories | Link to PR; use `AZ#<id>` in GitHub to auto-link |

## Required description sections

Every work item description must include:

1. **Customer problem to solve** — from the customer's perspective
2. **How you'll solve the problem** — specific files and approach
3. **What does success look like?** — customer outcome
4. **How will you measure success?** — concrete metrics

## Feature vs User Story

- **Feature**: Larger body of work spanning multiple sprints. M1s or content devs create these. Dependency Tracker items are always Features — leave them as Features even if they don't span multiple sprints.
- **User Story**: Smaller unit of work completable within one sprint. If work will extend past one sprint, create a Feature and divide into child User Stories.

## Work item hierarchy

Content Portfolio → Initiative → Epic → Feature → User Story → Task

| Level | Owner | Scope |
|-------|-------|-------|
| Content Portfolio | M2 | Aligned with CSA |
| Initiative | M2 | Aligned to Content Team priorities |
| Epic | M1 | Semester-level guiding work |
| Feature | M1 or IC | Multi-sprint work with context |
| User Story | IC | Single-sprint deliverable |
| Task | IC | Granular sub-steps of a User Story |

## Workflow states

| State | When to use |
|-------|-------------|
| **New** | Initial state; triage and gather details. Move back here if work stalls. |
| **Committed** | Enough detail to schedule; planned for current sprint but not yet started. |
| **Active** | Work has begun. Only items in the current sprint should be Active. |
| **Review** | Draft complete; soliciting stakeholder feedback. May bounce between Active ↔ Review. |
| **Closed** | Acceptance criteria met. Don't close if no action was taken. |
| **Removed** | Out of scope, not actionable, duplicate, or won't be done. Terminal state — include context for why. |

## Story points

Use story points consistently so the team can estimate capacity. If you don't know how much work a User Story will take, create a research work item to scope it first. A User Story should span one sprint — if it won't, break it into multiple User Stories under a Feature.

## Repo URL lookup

When a work item references a GitHub repo or article path, resolve the repo URL from the sources catalog at `copilot/skills/sources/`. Use the per-org YAML files (`MicrosoftDocs.yml`, `Azure.yml`) to find the correct clone URL, or use `my-workflow/references/repos.md` for the curated active repos.

## Title format

`{Service} | {WorkflowType} | {Brief Description}`

Example: `Load Balancer | Maintenance | Github Issues & PR Review`

## Tags

Always include: service tag (e.g., `azure-load-balancer`), area tag (e.g., `Networking`), workflow type (e.g., `content-maintenance`), and `cda`.

### ACC team required tags

| Tag | Description |
|-----|-------------|
| `content-maintenance` | Content health improvements |
| `mvp-feedback` | Updates from MVP feedback |
| `AAC` | Architecture center content |
| `new-feature` | New feature content |
| `PM-enablement` | PM enablement activity (>2 hours) |
| `css-support` | Content gaps/updates from CSS signals |
| `acc-horizontal-*` | Horizontal initiatives (replace `*` with security, reliability, supportability) |
| `curation` | Content curation activity |
| `CSAT` | CSAT initiatives |
| `Linux` | Improving Linux content |
| `content-gap` | Gaps in current content portfolio |
| `Process` | Process activities |
| `Training` | Training content updates |

Check with your manager for additional service-specific tags.

## Sprint planning

- Prioritize and commit to the highest-priority backlog items based on team velocity and capacity.
- Don't simply move unfinished items to the next sprint — reflect on why and whether to re-scope, re-prioritize, or break up the work.
- When changing an iteration path, add a comment explaining why.

## Work completion summary

Every ADO work item must include a **Summary of work completed** section before closing. This section provides a metrics table that quantifies the work delivered. Add this section to the work item description when the work is done.

### Required metrics table

```markdown
## Summary of work completed

| Metric | Count |
|--------|-------|
| Total PRs | |
| PRs reviewed | |
| Articles created | |
| Articles updated | |
| PRs merged | |
| PRs closed (not merged) | |
| Total files changed | |
| Total line changes | |
```

- Fill in every row; use `0` when a metric does not apply.
- Use `~` prefix for approximate counts (e.g., `~466`).
- Derive counts from the linked GitHub PRs whenever possible.

## Prompt asset

| File | Workflow |
|------|----------|
| `assets/ado-work-item-standards.prompt.md` | Create & Validate |
