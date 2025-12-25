import {
  RunOptions,
  RunResult,
  XpdfConfig,
  OneOrMany,
  PdfFontRow,
  PdfDetachEntry,
  PdfDetachResult,
  PdfFontsResult,
  PdfInfoResult,
  PdfToTextOptions,
  PdfToPsOptions,
  PdfToPpmOptions,
  PdfToPngOptions,
  PdfToHtmlOptions,
  PdfImagesClassOptions,
  PdfdetachOptions,
  PdffontsOptions,
  PdfinfoOptions,
  PdfimagesOptions,
  BatchMethod,
  BatchOptions,
  BatchResult,
  PdfInput,
  PdfInputOneOrMany,
} from "../types";
import {
  normalizePdfInputs,
} from "../utils/input";
import { pdfdetach } from "../tools/pdfdetach";
import { pdffonts } from "../tools/pdffonts";
import { pdfinfo } from "../tools/pdfinfo";
import { pdfimages } from "../tools/pdfimages";
import { pdftotext, PdftotextResult } from "../tools/pdftotext";
import { pdftops } from "../tools/pdftops";
import { pdftoppm } from "../tools/pdftoppm";
import { pdftopng } from "../tools/pdftopng";
import { pdftohtml } from "../tools/pdftohtml";

function selectByIndex(
  value: string | string[] | undefined,
  index: number
): string | undefined {
  if (Array.isArray(value)) {
    return value[index];
  }
  return value;
}

function parsePdfFontsOutput(stdout: string): PdfFontRow[] {
  const lines = stdout.split(/\r?\n/).map((line) => line.trim());
  const rows: PdfFontRow[] = [];
  let dataStarted = false;

  for (const line of lines) {
    if (!line) {
      continue;
    }
    if (!dataStarted) {
      if (line.toLowerCase().startsWith("name")) {
        dataStarted = true;
      }
      continue;
    }
    if (/^-+$/.test(line.replace(/\s+/g, ""))) {
      continue;
    }
    const parts = line.split(/\s{2,}/);
    if (!parts.length) {
      continue;
    }
    const [name, type, encoding, emb, sub, uni, ...rest] = parts;
    rows.push({
      name,
      type,
      encoding,
      emb,
      sub,
      uni,
      objectId: rest.length ? rest.join(" ") : undefined,
    });
  }

  return rows;
}

function parsePdfDetachOutput(stdout: string): PdfDetachEntry[] {
  const entries: PdfDetachEntry[] = [];
  const lines = stdout.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*\d+:\s+(.+?)(?:\s+\((\d+)\s+bytes\))?\s*$/i);
    if (!match) {
      continue;
    }
    const name = match[1];
    const size = match[2] ? Number(match[2]) : undefined;
    entries.push({ name, size });
  }
  return entries;
}

function parsePdfInfoOutput(stdout: string): Record<string, string> {
  const info: Record<string, string> = {};
  const lines = stdout.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) {
      continue;
    }
    const key = match[1].trim();
    const value = match[2].trim();
    if (key) {
      info[key] = value;
    }
  }
  return info;
}

async function mapPdfInputs<T>(
  inputs: PdfInput[],
  fn: (pdf: PdfInput, index: number) => Promise<T>
): Promise<OneOrMany<T>> {
  const results = await Promise.all(
    inputs.map((input, index) => fn(input, index))
  );
  return inputs.length === 1 ? results[0] : results;
}

/**
 * Xpdf class for executing xpdf tools with a configured environment.
 * PDFs are passed to each method instead of the constructor.
 */
export class Xpdf {
  private readonly config: XpdfConfig;
  private readonly defaultRun: RunOptions;

  constructor(config: XpdfConfig = {}) {
    this.config = config;
    this.defaultRun = config.run ?? {};
  }

