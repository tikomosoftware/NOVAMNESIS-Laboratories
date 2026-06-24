import React, { FormEvent, useMemo, useRef, useState } from "react";

type ChatRole = "user" | "assistant";
type ExtractionProvider = "local" | "auto" | "groq" | "openai";

type TalentMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

type TalentFact = {
  factType: string;
  label: string;
  valueText?: string;
  numericValue?: number | null;
  evidenceText?: string;
  confidence?: number | null;
  verifiedByUser?: boolean;
};

type TalentDraft = {
  profileUid?: string;
  displayName?: string;
  headline?: string;
  narrative?: string;
  structuredFacts: TalentFact[];
  missingFields: string[];
  readinessScore: number;
  nextQuestion?: string;
  dbPreview?: {
    profileTable?: string;
    factsTable?: string;
    embeddingModel?: string;
    embeddingText?: string;
  };
  extractionMeta?: {
    mode?: string;
    provider?: string;
    fallbackUsed?: boolean;
    warning?: string | null;
  };
};

type IntakeResponse = {
  assistantMessage?: string;
  draft?: TalentDraft;
  extraction?: {
    mode?: string;
    provider?: string;
    requestedProvider?: string;
    fallbackUsed?: boolean;
    warning?: string | null;
  };
  storage?: {
    tidbConfigured?: boolean;
    defaultMode?: string;
  };
  error?: string;
  errorCode?: string;
};

type SaveResponse = {
  saved?: boolean;
  profileUid?: string;
  storageMode?: string;
  factCount?: number;
  warning?: string | null;
  draft?: TalentDraft;
  error?: string;
};

type MatchAnalysis = {
  mode?: string;
  provider?: string;
  fitScore?: number;
  reason?: string;
  highlights?: string[];
  concerns?: string[];
  warning?: string | null;
};

type SearchResult = {
  profileUid: string;
  displayName?: string;
  headline?: string;
  narrative?: string;
  score?: number;
  matchMode?: string;
  matchAnalysis?: MatchAnalysis;
  structured?: {
    structuredFacts?: TalentFact[];
    displayName?: string;
    headline?: string;
    narrative?: string;
  };
};

type SearchResponse = {
  results?: SearchResult[];
  storageMode?: string;
  match?: {
    mode?: string;
    provider?: string;
    requestedProvider?: string;
    fallbackUsed?: boolean;
    warning?: string | null;
  };
  warning?: string | null;
  error?: string;
};

type SeedTarget = "memory" | "tidb";

type SeedResponse = {
  seeded?: number;
  storageMode?: string;
  requestedStorageMode?: string;
  profiles?: Array<{
    profileUid: string;
    displayName?: string;
    headline?: string;
    factCount?: number;
    storageMode?: string;
  }>;
  note?: string;
  warning?: string | null;
  error?: string;
};

const initialMessages: TalentMessage[] = [
  {
    id: "assistant-welcome",
    role: "assistant",
    content:
      "登録フォームの代わりに、会話から人材プロフィールを作ります。まずは現在の役割、経験した案件、使える技術を自然に話してください。",
  },
];

const sampleInputs = [
  "フロントエンドエンジニアです。ReactとTypeScriptを3年くらい使っています。SaaSの管理画面刷新で設計と実装を担当しました。",
  "バックエンド寄りです。Node.js、SQL、AWSを使って決済系のAPI開発をしました。設計レビューや運用改善も得意です。",
  "PMとして人材系SaaSの開発をリードしました。顧客折衝、要件整理、チーム調整が得意で、リモート中心の案件を希望しています。",
  "組み込み系エンジニアです。CとC++を6年使っていて、車載ECUの制御ソフト開発やCAN通信、RTOS上のファームウェア改善を担当しました。",
];

const factLabels: Record<string, string> = {
  role: "Role",
  skill: "Skill",
  domain: "Domain",
  project: "Project",
  preference: "Preference",
  constraint: "Constraint",
  strength: "Strength",
};

const missingLabels: Record<string, string> = {
  role: "役割",
  skills: "スキル",
  years: "年数",
  projects: "案件経験",
  preferences: "希望条件",
  strengths: "強み",
};

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function confidenceLabel(value?: number | null) {
  if (value == null) return "--";
  return `${Math.round(value * 100)}%`;
}

