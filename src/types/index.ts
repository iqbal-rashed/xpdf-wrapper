/**
 * Core types for running xpdf tools
 */

export interface RunOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  stdin?: string | Buffer;
  timeoutMs?: number;
  killSignal?: NodeJS.Signals | number;
  stdio?: "pipe" | "inherit" | "ignore";
  encoding?: BufferEncoding;
  binDir?: string;
  useSystem?: boolean;
  configBinDir?: string;
}

export interface RunResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  command: string;
  args: string[];
  durationMs: number;
}

export interface RunResultSync {
  exitCode: number;
  stdout: string;
  stderr: string;
  command: string;
  args: string[];
  durationMs: number;
}

/**
 * Common options shared by all xpdf tools
 */
export type CommonOptions = {
  firstPage?: number;
  lastPage?: number;
  userPassword?: string;
  ownerPassword?: string;
  quiet?: boolean;
  extraArgs?: string[];
  rawArgs?: string[];
  [key: string]: unknown;
};

/**
 * Tool-specific options
 */
export type PdftotextOptions = CommonOptions & {
  layout?: boolean;
  rawText?: boolean;
  htmlMeta?: boolean;
  preserveLayout?: boolean;
  encoding?: string;
  eol?: "unix" | "dos" | "mac";
};

export type PdftopsOptions = CommonOptions & {
  level1?: boolean;
  level2?: boolean;
  level3?: boolean;
  eps?: boolean;
  paperSize?: string;
};

export type PdftoppmOptions = CommonOptions & {
  resolution?: number;
  scaleToX?: number;
  scaleToY?: number;
  gray?: boolean;
  mono?: boolean;
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
};

export type PdftopngOptions = PdftoppmOptions & {
  transparent?: boolean;
};

export type PdftohtmlOptions = CommonOptions & {
  zoom?: number;
  xml?: boolean;
  noframes?: boolean;
  meta?: boolean;
};

export type PdfinfoOptions = CommonOptions & {
  rawDates?: boolean;
};

export type PdfimagesOptions = CommonOptions & {
  list?: boolean;
  raw?: boolean;
  png?: boolean;
  tiff?: boolean;
  j?: boolean;
  all?: boolean;
  outputRoot?: string;
};

export type PdffontsOptions = CommonOptions & {
  subst?: boolean;
};

export type PdfdetachOptions = CommonOptions & {
  list?: boolean;
  saveAll?: boolean;
  save?: string;
  extractPath?: string;
};

/**
 * Xpdf class types
 */
export type XpdfConfig = {
  binDir?: string;
  useSystem?: boolean;
  run?: RunOptions;
};

export type OneOrMany<T> = T | T[];

export type PdfFontRow = {
  name: string;
  type?: string;
  encoding?: string;
  emb?: string;
  sub?: string;
  uni?: string;
  objectId?: string;
};

export type PdfDetachEntry = {
  name: string;
  size?: number;
};

export interface PdfDetachResult {
  result: RunResult;
  entries?: PdfDetachEntry[];
}

export interface PdfFontsResult {
  result: RunResult;
  fonts: PdfFontRow[];
}

export interface PdfInfoResult {
  result: RunResult;
  info: Record<string, string>;
}

export type PdfToTextOptions = PdftotextOptions & {
  outputText?: string | string[];
};

export type PdfToPsOptions = PdftopsOptions & {
  outputPs?: string | string[];
};

export type PdfToPpmOptions = PdftoppmOptions & {
  outputRoot?: string | string[];
};

export type PdfToPngOptions = PdftopngOptions & {
  outputRoot?: string | string[];
};

export type PdfToHtmlOptions = PdftohtmlOptions & {
  outputPath?: string | string[];
};

export type PdfImagesClassOptions = PdfimagesOptions & {
  outputRoot?: string | string[];
};

/**
 * Batch operation types
 */
export type BatchMethod = 
  | "pdfInfo"
  | "pdfFonts"
  | "pdfDetach"
  | "pdfImages"
  | "pdfToText"
  | "pdfToPs"
  | "pdfToPpm"
  | "pdfToPng"
  | "pdfToHtml";

export interface BatchOptions {
  pdfInfo?: PdfinfoOptions;
  pdfFonts?: PdffontsOptions;
  pdfDetach?: PdfdetachOptions;
  pdfImages?: PdfImagesClassOptions;
  pdfToText?: PdfToTextOptions;
  pdfToPs?: PdfToPsOptions;
  pdfToPpm?: PdfToPpmOptions;
  pdfToPng?: PdfToPngOptions;
  pdfToHtml?: PdfToHtmlOptions;
}

export interface BatchResult {
  pdfInfo?: OneOrMany<PdfInfoResult>;
  pdfFonts?: OneOrMany<PdfFontsResult>;
  pdfDetach?: OneOrMany<PdfDetachResult>;
  pdfImages?: OneOrMany<RunResult>;
  pdfToText?: OneOrMany<RunResult>;
  pdfToPs?: OneOrMany<RunResult>;
  pdfToPpm?: OneOrMany<RunResult>;
  pdfToPng?: OneOrMany<RunResult>;
  pdfToHtml?: OneOrMany<RunResult>;
}
