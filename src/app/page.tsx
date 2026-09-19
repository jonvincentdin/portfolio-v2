import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { StatusIndicator } from "@/components/ui/StatusIndicator";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Reveal } from "@/components/motion/Reveal";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { getFeaturedProjects } from "@/lib/content";
import { getSiteIdentity } from "@/lib/site";
import { getSocialLinks } from "@/lib/social";
import { getProfileImage } from "@/lib/profile";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { HeroExperience } from "@/components/motion/HeroExperience";

/**
 * Home (spec §8–§9). Hero content reveals on mount, staggered, as the
 * page-load animation sequence (spec §29); the Featured Project section
 * reveals on scroll. Only the single highest-priority featured project is
 * shown here, per spec §9 ("show one highlighted project like a featured
 * vehicle") — if multiple projects are marked `featured`, the first in
 * sorted order wins.
 */
export default async function HomePage() {
  const [[featuredProject], site, socialLinks] = await Promise.all([getFeaturedProjects(), getSiteIdentity(), getSocialLinks()]);
  const profileImage = await getProfileImage();

  return (
    <>
      <HeroExperience>
        <Container className="relative flex min-h-[calc(100vh-4rem)] flex-col justify-center gap-10 overflow-hidden py-20 sm:min-h-[calc(100vh-5rem)] lg:overflow-visible">
        {profileImage ? (
          <AngularPanel className="order-first relative aspect-[4/5] w-full max-w-sm self-end overflow-hidden lg:absolute lg:top-1/2 lg:right-0 lg:order-none lg:w-[34%] lg:max-w-none lg:-translate-y-1/2">
            <Image src={profileImage.url} alt={`${site.name} profile`} fill sizes="(min-width: 1024px) 34vw, 90vw" className="object-cover" priority />
          </AngularPanel>
        ) : null}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 right-0 hidden h-[22rem] w-[34%] -translate-y-1/2 lg:block ${profileImage ? "lg:hidden" : ""}`}
        >
          <div className="absolute inset-0 border border-border/70 [clip-path:polygon(12%_0,100%_0,88%_100%,0_100%)]" />
          <div className="absolute top-8 right-8 bottom-8 w-px bg-accent/50" />
          <div className="absolute top-8 right-8 h-px w-1/2 bg-accent/50" />
          <div className="absolute right-8 bottom-8 h-px w-1/3 bg-border-strong/70" />
          <div className="absolute top-1/2 left-8 h-px w-1/3 bg-border-strong/50" />
        </div>

        <div>
          <Reveal mode="mount">
            <TechnicalLabel>System / Ready</TechnicalLabel>
            <TechnicalLabel accent>{site.role}</TechnicalLabel>
          </Reveal>
          <Reveal mode="mount" delayMs={80}>
            <h1 className="mt-3 font-heading text-display-lg uppercase tracking-tight break-words sm:text-display-xl">
              {site.name}
            </h1>
          </Reveal>
          <Reveal mode="mount" delayMs={160}>
            <p className="mt-6 max-w-xl font-body text-body-lg text-foreground-muted">
              {site.supportingStatement}
            </p>
          </Reveal>
          <Reveal mode="mount" delayMs={220}>
            <p className="mt-4 max-w-xl font-body text-body-md text-foreground-muted">
              {site.introduction}
            </p>
          </Reveal>
        </div>

        <Reveal mode="mount" delayMs={280}>
          <dl className="grid max-w-xl grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-3">
            <div>
              <dt className="mb-1">
                <TechnicalLabel>Location</TechnicalLabel>
              </dt>
              <dd className="font-body text-body-md">{site.location}</dd>
            </div>
            <div>
              <dt className="mb-1">
                <TechnicalLabel>Specialization</TechnicalLabel>
              </dt>
              <dd className="font-body text-body-md">{site.specialization}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="mb-1">
                <TechnicalLabel>Status</TechnicalLabel>
              </dt>
              <dd>
                <StatusIndicator label={site.status} />
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal mode="mount" delayMs={340} className="flex flex-wrap items-center gap-x-10 gap-y-6">
          <div className="flex flex-wrap items-center gap-6">
            <ArrowLink href="/projects" variant="primary">
              {site.viewProjectsLabel}
            </ArrowLink>
            <ArrowLink href="/contact" variant="secondary">
              {site.contactLabel}
            </ArrowLink>
          </div>

          <div className="flex gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="font-technical text-technical-label uppercase tracking-[0.1em] text-foreground-muted transition-colors motion-micro hover:text-foreground-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </Reveal>
        </Container>
      </HeroExperience>

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
