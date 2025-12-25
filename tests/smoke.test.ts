import path from "path";
import { describe, expect, it } from "vitest";
import { getBinaryPath } from "../src/core/resolve";
import { run } from "../src/core/run";
import { PACKAGE_ROOT } from "../src/utils/paths";

const SAMPLE_PDF = path.join(PACKAGE_ROOT, "fixtures", "sample.pdf");

function hasBinary(): boolean {
  try {
    getBinaryPath("pdfinfo");
    return true;
  } catch {
    return false;
  }
}

describe("smoke", () => {
  it("runs pdfinfo -v when available", async () => {
    if (process.env.CI) {
      return;
    }
    if (!hasBinary()) {
      return;
    }
    const result = await run("pdfinfo", ["-v"]);
    // xpdf tools return non-zero exit code for version/help output
    // Version info is printed to stdout
    expect(result.stdout).toContain("pdfinfo version");
  });

  it("runs pdfinfo on sample.pdf when available", async () => {
    if (process.env.CI) {
      return;
    }
    if (!hasBinary()) {
      return;
    }
    const result = await run("pdfinfo", [SAMPLE_PDF]);
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Pages:");
  });
});
