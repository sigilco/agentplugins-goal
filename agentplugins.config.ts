import { definePlugin } from '@agentplugins/core';

export default definePlugin({
  name: 'goal',
  version: '1.0.0',
  description:
    'Autonomous goal-completion loop for AI agents. Set a goal once; the agent runs uninterrupted until done — on every tier-1 harness.',
  displayName: 'Goal',
  author: { name: 'Joaquin Terrasa', url: 'https://github.com/espetro' },
  homepage: 'https://github.com/espetro/agentplugins-goal',
  repository: 'https://github.com/espetro/agentplugins-goal',
  license: 'MIT',
  keywords: ['goal', 'autonomous', 'loop', 'continueWith'],

  // ─── Skills ──────────────────────────────────────────────────────────────────
  skills: [
    {
      name: 'goal',
      description:
        'Autonomous goal-completion loop. Set a goal once; the agent runs uninterrupted iterations until it marks the goal done or the safety limit is reached.',
      filePath: 'skills/goal/SKILL.md',
    },
  ],

  // ─── Hooks ───────────────────────────────────────────────────────────────────
  // The stop hook is the engine of the loop.
  // goal-checker.js reads ~/.agentplugins/goal-state.json; if active and under
  // the iteration limit, returns { continueWith: "..." } to re-enter the agent.
  // All four tier-1 harnesses honour continueWith on stop hook output.
  hooks: {
    stop: {
      handler: {
        type: 'command',
        command: 'node "${CLAUDE_PLUGIN_ROOT}/hooks/goal-checker.js"',
        statusMessage: 'Checking goal state...',
      },
    },
  },

  // ─── Commands ────────────────────────────────────────────────────────────────
  commands: [
    {
      name: 'goal',
      description: 'Set an autonomous goal and start the completion loop',
      prompt: `You are now in goal-completion mode. Your goal is: {{args}}.

First, create (or overwrite) the file \`~/.agentplugins/goal-state.json\` with the following content:
\`\`\`json
{"active":true,"goal":"{{args}}","iterations":0,"maxIterations":20,"startedAt":"<ISO timestamp>"}
\`\`\`
Replace <ISO timestamp> with the current time.

Then immediately start working on the goal. Break it into clear steps and execute the first step now. Each time a session ends, the goal-checker hook will automatically re-enter you until the goal is complete. When you judge the goal fully achieved, run /goal-stop.`,
      argumentHint: '<goal description>',
    },
    {
      name: 'goal-stop',
      description: 'Mark the current goal complete and stop the autonomous loop',
      prompt: `The current goal is complete. Write \`{"active":false}\` to \`~/.agentplugins/goal-state.json\` to deactivate the loop. Then provide a concise summary: what the goal was, what was accomplished, and the final state.`,
    },
    {
      name: 'goal-status',
      description: 'Show the current goal, iteration count, and limit',
      prompt: `Read \`~/.agentplugins/goal-state.json\`. If the file does not exist or \`active\` is false, report "No goal is currently running." If active, report: the goal description, current iteration count, iteration limit, and when it started. Do not change anything.`,
    },
  ],
});
