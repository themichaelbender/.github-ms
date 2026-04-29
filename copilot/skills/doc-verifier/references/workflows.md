# Doc-Verifier Workflows — Detailed Reference

Detailed procedures, outputs, and comparison for all ten doc-verifier workflows.

---

## Workflow 1: Quick In-Place Fact-Check

**Prompt**: `fact-check-and-edit.prompt.md` | **Mode**: Agent

### When to use
- Fast verification of a single article
- Corrections applied directly, no separate report file
- Article uses `[!INCLUDE ...]` references that should also be checked

### Key features
- Resolves and fact-checks `[!INCLUDE ...]` files; edits include files directly if they contain errors
- Uses 4-tier PUBLIC source hierarchy
- All source references presented in chat, not written to the file

### Procedure
1. Read the file and resolve all INCLUDE references
2. Identify every verifiable technical claim
3. Verify each claim against tiered sources
4. Edit the file directly with corrections; update `ms.date`
5. Present all references and changes in chat

### Output
- Edited file with corrections applied
- Chat summary: what changed, why, source URL and tier

---

## Workflow 2: Single Article Check

**Prompt**: `single-article-check.prompt.md` | **Mode**: Agent

### When to use
- Full verification of a single article with product-area scoping
- Need product-area-specific search domains
- More thorough than Quick In-Place

### Key features
- Step 0 scoping: detects product area from `ms.service`/`ms.prod` metadata
- Uses product-area-specific search terms and paths
- Asks about depth preference (quick vs. thorough)

### Procedure
1. Scope: identify product area, service, depth
2. Identify all verifiable claims (including SKU/tier requirements)
3. Verify using product-area-specific search queries
4. Classify accuracy (5-level system)
5. Apply corrections; update `ms.date`
6. Present results with per-issue details and source URLs

### Output
- Edited file with corrections
- Chat summary with source citations

---

## Workflow 3: Full Standalone Report

**Prompt**: `complete-fact-check.prompt.md` | **Mode**: Agent

### When to use
- Formal audit requiring a saved report artifact
- Need to share findings with reviewers or stakeholders

### Procedure
1. Identify all verifiable claims
2. Verify against official sources (3-tier hierarchy)
3. Assess accuracy: Accurate / Partially Accurate / Inaccurate / Outdated
4. Make corrections in the file; update `ms.date`
5. Generate report: `factcheck_[articlename]_YYYYMMDD.md`
6. Present summary with option to commit

### Output
- Edited file with corrections
- Saved report file with executive summary, per-issue details, sources table

---

## Workflow 4: Internal + Public Sources

**Prompt**: `complete-fact-checker-internal.prompt.md` | **Mode**: Agent

### When to use
- Need to cross-reference internal Microsoft resources
- Verifying claims only confirmable via internal docs
- Separate public-safe corrections from internal-only findings

### Key features
- 6-tier hierarchy: Tiers 1–3 public + Tier 4 Internal Docs + Tier 5 Internal Code + Tier 6 Internal Metadata
- "Unverifiable (Public)" classification for internally-only-verifiable claims
- Report has two sections: Public Findings + ⛔ Internal Findings (Confidential)

### Procedure
1. Identify all verifiable claims
2. Verify against public sources (Tiers 1–3)
3. Verify against internal sources (Tiers 4–6)
4. Assess accuracy (including "Unverifiable (Public)")
5. Apply public corrections to file
6. Generate report with Public and Internal sections
7. Offer: commit public corrections, review internal suggestions, strip internal section

### Output
- Edited file (public corrections only)
- Report with clearly separated public and confidential sections

---

## Workflow 5: Freshness + Fact Review

**Prompt**: `complete-freshness-review.prompt.md` | **Mode**: Agent

### When to use
- Article may be stale — need both freshness and accuracy check
- Combined review saves time vs. running separately

### Freshness checks (in addition to fact-checking)
- `ms.date` staleness
- Deprecated or retired services/features
- Outdated version numbers
- Broken or redirected links
- Metadata completeness
- Style and formatting issues

### Procedure
1. Analyze freshness (dates, versions, deprecations, links, metadata, style)
2. Fact-check all technical claims
3. Edit file directly; update `ms.date`
4. Present per-edit summary: Line, What changed, Why, Type, Source
5. Offer: create branch, commit, push, open PR

### Output
- Edited file with freshness and accuracy fixes
- Chat summary with change details
- Optional: branch + PR workflow

---

## Workflow 6: Deep Agent-Driven Check

