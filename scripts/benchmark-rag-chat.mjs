import fs from "node:fs/promises";
import path from "node:path";
import { createChatResponse } from "../server/rag-chat.js";
import { closeTidbPool } from "../server/tidb-rag.js";

const root = process.cwd();
const outputDir = path.join(root, "docs", "rag", "benchmarks");

const modes = [
  {
    id: "current-jsonl",
    label: "Current JSONL",
    body: { retrievalMode: "current" },
  },
  {
    id: "tidb-keyword",
    label: "TiDB Keyword",
    body: { retrievalMode: "tidb", tidbSearchMode: "keyword" },
  },
  {
    id: "tidb-vector-local",
    label: "TiDB Vector Local",
    body: { retrievalMode: "tidb", tidbSearchMode: "vector", embeddingProvider: "local" },
  },
  {
    id: "tidb-hybrid-local",
    label: "TiDB Hybrid Local",
    body: { retrievalMode: "tidb", tidbSearchMode: "hybrid", embeddingProvider: "local" },
  },
  {
    id: "tidb-fulltext-fallback",
    label: "TiDB Fulltext",
    body: { retrievalMode: "tidb", tidbSearchMode: "fulltext" },
  },
];

const questions = [
  {
    id: "booking-flow",
    text: "予約の流れを短く教えてください",
    expectedSources: ["BookingPage", "bookingSteps", "/booking"],
  },
  {
    id: "safety-side-effects",
    text: "体験後の副作用や安全性について教えてください",
    expectedSources: ["SafetyPage", "safetyItems", "副作用", "/safety"],
  },
  {
    id: "beginner-menu",
    text: "初心者におすすめの体験メニューはありますか",
    expectedSources: ["ExperienceStartPage", "BookingPage", "/experience", "/booking"],
  },
  {
    id: "memory-sale",
    text: "記憶を売却する場合の流れと査定について教えてください",
    expectedSources: ["SellPage", "sellSteps", "valuation", "査定", "/sell"],
  },
  {
    id: "out-of-scope",
    text: "駐車場とキャンセル料について教えてください",
    expectedNoData: true,
  },
];

function parseArgs(argv) {
  const args = {
    provider: "groq",
    rounds: 1,
    delayMs: 1200,
    modeIds: null,
    questionIds: null,
  };

  for (const arg of argv) {
    if (arg.startsWith("--provider=")) args.provider = arg.slice("--provider=".length);
    else if (arg.startsWith("--rounds=")) args.rounds = Number(arg.slice("--rounds=".length));
    else if (arg.startsWith("--delay-ms=")) args.delayMs = Number(arg.slice("--delay-ms=".length));
    else if (arg.startsWith("--modes=")) args.modeIds = arg.slice("--modes=".length).split(",").map((item) => item.trim()).filter(Boolean);
    else if (arg.startsWith("--questions=")) args.questionIds = arg.slice("--questions=".length).split(",").map((item) => item.trim()).filter(Boolean);
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!["groq", "openai"].includes(args.provider)) {
    throw new Error("--provider must be groq or openai.");
  }
  if (!Number.isInteger(args.rounds) || args.rounds < 1 || args.rounds > 5) {
    throw new Error("--rounds must be an integer between 1 and 5.");
  }
  if (!Number.isInteger(args.delayMs) || args.delayMs < 0 || args.delayMs > 10000) {
    throw new Error("--delay-ms must be an integer between 0 and 10000.");
  }

  return args;
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentile(values, percentileValue) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.ceil((percentileValue / 100) * sorted.length) - 1);
  return sorted[index];
}

function includesAny(source, expectedSources) {
  const haystack = String(source || "").toLowerCase();
  return expectedSources.some((needle) => haystack.includes(String(needle).toLowerCase()));
}

function evaluateResult(question, body) {
  const sources = Array.isArray(body.sources) ? body.sources : [];
  const response = String(body.response || body.message || body.error || "");

  if (question.expectedNoData) {
    const noSource = sources.length === 0;
    const noDataSignal = body.errorCode === "NO_RELEVANT_DATA" || /確認できない|見つかりません|含まれていません/.test(response);
    return {
      sourceHit: noSource || noDataSignal,
      topSourceHit: noSource,
      expected: "no-data",
    };
  }

  const expectedSources = question.expectedSources || [];
  return {
    sourceHit: sources.some((source) => includesAny(source, expectedSources)),
    topSourceHit: includesAny(sources[0], expectedSources),
    expected: expectedSources.join(" / "),
  };
}

function markdownEscape(value) {
  return String(value ?? "")
    .replace(/\r?\n/g, "<br>")
    .replace(/\|/g, "\\|");
}

