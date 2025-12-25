import { spawn, spawnSync } from "child_process";
import { ToolName } from "./constants";
import { resolveBinaryPath } from "./resolve";
import { RunOptions, RunResult, RunResultSync } from "../types";

// Re-export types for backwards compatibility
export type { RunOptions, RunResult, RunResultSync } from "../types";

export async function run(
  tool: ToolName,
  args: string[],
  options: RunOptions = {}
): Promise<RunResult> {
  const command = resolveBinaryPath(tool, {
    binDir: options.binDir,
    configBinDir: options.configBinDir,
    preferSystem: options.useSystem
  });
  const start = Date.now();
  const stdio = options.stdio ?? "pipe";

  const child = spawn(command, args, {
    cwd: options.cwd,
    env: options.env,
    stdio
  });

  if (options.stdin && child.stdin && stdio === "pipe") {
    child.stdin.write(options.stdin);
    child.stdin.end();
  }

  const stdoutChunks: Buffer[] = [];
  const stderrChunks: Buffer[] = [];
  const encoding = options.encoding ?? "utf8";

  if (stdio === "pipe") {
    child.stdout?.on("data", (chunk) => stdoutChunks.push(Buffer.from(chunk)));
    child.stderr?.on("data", (chunk) => stderrChunks.push(Buffer.from(chunk)));
  }

  let timeout: NodeJS.Timeout | null = null;
  if (options.timeoutMs) {
    timeout = setTimeout(() => {
      child.kill(options.killSignal ?? "SIGTERM");
    }, options.timeoutMs);
  }

  const exitCode = await new Promise<number>((resolve, reject) => {
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? -1));
  }).finally(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  const durationMs = Date.now() - start;
  return {
    exitCode,
    stdout: stdio === "pipe" ? Buffer.concat(stdoutChunks).toString(encoding) : "",
    stderr: stdio === "pipe" ? Buffer.concat(stderrChunks).toString(encoding) : "",
    command,
    args,
    durationMs
  };
}

export function runSync(
  tool: ToolName,
  args: string[],
  options: RunOptions = {}
): RunResultSync {
  const command = resolveBinaryPath(tool, {
    binDir: options.binDir,
    configBinDir: options.configBinDir,
    preferSystem: options.useSystem
  });
  const start = Date.now();
  const stdio = options.stdio ?? "pipe";

  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env,
    stdio,
    input: options.stdin,
    encoding: options.encoding ?? "utf8",
    timeout: options.timeoutMs,
    killSignal: options.killSignal
  });

  const durationMs = Date.now() - start;
  const stdout = result.stdout;
  const stderr = result.stderr;
  return {
    exitCode: result.status ?? -1,
    stdout: typeof stdout === "string" ? stdout : (stdout as Buffer | null)?.toString() ?? "",
    stderr: typeof stderr === "string" ? stderr : (stderr as Buffer | null)?.toString() ?? "",
    command,
    args,
    durationMs
  };
}
