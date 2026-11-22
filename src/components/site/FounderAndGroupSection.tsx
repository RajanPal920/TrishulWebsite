import { Phone, Mail, ArrowUpRight, ShieldCheck, Building2 } from "lucide-react";
import { Eyebrow } from "@/components/site/parts";

interface GroupCompany {
  name: string;
  email: string;
  logo: string;
  logoAlt: string;
  role: string;
}

const GROUP_COMPANIES: GroupCompany[] = [
  {
    name: "ALLOYAAGE PRODUCTS",
    email: "alloyaageproduct@gmail.com",
    logo: "/brand/modi-group/logo-alloyaage-transparent.png",
    logoAlt: "Alloyaage Products Logo",
    role: "Art of Alloying Metals & Sourcing",
  },
  {
    name: "METALLOYS INC",
    email: "metalloysinc@gmail.com",
    logo: "/brand/modi-group/logo-metalloys-inc-transparent.png",
    logoAlt: "Metalloys Inc Logo",
    role: "Specialty Alloys & Industrial Supplies",
  },
  {
    name: "TRISHUL METALS & ALLOYS",
    email: "export@trishulmetal.com",
    logo: "/brand/modi-group/logo-trishul-metal-transparent.png",
    logoAlt: "Trishul Metals & Alloys Logo",
    role: "Critical CRA Piping Components & Flanges",
  },
  {
    name: "APEX POLYMER & ENGINEERING",
    email: "apexpolymereng@gmail.com",
    logo: "/brand/modi-group/logo-apex-polymer-transparent.png",
    logoAlt: "Apex Polymer & Engineering Logo",
    role: "Polymer Engineering & Flow Solutions",
  },
];

export function FounderAndGroupSection() {
  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="max-w-3xl">
        <Eyebrow>Leadership &amp; Group Heritage</Eyebrow>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          Pioneering Metallurgy &amp; Allied Solutions
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          Under the visionary leadership of Mr. Ramesh Modi, Modi Group of Industries operates as an integrated
          industrial ecosystem delivering world-class manufacturing, specialized metallurgy, and comprehensive
          procurement solutions across global markets.
        </p>
      </div>

      {/* Two Connected Corporate Cards */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* ======================================================== */}
        {/* 1. FOUNDER PROFILE — RAMESH MODI                         */}
        {/* ======================================================== */}
        <div className="relative overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-b from-[#0e1620] via-[#0b1219] to-[#070b10] p-6 shadow-2xl transition-all duration-300 hover:border-primary/50 sm:p-8">
          {/* Subtle Corner Brackets for Luxury Metallic Presentation */}
          <div className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-primary/40" />
          <div className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-primary/40" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-primary/40" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-primary/40" />

          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            {/* RM Monogram Emblem */}
            <div className="flex h-20 items-center justify-center">
              <img
                src="/brand/modi-group/ramesh-modi-monogram-transparent.png"
                alt="RM — Ramesh Modi Monogram"
                className="max-h-16 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(201,165,90,0.25)] transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Founder Name & Title */}
            <div className="mt-4">
              <h3 className="font-display text-2xl font-bold tracking-[0.14em] text-foreground sm:text-3xl">
                RAMESH MODI
              </h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.24em] text-primary">
                GROUP FOUNDER &amp; PRINCIPAL
              </p>
            </div>

            {/* Elegant Metallic Divider */}
            <div className="my-6 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            {/* Experience Statement */}
            <div className="max-w-md px-2">
              <p className="text-base font-medium leading-relaxed text-foreground/90 sm:text-lg">
                3 Decades of Metallurgy Industrial Excellence in Global Sourcing &amp; Manufacturing
              </p>
            </div>

            {/* Subtle Divider */}
            <div className="my-6 h-px w-3/4 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {/* Direct Contact Links */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <a
                href="tel:+919833358382"
                className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-2 font-mono text-xs text-foreground transition-all duration-200 hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                title="Call Ramesh Modi"
              >
                <Phone className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span>+91 9833358382</span>
              </a>

              <a
                href="mailto:alloyaageproduct@gmail.com"
                className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-2 font-mono text-xs text-foreground transition-all duration-200 hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                title="Email Ramesh Modi"
              >
                <Mail className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
                <span>alloyaageproduct@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. MODI GROUP OF INDUSTRIES                              */}
        {/* ======================================================== */}
        <div className="relative overflow-hidden rounded-lg border border-primary/30 bg-gradient-to-b from-[#0e1620] via-[#0b1219] to-[#070b10] p-6 shadow-2xl transition-all duration-300 hover:border-primary/50 sm:p-8">
          {/* Subtle Corner Brackets */}
          <div className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-primary/40" />
          <div className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-primary/40" />
          <div className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-primary/40" />
          <div className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-primary/40" />

          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative">
            {/* Top Logos Showcase Banner */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 pb-3">
              <img
                src="/brand/modi-group/logo-trishul-metal-transparent.png"
                alt="Trishul Metals & Alloys Emblem"
                className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-105"
                loading="lazy"
              />
              <img
                src="/brand/modi-group/logo-apex-polymer-transparent.png"
                alt="Apex Polymer & Engineering Logo"
                className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-105"
                loading="lazy"
              />
              <img
                src="/brand/modi-group/logo-alloyaage-transparent.png"
                alt="Alloyaage Products Logo"
                className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-105"
                loading="lazy"
              />
              <img
                src="/brand/modi-group/logo-metalloys-inc-transparent.png"
                alt="Metalloys Inc Logo"
                className="h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Group Header */}
            <div className="mt-3 text-center">
              <h3 className="font-display text-xl font-bold tracking-[0.14em] text-foreground sm:text-2xl">
                MODI GROUP OF INDUSTRIES
              </h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Manufacturing • Sourcing • Procurement Solutions
              </p>
            </div>

            {/* Elegant Divider */}
            <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {/* Group Companies Structured List */}
            <div className="divide-y divide-border/60">
              {GROUP_COMPANIES.map((company) => (
                <div
                  key={company.name}
                  className="group flex flex-col justify-between gap-2 py-3 sm:flex-row sm:items-center sm:gap-4 transition-colors hover:bg-card/30 rounded px-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-border/80 bg-card/60 p-1">
                      <img
                        src={company.logo}
                        alt={company.logoAlt}
                        className="max-h-7 max-w-7 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <span className="font-display text-xs font-bold tracking-wide text-foreground group-hover:text-primary transition-colors sm:text-sm">
                        {company.name}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`mailto:${company.email}`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                    title={`Email ${company.name}`}
                  >
                    <Mail className="h-3 w-3 shrink-0 text-primary/80" />
                    <span className="break-all sm:break-normal">{company.email}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
