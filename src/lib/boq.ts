/**
 * Engineering Bill of Quantities (BOQ) and Material Take-Off (MTO) Parser
 * Accurately parses structured spreadsheet rows, tab-separated tables, CSV,
 * and unstructured engineering line descriptions into standardized enquiry lines.
 */

export interface ParsedBoqLine {
  material: string;
  product: string;
  size: string;
  rating: string;
  facing?: string;
  quantity: string;
  unit: string;
  cutLength?: string;
  processing?: string[];
  raw?: string;
}

/**
 * Standardize units to Trishul's accepted quotation units
 */
export function normalizeUnit(rawUnit: string): string {
  const u = (rawUnit || "").toLowerCase().trim();
  if (!u) return "pcs";
  if (/^(nos|no|pcs|pieces|units?|items?|ea|each|qty)$/i.test(u)) return "pcs";
  if (/^(mtr|m|meter|meters|linear\s*m|r\.?m\.?)$/i.test(u)) return "m";
  if (/^(kg|kgs|kilo|kilograms)$/i.test(u)) return "kg";
  if (/^(mt|metric\s*ton|metric\s*tons|ton|tons|tonnes)$/i.test(u)) return "MT";
  if (/^(sets?|lot|pkg)$/i.test(u)) return "set";
  return u;
}

/**
 * Parse a single CSV or TSV line respecting quotes and preserving empty columns
 */
export function parseCsvLine(text: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"' || char === "'") {
      if (!inQuotes && cur.length === 0) {
        inQuotes = true;
      } else if (inQuotes && (i === text.length - 1 || text[i + 1] === "," || text[i + 1] === "\t")) {
        inQuotes = false;
      } else {
        cur += char;
      }
    } else if ((char === "," || char === "\t") && !inQuotes) {
      result.push(cur.trim());
      cur = "";
    } else {
      cur += char;
    }
  }
  result.push(cur.trim());
  return result;
}

/**
 * Extract structured attributes from a single unstructured or semi-structured description string
 */
