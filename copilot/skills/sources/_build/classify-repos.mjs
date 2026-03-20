#!/usr/bin/env node
/**
 * classify-repos.mjs
 * Reads JSON from gh CLI, classifies repos by product area + function type,
 * outputs YAML catalog files.
 *
 * Usage: node classify-repos.mjs <org-name> <input.json> <output.yml>
 */

import { readFileSync, writeFileSync } from 'fs';

const [,, orgName, inputFile, outputFile] = process.argv;

if (!orgName || !inputFile || !outputFile) {
  console.error('Usage: node classify-repos.mjs <org-name> <input.json> <output.yml>');
  process.exit(1);
}

// ── Taxonomy definitions ────────────────────────────────────────────

const PRODUCT_RULES = [
  // More specific patterns first, broader ones last
  { area: 'azure-networking',  patterns: [/network/i, /firewall/i, /\bdns\b/i, /\bvpn\b/i, /\bvnet\b/i, /front-?door/i, /load-?balance/i, /express-?route/i, /bastion/i, /private-?link/i, /application-?gateway/i, /traffic-?manager/i, /\bnat\b/i, /\bddos\b/i, /azure-?cdn/i, /\bwaf\b/i, /azure-?network/i, /virtual-?network/i, /private-?endpoint/i, /route-?server/i, /peering/i, /nsg\b/i, /network-?security/i, /azure-?relay/i] },
  { area: 'azure-compute',     patterns: [/\bvm\b/i, /virtual-?machine/i, /container/i, /\baks\b/i, /kubernetes/i, /app-?service/i, /function[s]?\b/i, /azure-?function/i, /web-?app/i, /batch\b/i, /service-?fabric/i, /vmss/i, /scale-?set/i, /cloud-?service/i, /spring-?app/i, /container-?app/i, /container-?instance/i] },
  { area: 'azure-storage',     patterns: [/azure[-.]?storage/i, /\bblob\b/i, /data-?lake/i, /file-?share/i, /managed-?disk/i, /azure-?disk/i, /storage-?account/i, /\badls\b/i] },
  { area: 'azure-data',        patterns: [/\bsql\b/i, /cosmos/i, /synapse/i, /databricks/i, /data-?factory/i, /\bmysql\b/i, /postgres/i, /mariadb/i, /redis\b/i, /cache\b/i, /stream-?analytics/i, /event-?hub/i, /purview/i, /data-?catalog/i, /hdinsight/i, /\bhdi\b/i] },
  { area: 'azure-ai',          patterns: [/cognitive/i, /openai/i, /\bai[-\s]/i, /ai$/i, /\bml\b/i, /machine-?learning/i, /azure-?search/i, /ai-?search/i, /bot-?framework/i, /bot-?service/i, /form-?recognizer/i, /document-?intelligence/i, /speech/i, /vision/i, /language[-\s]/i, /translator/i, /anomaly/i, /personalizer/i, /content-?safety/i, /foundry/i, /\bgpt\b/i, /llm/i, /copilot-?sdk/i, /semantic-?kernel/i, /autogen/i, /promptflow/i, /prompt-?flow/i, /responsible-?ai/i] },
  { area: 'azure-security',    patterns: [/sentinel/i, /defender/i, /\bentra\b/i, /identity/i, /key-?vault/i, /security-?center/i, /\bmsal\b/i, /active-?directory/i, /\baad\b/i, /confidential/i, /attestation/i, /managed-?identity/i, /azure-?ad/i] },
  { area: 'azure-devops',      patterns: [/\bdevops\b/i, /pipeline/i, /\bboards\b/i, /artifacts\b/i, /azure-?repos\b/i] },
  { area: 'azure-iac',         patterns: [/\bbicep\b/i, /arm-?template/i, /terraform/i, /pulumi/i, /azure-?quickstart/i, /resource-?manager/i, /deployment-?template/i, /template-?spec/i] },
  { area: 'azure-monitor',     patterns: [/monitor/i, /log-?analytics/i, /app-?insight/i, /application-?insight/i, /diagnostic/i, /metric/i, /workbook/i, /grafana/i, /\botel\b/i, /opentelemetry/i] },
  { area: 'azure-messaging',   patterns: [/service-?bus/i, /event-?grid/i, /notification-?hub/i, /signalr/i, /web-?pubsub/i, /queue/i, /relay\b/i] },
  { area: 'azure-iot',         patterns: [/\biot\b/i, /digital-?twin/i, /sphere/i, /edge.*device/i, /device.*edge/i, /rtos/i] },
  { area: 'azure-integration', patterns: [/logic-?app/i, /api-?management/i, /\bapim\b/i, /api-?center/i, /service-?connector/i] },
  { area: 'azure-general',     patterns: [/\bazure\b/i, /\baz[-.]?/i] },
  { area: 'm365',              patterns: [/\boffice\b/i, /\bteams\b/i, /sharepoint/i, /outlook/i, /exchange/i, /onedrive/i, /\bgraph\b/i, /microsoft-?graph/i, /\bword\b/i, /\bexcel\b/i, /\boneNote\b/i, /planner/i, /loop\b/i, /viva\b/i, /yammer/i, /m365/i, /microsoft-?365/i] },
  { area: 'copilot',           patterns: [/copilot/i, /ai-?assistant/i, /github-?copilot/i] },
  { area: 'developer-tools',   patterns: [/vscode/i, /visual-?studio/i, /\.net\b/i, /dotnet/i, /typescript/i, /powershell/i, /\bcli\b/i, /nuget/i, /npm\b/i, /msbuild/i, /razor/i, /blazor/i, /aspnet/i, /asp\.net/i, /csharp/i, /fsharp/i, /winget/i, /terminal/i, /dev-?container/i, /codespace/i, /playwright/i, /maui/i, /xamarin/i] },
  { area: 'power-platform',    patterns: [/power-?app/i, /power-?automate/i, /power-?bi/i, /power-?page/i, /power-?virtual/i, /dataverse/i, /power-?platform/i, /power-?fx/i] },
  { area: 'windows',           patterns: [/windows/i, /win32/i, /winui/i, /\bwsl\b/i, /winrt/i, /uwp/i, /wpf/i, /winform/i, /directx/i, /wdk/i, /driver/i] },
  { area: 'dynamics',          patterns: [/dynamics/i, /\bd365\b/i, /business-?central/i, /finance.*operations/i] },
  { area: 'gaming',            patterns: [/\bxbox\b/i, /playfab/i, /game/i, /\bgdk\b/i] },
];

