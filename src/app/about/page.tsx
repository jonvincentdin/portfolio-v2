import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";
import { EngineeringPrinciples } from "@/components/about/EngineeringPrinciples";
import { ServicesList } from "@/components/about/ServicesList";
import { SkillDashboard } from "@/components/about/SkillDashboard";
import { getAllServices } from "@/lib/content/services";
import { getAllSkillCategories } from "@/lib/content/skills";
import { ABOUT_CONTENT } from "@/lib/about";
import { SITE_IDENTITY } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
};

/**
 * About + Services + Skills (spec §10–§11, §25–§26). Editorial composition
 * — a headline, philosophy prose, a principles list, services, and a
 * skills dashboard — rather than a resume dump or generic equal-sized
 * feature cards / pills.
 */
export default function AboutPage() {
  const services = getAllServices();
  const skillCategories = getAllSkillCategories();

  return (
    <Container className="py-16 sm:py-24">
      <Reveal mode="mount">
        <TechnicalLabel accent as="div">
          02 / About
        </TechnicalLabel>
        <h1 className="mt-3 max-w-3xl font-heading text-display-lg uppercase tracking-tight break-words sm:text-display-xl">
          {ABOUT_CONTENT.headline}
        </h1>
      </Reveal>

      <Reveal mode="mount" delayMs={120} className="mt-10 flex flex-col gap-6 max-w-2xl">
        {ABOUT_CONTENT.philosophy.map((paragraph, index) => (
          <p key={index} className="font-body text-body-lg text-foreground-muted">
            {paragraph}
          </p>
        ))}
      </Reveal>

      <div className="mt-16">
        <TechnicalLabel accent as="div" className="mb-6">
          Engineering Principles
        </TechnicalLabel>
        <EngineeringPrinciples />
      </div>

      {services.length > 0 ? (
        <div className="mt-16">
          <TechnicalLabel accent as="div" className="mb-6">
            Services
          </TechnicalLabel>
          <p className="mb-8 max-w-2xl font-body text-body-md text-foreground-muted">
            Focused on {SITE_IDENTITY.specialization.toLowerCase()}, end to end.
          </p>
          <ServicesList services={services} />
        </div>
      ) : null}

      {skillCategories.length > 0 ? (
        <div className="mt-16">
          <TechnicalLabel accent as="div" className="mb-6">
            Development Systems
          </TechnicalLabel>
          <SkillDashboard categories={skillCategories} />
        </div>
      ) : null}
    </Container>
  );
}
