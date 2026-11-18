import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { company } from "@/data/company";

const BASE_URL = company.siteUrl;

const body = `# ${company.name}

${company.description}

## What we supply
- Corrosion-Resistant Alloy (CRA) piping components: nickel alloys (Inconel, Incoloy, Monel, Hastelloy), duplex and super duplex stainless steel, plus supporting austenitic stainless grades.
- Product forms: flanges (weld neck, slip-on, blind, socket weld, threaded, lap joint, orifice, long weld neck, spectacle blinds), butt weld and forged fittings, seamless and welded pipe, tube, bar, plate, sheet and coil.
- Supporting product lines: carbon and low-temperature steel (ASTM A106, A53, API 5L, A333, A105, A350, A234, A420, A516) and PVC / UPVC / CPVC / SWR piping manufactured by sister concern Apex Polymer & Engineering.
- Standards: ASTM / ASME material standards, ASME B16.5, B16.9, B16.11, B16.25, B16.47; NACE MR0175 / ISO 15156 compliant supply on request; materials sourced against applicable NORSOK M-630 Material Data Sheets (specification, not a held certification).
- Documentation: EN 10204 3.1 (and 3.2 where specified) mill test certificates with heat-number traceability, chemical and mechanical test reports, heat-treatment records, NDT and corrosion testing records, third-party inspection release notes (SGS, BV, Intertek, TUV, Lloyd's).

## Value-added processing
- Cut-to-size supply instead of random mill lengths.
- Precision saw cutting to exact lengths with square-faced ends.
- End bevelling to ASME B16.25 weld-prep requirements.
- Rough machining, boring and facing from bar, pipe or forged blanks.
- Cut-to-drawing sub-components machined to customer drawings and tolerances.

## Sectors served
Oil & gas (onshore and offshore), subsea, refinery, petrochemical, LNG and cryogenic, desalination and seawater systems, marine, power generation, fertiliser and chemical process plants, railway and heavy industrial.

## Key pages
- ${BASE_URL}/ — Overview of CRA grades, capabilities and buyer tools.
- ${BASE_URL}/materials — Grade-by-grade material pages with composition, mechanical and corrosion data.
- ${BASE_URL}/products — Product forms: flanges, fittings, pipes, tubes, bars and plates.
- ${BASE_URL}/processing — Custom cutting, end bevelling, machining and cut-to-size components by sector.
- ${BASE_URL}/matrix — Material x product combinations with specifications for each pairing.
- ${BASE_URL}/rfq — Request for quotation builder with per-line processing options and MTO/drawing upload.
- ${BASE_URL}/quality — Quality system, inspection, testing and certification scope.
- ${BASE_URL}/contact — Office address, enquiry contacts and working hours.

## Contact
- Email: ${company.email}
- Export enquiries: ${company.exportEmail}
- Phone: ${company.phone}
- Office address: ${company.addressLine}
- Warehouse: ${company.warehouseLine}
- Hours: ${company.hours}
`;

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
