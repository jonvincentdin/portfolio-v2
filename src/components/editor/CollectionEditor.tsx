"use client";

import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { MediaPicker } from "./MediaPicker";

type CollectionKey = "experience" | "education" | "certifications" | "skills" | "achievements" | "services";
export type RecordValue = Record<string, unknown>;
type FieldType = "text" | "textarea" | "url" | "month" | "tags" | "image";
type Field = { key: string; label: string; type?: FieldType; optional?: boolean; wide?: boolean };

const schemas: Record<CollectionKey, Field[]> = {
  experience: [{ key: "company", label: "Company" }, { key: "position", label: "Position" }, { key: "startDate", label: "Start date", type: "month" }, { key: "endDate", label: "End date", type: "month", optional: true }, { key: "location", label: "Location" }, { key: "description", label: "Description", type: "textarea", wide: true }, { key: "responsibilities", label: "Responsibilities", type: "tags", wide: true }, { key: "technologies", label: "Technologies", type: "tags", wide: true }],
  education: [{ key: "institution", label: "Institution" }, { key: "program", label: "Program" }, { key: "startYear", label: "Start year" }, { key: "endYear", label: "End year" }, { key: "description", label: "Description", type: "textarea", wide: true }, { key: "achievements", label: "Achievements", type: "tags", wide: true }],
  certifications: [{ key: "title", label: "Title" }, { key: "issuer", label: "Issuer" }, { key: "date", label: "Date", type: "month" }, { key: "credentialId", label: "Credential ID", optional: true }, { key: "credentialUrl", label: "Verification URL", type: "url", optional: true }, { key: "image", label: "Certificate image", type: "image", optional: true, wide: true }],
  skills: [{ key: "category", label: "Category" }],
  achievements: [{ key: "title", label: "Title" }, { key: "organization", label: "Organization" }, { key: "date", label: "Date", type: "month" }, { key: "description", label: "Description", type: "textarea", wide: true }, { key: "image", label: "Achievement image", type: "image", optional: true, wide: true }],
  services: [{ key: "title", label: "Title" }, { key: "description", label: "Description", type: "textarea", wide: true }, { key: "capabilities", label: "Capabilities", type: "tags", wide: true }],
};
const titles: Record<CollectionKey, string> = { experience: "Experience", education: "Education", certifications: "Certifications", skills: "Skill categories", achievements: "Achievements", services: "Services" };
const inputClass = "w-full min-w-0 border-b border-border-strong bg-transparent py-2 font-body text-body-md text-foreground-primary focus-visible:border-accent focus-visible:outline-none";
const areaClass = "w-full min-w-0 resize-y border border-border bg-background-primary p-3 font-body text-body-md text-foreground-primary focus-visible:border-accent focus-visible:outline-none";
function stringValue(value: unknown) { return typeof value === "string" ? value : ""; }
function listValue(value: unknown) { return Array.isArray(value) ? value.map(String).join(", ") : ""; }
function idFor(key: CollectionKey) { return `${key}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function newItem(key: CollectionKey, order: number): RecordValue {
  const item: RecordValue = { id: idFor(key), order, visible: true };
  for (const field of schemas[key]) item[field.key] = field.type === "tags" ? [] : field.type === "image" ? undefined : "";
  if (key === "experience") item.current = false;
  if (key === "skills") item.skills = [{ name: "", order: 0, visible: true, featured: false }];
  return item;
}

export function CollectionEditor({ collectionKey, items, onChange }: { collectionKey: CollectionKey; items: readonly RecordValue[]; onChange: (items: RecordValue[]) => void }) {
  function update(index: number, key: string, value: unknown) { onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item)); }
  function move(index: number, direction: -1 | 1) { const target = index + direction; if (target < 0 || target >= items.length) return; const next = [...items]; [next[index], next[target]] = [next[target], next[index]]; onChange(next.map((item, itemIndex) => ({ ...item, order: itemIndex }))); }
  function duplicate(index: number) { const next = [...items]; next.splice(index + 1, 0, { ...items[index], id: idFor(collectionKey) }); onChange(next.map((item, itemIndex) => ({ ...item, order: itemIndex }))); }
  function updateSkill(categoryIndex: number, skillIndex: number, key: string, value: unknown) { const category = items[categoryIndex]; const skills = Array.isArray(category.skills) ? category.skills as RecordValue[] : []; update(categoryIndex, "skills", skills.map((skill, index) => index === skillIndex ? { ...skill, [key]: value } : skill)); }

  return <section className="grid min-w-0 gap-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><TechnicalLabel accent as="div">Schema editor / {titles[collectionKey]}</TechnicalLabel><p className="mt-2 max-w-2xl font-body text-body-md text-foreground-muted">Manage entries as cards. Changes stay in this draft until you press Save.</p></div><button type="button" onClick={() => onChange([...items, newItem(collectionKey, items.length)])} className="bg-accent px-4 py-3 font-technical text-technical-label uppercase text-accent-foreground">+ Add {collectionKey === "skills" ? "category" : collectionKey}</button></div>
    {items.map((item, index) => <article key={String(item.id ?? index)} className="border border-border bg-surface p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4"><div className="flex items-center gap-3"><TechnicalLabel accent as="div">{String(index + 1).padStart(2, "0")}</TechnicalLabel><span className="font-heading text-heading-sm uppercase">{stringValue(item.title) || stringValue(item.company) || stringValue(item.institution) || stringValue(item.category) || `New ${collectionKey}`}</span></div><div className="flex flex-wrap items-center gap-3"><label className="flex items-center gap-2 font-technical text-technical-label uppercase"><input type="checkbox" checked={item.visible !== false} onChange={(event) => update(index, "visible", event.target.checked)} /> Visible</label><button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move entry up" className="font-technical text-technical-label uppercase text-foreground-muted hover:text-accent disabled:opacity-30">↑</button><button type="button" onClick={() => move(index, 1)} disabled={index === items.length - 1} aria-label="Move entry down" className="font-technical text-technical-label uppercase text-foreground-muted hover:text-accent disabled:opacity-30">↓</button><button type="button" onClick={() => duplicate(index)} className="font-technical text-technical-label uppercase text-foreground-muted hover:text-accent">Duplicate</button><button type="button" onClick={() => { if (window.confirm("Remove this entry from the draft?")) onChange(items.filter((_, itemIndex) => itemIndex !== index)); }} className="font-technical text-technical-label uppercase text-foreground-muted hover:text-red-400">Delete</button></div></div>
      <div className="grid gap-5 sm:grid-cols-2">
        {schemas[collectionKey].map((field) => {
          const label = `${field.label}${field.optional ? " / optional" : ""}`;
          return <div key={field.key} className={field.wide ? "sm:col-span-2" : ""}>
            {field.type === "image" ? <MediaPicker label={label} value={stringValue(item[field.key]) || undefined} onChange={(value) => update(index, field.key, value)} /> : <label className="flex min-w-0 flex-col gap-2"><TechnicalLabel>{label}</TechnicalLabel>{field.type === "textarea" ? <textarea rows={4} value={stringValue(item[field.key])} onChange={(event) => update(index, field.key, event.target.value)} className={areaClass} /> : <input type={field.type === "url" ? "url" : field.type === "month" ? "month" : "text"} value={field.type === "tags" ? listValue(item[field.key]) : stringValue(item[field.key])} onChange={(event) => update(index, field.key, field.type === "tags" ? event.target.value.split(",").map((value) => value.trim()).filter(Boolean) : event.target.value)} className={inputClass} placeholder={field.type === "tags" ? "Add items separated by commas" : undefined} />}</label>}
          </div>;
        })}
      </div>
      {collectionKey === "experience" ? <label className="mt-5 flex items-center gap-2 font-technical text-technical-label uppercase"><input type="checkbox" checked={item.current === true} onChange={(event) => update(index, "current", event.target.checked)} /> Current role</label> : null}
      {collectionKey === "skills" ? <div className="mt-6 border-t border-border pt-5"><TechnicalLabel>Skills in this category</TechnicalLabel><div className="mt-3 grid gap-3">{(Array.isArray(item.skills) ? item.skills as RecordValue[] : []).map((skill, skillIndex) => <div key={skillIndex} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_155px_auto_auto]"><input value={stringValue(skill.name)} placeholder="Skill name" onChange={(event) => updateSkill(index, skillIndex, "name", event.target.value)} className={inputClass} /><select value={stringValue(skill.level)} onChange={(event) => updateSkill(index, skillIndex, "level", event.target.value || undefined)} className="border border-border bg-background-primary p-2 font-technical text-technical-label uppercase"><option value="">No level</option><option>Learning</option><option>Familiar</option><option>Intermediate</option><option>Advanced</option><option>Primary</option></select><label className="flex items-center gap-2 font-technical text-technical-label uppercase"><input type="checkbox" checked={skill.featured === true} onChange={(event) => updateSkill(index, skillIndex, "featured", event.target.checked)} /> Featured</label><button type="button" onClick={() => update(index, "skills", (item.skills as RecordValue[]).filter((_, currentIndex) => currentIndex !== skillIndex))} className="font-technical text-technical-label uppercase text-foreground-muted hover:text-red-400">Remove</button></div>)}<button type="button" onClick={() => update(index, "skills", [...(item.skills as RecordValue[]), { name: "", order: (item.skills as RecordValue[]).length, visible: true, featured: false }])} className="w-fit border border-border-strong px-3 py-2 font-technical text-technical-label uppercase hover:border-accent hover:text-accent">+ Add skill</button></div></div> : null}
    </article>)}
    {items.length === 0 ? <div className="border border-dashed border-border-strong p-10 text-center"><p className="font-body text-body-md text-foreground-muted">No {titles[collectionKey].toLowerCase()} yet.</p><button type="button" onClick={() => onChange([newItem(collectionKey, 0)])} className="mt-4 border border-border-strong px-4 py-3 font-technical text-technical-label uppercase hover:border-accent hover:text-accent">Create first entry</button></div> : null}
  </section>;
}
