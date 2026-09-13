import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/motion/PageTransition";
import { CursorGridGlow } from "@/components/motion/CursorGridGlow";
import { getSiteIdentity } from "@/lib/site";
import "./globals.css";

const description =
  "Full stack developer portfolio, engineered like a premium digital showroom.";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteIdentity();
  const title = `${site.name} — ${site.role}`;
  return {
    metadataBase: new URL(site.siteUrl),
    title: { default: title, template: `%s — ${site.name}` },
    description,
    openGraph: { title, description, url: site.siteUrl, siteName: site.name, locale: "en_US", type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full`}>
      <body className="flex min-h-full flex-col bg-background-primary font-body text-foreground-primary antialiased">
        <CursorGridGlow />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:font-technical focus:text-technical-label focus:uppercase focus:tracking-[0.1em] focus:text-accent-foreground"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer />
      </body>
    </html>
  );
}
