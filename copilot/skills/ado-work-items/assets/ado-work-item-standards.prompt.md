---
mode: agent
description: Create or validate ADO work items per Azure Core Content Standards — ensures required fields, proper descriptions, and linked PRs
tools:
  - microsoft-learn-mcp-server/microsoft_docs_search
  - microsoft-learn-mcp-server/microsoft_docs_fetch
  - read/readFile
  - read/problems
  - search/codebase
  - search/fileSearch
  - search/textSearch
  - edit/editFiles
  - execute/runInTerminal
  - execute/getTerminalOutput
  - todo
---

# ADO Work Item Standards — Azure Core Content

Create or validate Azure DevOps work items that comply with **Azure Core Content Standards**. Every work item must clearly articulate the customer problem, the proposed solution, measurable success criteria, and a tracking plan — before any work begins.

## Required Fields

Every work item must have the following fields populated:

| Field | Work item type | What to include |
|-------|---------------|-----------------|
| **Title** | All | Short description that immediately conveys the work |
| **State** | All | Current status; keep Discussion updated with running status notes |
| **Area** | All | Correct area path for your team (for queries and boards) |
| **Iteration** | All | Correct iteration/sprint (for queries and sprint boards) |
| **Description** | All | Customer problem, solution, success criteria, and measurement plan |
| **Tags** | All | Classify the work using ACC required tags (see below) |
| **Story Points** | User Stories | Level of effort estimate |
| **Tee Shirt Size** | Features | Estimated level of effort (S/M/L/XL) |
| **Parent** | All | The epic or feature this work item belongs to |
| **Development** | User Stories | Link to PR; comment `AZ#<work_item_id>` on GitHub to auto-close |

## Feature vs User Story

- **Feature**: Larger body of work spanning multiple sprints. Created by M1s or content devs. Dependency Tracker items are always Features — leave them as Features even if they don't span multiple sprints.
- **User Story**: Smaller unit of work completable within one sprint. If work will extend past one sprint, create a Feature and divide into child User Stories.

## Work Item Hierarchy

Content Portfolio → Initiative → Epic → Feature → User Story → Task

| Level | Owner | Scope |
|-------|-------|-------|
| Content Portfolio | M2 | Aligned with CSA |
| Initiative | M2 | Aligned to Content Team priorities |
| Epic | M1 | Semester-level guiding work |
| Feature | M1 or IC | Multi-sprint work with context |
| User Story | IC | Single-sprint deliverable |
| Task | IC | Granular sub-steps of a User Story |

Always link work items to a higher-level parent. Don't use the same work item type as a parent (you lose parent/child linking functionality). When all child items are complete, close the parent.

## Required Information

Gather the following from the user. If any field is missing, prompt for it before proceeding.

### 1. Customer problem to solve
> What is the specific customer pain point, confusion, or gap this work addresses?

- Must be stated from the **customer's perspective**, not an internal task description.
- Reference support signals where possible (CSS incidents, feedback comments, freshness flags, GitHub issues).
- Bad example: "Article needs updating."
- Good example: "Customers configuring ExpressRoute Global Reach frequently misconfigure peering locations because the current article doesn't list supported region pairs, leading to failed deployments and support tickets."

### 2. How you'll solve the problem
> What content changes, new articles, or restructuring will you deliver?

- Be specific: list the files, sections, or new pages involved.
- Include the type of work: freshness review, new article, rewrite, screenshot update, code sample update, etc.
- Reference the official service documentation or feature page that serves as the source of truth.
- **Repo lookup**: Resolve the correct repo URL from `copilot/skills/sources/` (per-org YAMLs) or `my-workflow/references/repos.md`.

### 3. What does success look like?
> Describe the desired end state once this work is published.

- Frame it as a customer outcome, not a checklist item.
- Bad example: "Article is updated."
- Good example: "Customers can follow the step-by-step guide to configure Global Reach without needing to open a support ticket. The article reflects the current portal experience and lists all supported region pairs."

### 4. How will you measure success?
> What metrics or signals will confirm the problem is resolved?

- Use concrete, observable indicators. Examples:
  - Reduction in related CSS tickets within 30/60/90 days
  - Decrease in negative documentation feedback (thumbs-down) on the article
  - Increase in page views or time-on-page indicating useful content
  - Successful validation by a subject-matter expert or PM
  - Zero broken links or build warnings after publish

