import { run, RunOptions, RunResult } from "../core/run";
import { PdftotextOptions, PdfInput } from "../types";
import { withTempPdf } from "../utils/input";
import { applyCommonOptions, collectExtraArgs } from "./shared";

export interface PdftotextResult extends RunResult {
  /** Extracted text content from the PDF */
  text: string;
}

/**
 * Extract text from a PDF file.
 * Returns the text content in the result.text property.
 * Optionally writes to a file if outputText is provided.
 */
export async function pdftotext(
  inputPdf: PdfInput,
  outputText?: string,
  options?: PdftotextOptions,
  extraArgs?: string[],
  runOpts?: RunOptions
): Promise<PdftotextResult> {
  return withTempPdf(inputPdf, async (pdfPath) => {
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
    args.push(pdfPath);
    
    // Use "-" to output to stdout, or write to file if specified
    args.push(outputText ?? "-");

    const result = await run("pdftotext", args, runOpts);
    return {
      ...result,
      text: result.stdout,
    };
  });
}
