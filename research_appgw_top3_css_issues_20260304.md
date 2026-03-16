# Research: Azure Application Gateway — Top 3 CSS Issues

**Date**: 2026-03-04
**Researcher**: Microsoft Researcher (Copilot)
**Scope**: Public + Internal verification
**Topics**: 502/503 errors, SSL/TLS certificate issues, WAF false positives

---

## Summary

These three issue categories are the most common CSS support drivers for Azure Application Gateway, confirmed by the breadth of dedicated troubleshooting documentation on Microsoft Learn. All three share a common theme: **complex, multi-step configurations with interdependent settings** that lack real-time validation feedback, leading to misconfigurations that are difficult to diagnose. The existing documentation surface area is extensive but has identifiable gaps in end-to-end walkthroughs, common-scenario quick fixes, and proactive validation guidance.

---

## Issue 1: Frequent 5xx Errors (502/503) Due to Backend or Health Probe Misconfiguration

### Root Causes (Verified)

There are **6+ distinct root causes** for 502 errors documented by Microsoft, all confirmed via Tier 1 sources:

1. **NSG, UDR, or Custom DNS blocking backend access** — NSGs on the Application Gateway subnet or backend subnet block probe traffic. UDRs direct traffic away from backends. Custom DNS servers in the VNet fail to resolve backend FQDNs. — [Troubleshooting bad gateway errors](https://learn.microsoft.com/troubleshoot/azure/application-gateway/application-gateway-troubleshooting-502) `[Tier 1]`

2. **Default health probe failures** — The default probe sends requests to `http://127.0.0.1/` with a 30-second interval, 30-second timeout, and unhealthy threshold of 3. This fails when backends require specific Host headers, don't listen on port 80, or return non-2xx status codes. — [Troubleshooting bad gateway errors](https://learn.microsoft.com/troubleshoot/azure/application-gateway/application-gateway-troubleshooting-502#problems-with-default-health-probe) `[Tier 1]`

3. **Custom health probe misconfiguration** — Incorrect Host, Path, Protocol, or status code matching. The probe must return HTTP 200-399 by default. Backends requiring authentication return 401/403, causing false unhealthy marking. — [Backend health troubleshooting](https://learn.microsoft.com/troubleshoot/azure/application-gateway/application-gateway-backend-health-troubleshooting) `[Tier 1]`

4. **Empty or all-unhealthy backend pool** — If no healthy backends exist, Application Gateway returns 502. The `BackendAddressPool` provisioning state must be `Succeeded` and contain reachable targets. — [Troubleshooting bad gateway errors](https://learn.microsoft.com/troubleshoot/azure/application-gateway/application-gateway-troubleshooting-502#empty-backendaddresspool) `[Tier 1]`

5. **Request timeout** — Default is **20 seconds** (v1). If the backend doesn't respond in time: v1 returns 502, v2 retries a second backend member and returns 504 if both fail. Configurable via `BackendHttpSetting`. — [Troubleshooting bad gateway errors](https://learn.microsoft.com/troubleshoot/azure/application-gateway/application-gateway-troubleshooting-502#request-time-out) `[Tier 1]`

6. **Backend certificate CN mismatch (end-to-end TLS)** — When Backend HTTP Settings use HTTPS protocol, the TLS certificate on the backend server must match the hostname in the Host header. A mismatch causes TLS negotiation failure → 502. — [Troubleshooting bad gateway errors](https://learn.microsoft.com/troubleshoot/azure/application-gateway/application-gateway-troubleshooting-502#upstream-ssl-certificate-doesnt-match) `[Tier 1]`

### Key Technical Details

| Property | Default Health Probe | Custom Probe |
|---|---|---|
| Probe URL | `http://127.0.0.1/` | User-defined |
| Interval | 30 seconds | Configurable (min 30s recommended) |
| Timeout | 30 seconds | Configurable (must be ≤ Interval and ≤ Request timeout) |
| Unhealthy threshold | 3 | Configurable (0+) |
| Healthy status codes | 200–399 | Configurable |
| Port | From BackendHttpSetting | Configurable (v2 only) |

**NSG requirements**: v1 SKU requires ports **65503-65534** open; v2 uses the dedicated subnet range. The **GatewayManager** service tag must be allowed. — [Application Gateway infrastructure configuration](https://learn.microsoft.com/azure/application-gateway/configuration-infrastructure#network-security-groups) `[Tier 1]`

**MinServers warning (v2)**: Setting `MinServers > 0` overrides probe results, forcing Application Gateway to send traffic to unhealthy backends, potentially causing 502 errors. — [Health probe overview](https://learn.microsoft.com/azure/application-gateway/application-gateway-probe-overview#custom-health-probe) `[Tier 1]`

### Content Gaps Identified

- **No single decision-tree or flowchart** to quickly triage which of the 6+ root causes applies — customers must read multiple long pages
- **Default probe behavior is non-obvious**: `127.0.0.1` hostname is rarely documented in quickstarts but is the #1 cause of probe failures on newly deployed gateways
- **v1 vs v2 behavioral differences** for request timeout (502 vs 504) are buried deep — need prominent callout
- **NSG/UDR troubleshooting** requires switching between 3+ docs pages; a consolidated checklist would reduce support cases

---

## Issue 2: SSL/TLS Certificate Setup Issues (Handshake Failures, Unsupported TLS Versions)

### Root Causes (Verified)

1. **Certificate CN / SAN mismatch** — For end-to-end TLS, v2 SKU checks the CN of the backend certificate against the Backend Setting hostname or Custom Probe hostname (in that order). If using SNI, per RFC 6125, the SAN field takes precedence over CN. — [Backend health troubleshooting](https://learn.microsoft.com/troubleshoot/azure/application-gateway/application-gateway-backend-health-troubleshooting#error-messages) `[Tier 1]`

2. **Missing intermediate/root CA certificates** — The listener certificate requires the **entire certificate chain** (root CA + intermediates + leaf) to establish trust. Backend end-to-end TLS requires: v1 SKU = Authentication Certificates (public key of backend cert), v2 SKU = Trusted Root Certificates. — [TLS overview](https://learn.microsoft.com/azure/application-gateway/ssl-overview) `[Tier 1]`

3. **TLS 1.0/1.1 retirement (August 31, 2025)** — All clients and backend servers must use TLS 1.2+. Predefined policies `AppGwSslPolicy20150501` and `AppGwSslPolicy20170401` will be discontinued. Gateways that don't update will enter a **Failed state** on configuration updates. Post-retirement, v2 backend connections use TLS 1.2-1.3; v1 uses TLS 1.2 only. — [TLS 1.0/1.1 retirement](https://learn.microsoft.com/azure/application-gateway/application-gateway-tls-version-retirement) `[Tier 1]`

4. **Key Vault integration issues** — When certificates are sourced from Key Vault, access failures cause Application Gateway to automatically **disable the listener**. Azure Advisor surfaces "Resolve Azure Key Vault issue for your Application Gateway" recommendations. Polling occurs every 4 hours. — [TLS termination with Key Vault certificates](https://learn.microsoft.com/azure/application-gateway/key-vault-certs) `[Tier 1]`

5. **v1 vs v2 SNI behavioral differences** — v1: fallback certificate from basic listener when no SNI header. v2: **no basic listener fallback** — returns certificate from the HTTPS listener with highest-priority routing rule. This frequently catches customers upgrading from v1 to v2. — [TLS overview — SNI differences](https://learn.microsoft.com/azure/application-gateway/ssl-overview) `[Tier 1]`

6. **Mutual TLS (mTLS) failures** — Client certificate validation failures (`SslClientVerify: NONE` or `FAILED`) when the trusted client CA chain is incomplete on the Application Gateway or client certificates aren't properly presented. — [Mutual authentication troubleshooting](https://learn.microsoft.com/troubleshoot/azure/application-gateway/mutual-authentication-troubleshooting) `[Tier 1]`

### Key Technical Details

| TLS Policy | Min TLS Version | SKU | Status |
|---|---|---|---|
| `AppGwSslPolicy20150501` | TLS 1.0 | v1/v2 | **Retired Aug 2025** |
| `AppGwSslPolicy20170401` | TLS 1.0 | v1/v2 | **Retired Aug 2025** |
| `AppGwSslPolicy20170401S` | TLS 1.2 | v1/v2 | Supported |
| `AppGwSslPolicy20220101` | TLS 1.2 | v2 only | **Recommended** |
| `AppGwSslPolicy20220101S` | TLS 1.2 | v2 only | Recommended |

**Default policy behavior**: API version ≥ 2023-02-01 defaults to `AppGwSslPolicy20220101`; older API versions default to `AppGwSslPolicy20150501`. — [TLS policy overview](https://learn.microsoft.com/azure/application-gateway/application-gateway-ssl-policy-overview) `[Tier 1]`

**Client TLS Protocol metric**: Use the `Client TLS protocol` metric with "Apply splitting" → "TLS protocol" to identify clients still using TLS 1.0/1.1. v1 SKU metrics do **not** provide this data. — [TLS retirement — identification methods](https://learn.microsoft.com/azure/application-gateway/application-gateway-tls-version-retirement#identification-methods) `[Tier 1]`

### Content Gaps Identified

- **No unified end-to-end TLS setup checklist** combining listener cert, backend auth cert/trusted root cert, and Key Vault integration — customers bounce between 4+ articles
- **v1→v2 migration TLS pitfalls** (especially SNI fallback behavior change) not prominently documented in migration guides
- **TLS retirement impact assessment**: No step-by-step guide for customers to audit their entire Application Gateway estate and determine readiness
- **Certificate chain troubleshooting**: OpenSSL verification commands are mentioned but not provided as a copy-paste diagnostic script
- **Key Vault listener-disable behavior**: The automatic disabling of listeners is surprising to customers and not well-surfaced in quickstarts

---

## Issue 3: WAF Policy False Positives Blocking Legitimate Traffic

### Root Causes (Verified)

1. **OWASP CRS rules are strict by default** — "It's entirely normal, and expected in many cases, to create exclusions, custom rules, and even disable rules that may be causing issues or false positives." The CRS is designed to be tuned per-application. — [WAF troubleshooting](https://learn.microsoft.com/azure/web-application-firewall/ag/web-application-firewall-troubleshoot) `[Tier 1]`

2. **Anomaly scoring accumulation** — WAF uses anomaly scoring by default (CRS 3.2+). Scores: Critical=5, Error=4, Warning=3, Notice=2. Threshold is **5** to block. A single Warning (3) won't block, but two Warnings (6) will. Customers often don't realize multiple low-severity matches compound. — [WAF overview — anomaly scoring](https://learn.microsoft.com/azure/web-application-firewall/ag/ag-overview#waf-policy-and-rules) `[Tier 1]`

3. **Microsoft Entra ID tokens triggering SQL injection rules** — `__RequestVerificationToken` passed as a cookie (or request attribute when cookies are disabled) often triggers false positives. Must be added to exclusion list as both **Request cookie name** and **Request attribute name**. — [WAF troubleshooting](https://learn.microsoft.com/azure/web-application-firewall/ag/web-application-firewall-troubleshoot#fix-false-positives) `[Tier 1]`

4. **SQL injection rules matching benign input** — Common patterns like `1=1` in query strings or form fields trigger rules like 942130 (Application Gateway) or 942110 (Front Door). These are legitimate in some applications but match SQL tautology patterns. — [WAF troubleshooting](https://learn.microsoft.com/azure/web-application-firewall/ag/web-application-firewall-troubleshoot#understand-waf-logs) `[Tier 1]`

5. **Ruleset version upgrade resets customizations** — "When assigning a new managed ruleset to a WAF policy, all the previous customizations from the existing managed rulesets such as rule state, rule actions, and rule level exclusions will be reset to the new managed ruleset's defaults." Custom rules and global exclusions survive. — [WAF troubleshooting](https://learn.microsoft.com/azure/web-application-firewall/ag/web-application-firewall-troubleshoot#restrict-global-parameters-to-eliminate-false-positives) `[Tier 1]`

### Resolution Approaches (Priority Order)

| Approach | Scope | Risk | Best For |
|---|---|---|---|
| **Exclusion lists** | Specific match variables per-rule, per-group, or global | Low — only excludes specific field from inspection | Known benign parameters (tokens, specific fields) |
| **Custom rules** (Allow) | Granular conditions (URI + body/header match) | Low — most targeted | Application-specific false positives |
| **Change rule action to Log** | Specific rules | Medium — disables blocking for that rule | Tuning/investigation phase |
| **Disable individual rules** | Global per WAF policy | Higher — removes protection entirely | Rules confirmed inapplicable to stack |
| **Per-site / per-URI policies** | Scoped to specific listeners or URL paths | Low — isolates changes | Multi-app environments behind one gateway |

**Best practices** (verified):

- Start in **Detection mode** to log without blocking, then switch to **Prevention mode** after tuning — [WAF best practices](https://learn.microsoft.com/azure/web-application-firewall/ag/best-practices) `[Tier 1]`
- Define WAF exclusions and config **as code** (CLI, PowerShell, Bicep, Terraform) to survive ruleset upgrades — [WAF best practices](https://learn.microsoft.com/azure/web-application-firewall/ag/best-practices#general-best-practices) `[Tier 1]`
- Use the **latest ruleset versions** and enable **bot management rules** — [WAF best practices](https://learn.microsoft.com/azure/web-application-firewall/ag/best-practices#managed-ruleset-best-practices) `[Tier 1]`
- **Document every WAF policy change** with example requests that triggered false positives — [WAF tuning](https://learn.microsoft.com/azure/web-application-firewall/afds/waf-front-door-tuning#resolve-false-positives) `[Tier 1]`

### WAF Log Analysis

Key fields in `ApplicationGatewayFirewallLog` for diagnosing false positives:

- `transactionId` — correlates all rule matches for a single request
- `ruleId` — the specific CRS rule that matched (e.g., `942130`)
- `action` — `Matched` (score incremented), `Blocked` (threshold exceeded), `Detected` (detection mode)
- `details.data` — the matched data and match variable (e.g., `ARGS:text1`)
- `details.message` — the pattern that matched

### Content Gaps Identified

- **No "WAF Day 1 tuning guide"** for new deployments — customers deploy in Prevention mode without tuning and immediately block legitimate traffic
- **Anomaly score accumulation is poorly understood** — need a visual/diagram showing how multiple low-severity matches compound to a block
- **Ruleset upgrade reset warning** is buried in a tooltip — should be a prominent callout in the upgrade docs
- **No common false positive patterns catalog** — a table of "Top 10 false positive triggers and their recommended exclusions" (e.g., Entra ID tokens, API management headers, JSON payloads) would dramatically reduce CSS tickets
- **Per-site/per-URI policy** documentation exists but isn't linked from the main troubleshooting page
- **HAR file collection guidance** is in WAF troubleshooting but not mentioned in the "contact support" workflow

---

## Important Caveats

- **TLS 1.0/1.1 retirement deadline: August 31, 2025** — Gateways with deprecated policies enter Failed state on config updates. This is already past for the current date (March 2026); customers still on old policies would be impacted. — [TLS retirement](https://learn.microsoft.com/azure/application-gateway/application-gateway-tls-version-retirement) `[Tier 1]`
- **Application Gateway v1 SKU retirement**: v1 SKU is approaching end-of-life. Newer TLS policies (`20220101`, `20220101S`, `CustomV2`) are **v2 only**. — [TLS policy overview](https://learn.microsoft.com/azure/application-gateway/application-gateway-ssl-policy-overview) `[Tier 1]`
- **WAF CRS 3.2+ required for new WAF engine** — Older CRS versions run on legacy engine without newer features. — [WAF overview](https://learn.microsoft.com/azure/web-application-firewall/ag/ag-overview#waf-engine) `[Tier 1]`

---

## Content Recommendations Summary

| Gap | Recommended Action | Impact on CSS |
|---|---|---|
| No 502/503 decision-tree flowchart | Create visual triage guide covering all 6+ root causes | High — fastest path to self-service resolution |
| Default probe `127.0.0.1` behavior not in quickstarts | Add callout to deployment quickstarts | High — prevents most common post-deployment issue |
| No unified end-to-end TLS setup checklist | New article: "End-to-end TLS checklist for Application Gateway" | High — consolidates 4+ scattered articles |
| v1→v2 SNI fallback behavior change | Add migration-specific TLS section | Medium — catches upgrading customers |
| No TLS retirement estate audit guide | Create "Audit your Application Gateway TLS readiness" guide | High — proactive reduction of retirement-driven tickets |
| No "WAF Day 1 tuning" guide | New article covering Detection→Prevention workflow with common exclusions | High — prevents immediate false positive flood |
| No common false positive catalog | Table of top false positive triggers + recommended exclusions | High — directly resolves repeat CSS patterns |
| Anomaly score accumulation poorly explained | Add visual diagram to WAF overview | Medium — improves understanding |
| Ruleset upgrade reset buried in tooltip | Promote to prominent warning in upgrade docs | Medium — prevents accidental protection loss |
| Certificate chain diagnostic script | Provide copy-paste OpenSSL commands | Medium — accelerates self-service debugging |

---

## Sources

| # | Title | URL | Tier | Type | Accessed |
|---|-------|-----|------|------|----------|
| 1 | Troubleshooting bad gateway errors in Application Gateway | https://learn.microsoft.com/troubleshoot/azure/application-gateway/application-gateway-troubleshooting-502 | Tier 1 | Docs | 2026-03-04 |
| 2 | Troubleshoot backend health issues in Application Gateway | https://learn.microsoft.com/troubleshoot/azure/application-gateway/application-gateway-backend-health-troubleshooting | Tier 1 | Docs | 2026-03-04 |
| 3 | Overview of TLS termination and end-to-end TLS with Application Gateway | https://learn.microsoft.com/azure/application-gateway/ssl-overview | Tier 1 | Docs | 2026-03-04 |
| 4 | Application Gateway TLS policy overview | https://learn.microsoft.com/azure/application-gateway/application-gateway-ssl-policy-overview | Tier 1 | Docs | 2026-03-04 |
| 5 | Managing your Application Gateway with TLS 1.0 and 1.1 retirement | https://learn.microsoft.com/azure/application-gateway/application-gateway-tls-version-retirement | Tier 1 | Docs | 2026-03-04 |
| 6 | TLS termination with Key Vault certificates | https://learn.microsoft.com/azure/application-gateway/key-vault-certs | Tier 1 | Docs | 2026-03-04 |
| 7 | Troubleshooting mutual authentication errors | https://learn.microsoft.com/troubleshoot/azure/application-gateway/mutual-authentication-troubleshooting | Tier 1 | Docs | 2026-03-04 |
| 8 | Application Gateway health probes overview | https://learn.microsoft.com/azure/application-gateway/application-gateway-probe-overview | Tier 1 | Docs | 2026-03-04 |
| 9 | Application Gateway infrastructure configuration | https://learn.microsoft.com/azure/application-gateway/configuration-infrastructure | Tier 1 | Docs | 2026-03-04 |
| 10 | Troubleshoot WAF for Azure Application Gateway | https://learn.microsoft.com/azure/web-application-firewall/ag/web-application-firewall-troubleshoot | Tier 1 | Docs | 2026-03-04 |
| 11 | WAF on Application Gateway overview | https://learn.microsoft.com/azure/web-application-firewall/ag/ag-overview | Tier 1 | Docs | 2026-03-04 |
| 12 | Best practices for WAF on Application Gateway | https://learn.microsoft.com/azure/web-application-firewall/ag/best-practices | Tier 1 | Docs | 2026-03-04 |
| 13 | WAF exclusion lists | https://learn.microsoft.com/azure/web-application-firewall/ag/application-gateway-waf-configuration | Tier 1 | Docs | 2026-03-04 |
| 14 | Customize WAF rules using the Azure portal | https://learn.microsoft.com/azure/web-application-firewall/ag/application-gateway-customize-waf-rules-portal | Tier 1 | Docs | 2026-03-04 |
| 15 | Tune WAF for Azure Front Door | https://learn.microsoft.com/azure/web-application-firewall/afds/waf-front-door-tuning | Tier 1 | Docs | 2026-03-04 |
| 16 | WAF CRS rule groups and rules | https://learn.microsoft.com/azure/web-application-firewall/ag/application-gateway-crs-rulegroups-rules | Tier 1 | Docs | 2026-03-04 |
| 17 | WAF policy overview | https://learn.microsoft.com/azure/web-application-firewall/ag/policy-overview | Tier 1 | Docs | 2026-03-04 |
| 18 | Create custom probe for Application Gateway | https://learn.microsoft.com/azure/application-gateway/application-gateway-create-probe-portal | Tier 1 | Docs | 2026-03-04 |
| 19 | Configure end-to-end TLS with Application Gateway | https://learn.microsoft.com/azure/application-gateway/end-to-end-ssl-portal | Tier 1 | Docs | 2026-03-04 |
| 20 | Azure Networking incident analysis (workspace) | workspace://Azure-Networking-incident-analysis.md | Workspace | Analysis | 2026-03-04 |
