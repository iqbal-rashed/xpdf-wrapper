import path from "path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PACKAGE_ROOT } from "../src/utils/paths";

vi.mock("../src/core/run", () => {
  return {
    run: vi.fn(),
    runSync: vi.fn()
  };
});

import { run } from "../src/core/run";
import { Xpdf } from "../src/api/xpdf";

const runMock = vi.mocked(run);
const SAMPLE_PDF = path.join(PACKAGE_ROOT, "fixtures", "sample.pdf");

function makeRunResult(stdout: string) {
  return {
    exitCode: 0,
    stdout,
    stderr: "",
    command: "mock",
    args: [],
    durationMs: 0
  };
}

describe("Xpdf class", () => {
  beforeEach(() => {
    runMock.mockReset();
  });

  it("returns a single result for one PDF", async () => {
    const fontsOutput =
      "name  type  encoding  emb  sub  uni  object ID\n" +
      "------------------------------------------\n" +
      "F1  Type1  WinAnsi  yes  no  yes  3 0";
    runMock.mockResolvedValueOnce(makeRunResult(fontsOutput));

    const xpdf = new Xpdf();
    const result = await xpdf.pdfFonts(SAMPLE_PDF);

    expect(Array.isArray(result)).toBe(false);
    expect((Array.isArray(result) ? result[0] : result).fonts.length).toBe(1);
  });

  it("returns an array for multiple PDFs in order", async () => {
    runMock
      .mockResolvedValueOnce(makeRunResult("1: first.txt (10 bytes)"))
      .mockResolvedValueOnce(makeRunResult("1: second.txt (20 bytes)"));

    const xpdf = new Xpdf();
    const result = await xpdf.pdfDetach([SAMPLE_PDF, SAMPLE_PDF]);

    expect(Array.isArray(result)).toBe(true);
    expect((Array.isArray(result) ? result : [result]).length).toBe(2);
    expect((Array.isArray(result) ? result : [result])[0].entries?.[0].name).toBe("first.txt");
    expect((Array.isArray(result) ? result : [result])[1].entries?.[0].name).toBe("second.txt");
  });

  it("uses default args for pdfDetach and pdfFonts", async () => {
    runMock
      .mockResolvedValueOnce(makeRunResult(""))
      .mockResolvedValueOnce(makeRunResult(""));

    const xpdf = new Xpdf();
    await xpdf.pdfDetach(SAMPLE_PDF);
    await xpdf.pdfFonts(SAMPLE_PDF);

    expect(runMock).toHaveBeenNthCalledWith(
      1,
      "pdfdetach",
      ["-list", SAMPLE_PDF],
      expect.any(Object)
    );

    expect(runMock).toHaveBeenNthCalledWith(
      2,
      "pdffonts",
      [SAMPLE_PDF],
      expect.any(Object)
    );
  });

  it("batch method runs multiple operations", async () => {
    runMock
      .mockResolvedValueOnce(makeRunResult("Title: Test PDF"))
      .mockResolvedValueOnce(makeRunResult("name  type\nF1  Type1"));

    const xpdf = new Xpdf();
    const result = await xpdf.batch(SAMPLE_PDF, ["pdfInfo", "pdfFonts"]);

    expect(result.pdfInfo).toBeDefined();
    expect(result.pdfFonts).toBeDefined();
    expect(runMock).toHaveBeenCalledTimes(2);
  });
});
