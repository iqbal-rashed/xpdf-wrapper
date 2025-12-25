// Core functions
export {
  getBinDir,
  getBinaryPath,
  resolveBinaryPath,
  listTools,
  run,
  runSync,
  TOOL_NAMES
} from "./core/index";

export type { ToolName } from "./core/index";

// Tool wrappers
export {
  pdftotext,
  pdftops,
  pdftoppm,
  pdftopng,
  pdftohtml,
  pdfinfo,
  pdfimages,
  pdffonts,
  pdfdetach
} from "./tools/index";

export type { PdftotextResult } from "./tools/index";

export { PACKAGE_ROOT ,DEFAULT_BIN_DIR} from "./utils/paths";

// Class API
export { Xpdf, createXpdf } from "./api/index";

// All types from centralized location
export type {
  // Core types
  RunOptions,
  RunResult,
  RunResultSync,
  
  // Common options
  CommonOptions,
  
  // Tool-specific options
  PdftotextOptions,
  PdftopsOptions,
  PdftoppmOptions,
  PdftopngOptions,
  PdftohtmlOptions,
  PdfinfoOptions,
  PdfimagesOptions,
  PdffontsOptions,
  PdfdetachOptions,
  
  // Xpdf class types
  XpdfConfig,
  OneOrMany,
  PdfFontRow,
  PdfFontsResult,
  PdfDetachEntry,
  PdfDetachResult,
  PdfInfoResult,
  PdfToTextOptions,
  PdfToPsOptions,
  PdfToPpmOptions,
  PdfToPngOptions,
  PdfToHtmlOptions,
  PdfImagesClassOptions,
  
  // Batch types
  BatchMethod,
  BatchOptions,
  BatchResult,
  
  // Input types
  PdfInput,
  PdfInputOneOrMany,
} from "./types/index";
