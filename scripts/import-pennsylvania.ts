import { buildSnapshot, upsertSnapshot } from "./pennsylvania";

async function main() {
  const snapshot = await buildSnapshot();
  if (!process.env.DATABASE_URL?.trim()) {
    console.log("DATABASE_URL is not set. Snapshot written. Skipping the database upsert.");
    return;
  }
  await upsertSnapshot(snapshot);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
