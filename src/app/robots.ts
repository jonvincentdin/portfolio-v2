import type { MetadataRoute } from "next";
import { getSiteIdentity } from "@/lib/site";

/**
 * robots.txt (spec §52). Blocks API routes and the internal content-media
 * bridge (see ARCHITECTURE.md) from crawling — neither is meant to be
 * indexed — while allowing everything a visitor would actually navigate to.
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteIdentity();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/content-media/"],
    },
    sitemap: `${site.siteUrl}/sitemap.xml`,
  };
}
