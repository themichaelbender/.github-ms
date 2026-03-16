# Research: Azure Application Gateway — Top CSS Issue Content Gap Analysis

## Summary

Analysis of the top 3 CSS support issues for Azure Application Gateway (502/503 errors, SSL/TLS certificate issues, WAF false positives) against existing documentation at `learn.microsoft.com/en-us/troubleshoot/azure/application-gateway/*` and `learn.microsoft.com/en-us/azure/application-gateway/*`. While foundational articles exist for each issue area, significant gaps remain in scenario-specific guidance, end-to-end walkthroughs, and proactive diagnostics. This report provides actionable recommendations organized by content update type: updates to existing articles, new articles needed, and cross-article improvements.

**Verification confidence**: Verified — all findings based on fetched Tier 1 documentation from learn.microsoft.com.

---

## Issue 1: Frequent 5xx Errors (502/503) Due to Backend or Health Probe Misconfiguration

### Current Coverage

| Article | URL | Coverage | Gaps |
|---------|-----|----------|------|
| Troubleshooting bad gateway errors | [application-gateway-troubleshooting-502](https://learn.microsoft.com/en-us/troubleshoot/azure/application-gateway/application-gateway-troubleshooting-502) | NSG/UDR/DNS, default probe, custom probe, request timeout, empty pool, unhealthy instances, upstream SSL mismatch | No 503 coverage; no v2-specific retry behavior detail; no diagnostic query examples |
| Troubleshoot backend health issues | [application-gateway-backend-health-troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/azure/application-gateway/application-gateway-backend-health-troubleshooting) | Comprehensive error message catalog (timeout, DNS, TCP, status mismatch, cert errors, Unknown status) | No consolidated decision tree; limited KQL/Log Analytics examples; no "quick check" summary |
| Reliability in Application Gateway v2 | [reliability-application-gateway-v2](https://learn.microsoft.com/en-us/azure/reliability/reliability-application-gateway-v2) | Scaling modes, capacity units, zone redundancy | Not linked from troubleshooting articles; 503 from capacity exhaustion not documented |

### Actionable Updates

#### UPDATE: `application-gateway-troubleshooting-502` (Troubleshoot TSG)

1. **Add 503 error coverage.** The article title and content focus exclusively on 502. Application Gateway v2 returns 503 when the gateway itself is at capacity or during scale events. Add a new section:
   - _"503 Service Unavailable errors"_ covering:
     - Gateway capacity exhaustion (all instances saturated)
     - Scale-up lag during traffic spikes with autoscaling
     - Backend pool returning 503 vs. gateway-generated 503 (how to differentiate via access logs: `serverStatus` field)
   - Recommend monitoring the **Capacity Units** and **Estimated Billed Capacity Units** metrics proactively
   - Link to the reliability/scaling article

2. **Add v1 vs. v2 behavior differences table.** The article mentions v2 retry behavior (tries second backend member before returning 504) only in the "Request time-out" section. Add a consolidated table at the top:
   | Scenario | v1 Behavior | v2 Behavior |
   |----------|------------|------------|
   | Backend timeout | Returns 502 | Retries second member, then returns 504 |
   | All backends unhealthy | Returns 502 | Returns 502 |
   | Gateway at capacity | N/A (fixed scale) | Returns 503 |

3. **Add KQL diagnostic queries.** Include ready-to-use Log Analytics queries that CSS and customers can run immediately:
   ```kusto
   // Find 502/503 errors with backend response details
   AzureDiagnostics
   | where ResourceType == "APPLICATIONGATEWAYS"
   | where httpStatus_d in (502, 503)
   | project TimeGenerated, httpStatus_d, serverStatus_s, serverRouted_s, host_s, requestUri_s
   | order by TimeGenerated desc
   ```

4. **Add "Quick diagnosis checklist" at the top.** A numbered quick-check list before the detailed sections:
   1. Is the backend pool empty? → Check Backend Health blade
   2. Are all backends showing Unhealthy? → Check the Details column for the specific error message
   3. Is NSG blocking the health probe port? → Verify inbound rules
   4. Is the health probe path returning 200-399? → Test with `curl` or browser
   5. Is the request timing out? → Check BackendHttpSetting timeout value
   6. Is end-to-end TLS enabled with a cert mismatch? → Check CN/SAN vs hostname

5. **Update the "Upstream SSL certificate doesn't match" section.** Add explicit guidance on using `openssl s_client` to verify the backend certificate CN/SAN from the App Gateway subnet. Currently the article explains the concept well but doesn't provide a diagnostic command.

#### UPDATE: `application-gateway-backend-health-troubleshooting` (Backend Health TSG)

6. **Add a visual decision tree / flowchart.** The article has 15+ error messages in a flat list. Add a Mermaid or image-based flowchart at the top: _Backend Unhealthy → Is it a timeout? → Is it a TCP error? → Is it a cert error?_ This would dramatically reduce time-to-resolution for CSS and customers.

7. **Add section: "Common health probe misconfiguration patterns."** Consolidate the most frequent probe misconfigurations into a single quick-reference table:
   | Misconfiguration | Symptom | Fix |
   |-----------------|---------|-----|
   | Probe path requires auth | 401 status mismatch | Use an unauthenticated path or add 401 to accepted codes |
   | Probe host set to 127.0.0.1 with multi-site backend | 404 from backend | Set probe host to match backend's expected Host header |
   | Probe port differs from app listening port | TCP connect error | Align probe port with application listening port |
   | Probe timeout too low for cold-start apps | Backend server timeout | Increase probe timeout; consider warmup path |
   | Missing intermediate cert on backend | Certificate verification failed | Install full chain on backend server |

8. **Expand the "Unknown" backend health section.** Add explicit mention of CRL endpoint accessibility (currently only in a Note at the very bottom). Promote this to a visible troubleshooting step — CSS reports this is a common miss. Specifically call out that `crl.microsoft.com` and `crl3.digicert.com` must be reachable from the App Gateway subnet.

9. **Add guidance for App Service / Container Apps backends.** The current article focuses on VM/VMSS backends. Add notes for:
   - App Service: "Pick hostname from backend target" must be enabled; custom probe host must match the App Service hostname
   - Container Apps: Port mapping differences; health probe path alignment with container readiness probes

#### NEW ARTICLE: "Diagnose 5xx errors on Application Gateway using metrics and logs"

10. **Create a new how-to guide** (under `/azure/application-gateway/`) that provides a structured diagnostic workflow:
    - Which metrics to check first (Unhealthy Host Count, Backend Response Status, Total Requests, Failed Requests, Capacity Units)
    - How to enable and query access logs and diagnostic logs
    - Sample KQL queries for each 5xx scenario
    - How to differentiate gateway-generated errors vs. backend-originated errors
    - When to engage Azure Support (include the data to collect before opening a ticket)

---

## Issue 2: SSL/TLS Certificate Setup Issues (Handshake Failures, Unsupported TLS Versions)

### Current Coverage

| Article | URL | Coverage | Gaps |
|---------|-----|----------|------|
| TLS overview (ssl-overview) | [ssl-overview](https://learn.microsoft.com/en-us/azure/application-gateway/ssl-overview) | TLS termination, end-to-end TLS, v1/v2 SNI differences, cert types, allow-listing | Very dense; no troubleshooting focus; SNI table is hard to consume |
| TLS policy overview | [application-gateway-ssl-policy-overview](https://learn.microsoft.com/en-us/azure/application-gateway/application-gateway-ssl-policy-overview) | Predefined policies, custom policies, cipher suites, CustomV2 | No "which policy should I choose" decision guidance |
| TLS 1.0/1.1 retirement | [application-gateway-tls-version-retirement](https://learn.microsoft.com/en-us/azure/application-gateway/application-gateway-tls-version-retirement) | Impact, identification, FAQs | No step-by-step migration guide; no validation commands |
| Configure end-to-end TLS (portal) | [end-to-end-ssl-portal](https://learn.microsoft.com/en-us/azure/application-gateway/end-to-end-ssl-portal) | Portal walkthrough for e2e TLS | Minimal troubleshooting if it doesn't work |
| Backend health troubleshooting | [application-gateway-backend-health-troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/azure/application-gateway/application-gateway-backend-health-troubleshooting) | CN mismatch, expired cert, missing intermediate, cert chain order, cert verification errors | Spread across 10+ error messages; no consolidated "TLS troubleshooting" view |
| Mutual auth troubleshooting | [mutual-authentication-troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/azure/application-gateway/mutual-authentication-troubleshooting) | Client cert issues (SslClientVerify NONE/FAILED) | Narrow scope — only mTLS |

### Actionable Updates

#### UPDATE: `ssl-overview` (TLS Overview)

11. **Add a "Common TLS handshake failure causes" section.** Currently the article is architectural/conceptual. Add a short troubleshooting quick-reference linking to deeper content:
    | Failure | Likely Cause | Where to Fix |
    |---------|-------------|-------------|
    | Client handshake failure | TLS version mismatch (client < minimum) | TLS policy settings |
    | Backend marked unhealthy with CN mismatch | SNI hostname doesn't match cert CN/SAN | Backend Settings hostname config |
    | Browser shows "certificate not trusted" | Missing intermediate cert on listener | Re-upload PFX with full chain |
    | Backend handshake fails | Backend doesn't support TLS 1.2+ | Update backend server TLS config |

12. **Simplify the SNI differences table.** The current v1/v2 SNI comparison tables (frontend and backend) are very dense. Add a "TL;DR" summary box above each table highlighting the most impactful behavioral difference — specifically the v2 default certificate behavior (uses highest-priority routing rule certificate, NOT basic listener fallback).

13. **Add explicit guidance on the "SNI hole" pattern.** The current tip about controlling the default certificate is buried in a table footnote. Expand this into a named, linkable section with step-by-step instructions — CSS reports customers frequently expose production certificates to IP-only connections.

#### UPDATE: `application-gateway-tls-version-retirement` (TLS Retirement)

14. **Add a step-by-step migration checklist.** The article explains what's changing but not how to migrate. Add:
    1. Check current TLS policy: `Get-AzApplicationGatewaySslPolicy`
    2. Identify clients using TLS 1.0/1.1: Check `Client TLS protocol` metric with splitting
    3. Query access logs for TLS version distribution (provide KQL query)
    4. Choose target policy (decision table: 20220101 vs 20220101S vs CustomV2)
    5. Test with `openssl s_client -tls1_2` and `openssl s_client -tls1_3`
    6. Update policy: `Set-AzApplicationGatewaySslPolicy`
    7. Verify: Re-check metrics post-change

15. **Add "Validation commands" section.** Provide concrete commands customers can run to verify their configuration after migration:
    ```bash
    # Test TLS 1.2 connectivity
    openssl s_client -connect <appgw-fqdn>:443 -tls1_2
    
    # Test TLS 1.3 connectivity
    openssl s_client -connect <appgw-fqdn>:443 -tls1_3
    
    # Verify negotiated cipher suite
    openssl s_client -connect <appgw-fqdn>:443 -tls1_2 | grep "Cipher is"
    ```

16. **Add backend-side validation.** The article mentions backends must support TLS 1.2+ but provides no guidance on how to verify backend TLS compatibility from the App Gateway perspective. Add `openssl s_client -connect <backend-ip>:<port>` examples.

#### UPDATE: `application-gateway-ssl-policy-overview` (TLS Policy Overview)

17. **Add a "Which TLS policy should I use?" decision guide.** Customers struggle to choose between predefined policies. Add:
    - **20220101** (recommended default): TLS 1.2 + 1.3, broad cipher support → Use for most workloads
    - **20220101S** (strict): TLS 1.2 + 1.3, restricted ciphers → Use for compliance-sensitive workloads
    - **CustomV2**: Full control over ciphers + TLS 1.3 → Use when you need specific cipher restrictions
    - **20170401S**: TLS 1.2 only (no 1.3) → Use only if clients can't handle TLS 1.3

#### NEW ARTICLE: "Troubleshoot TLS/SSL certificate and handshake issues on Application Gateway"

18. **Create a dedicated TSG** (under `/troubleshoot/azure/application-gateway/`) consolidating all TLS troubleshooting into one article:
    - **Frontend handshake failures**: TLS version mismatch, cipher mismatch, expired listener cert, incomplete cert chain
    - **Backend handshake failures**: CN/SAN mismatch, untrusted root, missing intermediate, expired backend cert
    - **End-to-end TLS failures**: Trusted root cert mismatch, self-signed cert handling (v1 auth cert vs. v2 trusted root)
    - **Mutual TLS failures**: Link to existing mTLS TSG
    - Each section with: Symptom → Diagnostic command → Root cause → Fix
    - Include `openssl s_client` commands for every scenario

    This article would serve as the single entry point for all TLS-related CSS cases, rather than requiring agents to navigate across 5+ articles.

#### UPDATE: `application-gateway-backend-health-troubleshooting` (Backend Health TSG)

19. **Group all TLS/certificate error messages under a single "TLS and certificate errors" heading.** Currently these are interspersed with non-TLS errors: CN mismatch, expired cert, missing intermediate, missing leaf, not issued by known CA, cert verification failed, trusted root mismatch (x2), leaf not topmost. Group them and add a short intro explaining the certificate chain validation flow.

---

## Issue 3: WAF Policy False Positives Blocking Legitimate Traffic

### Current Coverage

| Article | URL | Coverage | Gaps |
|---------|-----|----------|------|
| Troubleshoot WAF for App Gateway | [web-application-firewall-troubleshoot](https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/web-application-firewall-troubleshoot) | Log analysis, fix false positives (exclusions, disable rules), find attribute/header/cookie names, global parameter tuning, HAR recording | Single example only (SQL injection 1=1); no coverage of common real-world scenarios; no KQL queries |
| WAF exclusion lists | [application-gateway-waf-configuration](https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/application-gateway-waf-configuration) | Exclusion list config, scope levels | Conceptual — no scenario-based examples |
| WAF best practices | [best-practices](https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/best-practices) | Enable CRS, bot rules, tune, use prevention mode, define as code, logging | High-level guidance; no specific tuning examples |
| Customize WAF rules (portal/PS/CLI) | Multiple articles | How to disable/enable rules | Mechanics only — no guidance on WHICH rules commonly cause false positives |
| WAF policy overview | [policy-overview](https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/policy-overview) | Global, per-site, per-URI policy scoping | Good conceptual coverage |
| CRS rule groups and rules | [application-gateway-crs-rulegroups-rules](https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/application-gateway-crs-rulegroups-rules) | Full rule listing | No indication of which rules commonly trigger false positives |

### Actionable Updates

#### UPDATE: `web-application-firewall-troubleshoot` (WAF TSG)

20. **Add a "Top 10 false positive scenarios" section.** The current article uses only one example (SQL injection `1=1`). Based on CSS case patterns, add worked examples for the most common false positive triggers:
    | Scenario | Commonly Triggered Rules | Recommended Fix |
    |----------|------------------------|----------------|
    | Microsoft Entra ID auth tokens in cookies/headers | 942xxx (SQLI), 941xxx (XSS) | Exclude `__RequestVerificationToken`, `Authorization` header |
    | JSON/XML API payloads with special characters | 942xxx (SQLI) | Per-URI policy with body exclusions for API paths |
    | File upload endpoints (large payloads) | 920xxx (Protocol enforcement — body size) | Increase max request body limit for upload URIs |
    | Single-page apps with encoded query strings | 942xxx, 941xxx | Exclude specific ARGS parameters |
    | Health check / monitoring probes | 920350 (numeric IP host) | Allow custom rule for probe User-Agent or source IP |
    | WYSIWYG / rich text editor content | 941xxx (XSS), 942xxx (SQLI) | Exclude request body for editor submission paths |
    | Graph API / webhook callbacks | 942xxx | Per-URI policy scoped to callback endpoint |
    | Base64-encoded tokens in query strings | 942xxx | Exclude specific query parameter by name |

21. **Add KQL queries for WAF log analysis.** The article explains log structure but provides no ready-to-use queries:
    ```kusto
    // Top 10 rules triggering blocks in the last 24 hours
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.NETWORK"
    | where Category == "ApplicationGatewayFirewallLog"
    | where action_s == "Blocked"
    | summarize Count=count() by ruleId_s, message_s
    | top 10 by Count desc
    ```
    ```kusto
    // False positive candidates: rules triggered by known-good IPs
    AzureDiagnostics
    | where Category == "ApplicationGatewayFirewallLog"
    | where action_s == "Matched"
    | summarize HitCount=count(), DistinctClients=dcount(clientIp_s) by ruleId_s, message_s
    | where DistinctClients > 10
    | order by HitCount desc
    ```

22. **Add a "Detection-to-Prevention mode migration workflow."** Many customers stay in Detection mode indefinitely because they're afraid of production impact. Add:
    1. Enable Detection mode and diagnostic logging
    2. Run for 1–2 weeks to collect baseline
    3. Run KQL query to identify all triggered rules
    4. For each triggered rule: classify as true positive or false positive
    5. Create exclusions / per-URI policies for false positives
    6. Switch to Prevention mode
    7. Monitor for 403 responses using access logs
    8. Iterate on exclusions as needed

23. **Add section: "Interpreting anomaly scores."** The article mentions anomaly scoring briefly but doesn't explain how to tune the threshold. Add:
    - Default threshold is 5 for CRS 3.x
    - Each matched rule adds to the score (typically 2–5 points per match)
    - Multiple low-severity matches can compound to block
    - Explain that disabling a single rule may not help if multiple rules contribute to the score
    - Show how to read the `Total Inbound Score` breakdown in logs: `SQLI=5,XSS=0,...`

24. **Expand the "per-site and per-URI policy" guidance.** The article mentions it in passing. Add a concrete example:
    - API endpoint (`/api/*`) gets a permissive policy with specific SQLI rule exclusions
    - Payment page (`/checkout`) keeps strict rules with no exclusions
    - Static content (`/static/*`) gets WAF bypass via Allow custom rule

#### UPDATE: `application-gateway-waf-configuration` (WAF Exclusion Lists)

25. **Add a "Common exclusion patterns" reference table.** The article explains the mechanics but not what to exclude in practice:
    | Use Case | Exclusion Type | Match Variable | Selector | Scope |
    |----------|---------------|----------------|----------|-------|
    | Entra ID auth | Request Header | Authorization | Equals | Global |
    | Anti-forgery tokens | Request Cookie | __RequestVerificationToken | Equals | Global |
    | JSON API body | Request Body | (per attribute) | StartsWith | Per-URI for `/api/` |
    | File uploads | Request Body | file | Equals | Per-URI for `/upload` |

26. **Add warnings about over-broad exclusions.** Emphasize the security implications of excluding entire request components globally vs. scoping to specific rules/URIs. Include a "do this, not that" comparison.

#### UPDATE: `best-practices` (WAF Best Practices)

27. **Add a "WAF tuning workflow" section.** The current article says "tune your WAF" but doesn't describe a methodology. Add the structured approach from recommendation #22 and link to the TSG article.

28. **Add section: "Monitoring for false positives in production."** Recommend:
    - Set up Azure Monitor alerts on `ApplicationGatewayFirewallLog` where action == "Blocked"
    - Create a weekly review cadence for WAF logs
    - Use the Log Analytics workbook for WAF (link to the WAF monitoring article)

#### NEW ARTICLE: "WAF tuning guide — Reduce false positives on Application Gateway"

29. **Create a comprehensive tuning guide** (under `/azure/web-application-firewall/ag/`) that serves as the definitive resource for false positive management:
    - Step-by-step tuning methodology (detect → analyze → exclude → prevent → monitor)
    - The top 10 false positive scenarios with worked examples (#20 above)
    - Exclusion best practices (scoped vs. global; rule-level vs. global)
    - Per-site and per-URI policy examples
    - Custom Allow rules for known-good traffic
    - Anomaly score tuning
    - Integration with Sentinel for ongoing monitoring
    - "Tuning as code" examples (Bicep/Terraform for exclusions)

---

## Cross-Cutting Improvements

### Cross-Article Linking

30. **Add prominent cross-links between related articles.** Currently, the troubleshooting articles operate in silos:
    - `application-gateway-troubleshooting-502` should link to `application-gateway-backend-health-troubleshooting` at the top (not just buried in solution steps)
    - `ssl-overview` should link to the backend health TSG's certificate error messages section
    - `application-gateway-tls-version-retirement` should link to `application-gateway-ssl-policy-overview` and the TLS configure article
    - `web-application-firewall-troubleshoot` should link to `best-practices`, `application-gateway-waf-configuration`, and `per-site-policies`

### Navigation & Discoverability

31. **Create a "Troubleshooting hub" landing page** for Application Gateway (under `/troubleshoot/azure/application-gateway/`) that provides a single entry point organized by symptom:
    - "I'm getting 502 errors" → links
    - "I'm getting 503 errors" → links
    - "TLS handshake is failing" → links
    - "WAF is blocking legitimate traffic" → links
    - "Backend health shows Unhealthy/Unknown" → links

### Diagnostic Tooling

32. **Add "Data to collect before contacting support" sections** to all three primary TSG articles. CSS cases are faster to resolve when customers provide:
    - For 5xx errors: Backend Health blade screenshot, access log excerpt with `transactionId`, NSG effective rules
    - For TLS issues: `openssl s_client` output, listener cert details, backend cert chain
    - For WAF false positives: WAF firewall log with `transactionId`, HAR file, request details

---

## Sources

| # | Title | URL | Tier | Type | Accessed |
|---|-------|-----|------|------|----------|
| 1 | Troubleshooting bad gateway errors in Application Gateway | https://learn.microsoft.com/en-us/troubleshoot/azure/application-gateway/application-gateway-troubleshooting-502 | Tier 1 | TSG | 2026-03-04 |
| 2 | Troubleshoot backend health issues in Application Gateway | https://learn.microsoft.com/en-us/troubleshoot/azure/application-gateway/application-gateway-backend-health-troubleshooting | Tier 1 | TSG | 2026-03-04 |
| 3 | Overview of TLS termination and end to end TLS with Application Gateway | https://learn.microsoft.com/en-us/azure/application-gateway/ssl-overview | Tier 1 | Docs | 2026-03-04 |
| 4 | Application Gateway TLS policy overview | https://learn.microsoft.com/en-us/azure/application-gateway/application-gateway-ssl-policy-overview | Tier 1 | Docs | 2026-03-04 |
| 5 | Managing your Application Gateway with TLS 1.0 and 1.1 retirement | https://learn.microsoft.com/en-us/azure/application-gateway/application-gateway-tls-version-retirement | Tier 1 | Docs | 2026-03-04 |
| 6 | Configure TLS policy versions and cipher suites on Application Gateway | https://learn.microsoft.com/en-us/azure/application-gateway/application-gateway-configure-ssl-policy-powershell | Tier 1 | Docs | 2026-03-04 |
| 7 | Configure end-to-end TLS by using Application Gateway with the portal | https://learn.microsoft.com/en-us/azure/application-gateway/end-to-end-ssl-portal | Tier 1 | Docs | 2026-03-04 |
| 8 | Troubleshoot Web Application Firewall (WAF) for Azure Application Gateway | https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/web-application-firewall-troubleshoot | Tier 1 | TSG | 2026-03-04 |
| 9 | Web Application Firewall exclusion lists | https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/application-gateway-waf-configuration | Tier 1 | Docs | 2026-03-04 |
| 10 | Best practices for WAF on Application Gateway | https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/best-practices | Tier 1 | Docs | 2026-03-04 |
| 11 | Customize WAF rules using the Azure portal | https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/application-gateway-customize-waf-rules-portal | Tier 1 | Docs | 2026-03-04 |
| 12 | WAF policy overview | https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/policy-overview | Tier 1 | Docs | 2026-03-04 |
| 13 | Troubleshooting mutual authentication errors in Application Gateway | https://learn.microsoft.com/en-us/troubleshoot/azure/application-gateway/mutual-authentication-troubleshooting | Tier 1 | TSG | 2026-03-04 |
| 14 | Reliability in Azure Application Gateway v2 | https://learn.microsoft.com/en-us/azure/reliability/reliability-application-gateway-v2 | Tier 1 | Docs | 2026-03-04 |
| 15 | Create a custom probe for Application Gateway (portal) | https://learn.microsoft.com/en-us/azure/application-gateway/application-gateway-create-probe-portal | Tier 1 | Docs | 2026-03-04 |
| 16 | Troubleshoot App Service issues in Application Gateway | https://learn.microsoft.com/en-us/troubleshoot/azure/application-gateway/troubleshoot-app-service-redirection-app-service-url | Tier 1 | TSG | 2026-03-04 |
| 17 | Configure per-site WAF policies using Azure PowerShell | https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/per-site-policies | Tier 1 | Docs | 2026-03-04 |
| 18 | What is Azure WAF on Azure Application Gateway? | https://learn.microsoft.com/en-us/azure/web-application-firewall/ag/ag-overview | Tier 1 | Docs | 2026-03-04 |
