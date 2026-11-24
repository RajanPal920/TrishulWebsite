/**
 * Lightweight in-browser XLSX / CSV reader
 * Extracts cell text and row arrays from modern .xlsx / .xlsm archives or text files
 * without requiring large external dependencies.
 */

export async function extractRowsFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // If CSV, TSV, or plain text, read directly
  if (fileName.endsWith(".csv") || fileName.endsWith(".tsv") || fileName.endsWith(".txt")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(String(e.target?.result || ""));
      reader.onerror = () => reject(new Error("Failed to read text file"));
      reader.readAsText(file);
    });
  }

  // If XLSX / XLSM: read as ArrayBuffer and extract XML text strings
  // In XLSX, all text cell values are stored in xl/sharedStrings.xml or inline <t> elements
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Convert binary to string safely in chunks to avoid stack overflow
  let binaryStr = "";
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binaryStr += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }

  // Find all <t>...</t> XML text nodes or shared strings
  const textMatches = binaryStr.match(/<t(?:\s+[^>]*)?>([^<]+)<\/t>/g);
  if (textMatches && textMatches.length > 0) {
    const extractedWords = textMatches
      .map((m) => m.replace(/<[^>]+>/g, "").trim())
      .filter((w) => w && w.length > 1 && !w.startsWith("xl/"));

    // Group text items into lines of up to 6 columns
    const reconstructedLines: string[] = [];
    for (let i = 0; i < extractedWords.length; i += 6) {
      reconstructedLines.push(extractedWords.slice(i, i + 6).join("\t"));
    }
    return reconstructedLines.join("\n");
  }

  // Fallback: try reading as text
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(String(e.target?.result || ""));
    reader.readAsText(file);
  });
}
