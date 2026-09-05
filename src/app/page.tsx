import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/motion/Reveal";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { getFeaturedProjects } from "@/lib/content";
import { SITE_IDENTITY } from "@/lib/site";
import { SOCIAL_LINKS } from "@/lib/social";

/**
 * Home (spec §8–§9). Hero content reveals on mount, staggered, as the
 * page-load animation sequence (spec §29); the Featured Project section
 * reveals on scroll. Only the single highest-priority featured project is
 * shown here, per spec §9 ("show one highlighted project like a featured
 * vehicle") — if multiple projects are marked `featured`, the first in
 * sorted order wins.
 */
export default function HomePage() {
  const [featuredProject] = getFeaturedProjects();

  return (
    <>
      <Container className="flex min-h-[calc(100vh-4rem)] flex-col justify-center gap-10 py-20 sm:min-h-[calc(100vh-5rem)]">
        <div>
          <Reveal mode="mount">
            <TechnicalLabel accent>{SITE_IDENTITY.role}</TechnicalLabel>
          </Reveal>
          <Reveal mode="mount" delayMs={80}>
            <h1 className="mt-3 font-heading text-display-lg uppercase tracking-tight break-words sm:text-display-xl">
              {SITE_IDENTITY.name}
            </h1>
          </Reveal>
          <Reveal mode="mount" delayMs={160}>
            <p className="mt-6 max-w-xl font-body text-body-lg text-foreground-muted">
              {SITE_IDENTITY.supportingStatement}
            </p>
          </Reveal>
          <Reveal mode="mount" delayMs={220}>
            <p className="mt-4 max-w-xl font-body text-body-md text-foreground-muted">
              {SITE_IDENTITY.introduction}
            </p>
          </Reveal>
        </div>

        <Reveal mode="mount" delayMs={280}>
          <dl className="grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
            <div>
              <dt className="mb-1">
                <TechnicalLabel>Location</TechnicalLabel>
              </dt>
              <dd className="font-body text-body-md">{SITE_IDENTITY.location}</dd>
            </div>
            <div>
              <dt className="mb-1">
                <TechnicalLabel>Specialization</TechnicalLabel>
              </dt>
              <dd className="font-body text-body-md">{SITE_IDENTITY.specialization}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="mb-1">
                <TechnicalLabel>Status</TechnicalLabel>
              </dt>
              <dd>
                <StatusIndicator label={SITE_IDENTITY.status} />
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal mode="mount" delayMs={340} className="flex flex-wrap items-center gap-x-10 gap-y-6">
          <div className="flex flex-wrap items-center gap-6">
            <ArrowLink href="/projects" variant="primary">
              View Projects
            </ArrowLink>
            <ArrowLink href="/contact" variant="secondary">
              Contact
            </ArrowLink>
          </div>

          <div className="flex gap-6">
            {SOCIAL_LINKS.map((link) => (
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
          </div>
        </Reveal>
      </Container>

      {featuredProject ? (
        <Container className="border-t border-border py-24">
          <Reveal mode="scroll">
            <FeaturedProject project={featuredProject} />
          </Reveal>
        </Container>
      ) : null}
    </>
  );
}
