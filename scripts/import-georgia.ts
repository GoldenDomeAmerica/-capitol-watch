import { buildSnapshot, upsertSnapshot } from "./georgia";

async function main() {
  const snapshot = await buildSnapshot();
  await upsertSnapshot(snapshot);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