  private mergeRunOptions(runOpts?: RunOptions): RunOptions {
    const merged: RunOptions = { ...this.defaultRun, ...runOpts };
    // Use explicit binDir from runOpts, or fall back to config binDir
    merged.binDir = runOpts?.binDir ?? this.config.binDir ?? this.defaultRun.binDir;
    return merged;
  }

  private normalizePdfs(pdf: PdfInputOneOrMany): PdfInput[] {
    return normalizePdfInputs(pdf);
  }

  /**
   * List or extract embedded files from PDF(s)
   */
  async pdfDetach(
    pdf: PdfInputOneOrMany,
    options: PdfdetachOptions = {},
    runOpts?: RunOptions
  ): Promise<OneOrMany<PdfDetachResult>> {
    const pdfs = this.normalizePdfs(pdf);
    const mergedRun = this.mergeRunOptions(runOpts);
    const shouldList =
      typeof options.list === "boolean"
        ? options.list
        : !options.saveAll && !options.save;

    return mapPdfInputs(pdfs, async (pdfPath) => {
      const result = await pdfdetach(
        pdfPath,
        { ...options, list: shouldList },
        undefined,
        mergedRun
      );
      const entries = shouldList
        ? parsePdfDetachOutput(result.stdout)
        : undefined;
      return { result, entries };
    });
  }

  /**
   * List fonts used in PDF(s)
   */
  async pdfFonts(
    pdf: PdfInputOneOrMany,
    options: PdffontsOptions = {},
    runOpts?: RunOptions
  ): Promise<OneOrMany<PdfFontsResult>> {
    const pdfs = this.normalizePdfs(pdf);
    const mergedRun = this.mergeRunOptions(runOpts);
    return mapPdfInputs(pdfs, async (pdfPath) => {
      const result = await pdffonts(pdfPath, options, undefined, mergedRun);
      return { result, fonts: parsePdfFontsOutput(result.stdout) };
    });
  }

  /**
   * Get PDF metadata/info
   */
  async pdfInfo(
    pdf: PdfInputOneOrMany,
    options: PdfinfoOptions = {},
    runOpts?: RunOptions
  ): Promise<OneOrMany<PdfInfoResult>> {
    const pdfs = this.normalizePdfs(pdf);
    const mergedRun = this.mergeRunOptions(runOpts);
    return mapPdfInputs(pdfs, async (pdfPath) => {
      const result = await pdfinfo(pdfPath, options, undefined, mergedRun);
      return { result, info: parsePdfInfoOutput(result.stdout) };
    });
  }

  /**
   * Extract images from PDF(s)
   */
  async pdfImages(
    pdf: PdfInputOneOrMany,
    options: PdfImagesClassOptions = {},
    runOpts?: RunOptions
  ): Promise<OneOrMany<RunResult>> {
    const pdfs = this.normalizePdfs(pdf);
    const mergedRun = this.mergeRunOptions(runOpts);
    return mapPdfInputs(pdfs, async (pdfPath, index) => {
      const outputRoot = selectByIndex(options.outputRoot, index);
      const mergedOptions: PdfimagesOptions = {
        ...options,
        list: typeof options.list === "boolean" ? options.list : true,
        outputRoot,
      };
      return pdfimages(pdfPath, mergedOptions, undefined, mergedRun);
    });
  }

  /**
   * Extract text from PDF(s)
   */
  async pdfToText(
    pdf: PdfInputOneOrMany,
    options: PdfToTextOptions = {},
    runOpts?: RunOptions
  ): Promise<OneOrMany<PdftotextResult>> {
    const pdfs = this.normalizePdfs(pdf);
    const mergedRun = this.mergeRunOptions(runOpts);
    return mapPdfInputs(pdfs, async (pdfPath, index) => {
      const outputText = selectByIndex(options.outputText, index);
      return pdftotext(pdfPath, outputText, options, undefined, mergedRun);
    });
  }

