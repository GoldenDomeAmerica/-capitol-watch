import { spawn } from "node:child_process";
import path from "node:path";
import { config as loadEnv } from "dotenv";
import postgres from "postgres";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

function redact(value: string): string {
  return value
    .replace(/postgres(?:ql)?:\/\/[^\s)'"]+/gi, "postgres://[redacted]")
    .replace(/DATABASE_URL_UNPOOLED=\S+/g, "DATABASE_URL_UNPOOLED=[redacted]")
    .replace(/DATABASE_URL=\S+/g, "DATABASE_URL=[redacted]");
}

function bin(name: string): string {
  return path.join(process.cwd(), "node_modules", ".bin", name);
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.on("data", (chunk: Buffer) => {
      process.stdout.write(redact(chunk.toString()));
    });
    child.stderr.on("data", (chunk: Buffer) => {
      process.stderr.write(redact(chunk.toString()));
    });
    child.on("error", (error) => reject(error));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(command)} ${args.join(" ")} failed with exit code ${code ?? "unknown"}`));
    });
  });
}

async function billCounts(url: string): Promise<{ ga: number; pa: number; az: number }> {
  const local = /localhost|127\.0\.0\.1/.test(url);
  const sql = postgres(url, {
    max: 1,
    ssl: local ? false : "require",
    prepare: false,
    connect_timeout: 20,
  });
  try {
    const rows = await sql<{ state_id: string; n: number }[]>`
      select state_id, count(*)::int as n from bills group by state_id
    `;
    const counts = { ga: 0, pa: 0, az: 0 };
    for (const row of rows) {
      if (row.state_id === "ga") counts.ga = Number(row.n);
      if (row.state_id === "pa") counts.pa = Number(row.n);
      if (row.state_id === "az") counts.az = Number(row.n);
    }
    return counts;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function main() {
  const pooled = process.env.DATABASE_URL?.trim();
  const unpooled = process.env.DATABASE_URL_UNPOOLED?.trim();
  const migrateUrl = unpooled || pooled;

  if (!migrateUrl) {
    console.log("DATABASE_URL is not set. Skipping database migration and seed.");
  } else {
    const source = unpooled ? "DATABASE_URL_UNPOOLED" : "DATABASE_URL";
    console.log(`Applying database migrations with ${source}.`);
    const migrateEnv: NodeJS.ProcessEnv = { ...process.env, DATABASE_URL: migrateUrl };
    await run(bin("drizzle-kit"), ["migrate"], migrateEnv);

    const counts = await billCounts(migrateUrl);
    if (counts.ga === 0) {
      console.log("No Georgia bills yet. Seeding Georgia data.");
      await run(bin("tsx"), ["scripts/seed.ts"], migrateEnv);
    } else {
      console.log(`Georgia already has ${counts.ga} bills. Leaving those rows in place.`);
    }
    if (counts.pa === 0) {
      console.log("No Pennsylvania bills yet. Seeding Pennsylvania data.");
      await run(bin("tsx"), ["scripts/seed-pennsylvania.ts"], migrateEnv);
    } else {
      console.log(`Pennsylvania already has ${counts.pa} bills. Leaving those rows in place.`);
    }
    if (counts.az === 0) {
      console.log("No Arizona bills yet. Seeding Arizona data.");
      await run(bin("tsx"), ["scripts/seed-arizona.ts"], migrateEnv);
    } else {
      console.log(`Arizona already has ${counts.az} bills. Leaving those rows in place.`);
    }
  }

  console.log("Building Next.js.");
  await run(bin("next"), ["build"], process.env);
}

main().catch((error) => {
  const text = error instanceof Error ? error.stack || error.message : String(error);
  console.error(redact(text));
  process.exit(1);
});
