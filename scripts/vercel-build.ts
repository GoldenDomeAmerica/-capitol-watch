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

async function billCount(url: string): Promise<number> {
  const local = /localhost|127\.0\.0\.1/.test(url);
  const sql = postgres(url, {
    max: 1,
    ssl: local ? false : "require",
    prepare: false,
    connect_timeout: 20,
  });
  try {
    const rows = await sql<{ n: number }[]>`select count(*)::int as n from bills`;
    return Number(rows[0]?.n ?? 0);
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

    const count = await billCount(migrateUrl);
    if (count === 0) {
      console.log("Bills table is empty. Seeding Georgia data.");
      await run(bin("tsx"), ["scripts/seed.ts"], migrateEnv);
    } else {
      console.log(`Bills table already has ${count} rows. Leaving existing data in place.`);
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
