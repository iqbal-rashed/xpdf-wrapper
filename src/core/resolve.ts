import fs from "fs";
import path from "path";
import { TOOL_NAMES, ToolName } from "./constants";
import { DEFAULT_BIN_DIR } from "../utils/paths";

export interface ResolveOptions {
  binDir?: string;
}

function getExecutableName(tool: ToolName): string {
  return process.platform === "win32" ? `${tool}.exe` : tool;
}

function isExecutable(filePath: string): boolean {
  try {
    if (process.platform === "win32") {
      return fs.existsSync(filePath);
    }
    fs.accessSync(filePath, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

function resolveFromBinDir(binDir: string, tool: ToolName): string | null {
  const candidate = path.join(binDir, getExecutableName(tool));
  return isExecutable(candidate) ? candidate : null;
}

/**
 * Get the default bin directory.
 * Priority: NODE_XPDF_BIN_DIR env → DEFAULT_BIN_DIR
 */
export function getBinDir(): string {
  return process.env.NODE_XPDF_BIN_DIR || DEFAULT_BIN_DIR;
}

/**
 * Resolve the full path to an xpdf tool binary.
 * Priority: options.binDir → NODE_XPDF_BIN_DIR → DEFAULT_BIN_DIR
 */
export function resolveBinaryPath(
  tool: ToolName,
  options: ResolveOptions = {}
): string {
  const binDir = options.binDir || getBinDir();
  const resolved = resolveFromBinDir(binDir, tool);
  
  if (resolved) {
    return resolved;
  }

  throw new Error(
    `Unable to locate ${tool} in ${binDir}. Ensure xpdf binaries are installed or set NODE_XPDF_BIN_DIR.`
  );
}

export function getBinaryPath(tool: ToolName): string {
  return resolveBinaryPath(tool);
}

export function listTools(): ToolName[] {
  return [...TOOL_NAMES];
}
