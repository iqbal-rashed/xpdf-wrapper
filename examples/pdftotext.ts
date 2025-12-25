/**
 * Example: Extract text from PDF
 * 
 * Build: npm run build
 * Run: npx ts-node examples/pdftotext-example.ts
 */

import path from "path";
import { pdftotext ,PACKAGE_ROOT} from "../src";

const SAMPLE_PDF = path.join(PACKAGE_ROOT, "fixtures", "sample.pdf");

async function main() {
  const inputPdf = process.argv[2] || SAMPLE_PDF;
  const outputText = process.argv[3];

  console.log(`Extracting text from: ${inputPdf}`);

  // Extract text with layout preservation
  const result = await pdftotext(inputPdf, outputText, {
    layout: true,      // Preserve original layout
    // encoding: "UTF-8", // Optional: specify encoding
    // firstPage: 1,      // Optional: start page
    // lastPage: 5,       // Optional: end page
  });

  if (result.exitCode !== 0) {
    console.error("Error:", result.stderr);
    process.exit(result.exitCode);
  }

  if (outputText) {
    console.log(`Text extracted to: ${outputText}`);
  } else {
    // If no output file, pdftotext outputs to stdout
    console.log("\n=== Extracted Text (first 500 chars) ===");
    console.log(result.stdout.slice(0, 500));
    if (result.stdout.length > 500) {
      console.log(`\n... (${result.stdout.length - 500} more characters)`);
    }
  }

  console.log(`\nCompleted in ${result.durationMs}ms`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