export function parseDescriptionString(text: string): Partial<ParsedBoqLine> {
  const clean = text.trim();
  const res: Partial<ParsedBoqLine> = { raw: clean };

  // 1. Quantity & Unit pattern: e.g. "20 Nos", "36 Nos", "120 Mtr", "2.5 MT", "12 Nos", "50 pcs"
  const qtyMatch = clean.match(/(?:^|[,\s\t])(\d+(?:\.\d+)?)\s*(nos|no\.?|pcs|pieces|mtr|meters|m|kg|kgs|mt|metric\s*tons?|tons?|tonnes?)(?:[,\s\t]|$)/i);
  if (qtyMatch && qtyMatch[1] && qtyMatch[2]) {
    res.quantity = qtyMatch[1];
    res.unit = normalizeUnit(qtyMatch[2]);
  }

  // 2. Structural designation or NPS size
  const structuralMatch = clean.match(/\b(ISMB|ISHB|UB|UC|HEA|HEB|MC)\s*(\d+)\b/i);
  const npsMatch = clean.match(/(?:^|[,\s\t])((?:\d+(?:\.\d+)?|\d+\/\d+)\s*(?:\"|inch|in\.?|nps|\bmm\b))(?:[,\s\t]|$)/i);
  if (structuralMatch && structuralMatch[1] && structuralMatch[2]) {
    res.size = `${structuralMatch[1].toUpperCase()} ${structuralMatch[2]}`;
  } else if (npsMatch && npsMatch[1]) {
    res.size = npsMatch[1].replace(/inch|in\.?/i, '"').trim();
    if (!res.size.endsWith('"') && !res.size.toLowerCase().includes("mm")) {
      res.size += '"';
    }
  }

  // 3. Rating / Schedule extraction
  const classMatch = clean.match(/(?:class|#)\s*(150|300|600|900|1500|2500|3000|6000|9000)\b|\b(150|300|600|900|1500|2500|3000|6000|9000)#/i);
  const schMatch = clean.match(/\b(?:SCH|SCHEDULE)\s*(\d+[A-Z]?|STD|XS|XXS)\b/i);
  if (classMatch) {
    const val = classMatch[1] || classMatch[2];
    if (val) {
      res.rating = Number(val) >= 2000 ? `${val}#` : `Class ${val}`;
    }
  } else if (schMatch && schMatch[1]) {
    res.rating = `SCH ${schMatch[1].toUpperCase()}`;
  }

  // 4. Facing (RF, RTJ, FF)
  if (/\bWNRF\b/i.test(clean) || /\bRF\b/i.test(clean) || /raised\s*face/i.test(clean)) {
    res.facing = "RF";
  } else if (/\bRTJ\b/i.test(clean) || /ring\s*type/i.test(clean)) {
    res.facing = "RTJ";
  } else if (/\bFF\b/i.test(clean) || /flat\s*face/i.test(clean)) {
    res.facing = "FF";
  }

  // 5. Product Identification
  if (/\b(?:WNRF|weld\s*neck)\s*flange\b/i.test(clean) || /\bWNRF\b/i.test(clean)) {
    res.product = "Weld neck flange (RF)";
  } else if (/\bblind\s*flange\b|\bBLRF\b/i.test(clean)) {
    res.product = "Blind flange";
  } else if (/\bslip\s*on\s*flange\b|\bSORF\b/i.test(clean)) {
    res.product = "Slip-on flange";
  } else if (/\bflange\b/i.test(clean)) {
    res.product = "Flange";
  } else if (/90\s*(?:deg|°)?\s*lr\s*elbow/i.test(clean)) {
    res.product = "90° elbow (LR)";
  } else if (/90\s*(?:deg|°)?\s*sr\s*elbow/i.test(clean)) {
    res.product = "90° elbow (SR)";
  } else if (/45\s*(?:deg|°)?\s*elbow/i.test(clean)) {
    res.product = "45° elbow";
  } else if (/\b(?:elbow|bend)\b/i.test(clean)) {
    res.product = "Elbow";
  } else if (/sw\s*tee|socket\s*weld\s*tee/i.test(clean)) {
    res.product = "Socket-weld tee";
  } else if (/reducing\s*tee/i.test(clean)) {
    res.product = "Reducing tee";
  } else if (/equal\s*tee|\btee\b/i.test(clean)) {
    res.product = "Equal tee";
  } else if (/concentric\s*reducer/i.test(clean)) {
    res.product = "Concentric reducer";
  } else if (/eccentric\s*reducer/i.test(clean)) {
    res.product = "Eccentric reducer";
  } else if (/seamless\s*pipe|\bSMLS\s*pipe\b/i.test(clean)) {
    res.product = "Seamless pipe";
  } else if (/welded\s*pipe|\bERW\s*pipe\b|\bEFW\s*pipe\b/i.test(clean)) {
    res.product = "Welded pipe";
  } else if (/\bpipe\b/i.test(clean)) {
    res.product = "Pipe";
  } else if (structuralMatch && structuralMatch[1] && structuralMatch[2]) {
    res.product = `Structural beam (${structuralMatch[1].toUpperCase()} ${structuralMatch[2]})`;
  } else if (/\bbeam\b/i.test(clean)) {
    res.product = "Structural beam";
  } else if (/\bcap\b/i.test(clean)) {
    res.product = "Pipe cap";
  } else if (/\bstub\s*end\b/i.test(clean)) {
    res.product = "Stub end";
  }

  // 6. Material / Grade Identification
  if (/Inconel\s*625/i.test(clean) || /UNS\s*N06625/i.test(clean) || /B564\s*N06625/i.test(clean) || /WP625/i.test(clean)) {
    res.material = "Inconel 625";
  } else if (/Inconel\s*600/i.test(clean) || /UNS\s*N06600/i.test(clean)) {
    res.material = "Inconel 600";
  } else if (/Incoloy\s*825/i.test(clean) || /UNS\s*N08825/i.test(clean)) {
    res.material = "Incoloy 825";
  } else if (/Hastelloy\s*C276/i.test(clean) || /UNS\s*N10276/i.test(clean) || /WPC276/i.test(clean)) {
    res.material = "Hastelloy C276";
  } else if (/Monel\s*400/i.test(clean) || /UNS\s*N04400/i.test(clean)) {
    res.material = "Monel 400";
  } else if (/Super\s*Duplex\s*2507/i.test(clean) || /S32750/i.test(clean) || /S32760/i.test(clean) || /F53\b/i.test(clean)) {
    res.material = "Super Duplex 2507";
  } else if (/Duplex\s*2205/i.test(clean) || /S32205/i.test(clean) || /S31803/i.test(clean) || /A790\s*S32205/i.test(clean) || /A182\s*F51/i.test(clean) || /2205\b/i.test(clean)) {
    res.material = "Duplex 2205";
  } else if (/A182\s*F316L/i.test(clean) || /F316L\b/i.test(clean) || /A403\s*WP316L/i.test(clean) || /WP316L\b/i.test(clean) || /A312\s*TP316L/i.test(clean) || /316L\b/i.test(clean) || /SS\s*316L/i.test(clean)) {
    res.material = "SS 316L";
  } else if (/316\b/i.test(clean) || /SS\s*316\b/i.test(clean)) {
    res.material = "SS 316";
  } else if (/304L\b/i.test(clean) || /SS\s*304L/i.test(clean)) {
    res.material = "SS 304L";
  } else if (/304\b/i.test(clean) || /SS\s*304\b/i.test(clean)) {
    res.material = "SS 304";
  } else if (/904L\b/i.test(clean) || /SS\s*904L/i.test(clean)) {
    res.material = "SS 904L";
  } else if (/IS\s*2062\s*E250/i.test(clean) || /IS\s*2062/i.test(clean)) {
    res.material = "IS 2062 E250";
  } else if (/ASTM\s*A106\s*(?:Gr\.?\s*B)?/i.test(clean) || /A106\s*B/i.test(clean)) {
    res.material = "ASTM A106 Gr. B";
  } else if (/A333\s*(?:Gr\.?\s*6)?/i.test(clean)) {
    res.material = "ASTM A333 Gr. 6";
  } else if (/A105N?\b/i.test(clean)) {
    res.material = "ASTM A105";
  } else if (/A350\s*LF2/i.test(clean)) {
    res.material = "ASTM A350 LF2";
  } else if (/A234\s*WPB/i.test(clean)) {
    res.material = "ASTM A234 WPB";
  } else if (/UPVC|CPVC|SWR/i.test(clean)) {
    res.material = "Industrial UPVC / CPVC";
  }

  return res;
}

/**
 * Parse any tabular or multi-line text input (Excel copy-paste, CSV, TSV)
 */
export function parseBoqTable(rawText: string): ParsedBoqLine[] {
  const rawRows = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!rawRows.length) return [];

  const firstRow = rawRows[0] || "";
  const headerTokens = parseCsvLine(firstRow).map((h) => h.toLowerCase());
  const hasHeaderRow = headerTokens.some((h) =>
    ["sr", "sl", "item", "description", "material", "grade", "product", "size", "nps", "class", "rating", "sch", "schedule", "qty", "quantity", "unit", "uom"].some((k) => h.includes(k))
  );

  let colMap = {
    desc: -1,
    material: -1,
    product: -1,
    size: -1,
    rating: -1,
    facing: -1,
    qty: -1,
    unit: -1,
    sr: -1,
  };

  if (hasHeaderRow) {
    headerTokens.forEach((token, idx) => {
      if (/^(sr|sl|sno|serial|no\b)/.test(token)) colMap.sr = idx;
      else if (token.includes("desc")) colMap.desc = idx;
      else if (token.includes("grade") || token.includes("material")) colMap.material = idx;
      else if (token.includes("product") || token.includes("item")) colMap.product = idx;
      else if (token.includes("size") || token.includes("nps") || token.includes("dia")) colMap.size = idx;
      else if (token.includes("class") || token.includes("rating") || token.includes("sch")) colMap.rating = idx;
      else if (token.includes("face") || token.includes("facing")) colMap.facing = idx;
      else if (token.includes("qty") || token.includes("quantity")) colMap.qty = idx;
      else if (token.includes("unit") || token.includes("uom")) colMap.unit = idx;
    });
  }

  const dataRows = hasHeaderRow ? rawRows.slice(1) : rawRows;
  const results: ParsedBoqLine[] = [];

  for (const row of dataRows) {
    const cols = parseCsvLine(row);
    if (!cols.length || cols.every((c) => !c)) continue;

    const getCol = (idx: number): string => (idx >= 0 && idx < cols.length && cols[idx] ? cols[idx].trim() : "");

    // Single composite description column or free-text row without headers
    if (cols.length === 1 || (!hasHeaderRow && cols.length === 1)) {
      const lineStr = (colMap.desc !== -1 ? getCol(colMap.desc) : cols[0]) || row;
      const parsed = parseDescriptionString(lineStr);
      results.push({
        material: parsed.material || "ASTM / ASME Alloy",
        product: parsed.product || "Piping Component",
        size: parsed.size || "—",
        rating: parsed.rating || "—",
        facing: parsed.facing || "",
        quantity: parsed.quantity || "1",
        unit: parsed.unit || "pcs",
        processing: [],
        raw: row,
      });
      continue;
    }

    const descText = colMap.desc !== -1 ? getCol(colMap.desc) : "";
    const parsedFromDesc = parseDescriptionString(descText || row);

    let rawSize = colMap.size !== -1 ? getCol(colMap.size) : "";
    let rawRating = colMap.rating !== -1 ? getCol(colMap.rating) : "";
    const rawQty = colMap.qty !== -1 ? getCol(colMap.qty) : "";
    const rawUnit = colMap.unit !== -1 ? getCol(colMap.unit) : "";

    // Check if rawSize contains both size and schedule e.g. '4" SCH 40S' or '6" SCH 40S'
    let finalSize = rawSize;
    let finalRating = rawRating;

    if (rawSize) {
      const schInSize = rawSize.match(/(SCH\s*\d+[A-Z]?|SCH\s*STD|SCH\s*XS|SCH\s*XXS)/i);
      if (schInSize) {
        if (!finalRating) {
          finalRating = schInSize[1].toUpperCase();
        }
        finalSize = rawSize.replace(schInSize[0], "").trim();
      }
    }

    // Normalize rating (e.g. '#150' -> 'Class 150', '3000#' stays '3000#')
    if (finalRating) {
      if (/^#\d+/.test(finalRating)) {
        const num = finalRating.replace("#", "");
        finalRating = Number(num) >= 2000 ? `${num}#` : `Class ${num}`;
      } else if (/^\d+#$/.test(finalRating)) {
        const num = finalRating.replace("#", "");
        finalRating = Number(num) >= 2000 ? `${num}#` : `Class ${num}`;
      }
    }

    const material = (colMap.material !== -1 ? getCol(colMap.material) : "") || parsedFromDesc.material || "ASTM / ASME Alloy";
    const product = (colMap.product !== -1 ? getCol(colMap.product) : "") || parsedFromDesc.product || "Piping Component";
    finalSize = finalSize || parsedFromDesc.size || "—";
    finalRating = finalRating || parsedFromDesc.rating || "—";
    const quantity = rawQty || parsedFromDesc.quantity || "1";
    const unit = rawUnit ? normalizeUnit(rawUnit) : (parsedFromDesc.unit || "pcs");

    results.push({
      material,
      product,
      size: finalSize,
      rating: finalRating,
      facing: parsedFromDesc.facing || "",
      quantity,
      unit,
      processing: [],
      raw: row,
    });
  }

  return results;
}
