import mysql from "mysql2/promise";
import { createLocalEmbedding, LOCAL_EMBEDDING_MODEL } from "./local-embedding.js";

const DEFAULT_TOP_K = 5;
const DEFAULT_EMBEDDING_MODEL = "text-embedding-3-small";
const DEFAULT_EMBEDDING_DIMENSIONS = 1536;
const TIDB_SEARCH_MODES = new Set(["auto", "keyword", "fulltext", "vector", "hybrid"]);

let pool = null;

export function isTidbConfigured() {
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
      waitForConnections: true,
      connectionLimit: Number(process.env.TIDB_CONNECTION_LIMIT || 4),
      ssl,
    };
  }

  return {
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    port: Number(process.env.TIDB_PORT || 4000),
    waitForConnections: true,
    connectionLimit: Number(process.env.TIDB_CONNECTION_LIMIT || 4),
    ssl,
  };
}

function getPool() {
  if (!isTidbConfigured()) return null;
  if (!pool) pool = mysql.createPool(connectionConfig());
  return pool;
}

export async function closeTidbPool() {
  if (!pool) return;
  const currentPool = pool;
  pool = null;
  await currentPool.end();
}

function safeLimit(value) {
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) return DEFAULT_TOP_K;
  return limit;
}

function tokenizeForSql(query) {
  const knownTokens = extractKnownQueryTokens(query);
  if (knownTokens.length) return knownTokens;

  const normalized = String(query)
    .toLowerCase()
    .replace(/について|教えて|ください|お願いします|とは|ですか|ますか|したい|知りたい/g, " ")
    .replace(/[^\p{L}\p{N}ー]+/gu, " ")
    .trim();

  const tokens = normalized
    .split(/\s+/)
    .flatMap((term) => {
      if (!term || term.length < 2) return [];
      if (term.length <= 4) return [term];
      const chars = [...term];
      const grams = [];
      for (let i = 0; i <= chars.length - 2; i += 1) {
        grams.push(chars.slice(i, i + 2).join(""));
      }
      return [term, ...grams];
    })
    .filter((term) => term.length >= 2 && !stopTokens.has(term));

  if (/安全|リスク|危険|副作用|倫理/.test(query)) tokens.push("安全", "リスク", "倫理", "副作用", "プロトコル");
  if (/予約|来館|日時|申し込/.test(query)) tokens.push("予約", "来館", "日時", "booking");
  if (/売却|売る|査定|ライセンス/.test(query)) tokens.push("売却", "査定", "ライセンス", "sell");
  if (/体験|メニュー|プラン|カタログ/.test(query)) tokens.push("体験", "メニュー", "プラン", "catalog");
  if (/faq|質問|よくある/.test(query.toLowerCase())) tokens.push("faq", "質問", "回答");

  return [...new Set(tokens)].slice(0, 12);
}

const stopTokens = new Set([
  "につ",
  "つい",
  "いて",
  "教え",
  "えて",
  "くだ",
  "ださ",
  "さい",
  "お願",
  "願い",
  "しま",
  "ます",
  "です",
  "とは",
]);

const knownQueryTokenRules = [
  [/予約|来館|申し込|日時|スケジュール/i, ["予約", "来館", "日時", "booking"]],
  [/安全|リスク|危険|副作用|倫理/i, ["安全", "リスク", "危険", "副作用", "倫理", "プロトコル"]],
  [/売却|売る|査定|ライセンス|買い取|買取/i, ["売却", "査定", "ライセンス", "買い取り", "買取"]],
  [/法人|企業|b2b/i, ["法人", "企業"]],
  [/購入|買う|買える/i, ["購入", "買う"]],
  [/人生/i, ["人生"]],
  [/体験|メニュー|プラン|カタログ|初心者|おすすめ/i, ["体験", "メニュー", "プラン", "カタログ", "初心者", "おすすめ"]],
  [/施設|場所|アクセス|所在地/i, ["施設", "アクセス", "所在地"]],
  [/駐車|駐車場/i, ["駐車場", "駐車"]],
  [/キャンセル/i, ["キャンセル"]],
  [/料金|費用|価格|支払い|決済|キャンセル料/i, ["料金", "費用", "価格", "支払い", "決済"]],
  [/faq|質問|よくある|問い合わせ|問合せ/i, ["faq", "質問", "回答", "問い合わせ"]],
  [/研究|会社|運営|法人情報/i, ["研究", "会社", "運営"]],
  [/未成年|年齢|子ども|子供/i, ["未成年", "年齢"]],
  [/記憶/i, ["記憶"]],
];

function unique(values) {
  return [...new Set(values)];
}

function extractKnownQueryTokens(query) {
  const source = String(query || "");
  return unique(knownQueryTokenRules.flatMap(([pattern, tokens]) => (pattern.test(source) ? tokens : [])));
}

function minimumQueryMatches(tokens, query) {
  if (/と|、|,|及び|および/.test(query) && tokens.length >= 4) return 2;
  if (tokens.length >= 6) return 2;
  return 1;
}

