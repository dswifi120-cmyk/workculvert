import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { Pool } from "pg";
import { ensurePgliteInitialized } from "@/db/pglite-bootstrap";

export const isUsingEmbeddedDb = !process.env.DATABASE_URL;

type GlobalDb = typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __wcPgDb?: NodePgDatabase;
  __wcEmbeddedDbPromise?: Promise<NodePgDatabase>;
};

const globalForDb = globalThis as GlobalDb;

function getPostgresDb(): NodePgDatabase {
  if (!globalForDb.__wcPgDb) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required");
    }
    const pool =
      globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({
        connectionString: databaseUrl,
      });
    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsPostgresqlPool = pool;
    }
    globalForDb.__wcPgDb = drizzlePg(pool);
  }
  return globalForDb.__wcPgDb;
}

async function getEmbeddedDb(): Promise<NodePgDatabase> {
  if (!globalForDb.__wcEmbeddedDbPromise) {
    globalForDb.__wcEmbeddedDbPromise = ensurePgliteInitialized().then(
      (client) => drizzlePglite(client) as unknown as NodePgDatabase
    );
  }
  return globalForDb.__wcEmbeddedDbPromise;
}

/**
 * Returns the active Drizzle database instance:
 * - Production / configured environments (`DATABASE_URL` set): PostgreSQL via `pg.Pool`
 * - Local / preview environments without `DATABASE_URL`: auto-initialized embedded PGlite PostgreSQL
 */
export async function getDb(): Promise<NodePgDatabase> {
  if (process.env.DATABASE_URL) {
    return getPostgresDb();
  }
  return getEmbeddedDb();
}
