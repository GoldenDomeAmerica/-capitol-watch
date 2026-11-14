import { readFile } from "node:fs/promises";
import path from "node:path";
import { upsertSnapshot, type PennsylvaniaSnapshot } from "./pennsylvania";

async function main() {
  const snapshotPath = path.join(process.cwd(), "data", "pennsylvania", "snapshot.json");
  const snapshot = JSON.parse(await readFile(snapshotPath, "utf8")) as PennsylvaniaSnapshot;
  console.log(`Seeding Pennsylvania from ${snapshotPath} (${snapshot.generatedAt}).`);
  if (snapshot.bills.length < 50) {
    throw new Error(`Pennsylvania snapshot has ${snapshot.bills.length} bills; refusing to seed fewer than 50.`);
  }
  await upsertSnapshot(snapshot);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
