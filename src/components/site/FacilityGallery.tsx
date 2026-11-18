import warehouseRacks from "@/assets/warehouse-racks.jpg";
import exportCrates from "@/assets/export-crates.jpg";
import mtcDossier from "@/assets/mtc-dossier.jpg";
import catalogueStockRacks from "@/assets/home/stock-rack-study-1200.webp";
import catalogueExportPacking from "@/assets/home/export-packing-study-1200.webp";
import catalogueInspectionDossier from "@/assets/home/inspection-dossier-study-1200.webp";
import { company } from "@/data/company";

const shots = [
  {
    src: warehouseRacks,
    alt: "Stock racks of seamless pipes and tubes with colour-coded, heat-number tagged bundles at the Trishul Metals stockyard",
    title: "Stockyard racking",
    body: "Bundled pipe and tube stock held on segregated racks, each bundle tagged to its heat number so material is identified before it is cut.",
  },
  {
    src: exportCrates,
    alt: "Stainless steel flanges and butt weld fittings stamped with heat numbers, stacked on stencilled plywood export crates",
    title: "Export packing",
    body: "Flanges and fittings hard-stamped with grade, spec and heat number, packed into fumigated plywood cases with stencilled shipping marks.",
  },
  {
    src: mtcDossier,
    alt: "Printed EN 10204 3.1 inspection certificate dossier beside a pipe offcut with a heat number tag and inspection stamp",
    title: "Dispatch dossier",
    body: "Every consignment leaves with a bound dossier: EN 10204 3.1 certificates, test reports, dimensional records and the TPI release note.",
  },
];

const homepageShots = [
  {
    src: catalogueStockRacks,
    alt: "Orderly bundles of polished seamless alloy pipe held on heavy-duty stock racks",
    title: "Stockyard racking",
    body: "Bundled pipe and tube stock held on segregated racks, each bundle tagged to its heat number so material is identified before it is cut.",
  },
  {
    src: catalogueExportPacking,
    alt: "Precision alloy components arranged for protected export packing and dispatch",
    title: "Export packing",
    body: "Flanges and fittings hard-stamped with grade, spec and heat number, packed into fumigated plywood cases with stencilled shipping marks.",
  },
  {
    src: catalogueInspectionDossier,
    alt: "Alloy component beside an inspection dossier and quality-control instruments",
    title: "Dispatch dossier",
    body: "Every consignment leaves with a bound dossier: EN 10204 3.1 certificates, test reports, dimensional records and the TPI release note.",
  },
];

export function FacilityGallery({ catalogueGrade = false }: { catalogueGrade?: boolean }) {
  const galleryShots = catalogueGrade ? homepageShots : shots;
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {galleryShots.map((s) => (
        <figure key={s.title} className="surface-panel overflow-hidden rounded-md">
          <img
            src={s.src}
            alt={s.alt}
            loading="lazy"
            decoding="async"
            width={1536}
            height={1024}
            className={catalogueGrade ? "home-catalogue-image h-52 w-full object-cover" : "h-52 w-full object-cover"}
          />
          <figcaption className="px-5 py-4">
            <p className="font-display text-base font-semibold">{s.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </figcaption>
        </figure>
      ))}
      <p className="md:col-span-3 text-xs text-muted-foreground">
        Ready stock is held at {company.warehouseLine}. Warehouse and inspection visits can be arranged for buyers
        and third-party inspection agencies on request.
      </p>
    </div>
  );
}
