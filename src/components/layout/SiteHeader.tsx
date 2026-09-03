import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NAV_ITEMS } from "@/lib/navigation";
import { SITE_IDENTITY } from "@/lib/site";
import { NavLink } from "./NavLink";
import { MobileNavigation } from "./MobileNavigation";

/**
 * Automotive-style top navigation (spec §7): logo/name left, numbered nav
 * right on desktop, full-screen menu on mobile via MobileNavigation.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background-primary/90 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Link
          href="/"
          className="font-heading text-lg font-medium uppercase tracking-tight text-foreground-primary"
        >
          {SITE_IDENTITY.name}
        </Link>

        <nav className="hidden items-center gap-10 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </nav>

        <MobileNavigation />
      </Container>
    </header>
  );
}
