export type SocialLink = {
  label: string;
  href: string;
};

/** Shared between Footer and Home so the link list has one source. */
export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email", href: "mailto:hello@example.com" },
];
