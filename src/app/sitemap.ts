import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content/projects";
import { getSiteIdentity } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Dynamic sitemap (spec §52's SEO requirement, delivered in Milestone 13).
 * Project case study URLs are generated from `getAllProjects()` — the same
 * loader every other page uses — so a newly added `content/projects/`
 * folder appears in the sitemap automatically, with zero code changes,
 * consistent with the rest of the site's content-discovery philosophy.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, projects] = await Promise.all([getSiteIdentity(), getAllProjects()]);
  const base = site.siteUrl;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projects`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/experience`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${base}/projects/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes];
}
