import mysql from "mysql2/promise";
import { loadLocalEnv } from "../server/load-env.js";

loadLocalEnv();

function isTidbConfigured() {
  return Boolean(
    process.env.TIDB_DATABASE_URL ||
      (process.env.TIDB_HOST && process.env.TIDB_USER && process.env.TIDB_PASSWORD && process.env.TIDB_DATABASE),
  );
}

function sslConfig() {
  if (process.env.TIDB_SSL === "false" || process.env.TIDB_SSL_DISABLED === "1") return undefined;
  return {
    minVersion: "TLSv1.2",
    rejectUnauthorized: process.env.TIDB_SSL_REJECT_UNAUTHORIZED !== "false",
  };
}

function connectionConfig() {
  const ssl = sslConfig();
  if (process.env.TIDB_DATABASE_URL) {
    return {
      uri: process.env.TIDB_DATABASE_URL,
      ssl,
    };
  }

  return {
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    port: Number(process.env.TIDB_PORT || 4000),
    ssl,
  };
}

function sanitizeError(error) {
  return String(error?.message || error)
    .replace(/(password=)[^&\s]+/gi, "$1[redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]");
}

const result = {
  configured: isTidbConfigured(),
  connected: false,
  version: null,
  cosineFunction: null,
  vectorColumn: null,
  vectorRoundtrip: null,
  errors: [],
};

if (!result.configured) {
  console.log(JSON.stringify({ ...result, message: "TiDB env is not configured." }, null, 2));
  process.exit(0);
}

let connection;
const tableName = `codex_vector_probe_${Date.now()}`;

try {
  connection = await mysql.createConnection(connectionConfig());
  result.connected = true;

  const [versionRows] = await connection.query("SELECT VERSION() AS version");
  result.version = versionRows?.[0]?.version || null;

  try {
    const [rows] = await connection.query("SELECT VEC_COSINE_DISTANCE('[1,0]', '[0,1]') AS distance");
    result.cosineFunction = {
      ok: true,
      distance: Number(rows?.[0]?.distance),
    };
  } catch (error) {
    result.cosineFunction = { ok: false };
    result.errors.push({ check: "VEC_COSINE_DISTANCE", message: sanitizeError(error) });
  }

  try {
    await connection.query(`CREATE TEMPORARY TABLE ${tableName} (embedding VECTOR(1536))`);
    result.vectorColumn = { ok: true };

    try {
      const vector = JSON.stringify(Array.from({ length: 1536 }, (_, index) => (index === 0 ? 1 : 0)));
      await connection.execute(`INSERT INTO ${tableName} (embedding) VALUES (?)`, [vector]);
      const [rows] = await connection.execute(
        `SELECT VEC_COSINE_DISTANCE(embedding, ?) AS distance FROM ${tableName} LIMIT 1`,
        [vector],
      );
      result.vectorRoundtrip = {
        ok: true,
        distance: Number(rows?.[0]?.distance),
      };
    } catch (error) {
      result.vectorRoundtrip = { ok: false };
      result.errors.push({ check: "VECTOR(1536) insert/search", message: sanitizeError(error) });
    }
  } catch (error) {
    result.vectorColumn = { ok: false };
    result.errors.push({ check: "CREATE TEMPORARY TABLE VECTOR(1536)", message: sanitizeError(error) });
  }

  try {
    await connection.query(`DROP TEMPORARY TABLE IF EXISTS ${tableName}`);
  } catch {
    // Temporary tables are connection-scoped and are also removed when the session closes.
  }
} catch (error) {
  result.errors.push({ check: "connect", message: sanitizeError(error) });
} finally {
  if (connection) await connection.end();
}

console.log(JSON.stringify(result, null, 2));
