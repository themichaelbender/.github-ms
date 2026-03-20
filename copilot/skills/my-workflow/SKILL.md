---
name: my-workflow
description: >-
  Default working instructions for Michael Bender (@mbender-ms). Covers Azure
  networking documentation responsibilities, repo conventions, environment
  commands (sync prompts, repo management), and PR description framework.
  Automatically referenced by agents to understand how I work.
argument-hint: "e.g., 'sync prompts', 'list my repos', 'draft PR description for Load Balancer article', 'what services do I own?'"
user-invocable: true
---

# My Workflow — Default Agent Instructions

Personal working context for **Michael Bender** (`@mbender-ms`). This skill provides agents with baseline knowledge about my role, responsibilities, services, repos, and common commands so they can act without repeated context.

---

## Identity

| Field | Value |
|-------|-------|
| **Name** | Michael Bender |
| **GitHub** | `@mbender-ms` |
| **MS Alias** | `mbender` |
| **Role** | Content Developer — Azure Networking |
| **Team** | Azure Core Content |
| **ADO Organization** | `msft-skilling` |
| **ADO Project** | `Content` |
| **Git email** | `102542398+mbender-ms@users.noreply.github.com` |

---

## Services & Responsibilities

### Primary services (I own these)

| Service | Repo path | ms.service | Learn URL prefix |
|---------|-----------|------------|------------------|
| **Azure Load Balancer** | `articles/load-balancer/` | `azure-load-balancer` | `/azure/load-balancer/` |
| **Azure NAT Gateway** | `articles/nat-gateway/` | `azure-nat-gateway` | `/azure/nat-gateway/` |
| **Azure Virtual Network** | `articles/virtual-network/` | `azure-virtual-network` | `/azure/virtual-network/` |
| **Azure Networking (cross-service)** | `articles/networking/` | `azure-networking` | `/azure/networking/` |

### Secondary services (I contribute to)

| Service | Repo path | ms.service |
|---------|-----------|------------|
| **Application Gateway** | `articles/application-gateway/` | `azure-application-gateway` |
| **Azure DDoS Protection** | `articles/ddos-protection/` | `azure-ddos-protection` |
| **Web Application Firewall** | `articles/web-application-firewall/` | `azure-web-application-firewall` |
| **Azure Firewall** | `articles/firewall/` | `azure-firewall` |
| **Azure Bastion** | `articles/bastion/` | `azure-bastion` |
| **Azure Front Door** | `articles/frontdoor/` | `azure-frontdoor` |
| **Azure DNS** | `articles/dns/` | `azure-dns` |
| **Azure VPN Gateway** | `articles/vpn-gateway/` | `azure-vpn-gateway` |
| **Azure ExpressRoute** | `articles/expressroute/` | `azure-expressroute` |

### Spotlight / project work

- Zero Trust networking documentation
- Secure network foundation architectures (hub-spoke, layered security)
- Cross-service networking scenarios

> **Maintaining this list**: Add or remove services as responsibilities change. This list drives agent context for work item creation, PR routing, and fact-checking scope.

---

## Microsoft Learn GitHub Repos

<!-- Curated repos I actively contribute to. For full repo catalog across all orgs, see copilot/skills/sources/ -->

| Repo | Clone URL | Purpose |
|------|-----------|---------|
| `azure-docs-pr` | `https://github.com/MicrosoftDocs/azure-docs-pr.git` | Azure documentation (private) |
| `SupportArticles-docs-pr` | `https://github.com/MicrosoftDocs/SupportArticles-docs-pr.git` | Support/troubleshooting articles |
| `azure-docs` | `https://github.com/MicrosoftDocs/azure-docs.git` | Azure documentation (public mirror) |

For the complete repository catalog (3,000+ repos across MicrosoftDocs, Azure, microsoft orgs), see [references/repos.md](references/repos.md) and `copilot/skills/sources/`.

---

## Quick Commands

Frequently used commands that agents should know how to execute when I ask.

### Sync prompts

Pull latest from the `.github` repo and sync all prompt/agent files to VS Code:

```powershell
cd C:\github\.github
git pull origin main
.\sync-prompts.ps1
```

The `sync-prompts.ps1` script copies all `*.prompt.md` and `*.agent.md` files from:
- `copilot/skills/*/assets/` → `%APPDATA%\Code\User\prompts\`
- `prompts/` → `%APPDATA%\Code\User\prompts\`

### Switch to a repo

```bash
cd /c/github/<repo-name>
```

### Session startup (documentation work)

1. `git branch --show-current` — check current branch
2. `git status --porcelain` — check for uncommitted changes
3. If on feature branch with changes → stash first
4. `git checkout main && git fetch upstream main && git pull upstream main` — sync main
5. `git push origin main` — push to fork

### Create feature branch

Branch naming: `mbender-ms/<service>-<brief-description>-<work-item-id>`

```bash
git checkout -b mbender-ms/load-balancer-health-probe-update-554937
```

---

## PR Description Framework

Use the structure in [references/pr-framework.md](references/pr-framework.md) for all GitHub PR descriptions. The `generate_pr_description` MCP tool follows this framework, but agents should use the reference file as a fallback when the tool is unavailable.

**Quick rules:**
1. `AB#<id>` in PR body only — never in title or commits
2. PR title — plain language, no AB# prefix
3. Article intent section — always present, reader-perspective
4. Files section — every changed file with path and annotation
5. No filler — describe content value, not process

---

## Conventions

### Commit messages

- Format: `docs: <imperative verb> <what changed>`
- One commit per file
- No AB# references in commits
- Examples:
  - `docs: Add health probe troubleshooting section`
  - `docs: Update NAT Gateway outbound connectivity overview`
  - `docs: Fix broken cross-reference links in load-balancer overview`

### Work item titles

Format: `{Service} | {WorkflowType} | {Brief Description}`

Examples:
- `Load Balancer | Maintenance | GitHub Issues & PR Review`
- `Networking | New Feature | Secure network foundation article`
- `NAT Gateway | Freshness | Update outbound connectivity guidance`

### Tags

Always include on work items: service tag, area tag (`Networking`), workflow type, and `cda`.

---

## Agent behavior notes

When agents work with me, they should:

1. **Use MCP tools** for work items, git workflow context, PR descriptions, and completion calculations
2. **Never commit to main** — always create a feature branch first
3. **One commit per file** — never batch multiple files in a single commit
4. **Ask before pushing** — always get approval before `git push`
5. **Check the services table** to determine `ms.service`, repo path, and scope
6. **Follow the PR description framework** above — don't invent custom formats
7. **Use sentence casing** for all headings in documentation articles
8. **Run sync-prompts.ps1** when I say "sync prompts" — no need to ask what I mean
