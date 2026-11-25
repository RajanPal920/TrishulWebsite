import { useRouterState } from "@tanstack/react-router";
import { materialBySlug } from "@/data/materials";
import { productBySlug } from "@/data/products";
import { industryBySlug } from "@/data/industries";
import { articleBySlug } from "@/data/technical";

type HeroDetails = {
  src: string;
  eyebrow: string;
  title: string;
  alt: string;
};

// Exact mapping requested by user:
// 1st image: Home (handled by HomeHero)
// 2nd image: Materials
// 3rd image: Product, Directory
// 4th image: Processing, Live stock
// 5th image: CAD library
// 6th image: Tool, Technical, FAQ
// 7th image: Industries, Client
// 8th image: Quality
// 9th image: Contact
// 10th image: Landed cost

const staticHeroes: Record<string, HeroDetails> = {
  // 2nd image: Material
  "/materials": {
    src: "/images/heroes/hero-materials.jpg",
    eyebrow: "ALLOY MATERIAL AUTHORITY",
    title: "CRA Nickel, Duplex & Stainless Steel Grades",
    alt: "Alloy material authority - metallurgical testing laboratory",
  },

  // 3rd image: Product, Directory
  "/products": {
    src: "/images/heroes/hero-products.jpg",
    eyebrow: "ENGINEERED PRODUCT RANGE",
    title: "CRA Flanges, Pipe Fittings, Pipes & Tubes",
    alt: "Engineered product range - machined flanges and pipe fittings",
  },
  "/matrix": {
    src: "/images/heroes/hero-products.jpg",
    eyebrow: "MATERIAL × PRODUCT DIRECTORY",
    title: "Grade × Product Specification Matrix",
    alt: "Grade × product specification directory",
  },

  // 4th image: Processing, Live stock
  "/processing": {
    src: "/images/heroes/hero-processing.jpg",
    eyebrow: "TRISHUL METALS & ALLOYS",
    title: "Cut-to-Size, Bevelling & Processing Facility",
    alt: "Warehouse stockyard racks and processing facility",
  },
  "/stock": {
    src: "/images/heroes/hero-processing.jpg",
    eyebrow: "TRISHUL METALS & ALLOYS",
    title: "Live Stock Inventory · Kalamboli Warehouse",
    alt: "Live stock inventory at Kalamboli warehouse",
  },

  // 5th image: CAD library
  "/cad": {
    src: "/images/heroes/hero-cad.jpg",
    eyebrow: "CAD & BIM COMPONENT LIBRARY",
    title: "3D CAD Models & 2D Engineering Drawings",
    alt: "CAD and BIM component library with 3D model wireframe",
  },

  // 6th image: Tool, Technical, FAQ
  "/tools": {
    src: "/images/heroes/hero-tools.jpg",
    eyebrow: "ENGINEERING CALCULATORS & SELECTORS",
    title: "Pipe Weight, Pressure & Sizing Calculators",
    alt: "Engineering calculators, selectors and precision measuring instruments",
  },
  "/technical": {
    src: "/images/heroes/hero-tools.jpg",
    eyebrow: "ENGINEERING CALCULATORS & SELECTORS",
    title: "Technical Knowledge Centre & Specifications",
    alt: "Engineering knowledge centre, drawings and specifications",
  },
  "/faq": {
    src: "/images/heroes/hero-tools.jpg",
    eyebrow: "ENGINEERING CALCULATORS & SELECTORS",
    title: "Industrial Procurement & Technical FAQs",
    alt: "Industrial procurement and engineering answers",
  },

  // 7th image: Industries, Client
  "/industries": {
    src: "/images/heroes/hero-industries.jpg",
    eyebrow: "CRITICAL INDUSTRY APPLICATIONS",
    title: "Offshore, Marine, Desalination & Chemical Solutions",
    alt: "Critical industry applications - offshore platform and process piping",
  },
  "/clients": {
    src: "/images/heroes/hero-industries.jpg",
    eyebrow: "CRITICAL INDUSTRY APPLICATIONS",
    title: "Verified Client & EPC Project Track Record",
    alt: "Verified project supply and client installations",
  },

  // 8th image: Quality
  "/quality": {
    src: "/images/heroes/hero-quality.jpg",
    eyebrow: "INSPECTION · TESTING · TRACEABILITY",
    title: "ISO 9001:2015, MTC 3.1 & 3.2 Testing Dossiers",
    alt: "Inspection, testing and traceability metallurgical laboratory",
  },

  // 9th image: Contact
  "/contact": {
    src: "/images/heroes/hero-contact.jpg",
    eyebrow: "MUMBAI · WORLDWIDE",
    title: "Operational Headquarters & Despatch Desk",
    alt: "Procurement desk with drawings, tablet and documentation",
  },
  "/rfq": {
    src: "/images/heroes/hero-contact.jpg",
    eyebrow: "MUMBAI · WORLDWIDE",
    title: "Technical RFQ & Quotation Desk",
    alt: "Technical quotation desk",
  },
  "/shortlist": {
    src: "/images/heroes/hero-contact.jpg",
    eyebrow: "MUMBAI · WORLDWIDE",
    title: "Procurement Shortlist & Specifications",
    alt: "Procurement shortlist desk",
  },

  // 10th image: Landed cost
  "/landed-cost": {
    src: "/images/heroes/hero-landed-cost.jpg",
    eyebrow: "INCOTERMS · FREIGHT · LANDED COST",
    title: "Export Freight, Shipping & Landed Cost Calculator",
    alt: "Incoterms, freight and landed cost - warehouse shipping container dock",
  },
  "/portal": {
    src: "/images/heroes/hero-landed-cost.jpg",
    eyebrow: "INCOTERMS · FREIGHT · LANDED COST",
    title: "Order Tracking & Logistics Dossier Vault",
    alt: "Order tracking and logistics dossier vault",
  },
  "/about": {
    src: "/images/heroes/hero-processing.jpg",
    eyebrow: "ABOUT TRISHUL",
    title: "About Trishul Metals & Alloys",
    alt: "Mumbai warehouse and global dispatch facility",
  },
  "/vendor-registration": {
    src: "/images/heroes/hero-quality.jpg",
    eyebrow: "PROCUREMENT & ERP ONBOARDING",
    title: "Vendor Registration & Supplier Profile",
    alt: "Vendor registration and supplier onboarding profile",
  },
  "/rfq/confirmation": {
    src: "/images/heroes/hero-contact.jpg",
    eyebrow: "ENQUIRY CONFIRMATION",
    title: "Quotation Request Confirmed",
    alt: "Quotation request confirmed",
  },
};

