import { run, RunOptions, RunResult } from "../core/run";
import { PdfinfoOptions } from "../types";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdfinfo(
  inputPdf: string,
  options?: PdfinfoOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  const args: string[] = [];
  applyCommonOptions(args, options);

  if (options?.rawDates) {
    args.push("-rawdates");
  }

  args.push(...collectExtraArgs(options, extraArgs));
  args.push(inputPdf);

  return run("pdfinfo", args, runOpts);
}

