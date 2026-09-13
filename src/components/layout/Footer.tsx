import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { getSocialLinks } from "@/lib/social";

export async function Footer() {
  const year = new Date().getFullYear();
  const socialLinks = await getSocialLinks();

  return (
    <footer className="mt-auto border-t border-border">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <TechnicalLabel>© {year} — Built with precision.</TechnicalLabel>

        <nav className="flex gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="font-technical text-technical-label uppercase tracking-[0.1em] text-foreground-muted transition-colors hover:text-foreground-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