function normalizeMessages(messages: TalentMessage[]) {
  return messages.map(({ role, content }) => ({ role, content }));
}

export default function TalentLabPage() {
  const [messages, setMessages] = useState<TalentMessage[]>(initialMessages);
  const [input, setInput] = useState(sampleInputs[0]);
  const [draft, setDraft] = useState<TalentDraft | null>(null);
  const [storageMode, setStorageMode] = useState("--");
  const [extractionProvider, setExtractionProvider] = useState<ExtractionProvider>("auto");
  const [extractionStatus, setExtractionStatus] = useState("local-rule");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<SaveResponse | null>(null);
  const [apiError, setApiError] = useState("");
  const [searchQuery, setSearchQuery] = useState(
    "ReactとTypeScriptでSaaS管理画面を設計でき、顧客折衝も苦手ではない人",
  );
  const [matchProvider, setMatchProvider] = useState<ExtractionProvider>("auto");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState("--");
  const [isSearching, setIsSearching] = useState(false);
  const [seedingTarget, setSeedingTarget] = useState<SeedTarget | null>(null);
  const [seedResult, setSeedResult] = useState<SeedResponse | null>(null);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  const factsByType = useMemo(() => {
    const grouped = new Map<string, TalentFact[]>();
    for (const fact of draft?.structuredFacts || []) {
      const current = grouped.get(fact.factType) || [];
      current.push(fact);
      grouped.set(fact.factType, current);
    }
    return [...grouped.entries()];
  }, [draft?.structuredFacts]);

  const selectedFactsByType = useMemo(() => {
    const grouped = new Map<string, TalentFact[]>();
    for (const fact of selectedResult?.structured?.structuredFacts || []) {
      const current = grouped.get(fact.factType) || [];
      current.push(fact);
      grouped.set(fact.factType, current);
    }
    return [...grouped.entries()];
  }, [selectedResult]);

  const canSend = input.trim().length > 0 && !isLoading;
  const canSave = Boolean(draft?.narrative && !isSaving);
  const readiness = draft?.readinessScore ?? 0;
  const isSeeding = Boolean(seedingTarget);

  const updateDraftField = (field: "displayName" | "headline" | "narrative", value: string) => {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  };

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: TalentMessage = {
      id: makeId("user"),
      role: "user",
      content: trimmed,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);
    setApiError("");
    setSaveResult(null);

    try {
      const response = await fetch("/api/talent-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "interview",
          extractionProvider,
          messages: normalizeMessages(nextMessages),
          draftOverrides: draft
            ? {
                profileUid: draft.profileUid,
                displayName: draft.displayName,
              }
            : undefined,
        }),
      });
      const data = (await response.json()) as IntakeResponse;
      if (!response.ok || data.error) throw new Error(data.error || "Talent intake request failed.");

      setDraft(data.draft || null);
      setStorageMode(data.storage?.defaultMode || "--");
      setExtractionStatus(
        data.extraction
          ? `${data.extraction.mode || "--"} / ${data.extraction.provider || "--"}${
              data.extraction.fallbackUsed ? " / fallback" : ""
            }`
          : data.draft?.extractionMeta?.mode || "--",
      );
      setMessages((current) => [
        ...current,
        {
          id: makeId("assistant"),
          role: "assistant",
          content: data.assistantMessage || "抽出しました。追加情報があれば続けてください。",
        },
      ]);
      window.requestAnimationFrame(() => {
        transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      setApiError(message);
      setMessages((current) => [
        ...current,
        {
          id: makeId("assistant-error"),
          role: "assistant",
          content: `抽出に失敗しました。\n\n${message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = async () => {
    if (!draft || isSaving) return;
    setIsSaving(true);
    setApiError("");
    setSaveResult(null);

    try {
      const response = await fetch("/api/talent-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          confirmed: true,
          draft,
        }),
      });
      const data = (await response.json()) as SaveResponse;
      if (!response.ok || data.error) throw new Error(data.error || "Talent save request failed.");
      setSaveResult(data);
      if (data.draft) setDraft(data.draft);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setIsSaving(false);
    }
  };

  const searchProfiles = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed || isSearching) return;
    setIsSearching(true);
    setSearchStatus("searching");
    setApiError("");

    try {
      const response = await fetch("/api/talent-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "search",
          query: trimmed,
          topK: 5,
          storageMode: seedResult?.storageMode === "memory" ? "memory" : undefined,
          matchProvider,
        }),
      });
      const data = (await response.json()) as SearchResponse;
      if (!response.ok || data.error) throw new Error(data.error || "Talent search request failed.");
      setSearchResults(data.results || []);
      setSelectedResult(null);
      setSearchStatus(
        `${data.storageMode || "unknown"} / match ${data.match?.provider || matchProvider}${
          data.warning || data.match?.fallbackUsed ? " / fallback" : ""
        }`,
      );
    } catch (error) {
      setSearchStatus("error");
      setApiError(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setIsSearching(false);
    }
  };

  const seedDemoProfiles = async (target: SeedTarget) => {
    if (isSeeding) return;
    setSeedingTarget(target);
    setApiError("");
    setSeedResult(null);

    try {
      const response = await fetch("/api/talent-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed", storageMode: target }),
      });
      const data = (await response.json()) as SeedResponse;
      if (!response.ok || data.error) throw new Error(data.error || "Talent seed request failed.");
      setSeedResult(data);
      setSearchStatus(`${data.storageMode || "memory"} / seeded ${data.seeded || 0}${data.warning ? " / fallback" : ""}`);
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setSeedingTarget(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#080a0f] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-5">
        <header className="flex flex-col gap-3 border-b border-white/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-200">NEURAMNESIA LAB</p>
            <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">Talent Intake Lab</h1>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-300 sm:min-w-[560px] sm:grid-cols-4">
            <label className="rounded border border-white/10 bg-[#151923] px-3 py-2">
              <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Extractor</span>
              <select
                value={extractionProvider}
                onChange={(event) => setExtractionProvider(event.target.value as ExtractionProvider)}
                className="mt-1 h-7 w-full rounded border border-white/10 bg-[#0e1118] px-2 text-xs font-bold text-white outline-none focus:border-emerald-200"
              >
                <option value="local">Local rules</option>
                <option value="auto">Auto AI</option>
                <option value="groq">Groq</option>
                <option value="openai">OpenAI</option>
              </select>
            </label>
            <div className="rounded border border-white/10 bg-[#151923] px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Storage</p>
              <p className="mt-1 font-bold text-white">{storageMode}</p>
            </div>
            <div className="rounded border border-white/10 bg-[#151923] px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Extraction</p>
              <p className="mt-1 truncate font-bold text-white">{extractionStatus}</p>
            </div>
            <div className="rounded border border-white/10 bg-[#151923] px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Ready / Facts</p>
              <p className="mt-1 font-bold text-white">
                {readiness}% / {draft?.structuredFacts.length ?? 0}
              </p>
            </div>
          </div>
        </header>

        {apiError && (
          <div className="mt-4 rounded border border-rose-300/35 bg-rose-300/10 px-3 py-2 text-sm leading-6 text-rose-100">
            {apiError}
          </div>
        )}

        <div className="grid flex-1 gap-4 py-4 lg:grid-cols-[minmax(0,1fr)_420px]">
          <section className="flex min-h-[620px] flex-col overflow-hidden rounded border border-white/10 bg-[#0e1118]">
            <div ref={transcriptRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <article key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[88%] rounded border px-4 py-3 ${
                        message.role === "user"
                          ? "border-emerald-200/30 bg-[#123526] text-white"
                          : "border-white/10 bg-[#171923] text-slate-100"
                      }`}
                    >
                      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        {message.role}
                      </div>
                      <p className="whitespace-pre-wrap break-words text-sm leading-7">{message.content}</p>
                    </div>
                  </article>
                ))}
                {isLoading && (
                  <article className="flex justify-start">
                    <div className="rounded border border-white/10 bg-[#171923] px-4 py-3 text-sm text-slate-300">
                      抽出中...
                    </div>
                  </article>
                )}
              </div>
            </div>

            <form onSubmit={sendMessage} className="border-t border-white/10 bg-[#10141d] px-4 py-4 sm:px-5">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {sampleInputs.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setInput(sample)}
                    className="h-9 shrink-0 rounded border border-white/10 bg-[#171b25] px-3 text-xs font-semibold text-slate-300 transition hover:border-emerald-200/40 hover:text-white"
                  >
                    Sample
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  rows={3}
                  className="min-h-24 flex-1 resize-none rounded border border-white/12 bg-[#171923] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-200 focus:ring-2 focus:ring-emerald-200/20"
                  placeholder="経験、スキル、案件、希望条件を自然に入力"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!canSend}
                  className="h-12 rounded bg-emerald-200 px-6 text-sm font-bold text-[#06100f] transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300 sm:h-auto"
                >
                  Send
                </button>
              </div>
            </form>
          </section>

          <aside className="flex flex-col gap-4">
            <section className="rounded border border-white/10 bg-[#0e1118] p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-white">Profile Draft</h2>
                <button
                  type="button"
                  onClick={saveDraft}
                  disabled={!canSave}
                  className="h-9 rounded bg-cyan-200 px-3 text-xs font-bold uppercase tracking-[0.12em] text-[#06100f] transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
                >
                  Save
                </button>
              </div>

              {saveResult && (
                <div className="mt-3 rounded border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-xs leading-5 text-emerald-100">
                  saved: {saveResult.profileUid} / {saveResult.storageMode} / facts {saveResult.factCount}
                  {saveResult.warning ? ` / ${saveResult.warning}` : ""}
                </div>
              )}

              {draft?.extractionMeta?.warning && (
                <div className="mt-3 rounded border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100">
                  {draft.extractionMeta.warning}
                </div>
              )}

              <div className="mt-3 grid gap-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Display name
                  <input
                    value={draft?.displayName || ""}
                    onChange={(event) => updateDraftField("displayName", event.target.value)}
                    className="mt-1 h-10 w-full rounded border border-white/12 bg-[#171923] px-3 text-sm text-white outline-none focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/20"
                    placeholder="未設定"
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-300">
                  Headline
                  <input
                    value={draft?.headline || ""}
                    onChange={(event) => updateDraftField("headline", event.target.value)}
                    className="mt-1 h-10 w-full rounded border border-white/12 bg-[#171923] px-3 text-sm text-white outline-none focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/20"
                    placeholder="会話から自動生成"
                  />
                </label>
                <label className="block text-xs font-semibold text-slate-300">
                  Narrative
                  <textarea
                    value={draft?.narrative || ""}
                    onChange={(event) => updateDraftField("narrative", event.target.value)}
                    rows={7}
                    className="mt-1 w-full resize-none rounded border border-white/12 bg-[#171923] px-3 py-3 text-sm leading-6 text-white outline-none focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/20"
                    placeholder="会話からnarrativeを生成"
                  />
                </label>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(draft?.missingFields || []).length ? (
                  draft?.missingFields.map((field) => (
                    <span
                      key={field}
                      className="rounded border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-xs font-semibold text-amber-100"
                    >
                      {missingLabels[field] || field}
                    </span>
                  ))
                ) : (
                  <span className="rounded border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-xs font-semibold text-emerald-100">
                    保存候補OK
                  </span>
                )}
              </div>
            </section>

            <section className="rounded border border-white/10 bg-[#0e1118] p-4">
              <h2 className="text-sm font-bold text-white">Structured Facts</h2>
              <div className="mt-3 max-h-80 space-y-3 overflow-auto pr-1">
                {factsByType.length ? (
                  factsByType.map(([type, facts]) => (
                    <div key={type}>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-200">
                        {factLabels[type] || type}
                      </p>
                      <div className="mt-2 space-y-2">
                        {facts.map((fact, index) => (
                          <div key={`${type}-${fact.label}-${index}`} className="rounded border border-white/10 bg-[#171923] px-3 py-2">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate text-sm font-bold text-white">{fact.valueText || fact.label}</p>
                              <span className="shrink-0 text-xs font-semibold text-slate-400">
                                {confidenceLabel(fact.confidence)}
                              </span>
                            </div>
                            {fact.evidenceText && (
                              <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-400">{fact.evidenceText}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="rounded border border-white/10 bg-[#171923] px-3 py-2 text-xs text-slate-500">--</p>
                )}
              </div>
            </section>

            <section className="rounded border border-white/10 bg-[#0e1118] p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-white">Match Search</h2>
                <span className="text-xs font-semibold text-slate-400">{searchStatus}</span>
              </div>
              <label className="mt-3 block text-xs font-semibold text-slate-300">
                Matcher
                <select
                  value={matchProvider}
                  onChange={(event) => setMatchProvider(event.target.value as ExtractionProvider)}
                  className="mt-1 h-10 w-full rounded border border-white/12 bg-[#171923] px-3 text-sm font-bold text-white outline-none focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/20"
                >
                  <option value="local">Local reason</option>
                  <option value="auto">Auto AI</option>
                  <option value="groq">Groq</option>
                  <option value="openai">OpenAI</option>
                </select>
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => seedDemoProfiles("memory")}
                  disabled={isSeeding}
                  className="h-10 rounded border border-emerald-200/30 bg-emerald-200/10 px-3 text-xs font-bold uppercase tracking-[0.12em] text-emerald-100 transition hover:border-emerald-200/60 hover:bg-emerald-200/15 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {seedingTarget === "memory" ? "Seeding..." : "Seed Memory"}
                </button>
                <button
                  type="button"
                  onClick={() => seedDemoProfiles("tidb")}
                  disabled={isSeeding}
                  className="h-10 rounded border border-cyan-200/30 bg-cyan-200/10 px-3 text-xs font-bold uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-200/15 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {seedingTarget === "tidb" ? "Seeding..." : "Seed TiDB"}
                </button>
              </div>
              {seedResult?.profiles?.length ? (
                <div className="mt-3 rounded border border-white/10 bg-[#171923] px-3 py-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100">
                    seeded {seedResult.seeded} / {seedResult.storageMode}
                  </p>
                  {seedResult.warning || seedResult.note ? (
                    <p className="mt-1 text-[11px] leading-5 text-slate-400">{seedResult.warning || seedResult.note}</p>
                  ) : null}
                  <div className="mt-2 space-y-1">
                    {seedResult.profiles.map((profile) => (
                      <p key={profile.profileUid} className="truncate text-xs leading-5 text-slate-300">
                        {profile.displayName}: {profile.headline} ({profile.factCount}) / {profile.storageMode}
                      </p>
                    ))}
                  </div>
                </div>
              ) : null}
              <form onSubmit={searchProfiles} className="mt-3 grid gap-3">
                <textarea
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  rows={3}
                  className="w-full resize-none rounded border border-white/12 bg-[#171923] px-3 py-3 text-sm leading-6 text-white outline-none focus:border-cyan-200 focus:ring-2 focus:ring-cyan-200/20"
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="h-10 rounded border border-white/12 bg-[#171923] px-3 text-sm font-bold text-slate-200 transition hover:border-cyan-200/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Search
                </button>
              </form>
              <div className="mt-3 space-y-2">
                {searchResults.length ? (
                  searchResults.map((result) => (
                    <article key={result.profileUid} className="overflow-hidden rounded border border-white/10 bg-[#171923]">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedResult((current) =>
                            current?.profileUid === result.profileUid ? null : result,
                          )
                        }
                        className="w-full px-3 py-2 text-left transition hover:bg-[#1b202c] focus:outline-none focus:ring-2 focus:ring-cyan-200/20"
                        aria-expanded={selectedResult?.profileUid === result.profileUid}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="truncate text-sm font-bold text-white">
                            {result.displayName || result.structured?.displayName || "No name"}
                          </p>
                          <span className="shrink-0 text-xs font-semibold text-emerald-100">
                            {result.matchAnalysis?.fitScore == null ? result.matchMode : `${result.matchAnalysis.fitScore}%`}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs font-semibold text-cyan-100">
                          {result.headline || result.structured?.headline || result.profileUid}
                        </p>
                        <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-400">{result.narrative}</p>
                        {result.matchAnalysis?.reason && (
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-emerald-100/90">
                            {result.matchAnalysis.reason}
                          </p>
                        )}
                      </button>

                      {selectedResult?.profileUid === result.profileUid && (
                        <div className="border-t border-white/10 bg-[#10141d] px-3 py-3">
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            <div className="rounded border border-white/10 bg-[#171923] px-2 py-2">
                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Matcher</p>
                              <p className="mt-1 truncate text-xs font-bold text-white">
                                {selectedResult.matchAnalysis?.provider || "--"}
                              </p>
                            </div>
                            <div className="rounded border border-white/10 bg-[#171923] px-2 py-2">
                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Fit</p>
                              <p className="mt-1 text-xs font-bold text-white">
                                {selectedResult.matchAnalysis?.fitScore == null ? "--" : `${selectedResult.matchAnalysis.fitScore}%`}
                              </p>
                            </div>
                            <div className="rounded border border-white/10 bg-[#171923] px-2 py-2">
                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Retrieval</p>
                              <p className="mt-1 text-xs font-bold text-white">
                                {selectedResult.matchMode || "--"}
                              </p>
                            </div>
                            <div className="rounded border border-white/10 bg-[#171923] px-2 py-2">
                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">Facts</p>
                              <p className="mt-1 text-xs font-bold text-white">
                                {selectedResult.structured?.structuredFacts?.length || 0}
                              </p>
                            </div>
                          </div>

                          {selectedResult.matchAnalysis && (
                            <div className="mt-3 rounded border border-emerald-200/20 bg-emerald-200/5 px-3 py-2">
                              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100">
                                Match Reason
                              </p>
                              <p className="mt-1 text-xs leading-5 text-slate-200">{selectedResult.matchAnalysis.reason || "--"}</p>
                              {selectedResult.matchAnalysis.highlights?.length ? (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                  {selectedResult.matchAnalysis.highlights.map((item) => (
                                    <span
                                      key={item}
                                      className="rounded border border-emerald-200/20 bg-emerald-200/10 px-2 py-1 text-[11px] font-semibold text-emerald-50"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              ) : null}
                              {selectedResult.matchAnalysis.concerns?.length ? (
                                <div className="mt-2 space-y-1">
                                  {selectedResult.matchAnalysis.concerns.map((item) => (
                                    <p key={item} className="text-[11px] leading-5 text-amber-100">
                                      {item}
                                    </p>
                                  ))}
                                </div>
                              ) : null}
                              {selectedResult.matchAnalysis.warning ? (
                                <p className="mt-2 text-[11px] leading-5 text-amber-100">
                                  {selectedResult.matchAnalysis.warning}
                                </p>
                              ) : null}
                            </div>
                          )}

                          <div className="mt-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Narrative</p>
                            <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-slate-300">
                              {selectedResult.narrative || selectedResult.structured?.narrative || "--"}
                            </p>
                          </div>

                          <div className="mt-3 space-y-3">
                            {selectedFactsByType.length ? (
                              selectedFactsByType.map(([type, facts]) => (
                                <div key={type}>
                                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-200">
                                    {factLabels[type] || type}
                                  </p>
                                  <div className="mt-2 space-y-2">
                                    {facts.slice(0, 4).map((fact, index) => (
                                      <div
                                        key={`${type}-${fact.label}-${index}`}
                                        className="rounded border border-white/10 bg-[#171923] px-2 py-2"
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <p className="break-words text-xs font-bold text-white">{fact.valueText || fact.label}</p>
                                          <span className="shrink-0 text-[11px] font-semibold text-slate-400">
                                            {confidenceLabel(fact.confidence)}
                                          </span>
                                        </div>
                                        {fact.evidenceText && (
                                          <p className="mt-1 break-words text-[11px] leading-5 text-slate-400">
                                            {fact.evidenceText}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="rounded border border-white/10 bg-[#171923] px-3 py-2 text-xs text-slate-500">--</p>
                            )}
                          </div>
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <p className="rounded border border-white/10 bg-[#171923] px-3 py-2 text-xs text-slate-500">--</p>
                )}
              </div>
            </section>
          </aside>
        </div>

      </div>
    </main>
  );
}
