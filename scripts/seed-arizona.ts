import { readFile } from "node:fs/promises";
import path from "node:path";
import { upsertSnapshot, type ArizonaSnapshot } from "./arizona";

async function main() {
  const snapshotPath = path.join(process.cwd(), "data", "arizona", "snapshot.json");
  const snapshot = JSON.parse(await readFile(snapshotPath, "utf8")) as ArizonaSnapshot;
  console.log(`Seeding Arizona from ${snapshotPath} (${snapshot.generatedAt}).`);
  if (snapshot.bills.length < 55) {
    throw new Error(`Arizona snapshot has ${snapshot.bills.length} bills; refusing to seed fewer than 55.`);
  }
  await upsertSnapshot(snapshot);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
