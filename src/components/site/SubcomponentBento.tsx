import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Section, SectionHead } from "@/components/site/parts";
import { subcomponents } from "@/data/subcomponents";
import railwayRawImage from "@/assets/subcomponents/railway-spring-pots-raw.webp";
import railwayFinishedImage from "@/assets/subcomponents/railway-spring-pots-finished.webp";
import offshoreRawImage from "@/assets/subcomponents/offshore-firewater-raw.webp";
import offshoreFinishedImage from "@/assets/subcomponents/offshore-firewater-finished.webp";
import subseaRawImage from "@/assets/subcomponents/subsea-rings-raw.webp";
import subseaFinishedImage from "@/assets/subcomponents/subsea-rings-finished.webp";
import valveRawImage from "@/assets/subcomponents/valve-blanks-raw.webp";
import valveFinishedImage from "@/assets/subcomponents/valve-blanks-finished.webp";
import cryogenicRawImage from "@/assets/subcomponents/cryogenic-rings-raw.webp";
import cryogenicFinishedImage from "@/assets/subcomponents/cryogenic-rings-finished.webp";
import desalinationRawImage from "@/assets/subcomponents/desalination-header-raw.webp";
import desalinationFinishedImage from "@/assets/subcomponents/desalination-header-finished.webp";

const flagshipIds = [
  "railway-heavy-industrial",
  "offshore-oil-gas",
  "subsea-engineering",
  "onshore-oil-gas",
  "lng-plants",
  "desalination-plants",
] as const;

const layoutById: Record<(typeof flagshipIds)[number], string> = {
  "railway-heavy-industrial": "lg:col-span-2 lg:row-span-2",
  "offshore-oil-gas": "lg:col-span-2",
  "subsea-engineering": "lg:col-span-2",
  "onshore-oil-gas": "lg:col-span-1",
  "lng-plants": "lg:col-span-1",
  "desalination-plants": "lg:col-span-2",
};

const displayById: Record<
  (typeof flagshipIds)[number],
  {
    title: string;
    finished: string;
    rawImage: string;
    rawImageAlt: string;
    finishedImage: string;
    finishedImageAlt: string;
  }
> = {
  "railway-heavy-industrial": {
    title: "Railway Spring Pots",
    finished:
      "Spring Pots cut to exact 400–500 mm lengths with square-faced ends, ready for robotic chassis welding",
    rawImage: railwayRawImage,
    rawImageAlt: "Representative heavy-wall seamless pipe stock before railway spring pot processing",
    finishedImage: railwayFinishedImage,
    finishedImageAlt: "Representative finished railway spring pots made from the shown heavy-wall seamless pipe blanks",
  },
  "offshore-oil-gas": {
    title: "Offshore firewater headers",
    finished:
      "Pre-spooled mitred headers, root-pass bevelled with root-gap spacers and full third-party witness documentation",
    rawImage: offshoreRawImage,
    rawImageAlt: "Representative corrosion-resistant seamless pipe stock before offshore header fabrication",
    finishedImage: offshoreFinishedImage,
    finishedImageAlt: "Representative pre-spooled super duplex offshore firewater header made from the shown raw stock",
  },
  "subsea-engineering": {
    title: "Subsea connector rings",
    finished:
      "Connector ring segments, water-jet profiled and finished to tight ID/OD tolerances",
    rawImage: subseaRawImage,
    rawImageAlt: "Representative alloy bar and forged stock before subsea connector ring machining",
    finishedImage: subseaFinishedImage,
    finishedImageAlt: "Representative precision-machined super duplex subsea connector rings made from the shown forged blanks",
  },
  "onshore-oil-gas": {
    title: "Valve stem blanks & adapter rings",
    finished:
      "NACE-compliant valve stem blanks and wellhead adapter rings, rough-turned and stress-relieved before final threading",
    rawImage: valveRawImage,
    rawImageAlt: "Representative alloy bar stock before valve stem blank and adapter ring processing",
    finishedImage: valveFinishedImage,
    finishedImageAlt: "Representative rough-turned valve stem blanks and wellhead adapter ring made from the shown billets",
  },
  "lng-plants": {
    title: "Cryogenic valve body rings",
    finished:
      "Valve body rings cut and impact-tested for sub-zero integrity",
    rawImage: cryogenicRawImage,
    rawImageAlt: "Representative thick alloy ring stock before cryogenic valve body machining",
    finishedImage: cryogenicFinishedImage,
    finishedImageAlt: "Representative precision-machined cryogenic valve body rings made from the shown forged stock",
  },
  "desalination-plants": {
    title: "Desalination RO headers",
    finished:
      "RO high-pressure header segments, pre-cut and flange-fitted to eliminate on-site fabrication",
    rawImage: desalinationRawImage,
    rawImageAlt: "Representative corrosion-resistant seamless pipe stock before desalination header processing",
    finishedImage: desalinationFinishedImage,
    finishedImageAlt: "Representative fabricated super duplex reverse-osmosis header made from the shown pipe and fitting stock",
  },
};

