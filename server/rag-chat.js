import fs from "node:fs/promises";
import path from "node:path";
import { loadLocalEnv } from "./load-env.js";
import { searchTidbKnowledge } from "./tidb-rag.js";

loadLocalEnv();

const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
const MAX_MESSAGE_LENGTH = 1000;
const TOP_K = 5;
const TIDB_SEARCH_MODES = new Set(["auto", "keyword", "fulltext", "vector", "hybrid"]);
const providerNames = {
  groq: "Groq",
  openai: "OpenAI",
};

let cachedKnowledge = null;

const errorMessages = {
  VALIDATION_ERROR: "入力内容が正しくありません。",
  VECTOR_DB_ERROR: "RAGデータの読み込みに失敗しました。",
  LLM_ERROR: "回答の生成中にエラーが発生しました。",
  NO_RELEVANT_DATA: "申し訳ありません。ご質問に関連する情報がRAGデータ内に見つかりませんでした。",
};

function tokenize(text) {
  const knownTokens = extractKnownQueryTokens(text);
  if (knownTokens.length) return knownTokens;

  const normalized = String(text)
    .toLowerCase()
    .replace(/について|教えて|ください|お願いします|とは|ですか|ますか|したい|知りたい/g, " ")
    .replace(/[^\p{L}\p{N}ー]+/gu, " ")
    .trim();

  return normalized
    .split(/\s+/)
    .flatMap((term) => {
      if (term.length <= 2) return term ? [term] : [];
      const chars = [...term];
      const grams = [];
      for (let i = 0; i <= chars.length - 2; i += 1) {
        grams.push(chars.slice(i, i + 2).join(""));
      }
      return [term, ...grams];
    })
    .filter((term) => term.length >= 2 && !stopTokens.has(term));
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

function extractKnownQueryTokens(text) {
  const source = String(text || "");
  return unique(knownQueryTokenRules.flatMap(([pattern, tokens]) => (pattern.test(source) ? tokens : [])));
}

function unique(values) {
  return [...new Set(values)];
}

async function loadKnowledge() {
  if (cachedKnowledge) return cachedKnowledge;

  const filePath = path.join(process.cwd(), "docs", "rag", "knowledge.jsonl");
  const raw = await fs.readFile(filePath, "utf8");
  cachedKnowledge = raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .map((record) => {
      const text = `${record.title}\n${record.content}\n${record.kind || ""}`;
      return {
        ...record,
        searchText: text.toLowerCase(),
        tokens: unique(tokenize(text)),
      };
    });

  return cachedKnowledge;
}

function searchKnowledge(query, knowledge, topK = TOP_K) {
  const queryTokens = expandQueryTokens(unique(tokenize(query)), query);
  if (!queryTokens.length) return [];
  const minimumMatches = minimumQueryMatches(queryTokens, query);

  return knowledge
    .map((record) => {
      const titleText = String(record.title || "").toLowerCase();
      let matchedTokens = 0;
      const score = queryTokens.reduce((sum, token) => {
        if (titleText.includes(token)) {
          matchedTokens += 1;
          return sum + Math.min(token.length, 8) * 4;
        }
        if (record.searchText.includes(token)) {
          matchedTokens += 1;
          return sum + Math.min(token.length, 8);
        }
        return sum;
      }, 0);
      const kindPenalty = record.kind === "page-source-text" ? 0.72 : 1;
      return { record, score: score * kindPenalty, matchedTokens };
    })
    .filter((item) => item.score > 0 && item.matchedTokens >= minimumMatches)
    .sort((a, b) => b.matchedTokens - a.matchedTokens || b.score - a.score)
    .slice(0, topK);
}

async function searchLocalKnowledge(message) {
  const knowledge = await loadKnowledge();
  return {
    results: searchKnowledge(message, knowledge),
    mode: "local-jsonl",
    reason: "local JSONL search",
  };
}

async function searchRequestedKnowledge(message, retrievalMode, tidbSearchMode, embeddingProvider) {
  if (retrievalMode !== "tidb") return searchLocalKnowledge(message);

  try {
    const tidbSearch = await searchTidbKnowledge(message, { topK: TOP_K, searchMode: tidbSearchMode, embeddingProvider });
    if (tidbSearch.results.length) return tidbSearch;

    const localSearch = await searchLocalKnowledge(message);
    return {
      ...localSearch,
      fallback: {
        mode: tidbSearch.fallback?.mode || tidbSearch.mode,
        reason: tidbSearch.fallback?.reason || tidbSearch.reason || "TiDB returned no matching chunks.",
      },
    };
  } catch (error) {
    const localSearch = await searchLocalKnowledge(message);
    return {
      ...localSearch,
      fallback: {
        mode: "tidb-error",
        reason: error instanceof Error ? error.message : "unknown TiDB error",
      },
    };
  }
}

function expandQueryTokens(tokens, query) {
  const expanded = [...extractKnownQueryTokens(query), ...tokens];
  if (/安全|リスク|危険|副作用|倫理/.test(query)) {
    expanded.push("安全", "リスク", "倫理", "副作用", "プロトコル");
  }
  if (/予約|来館|日時|申し込/.test(query)) {
    expanded.push("予約", "来館", "日時", "booking");
  }
  if (/売却|売る|査定|ライセンス/.test(query)) {
    expanded.push("売却", "査定", "ライセンス", "sell");
  }
  if (/体験|メニュー|プラン|カタログ/.test(query)) {
    expanded.push("体験", "メニュー", "プラン", "catalog");
  }
  if (/faq|質問|よくある/.test(query.toLowerCase())) {
    expanded.push("faq", "質問", "回答");
  }
  return unique(expanded);
}

function minimumQueryMatches(tokens, query) {
  if (/と|、|,|及び|および/.test(query) && tokens.length >= 4) return 2;
  if (tokens.length >= 6) return 2;
  return 1;
}

function fallbackObservation(search) {
  if (!search.fallback) return [];
  return [
    {
      type: "observation",
      content: `TiDB検索は ${search.fallback.mode}: ${search.fallback.reason}。${search.mode} へフォールバックしました。`,
    },
  ];
}

function buildContext(results) {
  return results
    .map(({ record }, index) => {
      const content = String(record.content || "").slice(0, 1400);
      return `[${index + 1}] ${record.title}\nURL: ${record.url}\n種別: ${record.kind}\n内容:\n${content}`;
    })
    .join("\n\n---\n\n");
}

function buildSources(results) {
  return unique(
    results.map(({ record }) => {
      const title = record.title || record.id;
      return record.url ? `${title} (${record.url})` : title;
    }),
  );
}

function fallbackAnswer(query, results, generationFailure) {
  if (!results.length) return errorMessages.NO_RELEVANT_DATA;

  const bullets = results.slice(0, 3).map(({ record }) => {
    const snippet = String(record.content || "").replace(/\s+/g, " ").slice(0, 220);
    return `・${record.title}\n${snippet}`;
  });
  const lead =
    generationFailure?.errorCode === "RATE_LIMIT"
      ? "RAGデータ内で関連しそうな情報を見つけました。LLMのレート制限に達したため、検索結果ベースで回答します。"
      : generationFailure?.errorCode === "CONFIG_MISSING"
        ? "RAGデータ内で関連しそうな情報を見つけました。LLMのAPIキーが未設定のため、検索結果ベースで回答します。"
        : "RAGデータ内で関連しそうな情報を見つけました。LLMが未設定または応答できなかったため、検索結果ベースで回答します。";

  return [
    lead,
    "",
    ...bullets,
  ].join("\n");
}

async function generateWithOpenAI(query, context) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.REQUEST_TIMEOUT || 30000));

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "あなたはNovamnesis / NEURAMNESIAサイトのAIアシスタントです。与えられたRAGコンテキストだけを根拠に、日本語で簡潔かつ丁寧に回答してください。根拠がない内容は推測せず、サイト内データでは確認できないと伝えてください。",
          },
          {
            role: "user",
            content: `質問:\n${query}\n\nRAGコンテキスト:\n${context}`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || "OpenAI API error");
    }

    return data?.choices?.[0]?.message?.content?.trim() || null;
  } finally {
    clearTimeout(timeout);
  }
}

