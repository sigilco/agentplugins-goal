---
name: goal
description: Autonomous goal-completion loop. Set a goal once; the agent runs uninterrupted iterations until it marks the goal done or the safety limit is reached. Works identically on Claude Code, Codex, OpenCode, and Pi.
---

# Goal

Use this skill when the user wants the agent to work autonomously toward a clearly defined objective without manual re-prompting.

## How it works

1. `/goal <description>` — sets the goal and activates the loop.
2. The agent works each session. On every stop, the `goal-checker` hook fires.
3. If the goal is still active, the hook emits a `continueWith` message that re-enters the agent automatically.
4. When the agent judges the goal achieved, it runs `/goal-stop` to deactivate the loop.
5. Safety limit: 20 iterations by default (stored in `~/.agentplugins/goal-state.json` as `maxIterations`).

## Commands

```text
/goal <description>       — start autonomous loop with this goal
/goal-stop                — mark goal complete and end the loop
/goal-status              — show current goal, iteration count, and limit
```

## When to use

- Long tasks the agent can break into steps without supervision
- Refactoring, migration, or multi-file generation that requires many passes
- Research → draft → refine loops

## When NOT to use

- Goals that require human approval at each step — use manual prompting instead
- Goals that are inherently open-ended with no clear completion criterion — the loop will run to the safety limit

## Response style when guiding the user

- Confirm the goal concisely
- State the iteration limit
- Begin executing immediately — do not ask for confirmation unless the goal is ambiguous
