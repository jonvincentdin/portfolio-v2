import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSiteIdentity } from "@/lib/site";
import { getSocialLinks } from "@/lib/social";
import { getContactContent } from "@/lib/content/editor";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch to start a project or just talk shop — direct email and social links included.",
  openGraph: {
    title: "Contact",
    description: "Get in touch to start a project or just talk shop.",
  },
};

/**
 * Contact (spec §27, §44). Order follows the spec's own sequence: headline
 * → intro → form → social links, rather than a two-column layout, so the
 * page reads as a deliberate final "showroom screen" rather than a
 * generic split-panel contact page.
 */
export default async function ContactPage() {
  const [site, socialLinks, contact] = await Promise.all([getSiteIdentity(), getSocialLinks(), getContactContent()]);
  return (
    <Container className="py-16 sm:py-24">
      <Reveal mode="mount">
        <TechnicalLabel accent as="div">
          05 / Contact
        </TechnicalLabel>
        <h1 className="mt-3 max-w-2xl font-heading text-display-lg uppercase tracking-tight break-words sm:text-display-xl">
          {contact.heading}
        </h1>
      </Reveal>

      <Reveal mode="mount" delayMs={120} className="mt-6 max-w-xl">
        <p className="font-body text-body-lg text-foreground-muted">
          Have a project in mind, or just want to talk shop? Send a message
          below — I read every one.
        </p>
      </Reveal>

      <Reveal mode="mount" delayMs={220} className="mt-14 max-w-xl">
        <ContactForm submitLabel={contact.submitLabel} />
      </Reveal>

      <Reveal mode="mount" delayMs={320} className="mt-16 border-t border-border pt-8">
        <TechnicalLabel accent as="div" className="mb-4">
          Direct
        </TechnicalLabel>
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-heading text-heading-md uppercase tracking-tight transition-colors motion-micro hover:text-accent"
        >
          {site.contactEmail}
        </a>

        <div className="mt-6 flex flex-wrap gap-6">
          {socialLinks.filter((link) => link.label !== "Email").map((link) => (
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
  );
}
