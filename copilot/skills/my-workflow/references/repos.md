# Microsoft Learn GitHub Repositories

Curated list of Microsoft Learn documentation repositories I actively contribute to. For the full catalog of 3,000+ repos across MicrosoftDocs, Azure, microsoft, and MicrosoftCopilot orgs, see `copilot/skills/sources/`.

**Sources catalog quick reference:**
- Per-org files: `sources/Azure.yml`, `sources/MicrosoftDocs.yml`, `sources/microsoft.yml`
- Per-category: `sources/azure-networking.yml` (73 repos), `sources/azure-compute.yml`, etc.
- Full index: `sources/categories-index.yml`

## Azure documentation

| Repo | URL | Access | Purpose |
|------|-----|--------|---------|
| `azure-docs-pr` | [MicrosoftDocs/azure-docs-pr](https://github.com/MicrosoftDocs/azure-docs-pr) | Private | Primary Azure documentation repo |
| `azure-docs` | [MicrosoftDocs/azure-docs](https://github.com/MicrosoftDocs/azure-docs) | Public | Public mirror of azure-docs-pr |
| `SupportArticles-docs-pr` | [MicrosoftDocs/SupportArticles-docs-pr](https://github.com/MicrosoftDocs/SupportArticles-docs-pr) | Private | Support/troubleshooting articles |

## Architecture & reference

| Repo | URL | Access | Purpose |
|------|-----|--------|---------|
| `architecture-center` | [MicrosoftDocs/architecture-center](https://github.com/MicrosoftDocs/architecture-center) | Public | Azure Architecture Center |
| `azure-quickstart-templates` | [Azure/azure-quickstart-templates](https://github.com/Azure/azure-quickstart-templates) | Public | ARM/Bicep quickstart templates |

## Learn platform

| Repo | URL | Access | Purpose |
|------|-----|--------|---------|
| `learn` | [MicrosoftDocs/learn](https://github.com/MicrosoftDocs/learn) | Private | Microsoft Learn training modules |

## Other repos

<!-- Add repos as you discover them -->

| Repo | URL | Access | Purpose |
|------|-----|--------|---------|
| <!-- repo name --> | <!-- URL --> | <!-- Public/Private --> | <!-- Purpose --> |

---

## Fork & clone conventions

For private Microsoft repos, use fork-based workflow:

```bash
# Clone your fork
git clone https://github.com/mbender-ms/<repo-name>.git
cd <repo-name>

# Add upstream
git remote add upstream https://github.com/MicrosoftDocs/<repo-name>.git

# Verify
git remote -v
```
