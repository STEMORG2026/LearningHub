---
title: "ADR-019: Agentic Orchestration Capability Adoption"
status: ACCEPTED
date: 2026-09-18
last_updated: 2026-09-18
canonical: true
---

# ADR-019: Agentic Orchestration Capability Adoption

**Status**: ACCEPTED  
**Date**: 2026-09-18  
**Author**: Architecture / Hermes Agent Investigation

---

## Context

LearningHub operates within a broader STEM ecosystem that includes AI agents (PROFESSOR-J, JARVIS) and external SOTA agent harnesses (DeepSeek Harness / `dsh`, Hermes Agent, AGY CLI, OpenCode). To remain competitive and achieve true ecosystem orchestration, LearningHub must define its integration point with these systems.

A comprehensive gap analysis was performed comparing LearningHub's current capabilities against SOTA agent harness capabilities across 4 reference systems:

| System | Architecture | Orchestration Model |
|--------|-------------|---------------------|
| **DeepSeek Harness (dsh)** | Cordis plugin framework, 50+ capability packages | In-process subagent spawning + ACP server + hooks |
| **Hermes Agent** | AIAgent class + tool registry + plugin system | `delegate_tool` + subagent lifecycle + ACP adapter |
| **AGY CLI** | Google AI agent CLI | `--print` single-shot, `--continue` session, `--sandbox` |
| **OpenCode** | TUI + headless server + web | ACP server, `serve`, session fork/import/export, GitHub bridge |

### Gap Summary

| Capability Category | dsh | Hermes | AGY | OpenCode | LearningHub |
|---------------------|-----|--------|-----|----------|-------------|
| **Subagent spawning** | ✅ `subagent/` (6 providers) | ✅ `delegate_tool` | ❌ | ❌ | ❌ |
| **ACP server** | ✅ `packages/acp/` | ✅ `acop_adapter/` | ❌ | ✅ `opencode acp` | ❌ |
| **ACP client** | ✅ via SDK | ✅ `copilot_acp_client` | ❌ | ✅ | ❌ |
| **Hooks system** | ✅ `hooks-claude-code`, `hooks-codex` | ❌ | ❌ | ❌ | ❌ |
| **Plugin registry** | ✅ Cordis loader | ✅ `tools/registry.py` | ❌ | ❌ | ❌ |
| **Tool search** | ✅ `tool-skill` | ✅ `tool_search.py` | ❌ | ❌ | ❌ |
| **Session fork** | ✅ | ✅ | ✅ `--continue` | ✅ `--fork` | ❌ |
| **Session export/import** | ✅ session-query | ✅ `hermes export` | ❌ | ✅ `export`/`import` | ❌ |
| **Sandboxed execution** | ✅ `e2b/`, `sandbox/` | ✅ `environments/` | ✅ `--sandbox` | ❌ | ❌ |
| **Model provider clients** | ❌ | ✅ 17+ LLMs | ❌ | ❌ | ❌ |
| **Memory system** | ❌ | ✅ hybrid BM25+Chroma | ❌ | ❌ | ❌ |
| **Todo/Plan/Goal tracking** | ✅ `todo/`, `plan/`, `goal/` | ✅ `todo_tool`, `kanban` | ❌ | ❌ | ❌ |
| **Scheduling** | ✅ `schedule/` | ✅ `cron/` | ❌ | ❌ | ❌ |
| **Web search/fetch** | ✅ `web/` | ✅ `web_tools` | ✅ built-in | ✅ built-in | ❌ |
| **Browser control** | ❌ | ✅ `browser_tool` | ❌ | ❌ | ❌ |
| **Computer use** | ❌ | ✅ `computer_use_tool` | ❌ | ❌ | ❌ |
| **GitHub PR workflow** | ❌ | ❌ | ❌ | ✅ `opencode pr` | ❌ |

---

## Decision

Adopt a **layered orchestration architecture** modeled on the SOTA reference systems. The adoption is phased:

### Phase 9: Agent Orchestration Foundation

| # | Capability | Modeled On | Priority |
|---|-----------|------------|----------|
| 1 | **ACP Server** — Agent Client Protocol server (other agents connect TO you) | dsh `packages/acp/`, Hermes `acp_adapter/` | CRITICAL |
| 2 | **Subagent Manager** — spawn, control, steer, stop child agent processes | dsh `subagent/` package | CRITICAL |
| 3 | **Plugin Registry** — runtime capability discovery | Cordis loader, Hermes `tools/registry.py` | HIGH |
| 4 | **Hooks System** — Claude Code + Codex bridge | dsh `hooks/` packages | HIGH |
| 5 | **Server Entry Point** — FastAPI main.py with HTTP + WebSocket | JARVIS `app/main.py` | CRITICAL |
| 6 | **Agent Router** — classify tasks, route to dsh/Hermes/OpenCode subagents | dsh `subagent/` + Hermes delegation | HIGH |

