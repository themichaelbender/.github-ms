---
description: '[DEPRECATED] Microsoft Documentation Fact-Checking Agent — Full variant. Use microsoft-fact-checker-slim.agent.md (25 tools) or microsoft-fact-checker-cia.agent.md (31 tools) instead. This agent loads ~95 tools, consuming significant tokens on every turn. Kept for reference only.'
tools: []
---

# ⚠️ DEPRECATED — Microsoft Documentation Fact-Checking Agent (Full Variant)

**This agent has been deprecated.** It loaded ~95 tools, consuming significant tokens on every conversation turn.

## Use instead

| Use case | Agent | Tools |
|----------|-------|-------|
| Standard fact-checking | `microsoft-fact-checker-slim.agent.md` | 25 tools |
| Customer incident analysis | `microsoft-fact-checker-cia.agent.md` | 31 tools (includes ADO) |

The slim and CIA agents cover all production workflows. If you encounter a use case that requires a tool not available in either variant, add it to the appropriate agent's tool list rather than reverting to this full agent.

## Migration notes

- All 10 workflows documented in SKILL.md work with the slim agent
- ADO-specific workflows (Workflow 10) use the CIA agent
- The slim agent includes `agent/runSubagent` for spawning sub-agents when additional tools are needed in parallel workflows
