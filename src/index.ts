import { spawn } from "child_process";

class Xpdf {
    constructor(pdf: string | string[]) {}
    pdfDetach() {}
    pdfFonts() {}
}

const xpdf = new Xpdf(["pdf.pdf", "example.pdf"]);

const detach = xpdf.pdfDetach();

const fonts = xpdf.pdfFonts();
