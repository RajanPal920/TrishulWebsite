import { Link } from "@tanstack/react-router";
import { Section, SectionHead } from "@/components/site/parts";
import { Layers, Disc, Box, ShieldCheck, Cpu, ArrowUpRight, Wrench } from "lucide-react";

interface SourcingFamily {
  title: string;
  category: string;
  description: string;
  standards: string;
  href: string;
  badge?: string;
  icon: typeof Layers;
}

const sourcingFamilies: SourcingFamily[] = [
  {
    title: "CRA Piping & Flanges",
    category: "High-Alloy Systems",
    description: "Inconel, Monel, Hastelloy, Duplex 2205, Super Duplex 2507, 904L, Alloy 20 and austenitic stainless components.",
    standards: "ASME B16.5, B16.9, B16.11, ASTM A182, A403, A790, B622",
    href: "/products#flanges",
    icon: Disc,
  },
  {
    title: "Carbon Steel Process Piping",
    category: "Heavy Wall & Line Pipe",
    description: "Seamless and welded pipes for refinery, petrochemical, and power lines including high-pressure and low-temperature service.",
    standards: "ASTM A106 Gr B, A53, A333 Gr 6 (-46°C), API 5L X52/X60/X65",
    href: "/products/seamless-pipes",
    icon: Box,
  },
  {
    title: "Heavy Structural Steel",
    category: "Industrial Infrastructure",
    description: "Standard and wide-flange beams, columns, channels, angles, and plates for plant structures, skid bases, and offshore modules.",
    standards: "ISMB, ISHB, UB, UC, HEA, HEB to IS 2062, EN 10025, ASTM A36",
    href: "/products/structural-beams-ismb-ishb-ub-uc-hea-heb",
    icon: Layers,
  },
  {
    title: "Plates, Sheets & Round Bars",
    category: "Forgings & Mill Stock",
    description: "CRA and carbon steel plates cut to profile, along with forged round bars for machining flanges, fittings, and valve bodies.",
    standards: "ASTM A240, ASTM A516 Gr 70, EN 10028, forged rounds up to 450mm Ø",
    href: "/products",
    icon: ShieldCheck,
  },
  {
    title: "Apex Polymer & Engineering",
    category: "Modi Group Sister Concern",
    description: "Industrial UPVC, CPVC, and SWR piping systems, solvent cements, and fluid handling engineered plastic fittings.",
    standards: "ASTM D1785, ASTM F441, IS 4985, IS 13592, DIN 8062",
    href: "/products#pvc-piping",
    badge: "Modi Group Unit",
    icon: Cpu,
  },
  {
    title: "Cut-to-Size & Value-Add Processing",
    category: "In-House Service",
    description: "Heavy bandsaw cut-to-length, weld bevel preparation, positive material identification (PMI), and witnessed TPI coordination.",
    standards: "MSS SP-25 marking, EN 10204 3.1 certification, SGS/TUV inspection",
    href: "/quality",
    icon: Wrench,
  },
];

export function HomeSourcingScope() {
  return (
    <Section className="border-t border-border bg-card/20">
      <SectionHead
        eyebrow="Integrated Procurement Scope"
        title="One Source for Total Project Materials"
        intro="Consolidate critical corrosion-resistant alloys, bulk carbon steel, heavy structural steel, and industrial polymer piping under a single vetted supply chain with unified inspection dossiers."
      />

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sourcingFamilies.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.href}
              className="group surface-panel relative flex flex-col justify-between rounded-lg border border-border p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background/80 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  {item.badge ? (
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {item.badge}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {item.category}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>{item.title}</span>
                  <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 text-primary shrink-0 ml-2" />
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 border-t border-border/60 pt-3">
                <p className="font-mono text-[11px] text-foreground/80 font-medium">
                  {item.standards}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