const FUNCTION_RULES = [
  { type: 'documentation', patterns: [/[-.]?docs?\b/i, /\blearn\b/i, /content\b/i, /article/i, /documentation/i, /reference\b/i, /guide/i, /how-?to/i, /tutorial/i] },
  { type: 'sdk',           patterns: [/\bsdk\b/i, /client-?library/i, /library\b/i, /azure-sdk/i, /track2/i] },
  { type: 'cli-tool',      patterns: [/\bcli\b/i, /tool\b/i, /utility/i, /extension/i, /plugin/i, /add-?on/i, /helper/i, /linter/i, /formatter/i] },
  { type: 'sample',        patterns: [/sample/i, /example/i, /quickstart/i, /demo\b/i, /tutorial/i, /workshop/i, /lab\b/i, /hands-?on/i, /starter/i, /getting-?started/i, /how-?to/i, /recipe/i, /snippet/i, /playground/i] },
  { type: 'template',      patterns: [/template/i, /boilerplate/i, /scaffold/i, /blueprint/i, /accelerator/i, /landing-?zone/i] },
  { type: 'iac',           patterns: [/\bbicep\b/i, /\barm\b/i, /terraform/i, /infrastructure/i, /deploy/i, /provision/i] },
  { type: 'service',       patterns: [/service\b/i, /\bapi\b/i, /backend/i, /server\b/i, /microservice/i, /gateway/i] },
  { type: 'specification', patterns: [/\bspec\b/i, /openapi/i, /swagger/i, /schema/i, /protocol/i, /rfc/i, /standard/i] },
  { type: 'community',     patterns: [/awesome/i, /communit/i, /contrib/i, /governance/i, /\.github\b/i] },
];

// ── Classification functions ────────────────────────────────────────

function classify(name, desc) {
  const text = `${name} ${desc || ''}`;

  let productArea = 'general';
  for (const rule of PRODUCT_RULES) {
    if (rule.patterns.some(p => p.test(text))) {
      productArea = rule.area;
      break;
    }
  }

  let functionType = 'other';
  for (const rule of FUNCTION_RULES) {
    if (rule.patterns.some(p => p.test(text))) {
      functionType = rule.type;
      break;
    }
  }

  return { productArea, functionType };
}

// ── YAML serializer (no dependency) ──────────────────────────────────

