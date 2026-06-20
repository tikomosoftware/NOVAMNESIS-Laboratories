import React, { FormEvent, useMemo, useRef, useState } from "react";

type ProviderId = "openai" | "groq";
type RetrievalMode = "current" | "tidb";
type TidbSearchMode = "keyword" | "fulltext" | "vector" | "hybrid" | "auto";
type EmbeddingProvider = "env" | "local";

type ChatRole = "user" | "assistant" | "system";

type ChatLabMessage = {
  id: string;
  role: ChatRole;
  content: string;
  meta?: string;
};

type ChatApiResponse = {
  response?: string;
  message?: string;
  error?: string;
  errorCode?: string;
  provider?: string;
  retrievalMode?: string;
  requestedRetrievalMode?: string;
  requestedTidbSearchMode?: string;
  requestedEmbeddingProvider?: string;
  generation?: {
    provider?: string;
    generated?: boolean;
    error?: string | null;
    errorCode?: string | null;
  };
  sources?: string[];
  reasoning?: Array<{ type?: string; content?: string }>;
};

type SearchPreset = {
  id: string;
  label: string;
  shortLabel: string;
  retrievalMode: RetrievalMode;
  tidbSearchMode: TidbSearchMode;
  accent: string;
  metric: string;
};

const providerLabels: Record<ProviderId, string> = {
  openai: "OpenAI",
  groq: "Groq",
};

const searchPresets: SearchPreset[] = [
  {
    id: "current-jsonl",
    label: "Current JSONL",
    shortLabel: "JSONL",
    retrievalMode: "current",
    tidbSearchMode: "keyword",
    accent: "border-slate-400/45 bg-slate-400/10 text-slate-100",
    metric: "baseline",
  },
  {
    id: "tidb-keyword",
    label: "TiDB Keyword",
    shortLabel: "Keyword",
    retrievalMode: "tidb",
    tidbSearchMode: "keyword",
    accent: "border-cyan-300/50 bg-cyan-300/10 text-cyan-100",
    metric: "top hit 100%",
  },
  {
    id: "tidb-vector",
    label: "TiDB Vector",
    shortLabel: "Vector",
    retrievalMode: "tidb",
    tidbSearchMode: "vector",
    accent: "border-violet-300/50 bg-violet-300/10 text-violet-100",
    metric: "vector path",
  },
  {
    id: "tidb-hybrid",
    label: "TiDB Hybrid",
    shortLabel: "Hybrid",
    retrievalMode: "tidb",
    tidbSearchMode: "hybrid",
    accent: "border-emerald-300/50 bg-emerald-300/10 text-emerald-100",
    metric: "best balance",
  },
  {
    id: "tidb-fulltext",
    label: "TiDB Fulltext",
    shortLabel: "Fulltext",
    retrievalMode: "tidb",
    tidbSearchMode: "fulltext",
    accent: "border-amber-300/50 bg-amber-300/10 text-amber-100",
    metric: "fallback ready",
  },
  {
    id: "tidb-auto",
    label: "TiDB Auto",
    shortLabel: "Auto",
    retrievalMode: "tidb",
    tidbSearchMode: "auto",
    accent: "border-fuchsia-300/50 bg-fuchsia-300/10 text-fuchsia-100",
    metric: "router",
  },
];

const samplePrompts = [
  "予約の流れを短く教えてください",
  "体験後の副作用や安全性について教えてください",
  "初心者におすすめの体験メニューはありますか",
  "記憶を売却する場合の流れと査定について教えてください",
  "駐車場とキャンセル料について教えてください",
];

const initialMessages: ChatLabMessage[] = [
  {
    id: "lab-welcome",
    role: "system",
    content: "NEURAMNESIAのナレッジを使ったRAG検索ラボです。検索方式を切り替えながら回答、参照ソース、検索ログを確認できます。",
  },
];

function formatElapsed(startedAt: number) {
  const elapsed = Date.now() - startedAt;
  return elapsed < 1000 ? `${elapsed} ms` : `${(elapsed / 1000).toFixed(2)} s`;
}

function responseText(data: ChatApiResponse) {
  return String(data.response || data.message || data.error || "");
}

