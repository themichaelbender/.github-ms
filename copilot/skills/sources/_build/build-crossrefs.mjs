#!/usr/bin/env node
/**
 * build-crossrefs.mjs
 * Reads per-org .categories.json files and builds:
 *  - azure-networking.yml (cross-org networking repos)
 *  - Additional category .yml files for large categories
 *  - categories-index.yml (master index)
 *
 * Usage: node build-crossrefs.mjs <sources-dir>
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const sourcesDir = process.argv[2];
if (!sourcesDir) {
  console.error('Usage: node build-crossrefs.mjs <sources-dir>');
  process.exit(1);
}

// ── YAML helpers ────────────────────────────────────────────────────

function escapeYamlString(s) {
  if (s === null || s === undefined) return '""';
  s = String(s);
  if (s === '') return '""';
  if (/[:#\[\]{}&*!|>'"%@`,?]/.test(s) || /^\s/.test(s) || /\s$/.test(s) || s === 'true' || s === 'false' || s === 'null' || !isNaN(s)) {
    return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  }
  return s;
}

function repoToYaml(repo, indent = '  ') {
  const lines = [];
  lines.push(`${indent}- name: ${escapeYamlString(repo.name)}`);
  lines.push(`${indent}  org: ${escapeYamlString(repo.org)}`);
  lines.push(`${indent}  url: ${escapeYamlString(repo.url)}`);
  lines.push(`${indent}  description: ${escapeYamlString(repo.description)}`);
  lines.push(`${indent}  product_area: ${repo.product_area}`);
  lines.push(`${indent}  function_type: ${repo.function_type}`);
  lines.push(`${indent}  stars: ${repo.stars}`);
  return lines.join('\n');
}

// ── Load all org data ───────────────────────────────────────────────

const catFiles = readdirSync(sourcesDir).filter(f => f.endsWith('.categories.json'));

const allRepos = [];
const orgStats = [];

for (const f of catFiles) {
  const data = JSON.parse(readFileSync(join(sourcesDir, f), 'utf-8'));
  orgStats.push({
    org: data.org,
    total: data.total,
    productCounts: data.productCounts,
    functionCounts: data.functionCounts,
  });
  for (const repo of data.repos) {
    allRepos.push({ ...repo, org: data.org });
  }
}

console.log(`Loaded ${allRepos.length} repos from ${catFiles.length} orgs`);

// ── Aggregate by product area ──────────────────────────────────────

const byProductArea = {};
for (const r of allRepos) {
  if (!byProductArea[r.product_area]) byProductArea[r.product_area] = [];
  byProductArea[r.product_area].push(r);
}

// Sort each category by stars desc
for (const area in byProductArea) {
  byProductArea[area].sort((a, b) => b.stars - a.stars);
}

// ── Build azure-networking.yml ─────────────────────────────────────

const networkingRepos = byProductArea['azure-networking'] || [];
const netLines = [];
netLines.push('# Azure Networking Repository Cross-Reference');
netLines.push(`# Auto-generated on ${new Date().toISOString().split('T')[0]}`);
netLines.push('# Cross-organization index of repos related to Azure Networking');
netLines.push(`# Includes: VNet, NSG, Firewall, Load Balancer, App Gateway, Front Door,`);
netLines.push(`#           ExpressRoute, VPN, DNS, Private Link, Bastion, DDoS, CDN, WAF`);
netLines.push('');
netLines.push('category: azure-networking');
netLines.push(`total_repos: ${networkingRepos.length}`);
netLines.push(`generated: ${new Date().toISOString().split('T')[0]}`);
netLines.push('');
netLines.push('sources:');
const netOrgs = [...new Set(networkingRepos.map(r => r.org))];
for (const org of netOrgs) {
  netLines.push(`  - org: ${org}`);
  netLines.push(`    count: ${networkingRepos.filter(r => r.org === org).length}`);
}
netLines.push('');
netLines.push('repos:');
for (const r of networkingRepos) {
  netLines.push(repoToYaml(r));
}
netLines.push('');

writeFileSync(join(sourcesDir, 'azure-networking.yml'), netLines.join('\n'), 'utf-8');
console.log(`✓ azure-networking.yml: ${networkingRepos.length} repos`);

// ── Build category files for large categories ──────────────────────

const CATEGORY_FILE_THRESHOLD = 5; // Generate a file if >= 5 repos

const categoryFiles = [];

for (const [area, repos] of Object.entries(byProductArea).sort((a, b) => b[1].length - a[1].length)) {
  if (area === 'azure-networking') {
    categoryFiles.push({ area, file: 'azure-networking.yml', count: repos.length });
    continue; // already built
  }
  if (repos.length < CATEGORY_FILE_THRESHOLD) continue;

  const fileName = `${area}.yml`;
  const catLines = [];
  catLines.push(`# ${area.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} Repository Cross-Reference`);
  catLines.push(`# Auto-generated on ${new Date().toISOString().split('T')[0]}`);
  catLines.push(`# Cross-organization index of repos in the "${area}" product area`);
  catLines.push('');
  catLines.push(`category: ${area}`);
  catLines.push(`total_repos: ${repos.length}`);
  catLines.push(`generated: ${new Date().toISOString().split('T')[0]}`);
  catLines.push('');
  catLines.push('sources:');
  const catOrgs = [...new Set(repos.map(r => r.org))];
  for (const org of catOrgs) {
    catLines.push(`  - org: ${org}`);
    catLines.push(`    count: ${repos.filter(r => r.org === org).length}`);
  }
  catLines.push('');
  catLines.push('repos:');
  for (const r of repos) {
    catLines.push(repoToYaml(r));
  }
  catLines.push('');

  writeFileSync(join(sourcesDir, fileName), catLines.join('\n'), 'utf-8');
  categoryFiles.push({ area, file: fileName, count: repos.length });
  console.log(`✓ ${fileName}: ${repos.length} repos`);
}

// Add small categories that didn't get files
for (const [area, repos] of Object.entries(byProductArea)) {
  if (!categoryFiles.find(c => c.area === area)) {
    categoryFiles.push({ area, file: null, count: repos.length });
  }
}

// ── Build categories-index.yml ─────────────────────────────────────

const indexLines = [];
indexLines.push('# Microsoft GitHub Repository Catalog — Category Index');
indexLines.push(`# Auto-generated on ${new Date().toISOString().split('T')[0]}`);
indexLines.push(`# Total repos indexed: ${allRepos.length}`);
indexLines.push('# Organizations: MicrosoftDocs, Azure, microsoft, MicrosoftCopilot');
indexLines.push('');
indexLines.push('catalog:');
indexLines.push(`  total_repos: ${allRepos.length}`);
indexLines.push(`  total_organizations: ${catFiles.length}`);
indexLines.push(`  generated: ${new Date().toISOString().split('T')[0]}`);
indexLines.push(`  filter: "Non-archived, pushed since 2024-03-20"`);
indexLines.push('');
indexLines.push('organizations:');
for (const os of orgStats) {
  indexLines.push(`  - name: ${os.org}`);
  indexLines.push(`    url: "https://github.com/${os.org}"`);
  indexLines.push(`    repos: ${os.total}`);
  indexLines.push(`    file: ${os.org}.yml`);
}
indexLines.push('');
indexLines.push('# ── Product Areas ────────────────────────────────────────────────');
indexLines.push('product_areas:');
for (const cf of categoryFiles.sort((a, b) => b.count - a.count)) {
  indexLines.push(`  - area: ${cf.area}`);
  indexLines.push(`    repos: ${cf.count}`);
  if (cf.file) {
    indexLines.push(`    file: ${cf.file}`);
  }
}
indexLines.push('');
indexLines.push('# ── Function Types ───────────────────────────────────────────────');
const byFunctionType = {};
for (const r of allRepos) {
  if (!byFunctionType[r.function_type]) byFunctionType[r.function_type] = 0;
  byFunctionType[r.function_type]++;
}
indexLines.push('function_types:');
for (const [ft, count] of Object.entries(byFunctionType).sort((a, b) => b[1] - a[1])) {
  indexLines.push(`  - type: ${ft}`);
  indexLines.push(`    repos: ${count}`);
}
indexLines.push('');

writeFileSync(join(sourcesDir, 'categories-index.yml'), indexLines.join('\n'), 'utf-8');
console.log(`✓ categories-index.yml`);

// ── Summary ────────────────────────────────────────────────────────

console.log(`\n═══ Summary ═══`);
console.log(`Total repos: ${allRepos.length}`);
console.log(`Organizations: ${catFiles.length}`);
console.log(`Category files: ${categoryFiles.filter(c => c.file).length}`);
console.log(`Product areas: ${Object.keys(byProductArea).length}`);
console.log(`Function types: ${Object.keys(byFunctionType).length}`);
