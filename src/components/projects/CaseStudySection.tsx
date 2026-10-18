import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

type CaseStudySectionProps = {
  id: string;
  label: string;
  content: string;
};

/**
 * One case-study prose section (Overview / Problem / Objective / Solution /
 * Challenges / Results / Lessons — spec §14). The caller only renders this
 * for fields that are actually non-empty on the project's `caseStudy`
 * object — there's no fallback/placeholder text here, consistent with
 * never fabricating content the author hasn't supplied.
 */
export function CaseStudySection({ id, label, content }: CaseStudySectionProps) {
  return (
    <section id={id} tabIndex={-1} className="section-anchor max-w-3xl">
        <TechnicalLabel accent as="h2" className="mb-3">
          {label}
        </TechnicalLabel>
        <p className="font-body text-body-lg text-foreground-muted">{content}</p>
    </section>
  );
}
