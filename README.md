<div align="center">

# 📄 xpdf-wrapper

**A powerful Node.js wrapper for [Xpdf](https://www.xpdfreader.com/) command-line tools**

*Extract text, images, fonts, and metadata from PDF files with ease*

[![npm version](https://img.shields.io/npm/v/xpdf-wrapper.svg?style=flat-square&color=cb3837)](https://www.npmjs.com/package/xpdf-wrapper)
[![npm downloads](https://img.shields.io/npm/dm/xpdf-wrapper.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/xpdf-wrapper)
[![license](https://img.shields.io/npm/l/xpdf-wrapper.svg?style=flat-square&color=green)](https://github.com/iqbal-rashed/xpdf-wrapper/blob/main/LICENSE)
[![node version](https://img.shields.io/node/v/xpdf-wrapper.svg?style=flat-square&color=brightgreen)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

[Getting Started](#-installation) •
[API Reference](#-api-reference) •
[Examples](#-examples) •
[Configuration](#-configuration)

</div>

---

## 🌟 Why xpdf-wrapper?

**xpdf-wrapper** brings the power of Xpdf's battle-tested PDF processing tools to Node.js. Whether you need to extract text for search indexing, convert PDFs to images, or analyze document metadata, this library provides a clean, modern API with full TypeScript support.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📄 **Complete Xpdf Suite** | All 9 tools included: `pdftotext`, `pdftops`, `pdftoppm`, `pdftopng`, `pdftohtml`, `pdfinfo`, `pdfimages`, `pdffonts`, `pdfdetach` |
| 🔄 **Buffer Support** | Process PDFs directly from memory - no need to save temporary files |
| 📝 **Direct Text Output** | `pdftotext` returns extracted text directly in `result.text` |
| 🎯 **TypeScript First** | Complete type definitions for all tools and options |
| ⚡ **Zero Config** | Xpdf binaries are automatically downloaded on install |
| 🔀 **Flexible API** | Choose between standalone functions or the unified `Xpdf` class |
| 🚀 **Batch Processing** | Process multiple PDFs or run multiple operations concurrently |

---

## 📦 Installation

```bash
# Using npm
npm install xpdf-wrapper

# Using yarn
yarn add xpdf-wrapper

# Using pnpm
pnpm add xpdf-wrapper
```

> **Note:** Xpdf binaries are automatically downloaded for your platform (Windows, macOS, Linux) during installation.

---

## 🚀 Quick Start

### Basic Text Extraction

```typescript
import { pdftotext } from "xpdf-wrapper";

// Extract text from a PDF file
const result = await pdftotext("./document.pdf");
console.log(result.text);
```

### Working with Buffers

```typescript
import { pdftotext } from "xpdf-wrapper";
import { readFileSync } from "fs";

// Process PDF directly from a Buffer
const pdfBuffer = readFileSync("./document.pdf");
const result = await pdftotext(pdfBuffer);
console.log(result.text);
```

### Get PDF Metadata

```typescript
import { pdfinfo } from "xpdf-wrapper";

const result = await pdfinfo("./document.pdf");
console.log(result.stdout);
// Output:
// Creator:        Microsoft Word
// Producer:       Adobe PDF Library
// CreationDate:   Mon Dec 25 12:00:00 2024
// Pages:          5
// File size:      102400 bytes
// ...
```

---

## 📚 API Reference

### Available Tools

xpdf-wrapper provides wrappers for all 9 Xpdf command-line tools:

| Tool | Function | Description |
|------|----------|-------------|
| `pdftotext` | `pdftotext()` | Extract text content from PDF |
| `pdftops` | `pdftops()` | Convert PDF to PostScript |
| `pdftoppm` | `pdftoppm()` | Convert PDF pages to PPM images |
| `pdftopng` | `pdftopng()` | Convert PDF pages to PNG images |
| `pdftohtml` | `pdftohtml()` | Convert PDF to HTML |
| `pdfinfo` | `pdfinfo()` | Get PDF metadata and information |
| `pdfimages` | `pdfimages()` | Extract embedded images from PDF |
| `pdffonts` | `pdffonts()` | List fonts used in PDF |
| `pdfdetach` | `pdfdetach()` | Extract file attachments from PDF |

### Standalone Functions

All tool wrappers accept either a file path (`string`) or a `Buffer` as input:

```typescript
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
} from "xpdf-wrapper";

// Using file path
const text = await pdftotext("./document.pdf", undefined, { layout: true });

// Using Buffer
const buffer = readFileSync("./document.pdf");
const info = await pdfinfo(buffer, { rawDates: true });

// With options
const fonts = await pdffonts("./document.pdf");
```

### The Xpdf Class

For more structured results and batch operations, use the `Xpdf` class:

```typescript
import { Xpdf } from "xpdf-wrapper";
import { readFileSync } from "fs";

const xpdf = new Xpdf();

// Extract text with parsed result
const textResult = await xpdf.pdfToText("./document.pdf");
console.log(textResult.text);

// Get PDF info with parsed metadata
const infoResult = await xpdf.pdfInfo("./document.pdf");
console.log(infoResult.info.Pages);      // 5
console.log(infoResult.info.Creator);    // "Microsoft Word"

// List fonts with parsed output
const fontsResult = await xpdf.pdfFonts("./document.pdf");
console.log(fontsResult.fonts);          // Array of font objects

// Works with Buffers too
const buffer = readFileSync("./document.pdf");
const result = await xpdf.pdfInfo(buffer);
```

### Processing Multiple PDFs

Pass an array to process multiple PDF files:

```typescript
const xpdf = new Xpdf();

// Process multiple PDFs
const results = await xpdf.pdfInfo([
  "./document1.pdf",
  "./document2.pdf",
  "./document3.pdf"
]);

// Results is an array
results.forEach((result, index) => {
  console.log(`Document ${index + 1}: ${result.info.Pages} pages`);
});

// Mix file paths and Buffers
const buffer = readFileSync("./document2.pdf");
const mixedResults = await xpdf.pdfToText([
  "./document1.pdf",
  buffer,
  "./document3.pdf"
]);
```

### Batch Operations

Run multiple operations on the same PDF(s) concurrently:

```typescript
const xpdf = new Xpdf();

// Run multiple operations on a single PDF
const results = await xpdf.batch("./document.pdf", [
  "pdfInfo",
  "pdfFonts", 
  "pdfToText"
]);

// Access results by operation name
console.log("Page count:", results.pdfInfo?.info.Pages);
console.log("Fonts used:", results.pdfFonts?.fonts);
console.log("Text content:", results.pdfToText?.text);
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_XPDF_BIN_DIR` | `<package>/bin` | Custom path to Xpdf binaries |

### Custom Options

Configure the `Xpdf` class with custom options:

```typescript
import { Xpdf } from "xpdf-wrapper";

const xpdf = new Xpdf({
  // Custom binary directory
  binDir: "/opt/xpdf/bin",
  
  // Runtime options
  run: {
    timeoutMs: 30000,  // 30 second timeout
  }
});
```

### Tool-Specific Options

Each tool supports its own set of options matching the Xpdf CLI:

```typescript
// pdftotext options
await pdftotext("./doc.pdf", undefined, {
  firstPage: 1,
  lastPage: 10,
  layout: true,        // Maintain original layout
  table: true,         // Table mode
  lineEnd: "unix",     // Line endings: "unix" | "dos" | "mac"
  enc: "UTF-8",        // Output encoding
  ownerPassword: "secret",
  userPassword: "secret"
});

// pdfinfo options
await pdfinfo("./doc.pdf", {
  firstPage: 1,
  lastPage: 5,
  box: true,           // Print page box info
  meta: true,          // Print metadata
  rawDates: true,      // Print dates in raw format
});

// pdftopng options
await pdftopng("./doc.pdf", "./output", {
  firstPage: 1,
  lastPage: 1,
  resolution: 300,     // DPI
  mono: true,          // Monochrome output
  gray: true,          // Grayscale output
});
```

---

## 📁 Examples

The [`examples/`](./examples) directory contains working examples:

| Example | Description |
|---------|-------------|
| [`buffer-example.ts`](./examples/buffer-example.ts) | Working with PDF Buffers |
| [`pdftotext-example.ts`](./examples/pdftotext-example.ts) | Text extraction examples |
| [`pdfinfo-example.ts`](./examples/pdfinfo-example.ts) | Getting PDF metadata |
| [`batch-example.ts`](./examples/batch-example.ts) | Batch processing examples |

### Running Examples

```bash
# First, build the project
npm run build

# Then run an example
npx tsx examples/buffer-example.ts
npx tsx examples/pdftotext-example.ts
npx tsx examples/pdfinfo-example.ts
npx tsx examples/batch-example.ts
```

---

## �️ Development

```bash
# Clone the repository
git clone https://github.com/iqbal-rashed/xpdf-wrapper.git
cd xpdf-wrapper

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint the code
npm run lint

# Format the code
npm run format
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📋 Requirements

- **Node.js** 18.0 or higher
- **Platforms:** Windows, macOS, Linux (binaries auto-downloaded)

---

## 🔗 Related Links

- [Xpdf Official Website](https://www.xpdfreader.com/)
- [Xpdf Documentation](https://www.xpdfreader.com/documentation.html)
- [GitHub Repository](https://github.com/iqbal-rashed/xpdf-wrapper)
- [npm Package](https://www.npmjs.com/package/xpdf-wrapper)
- [Issue Tracker](https://github.com/iqbal-rashed/xpdf-wrapper/issues)

---

## �📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [Rashed Iqbal](https://github.com/iqbal-rashed)

⭐ **Star this repo if you find it helpful!** ⭐

</div>