function normalizeSearchMode(mode) {
  if (TIDB_SEARCH_MODES.has(mode)) return mode;
  const envMode = process.env.TIDB_RAG_SEARCH_MODE || "auto";
  return TIDB_SEARCH_MODES.has(envMode) ? envMode : "auto";
}

function shouldUseLocalEmbeddings(embeddingProvider) {
  return (
    embeddingProvider === "local" ||
    process.env.RAG_EMBEDDING_PROVIDER === "local" ||
    process.env.RAG_LOCAL_EMBEDDINGS === "1"
  );
}

function fullTextQuery(query) {
  const tokens = tokenizeForSql(query)
    .map((token) => token.replace(/[+\-<>()~*:"@]/g, " ").trim())
    .filter(Boolean);
  if (!tokens.length) return String(query || "").trim();
  return tokens.map((token) => `+${token}*`).join(" ");
}

async function createQueryEmbedding(query, embeddingProvider) {
  const dimensions = Number(process.env.RAG_EMBEDDING_DIMENSIONS || DEFAULT_EMBEDDING_DIMENSIONS);
  if (shouldUseLocalEmbeddings(embeddingProvider)) {
    return {
      vector: JSON.stringify(createLocalEmbedding(query, { dimensions })),
      model: LOCAL_EMBEDDING_MODEL,
    };
  }

  if (!process.env.OPENAI_API_KEY) return null;

  const model = process.env.OPENAI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL;
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      input: query,
      dimensions,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI query embedding request failed.");
  }

  return {
    vector: JSON.stringify(data?.data?.[0]?.embedding || []),
    model,
  };
}

function parseMetadata(value) {
  if (!value) return {};
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

function rowToResult(row, score) {
  return {
    record: {
      id: row.record_id,
      chunk_id: row.chunk_id,
      title: row.title,
      content: row.content,
      url: row.url,
      kind: row.kind,
      source_path: row.source_path,
      chunk_index: row.chunk_index,
      metadata: parseMetadata(row.metadata),
    },
    score,
  };
}

async function searchTidbByVector(db, query, topK, embeddingProvider) {
  const limit = safeLimit(topK);
  const embedding = await createQueryEmbedding(query, embeddingProvider);
  if (!embedding || embedding.vector === "[]") return { results: [], mode: "tidb-vector", reason: "query embedding unavailable" };

  const [rows] = await db.execute(
    `
      SELECT
        record_id, chunk_id, title, content, url, kind, source_path, chunk_index, metadata,
        VEC_COSINE_DISTANCE(embedding, ?) AS distance
      FROM knowledge_chunks
      WHERE is_active = 1 AND embedding IS NOT NULL AND embedding_model = ?
      ORDER BY distance ASC
      LIMIT ${limit}
    `,
    [embedding.vector, embedding.model],
  );

  return {
    results: rows.map((row) => rowToResult(row, row.distance == null ? 0 : 1 / (1 + Number(row.distance)))),
    mode: "tidb-vector",
    reason: `vector search (${embedding.model})`,
  };
}

async function searchTidbByKeyword(db, query, topK) {
  const limit = safeLimit(topK);
  const tokens = tokenizeForSql(query);
  if (!tokens.length) {
    const [rows] = await db.execute(
      `
        SELECT record_id, chunk_id, title, content, url, kind, source_path, chunk_index, metadata, 0 AS score
        FROM knowledge_chunks
        WHERE is_active = 1
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `,
    );
    return {
      results: rows.map((row) => rowToResult(row, Number(row.score || 0))),
      mode: "tidb-keyword",
      reason: "no query tokens",
    };
  }

  const scoreParts = tokens
    .map(
      () =>
        "(CASE WHEN LOWER(title) LIKE ? THEN 8 ELSE 0 END + CASE WHEN LOWER(content) LIKE ? THEN 2 ELSE 0 END + CASE WHEN LOWER(COALESCE(kind, '')) LIKE ? THEN 4 ELSE 0 END)",
    )
    .join(" + ");
  const matchParts = tokens
    .map(() => "(CASE WHEN LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(COALESCE(kind, '')) LIKE ? THEN 1 ELSE 0 END)")
    .join(" + ");
  const whereParts = tokens
    .map(() => "(LOWER(title) LIKE ? OR LOWER(content) LIKE ? OR LOWER(COALESCE(kind, '')) LIKE ?)")
    .join(" OR ");
  const minimumMatches = minimumQueryMatches(tokens, query);
  const scoreParams = tokens.flatMap((token) => [`%${token}%`, `%${token}%`, `%${token}%`]);
  const matchParams = tokens.flatMap((token) => [`%${token}%`, `%${token}%`, `%${token}%`]);
  const whereParams = tokens.flatMap((token) => [`%${token}%`, `%${token}%`, `%${token}%`]);

  const [rows] = await db.execute(
    `
      SELECT
        record_id, chunk_id, title, content, url, kind, source_path, chunk_index, metadata,
        (${scoreParts}) AS score,
        (${matchParts}) AS matched_terms
      FROM knowledge_chunks
      WHERE is_active = 1 AND (${whereParts})
      HAVING matched_terms >= ${minimumMatches}
      ORDER BY matched_terms DESC, score DESC, updated_at DESC
      LIMIT ${limit}
    `,
    [...scoreParams, ...matchParams, ...whereParams],
  );

  return {
    results: rows.map((row) => rowToResult(row, Number(row.score || 0))),
    mode: "tidb-keyword",
    reason: "keyword search",
  };
}

async function searchTidbByFullText(db, query, topK) {
  const limit = safeLimit(topK);
  const searchQuery = fullTextQuery(query);
  if (!searchQuery) {
    return { results: [], mode: "tidb-fulltext", reason: "empty full-text query" };
  }

  const [rows] = await db.execute(
    `
      SELECT
        record_id, chunk_id, title, content, url, kind, source_path, chunk_index, metadata,
        MATCH(title, content) AGAINST (? IN BOOLEAN MODE) AS score
      FROM knowledge_chunks
      WHERE is_active = 1 AND MATCH(title, content) AGAINST (? IN BOOLEAN MODE)
      ORDER BY score DESC, updated_at DESC
      LIMIT ${limit}
    `,
    [searchQuery, searchQuery],
  );

  return {
    results: rows.map((row) => rowToResult(row, Number(row.score || 0))),
    mode: "tidb-fulltext",
    reason: "FULLTEXT MATCH AGAINST",
  };
}

async function searchFullTextWithKeywordFallback(db, query, topK) {
  try {
    const fullTextResult = await searchTidbByFullText(db, query, topK);
    if (fullTextResult.results.length) return fullTextResult;

    const keywordResult = await searchTidbByKeyword(db, query, topK);
    return {
      ...keywordResult,
      fallback: {
        mode: fullTextResult.mode,
        reason: fullTextResult.reason || "TiDB FULLTEXT returned no matching chunks.",
      },
    };
  } catch (error) {
    const keywordResult = await searchTidbByKeyword(db, query, topK);
    return {
      ...keywordResult,
      fallback: {
        mode: "tidb-fulltext-error",
        reason: error instanceof Error ? error.message : "unknown TiDB FULLTEXT error",
      },
    };
  }
}

function combineRankedResults(searches, topK) {
  const merged = new Map();
  for (const search of searches) {
    search.results.forEach((item, index) => {
      const chunkId = item.record.chunk_id || item.record.id;
      if (!chunkId) return;
      const current = merged.get(chunkId) || {
        record: item.record,
        score: 0,
      };
      current.score += search.weight / (index + 1);
      merged.set(chunkId, current);
    });
  }

  return [...merged.values()].sort((a, b) => b.score - a.score).slice(0, safeLimit(topK));
}

async function searchTidbHybrid(db, query, topK, embeddingProvider) {
  const searchLimit = Math.min(safeLimit(topK) * 3, 50);
  const vectorWeight = shouldUseLocalEmbeddings(embeddingProvider) ? 0.32 : 0.58;
  const keywordWeight = 1 - vectorWeight;
  const searches = [];
  const fallbacks = [];

  try {
    const vectorResult = await searchTidbByVector(db, query, searchLimit, embeddingProvider);
    if (vectorResult.results.length) {
      searches.push({ results: vectorResult.results, weight: vectorWeight });
    } else {
      fallbacks.push({ mode: vectorResult.mode, reason: vectorResult.reason || "TiDB vector search returned no matching chunks." });
    }
  } catch (error) {
    fallbacks.push({
      mode: "tidb-vector-error",
      reason: error instanceof Error ? error.message : "unknown TiDB vector error",
    });
  }

  const keywordResult = await searchTidbByKeyword(db, query, searchLimit);
  if (keywordResult.results.length) {
    searches.push({ results: keywordResult.results, weight: keywordWeight });
  }

  return {
    results: combineRankedResults(searches, topK),
    mode: "tidb-hybrid",
    reason: "rank fusion of TiDB vector and keyword search",
    ...(fallbacks.length ? { fallback: fallbacks[0] } : {}),
  };
}

export async function searchTidbKnowledge(query, { topK = DEFAULT_TOP_K, searchMode, embeddingProvider } = {}) {
  const db = getPool();
  if (!db) {
    return {
      results: [],
      mode: "unconfigured",
      reason: "TiDB connection env is not configured.",
    };
  }

  const requestedMode = normalizeSearchMode(searchMode);
  if (requestedMode === "keyword") return searchTidbByKeyword(db, query, topK);
  if (requestedMode === "fulltext") return searchFullTextWithKeywordFallback(db, query, topK);
  if (requestedMode === "hybrid") return searchTidbHybrid(db, query, topK, embeddingProvider);

  if (requestedMode === "vector" || requestedMode === "auto") {
    const vectorResult = await searchTidbByVector(db, query, topK, embeddingProvider);
    if (vectorResult.results.length || requestedMode === "vector") return vectorResult;
  }

  if (requestedMode === "auto") {
    const fullTextResult = await searchFullTextWithKeywordFallback(db, query, topK);
    if (fullTextResult.results.length || fullTextResult.fallback?.mode === "tidb-fulltext-error") return fullTextResult;
  }

  return searchTidbByKeyword(db, query, topK);
}
