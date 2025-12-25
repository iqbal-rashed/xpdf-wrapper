import { run, RunOptions, RunResult } from "../core/run";
import { PdfinfoOptions, PdfInput } from "../types";
import { withTempPdf } from "../utils/input";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdfinfo(
  inputPdf: PdfInput,
  options?: PdfinfoOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  return withTempPdf(inputPdf, async (pdfPath) => {
    const args: string[] = [];
    applyCommonOptions(args, options);

    if (options?.rawDates) {
      args.push("-rawdates");
    }

    args.push(...collectExtraArgs(options, extraArgs));
    args.push(pdfPath);

    return run("pdfinfo", args, runOpts);
  });
}
