/**
 * Example: Using Buffer as input for PDF tools
 *
 * Build: npm run build
 * Run: npx ts-node examples/buffer-example.ts
 */

import path from "path";
import fs from "fs";
import { Xpdf, pdfinfo, PACKAGE_ROOT } from "../src";

const SAMPLE_PDF = path.join(PACKAGE_ROOT, "fixtures", "sample.pdf");

async function main() {
  const inputPdfPath = process.argv[2] || SAMPLE_PDF;

  console.log(`Reading PDF into buffer: ${inputPdfPath}`);
  const pdfBuffer = fs.readFileSync(inputPdfPath);

  console.log(`\n--- Example 1: Using Xpdf class with Buffer ---`);
  const xpdf = new Xpdf();
  
  // Pass buffer directly to the method
  const infoClass = await xpdf.pdfInfo(pdfBuffer);
  
  // Handle result (which might be an array if input was an array)
  const info = Array.isArray(infoClass) ? infoClass[0] : infoClass;
  
  console.log("PDF Info (Class):");
  console.log(JSON.stringify(info.info, null, 2));

  console.log(`\n--- Example 2: Using standalone tool wrapper with Buffer ---`);
  
  // Pass buffer directly to the function
  const resultTool = await pdfinfo(pdfBuffer);
  
  console.log("PDF Info (Tool):");
  // Parse the stdout manually for the raw tool result if needed, 
  // or use the class which handles parsing for you.
  // Here we just show the raw output command standard output
  console.log(resultTool.stdout.split("\n").slice(0, 3).join("\n") + "\n...");

  console.log(`\n--- Example 3: Mixed inputs (File Path + Buffer) ---`);
  const mixedResults = await xpdf.pdfInfo([inputPdfPath, pdfBuffer]);
  console.log(`Processed ${Array.isArray(mixedResults) ? mixedResults.length : 1} PDFs successfully.`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
