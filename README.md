# .github

Personal GitHub profile repo containing Copilot skills for Azure documentation workflows.

## Skills

All skills live in `copilot/skills/` and are automatically available in VS Code via GitHub Copilot.

| Skill | Description | Size |
|-------|-------------|------|
| **ado-work-items** | Create and validate ADO work items per Azure Core Content Standards | 11 KB |
| **azure-quickstart-templates** | Review, validate, or create Azure Quickstart Templates | 19 KB |
| **doc-verifier** | Verify technical accuracy of Microsoft documentation (fact-check, freshness, research) | 100 KB |
| **doc-writer** | Scaffold and write Azure documentation articles (how-to, concept, quickstart, tutorial, overview) | 23 KB |
| **documentor-workflow** | Editorial quality workflows — SEO, metadata, engagement, markdown auto-fix, link validation | 35 KB |

## Usage

Skills are invoked in VS Code Copilot Chat:

- Reference a skill with `#` prefix: `#doc-verifier`, `#doc-writer`, `#ado-work-items`
- Each skill's `SKILL.md` describes workflows and when-to-use guidance
- See individual skill `README.md` files for detailed usage examples

## Structure

```
copilot/skills/<skill-name>/
├── SKILL.md          # Skill definition (read by Copilot)
├── README.md         # Usage documentation
├── assets/           # Prompt files for specific workflows
└── references/       # On-demand reference material
```
