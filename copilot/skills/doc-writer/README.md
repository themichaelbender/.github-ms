# Doc-Writer

A VS Code Copilot skill for scaffolding and writing production-ready Azure documentation articles following Microsoft Learn standards.

Supports five article types: how-to, concept, quickstart, tutorial, and overview.

---

## Prerequisites

| Requirement | How to verify |
|-------------|---------------|
| **VS Code** (1.100+) | `code --version` |
| **GitHub Copilot** (agent mode) | Copilot Chat → mode dropdown → "Agent" available |
| **Microsoft Learn MCP Server** (optional) | For fetching reference docs during writing |

---

## Installation

Copy the `doc-writer/` folder to your Copilot skills directory:

```powershell
Copy-Item -Recurse .\doc-writer\ "$env:USERPROFILE\.copilot\skills\doc-writer"
```

Restart VS Code.

### Folder structure

```
doc-writer/
├── SKILL.md
├── README.md
└── references/
    ├── article-templates.md      # Markdown templates for each article type
    ├── formatting-rules.md       # Code blocks, alerts, tables, links, images
    └── writing-style.md          # Microsoft writing style essentials
```

---

## Usage

Open **GitHub Copilot Chat** in agent mode.

### Trigger examples

| You say... | What happens |
|-----------|-------------|
| "Write a how-to article for configuring Azure Load Balancer health probes" | Generates complete article with frontmatter |
| "Scaffold a quickstart for Azure Cosmos DB" | Creates article skeleton with all required sections |
| "Convert these notes into a tutorial article" | Restructures content into tutorial format |

---

## Article types

| Type | Purpose | Title pattern | `ms.topic` |
|------|---------|--------------|------------|
| **How-to** | Task-oriented steps | `verb + noun` | `how-to` |
| **Concept** | Feature explanation | `noun phrase + concepts` | `concept-article` |
| **Quickstart** | Fast onboarding | `Quickstart: verb + noun` | `quickstart` |
| **Tutorial** | Progressive learning | `Tutorial: verb + noun` | `tutorial` |
| **Overview** | Product introduction | `What is <product>?` | `overview` |

---

## Reference files

| File | Content |
|------|---------|
| [article-templates.md](references/article-templates.md) | Complete markdown templates for all 5 article types |
| [formatting-rules.md](references/formatting-rules.md) | Code blocks, alert syntax, tables, cross-links, images |
| [writing-style.md](references/writing-style.md) | Microsoft writing style: voice, brevity, capitalization, SEO |
