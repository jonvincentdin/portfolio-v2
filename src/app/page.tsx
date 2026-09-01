import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { AngularPanel } from "@/components/ui/AngularPanel";

/**
 * Placeholder only — full Home build (hero, intro, CTAs, featured project)
 * is Milestone 03. This page exists to verify the foundation shell (fonts,
 * tokens, header, footer, container) end-to-end.
 */
export default function HomePage() {
  return (
    <Container className="flex min-h-[70vh] flex-col justify-center gap-6 py-24">
      <TechnicalLabel accent>Milestone 01 / Foundation</TechnicalLabel>
      <h1 className="font-heading text-display-lg sm:text-display-xl uppercase tracking-tight">
        Your Name
      </h1>
      <p className="max-w-xl font-body text-body-lg text-foreground-muted">
        Full stack developer. Hero, featured project, and the rest of Home
        arrive in Milestone 03.
      </p>
      <AngularPanel className="mt-4 max-w-md p-6">
        <TechnicalLabel>Design token check</TechnicalLabel>
        <p className="mt-2 font-body text-body-md">
          Fonts, colors, spacing, and the AngularPanel geometry are wired up
          and ready for the real content system.
        </p>
      </AngularPanel>
    </Container>
  );
}
