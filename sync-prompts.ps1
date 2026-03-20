<#
.SYNOPSIS
    Syncs prompt and agent files from the .github repo to VS Code's user prompts directory.

.DESCRIPTION
    Run this script after `git pull` to update your local VS Code prompts
    with the latest from your .github repo.

.EXAMPLE
    cd C:\github\.github
    git pull origin main
    .\sync-prompts.ps1
#>

$RepoRoot = $PSScriptRoot
$VscodePromptsDir = Join-Path $env:APPDATA "Code\User\prompts"

# Ensure prompts directory exists
if (-not (Test-Path $VscodePromptsDir)) {
    New-Item -ItemType Directory -Path $VscodePromptsDir -Force | Out-Null
}

$copied = 0

# Copy prompt/agent files from copilot/skills/*/assets/
$skillAssets = Get-ChildItem -Path "$RepoRoot\copilot\skills\*\assets" -Filter "*.md" -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '\.(prompt|agent)\.md$' }

foreach ($file in $skillAssets) {
    Copy-Item -Path $file.FullName -Destination $VscodePromptsDir -Force
    Write-Host "  Synced: $($file.Name)" -ForegroundColor Green
    $copied++
}

# Copy prompt/agent files from prompts/ directory
$standalonePrompts = Get-ChildItem -Path "$RepoRoot\prompts" -Filter "*.md" -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match '\.(prompt|agent)\.md$' }

foreach ($file in $standalonePrompts) {
    Copy-Item -Path $file.FullName -Destination $VscodePromptsDir -Force
    Write-Host "  Synced: $($file.Name)" -ForegroundColor Green
    $copied++
}

Write-Host ""
Write-Host "Synced $copied prompt/agent files to: $VscodePromptsDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files in prompts directory:" -ForegroundColor Yellow
Get-ChildItem -Path $VscodePromptsDir -Filter "*.md" | ForEach-Object { Write-Host "  $($_.Name)" }
