// VaultTemplate.tsx
/*
CSS Needed:
- Uses Tailwind arbitrary values for perspective and transition cubic-bezier.
*/

"use client";

import React, { useState } from 'react';
import { Certification } from '@/lib/schemas';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { usePrefersReducedMotion } from '@/lib/motion/usePrefersReducedMotion';

function VaultCompartment({ cert, index, isOpen, toggleOpen }: { cert: Certification, index: number, isOpen: boolean, toggleOpen: () => void }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const vaultNumber = `VAULT-${(index + 1).toString().padStart(2, '0')}`;

  return (
    <div className="relative w-full aspect-square sm:aspect-[4/3] h-full" style={{ perspective: '800px' }}>
      {/* Interior (Behind the door) */}
      <div 
        className={`absolute inset-0 bg-background-primary border border-border p-5 flex flex-col justify-between transition-opacity duration-300 ${isOpen ? 'opacity-100 z-0' : 'opacity-0 z-0 delay-200'} shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]`}
      >
        <div className={`flex-1 ${isOpen ? (prefersReducedMotion ? "" : "motion-safe:animate-fade-in") : ""}`}>
          <p className="text-technical-label text-accent mb-2">
            {cert.date}
          </p>
          <h3 className="text-heading-sm font-heading text-foreground-primary uppercase leading-tight line-clamp-3">
            {cert.title}
          </h3>
          <p className="text-body-sm font-body text-foreground-muted mt-2">
            {cert.issuer}
          </p>
          {cert.credentialId && (
            <p className="text-technical-label text-foreground-muted mt-3 opacity-60">
              ID: {cert.credentialId}
            </p>
          )}
        </div>
        
        {cert.credentialUrl && (
          <div className="mt-4 flex-shrink-0">
            <ArrowLink href={cert.credentialUrl}>
              VERIFY
            </ArrowLink>
          </div>
        )}
      </div>

      {/* Vault Door (Front face) */}
      <button
        onClick={toggleOpen}
        className="absolute inset-0 w-full h-full text-left origin-left border border-border bg-surface p-4 flex flex-col cursor-pointer transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] z-10"
        style={{
          transform: isOpen && !prefersReducedMotion ? 'rotateY(-95deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d',
          background: 'linear-gradient(135deg, var(--surface) 0%, rgba(20,20,20,0.95) 100%)',
          boxShadow: isOpen ? '-4px 0 12px var(--accent)' : 'none'
        }}
        aria-expanded={isOpen}
      >
        <div className="flex justify-between items-start w-full pointer-events-none">
          <span className="text-technical-label text-foreground-muted font-bold tracking-widest bg-background-primary px-2 py-1 border border-border shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
            {vaultNumber}
          </span>
          {/* Lock Indicator */}
          <span className={`text-[10px] font-technical tracking-wider ${isOpen ? 'text-accent' : 'text-foreground-muted opacity-50'}`}>
            {isOpen ? 'OPEN' : '■'}
          </span>
        </div>
        
        {/* Keyhole indicator in center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full border border-border bg-background-primary flex items-center justify-center shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]">
            <div className={`w-2 h-2 rounded-full ${isOpen ? 'bg-accent shadow-[0_0_10px_var(--accent)]' : 'bg-foreground-muted opacity-20'}`} />
          </div>
        </div>

        {/* Bottom decorative rivets/bolts */}
        <div className="mt-auto pointer-events-none flex justify-between w-full">
           <div className="w-2.5 h-2.5 rounded-full bg-background-primary border border-border shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
           <div className="w-2.5 h-2.5 rounded-full bg-background-primary border border-border shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
        </div>
      </button>
    </div>
  );
}

export function VaultTemplate({ certifications }: { certifications: Certification[] }) {
  const [openCompartments, setOpenCompartments] = useState<Set<number>>(new Set());

  const toggleOpen = (index: number) => {
    setOpenCompartments(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (!certifications || certifications.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 bg-border p-1 w-full">
      {certifications.map((cert, index) => (
        <VaultCompartment 
          key={cert.id} 
          cert={cert} 
          index={index} 
          isOpen={openCompartments.has(index)} 
          toggleOpen={() => toggleOpen(index)} 
        />
      ))}
    </div>
  );
}
