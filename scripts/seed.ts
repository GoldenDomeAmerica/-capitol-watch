import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildSnapshot, upsertSnapshot, type Snapshot } from "./georgia";

async function main() {
  const snapshotPath = path.join(process.cwd(), "data", "georgia", "snapshot.json");
  let snapshot: Snapshot;
  if (process.env.IMPORT_FRESH === "1") {
    snapshot = await buildSnapshot();
  } else {
    try {
      snapshot = JSON.parse(await readFile(snapshotPath, "utf8")) as Snapshot;
      console.log(`Seeding from ${snapshotPath} (${snapshot.generatedAt}).`);
    } catch {
      console.log("No snapshot on disk. Downloading public Georgia data first.");
      snapshot = await buildSnapshot();
    }
  }
  if (snapshot.bills.length < 30) {
    throw new Error(`Snapshot has ${snapshot.bills.length} bills; refusing to seed fewer than 30.`);
  }
  await upsertSnapshot(snapshot);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
