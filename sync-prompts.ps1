<#
.SYNOPSIS
    Syncs .prompt.md and .agent.md files from Copilot skills and prompts to VS Code.

.DESCRIPTION
    Deploys prompt and agent files to the VS Code prompts directory.
    Supports three modes:
      - auto (default): create symlink if possible, otherwise copy
      - copy: always copy files
      - symlink: always create symlinks

.PARAMETER Mode
    Sync mode: auto, copy, or symlink.

.PARAMETER Force
    Overwrite existing files/links even if unchanged.

.EXAMPLE
    .\sync-prompts.ps1

.EXAMPLE
    .\sync-prompts.ps1 -Mode copy

.EXAMPLE
    .\sync-prompts.ps1 -Mode symlink -Force
#>

[CmdletBinding()]
param(
    [ValidateSet("auto", "copy", "symlink")]
    [string]$Mode = "auto",

    [switch]$Force
)

$ErrorActionPreference = "Stop"

$RepoRoot = $PSScriptRoot
$VscodePromptsDir = Join-Path $env:APPDATA "Code\User\prompts"

function Get-NormalizedPath {
    param([string]$Path)
    return [System.IO.Path]::GetFullPath($Path).TrimEnd('\\')
}

function Get-SourceFiles {
    $sourceFiles = @()

    $skillAssets = Get-ChildItem -Path "$RepoRoot\copilot\skills\*\assets" -Filter "*.md" -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '\.(prompt|agent)\.md$' }
    $sourceFiles += $skillAssets

    $promptAssets = Get-ChildItem -Path "$RepoRoot\prompts" -Filter "*.md" -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '\.(prompt|agent)\.md$' }
    $sourceFiles += $promptAssets

    return $sourceFiles
}

function Assert-NoDuplicateOutputNames {
    param([array]$Files)

    $dupes = $Files | Group-Object Name | Where-Object { $_.Count -gt 1 }
    if ($dupes) {
        Write-Error "Duplicate prompt/agent filenames detected. Destination is a flat folder and requires unique names."
        foreach ($dup in $dupes) {
            Write-Host "  $($dup.Name)" -ForegroundColor Red
            foreach ($file in $dup.Group) {
                Write-Host "    - $($file.FullName)" -ForegroundColor DarkRed
            }
        }
        throw "Resolve duplicate filenames before syncing."
    }
}

function Sync-File {
    param(
        [string]$Source,
        [string]$Target
    )

    $targetExists = Test-Path $Target
    $normalizedSource = Get-NormalizedPath -Path $Source

    if ($targetExists -and -not $Force) {
        $item = Get-Item $Target -Force
        if ($item.LinkType -eq "SymbolicLink") {
            $currentTarget = $item.Target
            if ($currentTarget -is [System.Array]) {
                $currentTarget = $currentTarget[0]
            }

            if ($null -ne $currentTarget) {
                $normalizedCurrentTarget = Get-NormalizedPath -Path $currentTarget
                if ($normalizedCurrentTarget -eq $normalizedSource) {
                    return "skipped"
                }
            }
        }
        elseif ($Mode -ne "symlink") {
            try {
                $srcHash = (Get-FileHash -Path $Source -Algorithm SHA256).Hash
                $dstHash = (Get-FileHash -Path $Target -Algorithm SHA256).Hash
                if ($srcHash -eq $dstHash) {
                    return "skipped"
                }
            }
            catch {
                # If hashing fails, continue to refresh target content.
            }
        }
    }

    if ($targetExists) {
        Remove-Item $Target -Force
    }

    if ($Mode -eq "copy") {
        Copy-Item -Path $Source -Destination $Target -Force
        return "copied"
    }

    if ($Mode -eq "symlink") {
        New-Item -ItemType SymbolicLink -Path $Target -Target $Source -Force | Out-Null
        return "linked"
    }

    try {
        New-Item -ItemType SymbolicLink -Path $Target -Target $Source -Force | Out-Null
        return "linked"
    }
    catch {
        Copy-Item -Path $Source -Destination $Target -Force
        return "copied"
    }
}

if (-not (Test-Path $VscodePromptsDir)) {
    New-Item -ItemType Directory -Path $VscodePromptsDir -Force | Out-Null
    Write-Host "Created: $VscodePromptsDir" -ForegroundColor Green
}

$sourceFiles = Get-SourceFiles | Sort-Object Name, FullName

if (-not $sourceFiles -or $sourceFiles.Count -eq 0) {
    Write-Warning "No .prompt.md or .agent.md files found in source directories."
    exit 0
}

Assert-NoDuplicateOutputNames -Files $sourceFiles

Write-Host ""
Write-Host "Syncing $($sourceFiles.Count) files ($Mode mode)" -ForegroundColor Cyan
Write-Host "  From: $RepoRoot"
Write-Host "  To:   $VscodePromptsDir"
Write-Host ""

$stats = @{ linked = 0; copied = 0; skipped = 0 }

foreach ($file in $sourceFiles) {
    $targetPath = Join-Path $VscodePromptsDir $file.Name
    $result = Sync-File -Source $file.FullName -Target $targetPath
    $stats[$result]++

    $action = switch ($result) {
        "linked" { "LINK" }
        "copied" { "COPY" }
        default { "SKIP" }
    }

    $color = switch ($result) {
        "linked" { "Green" }
        "copied" { "Yellow" }
        default { "DarkGray" }
    }

    Write-Host "  $action  $($file.Name)" -ForegroundColor $color
}

Write-Host ""
Write-Host "Done." -ForegroundColor Green
$summary = @()
if ($stats.linked -gt 0) { $summary += "$($stats.linked) linked" }
if ($stats.copied -gt 0) { $summary += "$($stats.copied) copied" }
if ($stats.skipped -gt 0) { $summary += "$($stats.skipped) skipped (unchanged)" }
Write-Host "  $($summary -join ', ')" -ForegroundColor Cyan
