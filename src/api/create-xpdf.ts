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
  const instanceUseSystem = config.useSystem ?? baseRun.useSystem;

  function mergeRunOptions(runOpts: RunOptions = {}): RunOptions {
    const merged: RunOptions = { ...baseRun, ...runOpts };
    if (runOpts.binDir) {
      merged.binDir = runOpts.binDir;
      merged.configBinDir = undefined;
    } else {
      merged.binDir = undefined;
      merged.configBinDir = instanceBinDir;
    }
    merged.useSystem = runOpts.useSystem ?? instanceUseSystem;
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
      resolveBinaryPath(tool, {
        configBinDir: instanceBinDir,
        preferSystem: instanceUseSystem,
      }),
    getBinDir: (): string => instanceBinDir ?? getBinDir(),
  };
}