## Default Field Values

| Field | Default | Notes |
|-------|---------|-------|
| **Start Date** | Current date (`{{today}}`) | Set automatically if not specified by the user |
| **Due Date** | End of current month | Set automatically if not specified by the user |
| **State** | New | Initial state for newly created work items |
| **Priority** | 2 | Default priority; adjust based on severity of customer impact |

## Workflow States

Work items progress through these states. Keep the state current and add Discussion notes at each transition.

| State | When to use |
|-------|-------------|
| **New** | Initial state after creation or intake (dependency tracker, form, manual). Triage and gather details here. Move items back to New if work stalls. |
| **Committed** | Enough detail to schedule; planned for the current sprint but work has not begun. May be brief or extended if the item experiences delays. |
| **Active** | Work has begun. Add links to PRs and artifacts. Ensure story points and start date are set. **Only items in the current sprint should be Active.** |
| **Review** | Draft complete; soliciting stakeholder feedback. May alternate between Active ↔ Review through multiple rounds. PR links should be attached by this point. |
| **Closed** | Acceptance/success criteria met. If scope changed and remaining work exists, describe what was done and create new items for the rest. Don't close if no action was taken. |
| **Removed** | Out of scope, not actionable, duplicate, or won't be done. **Terminal state** — include context explaining why. Consider the perspective of someone seeing this item for the first time. |

### State best practices

- Provide regular updates at each stage — think about what someone picking up this work for the first time would need.
- Work items should be Active or Committed only during the current sprint. If work stalls, move back to New.
- When changing iteration paths, add a comment explaining why.
- Don't simply move unfinished items to the next sprint — reflect on whether to re-scope, re-prioritize, or break up the work.
- Link to related items in collaborator backlogs (e.g., `produces for: <item in PM backlog>`).
- Use `AZ#<id>` in GitHub comments to auto-close ADO items when GitHub issues close.

## ACC Required Tags

Use these exact tags for consistency across Azure Core Content. Pay attention to hyphenation and case.

| Tag | Description |
|-----|-------------|
| `content-maintenance` | Content health improvements |
| `mvp-feedback` | Updates from MVP feedback |
| `AAC` | Architecture center content |
| `new-feature` | New feature content |
| `PM-enablement` | PM enablement activity (>2 hours) |
| `css-support` | Content gaps/updates from CSS signals |
| `acc-horizontal-*` | Horizontal initiatives — replace `*` with: security, reliability, supportability |
| `curation` | Content curation activity |
| `CSAT` | CSAT initiatives |
| `Linux` | Linux content improvements |
| `content-gap` | Gaps in current content portfolio |
| `Process` | Process activities |
| `Training` | Training content updates |

Check with your manager for additional service-specific tags.

## Story Points

Story points help the team understand capacity. Use them consistently. If you don't know how much effort a User Story requires, that's a sign you need to scope the work further — create a research work item first.

A User Story should span one sprint. If it won't fit, break it into multiple User Stories under a Feature.

## Sprint Planning

- **Prioritize and commit**: Select the highest-priority backlog items based on team velocity and capacity.
- **Continuously improve**: Learn from sprint retrospectives; ensure sprint activities align with strategic goals.
- **Manage work items**: Avoid overloading sprints and prevent continual rollover. Group work items by requestors or sources to align workloads.
- **Execute and review iteratively**: Plan to complete all committed items by sprint end; hold retrospectives to identify improvements.

## Open Source Work Tracking

When work spans both GitHub and Azure DevOps:

1. The ADO work item must include a link to the GitHub work item.
2. The GitHub work item is the source-of-truth for publicly discussable work. The ADO item should reflect it.
3. When submitting a PR that addresses work tracked in both places, reference both to enable auto-closing/relating.
4. Use full GitHub references (e.g., `PowerShell/DSC#123`) instead of bare `#123`.
5. File GitHub issues for major work (new articles, rewrites, restructuring). Minor fixes (typos, formatting) can go as PRs without issues.

## Associated GitHub PR

**Always ask the user:**

> Is there an associated GitHub PR for this work? If so, provide the PR number or URL.

- If a PR exists, link it in the work item description using markdown format: `[#PR_NUMBER](https://github.com/MicrosoftDocs/<repo>/pull/PR_NUMBER)`
- Do **not** use bare `#PR_NUMBER` in ADO — ADO interprets that as a work item reference.
- If no PR exists yet, note in the work item that a PR will be created and linked once the branch is ready.
- The `AB#<work_item_id>` tag in the PR body creates the automatic bidirectional link between GitHub and ADO.

