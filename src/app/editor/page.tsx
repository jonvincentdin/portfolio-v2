import { redirect } from "next/navigation";
import { getOwnerSession } from "@/lib/auth";
import { getEditorSnapshot } from "@/lib/content/editor";
import { getProfileImage } from "@/lib/profile";
import { EditorShell } from "@/components/editor/EditorShell";
import { seedContentMode } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditorPage() {
  if (!(await getOwnerSession())) redirect("/owner");
  return <>
    {seedContentMode ? <p role="status" className="border-b border-accent bg-surface p-4 text-center text-caption">Read-only seed preview. Saved database content is not loaded; saving and uploads require restored database access.</p> : null}
    <EditorShell initialContent={await getEditorSnapshot()} initialProfile={await getProfileImage()} />
  </>;
}
