import React, { useState } from "react";
import { ExperienceTemplate, MemoryEpisode, Tone } from "../types";
import { experienceEntryOptions, experienceMenus, memoryEpisodes, companyNavItems, sellNavItems, facilityNavItems, landingNavItems, catalogNavItems, bookingSteps, plans, categories, valuation, sellSteps, safetyItems, ethics, roomZones, sessionSteps, bodyStates, purchaseUseCases, intakeChecks } from "../data";
import { Header, Footer, LogoMark, BrandLockup, Button, SectionHeader, Info, Hero, Problem, PurchaseUseCases, Service, FacilityTeaser, Marketplace, CatalogTeaser, Reviews, FAQ, FinalCta, CatalogHero, MemoryEpisodes, Plans, CardGrid } from "../components/SharedComponents";

export default function ExperienceStartPage() {
  const [selectedMemoryType, setSelectedMemoryType] = useState(experienceEntryOptions[0].title);
  const bookingHref = `/booking?memoryType=${encodeURIComponent(selectedMemoryType)}`;

  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={landingNavItems} />
      <section className="relative overflow-hidden px-5 pb-16 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(88,244,255,0.20),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,79,216,0.14),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_72%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyanline/20 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <LogoMark tone="dark" className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Memory Intake</span>
            </div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">START EXPERIENCE</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              体験したい記憶を、ここから選びます。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              初回は、記憶の種類と感情の強さを確認しながら進めます。いきなり定着に入るのではなく、体験したい過去、避けたい場面、終了後に残したい余韻を一つずつ整理します。
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#intake"
                className="rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5"
              >
                体験前チェックを始める
              </a>
              <a
                href="/facility"
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
              >
                施設を先に見る
              </a>
            </div>
          </div>
          <div className="glass-card">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyanline">First Session</p>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="初回確認" value="約30分" />
              <Info label="体験時間" value="記憶タイプで変動" />
              <Info label="定着強度" value="Low から開始" />
              <Info label="中断" value="いつでも可能" />
            </dl>
            <p className="mt-6 rounded-2xl border border-magentapulse/20 bg-magentapulse/5 p-4 text-sm leading-7 text-slate-300">
              このページは体験の入口です。購入や予約を確定する前に、記憶の内容と安全確認を整理できます。
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-10">
        <SectionHeader
          eyebrow="Choose Memory"
          title="まずは、体験したい記憶のタイプを選びます。"
          description="ここでは大まかな記憶タイプだけを選びます。短い場面の記憶は1回の体験で扱えますが、数年分の人生記憶は複数回のセッションに分けて定着させます。"
        />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {experienceEntryOptions.map((option) => (
            <button
              key={option.title}
              type="button"
              onClick={() => setSelectedMemoryType(option.title)}
              className={`plan-card text-left ${selectedMemoryType === option.title ? "border-cyanline/70 bg-cyanline/10 shadow-glow" : ""
                }`}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-magentapulse">{option.meta}</p>
              <h3 className="text-xl font-semibold text-white">{option.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{option.description}</p>
              <dl className="mt-5 grid gap-2 text-sm">
                <Info label="体験時間" value={option.sessionSpan} />
                <Info label="記憶内の期間" value={option.memorySpan} />
              </dl>
              <p className={`mt-5 text-xs font-semibold ${selectedMemoryType === option.title ? "text-cyanline" : "text-slate-500"}`}>
                {selectedMemoryType === option.title ? "選択中" : "クリックして選択"}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section id="intake" className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent,rgba(88,244,255,0.06),transparent)]" />
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Intake Check</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">体験前に確認すること。</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              記憶定着は、希望を聞いてすぐ始めるものではありません。心地よく持ち帰れる記憶にするため、以下の項目を確認します。
            </p>
            <div className="mt-7 grid gap-5 border-l border-cyanline/30 pl-5">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cyanline">01</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">まず、体験したい記憶の方向性を確認します。ここで選ぶのは大枠です。具体的な記憶メニューは予約後の説明で調整できます。</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cyanline">02</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">次に、残したい余韻や避けたい感情を確認します。不安な場面がある場合は、右側のフォームで複数選択できます。</p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cyanline">03</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">最後に、予約ページで日時と来館前説明の方法を選びます。長い人生記憶は、初回確認後に必要な回数を提案します。</p>
              </div>
            </div>
          </div>
          <form className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl md:p-8">
            <div className="grid gap-5">
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                体験したい記憶
                <select
                  value={selectedMemoryType}
                  onChange={(event) => setSelectedMemoryType(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline"
                >
                  {experienceEntryOptions.map((option) => (
                    <option key={option.title}>{option.title}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                感情の強さ
                <select className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                  <option>弱めに始めたい</option>
                  <option>標準で体験したい</option>
                  <option>強めの余韻を残したい</option>
                </select>
              </label>
              <fieldset className="grid gap-3 rounded-2xl border border-white/10 bg-obsidian/70 p-4">
                <legend className="px-1 text-sm font-semibold text-slate-200">重点的に確認したいこと</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {intakeChecks.map((item) => (
                    <label key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-normal leading-6 text-slate-300">
                      <input type="checkbox" className="mt-1 h-4 w-4 accent-cyanline" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                避けたい場面
                <textarea
                  className="min-h-28 resize-none rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal leading-7 text-slate-200 outline-none focus:border-cyanline"
                  placeholder="例: 大きな音、強い喪失感、暗い場所"
                />
              </label>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button href={bookingHref}>体験内容を確認して予約へ進む</Button>
                <Button href="/catalog" variant="secondary">
                  メニューから選ぶ
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <FinalCta />
      <Footer items={landingNavItems} />
    </main>
  );
}

function getDefaultVisitDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

