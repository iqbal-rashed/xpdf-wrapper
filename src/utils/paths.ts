import fs from "fs";
import path from "path";

function findPackageRoot(dir: string, fallback: string = dir): string {
  if (fs.existsSync(path.join(dir, "package.json"))) {
    return dir;
  }
  const parent = path.dirname(dir);
  if (parent === dir) {
    return fallback;
  }
  return findPackageRoot(parent, fallback);
}

export const PACKAGE_ROOT = findPackageRoot(__dirname);
export const DEFAULT_BIN_DIR = path.join(PACKAGE_ROOT, "bin");
