---
name: doc-verifier
description: >-
  Verify technical accuracy of Microsoft documentation across all product areas
  (Azure, M365, Security, Power Platform, Dynamics 365, Windows, DevTools).
  10 workflows: quick fix, full report, internal sources, freshness review,
  deep agent check, batch report, PR review, research, single article, and
  customer incident analysis. Tiered source hierarchy prioritizing learn.microsoft.com.
argument-hint: "Describe what to verify — e.g., 'fact-check this article', 'verify PR #123', 'research Azure Front Door caching', 'CIA analysis for App Service'"
user-invocable: true
---

# Documentation Verifier

Verify technical accuracy of Microsoft documentation across **any product area** using a structured source hierarchy and reproducible workflows.

## Choose your workflow

| # | Workflow | When to use | Output | Prompt asset |
|---|---------|-------------|--------|--------------|
| 1 | **Quick In-Place** | Fast fix; edit file directly, resolve INCLUDEs | Edits + chat refs | `fact-check-and-edit.prompt.md` |
| 2 | **Single Article** | Full single-file check with product-area scoping | Edits + chat summary | `single-article-check.prompt.md` |
| 3 | **Full Report** | Comprehensive audit with saved report artifact | Edits + `factcheck_*.md` | `complete-fact-check.prompt.md` |
| 4 | **Internal + Public** | Cross-reference internal MS resources | Edits (public) + confidential report | `complete-fact-checker-internal.prompt.md` |
| 5 | **Freshness Review** | Staleness + accuracy in one pass | Edits + chat summary | `complete-freshness-review.prompt.md` |
| 6 | **Deep Agent** | Per-fact evidence for critical content | WHAT/WHY/EVIDENCE output | `microsoft-fact-checker-slim.agent.md` |
| 7 | **Batch Report** | Verify folder or file set | `factcheck_*.md` report | `batch-report.prompt.md` |
| 8 | **PR Review** | Fact-check all changed files in a PR | `factcheck_PR*.md` report | `pr-review.prompt.md` |
| 9 | **Research** | Investigate a topic with citations, no edits | Research report | `microsoft-researcher.prompt.md` |
| 10 | **CIA Analysis** | Customer incident patterns for a service area | Incident analysis report | `microsoft-fact-checker-cia.agent.md` |

### Decision guide

- **"Just fix this article"** → Workflow 1
- **"Fact-check this Defender article"** → Workflow 2 (product-area scoped)
- **"Audit and give me a report"** → Workflow 3
- **"Check against internal docs too"** → Workflow 4
- **"Is this article still current?"** → Workflow 5
- **"Deep verification of every claim"** → Workflow 6
- **"Fact-check these files / this folder"** → Workflow 7
- **"Fact-check PR #12345"** → Workflow 8
- **"Research topic X with sources"** → Workflow 9
- **"Analyze customer incidents for Service Y"** → Workflow 10

## Step 0 — Scope (all workflows)

Before verifying, determine the product area. Ask if not obvious:

1. **Product area**: Azure, M365, Security, Power Platform, Dynamics 365, Windows, DevTools
2. **Service/feature**: e.g., Defender for Endpoint, Azure Firewall, Intune
3. **Scope**: Single file, folder, PR, or topic
4. **Output**: In-place edits, report, chat, or both
5. **Depth**: Quick check or thorough

Use answers to select search domains and load the matching sources catalog YAML from `copilot/skills/sources/` (e.g., `azure-networking.yml` for Azure Networking). This gives you the full list of relevant GitHub repos for Tier 2 source verification.

### Product area search domains

| Area | Search paths | Key terms |
|------|-------------|-----------|
| Azure | `/azure/`, `/azure/architecture/` | Azure, ARM, Bicep, subscription |
| M365 | `/microsoft-365/`, `/office/` | Exchange, SharePoint, Teams |
| Security | `/security/`, `/defender/` | Defender, Sentinel, Entra, Purview |
| Power Platform | `/power-platform/`, `/power-apps/` | Power Apps, Dataverse, connectors |
| Dynamics 365 | `/dynamics365/` | D365, Business Central, Finance |
| Windows | `/windows/`, `/windows-server/` | Windows 11, Group Policy |
| DevTools | `/visualstudio/`, `/dotnet/` | Visual Studio, .NET, NuGet |

## Source authority hierarchy

Always prefer the highest available tier. See [_shared/source-hierarchy.md](../_shared/source-hierarchy.md) for the complete reference with repository catalog integration.

| Tier | Source | Use for |
|------|--------|---------|
| **1** | learn.microsoft.com, azure.microsoft.com | Product docs, features, limits, pricing |
| **2** | TechCommunity, DevBlogs, GitHub repos | Announcements, API specs, code samples |
| **3** | developer.microsoft.com, code.visualstudio.com | Platform docs, Graph API |
| **4** | MS Q&A, Stack Overflow (verified MS employees only) | Edge cases, engineer Q&A |
| **5–7** | Internal docs, code, metadata (Workflows 4 & 9 only) | Implementation truth |

> Higher tier always wins. Internal sources never appear in public docs.

## Accuracy classifications

| Icon | Status | Action |
|------|--------|--------|
| ✅ | Accurate | No change |
| ⚠️ | Partially accurate | Edit with correction |
| ❌ | Inaccurate | Edit + cite source |
| 🕐 | Outdated | Update + cite source |
| ❓ | Unverifiable | Flag — do not remove |
| 🔗 | Broken link | Fix or flag |

## Quality checklist

See [_shared/quality-checklist.md](../_shared/quality-checklist.md) for the complete checklist (fact-check, editorial, and batch sections).

See [references/workflows.md](references/workflows.md) for detailed per-workflow procedures.

## Prompt assets

| File | Workflow |
|------|----------|
| `assets/fact-check-and-edit.prompt.md` | 1 — Quick In-Place |
| `assets/single-article-check.prompt.md` | 2 — Single Article |
| `assets/complete-fact-check.prompt.md` | 3 — Full Report |
| `assets/complete-fact-checker-internal.prompt.md` | 4 — Internal + Public |
| `assets/complete-freshness-review.prompt.md` | 5 — Freshness Review |
| `assets/microsoft-fact-checker-slim.agent.md` | 6 — Deep Agent |
| `assets/batch-report.prompt.md` | 7 — Batch Report |
| `assets/pr-review.prompt.md` | 8 — PR Review |
| `assets/microsoft-researcher.prompt.md` | 9 — Research |
| `assets/CIA-Analysis.prompt.md` | 10 — CIA Analysis |
