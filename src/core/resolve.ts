import fs from "fs";
import path from "path";
import { TOOL_NAMES, ToolName } from "./constants";
import { DEFAULT_BIN_DIR } from "../utils/paths";

export interface ResolveOptions {
  binDir?: string;
  configBinDir?: string;
  preferSystem?: boolean;
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

function findOnPath(tool: ToolName): string | null {
  const pathVar = process.env.PATH || "";
  const segments = pathVar.split(path.delimiter).filter(Boolean);
  const executableName = getExecutableName(tool);
  for (const segment of segments) {
    const candidate = path.join(segment, executableName);
    if (isExecutable(candidate)) {
      return candidate;
    }
  }
  return null;
}

function getBundledBinDir(): string | null {
  if (fs.existsSync(DEFAULT_BIN_DIR)) {
    return DEFAULT_BIN_DIR;
  }
  return null;
}

export function getBinDir(): string {
  const envBin = process.env.NODE_XPDF_BIN_DIR;
  if (envBin) {
    return envBin;
  }
  const bundled = getBundledBinDir();
  if (bundled) {
    return bundled;
  }
  throw new Error(
    "Xpdf binaries not found. Set NODE_XPDF_BIN_DIR or ensure binaries are in the bin folder."
  );
}

export function resolveBinaryPath(
  tool: ToolName,
  options: ResolveOptions = {}
): string {
  const explicitBinDir = options.binDir || process.env.NODE_XPDF_BIN_DIR;
  if (explicitBinDir) {
    const resolved = resolveFromBinDir(explicitBinDir, tool);
    if (resolved) {
      return resolved;
    }
    throw new Error(`Tool ${tool} not found in ${explicitBinDir}.`);
  }

  if (options.configBinDir) {
    const resolved = resolveFromBinDir(options.configBinDir, tool);
    if (resolved) {
      return resolved;
    }
  }

  const preferSystem =
    typeof options.preferSystem === "boolean"
      ? options.preferSystem
      : process.env.NODE_XPDF_USE_SYSTEM === "1";

  if (preferSystem) {
    const systemPath = findOnPath(tool);
    if (systemPath) {
      return systemPath;
    }
  }

  const bundledBin = getBundledBinDir();
  if (bundledBin) {
    const resolved = resolveFromBinDir(bundledBin, tool);
    if (resolved) {
      return resolved;
    }
  }

  const systemFallback = findOnPath(tool);
  if (systemFallback) {
    return systemFallback;
  }

  throw new Error(
    `Unable to locate ${tool}. Ensure binaries are installed or set NODE_XPDF_BIN_DIR.`
  );
}

export function getBinaryPath(tool: ToolName): string {
  return resolveBinaryPath(tool);
}

export function listTools(): ToolName[] {
  return [...TOOL_NAMES];
}
