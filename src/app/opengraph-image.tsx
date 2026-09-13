import { ImageResponse } from "next/og";
import { getSiteIdentity, SITE_IDENTITY } from "@/lib/site";

export const alt = `${SITE_IDENTITY.name} — ${SITE_IDENTITY.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default OpenGraph/Twitter card image for social sharing previews.
 * Generated at request time via `next/og` rather than a static asset, kept
 * intentionally simple (system fonts only — no custom font fetching) while
 * still matching the site's dark background + single accent language.
 * Individual project case studies could add their own `opengraph-image`
 * later using each project's hero image; this is the sitewide default.
 */
export default async function OpengraphImage() {
  const site = await getSiteIdentity();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#e8b400",
            marginBottom: 24,
          }}
        >
          {site.role}
        </div>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, textTransform: "uppercase" }}>
          {site.name}
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#8a8a8a", marginTop: 24, maxWidth: 900 }}>
          {site.supportingStatement}
        </div>
      </div>
    ),
    { ...size },
  );
}