**Prompt**: `microsoft-fact-checker-slim.agent.md` | **Mode**: Agent (extensive tool usage)

### When to use
- Most thorough verification possible
- Article covers complex or critical technical content
- Need per-fact evidence documentation

### Key features
- Extensive tool calls for verification
- Per-fact output: WHAT CHANGED / WHY THIS MATTERS / EVIDENCE

### Procedure
1. Claim identification — extract all verifiable claims
2. Primary source verification — search and fetch Tier 1 sources
3. Cross-reference — validate against Tier 2 and 3 sources
4. Technical accuracy assessment — classify each claim
5. Recommendation output — per-fact structured findings

### Output
Per-fact blocks: `WHAT CHANGED`, `WHY THIS MATTERS`, `EVIDENCE` with source URLs

---

## Workflow 7: Batch Report

**Prompt**: `batch-report.prompt.md` | **Mode**: Agent

### When to use
- Verify multiple files (folder, glob, or file list)
- Need a consolidated report across files

### Procedure
1. Scope: product area, file scope, output preference, depth
2. Read and catalog files (group by service area from frontmatter)
3. Verify claims per service group (batch related searches)
4. Classify findings (6-level system including 🔗 Broken link)
5. Generate report: `factcheck_[scope]_YYYYMMDD.md`
6. Apply corrections if requested

### Output
- Report with: executive summary, critical findings, per-file tables, link audit, sources
- Optional: edited files with corrections

---

## Workflow 8: PR Review

**Prompt**: `pr-review.prompt.md` | **Mode**: Agent

### When to use
- Fact-check all changed files in a GitHub pull request
- Generate a verification report for PR reviewers

### Procedure
1. Scope: PR number, repository, product area, depth
2. Load PR: fetch metadata, list changed files, filter to `.md`/`.yml`
3. Catalog and group files by service area
4. Verify per service group
5. Classify findings
6. Generate report: `factcheck_PR{number}.md`

### Output
- Report with: PR metadata, per-file verification tables, link audit, sources
- Options: commit report to PR branch, post as PR comment, apply corrections

---

## Workflow 9: Research

**Prompt**: `microsoft-researcher.prompt.md` | **Mode**: Agent

### When to use
- Investigate a topic, not edit a file
- Need a research report with citations and source tiers
- Need to answer a technical question with evidence

### Key features
- 7-tier hierarchy (4 public + 3 internal)
- Output options: `output:chat`, `output:file`, `output:both`
- Does NOT edit existing files unless explicitly asked
- Claims classified: Verified / Partially Verified / Internally Verified / Unverifiable

### Procedure
1. Understand the research question (topic, scope, depth, audience, output)
2. Search broadly across public sources
3. Go deep — fetch full pages for key sources
4. Consult internal sources (if applicable)
5. Cross-reference and verify all claims
6. Validate code examples
7. Deliver output in requested format

### Output
- Research report: Summary, Details, Code Examples, Caveats, Sources table
- Optional: ⛔ Internal Findings section
- File: `research_[topic_slug]_YYYYMMDD.md`

---

## Workflow 10: Customer Incident Analysis (CIA)

**Prompt**: `CIA-Analysis.prompt.md` | **Mode**: Agent

### When to use
- Analyze customer incident patterns for a service area
- Identify documentation opportunities from support trends
- Building a case for content investment

### Report structure (11 sections)
1. Executive Summary
2. Incident Distribution by Service
3. Trends & Patterns
4. Top Issue Categories (6–8 ranked)
5. Service-Specific Pain Points
6. Documentation & Content Opportunities (Priority 1 & 2)
7. Trending Issues (30/60/90 days)
8. Recommendations (by quarter)
9. Success Metrics
10. Data Sources & Methodology
11. Conclusion & Action Items

### Output
- Markdown file: `{ServiceArea}-incident-analysis.md`
- Professional tone for internal Microsoft reporting

---

## Workflow comparison

| Feature | W1 Quick | W2 Single | W3 Report | W4 Internal | W5 Fresh | W6 Deep | W7 Batch | W8 PR | W9 Research | W10 CIA |
|---------|----------|-----------|-----------|-------------|----------|---------|----------|-------|-------------|---------|
| Edits file | ✅ | ✅ | ✅ | ✅ (public) | ✅ | ✅ | Optional | ❌ | ❌ | ❌ |
| Report file | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ | Optional | ✅ |
| Product scoping | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Internal sources | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Freshness check | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| INCLUDE resolution | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Multi-file | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Per-fact evidence | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | N/A |