  /**
   * Convert PDF to PostScript
   */
  async pdfToPs(
    pdf: PdfInputOneOrMany,
    options: PdfToPsOptions = {},
    runOpts?: RunOptions
  ): Promise<OneOrMany<RunResult>> {
    const pdfs = this.normalizePdfs(pdf);
    const mergedRun = this.mergeRunOptions(runOpts);
    return mapPdfInputs(pdfs, async (pdfPath, index) => {
      const outputPs = selectByIndex(options.outputPs, index);
      return pdftops(pdfPath, outputPs, options, undefined, mergedRun);
    });
  }

  /**
   * Convert PDF to PPM images
   */
  async pdfToPpm(
    pdf: PdfInputOneOrMany,
    options: PdfToPpmOptions = {},
    runOpts?: RunOptions
  ): Promise<OneOrMany<RunResult>> {
    const pdfs = this.normalizePdfs(pdf);
    const mergedRun = this.mergeRunOptions(runOpts);
    return mapPdfInputs(pdfs, async (pdfPath, index) => {
      const outputRoot = selectByIndex(options.outputRoot, index);
      return pdftoppm(pdfPath, outputRoot, options, undefined, mergedRun);
    });
  }

  /**
   * Convert PDF to PNG images
   */
  async pdfToPng(
    pdf: PdfInputOneOrMany,
    options: PdfToPngOptions = {},
    runOpts?: RunOptions
  ): Promise<OneOrMany<RunResult>> {
    const pdfs = this.normalizePdfs(pdf);
    const mergedRun = this.mergeRunOptions(runOpts);
    return mapPdfInputs(pdfs, async (pdfPath, index) => {
      const outputRoot = selectByIndex(options.outputRoot, index);
      return pdftopng(pdfPath, outputRoot, options, undefined, mergedRun);
    });
  }

  /**
   * Convert PDF to HTML
   */
  async pdfToHtml(
    pdf: PdfInputOneOrMany,
    options: PdfToHtmlOptions = {},
    runOpts?: RunOptions
  ): Promise<OneOrMany<RunResult>> {
    const pdfs = this.normalizePdfs(pdf);
    const mergedRun = this.mergeRunOptions(runOpts);
    return mapPdfInputs(pdfs, async (pdfPath, index) => {
      const outputPath = selectByIndex(options.outputPath, index);
      return pdftohtml(pdfPath, outputPath, options, undefined, mergedRun);
    });
  }

  /**
   * Run multiple methods at once on the same PDF(s)
   */
  async batch(
    pdf: PdfInputOneOrMany,
    methods: BatchMethod[],
    options: BatchOptions = {},
    runOpts?: RunOptions
  ): Promise<BatchResult> {
    const result: BatchResult = {};

    const operations = methods.map(async (method) => {
      switch (method) {
        case "pdfInfo":
          result.pdfInfo = await this.pdfInfo(pdf, options.pdfInfo, runOpts);
          break;
        case "pdfFonts":
          result.pdfFonts = await this.pdfFonts(pdf, options.pdfFonts, runOpts);
          break;
        case "pdfDetach":
          result.pdfDetach = await this.pdfDetach(pdf, options.pdfDetach, runOpts);
          break;
        case "pdfImages":
          result.pdfImages = await this.pdfImages(pdf, options.pdfImages, runOpts);
          break;
        case "pdfToText":
          result.pdfToText = await this.pdfToText(pdf, options.pdfToText, runOpts);
          break;
        case "pdfToPs":
          result.pdfToPs = await this.pdfToPs(pdf, options.pdfToPs, runOpts);
          break;
        case "pdfToPpm":
          result.pdfToPpm = await this.pdfToPpm(pdf, options.pdfToPpm, runOpts);
          break;
        case "pdfToPng":
          result.pdfToPng = await this.pdfToPng(pdf, options.pdfToPng, runOpts);
          break;
        case "pdfToHtml":
          result.pdfToHtml = await this.pdfToHtml(pdf, options.pdfToHtml, runOpts);
          break;
      }
    });

    await Promise.all(operations);
    return result;
  }
}
