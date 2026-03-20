# Azure Quickstart Templates

A VS Code Copilot skill for reviewing, validating, and creating templates for the [Azure/azure-quickstart-templates](https://github.com/Azure/azure-quickstart-templates) repository.

Covers file structure, naming rules, Bicep/JSON authoring, metadata.json, README generation, parameter best practices, and CI validation compliance.

---

## Prerequisites

| Requirement | How to verify |
|-------------|---------------|
| **VS Code** (1.100+) | `code --version` |
| **GitHub Copilot** (agent mode) | Copilot Chat → mode dropdown → "Agent" available |
| **Bicep CLI** (optional) | `bicep --version` — for template validation |

---

## Installation

Copy the `azure-quickstart-templates/` folder to your Copilot skills directory:

```powershell
Copy-Item -Recurse .\azure-quickstart-templates\ "$env:USERPROFILE\.copilot\skills\azure-quickstart-templates"
```

Restart VS Code.

### Folder structure

```
azure-quickstart-templates/
├── SKILL.md
└── README.md
```

---

## Usage

Open **GitHub Copilot Chat** in agent mode.

### Trigger examples

| You say... | What happens |
|-----------|-------------|
| "Review this quickstart template for compliance" | Full contribution-guide review with checklist |
| "Create a new quickstart for Azure Storage with Bicep" | Scaffolds complete template folder with all required files |
| "Validate this template's metadata.json" | Checks metadata against required fields and allowed values |
| "Convert this ARM template to Bicep" | Converts JSON to Bicep following naming conventions |

---

## What it covers

- **Folder structure**: Required files, naming rules, directory placement
- **Bicep/JSON authoring**: Parameter conventions, resource naming, API versions
- **metadata.json**: Required fields, allowed `type` and `dateUpdated` values
- **README.md**: Generation from template with deployment buttons
- **Parameters**: Naming standards, allowed values, descriptions, defaults
- **CI validation**: 14-point review checklist matching the repo's CI checks

---

## Related

- [Azure Quickstart Templates contribution guide](https://github.com/Azure/azure-quickstart-templates/blob/master/1-CONTRIBUTION-GUIDE/README.md)
- [Bicep documentation](https://learn.microsoft.com/azure/azure-resource-manager/bicep/)
