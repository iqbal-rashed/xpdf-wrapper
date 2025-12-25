import { run, RunOptions, RunResult } from "../core/run";
import { PdffontsOptions } from "../types";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdffonts(
  inputPdf: string,
  options?: PdffontsOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  const args: string[] = [];
  applyCommonOptions(args, options);

  if (options?.subst) {
    args.push("-subst");
  }

  args.push(...collectExtraArgs(options, extraArgs));
  args.push(inputPdf);

  return run("pdffonts", args, runOpts);
}

