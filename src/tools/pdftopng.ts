import { run, RunOptions, RunResult } from "../core/run";
import { PdftopngOptions, PdfInput } from "../types";
import { withTempPdf } from "../utils/input";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export async function pdftopng(
  inputPdf: PdfInput,
  outputRoot?: string,
  options?: PdftopngOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<RunResult> {
  return withTempPdf(inputPdf, async (pdfPath) => {
    const args: string[] = [];
    applyCommonOptions(args, options);

    if (options?.resolution) {
      args.push("-r", String(options.resolution));
    }
    if (options?.scaleToX) {
      args.push("-scale-to-x", String(options.scaleToX));
    }
    if (options?.scaleToY) {
      args.push("-scale-to-y", String(options.scaleToY));
    }
    if (options?.gray) {
      args.push("-gray");
    }
    if (options?.mono) {
      args.push("-mono");
    }
    if (typeof options?.cropX === "number") {
      args.push("-x", String(options.cropX));
    }
    if (typeof options?.cropY === "number") {
      args.push("-y", String(options.cropY));
    }
    if (typeof options?.cropWidth === "number") {
      args.push("-W", String(options.cropWidth));
    }
    if (typeof options?.cropHeight === "number") {
      args.push("-H", String(options.cropHeight));
    }
    if (options?.transparent) {
      args.push("-transparent");
    }

    args.push(...collectExtraArgs(options, extraArgs));
    args.push(pdfPath);
    if (outputRoot) {
      args.push(outputRoot);
    }

    return run("pdftopng", args, runOpts);
  });
}
