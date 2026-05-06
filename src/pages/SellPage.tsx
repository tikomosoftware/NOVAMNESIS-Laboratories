import React, { useState } from "react";
import { ExperienceTemplate, MemoryEpisode, Tone } from "../types";
import { experienceEntryOptions, experienceMenus, memoryEpisodes, companyNavItems, sellNavItems, facilityNavItems, landingNavItems, catalogNavItems, bookingSteps, plans, categories, valuation, sellSteps, safetyItems, ethics, roomZones, sessionSteps, bodyStates, purchaseUseCases } from "../data";
import { Header, Footer, LogoMark, BrandLockup, Button, SectionHeader, Info, Hero, Problem, PurchaseUseCases, Service, FacilityTeaser, Marketplace, CatalogTeaser, Reviews, FAQ, FinalCta, CatalogHero, MemoryEpisodes, Plans, CardGrid } from "../components/SharedComponents";

export default function SellPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={sellNavItems} tone="corporate" />
      <section id="overview" className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(255,79,216,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(88,244,255,0.20),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_68%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-30" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">SELL YOUR MEMORY</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              あなたの記憶を、誰かの体験したかった人生へ。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              売却ページでは、提供者向けに記憶の査定、匿名化、ライセンス、掲載までの流れを案内します。購入者向けの会社情報とは分けて、記憶を提供する人が確認すべき条件だけを整理しています。
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="#valuation" tone="corporate">査定基準を見る</Button>
              <Button href="#process" tone="corporate" variant="secondary">売却プロセスを見る</Button>
            </div>
          </div>
          <div className="rounded-[1.75rem] border border-cyanline/15 bg-white/[0.045] p-6 shadow-[0_0_34px_rgba(88,244,255,0.12),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-sm text-slate-400">VALUATION PREVIEW</span>
              <span className="font-semibold text-cyanline">JPY 428,000 - 910,000</span>
            </div>
            {valuation.slice(0, 4).map((item, index) => (
              <div key={item.title} className="mb-5">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-300">{item.title}</span>
                  <span className="text-slate-500">{72 + index * 6}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyanline to-magentapulse" style={{ width: `${72 + index * 6}%` }} />
                </div>
              </div>
            ))}
            <p className="mt-6 rounded-2xl border border-magentapulse/20 bg-magentapulse/5 p-4 text-sm leading-7 text-slate-300">
              通常売却では、提供者自身の記憶は失われません。独占ライセンス契約では、契約範囲に応じて一部アクセス制限が発生する場合があります。
            </p>
          </div>
        </div>
      </section>

      <section id="valuation" className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-15" />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Memory Valuation</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">記憶資産の査定基準。</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            初恋、成功、挫折、旅、勝負の瞬間。Novamnesis Laboratories は、提供者の同意に基づいて記憶を匿名化し、感情強度・希少性・没入度・安全性を評価します。
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {valuation.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:border-cyanline/25 hover:shadow-glow">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="process" className="relative overflow-hidden px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent,rgba(88,244,255,0.05),transparent)]" />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Process</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">記憶を売る流れ。</h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {sellSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <span className="text-xs font-semibold text-cyanline">STEP {String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 font-medium leading-7 text-slate-200">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer items={sellNavItems} />
    </main>
  );
}

