/**
 * Technical icon set.
 *
 * Thin-line, square-ended, blueprint-style marks drawn in the site's own
 * visual language. One wrapper controls size, stroke width and colour so
 * every icon on the site stays consistent.
 */

export type TechIconName =
  // Why Trishul
  | "traceability"
  | "specification"
  | "inspection"
  | "testing"
  | "drawing"
  | "export-docs"
  // Where we export
  | "offshore"
  | "standards"
  | "verification"
  | "globe"
  // Buyer tools
  | "cad"
  | "landed-cost"
  | "stock"
  | "proof"
  | "portal"
  | "calculator";

const PATHS: Record<TechIconName, React.ReactNode> = {
  // ---- Why Trishul -------------------------------------------------------
  // Heat-number tag with eyelet
  traceability: (
    <>
      <path d="M3 5h11l7 7-7 7H3z" />
      <path d="M6.5 12h.01" />
      <path d="M10 9.5h6" />
      <path d="M10 14.5h4" />
    </>
  ),
  // Specification sheet under review
  specification: (
    <>
      <path d="M4 3h10l6 6v12H4z" />
      <path d="M14 3v6h6" />
      <path d="M7.5 13l2 2 4.5-4.5" />
    </>
  ),
  // Inspection dossier: stacked records
  inspection: (
    <>
      <path d="M7 3h13v15H7z" />
      <path d="M4 6v15h13" />
      <path d="M10.5 8h6.5" />
      <path d="M10.5 12h6.5" />
    </>
  ),
  // PMI crosshair
  testing: (
    <>
      <path d="M12 3v3.5" />
      <path d="M12 17.5V21" />
      <path d="M3 12h3.5" />
      <path d="M17.5 12H21" />
      <circle cx="12" cy="12" r="5.5" />
      <path d="M12 10.5v3" />
    </>
  ),
  // Dimension / caliper mark
  drawing: (
    <>
      <path d="M3 7v10" />
      <path d="M21 7v10" />
      <path d="M3 12h18" />
      <path d="M7 9l-3 3 3 3" />
      <path d="M17 9l3 3-3 3" />
    </>
  ),
  // Export crate with banding
  "export-docs": (
    <>
      <path d="M3 7l9-4 9 4v10l-9 4-9-4z" />
      <path d="M3 7l9 4 9-4" />
      <path d="M12 11v10" />
    </>
  ),

  // ---- Where we export ---------------------------------------------------
  // Offshore platform
  offshore: (
    <>
      <path d="M5 21h14" />
      <path d="M7 21V11h10v10" />
      <path d="M7 11l5-8 5 8" />
      <path d="M9.5 15h5" />
    </>
  ),
  // Dual standards frames
  standards: (
    <>
      <path d="M3 4h12v12H3z" />
      <path d="M9 8h12v12H9z" />
    </>
  ),
  // Verification: magnifier over a record line
  verification: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L21 21" />
      <path d="M7.5 10.5l2.2 2.2 3.8-4" />
    </>
  ),
  // Technical globe with meridians
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3 3 3 15 0 18" />
      <path d="M12 3c-3 3-3 15 0 18" />
    </>
  ),

  // ---- Buyer tools -------------------------------------------------------
  // Wireframe cube
  cad: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5" />
      <path d="M12 12v9" />
    </>
  ),
  // Container ship profile
  "landed-cost": (
    <>
      <path d="M3 16h18l-2.5 5H5.5z" />
      <path d="M6 16V9h12v7" />
      <path d="M10 9V5h4v4" />
      <path d="M12 9v7" />
    </>
  ),
  // Pipe ends on a rack
  stock: (
    <>
      <path d="M3 3v18" />
      <path d="M21 3v18" />
      <path d="M3 12h18" />
      <path d="M3 21h18" />
      <circle cx="8" cy="7.5" r="2.5" />
      <circle cx="14.5" cy="16.5" r="2.5" />
    </>
  ),
  // Record with release stamp
  proof: (
    <>
      <path d="M5 3h9l5 5v13H5z" />
      <path d="M14 3v5h5" />
      <path d="M8.5 14h7" />
      <path d="M8.5 17.5h4" />
    </>
  ),
  // Secured dossier vault
  portal: (
    <>
      <path d="M4 10h16v11H4z" />
      <path d="M7.5 10V6.5a4.5 4.5 0 019 0V10" />
      <path d="M12 14v3" />
    </>
  ),
  // Keypad grid
  calculator: (
    <>
      <path d="M5 3h14v18H5z" />
      <path d="M8 7h8" />
      <path d="M8.5 12h.01" />
      <path d="M12 12h.01" />
      <path d="M15.5 12h.01" />
      <path d="M8.5 16.5h.01" />
      <path d="M12 16.5h.01" />
      <path d="M15.5 16.5h.01" />
    </>
  ),
};

export function TechIcon({
  name,
  className = "",
  size = 20,
}: {
  name: TechIconName;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={`tech-icon shrink-0 ${className}`}
    >
      {PATHS[name]}
    </svg>
  );
}