## Work Item Description Template

Structure the ADO work item description in Markdown using this format:

```markdown
## Customer problem to solve
<Enter your answer>

## How you'll solve the problem
<Enter your answer>

## What does success look like?
<Enter your answer>

## How will you measure success?
<Enter your answer>

## Problem / Impact
{description text, or "Update {service} documentation to ensure accuracy and completeness."}

## Solution
Review and update {service} documentation following Microsoft Writing Style Guide and content quality standards.

## Resources
- **Parent Feature**: #{parentId}
- **Start Date**: {YYYY-MM-DD}
- **Target Date**: {targetDate} ← only if provided
- **PM Contact**: {pmContact} ← only if provided
- **Tags**: {workflowType}; {service}; cda
- **Modality**: Documentation
- **Proposal Type**: {Update|New}
- **Article**: [Article title](https://learn.microsoft.com/en-us/azure/...)
- **PR**: [#PR_NUMBER](https://github.com/MicrosoftDocs/<repo>/pull/PR_NUMBER) *(if applicable)*
- **Related work items**: AB#XXXXX *(if applicable)*
```

## Acceptance Criteria Template

```markdown
### Success criteria
- [ ] All four required sections (problem, solution, success, measurement) are populated
- [ ] Customer problem is stated from the customer's perspective
- [ ] Files/articles to be changed are identified
- [ ] Success metrics are concrete and measurable
- [ ] Content is accurate and up-to-date
- [ ] All links are valid and working
- [ ] Follows Microsoft Writing Style Guide
- [ ] Headings use sentence casing
- [ ] ms.date updated to publish date after changes are merged
- [ ] GitHub PR linked (or noted as pending)

### Documentation updates
- [ ] Review and update {service} articles
- [ ] Verify code samples are tested
- [ ] Update metadata (ms.date, ms.service)

### Verification tasks
- [ ] Content reviewed and updated
- [ ] Technical accuracy validated against learn.microsoft.com
- [ ] Article builds without warnings or broken links
- [ ] Reviewed by peer or subject-matter expert
- [ ] PR created and approved
- [ ] Changes validated in staging
```

## Workflow

### Creating a new work item
1. Ask the user for the **service name** and **workflow type** (content-maintenance, new-feature, PM-enablement, css-support, content-gap, mvp-feedback, AAC, curation, CSAT, acc-horizontal-*, Training, Process).
2. Ask: **Feature or User Story?** — Features span multiple sprints; User Stories fit in one sprint.
3. Collect answers for all four required description fields. Coach the user on quality if answers are vague.
4. Ask: **"Is there an associated GitHub PR?"**
5. Set **Start Date** to today if not specified.
6. Set **Due Date** to end of current month if not specified.
7. Set **Story Points** (User Stories) or **Tee Shirt Size** (Features).
8. Ensure **Parent** is assigned (link to Epic or Feature).
9. Generate the work item using the description and acceptance criteria templates above.
10. Present the completed work item for user review before creating it in ADO.

### Validating an existing work item
1. Retrieve the work item from ADO.
2. Check that all four required description sections are present and well-written.
3. Verify all required fields are populated: Title, State, Area, Iteration, Tags, Parent, Story Points/Tee Shirt Size.
4. Verify dates are set (flag if Start Date or Due Date are missing).
5. Check for a linked GitHub PR (Development field).
6. Verify State is appropriate (Active/Committed only for current sprint).
7. Check that tags use the ACC required tag list.
8. Report any gaps and suggest improvements.

## Work Completion Summary

Before closing or resolving a work item, add a **Summary of work completed** section to the description with the following metrics table:

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
- Add this section after all work is complete and before transitioning the work item to **Closed** or **Resolved**.

## Quality Standards

- **Sentence casing** for all headings (capitalize only the first word and proper nouns).
- **No internal jargon** in customer-facing problem statements — write as if the customer will read it.
- **Specific file paths** in the solution section — not just "update the article."
- **Measurable outcomes** in the success metrics — not "article is better."
- **Markdown format** for all Description and AcceptanceCriteria fields in ADO.
- **Always use `format: "markdown"`** when calling ADO MCP tools to write comments or descriptions.
