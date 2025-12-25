# node-xpdf

Node.js wrappers for the Xpdf command-line tools:

- pdftotext
- pdftops
- pdftoppm
- pdftopng
- pdftohtml
- pdfinfo
- pdfimages
- pdffonts
- pdfdetach

## Install

```bash
npm install node-xpdf
```

On install, the package downloads and extracts the official Xpdf tools archive for your platform unless you opt out via environment variables.

## Environment variables

- `NODE_XPDF_VERSION` (default: `4.06`)
- `NODE_XPDF_BASE_URL` (default: `https://dl.xpdfreader.com`)
- `NODE_XPDF_DOWNLOAD_URL` (full override for the download URL)
- `NODE_XPDF_BIN_DIR` (use an existing Xpdf bin dir; skip download)
- `NODE_XPDF_SKIP_DOWNLOAD=1` (skip download; requires PATH or BIN_DIR)
- `NODE_XPDF_USE_SYSTEM=1` (prefer system PATH; fall back to bundled binaries)

Binaries are cached under `vendor/xpdf/<platform>-<arch>/` with a manifest JSON file.

## Programmatic API

```ts
import {
  ensureXpdf,
  getBinDir,
  getBinaryPath,
  run,
  pdftotext,
  pdftops,
  pdftoppm,
  pdftopng,
  pdftohtml,
  pdfinfo,
  pdfimages,
  pdffonts,
  pdfdetach,
  Xpdf
} from "node-xpdf";

await ensureXpdf();
const binDir = getBinDir();
const pdftotextPath = getBinaryPath("pdftotext");

const result = await run("pdfinfo", ["-v"]);
```

### Per-tool convenience wrappers

All wrappers accept an `options` object with `extraArgs`/`rawArgs` for pass-through flags, plus an optional `runOpts`.

```ts
import {
  pdftotext,
  pdftops,
  pdftoppm,
  pdftopng,
  pdftohtml,
  pdfinfo,
  pdfimages,
  pdffonts,
  pdfdetach
} from "node-xpdf";

await pdftotext("input.pdf", "output.txt", { layout: true });
await pdftops("input.pdf", "output.ps", { level3: true });
await pdftoppm("input.pdf", "page", { resolution: 200 });
await pdftopng("input.pdf", "page", { resolution: 200 });
await pdftohtml("input.pdf", "out-dir", { xml: true });
await pdfinfo("input.pdf", { rawDates: true });
await pdfimages("input.pdf", { list: true });
await pdffonts("input.pdf");
await pdfdetach("input.pdf", { list: true });
```

### Class-based API

```ts
import { Xpdf } from "node-xpdf";

const xpdf = new Xpdf(["a.pdf", "b.pdf"], {
  binDir: "/opt/xpdf/bin",
  run: { timeoutMs: 10_000 }
});

const fonts = await xpdf.pdfFonts();
const detach = await xpdf.pdfDetach();
```

The class methods return a single result for one PDF and an array for multiple PDFs, preserving input order.

## Examples

The `examples/` folder includes runnable scripts. From the repo root:

```bash
node examples/pdfinfo.mjs ./path/to/file.pdf
node examples/pdftotext.mjs ./path/to/file.pdf ./output.txt
node examples/class-batch.mjs ./a.pdf ./b.pdf
```

If you're working from source, run `npm run build` first so the `dist/` entrypoints are up to date.

## xpdfrc configuration

Xpdf tools read configuration from `~/.xpdfrc` or `/etc/xpdfrc` (on Windows, `%USERPROFILE%\.xpdfrc`). For example, to change default resolution or rendering options, update your xpdfrc file and the tools will honor it.

## License

MIT
