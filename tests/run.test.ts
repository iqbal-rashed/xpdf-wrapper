import fs from "fs";
import os from "os";
import path from "path";
import { PassThrough } from "stream";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("child_process", () => {
  return {
    spawn: vi.fn(() => {
      const stdout = new PassThrough();
      const stderr = new PassThrough();
      const stdin = new PassThrough();
      const { EventEmitter } = require("events");
      const child = new EventEmitter();
      child.stdout = stdout;
      child.stderr = stderr;
      child.stdin = stdin;
      child.kill = vi.fn();
      setImmediate(() => {
        stdout.end();
        stderr.end();
        child.emit("close", 0);
      });
      return child;
    }),
    spawnSync: vi.fn()
  };
});

import { run } from "../src/core/run";
import { ToolName } from "../src/core/constants";
import { spawn } from "child_process";

const originalEnv = { ...process.env };
const tempDirs: string[] = [];

async function makeTempDir(): Promise<string> {
  return fs.promises.mkdtemp(path.join(os.tmpdir(), "xpdf-run-"));
}

describe("run", () => {
  afterEach(async () => {
    process.env = { ...originalEnv };
    while (tempDirs.length) {
      const dir = tempDirs.pop();
      if (dir) {
        await fs.promises.rm(dir, { recursive: true, force: true });
      }
    }
    vi.clearAllMocks();
  });

  it("builds spawn command from bin dir", async () => {
    const tempDir = await makeTempDir();
    tempDirs.push(tempDir);
    const tool: ToolName = "pdftotext";
    const exeName = process.platform === "win32" ? `${tool}.exe` : tool;
    const exePath = path.join(tempDir, exeName);
    await fs.promises.writeFile(exePath, "");
    if (process.platform !== "win32") {
      await fs.promises.chmod(exePath, 0o755);
    }

    process.env.NODE_XPDF_BIN_DIR = tempDir;

    const result = await run(tool, ["-h"]);

    expect(spawn).toHaveBeenCalledWith(
      exePath,
      ["-h"],
      expect.objectContaining({ stdio: "pipe" })
    );
    expect(result.command).toBe(exePath);
    expect(result.args).toEqual(["-h"]);
  });
});

