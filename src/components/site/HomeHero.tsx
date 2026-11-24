import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import craHero1920 from "@/assets/heroes/hero-home.jpg";
import craHero1280 from "@/assets/heroes/hero-home.jpg";

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
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* Background Warehouse Rack Image */}
      <picture className="absolute inset-0 -z-30 pointer-events-none select-none">
        <source srcSet={craHero1280} media="(max-width: 1024px)" />
        <img
          src={craHero1920}
          alt="Heat-number tagged corrosion-resistant alloy pipe inventory arranged in warehouse racks"
          width={1920}
          height={1088}
          fetchPriority="high"
          className="h-full w-full object-cover object-right"
        />
      </picture>

      {/* Horizontal Dark Gradient Overlay: Deep black on left for crystal-clear readability, fading to reveal pipes on right */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-r from-background via-background/90 to-background/25 pointer-events-none"
      />

      {/* Vertical Subtle Bottom Gradient to anchor the stats */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none"
      />

      {/* Engineering Blueprint / CAD Grid Overlay matching reference design */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between px-5 pt-8 pb-8 sm:px-8 sm:pt-10 sm:pb-10 lg:px-10 lg:pt-12 lg:pb-12">
        {/* Main Content Column directly on background gradient */}
        <div className="max-w-2xl lg:max-w-3xl">
          <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-primary font-semibold">
            Established supply · Mumbai, India · Global export
          </p>

          <h1 className="mt-3.5 sm:mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.6rem] font-bold tracking-tight leading-[1.08]">
            <span className="text-white block">Critical alloy piping</span>
            <span className="text-white block">components.</span>
            <span className="text-primary block mt-1">Engineered around</span>
            <span className="text-primary block">your specification.</span>
          </h1>

          <p className="mt-4 sm:mt-5 text-xs sm:text-sm md:text-[14.5px] leading-relaxed text-[#F5F5F5] font-normal">
            Nickel alloy, duplex, super duplex and stainless steel Corrosion-Resistant Alloy (CRA) flanges and pipe fittings supplied against ASTM, ASME, NACE and applicable NORSOK M-630 requirements, with heat-traceable EN 10204 3.1 documentation.
          </p>

          <p className="mt-2.5 sm:mt-3 text-[11px] sm:text-xs leading-normal text-[#EAEAEA] font-normal">
            Materials available against applicable NORSOK M-630 requirements, subject to grade, product form, applicable MDS and manufacturer qualification.
          </p>

          <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm md:text-[14.5px] leading-relaxed text-white font-medium">
            Supplied cut-to-size, saw-cut to exact lengths, end-bevelled and pre-machined to your drawing — so you skip in-house cutting waste and local machining delays.
          </p>

          {/* Custom Cutting & Machining Box */}
          <div className="mt-4 sm:mt-5 border-l-2 border-primary/90 pl-3.5 sm:pl-4 py-1.5 bg-black/20 rounded-r-xs">
            <p className="font-mono text-[10.5px] sm:text-[11px] uppercase tracking-[0.16em] text-primary font-semibold">
              Custom cutting &amp; machining
            </p>
            <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-[#F5F5F5]">
              Precision saw cutting · End bevelling (ASME B16.25) · Rough machining, boring &amp; facing
            </p>
            <p className="mt-0.5 text-xs sm:text-[13px] leading-relaxed text-[#EAEAEA]">
              - Cut-to-drawing components — supply your length, tolerance or drawing.
            </p>
            <Link
              to="/processing"
              className="mt-2 inline-flex items-center text-xs sm:text-[13px] font-semibold text-primary transition-opacity hover:opacity-80"
            >
              See our processing capabilities →
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
            <Link
              to="/rfq"
              className="rounded-sm bg-primary px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-opacity hover:opacity-90"
            >
              Request cut-to-size quotation
            </Link>
            <Link
              to="/materials"
              className="rounded-sm border border-primary/50 bg-black/40 px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-xs transition-colors hover:border-primary hover:text-white"
            >
              Browse 28 CRA grades
            </Link>
          </div>
        </div>

        {/* Bottom Stats Band: Divided into 4 columns with subtle borders matching reference image */}
        <dl className="mt-10 sm:mt-12 lg:mt-14 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 border-t border-white/10 pt-5 sm:pt-6">
          <div className="lg:pr-6 xl:pr-8 lg:border-r lg:border-white/10">
            <dt className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-primary">
              <CountUp end={28} />
            </dt>
            <dd className="mt-1 text-xs sm:text-sm font-medium text-foreground">
              CRA grades documented
            </dd>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              + 6 supporting stainless grades
            </p>
          </div>

          <div className="lg:px-6 xl:px-8 lg:border-r lg:border-white/10">
            <dt className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-primary">
              <CountUp end={18} />
            </dt>
            <dd className="mt-1 text-xs sm:text-sm font-medium text-foreground">
              Flange &amp; fitting types
            </dd>
          </div>

          <div className="lg:px-6 xl:px-8 lg:border-r lg:border-white/10">
            <dt className="font-display text-2xl sm:text-3xl font-bold tabular-nums text-primary">
              <CountUp end={150} /> – <CountUp end={2500} duration={1600} />
            </dt>
            <dd className="mt-1 text-xs sm:text-sm font-medium text-foreground">
              Pressure classes supplied
            </dd>
          </div>

          <div className="lg:pl-6 xl:pl-8">
            <dt className="font-display text-2xl sm:text-3xl font-bold text-primary">
              EN 10204 3.1
            </dt>
            <dd className="mt-1 text-xs sm:text-sm font-medium text-foreground">
              Certification standard
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
