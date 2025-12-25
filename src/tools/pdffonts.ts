import { run, RunOptions, RunResult } from "../core/run";
import { PdffontsOptions, PdfInput } from "../types";
import { withTempPdf } from "../utils/input";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdffonts(
  inputPdf: PdfInput,
  options?: PdffontsOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  return withTempPdf(inputPdf, async (pdfPath) => {
    const args: string[] = [];
    applyCommonOptions(args, options);

    if (options?.subst) {
      args.push("-subst");
    }

    args.push(...collectExtraArgs(options, extraArgs));
    args.push(pdfPath);

    return run("pdffonts", args, runOpts);
  });
}
