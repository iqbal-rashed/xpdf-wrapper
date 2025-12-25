import { randomUUID } from "crypto";
import { writeFile, unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

/**
 * Type representing a PDF input - either a file path or a Buffer
 */
export type PdfInput = string | Buffer;

/**
 * Type for accepting one or many PDF inputs
 */
export type PdfInputOneOrMany = PdfInput | PdfInput[];

/**
 * Resolved PDF input with cleanup function
 */
interface ResolvedPdfInput {
  path: string;
  cleanup: () => Promise<void>;
}

/**
 * Resolves a PDF input to a file path.
 * If the input is a Buffer, writes it to a temp file.
 * Returns the path and a cleanup function.
 */
export async function resolvePdfInput(input: PdfInput): Promise<ResolvedPdfInput> {
  if (typeof input === "string") {
    // File path - no cleanup needed
    return {
      path: input,
      cleanup: async () => {},
    };
  }

  // Buffer - write to temp file
  const tempPath = join(tmpdir(), `xpdf-${randomUUID()}.pdf`);
  await writeFile(tempPath, input);

  return {
    path: tempPath,
    cleanup: async () => {
      try {
        await unlink(tempPath);
      } catch {
        // Ignore cleanup errors
      }
    },
  };
}

/**
 * Helper that resolves input, executes a function, and cleans up.
 */
export async function withTempPdf<T>(
  input: PdfInput,
  fn: (path: string) => Promise<T>
): Promise<T> {
  const resolved = await resolvePdfInput(input);
  try {
    return await fn(resolved.path);
  } finally {
    await resolved.cleanup();
  }
}

/**
 * Normalizes one or many PDF inputs to an array
 */
export function normalizePdfInputs(inputs: PdfInputOneOrMany): PdfInput[] {
  return Array.isArray(inputs) ? inputs : [inputs];
}
