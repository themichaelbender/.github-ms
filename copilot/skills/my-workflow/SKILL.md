---
name: my-workflow
description: >-
  Default working instructions for Michael Bender (@mbender-ms). Covers Azure
  networking documentation responsibilities, repo conventions, environment
  commands, and PR/work-item standards. Delegates specialized work to sibling
  skills and sub-agents for efficiency.
argument-hint: "e.g., 'sync prompts', 'list my repos', 'draft PR description for Load Balancer article', 'what services do I own?'"
user-invocable: true
---

# My Workflow — Default Agent Instructions

Personal working context for **Michael Bender** (`@mbender-ms`). Provides agents with baseline context about role, services, repos, and conventions. **Load reference files only when the task requires them** — don't pre-load everything.

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

## Task Routing — Delegate Before Doing

Before processing a request inline, check whether a sibling skill or sub-agent should handle it. **Delegation saves tokens and produces better results.**

| Task pattern | Delegate to | How |
|---|---|---|
| Write/scaffold a new article | `doc-writer` skill | Invoke skill directly |
| Fact-check or verify accuracy | `doc-verifier` skill or `microsoft-fact-checker` agent | Use agent for deep checks; skill for quick fixes |
| Create/validate ADO work items | `ado-work-items` skill | Invoke skill directly |
| SEO, metadata, editorial review | `documentor-workflow` skill | Invoke skill directly |
| Codebase exploration or research | `Explore` agent | Spawn sub-agent with thoroughness level |
| PR description generation | `generate_pr_description` MCP tool | Fall back to [references/pr-framework.md](references/pr-framework.md) |
| Branch, commit, push, create PR | `git-workflow` prompt | Invoke prompt; uses `gh` CLI for PRs |
| Complex multi-step workflows | Spawn sub-agents in parallel | See [Sub-agent patterns](#sub-agent-patterns) below |

**Rule**: If a task maps to a row above, delegate it — don't re-implement the logic inline.

### Sub-agent patterns

Use `runSubagent` for independent, parallelizable work:

- **Fact-check + editorial review** — Spawn `microsoft-fact-checker` and a second agent for `documentor-workflow` SEO/engagement checks simultaneously, then merge results.
- **Multi-file verification** — Spawn one `Explore` agent per file group to gather context, then process findings.
- **Research + writing** — Spawn `Explore` agent for research while you scaffold the article structure, then integrate findings.

**When NOT to spawn**: Single-file edits, quick commands, simple lookups. Sub-agents have overhead — only use them when the task is complex enough to benefit from parallelism.

---

## Services & Responsibilities

### Primary services (I own these)

| Service | Repo path | ms.service |
|---------|-----------|------------|
| Azure Load Balancer | `articles/load-balancer/` | `azure-load-balancer` |
| Azure Virtual Network Manager | `articles/virtual-network-manager/` | `azure-virtual-network-manager` |
| Azure Networking (cross-service) | `articles/networking/` | `azure-networking` |
| Azure Network Security Perimeter | `articles/private-link/` | `azure-network-security-perimeter` |
| Azure Application Gateway | `articles/application-gateway/` | `azure-application-gateway` |

### Secondary services (I contribute to)

 DDoS Protection · Web Application Firewall · Azure Firewall · Bastion · Front Door · DNS · VPN Gateway · ExpressRoute

> **Need repo paths or ms.service values for secondary services?** Ask, or look up in the sources catalog at `copilot/skills/sources/azure-networking.yml`.

### Spotlight / project work

- Zero Trust networking documentation
- Secure network foundation architectures (hub-spoke, layered security)
- Cross-service networking scenarios

---

## Repos & Sources

**Primary repos**: `azure-docs-pr` (private), `SupportArticles-docs-pr` (private), `azure-docs` (public mirror)

> **Full details**: Load [references/repos.md](references/repos.md) only when you need clone URLs, fork setup, or the extended repo list. For the 3,000+ repo catalog, see `copilot/skills/sources/`.

---

## Quick Commands

### Sync prompts

```powershell
cd C:\github\.github && git pull origin main && .\sync-prompts.ps1
```

Copies `*.prompt.md` and `*.agent.md` from `copilot/skills/*/assets/` and `prompts/` → `%APPDATA%\Code\User\prompts\`. When I say "sync prompts," just run it.

### Session startup

```bash
git branch --show-current && git status --porcelain
# If clean on main: git fetch upstream main && git pull upstream main && git push origin main
# If on feature branch with changes: git stash first
```

### Branch naming

`mbender-ms/<service>-<brief-description>-<work-item-id>`

### GitHub CLI shortcuts

```bash
gh pr create --fill              # Quick PR with auto-generated title/body
gh pr view --web                 # Open current PR in browser
gh pr list                       # List open PRs
gh auth status                   # Check gh authentication
gh pr merge --squash --delete-branch  # Merge + cleanup
```

---

## Conventions

### Commits

- Format: `docs: <imperative verb> <what changed>`
- One commit per file — never batch multiple files
- No AB# references in commits

### PR descriptions

Load [references/pr-framework.md](references/pr-framework.md) when drafting PRs. Key rules: `AB#<id>` in body only (never title/commits), always include Article Intent + Files sections, no filler.

### Work items

- Title format: `{Service} | {WorkflowType} | {Brief Description}`
- Tags: service tag, area tag (`Networking`), workflow type, `cda`
- For full standards, delegate to the `ado-work-items` skill

---

## Agent Rules

1. **Delegate first** — Check [Task Routing](#task-routing--delegate-before-doing) before doing work inline
2. **Never commit to main** — always create a feature branch
3. **One commit per file** — never batch multiple files in a single commit
4. **Ask before pushing** — get approval before `git push`
5. **Use MCP tools** for work items, git context, PR descriptions, and completion calculations
6. **Sentence casing** for all headings in documentation articles
7. **Lazy-load references** — don't read `pr-framework.md`, `repos.md`, or source YAMLs unless the task needs them
8. **Efficiency over verbosity** — use direct commands and tools, don't over-explain. But never sacrifice research depth or clarity for brevity. When in doubt, ask rather than assume.