function escapeYamlString(s) {
  if (s === null || s === undefined) return '""';
  s = String(s);
  if (s === '') return '""';
  // Quote if contains special chars
  if (/[:#\[\]{}&*!|>'"%@`,?]/.test(s) || /^\s/.test(s) || /\s$/.test(s) || s === 'true' || s === 'false' || s === 'null' || !isNaN(s)) {
    return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  return s;
}

function repoToYaml(repo, indent = '  ') {
  const lines = [];
  lines.push(`${indent}- name: ${escapeYamlString(repo.name)}`);
  lines.push(`${indent}  url: ${escapeYamlString(repo.url)}`);
  lines.push(`${indent}  description: ${escapeYamlString(repo.description)}`);
  lines.push(`${indent}  product_area: ${repo.product_area}`);
  lines.push(`${indent}  function_type: ${repo.function_type}`);
  if (repo.language) lines.push(`${indent}  language: ${escapeYamlString(repo.language)}`);
  lines.push(`${indent}  last_pushed: ${repo.last_pushed}`);
  lines.push(`${indent}  stars: ${repo.stars}`);
  lines.push(`${indent}  forks: ${repo.forks}`);
  return lines.join('\n');
}

// ── Main ────────────────────────────────────────────────────────────

const cutoffDate = new Date('2024-03-20');

const raw = JSON.parse(readFileSync(inputFile, 'utf-8'));

// Filter: not archived, pushed in last 2 years
const repos = raw
  .filter(r => !r.isArchived)
  .filter(r => new Date(r.pushedAt) >= cutoffDate)
  .map(r => {
    const { productArea, functionType } = classify(r.name, r.description);
    return {
      name: r.name,
      url: r.url,
      description: r.description || '',
      product_area: productArea,
      function_type: functionType,
      language: r.primaryLanguage?.name || null,
      last_pushed: r.pushedAt ? r.pushedAt.split('T')[0] : null,
      stars: r.stargazerCount ?? r.stargazersCount ?? 0,
      forks: r.forkCount ?? 0,
    };
  })
  .sort((a, b) => b.stars - a.stars);

// Compute stats
const productCounts = {};
const functionCounts = {};

for (const r of repos) {
  productCounts[r.product_area] = (productCounts[r.product_area] || 0) + 1;
  functionCounts[r.function_type] = (functionCounts[r.function_type] || 0) + 1;
}

// Build YAML
const lines = [];
lines.push(`# ${orgName} Repository Catalog`);
lines.push(`# Auto-generated on ${new Date().toISOString().split('T')[0]}`);
lines.push(`# Source: https://github.com/${orgName}`);
lines.push(`# Filter: Non-archived repos pushed since ${cutoffDate.toISOString().split('T')[0]}`);
lines.push('');
lines.push('organization:');
lines.push(`  name: ${escapeYamlString(orgName)}`);
lines.push(`  url: "https://github.com/${orgName}"`);
lines.push(`  total_repos: ${repos.length}`);
lines.push(`  generated: ${new Date().toISOString().split('T')[0]}`);
lines.push('');
lines.push('summary:');
lines.push('  by_product_area:');
for (const [area, count] of Object.entries(productCounts).sort((a, b) => b[1] - a[1])) {
  lines.push(`    ${area}: ${count}`);
}
lines.push('  by_function_type:');
for (const [ft, count] of Object.entries(functionCounts).sort((a, b) => b[1] - a[1])) {
  lines.push(`    ${ft}: ${count}`);
}
lines.push('');
lines.push('repos:');
for (const r of repos) {
  lines.push(repoToYaml(r));
}
lines.push('');

writeFileSync(outputFile, lines.join('\n'), 'utf-8');

// Also write networking repos to a separate temp file for cross-ref
const networkingRepos = repos.filter(r => r.product_area === 'azure-networking');
const netLines = [];
for (const r of networkingRepos) {
  netLines.push(JSON.stringify(r));
}
writeFileSync(outputFile.replace('.yml', '.networking.jsonl'), netLines.join('\n') + '\n', 'utf-8');

// Write all category data as JSON for cross-ref
writeFileSync(outputFile.replace('.yml', '.categories.json'), JSON.stringify({
  org: orgName,
  total: repos.length,
  productCounts,
  functionCounts,
  repos: repos.map(r => ({ name: r.name, url: r.url, description: r.description, product_area: r.product_area, function_type: r.function_type, stars: r.stars }))
}, null, 2), 'utf-8');

console.log(`✓ ${orgName}: ${repos.length} repos classified → ${outputFile}`);
console.log(`  Product areas: ${JSON.stringify(productCounts)}`);
console.log(`  Function types: ${JSON.stringify(functionCounts)}`);
console.log(`  Networking repos: ${networkingRepos.length}`);
