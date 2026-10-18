"use client";

import { useState } from "react";
import { Experience } from "@/lib/schemas";
import { Reveal } from "@/components/motion/Reveal";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";

interface WorkHistoryOrbitTemplateProps {
  entries: Experience[];
}

function formatMonth(value: string): string {
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function WorkHistoryOrbitTemplate({ entries }: WorkHistoryOrbitTemplateProps) {
  const [selectedEntry, setSelectedEntry] = useState<Experience | null>(null);

  const BASE_RADIUS = 30; // base percentage for the first ring
  const RADIUS_STEP = 15; // percentage increase per ring

  return (
    <div className="w-full">
      {/* Mobile view (<640px) */}
      <div className="flex flex-col gap-6 sm:hidden">
        {entries.map((entry, index) => (
          <Reveal key={entry.id} delayMs={index * 100}>
            <div className="pl-4 border-l-2 border-[var(--accent)] relative">
              <div className="absolute w-2 h-2 bg-[var(--accent)] -left-[5px] top-2" />
              <div className="text-body-sm text-foreground-muted mb-1">
                {formatMonth(entry.startDate)} - {entry.current ? "Present" : entry.endDate ? formatMonth(entry.endDate) : "Present"}
              </div>
              <h3 className="text-heading-sm font-heading text-foreground-primary mb-1">
                {entry.position}
              </h3>
              <div className="text-accent text-body-md mb-2">{entry.company}</div>
              <div className="text-body-sm text-foreground-muted mb-3">{entry.location}</div>
              
              <p className="text-body-sm text-foreground-primary mb-4 leading-relaxed">
                {entry.description}
              </p>
              
              {entry.responsibilities && entry.responsibilities.length > 0 && (
                <ul className="list-disc list-outside ml-4 mb-4 text-body-sm text-foreground-primary space-y-1">
                  {entry.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              )}

              {entry.technologies && entry.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.technologies.map((tech) => (
                    <TechnicalLabel key={tech}>{tech}</TechnicalLabel>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Desktop Orbit view (>=640px) */}
      <div className="hidden sm:block exp-orbit-container">
        <div className="exp-orbit-system">
          {/* Center node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-[var(--accent)] bg-background-primary flex items-center justify-center z-10 shadow-[0_0_15px_var(--accent)]">
            <span className="font-heading text-heading-sm text-foreground-primary">CORE</span>
          </div>

          {/* Rings and Nodes */}
          {entries.map((entry, index) => {
            const ringRadius = BASE_RADIUS + index * RADIUS_STEP;
            const duration = 120 + index * 30; // 120s+ rotation
            const direction = index % 2 === 0 ? "exp-spin" : "exp-spin-reverse";
            const isSelected = selectedEntry?.id === entry.id;

            return (
              <div
                key={entry.id}
                className="exp-orbit-ring"
                style={{
                  width: `${ringRadius * 2}%`,
                  height: `${ringRadius * 2}%`,
                  animationDuration: `${duration}s`,
                  animationDirection: index % 2 === 0 ? "normal" : "reverse"
                }}
              >
                <div
                  className="exp-orbit-node-container absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setSelectedEntry(entry)}
                >
                  {/* Reverse the rotation so text stays upright */}
                  <div
                    className={`exp-orbit-node w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_10px_var(--accent)] text-[var(--accent)]"
                        : "border-border-strong bg-surface text-foreground-muted hover:border-[var(--accent)]/50 hover:text-foreground-primary"
                    }`}
                    style={{
                      animation: `exp-spin-reverse ${duration}s linear infinite`,
                      animationDirection: index % 2 === 0 ? "normal" : "reverse"
                    }}
                  >
                    <span className="exp-orbit-node-inner text-technical-label font-technical text-xs">
                      {entry.company.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Detail Overlay */}
          {selectedEntry && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-background-primary/80 backdrop-blur-sm">
              <Reveal className="w-full max-w-md">
                <AngularPanel className="relative p-6 max-h-[80vh] overflow-y-auto">
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="absolute top-4 right-4 text-foreground-muted hover:text-[var(--accent)] transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="pr-8">
                    <h3 className="text-heading-md font-heading text-foreground-primary mb-1">
                      {selectedEntry.position}
                    </h3>
                    <div className="text-[var(--accent)] text-body-lg mb-2">{selectedEntry.company}</div>
                    
                    <div className="flex flex-col gap-1 text-body-sm text-foreground-muted mb-4">
                      <div>
                        {formatMonth(selectedEntry.startDate)} - {selectedEntry.current ? "Present" : selectedEntry.endDate ? formatMonth(selectedEntry.endDate) : "Present"}
                      </div>
                      <div>{selectedEntry.location}</div>
                    </div>
                    
                    <p className="text-body-sm text-foreground-primary mb-4 leading-relaxed">
                      {selectedEntry.description}
                    </p>
                    
                    {selectedEntry.responsibilities && selectedEntry.responsibilities.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-body-md font-heading text-foreground-primary mb-2">Key Responsibilities</h4>
                        <ul className="list-disc list-outside ml-4 text-body-sm text-foreground-muted space-y-1">
                          {selectedEntry.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedEntry.technologies && selectedEntry.technologies.length > 0 && (
                      <div>
                        <h4 className="text-body-md font-heading text-foreground-primary mb-2">Technologies</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedEntry.technologies.map((tech) => (
                            <TechnicalLabel key={tech}>{tech}</TechnicalLabel>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </AngularPanel>
              </Reveal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