export function SubcomponentBento() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const flagshipEntries = flagshipIds.flatMap((id) => {
    const entry = subcomponents.find((candidate) => candidate.id === id);
    return entry ? [entry] : [];
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup = () => {};
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const context = gsap.context(() => {
          section.dataset["scrollStory"] = "ready";
          const cards = gsap.utils.toArray<HTMLElement>("[data-transform-card]", section);

          cards.forEach((card) => {
            const rawVisual = card.querySelector("[data-raw-visual]");
            const finishedVisual = card.querySelector("[data-finished-visual]");
            const rawCopy = card.querySelector("[data-raw-copy]");
            const finishedCopy = card.querySelector("[data-finished-copy]");
            const rawLabel = card.querySelector("[data-raw-label]");
            const finishedLabel = card.querySelector("[data-finished-label]");
            const progress = card.querySelector("[data-transform-progress]");

            gsap.set(finishedVisual, { autoAlpha: 0, scale: 1.035 });
            gsap.set(finishedCopy, { autoAlpha: 0, y: 6 });
            gsap.set(finishedLabel, { autoAlpha: 0 });
            gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: card,
                  start: "top 78%",
                  end: "bottom 38%",
                  scrub: 0.65,
                },
              })
              .to(rawVisual, { autoAlpha: 0, scale: 1.025, ease: "none" }, 0.12)
              .to(finishedVisual, { autoAlpha: 1, scale: 1, ease: "none" }, 0.28)
              .to(rawCopy, { autoAlpha: 0, y: -6, duration: 0.3, ease: "none" }, 0)
              .to(finishedCopy, { autoAlpha: 1, y: 0, duration: 0.3, ease: "none" }, 0.7)
              .to(rawLabel, { autoAlpha: 0, duration: 0.2, ease: "none" }, 0.28)
              .to(finishedLabel, { autoAlpha: 1, duration: 0.2, ease: "none" }, 0.58)
              .to(progress, { scaleX: 1, ease: "none" }, 0);
          });
        }, section);

        ScrollTrigger.refresh();
        cleanup = () => {
          context.revert();
          delete section.dataset["scrollStory"];
        };
      },
    );

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={sectionRef} className="subcomponent-story">
      <Section className="border-t border-border">
        <SectionHead
          eyebrow="Value-added processing"
          title="From raw stock to finished sub-components"
          intro="Buyers order finished, drop-in components cut and prepared for installation — not random mill lengths that create waste and machining delays."
        />

        <div className="mt-10 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[minmax(13rem,1fr)] lg:grid-cols-6">
        {flagshipEntries.map((entry) => {
          const id = entry.id as (typeof flagshipIds)[number];
          const display = displayById[id];
          const isHero = id === "railway-heavy-industrial";

          return (
            <article
              key={entry.id}
              data-transform-card
              className={`surface-panel group flex min-w-0 flex-col overflow-hidden rounded-md border-l-2 border-l-primary/50 transition-[border-color,box-shadow] duration-300 hover:border-primary/70 hover:shadow-[var(--shadow-gold)] ${layoutById[id]} ${isHero ? "bg-card/70" : ""}`}
            >
              <div className={`transform-media relative grid shrink-0 grid-cols-2 overflow-hidden border-b border-border/70 ${isHero ? "h-56 md:h-64 lg:h-72" : "h-44"}`}>
                <div data-raw-visual className="transform-visual relative min-w-0 overflow-hidden">
                  <img src={display.rawImage} alt={display.rawImageAlt} loading="lazy" decoding="async" width={1200} height={900} className="home-catalogue-image h-full w-full object-cover opacity-90" />
                  <span className="transform-state-label absolute left-3 top-3 bg-background/90 px-2 py-1 font-mono text-[9px] uppercase text-primary">Raw stock</span>
                </div>
                <div data-finished-visual className="transform-visual relative min-w-0 overflow-hidden">
                  <img src={display.finishedImage} alt={display.finishedImageAlt} loading="lazy" decoding="async" width={1200} height={900} className="home-catalogue-image h-full w-full object-cover opacity-95" />
                  <span className="transform-state-label absolute left-3 top-3 bg-background/90 px-2 py-1 font-mono text-[9px] uppercase text-primary">Finished component</span>
                </div>
                <span data-raw-label className="pointer-events-none absolute bottom-3 left-3 z-20 bg-background/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">Raw stock</span>
                <span data-finished-label className="pointer-events-none absolute bottom-3 left-3 z-20 bg-background/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">Finished component</span>
                <span
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/15 to-transparent"
                  aria-hidden
                />
                <span data-transform-progress className="absolute inset-x-0 bottom-0 z-10 h-0.5 bg-primary" aria-hidden />
              </div>

              <div className={`flex min-w-0 flex-1 flex-col p-5 md:p-6 ${isHero ? "md:p-8" : ""}`}>
                <div className="min-w-0">
                  <p className="eyebrow">{entry.industry}</p>
                  <h3
                    className={`mt-3 font-display font-semibold leading-tight text-foreground transition-colors duration-300 group-hover:text-primary ${isHero ? "text-2xl md:text-3xl" : "text-lg"}`}
                  >
                    {display.title}
                  </h3>
                </div>

                <div className={`transform-copy mt-5 grid gap-4 ${isHero ? "md:mt-auto md:pt-12" : ""}`}>
                  <div data-raw-copy className="transform-copy-state">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Raw stock</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.rawStock}</p>
                  </div>
                  <div data-finished-copy className="transform-copy-state border-t border-border pt-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Finished component</p>
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{display.finished}</p>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <Link to="/processing" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary transition-opacity hover:opacity-80">
            See all sectors &amp; components →
          </Link>
        </div>
      </Section>
    </div>
  );
}