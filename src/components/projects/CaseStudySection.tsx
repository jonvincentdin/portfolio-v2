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
    <section id={id} tabIndex={-1} className="section-anchor grid gap-5 border-t border-border pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
      <h2 className="font-heading text-heading-md tracking-tight">{label}</h2>
      <div className="min-w-0 max-w-[65ch] space-y-5 font-body text-body-md text-foreground-muted sm:text-body-lg">
        {content.trim().split(/\n\s*\n/).map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line [overflow-wrap:anywhere]">{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
