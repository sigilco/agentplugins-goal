/**
 * goal-checker.js — stop hook for agentplugins-goal
 *
 * Reads ~/.agentplugins/goal-state.json. If a goal is active and under the
 * iteration limit, emits a JSON continueWith message so the agent loops.
 * No output = session ends normally.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const STATE_DIR = join(homedir(), '.agentplugins');
const STATE_FILE = join(STATE_DIR, 'goal-state.json');

try {
  if (!existsSync(STATE_FILE)) process.exit(0);

  const state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  if (!state.active || !state.goal) process.exit(0);

  const iteration = (state.iterations ?? 0) + 1;
  const maxIterations = state.maxIterations ?? 20;

  if (iteration > maxIterations) {
    process.stderr.write(
      `[goal] Safety limit reached (${maxIterations} iterations). Stopping loop.\n`
    );
    process.exit(0);
  }

  mkdirSync(STATE_DIR, { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify({ ...state, iterations: iteration }, null, 2));

  process.stdout.write(
    JSON.stringify({
      continueWith: `Continue working toward the goal: "${state.goal}". Review your progress, identify the next concrete step, and execute it. When the goal is fully achieved, run /goal-stop to end the loop. (Iteration ${iteration}/${maxIterations})`,
    })
  );
} catch {
  process.exit(0);
}
