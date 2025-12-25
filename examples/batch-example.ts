/**
 * Example: Batch process PDFs using the Xpdf class
 * 
 * Build: npm run build
 * Run: npx ts-node examples/batch-example.ts
 */

import path from "path";
import { Xpdf ,PACKAGE_ROOT} from "../src";

const SAMPLE_PDF = path.join(PACKAGE_ROOT, "fixtures", "sample.pdf");

async function main() {
  const pdfFiles = process.argv.slice(2);
  
  // Use sample.pdf if no arguments provided
  if (pdfFiles.length === 0) {
    pdfFiles.push(SAMPLE_PDF);
  }

  console.log(`Processing ${pdfFiles.length} PDF file(s)...\n`);

  // Create Xpdf instance (no pdfs needed in constructor anymore)
  const xpdf = new Xpdf();

  // Method 1: Call individual methods with PDFs
  console.log("=== PDF Information ===");
  const infoResults = await xpdf.pdfInfo(pdfFiles);
  const infos = Array.isArray(infoResults) ? infoResults : [infoResults];

  infos.forEach((result, index) => {
    console.log(`\n[${pdfFiles[index]}]`);
    if (result.result.exitCode === 0) {
      const { Title, Author, Pages, Creator } = result.info;
      console.log(`  Title: ${Title || "N/A"}`);
      console.log(`  Author: ${Author || "N/A"}`);
      console.log(`  Pages: ${Pages || "N/A"}`);
      console.log(`  Creator: ${Creator || "N/A"}`);
    } else {
      console.log(`  Error: ${result.result.stderr}`);
    }
  });

  // Method 2: Use batch() to run multiple methods at once
  console.log("\n=== Batch Processing (Info + Fonts) ===");
  const batchResult = await xpdf.batch(
    pdfFiles,
    ["pdfInfo", "pdfFonts"],
    {} // options for each method
  );

  // Access batch results
  if (batchResult.pdfFonts) {
    const fonts = Array.isArray(batchResult.pdfFonts) 
      ? batchResult.pdfFonts 
      : [batchResult.pdfFonts];
    
    fonts.forEach((result, index) => {
      console.log(`\n[${pdfFiles[index]}] Fonts:`);
      if (result.fonts.length === 0) {
        console.log("  No embedded fonts found");
      } else {
        result.fonts.slice(0, 5).forEach((font) => {
          console.log(`  - ${font.name} (${font.type || "unknown"})`);
        });
        if (result.fonts.length > 5) {
          console.log(`  ... and ${result.fonts.length - 5} more fonts`);
        }
      }
    });
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
