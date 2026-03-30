<#
.SYNOPSIS
    Syncs .prompt.md and .agent.md files from Copilot skills and prompts to VS Code.

.DESCRIPTION
    Deploys prompt and agent files to the VS Code prompts directory.
    Supports two modes:
      -Symlink (default): Creates symbolic links for zero-maintenance sync
      -Copy: Traditional file copy (use if symlinks aren't available)

    Symlink mode requires running as Administrator on Windows.

.PARAMETER Mode
    Sync mode: "symlink" (default) or "copy"

.PARAMETER Force
    Overwrite existing files/links without prompting

.EXAMPLE
    # Default: symlink mode (requires admin on Windows)
    .\sync-prompts.ps1

    # Explicit copy mode
    .\sync-prompts.ps1 -Mode copy

    # Force overwrite
    .\sync-prompts.ps1 -Force
#>

[CmdletBinding()]
param(
    [ValidateSet("symlink", "copy")]
    [string]$Mode = "symlink",

    [switch]$Force
)

$ErrorActionPreference = "Stop"

# --- Configuration ---
$repoRoot = $PSScriptRoot
$targetDir = Join-Path $env:APPDATA "Code\User\prompts"

# Source directories to scan
$sourceDirs = @(
    (Join-Path $repoRoot "copilot\skills\*\assets"),
    (Join-Path $repoRoot "prompts")
)

# File patterns to sync
$patterns = @("*.prompt.md", "*.agent.md")

# --- Functions ---

function Test-AdminRequired {
    if ($Mode -eq "symlink" -and $env:OS -eq "Windows_NT") {
        $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
        $principal = New-Object Security.Principal.WindowsPrincipal($identity)
        if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
            Write-Warning "Symlink mode requires Administrator privileges on Windows."
            Write-Warning "Either run as Administrator, or use: .\sync-prompts.ps1 -Mode copy"
            exit 1
        }
    }
}

function Sync-File {
    param(
        [string]$Source,
        [string]$Target
    )

    $targetExists = Test-Path $Target

    if ($targetExists -and -not $Force) {
        # Check if it's already a correct symlink
        $item = Get-Item $Target -Force
        if ($item.LinkType -eq "SymbolicLink" -and $item.Target -eq $Source) {
            Write-Verbose "  SKIP (symlink current): $($item.Name)"
            return "skipped"
        }
    }

    if ($targetExists) {
        Remove-Item $Target -Force
    }

    if ($Mode -eq "symlink") {
        New-Item -ItemType SymbolicLink -Path $Target -Target $Source -Force | Out-Null
        return "linked"
    }
    else {
        Copy-Item -Path $Source -Destination $Target -Force
        return "copied"
    }
}

# --- Main ---

# Check prerequisites
Test-AdminRequired

# Ensure target directory exists
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    Write-Host "Created: $targetDir" -ForegroundColor Green
}

# Collect source files
$sourceFiles = @()
foreach ($dir in $sourceDirs) {
    foreach ($pattern in $patterns) {
        $found = Get-ChildItem -Path $dir -Filter $pattern -Recurse -ErrorAction SilentlyContinue
        $sourceFiles += $found
    }
}

if ($sourceFiles.Count -eq 0) {
    Write-Warning "No .prompt.md or .agent.md files found in source directories."
    exit 0
}

# Sync files
Write-Host ""
Write-Host "Syncing $($sourceFiles.Count) files ($Mode mode)" -ForegroundColor Cyan
Write-Host "  From: $repoRoot"
Write-Host "  To:   $targetDir"
Write-Host ""

$stats = @{ linked = 0; copied = 0; skipped = 0 }

foreach ($file in $sourceFiles) {
    $targetPath = Join-Path $targetDir $file.Name
    $result = Sync-File -Source $file.FullName -Target $targetPath

    $stats[$result]++

    $action = switch ($result) {
        "linked"  { "LINK" }
        "copied"  { "COPY" }
        "skipped" { "SKIP" }
    }

    $color = switch ($result) {
        "linked"  { "Green" }
        "copied"  { "Yellow" }
        "skipped" { "DarkGray" }
    }

    Write-Host "  $action  $($file.Name)" -ForegroundColor $color
}

# Summary
Write-Host ""
Write-Host "Done." -ForegroundColor Green

$parts = @()
if ($stats.linked -gt 0) { $parts += "$($stats.linked) linked" }
if ($stats.copied -gt 0) { $parts += "$($stats.copied) copied" }
if ($stats.skipped -gt 0) { $parts += "$($stats.skipped) skipped (unchanged)" }
Write-Host "  $($parts -join ', ')" -ForegroundColor Cyan

if ($Mode -eq "symlink") {
    Write-Host ""
    Write-Host "Symlink mode: changes to source files are reflected automatically." -ForegroundColor DarkGray
    Write-Host "No need to re-run sync after editing prompt/agent files." -ForegroundColor DarkGray
}
