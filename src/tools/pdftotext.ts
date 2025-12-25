import { run, RunOptions, RunResult } from "../core/run";
import { PdftotextOptions } from "../types";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdftotext(
  inputPdf: string,
  outputText?: string,
  options?: PdftotextOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  const args: string[] = [];
  applyCommonOptions(args, options);

  if (options?.layout || options?.preserveLayout) {
    args.push("-layout");
  }
  if (options?.rawText) {
    args.push("-raw");
  }
  if (options?.htmlMeta) {
    args.push("-htmlmeta");
  }
  if (options?.encoding) {
    args.push("-enc", options.encoding);
  }
  if (options?.eol) {
    args.push("-eol", options.eol);
  }

  args.push(...collectExtraArgs(options, extraArgs));
  args.push(inputPdf);
  if (outputText) {
    args.push(outputText);
  }

  return run("pdftotext", args, runOpts);
}

