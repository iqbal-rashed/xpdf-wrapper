import { run, RunOptions, RunResult } from "../core/run";
import { PdftopsOptions } from "../types";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdftops(
  inputPdf: string,
  outputPs?: string,
  options?: PdftopsOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  const args: string[] = [];
  applyCommonOptions(args, options);

  if (options?.level1) {
    args.push("-level1");
  }
  if (options?.level2) {
    args.push("-level2");
  }
  if (options?.level3) {
    args.push("-level3");
  }
  if (options?.eps) {
    args.push("-eps");
  }
  if (options?.paperSize) {
    args.push("-paper", options.paperSize);
  }

  args.push(...collectExtraArgs(options, extraArgs));
  args.push(inputPdf);
  if (outputPs) {
    args.push(outputPs);
  }

  return run("pdftops", args, runOpts);
}

