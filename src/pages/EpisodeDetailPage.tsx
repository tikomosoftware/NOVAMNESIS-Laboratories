import React, { useState } from "react";
import { ExperienceTemplate, MemoryEpisode, Tone } from "../types";
import { experienceEntryOptions, experienceMenus, memoryEpisodes, companyNavItems, sellNavItems, facilityNavItems, landingNavItems, catalogNavItems, bookingSteps, plans, categories, valuation, sellSteps, safetyItems, ethics, roomZones, sessionSteps, bodyStates, purchaseUseCases } from "../data";
import { Header, Footer, LogoMark, BrandLockup, Button, SectionHeader, Info, Hero, Problem, PurchaseUseCases, Service, FacilityTeaser, Marketplace, CatalogTeaser, Reviews, FAQ, FinalCta, CatalogHero, MemoryEpisodes, Plans, CardGrid } from "../components/SharedComponents";

export default function EpisodeDetailPage({ episode }: { episode: MemoryEpisode }) {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={catalogNavItems} />
      <section className="relative overflow-hidden px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_12%,rgba(255,79,216,0.17),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(88,244,255,0.14),transparent_30%),linear-gradient(180deg,#060711_0%,#0c1020_72%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-25" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <a href="/catalog#episodes" className="mb-8 inline-flex text-sm font-semibold text-cyanline transition hover:text-white">
              Short Memories に戻る
            </a>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-magentapulse">{episode.tag}</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">{episode.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">{episode.synopsis}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button>この思い出を予約する</Button>
              <Button variant="secondary">感情強度を調整する</Button>
            </div>
          </div>
          <div className="glass-card">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyanline">Episode Spec</p>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="スパン" value={episode.period} />
              <Info label="感情" value={episode.intensity} />
              <Info label="由来" value={episode.source} />
              <Info label="形式" value="短編記憶エピソード" />
            </dl>
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-slate-300">
              短編記憶は、一生分の経歴ではなく、数十分から数日だけの濃い場面を体験する商品です。購入後は「自分が本当に経験した過去」ではなく「購入した記憶」として認識できる境界タグが付与されます。
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Story Timeline"
          title="体験中に流れるストーリー。"
          description="購入前に、どんな順番で記憶が展開されるかを確認できます。"
        />
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-5">
          {episode.timeline.map((item, index) => (
            <div key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <span className="text-xs text-cyanline">SCENE {String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 text-sm leading-7 text-slate-200">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
          <div className="glass-card lg:col-span-2">
            <h2 className="text-2xl font-semibold text-white">体験内容の詳細</h2>
            <div className="mt-6 grid gap-4">
              {episode.details.map((detail) => (
                <p key={detail} className="rounded-2xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm leading-7 text-slate-300">
                  {detail}
                </p>
              ))}
            </div>
          </div>
          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white">残る感覚</h2>
            <div className="mt-6 grid gap-3">
              {episode.sensations.map((sensation) => (
                <p key={sensation} className="border-l border-cyanline/40 pl-4 text-sm leading-7 text-slate-300">
                  {sensation}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-magentapulse/20 bg-magentapulse/5 p-8 backdrop-blur-xl md:p-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-magentapulse">Before Purchase</p>
          <h2 className="text-3xl font-semibold text-white">購入前に確認すること。</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {episode.purchaseNotes.map((note) => (
              <p key={note} className="rounded-2xl border border-white/10 bg-obsidian/70 p-4 text-sm leading-7 text-slate-300">
                {note}
              </p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button>この思い出を予約する</Button>
            <a
              href="/catalog#episodes"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
            >
              他の短編記憶を見る
            </a>
          </div>
        </div>
      </section>

      <Footer items={catalogNavItems} />
    </main>
  );
}

