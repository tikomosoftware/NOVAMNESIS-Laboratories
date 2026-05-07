import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  bodyStates,
  bookingSteps,
  ethics,
  experienceEntryOptions,
  experienceMenus,
  faqs,
  faqsSell,
  memoryEpisodes,
  plans,
  roomZones,
  safetyItems,
  sellSteps,
  sessionSteps,
} from "../data";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type KnowledgeItem = {
  title: string;
  content: string;
  url: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "こんにちは！Novamnesisについて、体験メニュー・予約・安全性・FAQなど何でも聞いてください。",
  },
];

function flattenValue(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) return value.flatMap(flattenValue);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(flattenValue);
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return [String(value)];
  }
  return [];
}

function titleFromItem(item: unknown, fallback: string) {
  if (item && typeof item === "object") {
    const record = item as Record<string, unknown>;
    return String(record.title || record.question || record.label || record.memory || fallback);
  }
  return fallback;
}

function buildKnowledge(): KnowledgeItem[] {
  const collections: Array<[string, unknown[], string]> = [
    ["FAQ", faqs, "/faq"],
    ["売却FAQ", faqsSell, "/faq"],
    ["体験メニュー", experienceMenus, "/catalog"],
    ["記憶エピソード", memoryEpisodes, "/catalog"],
    ["プラン", plans, "/catalog"],
    ["施設", roomZones, "/facility"],
    ["体験の流れ", sessionSteps, "/experience"],
    ["予約", bookingSteps, "/booking"],
    ["安全", safetyItems, "/safety"],
    ["倫理", ethics, "/safety"],
    ["売却プロセス", sellSteps, "/sell"],
    ["体験入口", experienceEntryOptions, "/experience"],
    ["身体感覚", bodyStates, "/experience"],
  ];

  return collections.flatMap(([label, items, url]) =>
    items.map((item, index) => ({
      title: `${label}: ${titleFromItem(item, `${label} ${index + 1}`)}`,
      content: flattenValue(item).join("\n"),
      url,
    })),
  );
}

function scoreItem(query: string, item: KnowledgeItem) {
  const source = `${item.title}\n${item.content}`.toLowerCase();
  const terms = query
    .toLowerCase()
    .split(/[\s　,、。！？!?]+/)
    .filter((term) => term.length >= 2);
  if (!terms.length) return 0;
  return terms.reduce((score, term) => score + (source.includes(term) ? term.length : 0), 0);
}

function localAnswer(query: string, knowledge: KnowledgeItem[]) {
  const hits = knowledge
    .map((item) => ({ item, score: scoreItem(query, item) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (!hits.length) {
    return "すみません、サイト内データだけでは該当情報をうまく見つけられませんでした。体験メニュー、予約、安全性、FAQ、記憶の売却についての質問なら答えやすいです。";
  }

  const lines = hits.map(({ item }) => {
    const snippet = item.content.replace(/\s+/g, " ").slice(0, 180);
    return `・${item.title}\n${snippet}\n参照: ${item.url}`;
  });

  return `サイト内の情報から近そうな内容を見つけました。\n\n${lines.join("\n\n")}`;
}

async function askRemote(message: string) {
  const endpoint = (import.meta.env.VITE_CHAT_API_URL as string | undefined) || "/api/chat";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  if (data?.errorCode === "NO_RELEVANT_DATA") {
    return String(data?.response || "");
  }
  if (!response.ok || data?.error) {
    throw new Error(data?.error || "チャットAPIでエラーが発生しました。");
  }
  return String(data?.response || data?.message || "");
}

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const knowledge = useMemo(buildKnowledge, []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const remoteAnswer = await askRemote(trimmed);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: remoteAnswer || localAnswer(trimmed, knowledge),
      };
      setMessages((current) => [...current, assistantMessage]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content:
            error instanceof Error
              ? `接続に失敗しました。いったんサイト内データから回答します。\n\n${localAnswer(trimmed, knowledge)}`
              : localAnswer(trimmed, knowledge),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70] sm:bottom-7 sm:right-7">
      {isOpen && (
        <div
          className="mb-4 flex h-[min(640px,calc(100vh-120px))] w-[calc(100vw-40px)] max-w-[440px] flex-col overflow-hidden rounded-[1.35rem] border border-cyanline/30 bg-[#111a2c] shadow-[0_22px_80px_rgba(0,0,0,0.45)]"
          role="dialog"
          aria-label="AIアシスタント"
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-violetsignal via-[#4f8df5] to-cyanline px-5 py-4 text-white">
            <h2 className="text-lg font-bold">AIアシスタント</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12 text-2xl leading-none transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/70"
              aria-label="チャットを閉じる"
            >
              ×
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl border px-4 py-3 text-sm leading-7 ${
                    message.role === "user"
                      ? "border-cyanline/35 bg-cyanline/15 text-white"
                      : "border-white/10 bg-[#18243a] text-slate-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-white/10 bg-[#18243a] px-4 py-3 text-sm text-slate-300">
                  回答を準備しています...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t border-white/10 bg-[#10182a] p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="質問を入力してください..."
                rows={1}
                className="min-h-12 flex-1 resize-none rounded-xl border border-violetsignal/60 bg-[#172137] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyanline focus:ring-2 focus:ring-cyanline/30"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="min-h-12 rounded-xl bg-[#1bbfd0] px-5 text-sm font-bold text-slate-50 transition hover:bg-[#20d6e8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="ml-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyanline/35 bg-[#1bbfd0] text-obsidian shadow-[0_0_28px_rgba(88,244,255,0.2),0_14px_34px_rgba(0,0,0,0.34)] transition hover:-translate-y-0.5 hover:bg-[#20d6e8] hover:shadow-[0_0_34px_rgba(88,244,255,0.28),0_16px_38px_rgba(0,0,0,0.38)] focus:outline-none focus:ring-2 focus:ring-cyanline focus:ring-offset-2 focus:ring-offset-obsidian"
        aria-label={isOpen ? "チャットを閉じる" : "チャットを開く"}
      >
        {isOpen ? (
          <svg className="h-9 w-9" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg className="h-9 w-9 text-obsidian" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.99 3.06 16.27L2 22L7.73 20.94C9.01 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
              fill="white"
            />
            <circle cx="8" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            <circle cx="16" cy="12" r="1.5" fill="currentColor" />
          </svg>
        )}
      </button>
    </div>
  );
}
