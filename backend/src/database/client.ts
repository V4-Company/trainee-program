import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";
import type { Database } from "./types.js";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined.");
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: databaseUrl
  })
});

export const db = new Kysely<Database>({ dialect });
