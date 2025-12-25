/**
 * Example: Get PDF information
 * 
 * Build: npm run build
 * Run: npx ts-node examples/pdfinfo-example.ts
 */

import path from "path";
import { pdfinfo, Xpdf ,PACKAGE_ROOT} from "../src";

const SAMPLE_PDF = path.join(PACKAGE_ROOT, "fixtures", "sample.pdf");

async function main() {
  const inputPdf = process.argv[2] || SAMPLE_PDF;

  console.log(`Getting info for: ${inputPdf}\n`);

  // Method 1: Using the pdfinfo function directly
  const result = await pdfinfo(inputPdf);

  if (result.exitCode !== 0) {
    console.error("Error:", result.stderr);
    process.exit(result.exitCode);
  }

  console.log("=== Raw Output ===");
  console.log(result.stdout);

  // Method 2: Using the Xpdf class (parses output into structured data)
  console.log("\n=== Parsed Info ===");
  const xpdf = new Xpdf();
  const infoResult = await xpdf.pdfInfo(inputPdf);

  if (!Array.isArray(infoResult)) {
    Object.entries(infoResult.info).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
