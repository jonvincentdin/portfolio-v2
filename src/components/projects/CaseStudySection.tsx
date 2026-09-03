import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { Reveal } from "@/components/motion/Reveal";

type CaseStudySectionProps = {
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
export function CaseStudySection({ label, content }: CaseStudySectionProps) {
  return (
    <Reveal>
      <div className="max-w-3xl">
        <TechnicalLabel accent as="div" className="mb-3">
          {label}
        </TechnicalLabel>
        <p className="font-body text-body-lg text-foreground-muted">{content}</p>
      </div>
    </Reveal>
  );
}
