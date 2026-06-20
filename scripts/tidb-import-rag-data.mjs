import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import { createLocalEmbedding, LOCAL_EMBEDDING_MODEL } from "../server/local-embedding.js";

const root = process.cwd();
const defaultInputPath = path.join(root, "docs", "rag", "knowledge.jsonl");
const schemaPath = path.join(root, "docs", "rag", "tidb-schema.sql");
const fulltextIndexPath = path.join(root, "docs", "rag", "tidb-fulltext-index.sql");
const defaultEmbeddingModel = "text-embedding-3-small";
const defaultEmbeddingDimensions = 1536;

function parseArgs(argv) {
  const args = {
    input: defaultInputPath,
    envFiles: [],
    database: null,
    createDatabase: false,
    schemaOnly: false,
    dryRun: false,
    applyFulltextIndex: false,
    skipSchema: false,
    skipEmbeddings: false,
    localEmbeddings: false,
    deactivateMissing: false,
    limit: null,
    batchSize: 32,
  };

  for (const arg of argv) {
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--apply-fulltext-index") args.applyFulltextIndex = true;
    else if (arg === "--skip-schema") args.skipSchema = true;
    else if (arg === "--skip-embeddings") args.skipEmbeddings = true;
    else if (arg === "--local-embeddings") args.localEmbeddings = true;
    else if (arg === "--deactivate-missing") args.deactivateMissing = true;
    else if (arg === "--create-database") args.createDatabase = true;
    else if (arg === "--schema-only") args.schemaOnly = true;
    else if (arg.startsWith("--env-file=")) args.envFiles.push(path.resolve(root, arg.slice("--env-file=".length)));
    else if (arg.startsWith("--database=")) args.database = arg.slice("--database=".length).trim();
    else if (arg.startsWith("--input=")) args.input = path.resolve(root, arg.slice("--input=".length));
    else if (arg.startsWith("--limit=")) args.limit = Number(arg.slice("--limit=".length));
    else if (arg.startsWith("--batch-size=")) args.batchSize = Number(arg.slice("--batch-size=".length));
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isInteger(args.batchSize) || args.batchSize < 1 || args.batchSize > 128) {
    throw new Error("--batch-size must be an integer between 1 and 128.");
  }
  if (args.limit != null && (!Number.isInteger(args.limit) || args.limit < 1)) {
    throw new Error("--limit must be a positive integer.");
  }

  return args;
}

async function loadEnvFile(filePath) {
  let raw;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, value] = match;
    if (process.env[key] != null) continue;
    process.env[key] = value.replace(/^["']|["']$/g, "");
  }
}

async function loadLocalEnv() {
  await loadEnvFile(path.join(root, ".env"));
  await loadEnvFile(path.join(root, ".env.local"));
}

async function readJsonl(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const records = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(`Invalid JSONL at line ${index + 1}: ${error instanceof Error ? error.message : "unknown error"}`);
      }
    });

  return records.map((record) => normalizeRecord(record));
}

function normalizeRecord(record) {
  const title = String(record.title || record.id || "").trim();
  const content = String(record.content || "").trim();
  const chunkId = String(record.chunk_id || record.id || "").trim();
  if (!title || !content || !chunkId) {
    throw new Error(`RAG record is missing title, content, or chunk_id: ${JSON.stringify(record).slice(0, 200)}`);
  }

  const metadata = record.metadata && typeof record.metadata === "object" ? record.metadata : {};
  const hashSource = [
    record.id || "",
    chunkId,
    title,
    content,
    record.url || "",
    record.kind || "",
    record.source_path || "",
    JSON.stringify(metadata),
  ].join("\n");

  return {
    recordId: String(record.id || chunkId),
    chunkId,
    title,
    content,
    url: record.url ? String(record.url) : null,
    kind: record.kind ? String(record.kind) : null,
    sourcePath: record.source_path ? String(record.source_path) : null,
    chunkIndex: Number.isInteger(record.chunk_index) ? record.chunk_index : 0,
    metadata,
    contentHash: crypto.createHash("sha256").update(hashSource).digest("hex"),
  };
}

function summarize(records) {
  const kinds = records.reduce((acc, record) => {
    const kind = record.kind || "unknown";
    acc[kind] = (acc[kind] || 0) + 1;
    return acc;
  }, {});
  return {
    chunks: records.length,
    contentChars: records.reduce((sum, record) => sum + record.content.length, 0),
    maxContentChars: Math.max(...records.map((record) => record.content.length)),
    kinds,
    sample: records.slice(0, 5).map((record) => ({
      chunkId: record.chunkId,
      title: record.title,
      kind: record.kind,
      contentChars: record.content.length,
    })),
  };
}

