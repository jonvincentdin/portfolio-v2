export type NavItem = {
  label: string;
  href: string;
  index: string;
};

/**
 * Fixed top-level site navigation. This is site structure, not
 * filesystem-discovered content, so it's intentionally a plain constant
 * rather than routed through lib/content — see ROUTES.md for the full
 * route table.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", index: "01" },
  { label: "About", href: "/about", index: "02" },
  { label: "Projects", href: "/projects", index: "03" },
  { label: "Experience", href: "/experience", index: "04" },
  { label: "Contact", href: "/contact", index: "05" },
];
