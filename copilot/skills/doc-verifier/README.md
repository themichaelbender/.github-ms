# Documentation Verifier

A VS Code Copilot skill that fact-checks Microsoft documentation against official sources across **all product areas** — Azure, Microsoft 365, Microsoft Security, Power Platform, Dynamics 365, Windows, Developer Tools, and more.

10 workflows covering in-place fixes, standalone reports, PR reviews, batch verification, research, freshness analysis, internal source verification, and customer incident analysis.

---

## Prerequisites

### Required

| Requirement | How to verify |
|-------------|---------------|
| **VS Code** (1.100+) | `code --version` |
| **GitHub Copilot** (agent mode) | Copilot Chat → mode dropdown → "Agent" available |
| **Microsoft Learn MCP Server** | Check MCP config for `microsoft-learn-mcp-server` entry |

### Optional

| Requirement | Needed for |
|-------------|------------|
| **GitHub MCP Server** | PR Review workflow (#8) |
| **GitHub CLI** (`gh`) | PR Review workflow (#8) |

---

## Installation

Copy the `doc-verifier/` folder to your Copilot skills directory:

**Windows:**
```powershell
Copy-Item -Recurse .\doc-verifier\ "$env:USERPROFILE\.copilot\skills\doc-verifier"
```

**macOS / Linux:**
```bash
cp -r ./doc-verifier/ ~/.copilot/skills/doc-verifier/
```

Restart VS Code. The skill is discovered automatically on startup.

### Folder structure

```
doc-verifier/
├── SKILL.md                                    # Skill definition (Copilot reads this)
├── README.md                                   # This file
├── assets/
│   ├── fact-check-and-edit.prompt.md           # W1: Quick In-Place
│   ├── single-article-check.prompt.md          # W2: Single Article
│   ├── complete-fact-check.prompt.md           # W3: Full Report
│   ├── complete-fact-checker-internal.prompt.md # W4: Internal + Public
│   ├── complete-freshness-review.prompt.md     # W5: Freshness Review
│   ├── microsoft-fact-checker.agent.md         # W6: Deep Agent
│   ├── batch-report.prompt.md                  # W7: Batch Report
│   ├── pr-review.prompt.md                     # W8: PR Review
│   ├── microsoft-researcher.prompt.md          # W9: Research
│   └── CIA-Analysis.prompt.md                  # W10: CIA Analysis
└── references/
    ├── source-hierarchy.md                     # Tiered source authority reference
    ├── source-guide.md                         # Educational guide to sources
    └── workflows.md                            # Detailed per-workflow procedures
```

---

## Usage

Open **GitHub Copilot Chat** in agent mode and describe what you want verified. The skill automatically selects the right workflow.

### Trigger examples

| You say... | Workflow |
|-----------|----------|
| "Fact-check this article" | #1 Quick In-Place or #2 Single Article |
| "Audit this article and give me a report" | #3 Full Report |
| "Check against internal docs too" | #4 Internal + Public |
| "Is this article still current?" | #5 Freshness Review |
| "Deep verification of every claim" | #6 Deep Agent |
| "Fact-check these files" / "this folder" | #7 Batch Report |
| "Fact-check PR #12345" | #8 PR Review |
| "Research Azure Front Door caching" | #9 Research |
| "Analyze customer incidents for App Service" | #10 CIA Analysis |

---

## Supported product areas

| Area | Examples |
|------|---------|
| **Azure** | Firewall, DDoS Protection, App Service, AKS, Cosmos DB |
| **Microsoft 365** | Exchange Online, SharePoint, Teams, OneDrive |
| **Microsoft Security** | Defender for Endpoint/Cloud, Sentinel, Entra ID, Purview, Intune |
| **Power Platform** | Power Apps, Power Automate, Power BI, Dataverse |
| **Dynamics 365** | Business Central, Finance, Supply Chain |
| **Windows** | Windows 11, Windows Server, Group Policy |
| **Developer Tools** | Visual Studio, .NET, Azure DevOps, GitHub Actions |

---

## Accuracy classifications

| Icon | Status | Meaning |
|------|--------|---------|
| ✅ | Accurate | Matches current official documentation |
| ⚠️ | Partially accurate | Needs minor update or added context |
| ❌ | Inaccurate | Contradicts official sources |
| 🕐 | Outdated | Was correct but superseded |
| ❓ | Unverifiable | No authoritative source found (flagged, not removed) |
| 🔗 | Broken link | URL doesn't resolve or anchor is missing |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Skill not recognized | Verify folder at `~/.copilot/skills/doc-verifier/` with `SKILL.md`. Restart VS Code. |
| `microsoft_docs_search` unavailable | Check MCP config for Microsoft Learn MCP Server. Restart VS Code. |
| PR workflow can't load PR | Ensure GitHub MCP Server configured and `gh auth status` shows authenticated. |
| Agent doesn't ask scoping questions | Add context: "fact-check this M365 Security article about Defender for Endpoint" |

---

## Migration from previous skills

This skill replaces both `fact-checker` and `microsoft-doc-verifier`. If you previously used either:

1. Remove `~/.copilot/skills/fact-checker/` and `~/.copilot/skills/microsoft-doc-verifier/`
2. Copy `doc-verifier/` to `~/.copilot/skills/`
3. Restart VS Code

All workflows from both previous skills are preserved with the same prompt assets.
