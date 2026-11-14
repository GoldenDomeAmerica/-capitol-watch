import { config as loadEnv } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../src/db/schema";

loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

export function openScriptDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is required. Put it in .env.local, then run npm run db:migrate and npm run db:seed.",
    );
  }
  const local = /localhost|127\.0\.0\.1/.test(url);
  const client = postgres(url, {
    max: 1,
    ssl: local ? false : "require",
    prepare: false,
  });
  return { db: drizzle(client, { schema }), client };
}
