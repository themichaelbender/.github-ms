---
mode: agent
description: Generate a PR title and description following Azure Core Content standards — structured summary, change list, impact, and testing checklist
tools:
  - read/readFile
  - read/problems
  - search/codebase
  - search/fileSearch
  - search/textSearch
  - edit/editFiles
  - execute/runInTerminal
  - execute/getTerminalOutput
  - todo
---

# PR Description Template — Azure Core Content

Generate a pull request title and description that follows Azure Core Content standards, using the same structure as [PR #312366](https://github.com/MicrosoftDocs/azure-docs-pr/pull/312366).

## PR Title Format

The PR title **must** follow the ADO work item title convention:

```
<Service Name> | <Type of update> | Short description of work
```

**Types of updates:**

| Type | Use when |
|------|----------|
| **Maintenance** | Ongoing content upkeep, bug fixes, link repairs, metadata updates |
| **Freshness** | Scheduled freshness reviews to bring articles up to date |
| **CAMP** | Content Architecture and Modernization Program work (curation, consolidation, restructuring) |

**Examples:**
- `Load Balancer | Maintenance | Freshness review of egress-only load balancer article for NAT GW v2`
- `Application Gateway | Freshness | Review top 5 articles for February`
- `Virtual Network Manager | CAMP | Consolidate topology articles`

## PR Description Structure

Use the following template for the PR body. Every section is required.

### Template

```markdown
## Summary
<One paragraph describing the scope of the review or change. Be specific — list the types of edits made (ms.date updates, language modernization, link fixes, new notes, formatting, etc.)>

## Changes

### Documentation updates
- **<Article short name>** - <Brief description of what was updated>
- **<Include/shared file short name>** - <Brief description of what was updated>

### Files modified (<N> files)
- `<full relative path to file 1>`
- `<full relative path to file 2>`

## Impact

This documentation update supports customers:
- <Specific customer benefit 1>
- <Specific customer benefit 2>

## Testing

- [ ] Content reviewed for technical accuracy
- [ ] Links and cross-references verified
- [ ] Build validated
- [ ] Microsoft Writing Style Guide compliance checked

## Related work items
[AB#<work_item_id>](<full ADO URL>)
```

## How to Generate

1. **Identify changed files**: Run `git diff --name-only` or `git diff --stat` to list modified files.
2. **Analyze the diff**: Run `git diff` to understand the nature of every change.
3. **Categorize changes**: Group edits into these categories:
   - **Metadata**: ms.date, ms.service, ms.author updates
   - **Language modernization**: Removing future tense contractions ("you'll" → "you"), passive voice fixes, clarity improvements
   - **Technical updates**: New SKU details, feature additions, deprecation notices, retirement dates
   - **Link fixes**: Corrected cross-reference paths, updated external URLs
   - **Consistency**: Resource group names, VNet casing, naming alignment across articles
   - **Formatting**: Table separator normalization, trailing whitespace, punctuation
   - **Alt-text**: Improved image alt-text descriptions
4. **Build the title**: Use the ADO format — `<Service Name> | <Type> | Short description`.
5. **Write the summary**: One paragraph listing all categories of changes with specific examples.
6. **List documentation updates**: One bullet per file with a short name and description.
7. **State the impact**: Frame as customer benefits, not internal task completion.
8. **Include the testing checklist**: Always include all four items.
9. **Link work items**: Use `[AB#ID](full URL)` format — never bare `#ID` (ADO interprets that as a work item reference).

## Example (from PR #312366)

**Title:**
```
Load Balancer | Maintenance | Freshness review of egress-only load balancer article for NAT GW v2
```

**Body:**
```markdown
## Summary
Freshness review and update of documentation

Freshness review of the egress-only load balancer article. Changes include: updated ms.date, modernized language (removed future tense contractions like "you'll"), added NAT Gateway StandardV2 SKU details, fixed cross-reference paths from ../virtual-network/nat-gateway/ to ../nat-gateway/, updated resource group name from lb-resource-group to load-balancer-rg for consistency, updated VNet name casing from lb-VNet to lb-vnet, added important note about default outbound access retirement (March 31, 2026), improved image alt-text, replaced whatsmyip.org with ifconfig.me, and various editorial improvements. Also updated ms.date in the shared include file load-balancer-create-no-gateway.md.

Additional formatting fixes in the include file: normalized table separators, removed trailing whitespace, and fixed comma placement in instructional text.

## Changes

### Documentation updates
- **Egress Only** - Updated content and metadata
- **Load Balancer Create No Gateway** - Updated content, metadata, and formatting

### Files modified (2 files)
- `articles/load-balancer/egress-only.md`
- `includes/load-balancer-create-no-gateway.md`

## Impact

This documentation update supports customers:
- Access to current and accurate documentation
- Up-to-date guidance reflecting latest product capabilities

## Testing

- [ ] Content reviewed for technical accuracy
- [ ] Links and cross-references verified
- [ ] Build validated
- [ ] Microsoft Writing Style Guide compliance checked

## Related work items
[AB#554195](https://dev.azure.com/msft-skilling/cebd7ef5-4282-448b-9701-88c8637581b7/_workitems/edit/554195)
```

## Quality Checklist

Before submitting, confirm:
- [ ] Title follows `<Service Name> | <Type> | Short description` format
- [ ] Summary paragraph is specific — lists actual change types with examples
- [ ] Every modified file is listed under **Files modified**
- [ ] Each file has a corresponding entry under **Documentation updates**
- [ ] Impact section frames changes as customer benefits
- [ ] All four testing checkboxes are present
- [ ] Work item linked with `[AB#ID](URL)` format (not bare `#ID`)
- [ ] No `AB#` in the PR title — only in the body
