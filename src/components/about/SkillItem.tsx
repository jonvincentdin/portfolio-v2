import { SkillLevelSchema, type SkillItem as SkillItemData } from "@/lib/schemas";
import { cn } from "@/lib/utils/cn";

const LEVELS = SkillLevelSchema.options;

type SkillItemProps = {
  skill: SkillItemData;
};

/**
 * One skill row: name plus, only when the author actually supplied a
 * level, a discrete 5-segment "telemetry" bar. Each segment corresponds
 * exactly to one step in the SkillLevel enum (Learning → Familiar →
 * Intermediate → Advanced → Primary) — the filled-segment count is the
 * skill's real rank in that ordered enum, not a synthesized precision
 * number like "87%" (spec §25/§26 explicitly forbid fabricated
 * percentages). When no level is supplied, no bar renders at all —
 * omission rather than a guessed default (verified against Docker in the
 * example content, which intentionally has no `level`).
 *
 * `flex-wrap` on the row lets the level+bar group drop to its own line
 * when the panel is narrow (e.g. inside an AngularPanel at 375px) instead
 * of forcing horizontal overflow — found via a real 375px-viewport audit
 * in Milestone 11. See RESPONSIVE.md and DECISIONS.md D-021.
 */
export function SkillItem({ skill }: SkillItemProps) {
  const rank = skill.level ? LEVELS.indexOf(skill.level) + 1 : 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
      <span
        className={cn(
          "font-body text-body-md",
          skill.featured ? "text-foreground-primary" : "text-foreground-muted",
        )}
      >
        {skill.name}
      </span>

      {skill.level ? (
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-muted">
            {skill.level}
          </span>
          <div className="flex gap-1" aria-hidden="true">
            {LEVELS.map((level, index) => (
              <span
                key={level}
                className={cn("h-1.5 w-4", index < rank ? "bg-accent" : "bg-border")}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
