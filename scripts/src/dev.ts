import { spawn, type ChildProcess } from "node:child_process";

const children: ChildProcess[] = [];
let shuttingDown = false;

function start(name: string, command: string, env: NodeJS.ProcessEnv) {
  const child = spawn(command, {
    shell: true,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });

  children.push(child);

  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    for (const other of children) {
      if (other !== child && !other.killed) other.kill("SIGTERM");
    }
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 1);
  });

  child.on("error", (error) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.error(`${name} failed to start`, error);
    for (const other of children) {
      if (other !== child && !other.killed) other.kill("SIGTERM");
    }
    process.exit(1);
  });
}

function shutdown(signal: NodeJS.Signals) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill(signal);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start("api", "pnpm --filter @workspace/api-server run dev", { PORT: "8080" });
start("web", "pnpm --filter @workspace/kampus run dev", {
  PORT: process.env.PORT || "5173",
  BASE_PATH: process.env.BASE_PATH || "/",
});