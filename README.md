# agentplugins-goal

Autonomous goal-completion loop for AI agents. Set a goal once; the agent runs uninterrupted until done — on every tier-1 harness (Claude Code, Codex, OpenCode, Pi Mono).

## Install

```bash
agentplugins add sigilco/agentplugins-goal
```

## How it works

The `stop` hook is the engine. When an agent session ends, `hooks/goal-checker.js` reads `~/.agentplugins/goal-state.json`. If a goal is active and under the iteration limit, it returns `{ continueWith: "..." }` to re-enter the agent automatically.

## Commands

| Command | Description |
|---|---|
| `/goal <description>` | Set a goal and start the autonomous loop |
| `/goal-stop` | Mark the goal complete and stop the loop |
| `/goal-status` | Show goal, iteration count, and limit |

## State file

`~/.agentplugins/goal-state.json` tracks the active goal:

```json
{
  "active": true,
  "goal": "refactor the auth module",
  "iterations": 3,
  "maxIterations": 20,
  "startedAt": "2026-06-25T18:00:00.000Z"
}
```

## License

MIT
