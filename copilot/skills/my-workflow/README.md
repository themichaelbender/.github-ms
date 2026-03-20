# My Workflow Skill

Personal default instructions for GitHub Copilot agents. Provides agents with baseline context about my role, services, repos, commands, and conventions.

## What it does

When you invoke this skill (or reference it as `#my-workflow`), agents automatically know:

- **Who I am** — GitHub identity, MS alias, role, ADO project
- **What services I own** — Load Balancer, NAT Gateway, Virtual Network, Networking cross-service
- **What repos I work in** — azure-docs-pr, SupportArticles-docs-pr, etc.
- **How I format PRs** — Article intent + Description of work + Files + AB# linking
- **Quick commands** — "Sync prompts" runs the sync script without extra explanation
- **Conventions** — Commit message format, branch naming, work item titles, tags

## Usage

In GitHub Copilot Chat:

```
#my-workflow what services do I own?
#my-workflow draft a PR description for this Load Balancer update
#my-workflow sync prompts
```

Or as context for other skills:

```
#my-workflow #doc-writer write a how-to for Azure Load Balancer health probes
```

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill definition — identity, services, repos, commands, conventions |
| `references/repos.md` | Curated Microsoft Learn repo list with clone URLs |
| `references/pr-framework.md` | PR description framework with templates and examples |

### Cross-skill dependencies

| Dependency | Purpose |
|-----------|---------|
| `sources/` | Full repository catalog (3,000+ repos) — linked from repos table and PR workflows |
| `_shared/` | No direct dependency (my-workflow provides personal context, not editorial rules) |

## Extending this skill

Add new sections to `SKILL.md` as your workflow evolves:

- New services → Update the services table
- New repos → Update the repos table  
- New commands → Add to Quick Commands section
- New conventions → Add to Conventions section
