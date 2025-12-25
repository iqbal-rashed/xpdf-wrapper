/**
 * Example: Extract text from PDF
 *
 * Build: npm run build
 * Run: npx ts-node examples/pdftotext-example.ts
 */

import path from "path";
import { pdftotext, PACKAGE_ROOT } from "../src";

const SAMPLE_PDF = path.join(PACKAGE_ROOT, "fixtures", "sample.pdf");

async function main() {
  const inputPdf = process.argv[2] || SAMPLE_PDF;
  const outputText = process.argv[3];

  console.log(`Extracting text from: ${inputPdf}`);

  // Extract text (defaults to stdout/result.text if no output file specified)
  const result = await pdftotext(inputPdf, outputText, {
    layout: true, 
  });

  if (result.exitCode !== 0) {
    console.error("Error:", result.stderr);
    process.exit(result.exitCode);
  }

  if (outputText) {
    console.log(`Text extracted to: ${outputText}`);
  } else {
    // Access the extracted text directly from the result
    console.log("\n=== Extracted Text (first 500 chars) ===");
    console.log(result.text.slice(0, 500));
    if (result.text.length > 500) {
      console.log(`\n... (${result.text.length - 500} more characters)`);
    }
  }

  console.log(`\nCompleted in ${result.durationMs}ms`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
