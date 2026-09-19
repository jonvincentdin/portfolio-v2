import { formatFileSize } from "@/lib/content/fs-utils";
import { getProjectFileSizeBytes, type LoadedProject } from "@/lib/content/projects";
import { TechnicalLabel } from "@/components/ui/TechnicalLabel";
import { DownloadProjectButton } from "./DownloadProjectButton";

type ProjectFilesProps = {
  project: LoadedProject;
};

/**
 * "PROJECT FILES" section (spec §61): individual downloadable files with
 * derived (never hand-maintained) sizes, styled as a spec table rather than
 * a generic file manager. The individual-file list is omitted entirely when
 * `files[]` is empty (spec §74), but "Download Project" always renders —
 * it downloads the whole folder, not the `files[]` list, so it's available
 * even for a project with no explicitly listed files.
 */
export async function ProjectFiles({ project }: ProjectFilesProps) {
  if (!project.downloadable) return null;
  const listedFiles = project.files.filter((file) => file.access !== "hidden");
  const hasListedFiles = listedFiles.length > 0;
  const fileSizes = await Promise.all(listedFiles.map((file) => getProjectFileSizeBytes(project, file)));

  return (
    <div>
      <TechnicalLabel accent as="div" className="mb-6">
        Project Files
      </TechnicalLabel>

      {hasListedFiles ? (
        <div className="mb-8 divide-y divide-border border-t border-b border-border">
          {listedFiles.map((file, index) => {
            const sizeBytes = fileSizes[index];
            return (
              <div key={file.path} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="flex min-w-0 items-baseline gap-4">
                  <span className="font-technical text-technical-label text-foreground-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="break-words font-body text-body-md text-foreground-primary">{file.name}</p>
                    <p className="mt-1 font-technical text-technical-label uppercase tracking-[0.08em] text-foreground-muted">
                      {file.type}
                      {sizeBytes !== null ? ` · ${formatFileSize(sizeBytes)}` : ""}
                    </p>
                  </div>
                </div>
                {file.access === "downloadable" ? <a href={`/api/projects/${project.slug}/files/${file.path}`} className="font-technical text-technical-label uppercase tracking-[0.1em] text-foreground-primary underline decoration-border underline-offset-4 transition-[color,opacity] motion-micro hover:text-accent hover:decoration-accent active:opacity-70">Download</a> : <span className="font-technical text-technical-label uppercase tracking-[0.1em] text-foreground-muted">Visible only</span>}
              </div>
            );
          })}
        </div>
      ) : null}

      <DownloadProjectButton slug={project.slug} folderName={project.folderName} />
    </div>
  );
}
