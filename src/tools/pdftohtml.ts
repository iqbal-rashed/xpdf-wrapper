import { run, RunOptions, RunResult } from "../core/run";
import { PdftohtmlOptions } from "../types";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdftohtml(
  inputPdf: string,
  outputPath?: string,
  options?: PdftohtmlOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  const args: string[] = [];
  applyCommonOptions(args, options);

  if (options?.zoom) {
    args.push("-zoom", String(options.zoom));
  }
  if (options?.xml) {
    args.push("-xml");
  }
  if (options?.noframes) {
    args.push("-noframes");
  }
  if (options?.meta) {
    args.push("-meta");
  }

  args.push(...collectExtraArgs(options, extraArgs));
  args.push(inputPdf);
  if (outputPath) {
    args.push(outputPath);
  }

  return run("pdftohtml", args, runOpts);
}

