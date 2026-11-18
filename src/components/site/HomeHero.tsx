import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/site/parts";
import { MagneticAction } from "@/components/site/InteractionMotion";

const capabilities = [
  "Precision saw cutting",
  "End bevelling (ASME B16.25)",
  "Rough machining, boring & facing",
  "Cut-to-drawing components",
];

// Smooth count up animation that runs from initial (0) to final (end) whenever scrolled into view
function CountUp({
  end,
  suffix = "",
  divisor = 1,
  duration = 1400,
}: {
  end: number;
  suffix?: string;
  divisor?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(end);

  useEffect(() => {
    let frame = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);

  return (
    <span ref={ref}>
      {divisor === 1 ? value : (value / divisor).toFixed(1)}
      {suffix}
    </span>
  );
}

export function HomeHero() {
  return (
    <section className="home-grain relative isolate overflow-hidden border-b border-border px-5 pt-3 pb-8 md:px-10 md:pt-5 md:pb-10 lg:pt-6 lg:pb-12">
      {/* 100% clearly visible hero image without darkening overlay */}
      <picture className="absolute inset-0 -z-30">
        <img
          src="/images/heroes/hero-home.jpg"
          alt="Heat-number tagged corrosion-resistant alloy pipe inventory arranged in warehouse racks"
          width={1024}
          height={441}
          fetchPriority="high"
          className="home-catalogue-image h-full w-full object-cover object-right md:object-right-top"
        />
      </picture>

      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-6 sm:gap-8">
        {/* High-contrast content panel ensuring 100% crystal-clear readability */}
        <div className="max-w-3xl rounded-lg bg-background/95 p-5 sm:p-7 lg:p-8 border border-border/80 shadow-2xl backdrop-blur-md">
          <Eyebrow>Established supply · Mumbai, India · Global export</Eyebrow>

          <div className="mt-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.08] drop-shadow-md">
              Critical alloy piping components.
              <span className="mt-1.5 block text-primary font-semibold">Engineered around your specification.</span>
            </h1>
          </div>

          <div aria-hidden className="mt-5 h-0.5 w-24 bg-primary" />

          <p className="mt-5 text-sm sm:text-base leading-relaxed text-zinc-100 font-normal">
            Nickel alloy, duplex, super duplex and stainless steel Corrosion-Resistant Alloy (CRA) flanges and pipe fittings supplied against ASTM, ASME, NACE and applicable NORSOK M-630 requirements, with heat-traceable EN 10204 3.1 documentation.
          </p>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-zinc-300 font-normal">
            Materials available against applicable NORSOK M-630 requirements, subject to grade, product form, applicable MDS and manufacturer qualification.
          </p>

          <p className="mt-4 text-sm sm:text-base font-medium leading-relaxed text-white">
            Supplied cut-to-size, saw-cut to exact lengths, end-bevelled and pre-machined to your drawing — so you skip in-house cutting waste and local machining delays.
          </p>

          <div className="mt-5 border-l-2 border-primary bg-card/90 px-4 py-3 rounded-r-sm shadow-md">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-primary font-semibold">Custom cutting &amp; machining</p>
            <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs sm:text-sm leading-relaxed text-zinc-200">
              {capabilities.map((capability, index) => (
                <span key={capability} className="flex items-baseline gap-x-2">
                  {index > 0 ? <span aria-hidden className="text-primary">·</span> : null}
                  <span>{capability}</span>
                </span>
              ))}
              <span className="text-zinc-400">— supply your length, tolerance or drawing.</span>
            </p>
            <Link to="/processing" className="mt-2.5 inline-flex items-center text-xs sm:text-sm font-semibold text-primary transition-opacity hover:opacity-80">
              See our processing capabilities →
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <MagneticAction>
              <Link to="/rfq" className="rounded-sm bg-primary px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-opacity hover:opacity-90">
                Request cut-to-size quotation
              </Link>
            </MagneticAction>
            <MagneticAction>
              <Link to="/materials" className="rounded-sm border border-primary/60 bg-background/60 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary backdrop-blur-sm transition-colors hover:bg-primary/10">
                Browse 28 CRA grades
              </Link>
            </MagneticAction>
          </div>
        </div>

        {/* Dynamic Stats Band: CountUp animates on scroll from 0 to final target */}
        <dl className="grid grid-cols-2 rounded-md border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-md lg:grid-cols-4">
          <div className="border-r border-b border-border/80 p-4 sm:p-5 lg:border-b-0">
            <dt className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-primary">
              <CountUp end={28} />
            </dt>
            <dd className="mt-1 text-xs sm:text-sm font-medium text-foreground">CRA grades documented</dd>
            <p className="mt-0.5 text-[11px] text-muted-foreground">+ 8 supporting stainless grades</p>
          </div>

          <div className="border-b border-border/80 p-4 sm:p-5 lg:border-r lg:border-b-0">
            <dt className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-primary">
              <CountUp end={18} />
            </dt>
            <dd className="mt-1 text-xs sm:text-sm font-medium text-foreground">Flange &amp; fitting types</dd>
          </div>

          <div className="border-r border-border/80 p-4 sm:p-5">
            <dt className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-primary">
              <CountUp end={150} /> – <CountUp end={2500} duration={1600} />
            </dt>
            <dd className="mt-1 text-xs sm:text-sm font-medium text-foreground">Pressure classes supplied</dd>
          </div>

          <div className="p-4 sm:p-5">
            <dt className="font-display text-2xl sm:text-3xl font-bold text-primary">
              EN 10204 <CountUp end={31} divisor={10} />
            </dt>
            <dd className="mt-1 text-xs sm:text-sm font-medium text-foreground">Certification standard</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