function heroForPath(pathname: string): HeroDetails | null {
  if (pathname === "/") return null;
  const cleanPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const direct = staticHeroes[cleanPath];
  if (direct) return direct;

  const segments = cleanPath.split("/").filter(Boolean);
  if (segments[0] === "products") {
    const product = segments[1] ? productBySlug(segments[1]) : undefined;
    return {
      src: "/images/heroes/hero-products.jpg",
      eyebrow: "ENGINEERED PRODUCT RANGE",
      title: product ? `${product.name} — ${product.standards[0] || "Specifications"}` : "Engineered Product Range",
      alt: product ? product.name : "Engineered product range",
    };
  }

  if (segments[0] === "materials") {
    const material = segments[1] ? materialBySlug(segments[1]) : undefined;
    return {
      src: "/images/heroes/hero-materials.jpg",
      eyebrow: "ALLOY MATERIAL AUTHORITY",
      title: material ? `${material.name} (${material.uns})` : "Alloy Material Authority",
      alt: material ? material.name : "Alloy material authority",
    };
  }

  if (segments[0] === "industries") {
    const industry = segments[1] ? industryBySlug(segments[1]) : undefined;
    return {
      src: "/images/heroes/hero-industries.jpg",
      eyebrow: "CRITICAL INDUSTRY APPLICATIONS",
      title: industry ? `${industry.name} Solutions` : "Critical Industry Applications",
      alt: industry ? `${industry.name} Solutions — Critical Industry Applications` : "Critical industry applications",
    };
  }

  if (segments[0] === "technical") {
    const article = segments[1] ? articleBySlug(segments[1]) : undefined;
    return {
      src: "/images/heroes/hero-tools.jpg",
      eyebrow: "ENGINEERING CALCULATORS & SELECTORS",
      title: article ? article.title : "Technical Knowledge Centre",
      alt: article ? article.title : "Technical knowledge centre",
    };
  }

  return {
    src: "/images/heroes/hero-processing.jpg",
    eyebrow: "TRISHUL METALS & ALLOYS",
    title: "Critical CRA Piping Supply",
    alt: "Trishul Metals & Alloys",
  };
}

export function RouteHero() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hero = heroForPath(pathname);
  if (!hero) return null;

  return (
    <aside
      aria-label="Page context"
      className="route-hero relative isolate h-44 overflow-hidden border-b border-border sm:h-52 lg:h-60"
    >
      {/* 100% clearly visible hero image without darkening overlay */}
      <img
        src={hero.src}
        alt={hero.alt}
        width={1024}
        height={225}
        fetchPriority="high"
        className="h-full w-full object-cover object-center"
      />

      {/* Sleek bottom title pill: crystal-clear text that doesn't hide the hero image */}
      <div className="absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-7xl items-end px-5 pb-3 md:px-10 md:pb-4">
        <div className="max-w-2xl rounded-sm bg-background/85 px-3.5 py-1.5 backdrop-blur-md border border-border/80 shadow-xl">
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            {hero.eyebrow}
          </p>
          <p className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-foreground">
            {hero.title}
          </p>
        </div>
      </div>
    </aside>
  );
}
