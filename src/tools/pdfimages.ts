import { run, RunOptions, RunResult } from "../core/run";
import { PdfimagesOptions, PdfInput } from "../types";
import { withTempPdf } from "../utils/input";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdfimages(
  inputPdf: PdfInput,
  options?: PdfimagesOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  return withTempPdf(inputPdf, async (pdfPath) => {
    const args: string[] = [];
    applyCommonOptions(args, options);

    if (options?.list) {
      args.push("-list");
    }
    if (options?.raw) {
      args.push("-raw");
    }
    if (options?.png) {
      args.push("-png");
    }
    if (options?.tiff) {
      args.push("-tiff");
    }
    if (options?.j) {
      args.push("-j");
    }
    if (options?.all) {
      args.push("-all");
    }

    args.push(...collectExtraArgs(options, extraArgs));
    args.push(pdfPath);
    if (options?.outputRoot) {
      args.push(options.outputRoot);
    }

    return run("pdfimages", args, runOpts);
  });
}
