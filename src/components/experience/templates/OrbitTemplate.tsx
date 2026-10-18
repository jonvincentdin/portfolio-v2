"use client";

/*
  Required CSS for OrbitTemplate (add to your global CSS or a module):
  .exp-orbit-container {
    perspective: 1000px;
  }
  .exp-orbit-system {
    position: relative;
    width: 100%;
    max-width: 600px;
    aspect-ratio: 1;
    margin: 0 auto;
  }
  .exp-orbit-system:hover .exp-orbit-ring {
    animation-play-state: paused;
  }
  .exp-orbit-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    border: 1px dashed var(--border-strong);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: exp-spin linear infinite;
  }
  .exp-orbit-node-container {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform-origin: center;
  }
  .exp-orbit-node {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .exp-orbit-node-inner {
    animation: exp-spin-reverse linear infinite;
  }
  
  @keyframes exp-spin {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes exp-spin-reverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
*/

import React, { useState } from "react";
import { Education } from "@/lib/schemas";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { Reveal } from "@/components/motion/Reveal";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";

interface OrbitTemplateProps {
  entries: Education[];
}

export function OrbitTemplate({ entries }: OrbitTemplateProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const selectedEntry = selectedIndex !== null ? entries[selectedIndex] : null;

  // Calculate orbit dimensions based on entry count
  const baseRadius = 120;
  const radiusStep = 60;

  if (!entries.length) return null;

  const handleNodeClick = (index: number) => {
    setSelectedIndex(index);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedIndex(null);
  };

  return (
    <div className="w-full flex flex-col gap-12 font-body">
      {/* Mobile View (< 640px) */}
      <div className="sm:hidden flex flex-col gap-8">
        {entries.map((entry, index) => (
          <div 
            key={entry.id}
            className={`pl-4 border-l-2 transition-colors duration-300 ${index === selectedIndex ? 'border-accent' : 'border-border cursor-pointer'}`}
            onClick={() => setSelectedIndex(index === selectedIndex ? null : index)}
          >
            <div className="text-technical-label text-accent mb-1 font-technical uppercase">
              {entry.startYear} — {entry.endYear || "PRESENT"}
            </div>
            <h3 className="text-heading-md font-heading text-foreground-primary uppercase">{entry.institution}</h3>
            <div className="text-body-md text-foreground-muted mb-3 uppercase">{entry.program}</div>
            
            {index === selectedIndex && (
              <Reveal>
                <div className="text-body-sm text-foreground-muted mb-4">{entry.description}</div>
                {entry.achievements && entry.achievements.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {entry.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-2 text-body-sm">
                        <span className="text-accent mt-1">▰</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            )}
          </div>
        ))}
      </div>

      {/* Desktop View (>= 640px) - Orbital System */}
      <div className="hidden sm:block exp-orbit-container relative bg-background-primary py-12 rounded-sm border border-border overflow-hidden">
        <div className="exp-orbit-system h-[500px]">
          {/* Core */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center w-16 h-16 bg-surface border border-accent rounded-sm shadow-[0_0_30px_rgba(232,180,0,0.2)]">
            <span className="font-technical text-technical-label text-accent tracking-widest uppercase">CORE</span>
          </div>

          {/* Orbits & Nodes */}
          {entries.map((entry, index) => {
            const radius = baseRadius + (index * radiusStep);
            const diameter = radius * 2;
            const duration = prefersReducedMotion ? 0 : 120 + (index * 40); // Slower outer rings
            // Alternate initial rotation for distribution
            const rotationOffset = index * (360 / entries.length);

            return (
              <div 
                key={entry.id}
                className="exp-orbit-ring"
                style={{ 
                  width: `${diameter}px`, 
                  height: `${diameter}px`,
                  animationDuration: `${duration}s`,
                  animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
                  zIndex: entries.length - index
                }}
              >
                {/* Node Container to position node on the ring */}
                <div 
                  className="exp-orbit-node-container" 
                  style={{ transform: `rotate(${rotationOffset}deg)` }}
                >
                  <div 
                    className={`exp-orbit-node group flex flex-col items-center gap-2`}
                    onClick={() => handleNodeClick(index)}
                    onMouseEnter={() => !isOverlayOpen && setSelectedIndex(index)}
                    onMouseLeave={() => !isOverlayOpen && setSelectedIndex(null)}
                  >
                    {/* Node Visual */}
                    <div className={`w-4 h-4 border transition-all duration-300 ${
                      selectedIndex === index 
                        ? 'bg-accent border-accent shadow-[0_0_15px_rgba(232,180,0,0.5)] scale-125' 
                        : 'bg-surface border-foreground-muted hover:border-accent'
                    }`} style={{ transform: 'rotate(45deg)' }}></div>
                    
                    {/* Counter-rotate inner content so text stays upright */}
                    <div 
                      className="exp-orbit-node-inner whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-6"
                      style={{ 
                        animationDuration: `${duration}s`,
                        animationDirection: index % 2 === 0 ? 'reverse' : 'normal',
                        animationPlayState: 'inherit' // Inherit pause on hover
                      }}
                    >
                      <div className="bg-surface/90 border border-border px-3 py-1 text-technical-label font-technical text-accent uppercase">
                        {entry.startYear}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overlay Panel inside orbit container */}
        {isOverlayOpen && selectedEntry && (
          <div 
            className="absolute inset-0 z-30 flex items-center justify-center p-8 bg-background-primary/80 backdrop-blur-sm"
            onClick={closeOverlay}
          >
            <div 
              className="w-full max-w-2xl" 
              onClick={(e) => e.stopPropagation()}
            >
              <Reveal mode="mount">
                <AngularPanel className="relative p-8 border border-border-strong bg-surface">
                  {/* Close button */}
                  <button 
                    onClick={closeOverlay}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-border hover:border-accent hover:text-accent transition-colors text-foreground-muted bg-background-primary"
                    aria-label="Close details"
                  >
                    <span className="font-technical text-sm">X</span>
                  </button>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6 pr-8">
                    <div>
                      <h3 className="text-display-lg text-foreground-primary font-heading mb-2 uppercase">
                        {selectedEntry.institution}
                      </h3>
                      <div className="text-heading-sm text-foreground-muted uppercase">
                        {selectedEntry.program}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 text-left md:text-right">
                      <TechnicalLabel className="text-accent uppercase">
                        TIMELINE
                      </TechnicalLabel>
                      <div className="text-heading-sm font-technical mt-2 uppercase text-foreground-primary">
                        {selectedEntry.startYear} — {selectedEntry.endYear || "PRESENT"}
                      </div>
                    </div>
                  </div>

                  {selectedEntry.description && (
                    <p className="text-body-lg text-foreground-muted mb-8 max-w-3xl">
                      {selectedEntry.description}
                    </p>
                  )}

                  {selectedEntry.achievements && selectedEntry.achievements.length > 0 && (
                    <div className="mt-6">
                      <TechnicalLabel className="mb-4 uppercase text-foreground-primary">ACHIEVEMENTS / METRICS</TechnicalLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedEntry.achievements.map((ach, i) => (
                          <div key={i} className="flex items-start gap-3 bg-background-primary/50 p-4 border border-border">
                            <div className="w-2 h-2 mt-1.5 border border-accent flex-shrink-0"></div>
                            <span className="text-body-md text-foreground-primary">{ach}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </AngularPanel>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
