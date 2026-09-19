"use client";

import { useState } from "react";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import type { ProjectSection, ProjectSectionTemplate } from "@/lib/schemas";
import type { EditorProject } from "@/lib/schemas";

type ProjectSectionsEditorProps = {
  sections: ProjectSection[];
  projects: EditorProject[];
  onChange: (sections: ProjectSection[]) => void;
};

const TEMPLATE_OPTIONS: { value: ProjectSectionTemplate; label: string; description: string }[] = [
  { value: "showroom", label: "Showroom", description: "Gran Turismo-inspired car selector with full specs and thumbnail rail" },
  { value: "carousel", label: "Carousel", description: "Horizontal snap-scroll cards with hover-reveal overlay" },
  { value: "grid", label: "Grid", description: "Auto-fill responsive grid with thumbnail cards" },
  { value: "timeline", label: "Timeline", description: "Vertical timeline with year markers and project cards" },
  { value: "spotlight", label: "Spotlight", description: "One dominant hero + vertical thumbnail rail" },
  { value: "film-strip", label: "Film Strip", description: "Horizontal contact-sheet frames, scrolls natively" },
];

const inputClass = "w-full min-w-0 border-b border-border-strong bg-transparent px-0 py-2 font-body text-body-md text-foreground-primary focus-visible:border-accent focus-visible:outline-none";
const selectClass = "w-full border border-border bg-background-primary px-3 py-2 font-body text-body-md text-foreground-primary focus-visible:border-accent focus-visible:outline-none";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function ProjectSectionsEditor({ sections, projects, onChange }: ProjectSectionsEditorProps) {
  const [expanded, setExpanded] = useState<string | null>(sections[0]?.id ?? null);

  function updateSection(index: number, patch: Partial<ProjectSection>) {
    onChange(sections.map((section, i) => (i === index ? { ...section, ...patch } : section)));
  }

  function addSection() {
    const newSection: ProjectSection = {
      id: uid(),
      label: "New Section",
      kicker: "",
      template: "carousel",
      projectSlugs: [],
      visible: true,
    };
    onChange([...sections, newSection]);
    setExpanded(newSection.id);
  }

  function removeSection(index: number) {
    const next = sections.filter((_, i) => i !== index);
    onChange(next);
    setExpanded(next[0]?.id ?? null);
  }

  function moveSection(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function toggleSlug(sectionIndex: number, slug: string) {
    const section = sections[sectionIndex];
    const current = section.projectSlugs ?? [];
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    updateSection(sectionIndex, { projectSlugs: next });
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <TechnicalLabel accent as="div">Project sections</TechnicalLabel>
          <p className="mt-2 font-body text-body-md text-foreground-muted">
            Add sections with different layouts. Each section can show all projects or a hand-picked subset.
          </p>
        </div>
        <button
          type="button"
          onClick={addSection}
          className="bg-accent px-4 py-3 font-technical text-technical-label uppercase text-accent-foreground hover:opacity-90"
        >
          + Add section
        </button>
      </div>

      {sections.length === 0 ? (
        <p className="font-body text-body-md text-foreground-muted">
          No sections yet. Add one above.
        </p>
      ) : null}

      {sections.map((section, index) => {
        const isOpen = expanded === section.id;
        const selectedSlugs = section.projectSlugs ?? [];
        const activeTemplate = TEMPLATE_OPTIONS.find((t) => t.value === section.template);

        return (
          <div key={section.id} className="border border-border bg-surface">
            {/* Header row */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : section.id)}
                className="flex-1 text-left"
              >
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-technical text-technical-label uppercase tracking-[0.1em]">
                    {String(index + 1).padStart(2, "0")} / {section.label || "Untitled"}
                  </span>
                  <span className="font-technical text-[10px] uppercase tracking-[0.08em] text-foreground-muted">
                    {activeTemplate?.label ?? section.template}
                  </span>
                  {!section.visible ? (
                    <span className="font-technical text-[10px] uppercase tracking-[0.08em] text-foreground-muted opacity-60">
                      hidden
                    </span>
                  ) : null}
                </div>
              </button>

              {/* Reorder */}
              <button
                type="button"
                onClick={() => moveSection(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="px-2 py-1 font-technical text-technical-label text-foreground-muted hover:text-foreground-primary disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveSection(index, 1)}
                disabled={index === sections.length - 1}
                aria-label="Move down"
                className="px-2 py-1 font-technical text-technical-label text-foreground-muted hover:text-foreground-primary disabled:opacity-30"
              >
                ↓
              </button>

              {/* Visibility toggle */}
              <button
                type="button"
                onClick={() => updateSection(index, { visible: !section.visible })}
                className={`px-2 py-1 font-technical text-technical-label uppercase ${section.visible ? "text-accent" : "text-foreground-muted"}`}
                aria-label={section.visible ? "Hide section" : "Show section"}
              >
                {section.visible ? "Visible" : "Hidden"}
              </button>

              {/* Expand/collapse chevron */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : section.id)}
                aria-label={isOpen ? "Collapse" : "Expand"}
                className="px-2 py-1 font-technical text-technical-label text-foreground-muted"
              >
                {isOpen ? "▲" : "▼"}
              </button>
            </div>

            {/* Body */}
            {isOpen ? (
              <div className="grid gap-6 p-5">
                {/* Label & kicker */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <TechnicalLabel>Section label</TechnicalLabel>
                    <input
                      type="text"
                      value={section.label}
                      onChange={(e) => updateSection(index, { label: e.target.value })}
                      placeholder="e.g. Personal Projects"
                      className={inputClass}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <TechnicalLabel>Kicker (optional)</TechnicalLabel>
                    <input
                      type="text"
                      value={section.kicker ?? ""}
                      onChange={(e) => updateSection(index, { kicker: e.target.value })}
                      placeholder="e.g. 04 / Side projects"
                      className={inputClass}
                    />
                  </label>
                </div>

                {/* Template picker */}
                <div>
                  <TechnicalLabel as="div" className="mb-3">Layout template</TechnicalLabel>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {TEMPLATE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateSection(index, { template: option.value })}
                        className={`border p-4 text-left transition-colors ${
                          section.template === option.value
                            ? "border-accent bg-surface"
                            : "border-border hover:border-border-strong"
                        }`}
                      >
                        <span className="block font-technical text-technical-label uppercase tracking-[0.1em]">
                          {option.label}
                        </span>
                        <span className="mt-1 block font-body text-xs text-foreground-muted">
                          {option.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project filter */}
                <div>
                  <TechnicalLabel as="div" className="mb-2">Projects in this section</TechnicalLabel>
                  <p className="mb-3 font-body text-xs text-foreground-muted">
                    Select specific projects, or leave all unchecked to include every visible project.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {projects.map((project) => {
                      const checked = selectedSlugs.includes(project.slug);
                      return (
                        <label
                          key={project.slug}
                          className={`flex cursor-pointer items-center gap-3 border p-3 transition-colors ${
                            checked ? "border-accent bg-surface" : "border-border hover:border-border-strong"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleSlug(index, project.slug)}
                            className="accent-[var(--accent)]"
                          />
                          <div className="min-w-0">
                            <span className="block font-technical text-technical-label uppercase truncate">
                              {project.name}
                            </span>
                            <span className="block font-body text-xs text-foreground-muted">
                              {project.year} · {project.slug}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Delete */}
                <div className="flex justify-end border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="font-technical text-technical-label uppercase text-foreground-muted hover:text-red-400"
                  >
                    Remove section
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}

