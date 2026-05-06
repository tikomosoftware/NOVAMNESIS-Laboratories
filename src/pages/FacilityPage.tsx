import React, { useState } from "react";
import { ExperienceTemplate, MemoryEpisode, Tone } from "../types";
import { experienceEntryOptions, experienceMenus, memoryEpisodes, companyNavItems, sellNavItems, facilityNavItems, landingNavItems, catalogNavItems, bookingSteps, plans, categories, valuation, sellSteps, safetyItems, ethics, roomZones, sessionSteps, bodyStates, purchaseUseCases } from "../data";
import { Header, Footer, LogoMark, BrandLockup, Button, SectionHeader, Info, Hero, Problem, PurchaseUseCases, Service, FacilityTeaser, Marketplace, CatalogTeaser, Reviews, FAQ, FinalCta, CatalogHero, MemoryEpisodes, Plans, CardGrid } from "../components/SharedComponents";

export default function FacilityPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={facilityNavItems} />
      <section id="room" className="relative overflow-hidden px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_14%,rgba(88,244,255,0.20),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,79,216,0.15),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_70%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.98fr_1.02fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyanline/20 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <LogoMark tone="dark" className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Facility Protocol</span>
            </div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">MEMORY FIXATION ROOM</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">記憶定着の流れを、事前に確認できます。</h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              体験者が最初に知りたいのは、技術の名前よりも、自分がどこに座り、何を頭に付けられ、どんな感覚の中で記憶が入ってくるのかです。Novamnesis の施設は、その不安を減らすために公開されています。
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                ["SESSION", "60 MIN"],
                ["STAFF", "2名常駐"],
                ["STOP", "音声中断可"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-cyanline">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-cyanline/20 bg-white/[0.04] p-6 shadow-glow backdrop-blur-xl">
            <div className="absolute inset-0 novamnesis-grid opacity-20" />
            <div className="absolute left-1/2 top-8 h-28 w-72 -translate-x-1/2 rounded-full border border-cyanline/20 bg-cyanline/10 blur-sm" />
            <div className="absolute left-1/2 top-20 h-28 w-28 -translate-x-1/2 rounded-full border border-white/15 bg-obsidian/85 shadow-[0_0_32px_rgba(88,244,255,0.25)]" />
            <div className="absolute left-1/2 top-28 h-5 w-48 -translate-x-1/2 rounded-full border border-cyanline/25 bg-cyanline/10" />
            <div className="absolute left-1/2 top-40 h-40 w-52 -translate-x-1/2 rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02]" />
            <div className="absolute bottom-20 left-1/2 h-44 w-80 -translate-x-1/2 rounded-[2rem] border border-cyanline/20 bg-obsidian/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
            <div className="absolute bottom-28 left-1/2 h-28 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(88,244,255,0.24),transparent_66%)]" />
            <div className="absolute left-7 top-8 rounded-2xl border border-white/10 bg-obsidian/75 px-4 py-3 text-xs leading-6 text-slate-300 backdrop-blur-md">
              <span className="block text-cyanline">NEURO CROWN</span>
              contact pressure: soft
            </div>
            <div className="absolute bottom-8 right-7 rounded-2xl border border-magentapulse/20 bg-obsidian/75 px-4 py-3 text-xs leading-6 text-slate-300 backdrop-blur-md">
              <span className="block text-magentapulse">RETURN BAY</span>
              boundary tag active
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Room Tour"
          title="安心して体験に入れる、静かな空間です。"
          description="施設の安心感は、説明の丁寧さだけでなく、入った瞬間に身体がどう反応するかで決まります。体験前後の部屋を分け、記憶と現実が急に混ざらない動線にしています。"
        />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {roomZones.map((zone) => (
            <div key={zone.title} className="glass-card">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-magentapulse">{zone.title}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{zone.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="session" className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent,rgba(88,244,255,0.06),transparent)]" />
        <SectionHeader
          eyebrow="Session Flow"
          title="来館からお帰りまでの流れをご案内します。"
          description="体験者は眠らされるのではなく、浅い睡眠に近い状態へ誘導されます。スタッフ、機械、本人の停止合図が同時にセッションを見守ります。"
        />
        <div className="mx-auto max-w-5xl">
          {sessionSteps.map((step, index) => (
            <div key={step.title} className="grid gap-4 border-t border-white/10 py-6 md:grid-cols-[120px_1fr]">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-cyanline">STEP {String(index + 1).padStart(2, "0")}</p>
                <p className="mt-2 text-sm text-slate-500">{step.time}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">During Fixation</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">記憶定着は、リラックスした状態で行われます。</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              目を閉じ、呼吸はゆっくりになり、時々指先や表情だけが反応します。中では記憶が再生されているのではなく、感情と感覚の順番が本人の中に結び直されています。
            </p>
          </div>
          <div className="grid gap-4">
            <figure className="overflow-hidden rounded-[2rem] border border-cyanline/20 bg-white/[0.04] shadow-glow backdrop-blur-xl">
              <img
                src="/images/memory-fixation-session.png"
                alt="未来的なリクライニングチェアでリラックスしながら記憶定着を受けている様子"
                className="aspect-[16/10] w-full object-cover"
              />
              <figcaption className="border-t border-white/10 px-5 py-4 text-sm leading-7 text-slate-300">
                高級マッサージチェアに近い姿勢で、柔らかいニューロクラウンを装着します。身体を拘束せず、スタッフが離れた端末から状態を見守ります。
              </figcaption>
            </figure>
            {bodyStates.map((state) => (
              <p key={state} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-slate-300 backdrop-blur-xl">
                {state}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="aftercare" className="section pt-0">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-cyanline/20 bg-[radial-gradient(circle_at_18%_20%,rgba(88,244,255,0.16),transparent_28%),radial-gradient(circle_at_86%_46%,rgba(255,79,216,0.12),transparent_30%),rgba(255,255,255,0.04)] p-8 shadow-glow md:p-12">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Aftercare</p>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">体験後は、ゆっくり日常へ戻ります。</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300">
            体験後は、購入した記憶を否定せず、現実の履歴とも混ぜすぎない時間を置きます。水を飲む、日付を見る、短い会話をする。その小さな手順が、記憶を安心して持ち帰るための最後の設備です。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/catalog"
              className="rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5"
            >
              記憶メニューを見る
            </a>
            <a
              href="/#faq"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
            >
              よくある質問へ
            </a>
          </div>
        </div>
      </section>
      <Footer items={facilityNavItems} />
    </main>
  );
}

