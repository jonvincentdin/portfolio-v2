type ClassValue = string | number | false | null | undefined;

/**
 * Joins truthy class names with a space. Deliberately minimal (no clsx/
 * tailwind-merge dependency) — the design system avoids conflicting utility
 * combinations by construction, so naive joining is sufficient.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
