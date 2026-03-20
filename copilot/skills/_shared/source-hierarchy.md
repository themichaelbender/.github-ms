# Source Authority Hierarchy

Complete reference of allowed sources across all fact-checker workflows, organized by tier.

## Public Sources (All Workflows)

### Tier 1 — Primary Official Documentation

| Domain | Content Type |
|--------|-------------|
| `learn.microsoft.com` | Product docs, tutorials, how-tos, API reference, architecture guides |
| `azure.microsoft.com` | Service pages, pricing, SLAs, status, updates |

**Use for**: Product names, feature availability, configuration values, CLI/API syntax, limits, quotas, pricing, official guidance, best practices.

Tier 1 sources are the **ground truth**. If a lower-tier source contradicts Tier 1, the Tier 1 source takes precedence.

### Tier 2 — Secondary Official Sources

| Domain | Content Type |
|--------|-------------|
| `techcommunity.microsoft.com` | Feature announcements, deep dives, best practices from product teams |
| `devblogs.microsoft.com` | Engineering blogs, release notes, technical walkthroughs |
| `github.com/Azure/*` | REST API specs, SDK source code, CLI source, sample repos |
| `github.com/MicrosoftDocs/*` | Documentation source, include files, code samples |

**Use for**: Feature announcements, updates, API schemas, parameters, defaults, code examples, implementation patterns.

> REST API specs on GitHub are treated as **ground truth** for API parameters, defaults, and schemas — equivalent to Tier 1 for API-specific claims.

### Tier 3 — Tertiary Official Sources

| Domain | Content Type |
|--------|-------------|
| `developer.microsoft.com` | Microsoft Graph, platform SDKs, developer tools |
| `code.visualstudio.com` | VS Code documentation, extensions API |

**Use for**: Platform documentation, Graph API reference, SDK documentation, VS Code features.

### Tier 4 — Community (Verified Microsoft Only)

| Source | Requirement |
|--------|------------|
| Microsoft Q&A | Responses from accounts with Microsoft employee badge |
| Stack Overflow | Answers from verified Microsoft employees only |
| Reddit | Posts from verified Microsoft accounts only |

**Use for**: Clarifications, edge cases, engineer-answered Q&A, workarounds, undocumented behaviors.

> **Rule**: Anonymous or non-Microsoft community responses must NOT be cited. Always verify the responder is a confirmed Microsoft employee.

## Internal Sources (Workflows 3 and 6 Only)

### Tier 5 — Internal Documentation

| Source | Content Type |
|--------|-------------|
| SharePoint sites | Team wikis, planning docs, design specs |
| Internal wikis | Feature internals, architecture decisions |
| OneNote notebooks | Meeting notes, design reviews |

**Use for**: Design specifications, feature internals, unreleased details, implementation rationale.

### Tier 6 — Internal Code & Configuration

| Source | Content Type |
|--------|-------------|
| Internal repositories | Source code, configuration files, deployment scripts |
| Feature flags | Default values, experimental features |
| Error message catalogs | Error codes, messages, resolution steps |

**Use for**: Default values, flags, error messages, implementation truth, undocumented behaviors.

### Tier 7 — Internal Product Metadata

| Source | Content Type |
|--------|-------------|
| Service Tree | Service ownership, dependencies, SLAs |
| Eco Manager | SKU information, regional availability |
| Internal API catalogs | API versions, capabilities, retirement schedules |

**Use for**: Service names, SKUs, API versions, limits, regional availability, retirement timelines.

---

## Repository Catalog Integration

For GitHub-hosted sources (Tier 2), use the sources catalog to identify relevant repos:

- **Sources catalog**: `copilot/skills/sources/` — YAML data files with 3,000+ repos across 4 orgs
- **Per-org files**: `Azure.yml`, `MicrosoftDocs.yml`, `microsoft.yml`, `MicrosoftCopilot.yml`
- **Per-category files**: `azure-networking.yml`, `azure-compute.yml`, `azure-security.yml`, etc.
- **Index**: `categories-index.yml` — master list of all categories with repo counts

When scoping a fact-check to a specific product area, load the matching category YAML to identify relevant repos for source code and spec verification.
