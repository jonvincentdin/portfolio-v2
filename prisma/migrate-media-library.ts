import { db } from "../src/lib/db";

async function main() {
  const legacyAssets = await db.projectAsset.findMany({ where: { mediaAssetId: null } });
  let migrated = 0;
  for (const asset of legacyAssets) {
    if (!asset.data) continue;
    const library = await db.mediaAsset.create({
      data: {
        name: asset.name ?? asset.path.split("/").pop() ?? "Project asset",
        storageKey: `library/migrated/${asset.projectId}/${asset.id}`,
        kind: ["hero", "thumbnail", "gallery"].includes(asset.kind) || Boolean(asset.mimeType?.startsWith("image/")) ? "image" : "file",
        type: asset.type ?? "other",
        description: asset.description,
        mimeType: asset.mimeType ?? "application/octet-stream",
        size: asset.size ?? asset.data.byteLength,
        data: asset.data,
      },
    });
    await db.projectAsset.update({ where: { id: asset.id }, data: { mediaAssetId: library.id, data: null } });
    migrated += 1;
  }
  console.log(`Migrated ${migrated} project assets into the media library.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(() => db.$disconnect());
