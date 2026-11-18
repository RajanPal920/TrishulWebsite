import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { company, offices } from "@/data/company";
import { ShortlistProvider } from "@/lib/shortlist";
import { CompareTray } from "@/components/site/ShortlistControls";
import { AskTrishul } from "@/components/site/AskTrishul";
import { FloatingContactButtons } from "@/components/site/FloatingContactButtons";
import { RouteHero } from "@/components/site/RouteHero";
import { supabase } from "@/integrations/supabase/client";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
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
          email: company.email,
          telephone: company.phone,
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
              name: "CIFFA — International Freight Forwarding",
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      void router.invalidate();
      if (session) void queryClient.invalidateQueries();
      else queryClient.clear();
    });
    return () => data.subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ShortlistProvider>
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
        </div>
      </ShortlistProvider>
    </QueryClientProvider>
  );
}

