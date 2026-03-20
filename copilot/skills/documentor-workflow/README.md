# Documentor Workflow

A VS Code Copilot skill for running editorial quality workflows on Azure documentation articles. Covers SEO optimization, metadata generation, engagement analysis, markdown auto-fix, sensitive identifier replacement, and link validation.

Replicates DocuMentor extension capabilities for use in agent mode or without the extension.

---

## Prerequisites

| Requirement | How to verify |
|-------------|---------------|
| **VS Code** (1.100+) | `code --version` |
| **GitHub Copilot** (agent mode) | Copilot Chat → mode dropdown → "Agent" available |
| **DocuMentor extension** (optional) | Not required — this skill provides equivalent capabilities |

---

## Installation

Copy the `documentor-workflow/` folder to your Copilot skills directory:

```powershell
Copy-Item -Recurse .\documentor-workflow\ "$env:USERPROFILE\.copilot\skills\documentor-workflow"
```

Restart VS Code.

### Folder structure

```
documentor-workflow/
├── SKILL.md
├── README.md
└── references/
    ├── autofix-rules.md            # Markdown formatting auto-fix rules
    ├── engagement-checklist.md     # Engagement metric analysis & remediation
    ├── metadata-rules.md           # Title, description, H1, ms.date rules
    ├── sensitive-identifiers.md    # Approved placeholder values for GUIDs, secrets
    └── seo-checklist.md            # SEO audit checklist
```

---

## Usage

Open **GitHub Copilot Chat** in agent mode.

### Trigger examples

| You say... | Workflow |
|-----------|----------|
| "Review the SEO of this article" | SEO Review |
| "Suggest a better title for this article" | Suggest Title |
| "Suggest a description" | Suggest Description |
| "Fix the markdown formatting" | Auto-Fix Markdown |
| "Check for broken links" | Validate Links |
| "Run a full editorial review" | Full Edit Review |
| "Check engagement metrics" | Engagement Review |
| "Replace sensitive identifiers" | Sensitive ID replacement |

---

## Available workflows

| # | Workflow | Description |
|---|---------|-------------|
| 1 | **Quick Edit Review** | Targeted fixes: frontmatter, title, description, passive voice, headings |
| 2 | **Full Edit Review** | Comprehensive review covering all quality dimensions |
| 3 | **Suggest Title** | Generate title (30-65 chars, title case, primary keyword) |
| 4 | **Suggest Description** | Generate description (120-165 chars, unique, CTA) |
| 5 | **Suggest Customer Intent** | Generate customer intent in "As a role, I want X so that Y" format |
| 6 | **SEO Review** | Full SEO audit per [seo-checklist.md](references/seo-checklist.md) |
| 7 | **Engagement Review** | Metric analysis per [engagement-checklist.md](references/engagement-checklist.md) |
| 8 | **Auto-Fix Markdown** | Apply formatting rules from [autofix-rules.md](references/autofix-rules.md) |
| 9 | **Validate Links** | Check all links resolve correctly |
| 10 | **Update Date** | Set `ms.date` to today |

---

## Reference files

| File | Content |
|------|---------|
| [autofix-rules.md](references/autofix-rules.md) | Heading hierarchy, code fences, alerts, lists, tables, links, spacing |
| [engagement-checklist.md](references/engagement-checklist.md) | Bounce rate, CTR, dwell rate diagnosis and remediation |
| [metadata-rules.md](references/metadata-rules.md) | Title, description, H1, customer intent, ms.date specifications |
| [sensitive-identifiers.md](references/sensitive-identifiers.md) | Approved GUID and non-GUID placeholder values |
| [seo-checklist.md](references/seo-checklist.md) | Title, description, headings, intro, images, internal links |