### Phase 10: Advanced Orchestration

| # | Capability | Modeled On | Priority |
|---|-----------|------------|----------|
| 7 | **Session Manager** — fork, resume, export, import | OpenCode sessions | HIGH |
| 8 | **Tool Search/Discovery** — find tools across connected agents | dsh `tool-skill` | MEDIUM |
| 9 | **Sandboxed Execution** — bubblewrap/E2B isolation for child agents | dsh `sandbox/` | MEDIUM |
| 10 | **Todo/Plan/Goal Tracking** — multi-step task decomposition | dsh `todo/`, `plan/`, `goal/` | MEDIUM |
| 11 | **Scheduling** — cron-like task scheduling | Hermes `cron/` | LOW |
| 12 | **Remote Control** — headless server with HTTP API | OpenCode `serve` + AGY `remote-control` | LOW |

### Architecture Reference Pattern

```
┌─────────────────────────────────────────┐
│         LearningHub (orchestrator)       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │  ACP    │  │ Subagent│  │ Plugin  │ │
│  │ Server  │  │ Manager │  │Registry │ │
│  └────┬────┘  └────┬────┘  └────┬────┘ │
│       │             │             │       │
│  ┌────┴─────────────┴─────────────┴────┐ │
│  │         Agent Router / Task          │ │
│  │         Classifier                    │ │
│  └────┬─────────────┬─────────────┬────┘ │
└───────┼─────────────┼─────────────┼──────┘
        │             │             │
   ┌────┴────┐   ┌────┴────┐   ┌────┴────┐
   │  dsh    │   │ Hermes  │   │ OpenCode│
   │  (ACP)  │   │  (ACP)  │   │  (ACP)  │
   └─────────┘   └─────────┘   └─────────┘
```

### Key Principles

1. **ACP-first** — The Agent Client Protocol is the lingua franca for agent-to-agent communication. LearningHub must both serve and consume ACP.
2. **Subagent delegation** — Complex tasks are classified and routed to the most capable subagent (dsh for plugin-heavy work, Hermes for tool-heavy work, OpenCode for GitHub workflows).
3. **No package-level coupling** — LearningHub never imports from dsh/Hermes/OpenCode directly. All integration via ACP JSON-RPC.
4. **Graceful degradation** — If no subagent is available, LearningHub falls back to local execution.
5. **Sandboxed by default** — All child agent execution runs through sandbox (bubblewrap/E2B) behind `@safety_gate`.
6. **Status honesty** — Distinguish existing / planned / possible capabilities. Don't describe planned as existing.

---

## Consequences

### Positive
- LearningHub becomes the **ecosystem orchestrator** — the single agent that coordinates all other agents
- Capability surface matches or exceeds SOTA (dsh + Hermes combined)
- Standardized ACP protocol enables third-party agent integration
- Subagent routing maximizes efficiency (route to best agent per task)

### Negative
- Significant implementation effort (estimated 2 phases / 6-8 weeks)
- ACP protocol still evolving (risk of breaking changes)
- Dependency on external agent availability (dsh/Hermes must be installed)
- Operational complexity (managing multiple agent processes)

### Risks
| Risk | Mitigation |
|------|------------|
| ACP protocol instability | Pin to specific ACP version; abstract behind adapter |
| Subagent unavailable | Fall back to local execution; queue tasks for retry |
| Security (arbitrary code execution) | Mandatory sandbox; `@safety_gate` on all child operations |
| Performance overhead | Lazy loading; connection pooling; timeout enforcement |

---

## Migration Plan

1. **Phase 9** (NOW): ACP server + subagent manager + server entry point + agent router
2. **Phase 10** (LATER): Session manager + tool search + sandbox + todo/plan/goal tracking
3. **Continuous**: Each new capability gets its own ADR entry; this ADR remains the umbrella decision

---

## References

- DeepSeek Harness: `/home/sajan/Projects/deepseek-harness/`
- Hermes Agent: `/home/sajan/Projects/hermes-dev/`
- OpenCode: `/home/sajan/.opencode/bin/opencode`
- AGY CLI: `/home/sajan/.local/bin/agy`
- SOTA comparison session: `@session:default/20260907_000342_aeae0c`
