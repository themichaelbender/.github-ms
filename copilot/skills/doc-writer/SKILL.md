---
name: doc-writer
description: "Scaffold and write production-ready Azure documentation articles (how-to, concept, quickstart, tutorial, overview). Generates frontmatter, article structure, and content following Microsoft Learn writing standards."
argument-hint: "Describe the article type and topic, e.g. 'how-to article for configuring Azure Load Balancer health probes'"
user-invocable: true
---

# Doc-Writer — Azure Article Authoring Skill

Write production-ready how-to, concept, quickstart, tutorial, or overview articles for any Azure service on Microsoft Learn.

## When to Use

- Writing a **new** Azure documentation article from scratch
- Scaffolding article structure before filling in content
- Converting rough notes or outlines into properly formatted Learn articles
- Ensuring correct frontmatter, heading structure, and formatting conventions

## Workflow

### Step 1 — Determine the Article Type

Ask the user or infer from context:

| Type | Purpose | Title Pattern | `ms.topic` |
|---|---|---|---|
| **How-to** | Task-oriented steps for a specific goal | `verb + noun` (no "How to" prefix) | `how-to` |
| **Concept** | Non-procedural explanation of a feature or technology | `noun phrase + concepts` or `noun overview` | `concept-article` |
| **Quickstart** | Fast, single-task onboarding for first-time users | `Quickstart: verb + noun` | `quickstart` |
| **Tutorial** | Multi-step progressive learning experience | `Tutorial: verb + noun` | `tutorial` |
| **Overview** | Product-level introduction (GMPs only) | `What is <product>?` or `<product> overview` | `overview` |

### Step 2 — Generate Frontmatter

Use the template from [references/article-templates.md](references/article-templates.md) and fill in all required fields.

For complete title, description, H1, customer-intent, and ms.topic rules, see [_shared/seo-and-metadata.md](../_shared/seo-and-metadata.md).

### Step 3 — Scaffold the Article Structure

Apply the correct structure for the article type. See [references/article-templates.md](references/article-templates.md) for complete templates.

**How-to structure:**
1. H1 title
2. Intro paragraph — "In this article, you learn how to..."
3. `## Prerequisites` — ordered: previous articles → runtimes → packages → tools → sample code → hardware → credentials
4. Main task sections (H2 per major step)
5. `## Clean up resources` (if resources were created)
6. `## Related content` — 3–4 bullet links

**Concept structure:**
1. H1 title
2. Intro — "X is a Y that does Z" pattern
3. H2s for key aspects, features, characteristics
4. No numbered steps (non-procedural)
5. `## Related content`

**Quickstart structure:**
1. H1 title
2. Intro — brief context + what the user accomplishes
3. `## Prerequisites`
4. Single focused task sections
5. `## Clean up resources`
6. `## Next steps`

**Tutorial structure:**
1. H1 title with "Tutorial:" prefix
2. Intro — what the user builds/learns, progressive outline
3. `## Prerequisites`
4. Progressive H2 sections (each builds on previous)
5. `## Clean up resources`
6. `## Next steps`

### Step 4 — Write Content

Apply the Microsoft writing style from [_shared/writing-style.md](../_shared/writing-style.md). Key reminders:

- Sentence-style capitalization for all H2+ headings (CRITICAL)
- Max 7 numbered steps per section, imperative verbs
- "select" not "click", "enter" not "type"
- Use contractions, Oxford comma, active voice

### Step 5 — Apply Formatting Standards

See [_shared/formatting-rules.md](../_shared/formatting-rules.md) for complete formatting and auto-fix rules (code fences, alerts, tables, links, images, UI formatting).

### Step 6 — Validate

Before presenting the article, verify:
- [ ] All frontmatter fields present and valid
- [ ] Title: 30–65 chars, title case, primary keyword included
- [ ] Description: 120–165 chars, active voice, CTA included
- [ ] Customer intent comment present
- [ ] Correct heading hierarchy (H1 → H2 → H3, no skips)
- [ ] Sentence-style capitalization on H2+ headings
- [ ] Prerequisites section present (if applicable)
- [ ] Related content or Next steps section at the end
- [ ] No placeholders or TODO markers remain
- [ ] Sensitive identifiers use approved fake values (see `documentor-workflow/references/sensitive-identifiers.md`)

### Step 7 — Publishing Guidance

After the article is written:
1. Save to `articles/<service-name>/<filename>.md`
2. Update `TOC.yml` in the service folder — add entry under the correct section
3. Update `overview.md` or `index.yml` if the article covers a new capability
4. Verify all frontmatter fields are present

## File Naming Conventions

| Type | Pattern | Example |
|---|---|---|
| How-to | `[action]-[resource].md` | `create-storage-account.md` |
| Quickstart | `deploy-[resource]-[method].md` | `deploy-vm-portal.md` |
| Tutorial | `[action]-[resource].md` | `backup-virtual-machine.md` |
| Concept | `[topic]-concepts.md` | `networking-concepts.md` |
| Overview | `overview.md` or `[topic]-overview.md` | `overview.md` |
