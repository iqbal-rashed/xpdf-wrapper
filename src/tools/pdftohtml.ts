import { run, RunOptions, RunResult } from "../core/run";
import { PdftohtmlOptions, PdfInput } from "../types";
import { withTempPdf } from "../utils/input";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdftohtml(
  inputPdf: PdfInput,
  outputPath?: string,
  options?: PdftohtmlOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  return withTempPdf(inputPdf, async (pdfPath) => {
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
    args.push(pdfPath);
    if (outputPath) {
      args.push(outputPath);
    }

    return run("pdftohtml", args, runOpts);
  });
}
