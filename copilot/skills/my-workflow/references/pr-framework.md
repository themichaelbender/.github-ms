# PR Description Framework — Extended Reference

Detailed examples and templates for GitHub Pull Request descriptions in Microsoft Learn documentation repos.

## Template

```markdown
## Article intent

<One paragraph explaining WHO the article helps, WHAT it covers, and WHY it matters.
Focus on the reader's goal, not the author's task.>

## Description of work

<Brief paragraph summarizing the type of work and scope.>

<Detailed bullets covering:>
- **Topic 1** — What was done and why
- **Topic 2** — What was done and why

### Files
- `articles/<service>/<filename>.md` — <annotation>
- `articles/<service>/media/<folder>/<image>.png` — <annotation>

AB#<work-item-id>
```

---

## Rules summary

1. `AB#<id>` in PR body only — never in title or commits
2. PR title — plain language, no AB# prefix
3. Article intent — always present, reader-perspective
4. Files section — every changed file with path and brief annotation
5. No filler — describe the content value, not the process

---

## Examples by workflow type

### New article

```markdown
## Article intent

This article helps network engineers and architects at small and midsize organizations
build a secure-by-default Azure network foundation using a minimal hub-spoke topology.
It explains what each network security component does, how the components fit together
in a layered architecture, and why each design decision matters — without providing
detailed step-by-step deployment instructions, which are available elsewhere.

## Description of work

New concept article covering a layered hub-spoke network security pattern for regional
web applications in Azure. The article addresses:

- **Hub-spoke topology** — Hub VNet with shared services (Bastion, optional Firewall),
  spoke VNet with Application Gateway WAF and workload compute
- **Layered deployment order** — 10-step deployment sequence with dependency reasoning
- **VNet and subnet planning** — CIDR guidance, required subnet names and sizes
- **NSG segmentation** — Default-deny rules on every subnet, service-specific ports
- **DDoS Protection decision framework** — Network Protection vs IP Protection tier guidance
- **Application Gateway with WAF** — WAF policy migration, Detection vs Prevention mode
- **Azure Bastion** — PaaS vs IaaS decision, hub placement for multi-spoke reuse
- **Azure Firewall (optional)** — Basic SKU for SMBs, UDR routing, management subnet
- **Common mistakes and troubleshooting** — Anti-patterns table and fix guidance

### Files
- `articles/networking/cross-service-scenarios/secure-web-app-network-foundation.md` — New article
- `articles/networking/cross-service-scenarios/media/secure-network/image1.jpg` — Architecture diagram
- `articles/networking/cross-service-scenarios/media/secure-network/image2.png` — Supporting diagram

AB#538668
```

### Freshness review / content maintenance

```markdown
## Article intent

This update ensures the Azure Load Balancer health probe documentation reflects current
best practices, accurate portal screenshots, and correct CLI/PowerShell commands for
customers configuring custom health probes.

## Description of work

Freshness review of the health probe configuration article:

- **Updated screenshots** — New Azure portal UI as of March 2026
- **Fixed CLI commands** — Corrected `--probe-protocol` parameter values
- **Added TCP health probe guidance** — New section on TCP probe intervals per SKU
- **Removed deprecated references** — Removed Basic SKU probe limitations (Basic retired)

### Files
- `articles/load-balancer/load-balancer-custom-probe-overview.md` — Updated
- `articles/load-balancer/media/health-probes/portal-config.png` — Updated screenshot

AB#554321
```

### Bug fix / quick edit

```markdown
## Article intent

Fixes incorrect subnet size recommendation in the NAT Gateway documentation that could
cause customers to under-provision their NAT gateway subnet.

## Description of work

- **Fixed subnet CIDR recommendation** — Changed /28 to /27 per current guidance
- **Updated cross-reference** — Pointed to correct VNet planning article

### Files
- `articles/nat-gateway/nat-gateway-resource.md` — Updated

AB#555123
```

---

## PR title patterns

| Workflow | Example title |
|----------|---------------|
| New article | `Add secure network foundation for regional web applications` |
| Freshness review | `Update Load Balancer health probe documentation` |
| Bug fix | `Fix NAT Gateway subnet size recommendation` |
| Restructure | `Reorganize VPN Gateway troubleshooting articles` |
| Content gap | `Add application rule collection examples for Azure Firewall` |

---

## Anti-patterns to avoid

| Bad | Why | Good |
|-----|-----|------|
| `AB#538668 - Update networking docs` | AB# in title; vague | `Add secure network foundation for regional web applications` |
| `Updated the networking docs with a new article` | Author perspective | `This article helps network engineers build a secure-by-default Azure network...` |
| No files section | Reviewers can't scan scope | Always list files with annotations |
| `Fixed stuff` | No content value description | `Fix incorrect health probe interval for Standard SKU` |
