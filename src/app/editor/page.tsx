import { redirect } from "next/navigation";
import { getOwnerSession } from "@/lib/auth";
import { getEditorSnapshot } from "@/lib/content/editor";
import { getProfileImage } from "@/lib/profile";
import { EditorShell } from "@/components/editor/EditorShell";

export const dynamic = "force-dynamic";

export default async function EditorPage() {
  if (!(await getOwnerSession())) redirect("/owner");
  return <EditorShell initialContent={await getEditorSnapshot()} initialProfile={await getProfileImage()} />;
}
