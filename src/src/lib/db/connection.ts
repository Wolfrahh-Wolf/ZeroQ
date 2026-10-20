// src/lib/db/connection.ts
// Manages a singleton Oracle DB connection pool via node-oracledb (thin mode).
// All DB access throughout the app must go through getPool().

import oracledb from "oracledb";

let pool: oracledb.Pool | null = null;

export async function getPool(): Promise<oracledb.Pool> {
  if (pool) return pool;

  // Thin mode — do NOT call initOracleClient() as that forces Thick mode
  // node-oracledb v6+ defaults to pure JS Thin mode automatically.

  pool = await oracledb.createPool({
    user: process.env.DB_USER ?? "zerq_app",
    password: process.env.DB_PASSWORD ?? "ZeroQ_App1",
    connectString: process.env.DB_CONNECTION_STRING ?? "localhost:1521/FREEPDB1",
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1,
  });

  return pool;
}

/**
 * Execute a query and return all rows as plain objects.
 * Automatically acquires and releases a connection from the pool.
 */
export async function query<T = Record<string, unknown>>(
  sql: string,
  binds: oracledb.BindParameters = [],
  opts: oracledb.ExecuteOptions = {}
): Promise<T[]> {
  const p = await getPool();
  const conn = await p.getConnection();
  try {
    const result = await conn.execute<T>(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...opts,
    });
    const rows = (result.rows ?? []) as Record<string, unknown>[];
    const mapped = rows.map((row) => {
      const obj: Record<string, unknown> = { ...row };
      for (const [key, value] of Object.entries(row)) {
        obj[key.toLowerCase()] = value;
      }
      return obj;
    });
    return mapped as T[];
  } finally {
    await conn.close();
  }
}

/**
 * Execute a DML statement (INSERT / UPDATE) and commit.
 */
export async function execute(
  sql: string,
  binds: oracledb.BindParameters = [],
  opts: oracledb.ExecuteOptions = {}
): Promise<oracledb.Result<unknown>> {
  const p = await getPool();
  const conn = await p.getConnection();
  try {
    const result = await conn.execute(sql, binds, {
      autoCommit: true,
      ...opts,
    });
    return result;
  } finally {
    await conn.close();
  }
}