function responsePreview(value) {
  return String(value || "").replace(/\s+/g, " ").slice(0, 140);
}

function reasoningAction(body) {
  const reasoning = Array.isArray(body.reasoning) ? body.reasoning : [];
  return reasoning.find((item) => item?.type === "action")?.content || "";
}

function fallbackNote(body) {
  const reasoning = Array.isArray(body.reasoning) ? body.reasoning : [];
  return reasoning.find((item) => String(item?.content || "").includes("フォールバック"))?.content || "";
}

function sanitizeError(value) {
  return String(value || "")
    .replace(/organization `org_[^`]+`/g, "organization `[redacted]`")
    .replace(/https:\/\/console\.groq\.com\/settings\/billing/g, "[billing-url-redacted]");
}

function llmGenerated(body, provider) {
  const reasoning = Array.isArray(body.reasoning) ? body.reasoning : [];
  return reasoning.some((item) => String(item?.content || "").includes(`${provider}で取得した根拠をもとに回答を生成しました。`));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runOne({ question, mode, provider, round }) {
  const startedAt = Date.now();
  let result;
  try {
    result = await createChatResponse({
      message: question.text,
      provider,
      ...mode.body,
    });
  } catch (error) {
    const elapsedMs = Date.now() - startedAt;
    return {
      questionId: question.id,
      question: question.text,
      modeId: mode.id,
      mode: mode.label,
      round,
      status: 0,
      elapsedMs,
      retrievalMode: "exception",
      requestedTidbSearchMode: mode.body.tidbSearchMode || null,
      requestedEmbeddingProvider: mode.body.embeddingProvider || null,
      sourceCount: 0,
      topSource: "",
      sourceHit: false,
      topSourceHit: false,
      llmGenerated: false,
      generationError: sanitizeError(error instanceof Error ? error.message : String(error)),
      errorCode: "EXCEPTION",
      error: error instanceof Error ? error.message : String(error),
      responsePreview: "",
      action: "",
      fallback: "",
    };
  }

  const elapsedMs = Date.now() - startedAt;
  const body = result.body || {};
  const sources = Array.isArray(body.sources) ? body.sources : [];
  const evaluation = evaluateResult(question, body);

  return {
    questionId: question.id,
    question: question.text,
    modeId: mode.id,
    mode: mode.label,
    round,
    status: result.status,
    elapsedMs,
    retrievalMode: body.retrievalMode || "",
    requestedTidbSearchMode: body.requestedTidbSearchMode || mode.body.tidbSearchMode || null,
    requestedEmbeddingProvider: body.requestedEmbeddingProvider || mode.body.embeddingProvider || null,
    sourceCount: sources.length,
    topSource: sources[0] || "",
    sourceHit: evaluation.sourceHit,
    topSourceHit: evaluation.topSourceHit,
    llmGenerated: llmGenerated(body, provider),
    generationError: body.generation?.error ? sanitizeError(body.generation.error) : null,
    expected: evaluation.expected,
    errorCode: body.errorCode || null,
    error: body.error || null,
    responsePreview: responsePreview(body.response || body.message || body.error || ""),
    action: reasoningAction(body),
    fallback: fallbackNote(body),
  };
}

function summarize(results) {
  return modes
    .filter((mode) => results.some((result) => result.modeId === mode.id))
    .map((mode) => {
      const modeResults = results.filter((result) => result.modeId === mode.id);
      const latencies = modeResults.map((result) => result.elapsedMs);
      return {
        modeId: mode.id,
        mode: mode.label,
        runs: modeResults.length,
        avgMs: Math.round(mean(latencies)),
        p50Ms: Math.round(percentile(latencies, 50)),
        p95Ms: Math.round(percentile(latencies, 95)),
        sourceHitRate: modeResults.filter((result) => result.sourceHit).length / modeResults.length,
        topSourceHitRate: modeResults.filter((result) => result.topSourceHit).length / modeResults.length,
        llmGeneratedRate: modeResults.filter((result) => result.llmGenerated).length / modeResults.length,
        fallbackCount: modeResults.filter((result) => result.fallback).length,
      };
    });
}

function buildMarkdown({ args, selectedModes, selectedQuestions, results, summary, startedAt, finishedAt }) {
  const lines = [
    `# RAG Benchmark: TiDB + Groq Chat Lab`,
    "",
    `- Started: ${startedAt.toISOString()}`,
    `- Finished: ${finishedAt.toISOString()}`,
    `- Provider: ${args.provider}`,
    `- Rounds: ${args.rounds}`,
    `- Delay: ${args.delayMs} ms`,
    `- Questions: ${selectedQuestions.length}`,
    `- Modes: ${selectedModes.map((mode) => mode.id).join(", ")}`,
    "",
    "## Summary",
    "",
    "| Mode | Runs | Avg ms | P50 ms | P95 ms | Source hit | Top source hit | LLM generated | Fallbacks |",
    "|---|---:|---:|---:|---:|---:|---:|---:|---:|",
    ...summary.map((item) =>
      [
        item.mode,
        item.runs,
        item.avgMs,
        item.p50Ms,
        item.p95Ms,
        `${Math.round(item.sourceHitRate * 100)}%`,
        `${Math.round(item.topSourceHitRate * 100)}%`,
        `${Math.round(item.llmGeneratedRate * 100)}%`,
        item.fallbackCount,
      ].join(" | "),
    ).map((row) => `| ${row} |`),
    "",
    "## Results",
    "",
    "| Question | Mode | ms | Retrieval | Sources | Source hit | LLM | Top source | Response preview |",
    "|---|---|---:|---|---:|---|---|---|---|",
    ...results.map((result) =>
      `| ${markdownEscape(result.questionId)} | ${markdownEscape(result.mode)} | ${result.elapsedMs} | ${markdownEscape(result.retrievalMode)} | ${result.sourceCount} | ${
        result.sourceHit ? "yes" : "no"
      } | ${result.llmGenerated ? "yes" : "no"} | ${markdownEscape(result.topSource)} | ${markdownEscape(result.responsePreview)} |`,
    ),
    "",
    "## Fallback Notes",
    "",
  ];

  const fallbackRows = results.filter((result) => result.fallback);
  if (fallbackRows.length) {
    lines.push("| Question | Mode | Note |", "|---|---|---|");
    for (const result of fallbackRows) {
      lines.push(`| ${markdownEscape(result.questionId)} | ${markdownEscape(result.mode)} | ${markdownEscape(result.fallback)} |`);
    }
  } else {
    lines.push("- No fallbacks observed.");
  }

  const generationRows = results.filter((result) => result.generationError);
  lines.push("", "## Generation Notes", "");
  if (generationRows.length) {
    lines.push("| Question | Mode | Error |", "|---|---|---|");
    for (const result of generationRows) {
      lines.push(`| ${markdownEscape(result.questionId)} | ${markdownEscape(result.mode)} | ${markdownEscape(result.generationError)} |`);
    }
  } else {
    lines.push("- No LLM generation errors observed.");
  }

  lines.push("", "## Question Set", "");
  for (const question of selectedQuestions) {
    lines.push(`- ${question.id}: ${question.text}`);
  }

  lines.push("", "## Raw Mode Config", "", "```json", JSON.stringify(selectedModes, null, 2), "```", "");
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const selectedModes = args.modeIds ? modes.filter((mode) => args.modeIds.includes(mode.id)) : modes;
  const selectedQuestions = args.questionIds
    ? questions.filter((question) => args.questionIds.includes(question.id))
    : questions;

  if (!selectedModes.length) throw new Error("No benchmark modes selected.");
  if (!selectedQuestions.length) throw new Error("No benchmark questions selected.");

  const startedAt = new Date();
  const results = [];
  const totalRuns = selectedModes.length * selectedQuestions.length * args.rounds;
  let completedRuns = 0;

  for (let round = 1; round <= args.rounds; round += 1) {
    for (const question of selectedQuestions) {
      for (const mode of selectedModes) {
        completedRuns += 1;
        process.stdout.write(`[${completedRuns}/${totalRuns}] ${question.id} / ${mode.id} ... `);
        const result = await runOne({ question, mode, provider: args.provider, round });
        results.push(result);
        process.stdout.write(
          `${result.elapsedMs}ms ${result.retrievalMode} sources=${result.sourceCount} llm=${result.llmGenerated ? "yes" : "no"}\n`,
        );
        if (args.delayMs && completedRuns < totalRuns) {
          await sleep(args.delayMs);
        }
      }
    }
  }

  const finishedAt = new Date();
  const summary = summarize(results);
  await fs.mkdir(outputDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const jsonPath = path.join(outputDir, `rag-benchmark-${stamp}.json`);
  const mdPath = path.join(outputDir, `rag-benchmark-${stamp}.md`);
  const payload = { args, startedAt: startedAt.toISOString(), finishedAt: finishedAt.toISOString(), summary, results };

  await fs.writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(
    mdPath,
    buildMarkdown({ args, selectedModes, selectedQuestions, results, summary, startedAt, finishedAt }),
    "utf8",
  );

  console.log(`\nWrote ${path.relative(root, mdPath)}`);
  console.log(`Wrote ${path.relative(root, jsonPath)}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeTidbPool();
  });
