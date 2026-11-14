import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type AppDb = NeonHttpDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;

let cached: AppDb | null = null;

function createDb(url: string): AppDb {
  if (url.includes("neon.tech")) {
    return drizzleNeon(neon(url), { schema });
  }
  const local = /localhost|127\.0\.0\.1/.test(url);
  const client = postgres(url, {
    max: 1,
    ssl: local ? false : "require",
    prepare: false,
  });
  return drizzlePg(client, { schema });
}

/** Null when DATABASE_URL is missing so preview deploys render an empty state. */
export function getDb(): AppDb | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!cached) cached = createDb(url);
  return cached;
}

export function databaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