export default function ChatLabPage() {
  const [messages, setMessages] = useState<ChatLabMessage[]>(initialMessages);
  const [input, setInput] = useState("予約の流れを短く教えてください");
  const [endpoint, setEndpoint] = useState("/api/chat");
  const [provider, setProvider] = useState<ProviderId>("groq");
  const [retrievalMode, setRetrievalMode] = useState<RetrievalMode>("tidb");
  const [tidbSearchMode, setTidbSearchMode] = useState<TidbSearchMode>("hybrid");
  const [embeddingProvider, setEmbeddingProvider] = useState<EmbeddingProvider>("local");
  const [isLoading, setIsLoading] = useState(false);
  const [latestResponse, setLatestResponse] = useState<ChatApiResponse | null>(null);
  const [latestLatency, setLatestLatency] = useState<string>("--");
  const [latestStatus, setLatestStatus] = useState<number | null>(null);
  const [rawVisible, setRawVisible] = useState(false);
  const [advancedVisible, setAdvancedVisible] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const selectedProviderLabel = providerLabels[provider];
  const selectedPreset =
    searchPresets.find(
      (preset) => preset.retrievalMode === retrievalMode && preset.tidbSearchMode === tidbSearchMode,
    ) || searchPresets[0];
  const sources = latestResponse?.sources || [];
  const reasoning = latestResponse?.reasoning || [];
  const generation = latestResponse?.generation;
  const canSend = input.trim().length > 0 && !isLoading;
  const embeddingControlEnabled =
    retrievalMode === "tidb" && ["vector", "hybrid", "auto"].includes(tidbSearchMode);

  const statusLabel = useMemo(() => {
    if (latestStatus == null) return "未送信";
    if (latestStatus >= 200 && latestStatus < 300 && !latestResponse?.error) return "OK";
    return latestResponse?.errorCode || "ERROR";
  }, [latestResponse?.error, latestResponse?.errorCode, latestStatus]);
  const isRateLimited =
    generation?.errorCode === "RATE_LIMIT" || /rate limit|レート制限/i.test(generation?.error || "");
  const generationLabel =
    generation?.generated == null ? "--" : generation.generated ? "Generated" : isRateLimited ? "Rate limited" : "Fallback";
  const actualRetrievalLabel = latestResponse?.retrievalMode || "--";
  const providerWarning =
    provider === "openai"
      ? "このデモ環境ではOpenAI APIキーが未設定の場合、回答生成は動かず検索結果ベースのフォールバックになります。記事の検証本体はGroqで実行しています。"
      : "";
  const generationWarning =
    generation?.generated === false
      ? generation.error || `${selectedProviderLabel}で生成できなかったため、検索結果ベースで回答しています。`
      : "";
  const rawResponseKey = `${latestStatus ?? "none"}-${latestLatency}-${actualRetrievalLabel}-${sources.length}`;

  const selectPreset = (preset: SearchPreset) => {
    setRetrievalMode(preset.retrievalMode);
    setTidbSearchMode(preset.tidbSearchMode);
    if (preset.retrievalMode === "tidb" && ["vector", "hybrid", "auto"].includes(preset.tidbSearchMode)) {
      setEmbeddingProvider("local");
    }
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const startedAt = Date.now();
    const userMessage: ChatLabMessage = {
      id: `user-${startedAt}`,
      role: "user",
      content: trimmed,
      meta: `${selectedProviderLabel} / ${retrievalMode}${
        retrievalMode === "tidb" ? ` / ${tidbSearchMode}${embeddingControlEnabled ? ` / ${embeddingProvider}` : ""}` : ""
      }`,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);
    setLatestStatus(null);
    setLatestResponse(null);

    try {
      const response = await fetch(endpoint || "/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          provider,
          retrievalMode,
          tidbSearchMode,
          embeddingProvider: embeddingProvider === "local" ? "local" : undefined,
        }),
      });
      const data = (await response.json()) as ChatApiResponse;
      const elapsed = formatElapsed(startedAt);
      const text = responseText(data) || "空のレスポンスです。";

      setLatestLatency(elapsed);
      setLatestStatus(response.status);
      setLatestResponse(data);
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: text,
          meta: `${response.status} / ${elapsed}`,
        },
      ]);

      window.requestAnimationFrame(() => {
        transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
      });
    } catch (error) {
      const elapsed = formatElapsed(startedAt);
      const message = error instanceof Error ? error.message : "Unexpected error";
      setLatestLatency(elapsed);
      setLatestStatus(0);
      setLatestResponse({ error: message, errorCode: "NETWORK_ERROR" });
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: `接続に失敗しました。\n\n${message}`,
          meta: `NETWORK_ERROR / ${elapsed}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#080a0f] text-slate-100">
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-white/10 bg-[#0e1118] px-4 py-4 sm:px-5">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-200">NEURAMNESIA</p>
                <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">RAG Chat Lab</h1>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                <label className="block min-w-[220px] text-xs font-semibold text-slate-300">
                  Provider
                  <select
                    value={provider}
                    onChange={(event) => setProvider(event.target.value as ProviderId)}
                    className="mt-1 h-11 w-full rounded border border-white/12 bg-[#171b25] px-3 text-sm text-white outline-none transition focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/20"
                  >
                    <option value="openai">OpenAI (key required)</option>
                    <option value="groq">Groq</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => setAdvancedVisible((current) => !current)}
                  className="h-11 rounded border border-white/12 bg-[#171b25] px-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-300 transition hover:border-cyan-200/45 hover:text-white"
                  aria-expanded={advancedVisible}
                >
                  Advanced
                </button>
              </div>
            </div>

            {providerWarning && (
              <div className="rounded border border-amber-300/35 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100">
                {providerWarning}
              </div>
            )}

            {advancedVisible && (
              <div className="rounded border border-white/10 bg-[#121720] p-3">
                <label className="block text-xs font-semibold text-slate-300">
                  API Endpoint
                  <input
                    value={endpoint}
                    onChange={(event) => setEndpoint(event.target.value)}
                    className="mt-1 h-11 w-full rounded border border-white/12 bg-[#171b25] px-3 text-sm text-white outline-none transition focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/20"
                  />
                </label>
              </div>
            )}

            <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
              {searchPresets.map((preset) => {
                const isActive = selectedPreset.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={`min-h-[76px] rounded border px-3 py-3 text-left transition ${
                      isActive
                        ? `${preset.accent} shadow-[0_0_0_1px_rgba(255,255,255,0.08)]`
                        : "border-white/10 bg-[#151923] text-slate-300 hover:border-white/25 hover:bg-[#1b202c]"
                    }`}
                    aria-pressed={isActive}
                  >
                    <span className="block text-xs font-bold uppercase tracking-[0.18em] opacity-70">
                      {preset.shortLabel}
                    </span>
                    <span className="mt-1 block break-words text-sm font-bold leading-5">{preset.label}</span>
                    <span className="mt-1 block text-xs leading-4 opacity-70">{preset.metric}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 rounded border border-white/10 bg-[#121720] p-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="rounded border border-white/10 bg-[#0b0e14] px-2.5 py-1.5">
                  retrieval: {retrievalMode}
                </span>
                <span className="rounded border border-white/10 bg-[#0b0e14] px-2.5 py-1.5">
                  tidb: {retrievalMode === "tidb" ? tidbSearchMode : "--"}
                </span>
                <span className="rounded border border-white/10 bg-[#0b0e14] px-2.5 py-1.5">
                  embedding: {embeddingControlEnabled ? embeddingProvider : "--"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["local", "env"] as EmbeddingProvider[]).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setEmbeddingProvider(option)}
                    disabled={!embeddingControlEnabled}
                    className={`h-9 rounded border px-3 text-xs font-bold uppercase tracking-[0.14em] transition ${
                      embeddingProvider === option && embeddingControlEnabled
                        ? "border-emerald-300/55 bg-emerald-300/12 text-emerald-100"
                        : "border-white/10 bg-[#171b25] text-slate-400 hover:border-white/25"
                    } disabled:cursor-not-allowed disabled:opacity-45`}
                  >
                    {option === "local" ? "Local demo" : "Env"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_392px]">
          <section className="flex flex-col border-white/10 lg:min-h-[calc(100vh-248px)] lg:border-r">
            <div ref={transcriptRef} className="min-h-[220px] flex-1 overflow-y-auto px-4 py-5 sm:px-5 sm:py-6">
              <div className="mx-auto flex max-w-4xl flex-col gap-4">
                {messages.map((message) => (
                  <article
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[88%] rounded border px-4 py-3 ${
                        message.role === "user"
                          ? "border-cyan-200/30 bg-[#12313a] text-white"
                          : message.role === "system"
                            ? "border-[#b08cff]/25 bg-[#21172c] text-slate-100"
                            : "border-white/10 bg-[#171923] text-slate-100"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        <span>{message.role}</span>
                        {message.meta && <span className="text-slate-500">{message.meta}</span>}
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm leading-7">{message.content}</p>
                    </div>
                  </article>
                ))}
                {isLoading && (
                  <article className="flex justify-start">
                    <div className="rounded border border-white/10 bg-[#171923] px-4 py-3 text-sm text-slate-300">
                      送信中...
                    </div>
                  </article>
                )}
              </div>
            </div>

            <form onSubmit={sendMessage} className="border-t border-white/10 bg-[#0e1118] px-4 py-4 sm:px-5">
              <div className="mx-auto flex max-w-4xl flex-col gap-3">
                <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
                  {samplePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setInput(prompt)}
                      className="h-9 shrink-0 rounded border border-white/10 bg-[#171b25] px-3 text-xs font-semibold text-slate-300 transition hover:border-cyan-200/40 hover:text-white lg:shrink lg:whitespace-normal"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    rows={2}
                    className="min-h-20 flex-1 resize-none rounded border border-white/12 bg-[#171923] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/20"
                    placeholder="質問を入力"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!canSend}
                    className="h-12 rounded bg-cyan-200 px-6 text-sm font-bold text-[#06100f] transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300 sm:h-auto"
                  >
                    Send
                  </button>
                </div>
              </div>
            </form>
          </section>

          <aside className="border-t border-white/10 bg-[#0d1017] p-4 sm:p-5 lg:border-t-0">
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded border border-white/10 bg-[#171923] p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Status</p>
                <p className="mt-1 truncate text-sm font-bold text-white">{statusLabel}</p>
              </div>
              <div className="rounded border border-white/10 bg-[#171923] p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">HTTP</p>
                <p className="mt-1 text-sm font-bold text-white">{latestStatus ?? "--"}</p>
              </div>
              <div className="rounded border border-white/10 bg-[#171923] p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Latency</p>
                <p className="mt-1 text-sm font-bold text-white">{latestLatency}</p>
              </div>
            </div>

            <section className="mt-5 rounded border border-white/10 bg-[#171923] p-4">
              <h2 className="text-sm font-bold text-white">Run</h2>
              <div className="mt-3 grid gap-2 text-xs">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                  <span className="text-slate-500">Selected</span>
                  <span className="text-right font-bold text-slate-100">{selectedPreset.label}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                  <span className="text-slate-500">Actual</span>
                  <span className="text-right font-bold text-cyan-100">{actualRetrievalLabel}</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                  <span className="text-slate-500">LLM</span>
                  <span
                    className={`text-right font-bold ${
                      isRateLimited ? "text-amber-100" : generation?.generated === false ? "text-amber-100" : "text-slate-100"
                    }`}
                  >
                    {latestResponse?.provider || selectedProviderLabel} / {generationLabel}
                  </span>
                </div>
                {generationWarning && (
                  <div className="rounded border border-amber-300/25 bg-amber-300/10 px-3 py-2 leading-5 text-amber-100">
                    {generationWarning}
                  </div>
                )}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Embedding</span>
                  <span className="text-right font-bold text-slate-100">
                    {latestResponse?.requestedEmbeddingProvider || (embeddingControlEnabled ? embeddingProvider : "--")}
                  </span>
                </div>
              </div>
            </section>

            <section className="mt-5">
              <h2 className="text-sm font-bold text-white">Sources</h2>
              <div className="mt-3 space-y-2">
                {sources.length ? (
                  sources.map((source, index) => (
                    <p key={`${source}-${index}`} className="rounded border border-white/10 bg-[#171923] px-3 py-2 text-xs leading-5 text-slate-300">
                      {source}
                    </p>
                  ))
                ) : (
                  <p className="rounded border border-white/10 bg-[#171923] px-3 py-2 text-xs text-slate-500">--</p>
                )}
              </div>
            </section>

            <section className="mt-5">
              <h2 className="text-sm font-bold text-white">Reasoning</h2>
              <div className="mt-3 space-y-2">
                {reasoning.length ? (
                  reasoning.map((item, index) => (
                    <div key={`${item.type}-${index}`} className="rounded border border-white/10 bg-[#171923] px-3 py-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-200">{item.type || "log"}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">{item.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded border border-white/10 bg-[#171923] px-3 py-2 text-xs text-slate-500">--</p>
                )}
              </div>
            </section>

            <section className="mt-5">
              <button
                type="button"
                onClick={() => setRawVisible((current) => !current)}
                className="h-10 w-full rounded border border-white/12 bg-[#171923] px-3 text-sm font-bold text-slate-200 transition hover:border-cyan-200/50 hover:text-white"
              >
                Raw JSON
              </button>
              {rawVisible && (
                <pre
                  key={rawResponseKey}
                  className="mt-3 max-h-72 overflow-auto rounded border border-white/10 bg-[#090a0f] p-3 text-xs leading-5 text-slate-300"
                >
                  {JSON.stringify(latestResponse || {}, null, 2)}
                </pre>
              )}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
