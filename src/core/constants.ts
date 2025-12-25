export const TOOL_NAMES = [
  "pdftotext",
  "pdftops",
  "pdftoppm",
  "pdftopng",
  "pdftohtml",
  "pdfinfo",
  "pdfimages",
  "pdffonts",
  "pdfdetach"
] as const;

export type ToolName = (typeof TOOL_NAMES)[number];
