import fs from "fs";
import path from "path";
import os from "os";
import https from "https";
import { extract } from "7zip-wrapper"; 
import { DEFAULT_BIN_DIR } from "../utils/paths";

const BASE_URL = "https://github.com/iqbal-rashed/node-xpdf/releases/download/latest";

const ASSETS = [
  { platform: "win", arch: "x64", filename: "xpdf-tools-win-4.06-x64.zip" },
  { platform: "win", arch: "ia32", filename: "xpdf-tools-win-4.06-x86.zip" },
  { platform: "win", arch: "arm64", filename: null },
  { platform: "linux", arch: "x64", filename: "xpdf-tools-linux-4.06-x64.zip" },
  { platform: "linux", arch: "ia32", filename: "xpdf-tools-linux-4.06-x86.zip" },
  { platform: "linux", arch: "arm64", filename: null },
  { platform: "linux", arch: "arm", filename: null },
  { platform: "mac", arch: "x64", filename: "xpdf-tools-mac-4.06-x64.zip" },
  { platform: "mac", arch: "arm64", filename: "xpdf-tools-mac-4.06-arm.zip" },
];

const getPlatform = (): string => {
  const platform = os.platform();
  if (platform === "win32") return "win";
  if (platform === "darwin") return "mac";
  return platform;
};

const getArchLabel = (): string => {
  const arch = os.arch();
  if (arch === "ia32") return "x86";
  if (arch === "x64") return "x64";
  if (arch === "arm" || arch === "arm64") return "arm";
  return arch;
};

const ensureDir = (dir: string) => fs.mkdirSync(dir, { recursive: true });

const formatPercent = (done: number, total: number): string =>
  total ? `${((done / total) * 100).toFixed(1)}%` : "unknown";

const downloadFile = (url: string, dest: string): Promise<void> =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        // Handle redirects
        if (res.statusCode === 301 || res.statusCode === 302) {
          if (res.headers.location) {
            downloadFile(res.headers.location, dest).then(resolve).catch(reject);
            return;
          }
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Download failed with status ${res.statusCode}`));
          return;
        }

        const tempPath = `${dest}.download`;
        const file = fs.createWriteStream(tempPath);
        const total = Number(res.headers["content-length"]) || 0;
        let downloaded = 0;

        res.on("data", (chunk) => {
          downloaded += chunk.length;
          if (total) {
            process.stdout.write(` - ${formatPercent(downloaded, total)}\r`);
          }
        });

        res.on("error", (err) => {
          file.destroy();
          fs.rmSync(tempPath, { force: true });
          reject(err);
        });

        file.on("error", (err) => {
          fs.rmSync(tempPath, { force: true });
          reject(err);
        });

        file.on("finish", () => {
          file.close(() => {
            fs.renameSync(tempPath, dest);
            resolve();
          });
        });

        res.pipe(file);
      })
      .on("error", reject);
  });

const chmodBinFiles = (dir: string) => {
  if (process.platform === "win32") return;

  const walk = (p: string) => {
    if (!fs.existsSync(p)) return;
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      for (const name of fs.readdirSync(p)) walk(path.join(p, name));
    } else if (st.isFile()) {
      try {
        fs.chmodSync(p, 0o755);
      } catch {
        // ignore
      }
    }
  };

  walk(dir);
};

const main = async () => {
  const platform = getPlatform();
  const arch = getArchLabel();

  console.log("Xpdf binary downloader");
  console.log(`Platform: ${platform}`);
  console.log(`Architecture: ${arch}\n`);

  const asset = ASSETS.find((a) => a.platform === platform && a.arch === arch);

  if (!asset?.filename) {
    console.warn(`No prebuilt Xpdf asset for arch: ${process.arch}`);
    return;
  }

  ensureDir(DEFAULT_BIN_DIR);

  const zipPath = path.join(DEFAULT_BIN_DIR, asset.filename);

  // If already downloaded, skip download
  if (!fs.existsSync(zipPath)) {
    console.log(`Downloading ${asset.filename}`);
    const url = `${BASE_URL}/${asset.filename}`;

    await downloadFile(url, zipPath);
  } else {
    console.log(`Already downloaded: ${zipPath}`);
  }

  // Uses 7zip-wrapper extract
  await extract(zipPath, { outputDir: DEFAULT_BIN_DIR, overwrite: true });

  chmodBinFiles(DEFAULT_BIN_DIR);

  console.log(`\nSuccessfully downloaded to: ${DEFAULT_BIN_DIR}`);
};

main()
  .catch((e) => {
    console.error(`Xpdf postinstall failed: ${(e as Error).message}`);
  })
  .finally(() => process.exit(0));
