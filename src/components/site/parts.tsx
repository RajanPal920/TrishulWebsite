import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ComponentType, ReactNode } from "react";
import { MagneticAction, useHydrationSafeReducedMotion } from "@/components/site/InteractionMotion";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`px-5 py-16 md:px-10 md:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHead({
  eyebrow,
  title,
  intro,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <div className="scroll-reveal max-w-3xl">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">{title}</Heading>
      {intro ? <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p> : null}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.16em]">
      <ol className="flex flex-wrap items-center gap-2 text-muted-foreground">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {item.to ? (
              <Link to={item.to} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-primary">{item.label}</span>
            )}
            {i < items.length - 1 ? <span aria-hidden>/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SpecTable({
  caption,
  head,
  rows,
}: {
  caption?: string;
  head: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="surface-panel overflow-x-auto rounded-md">
      {caption ? (
        <p className="border-b border-border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          {caption}
        </p>
      ) : null}
      <table className="spec-table">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <span aria-hidden className="mt-2 h-px w-4 shrink-0 bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-4">
      {paragraphs.map((p, i) => (
        <p key={i} className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          {p}
        </p>
      ))}
    </div>
  );
}

export function CardLink({
  to,
  params,
  eyebrow,
  title,
  body,
  tags,
  image,
  imageAlt,
  icon,
  interactive = true,
}: {
  to: string;
  params?: Record<string, string>;
  eyebrow?: string;
  title: string;
  body?: string;
  tags?: string[];
  image?: string | undefined;
  imageAlt?: string | undefined;
  icon?: ReactNode | undefined;
  interactive?: boolean;
}) {
  const reduceMotion = useHydrationSafeReducedMotion();
  const AnyLink = Link as unknown as ComponentType<Record<string, unknown>>;
  const card = (
    <AnyLink
      to={to}
      params={params}
      className={`${interactive ? "premium-card-motion" : "scroll-reveal"} surface-panel group relative flex h-full flex-col overflow-hidden rounded-md transition-[border-color,box-shadow,background-color] duration-300 hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring`}
    >
      {image ? (
        <div className="-mx-px -mt-px mb-1 aspect-[4/3] overflow-hidden border-b border-border bg-background">
          <img
            src={image}
            alt={imageAlt ?? title}
            loading="lazy"
             decoding="async"
            width={1024}
            height={768}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex flex-col p-6">
      {icon ? (
        <span className="tech-icon-slot mb-3 inline-flex text-muted-foreground transition-colors duration-300 group-hover:text-primary">
          {icon}
        </span>
      ) : null}
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h3 className="mt-3 text-lg font-semibold transition-colors group-hover:text-primary">{title}</h3>
      {body ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p> : null}

      {tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-sm border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
      <span className="card-arrow mt-5 inline-flex items-center self-start font-mono text-sm text-primary" aria-hidden>
        →
      </span>
      </div>
    </AnyLink>
  );

  if (!interactive) return card;

  return (
    <div className="scroll-reveal h-full">
      <motion.div
        className="h-full"
        {...(reduceMotion ? {} : { whileHover: { scale: 1.02 } })}
        transition={{ duration: reduceMotion ? 0.01 : 0.275, ease: "easeOut" }}
      >
        {card}
      </motion.div>
    </div>
  );
}

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-md border border-border">
      {faqs.map((f) => (
        <details key={f.q} className="group bg-card/40 p-5 open:bg-card/70">
          <summary className="cursor-pointer list-none text-sm font-semibold text-foreground marker:hidden">
            <span className="mr-3 text-primary">+</span>
            {f.q}
          </summary>
          <p className="mt-3 max-w-3xl pl-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  title = "Send your specification for a technical quotation",
  body = "Share grade, size, class, standard and quantity — we respond with pricing, delivery and a documentation plan.",
  image,
  imageAlt,
}: {
  title?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <Section className={`relative isolate overflow-hidden border-y border-border bg-card/40 ${image ? "home-cta-image" : ""}`}>
      {image ? (
        <>
          <img src={image} alt={imageAlt ?? ""} loading="lazy" decoding="async" width={1536} height={1024} className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35 saturate-[0.65]" />
          <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/90 to-background/45" />
        </>
      ) : null}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <Eyebrow>Request for quotation</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <MagneticAction>
            <Link
              to="/rfq"
              className="rounded-sm bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Request quotation
            </Link>
          </MagneticAction>
          <Link
            to="/contact"
            className="rounded-sm border border-primary/50 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            Contact team
          </Link>
        </div>
      </div>
    </Section>
  );
}
