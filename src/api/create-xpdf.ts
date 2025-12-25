import {
  RunOptions,
  RunResult,
  RunResultSync,
  XpdfConfig,
} from "../types";
import { run, runSync } from "../core/run";
import { getBinDir, resolveBinaryPath } from "../core/resolve";
import { ToolName } from "../core/constants";

export function createXpdf(config: XpdfConfig = {}) {
  const baseRun = config.run ?? {};
  const instanceBinDir = config.binDir ?? baseRun.binDir;

  function mergeRunOptions(runOpts: RunOptions = {}): RunOptions {
    const merged: RunOptions = { ...baseRun, ...runOpts };
    merged.binDir = runOpts.binDir ?? instanceBinDir;
    return merged;
  }

  return {
    run: (
      tool: ToolName,
      args: string[],
      runOpts?: RunOptions
    ): Promise<RunResult> => run(tool, args, mergeRunOptions(runOpts)),
    runSync: (
      tool: ToolName,
      args: string[],
      runOpts?: RunOptions
    ): RunResultSync => runSync(tool, args, mergeRunOptions(runOpts)),
    getBinaryPath: (tool: ToolName): string =>
      resolveBinaryPath(tool, { binDir: instanceBinDir }),
    getBinDir: (): string => instanceBinDir ?? getBinDir(),
  };
}
