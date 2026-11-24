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
  facing: string;
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
  if (/^(mtr|m|meter|meters|linear\s*m|r\.?m\.?)$/i.test(u)) return "mtr";
  if (/^(kg|kgs|kilo|kilograms)$/i.test(u)) return "kg";
  if (/^(mt|metric\s*ton|metric\s*tons|ton|tons|tonnes)$/i.test(u)) return "tons";
  if (/^(sets?|lot|pkg)$/i.test(u)) return "set";
  return "pcs";
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

  // 2. Size extraction (e.g. 4", 6", 1", 1/2", 3/4", 2.5", 100mm, or structural designation ISMB 300)
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
  // Class: #150, 150#, Class 150, 3000#, Class 3000
  const classMatch = clean.match(/(?:class|#)\s*(150|300|600|900|1500|2500|3000|6000|9000)\b|\b(150|300|600|900|1500|2500|3000|6000|9000)#/i);
  // Schedule: SCH 40S, SCH 80, SCH STD, SCH XXS
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
  } else if (/Duplex\s*2205/i.test(clean) || /S32205/i.test(clean) || /S31803/i.test(clean) || /A790\s*S32205/i.test(clean) || /F51\b/i.test(clean)) {
    res.material = "Duplex 2205";
  } else if (/A182\s*F316L/i.test(clean) || /A403\s*WP316L/i.test(clean) || /A312\s*TP316L/i.test(clean) || /316L\b/i.test(clean) || /SS\s*316L/i.test(clean)) {
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

  // Determine delimiter (\t or ,)
  const firstRow = rawRows[0] || "";
  const isTsv = firstRow.includes("\t");

  const splitRow = (row: string): string[] => {
    if (isTsv) {
      return row.split("\t").map((c) => c.trim().replace(/^["']|["']$/g, ""));
    }
    // CSV with quotes support
    return (row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || row.split(",")).map((c) =>
      c.trim().replace(/^["']|["']$/g, "")
    );
  };

  const headerTokens = splitRow(firstRow).map((h) => h.toLowerCase());
  const hasHeaderRow = headerTokens.some((h) =>
    ["sr", "sl", "item", "description", "material", "grade", "product", "size", "nps", "class", "rating", "sch", "schedule", "qty", "quantity", "unit"].some((k) => h.includes(k))
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
    const cols = splitRow(row);
    if (!cols.length || cols.every((c) => !c)) continue;

    const getCol = (idx: number): string => (idx >= 0 && idx < cols.length && cols[idx] ? cols[idx] : "");

    // Single composite description column or free-text row
    if (cols.length === 1 || (hasHeaderRow && colMap.desc !== -1 && getCol(colMap.desc) && colMap.material === -1)) {
      const lineStr = (colMap.desc !== -1 ? getCol(colMap.desc) : cols[0]) || row;
      const parsed = parseDescriptionString(lineStr);
      results.push({
        material: parsed.material || "ASTM / ASME Alloy",
        product: parsed.product || "Piping Component",
        size: parsed.size || getCol(colMap.size),
        rating: parsed.rating || getCol(colMap.rating),
        facing: parsed.facing || getCol(colMap.facing),
        quantity: parsed.quantity || (colMap.qty !== -1 ? getCol(colMap.qty) : "1") || "1",
        unit: parsed.unit || (colMap.unit !== -1 ? normalizeUnit(getCol(colMap.unit)) : "pcs") || "pcs",
        processing: [],
        raw: row,
      });
      continue;
    }

    // Multi-column mapping
    let lineObj: ParsedBoqLine = {
      material: "",
      product: "",
      size: "",
      rating: "",
      facing: "",
      quantity: "",
      unit: "pcs",
      processing: [],
      raw: row,
    };

    if (hasHeaderRow) {
      if (getCol(colMap.material)) lineObj.material = getCol(colMap.material);
      if (getCol(colMap.product)) lineObj.product = getCol(colMap.product);
      if (getCol(colMap.size)) lineObj.size = getCol(colMap.size);
      if (getCol(colMap.rating)) lineObj.rating = getCol(colMap.rating);
      if (getCol(colMap.facing)) lineObj.facing = getCol(colMap.facing);
      if (getCol(colMap.qty)) lineObj.quantity = getCol(colMap.qty);
      if (getCol(colMap.unit)) lineObj.unit = normalizeUnit(getCol(colMap.unit));
    }

    // Fallback/enrich from full text if critical fields are blank
    const enriched = parseDescriptionString(row);
    lineObj.material = lineObj.material || enriched.material || "";
    lineObj.product = lineObj.product || enriched.product || "";
    lineObj.size = lineObj.size || enriched.size || "";
    lineObj.rating = lineObj.rating || enriched.rating || "";
    lineObj.facing = lineObj.facing || enriched.facing || "";
    lineObj.quantity = lineObj.quantity || enriched.quantity || "1";
    lineObj.unit = lineObj.unit && lineObj.unit !== "pcs" ? lineObj.unit : (enriched.unit || "pcs");

    // If still blank, inspect columns by heuristics
    if (!lineObj.material || !lineObj.product) {
      for (let i = 0; i < cols.length; i++) {
        if (i === colMap.sr) continue;
        const c = cols[i];
        if (!c) continue;
        const sub = parseDescriptionString(c);
        if (sub.material && !lineObj.material) lineObj.material = sub.material;
        if (sub.product && !lineObj.product) lineObj.product = sub.product;
        if (sub.size && !lineObj.size) lineObj.size = sub.size;
        if (sub.rating && !lineObj.rating) lineObj.rating = sub.rating;
      }
    }

    if (!lineObj.product) lineObj.product = "Piping Component";
    if (!lineObj.material) lineObj.material = "ASTM / ASME Alloy";

    results.push(lineObj);
  }

  return results;
}
