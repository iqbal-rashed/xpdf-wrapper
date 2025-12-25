import { run, RunOptions, RunResult } from "../core/run";
import { PdfdetachOptions } from "../types";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdfdetach(
  inputPdf: string,
  options?: PdfdetachOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  const args: string[] = [];
  applyCommonOptions(args, options);

  if (options?.list) {
    args.push("-list");
  }
  if (options?.saveAll) {
    args.push("-saveall");
  }
  if (options?.save) {
    args.push("-save", options.save);
  }
  if (options?.extractPath) {
    args.push("-o", options.extractPath);
  }

  args.push(...collectExtraArgs(options, extraArgs));
  args.push(inputPdf);

  return run("pdfdetach", args, runOpts);
}

