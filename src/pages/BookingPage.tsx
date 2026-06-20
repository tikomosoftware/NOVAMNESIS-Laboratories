import React, { useState } from "react";
import { ExperienceTemplate, MemoryEpisode, Tone } from "../types";
import { experienceEntryOptions, experienceMenus, memoryEpisodes, companyNavItems, sellNavItems, facilityNavItems, landingNavItems, catalogNavItems, bookingSteps, plans, categories, valuation, sellSteps, safetyItems, ethics, roomZones, sessionSteps, bodyStates, purchaseUseCases } from "../data";
import { Header, Footer, LogoMark, BrandLockup, Button, SectionHeader, Info, Hero, Problem, PurchaseUseCases, Service, FacilityTeaser, Marketplace, CatalogTeaser, Reviews, FAQ, FinalCta, CatalogHero, MemoryEpisodes, Plans, CardGrid } from "../components/SharedComponents";

function getDefaultVisitDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

export default function BookingPage() {
  const requestedMemoryType = new URLSearchParams(window.location.search).get("memoryType");
  const initialMemoryType = experienceEntryOptions.some((option) => option.title === requestedMemoryType)
    ? requestedMemoryType ?? experienceEntryOptions[0].title
    : experienceEntryOptions[0].title;
  const [memoryType, setMemoryType] = useState(initialMemoryType);
  const [emotionLevel, setEmotionLevel] = useState("弱め");
  const [visitDate, setVisitDate] = useState(getDefaultVisitDate);
  const [visitTime, setVisitTime] = useState("10:00 初回確認");
  const [briefing, setBriefing] = useState("オンライン説明を受ける");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formattedVisitDate = visitDate
    ? new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" }).format(new Date(`${visitDate}T00:00:00`))
    : "未選択";

  function handleBookingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setMemoryType(String(formData.get("memoryType") || memoryType));
    setEmotionLevel(String(formData.get("emotionLevel") || emotionLevel));
    setVisitDate(String(formData.get("visitDate") || visitDate));
    setVisitTime(String(formData.get("visitTime") || visitTime));
    setBriefing(String(formData.get("briefing") || briefing));
    setName(String(formData.get("name") || name));
    setEmail(String(formData.get("email") || email));
    setNotes(String(formData.get("notes") || notes));
    setIsSending(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
    }, 1800);
  }

  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={landingNavItems} />
      <section className="relative overflow-hidden px-5 pb-16 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(88,244,255,0.18),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(255,79,216,0.14),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_72%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">RESERVE SESSION</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              体験内容を確認して、日時を予約します。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              ここでは、体験したい記憶の種類、感情の強さ、希望日時、来館前説明の方法を確認します。長い人生記憶は1回で完了させず、スタッフによる事前確認後に必要なセッション回数を提案します。
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
              {bookingSteps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-cyanline">STEP {String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-2 text-sm font-medium text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {isSending ? (
            <div className="relative overflow-hidden rounded-[2rem] border border-cyanline/25 bg-cyanline/5 p-6 shadow-glow backdrop-blur-xl md:p-8">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse" />
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Transmitting Request</p>
              <h2 className="text-3xl font-semibold leading-tight text-white">予約内容を送信しています。</h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                希望日時、記憶タイプ、来館前説明の内容を NEURAMNESIA 予約プロトコルに登録しています。
              </p>
              <div className="mt-8 grid gap-4">
                {["予約内容の検証", "境界タグの仮登録", "来館前説明の割り当て"].map((item, index) => (
                  <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-obsidian/70 p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyanline/30 bg-cyanline/10 text-xs font-semibold text-cyanline">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-200">{item}</p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-7 text-xs leading-6 text-slate-500">
                この送信中表示はデモ演出です。実際の外部送信やメール送信は行われません。
              </p>
            </div>
          ) : submitted ? (
            <div className="rounded-[2rem] border border-cyanline/25 bg-cyanline/5 p-6 shadow-glow backdrop-blur-xl md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Reservation Received</p>
              <h2 className="text-3xl font-semibold leading-tight text-white">予約内容を送信しました。</h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                {name || "お客様"}様、NEURAMNESIA へのご予約ありがとうございます。後日のご来館を心よりお待ちしております。
              </p>
              <div className="mt-8 grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-obsidian/70 p-4">
                  <p className="text-xs font-semibold tracking-[0.22em] text-cyanline">来館予定</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{formattedVisitDate}</p>
                  <p className="mt-1 text-sm text-slate-400">{visitTime}</p>
                </div>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <Info label="記憶タイプ" value={memoryType} wide />
                  <Info label="感情の強さ" value={emotionLevel} />
                  <Info label="来館前説明" value={briefing} />
                  <Info label="連絡先" value={email || "未入力"} wide />
                </dl>
                {notes && (
                  <div className="rounded-2xl border border-white/10 bg-obsidian/70 p-4 text-sm leading-7 text-slate-300">
                    <p className="mb-2 font-semibold text-slate-200">事前メモ</p>
                    <p>{notes}</p>
                  </div>
                )}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/catalog"
                  className="rounded-full border border-cyanline/30 bg-cyanline px-6 py-3 text-sm font-semibold text-obsidian shadow-[0_0_24px_rgba(88,244,255,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  別のメニューを見る
                </a>
                <button
                  className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
                  onClick={() => {
                    setSubmitted(false);
                    setIsSending(false);
                  }}
                  type="button"
                >
                  予約内容を修正する
                </button>
              </div>
              <p className="mt-7 text-xs leading-6 text-slate-500">
                この送信結果はデモ表示です。実際の予約受付、メール送信、医療行為、記憶操作サービスは行われません。
              </p>
            </div>
          ) : (
            <form className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl md:p-8" onSubmit={handleBookingSubmit}>
              <div className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    記憶タイプ
                    <select name="memoryType" value={memoryType} onChange={(event) => setMemoryType(event.target.value)} className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                      {experienceEntryOptions.map((option) => (
                        <option key={option.title}>{option.title}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    感情の強さ
                    <select name="emotionLevel" value={emotionLevel} onChange={(event) => setEmotionLevel(event.target.value)} className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                      <option>弱め</option>
                      <option>標準</option>
                      <option>強め</option>
                    </select>
                  </label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    希望日
                    <input type="date" name="visitDate" value={visitDate} onChange={(event) => setVisitDate(event.target.value)} required className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    希望時間
                    <select name="visitTime" value={visitTime} onChange={(event) => setVisitTime(event.target.value)} className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                      <option>10:00 初回確認</option>
                      <option>13:00 初回確認</option>
                      <option>16:00 初回確認</option>
                      <option>19:00 初回確認</option>
                    </select>
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-semibold text-slate-200">
                  来館前説明
                  <select name="briefing" value={briefing} onChange={(event) => setBriefing(event.target.value)} className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                    <option>オンライン説明を受ける</option>
                    <option>当日、施設で説明を受ける</option>
                    <option>施設見学を先に予約する</option>
                  </select>
                </label>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    お名前
                    <input name="name" value={name} onChange={(event) => setName(event.target.value)} required className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline" placeholder="名前を入力してください" />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    メールアドレス
                    <input type="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline" placeholder="example@neuramnesia.test" />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-semibold text-slate-200">
                  事前に伝えておきたいこと
                  <textarea
                    name="notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="min-h-28 resize-none rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal leading-7 text-slate-200 outline-none focus:border-cyanline"
                    placeholder="避けたい記憶、苦手な感覚、当日不安なことなど"
                  />
                </label>
                <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-obsidian/70 p-4 text-sm leading-7 text-slate-300">
                  <input type="checkbox" name="agreed" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} required className="mt-1 h-4 w-4 accent-cyanline" />
                  <span>予約後にスタッフが内容を確認し、必要に応じて体験内容を調整することに同意します。</span>
                </label>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    className="rounded-full border border-cyanline/30 bg-cyanline px-6 py-3 text-sm font-semibold text-obsidian shadow-[0_0_24px_rgba(88,244,255,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-55 focus:outline-none focus:ring-2 focus:ring-cyanline focus:ring-offset-2 focus:ring-offset-obsidian"
                    disabled={isSending || !agreed}
                    type="submit"
                  >
                    {isSending ? "送信中..." : "予約内容を送信する"}
                  </button>
                  <Button href="/experience" variant="secondary">
                    体験内容を見直す
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
      <section className="section pt-4">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-cyanline/20 bg-cyanline/5 p-6 md:p-8">
          <p className="text-sm leading-7 text-slate-300">
            この予約フォームはデモです。実際の医療行為や記憶操作サービスではありません。送信後は入力内容をもとにした予約確認表示へ切り替わります。
          </p>
        </div>
      </section>
      <Footer items={landingNavItems} />
    </main>
  );
}