function sslConfig() {
  if (process.env.TIDB_SSL === "false" || process.env.TIDB_SSL_DISABLED === "1") return undefined;
  return {
    minVersion: "TLSv1.2",
    rejectUnauthorized: process.env.TIDB_SSL_REJECT_UNAUTHORIZED !== "false",
  };
}

function connectionConfig({ includeDatabase = true } = {}) {
  const ssl = sslConfig();
  if (process.env.TIDB_DATABASE_URL) {
    return {
      uri: process.env.TIDB_DATABASE_URL,
      waitForConnections: true,
      connectionLimit: Number(process.env.TIDB_CONNECTION_LIMIT || 4),
      ssl,
    };
  }

  const host = process.env.TIDB_HOST;
  const user = process.env.TIDB_USER;
  const password = process.env.TIDB_PASSWORD;
  const database = process.env.TIDB_DATABASE;
  if (!host || !user || !password || !database) {
    throw new Error(
      "TiDB connection is not configured. Set TIDB_DATABASE_URL or TIDB_HOST/TIDB_USER/TIDB_PASSWORD/TIDB_DATABASE.",
    );
  }

  return {
    host,
    user,
    password,
    ...(includeDatabase ? { database } : {}),
    port: Number(process.env.TIDB_PORT || 4000),
    waitForConnections: true,
    connectionLimit: Number(process.env.TIDB_CONNECTION_LIMIT || 4),
    ssl,
  };
}

async function createDatabaseIfNeeded() {
  const database = process.env.TIDB_DATABASE;
  if (!database) throw new Error("TIDB_DATABASE is required when using --create-database.");

  const pool = mysql.createPool(connectionConfig({ includeDatabase: false }));
  try {
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${database.replaceAll("`", "``")}\``);
  } finally {
    await pool.end();
  }
}

async function applySchema(pool) {
  await applySqlFile(pool, schemaPath);
}

async function applySqlFile(pool, filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  const statements = raw
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);

  for (const statement of statements) {
    await pool.query(statement);
  }
}

function embeddingInput(record) {
  return [record.title, record.kind, record.url, record.content].filter(Boolean).join("\n");
}

function shouldUseLocalEmbeddings(args) {
  return args.localEmbeddings || process.env.RAG_EMBEDDING_PROVIDER === "local" || process.env.RAG_LOCAL_EMBEDDINGS === "1";
}

async function createEmbeddings(records, batchSize, args) {
  const dimensions = Number(process.env.RAG_EMBEDDING_DIMENSIONS || defaultEmbeddingDimensions);
  if (shouldUseLocalEmbeddings(args)) {
    return new Map(
      records.map((record) => [
        record.chunkId,
        {
          vector: JSON.stringify(createLocalEmbedding(embeddingInput(record), { dimensions })),
          model: LOCAL_EMBEDDING_MODEL,
          dimensions,
        },
      ]),
    );
  }

  if (!process.env.OPENAI_API_KEY) return new Map();

  const model = process.env.OPENAI_EMBEDDING_MODEL || defaultEmbeddingModel;
  const embeddings = new Map();

  for (let start = 0; start < records.length; start += batchSize) {
    const batch = records.slice(start, start + batchSize);
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        input: batch.map((record) => embeddingInput(record)),
        dimensions,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || "OpenAI embeddings request failed.");
    }

    for (const item of data.data || []) {
      const record = batch[item.index];
      if (record) {
        embeddings.set(record.chunkId, {
          vector: JSON.stringify(item.embedding),
          model,
          dimensions: item.embedding.length,
        });
      }
    }
  }

  return embeddings;
}

