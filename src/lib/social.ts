
export type SocialLink = {
  label: string;
  href: string;
  visible?: boolean;
};

/** Shared between Footer and Home so the link list has one source. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com", visible: true },
  { label: "LinkedIn", href: "https://linkedin.com", visible: true },
  { label: "Email", href: "mailto:hello@example.com", visible: true },
];

export async function getSocialLinks(): Promise<SocialLink[]> {
  const { databaseConfigured } = await import("@/lib/db");
  if (databaseConfigured) return (await import("@/lib/content/database")).getDatabaseSnapshot().then((snapshot) => snapshot.socialLinks.filter((link) => link.visible !== false));
  return SOCIAL_LINKS.filter((link) => link.visible !== false);
}
