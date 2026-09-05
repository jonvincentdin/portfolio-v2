/**
 * Site identity — name, role, and hero/metadata copy. This is intentionally
 * a plain constant, not a JSON content type: CONTENT_SYSTEM.md's dynamic
 * content system covers exactly seven types (projects, experience,
 * education, certifications, achievements, services, skills), and personal
 * identity copy doesn't fit any of them. Lives here so Home (and later
 * About) share one source rather than duplicating name/role text.
 */
export const SITE_IDENTITY = {
  name: "Your Name",
  role: "Full Stack Developer",
  supportingStatement:
    "Engineering digital experiences with performance, precision, and purpose.",
  introduction:
    "I build full-stack web applications end to end — from database schema to deployed UI — with an emphasis on clean architecture and considered motion design.",
  location: "Philippines",
  specialization: "Full Stack Development",
  status: "Available for opportunities",
  contactEmail: "hello@example.com",
} as const;
