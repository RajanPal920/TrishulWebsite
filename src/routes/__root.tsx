import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { company, offices } from "@/data/company";
import { ShortlistProvider } from "@/lib/shortlist";
import { CompareTray } from "@/components/site/ShortlistControls";
import { AskTrishul } from "@/components/site/AskTrishul";
import { FloatingContactButtons } from "@/components/site/FloatingContactButtons";
import { RouteHero } from "@/components/site/RouteHero";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthModal } from "@/components/site/AuthModal";


function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-lg text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-primary font-semibold">Error 404</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          The page you are looking for does not exist or may have been relocated. You can navigate through our verified catalogue or reach out directly.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/industries"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
          >
            Industries we supply
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-sm border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/50"
          >
            Product catalogue
          </Link>
          <Link
            to="/rfq"
            className="inline-flex items-center justify-center rounded-sm border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            Request for quotation
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Go home →
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error("[Root Error Component]:", error);
  const router = useRouter();
  const errorMessage = error instanceof Error ? error.message : String(error || "Unknown error");
  const errorStack = error instanceof Error ? error.stack : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        {errorMessage && errorMessage !== "Unknown error" && (
          <div className="mt-4 max-h-48 overflow-auto rounded bg-destructive/10 p-3 text-left font-mono text-xs text-destructive border border-destructive/20">
            <p className="font-semibold text-xs">{errorMessage}</p>
            {errorStack && (
              <pre className="mt-1 text-[10px] text-destructive/80 whitespace-pre-wrap font-mono">
                {errorStack}
              </pre>
            )}
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-sm border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Trishul Metals & Alloys — Nickel Alloy, Duplex & Stainless Flanges" },
      { name: "description", content: company.description },
      { name: "author", content: company.name },
      { property: "og:site_name", content: company.name },
      { property: "og:type", content: "website" },
      { property: "og:image", content: `${company.siteUrl}/og-image.jpg` },
      {
        property: "og:image:alt",
        content:
          "Trishul Metals & Alloys stockyard with racked corrosion-resistant alloy pipes, flanges and fittings",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: `${company.siteUrl}/og-image.jpg` },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter+Tight:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: company.name,
          url: company.siteUrl,
          email: "export@trishulmetal.com",
          telephone: company.phone,
          parentOrganization: {
            "@type": "Organization",
            name: "Modi Group of Industries",
          },
          founder: {
            "@type": "Person",
            name: "Ramesh Modi",
            jobTitle: "Group Founder & Principal",
          },
          address: offices.map((o) => ({
            "@type": "PostalAddress",
            streetAddress: o.address.street,
            addressLocality: o.address.city,
            addressRegion: o.address.region,
            ...(o.address.postalCode ? { postalCode: o.address.postalCode } : {}),
            addressCountry: o.address.countryCode,
          })),
          location: offices.map((o) => ({
            "@type": "Place",
            name: `${company.name} — ${o.city}`,
            description: o.role,
            hasMap: o.mapsUrl,
            address: {
              "@type": "PostalAddress",
              streetAddress: o.address.street,
              addressLocality: o.address.city,
              addressRegion: o.address.region,
              ...(o.address.postalCode ? { postalCode: o.address.postalCode } : {}),
              addressCountry: o.address.countryCode,
            },
          })),
          contactPoint: offices.map((o) => ({
            "@type": "ContactPoint",
            contactType: o.role,
            email: o.email,
            telephone: o.phone,
            areaServed: ["IN", "Worldwide"],
          })),
          sameAs: [company.social.linkedin, company.social.instagram, company.social.facebook],
          logo: `${company.siteUrl}/favicon.png`,
          image: `${company.siteUrl}/og-image.jpg`,
          description: company.description,
          slogan:
            "Cut-to-size, bevelled and pre-machined corrosion-resistant alloy piping components supplied to specification.",
          areaServed: "Worldwide",
          knowsAbout: [
            "Nickel alloy flanges and fittings",
            "Duplex and super duplex stainless steel",
            "Corrosion-resistant alloy (CRA) piping components",
            "Seamless and welded pipe",
            "NACE MR0175 / ISO 15156 sour service",
            "ASME B16.5, B16.9, B16.25",
            "EN 10204 3.1 and 3.2 certification",
            "NORSOK M-630 material data sheets",
            "Cut-to-size, end bevelling and pre-machined components",
            "Oil & gas, subsea, refinery, LNG, desalination and railway supply",
          ],
          hasCredential: [
            {
              "@type": "EducationalOccupationalCredential",
              name: "ISO 9001:2015 — Quality Management System",
              credentialCategory: "certification",
              identifier: "26MEQXH09",
              recognizedBy: {
                "@type": "Organization",
                name: "Magnitude Management Services Pvt. Ltd. (EGAC accredited, IAF MLA)",
              },
            },
            {
              "@type": "EducationalOccupationalCredential",
              name: "CIFFA — International Freight Forwarding (Govind Modi Personal Training)",
              credentialCategory: "certification",
              recognizedBy: {
                "@type": "Organization",
                name: "Canadian International Freight Forwarders Association (CIFFA) / Centennial College",
              },
            },
          ],
          identifier: [
            { "@type": "PropertyValue", name: "GSTIN", value: "27AAYFT9507B1ZP" },
            { "@type": "PropertyValue", name: "IEC", value: "AAYFT9507B" },
            { "@type": "PropertyValue", name: "Udyam", value: "UDYAM-MH-19-0404041" },
            { "@type": "PropertyValue", name: "DPIIT", value: "DIPP243391" },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: company.name,
          url: company.siteUrl,
          description: company.description,
          publisher: { "@type": "Organization", name: company.name, url: company.siteUrl },
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ShortlistProvider>
          {isAdminRoute ? (
            <main className="min-h-screen bg-background">
              {/* Dedicated standalone Admin interface: completely separate from public header/footer/hero/widgets */}
              <Outlet />
            </main>
          ) : (
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                <RouteHero />
                {/* Required: nested routes render here. */}
                <Outlet />
              </main>
              <Footer />
              <CompareTray />
              <FloatingContactButtons />
              <AskTrishul />
              <AuthModal />
            </div>
          )}
        </ShortlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

