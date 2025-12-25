import { run, RunOptions, RunResult } from "../core/run";
import { PdfdetachOptions, PdfInput } from "../types";
import { withTempPdf } from "../utils/input";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdfdetach(
  inputPdf: PdfInput,
  options?: PdfdetachOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  return withTempPdf(inputPdf, async (pdfPath) => {
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
    args.push(pdfPath);

    return run("pdfdetach", args, runOpts);
  });
}
