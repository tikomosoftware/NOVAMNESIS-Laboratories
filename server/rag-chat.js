import fs from "node:fs/promises";
import path from "node:path";

const DEFAULT_MODEL = "gpt-4o-mini";
const MAX_MESSAGE_LENGTH = 1000;
const TOP_K = 5;

let cachedKnowledge = null;

const errorMessages = {
  VALIDATION_ERROR: "入力内容が正しくありません。",
  VECTOR_DB_ERROR: "RAGデータの読み込みに失敗しました。",
  LLM_ERROR: "回答の生成中にエラーが発生しました。",
  NO_RELEVANT_DATA: "申し訳ありません。ご質問に関連する情報がRAGデータ内に見つかりませんでした。",
};

function tokenize(text) {
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

  return knowledge
    .map((record) => {
      const titleText = String(record.title || "").toLowerCase();
      const score = queryTokens.reduce((sum, token) => {
        if (titleText.includes(token)) return sum + Math.min(token.length, 8) * 4;
        if (record.searchText.includes(token)) return sum + Math.min(token.length, 8);
        return sum;
      }, 0);
      const kindPenalty = record.kind === "page-source-text" ? 0.72 : 1;
      return { record, score: score * kindPenalty };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function expandQueryTokens(tokens, query) {
  const expanded = [...tokens];
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

function fallbackAnswer(query, results) {
  if (!results.length) return errorMessages.NO_RELEVANT_DATA;

  const bullets = results.slice(0, 3).map(({ record }) => {
    const snippet = String(record.content || "").replace(/\s+/g, " ").slice(0, 220);
    return `・${record.title}\n${snippet}`;
  });

  return [
    "RAGデータ内で関連しそうな情報を見つけました。AI APIキーが未設定のため、検索結果ベースで回答します。",
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

export async function createChatResponse(body) {
  if (!body || typeof body !== "object") {
    return {
      status: 400,
      body: { response: "", error: errorMessages.VALIDATION_ERROR, errorCode: "VALIDATION_ERROR" },
    };
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return {
      status: 400,
      body: { response: "", error: errorMessages.VALIDATION_ERROR, errorCode: "VALIDATION_ERROR" },
    };
  }

  let knowledge;
  try {
    knowledge = await loadKnowledge();
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

  const results = searchKnowledge(message, knowledge);
  if (!results.length) {
    return {
      status: 200,
      body: {
        response: errorMessages.NO_RELEVANT_DATA,
        sources: [],
        errorCode: "NO_RELEVANT_DATA",
        reasoning: [
          { type: "thought", content: "質問に合うRAGデータを検索します。" },
          { type: "action", content: `SEARCH: ${message}` },
          { type: "observation", content: "関連するチャンクは見つかりませんでした。" },
        ],
      },
    };
  }

  const context = buildContext(results);
  let answer;
  try {
    answer = await generateWithOpenAI(message, context);
  } catch (error) {
    answer = null;
  }

  return {
    status: 200,
    body: {
      response: answer || fallbackAnswer(message, results),
      sources: buildSources(results),
      reasoning: [
        { type: "thought", content: "質問意図に近いサイト内RAGチャンクを探します。" },
        { type: "action", content: `SEARCH: ${message}` },
        { type: "observation", content: `${results.length}件の関連チャンクを取得しました。` },
        {
          type: "thought",
          content: answer ? "取得した根拠をもとにLLMで回答を生成しました。" : "LLM未設定または失敗のため検索結果から回答を構成しました。",
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