async function generateWithGroq(query, context) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.REQUEST_TIMEOUT || 30000));

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_completion_tokens: 700,
        messages: [
          {
            role: "system",
            content:
              "あなたはNovamnesis / NEURAMNESIAサイトのAIアシスタントです。与えられたRAGコンテキストだけを根拠に、日本語で簡潔かつ丁寧に回答してください。根拠がない内容は推測せず、サイト内データでは確認できないと伝えてください。",
          },
          {
            role: "user",
            content: `質問:\n${query}\n\nRAGコンテキスト:\n${context}`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error?.message || "Groq API error");
    }

    return data?.choices?.[0]?.message?.content?.trim() || null;
  } finally {
    clearTimeout(timeout);
  }
}

async function generateAnswer(query, context, provider) {
  if (provider === "groq") return generateWithGroq(query, context);
  if (provider === "openai") return generateWithOpenAI(query, context);
  return generateWithGroq(query, context);
}

function providerConfigError(provider) {
  if (provider === "openai" && !process.env.OPENAI_API_KEY) {
    return "OPENAI_API_KEY is not configured.";
  }
  if (provider === "groq" && !process.env.GROQ_API_KEY) {
    return "GROQ_API_KEY is not configured.";
  }
  return null;
}

function sanitizeProviderError(error) {
  return String(error || "")
    .replace(/organization `[^`]+`/gi, "organization `[redacted]`")
    .replace(/org_[A-Za-z0-9_-]+/g, "[redacted]")
    .replace(/https:\/\/console\.groq\.com\/settings\/billing/gi, "[billing-url-redacted]")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]");
}

function classifyGenerationFailure(provider, error) {
  if (!error) return { error: null, errorCode: null };

  const raw = String(error);
  const sanitized = sanitizeProviderError(raw);
  const providerName = providerNames[provider] || provider;

  if (/OPENAI_API_KEY|GROQ_API_KEY|not configured/i.test(raw)) {
    return {
      errorCode: "CONFIG_MISSING",
      error: `${providerName}のAPIキーが未設定のため、検索結果ベースのフォールバック回答に切り替えました。`,
    };
  }

  if (/rate limit|too many requests|tokens per minute|requests per minute|\bTPM\b|\bRPM\b|\b429\b/i.test(raw)) {
    const retryMatch = sanitized.match(/try again in ([^.]+)\./i);
    const retryNote = retryMatch ? `${retryMatch[1]}後に再実行してください。` : "少し待ってから再実行してください。";
    return {
      errorCode: "RATE_LIMIT",
      error: `${providerName}のレート制限に達しました。検索は成功しているため、検索結果ベースのフォールバック回答に切り替えました。${retryNote}`,
    };
  }

  return {
    errorCode: "GENERATION_ERROR",
    error: `${providerName}の回答生成でエラーが発生しました: ${sanitized}`,
  };
}

export async function createChatResponse(body) {
  if (!body || typeof body !== "object") {
    return {
      status: 400,
      body: { response: "", error: errorMessages.VALIDATION_ERROR, errorCode: "VALIDATION_ERROR" },
    };
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const retrievalMode = body.retrievalMode === "tidb" ? "tidb" : "current";
  const tidbSearchMode = TIDB_SEARCH_MODES.has(body.tidbSearchMode) ? body.tidbSearchMode : undefined;
  const embeddingProvider = body.embeddingProvider === "local" ? "local" : undefined;
  const provider = body.provider === "openai" ? "openai" : "groq";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return {
      status: 400,
      body: { response: "", error: errorMessages.VALIDATION_ERROR, errorCode: "VALIDATION_ERROR" },
    };
  }

  let search;
  try {
    search = await searchRequestedKnowledge(message, retrievalMode, tidbSearchMode, embeddingProvider);
  } catch (error) {
    return {
      status: 500,
      body: {
        response: "",
        error: `${errorMessages.VECTOR_DB_ERROR}: ${error instanceof Error ? error.message : "unknown error"}`,
        errorCode: "VECTOR_DB_ERROR",
      },
    };
  }

  const results = search.results;
  if (!results.length) {
    return {
      status: 200,
      body: {
        response: errorMessages.NO_RELEVANT_DATA,
        sources: [],
        errorCode: "NO_RELEVANT_DATA",
        requestedRetrievalMode: retrievalMode,
        requestedTidbSearchMode: tidbSearchMode || null,
        requestedEmbeddingProvider: embeddingProvider || null,
        retrievalMode: search.mode,
        reasoning: [
          { type: "thought", content: retrievalMode === "tidb" ? "TiDBのRAGデータを検索します。" : "質問に合うRAGデータを検索します。" },
          { type: "action", content: `SEARCH(${search.mode}): ${message}` },
          ...fallbackObservation(search),
          { type: "observation", content: "関連するチャンクは見つかりませんでした。" },
        ],
      },
    };
  }

  const context = buildContext(results);
  let answer;
  let generationError = providerConfigError(provider);
  try {
    answer = generationError ? null : await generateAnswer(message, context, provider);
  } catch (error) {
    generationError = error instanceof Error ? error.message : "unknown generation error";
    answer = null;
  }
  const generationFailure = classifyGenerationFailure(provider, generationError);

  return {
    status: 200,
    body: {
      response: answer || fallbackAnswer(message, results, generationFailure),
      sources: buildSources(results),
      requestedRetrievalMode: retrievalMode,
      requestedTidbSearchMode: tidbSearchMode || null,
      requestedEmbeddingProvider: embeddingProvider || null,
      retrievalMode: search.mode,
      provider,
      generation: {
        provider,
        generated: Boolean(answer),
        error: generationFailure.error,
        errorCode: generationFailure.errorCode,
      },
      reasoning: [
        { type: "thought", content: retrievalMode === "tidb" ? "TiDBから質問意図に近いRAGチャンクを探します。" : "質問意図に近いサイト内RAGチャンクを探します。" },
        { type: "action", content: `SEARCH(${search.mode}): ${message}` },
        ...fallbackObservation(search),
        { type: "observation", content: `${results.length}件の関連チャンクを取得しました。` },
        {
          type: "thought",
          content: answer ? `${provider}で取得した根拠をもとに回答を生成しました。` : "LLM未設定または失敗のため検索結果から回答を構成しました。",
        },
      ],
    },
  };
}

export async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}