async function upsertRecords(pool, records, embeddings) {
  const withEmbeddingSql = `
    INSERT INTO knowledge_chunks (
      record_id, chunk_id, title, content, url, kind, source_path, chunk_index,
      metadata, content_hash, embedding, embedding_model, embedding_dimensions, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON DUPLICATE KEY UPDATE
      record_id = VALUES(record_id),
      title = VALUES(title),
      content = VALUES(content),
      url = VALUES(url),
      kind = VALUES(kind),
      source_path = VALUES(source_path),
      chunk_index = VALUES(chunk_index),
      metadata = VALUES(metadata),
      content_hash = VALUES(content_hash),
      embedding = VALUES(embedding),
      embedding_model = VALUES(embedding_model),
      embedding_dimensions = VALUES(embedding_dimensions),
      is_active = 1
  `;

  const withoutEmbeddingSql = `
    INSERT INTO knowledge_chunks (
      record_id, chunk_id, title, content, url, kind, source_path, chunk_index,
      metadata, content_hash, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON DUPLICATE KEY UPDATE
      record_id = VALUES(record_id),
      title = VALUES(title),
      content = VALUES(content),
      url = VALUES(url),
      kind = VALUES(kind),
      source_path = VALUES(source_path),
      chunk_index = VALUES(chunk_index),
      metadata = VALUES(metadata),
      content_hash = VALUES(content_hash),
      is_active = 1
  `;

  let embedded = 0;
  for (const record of records) {
    const embedding = embeddings.get(record.chunkId);
    if (embedding) {
      embedded += 1;
      await pool.execute(withEmbeddingSql, [
        record.recordId,
        record.chunkId,
        record.title,
        record.content,
        record.url,
        record.kind,
        record.sourcePath,
        record.chunkIndex,
        JSON.stringify(record.metadata),
        record.contentHash,
        embedding.vector,
        embedding.model,
        embedding.dimensions,
      ]);
    } else {
      await pool.execute(withoutEmbeddingSql, [
        record.recordId,
        record.chunkId,
        record.title,
        record.content,
        record.url,
        record.kind,
        record.sourcePath,
        record.chunkIndex,
        JSON.stringify(record.metadata),
        record.contentHash,
      ]);
    }
  }

  return { embedded };
}

async function deactivateMissingRecords(pool, records) {
  const chunkIds = records.map((record) => record.chunkId);
  if (!chunkIds.length) return 0;

  const placeholders = chunkIds.map(() => "?").join(", ");
  const [result] = await pool.execute(
    `UPDATE knowledge_chunks SET is_active = 0 WHERE chunk_id NOT IN (${placeholders}) AND is_active = 1`,
    chunkIds,
  );
  return result.affectedRows || 0;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  for (const envFile of args.envFiles) {
    await loadEnvFile(envFile);
  }
  await loadLocalEnv();
  if (args.database) process.env.TIDB_DATABASE = args.database;

  let records = [];
  if (!args.schemaOnly) {
    records = await readJsonl(args.input);
    if (args.limit != null) records = records.slice(0, args.limit);
  }

  const summary = args.schemaOnly ? null : summarize(records);
  console.log(
    JSON.stringify(
      {
        mode: args.dryRun ? "dry-run" : args.schemaOnly ? "schema-only" : "import",
        database: args.database || process.env.TIDB_DATABASE || null,
        input: args.schemaOnly ? null : args.input,
        applyFulltextIndex: args.applyFulltextIndex,
        summary,
      },
      null,
      2,
    ),
  );

  if (args.dryRun) return;

  if (args.createDatabase) {
    await createDatabaseIfNeeded();
    console.log(`Ensured TiDB database exists: ${process.env.TIDB_DATABASE}`);
  }

  const pool = mysql.createPool(connectionConfig());
  try {
    if (!args.skipSchema) {
      await applySchema(pool);
      console.log("Applied TiDB RAG schema.");
    }

    if (args.applyFulltextIndex) {
      await applySqlFile(pool, fulltextIndexPath);
      console.log("Applied TiDB FULLTEXT index.");
    }

    if (args.schemaOnly) {
      console.log("Schema-only mode complete. No RAG rows were imported.");
      return;
    }

    const embeddings = args.skipEmbeddings ? new Map() : await createEmbeddings(records, args.batchSize, args);
    if (!args.skipEmbeddings && embeddings.size === 0) {
      console.log("OPENAI_API_KEY is not set. Imported rows without embeddings.");
    }

    const result = await upsertRecords(pool, records, embeddings);
    const deactivated = args.deactivateMissing ? await deactivateMissingRecords(pool, records) : 0;

    console.log(
      JSON.stringify(
        {
          imported: records.length,
          embedded: result.embedded,
          deactivated,
          embeddings: args.skipEmbeddings
            ? "skipped"
            : shouldUseLocalEmbeddings(args)
              ? LOCAL_EMBEDDING_MODEL
              : result.embedded
                ? "generated"
                : "not configured",
        },
        null,
        2,
      ),
    );
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
