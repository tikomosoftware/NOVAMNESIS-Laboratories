import React, { useState } from "react";
import { ExperienceTemplate, MemoryEpisode, Tone } from "../types";
import { experienceEntryOptions, experienceMenus, memoryEpisodes, companyNavItems, sellNavItems, facilityNavItems, landingNavItems, catalogNavItems, bookingSteps, plans, categories, valuation, sellSteps, safetyItems, ethics, roomZones, sessionSteps, bodyStates, purchaseUseCases } from "../data";
import { Header, Footer, LogoMark, BrandLockup, Button, SectionHeader, Info, Hero, Problem, PurchaseUseCases, Service, FacilityTeaser, Marketplace, CatalogTeaser, Reviews, FAQ, FinalCta, CatalogHero, MemoryEpisodes, Plans, CardGrid } from "../components/SharedComponents";

export default function CompanyPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={companyNavItems} tone="corporate" />
      <section id="overview" className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(88,244,255,0.24),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,79,216,0.18),transparent_28%),radial-gradient(circle_at_55%_84%,rgba(157,109,255,0.12),transparent_32%),linear-gradient(180deg,#060711_0%,#0c1020_68%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="absolute inset-x-0 top-28 -z-10 h-px bg-gradient-to-r from-transparent via-cyanline/50 to-transparent" />
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyanline/20 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <LogoMark tone="corporate" className="h-8 w-8" />
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-300">Corporate Protocol</span>
            </div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">LIFE MEMORY LABORATORY</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              経験したかった人生を、記憶として購入する。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              Novamnesis Laboratories は、経験できなかった恋愛、選ばなかった人生、行けなかった旅、味わえなかった成功や挫折を、記憶体験として設計する架空の研究企業です。人生をやり直すのではなく、あなたの中にもうひとつの過去を増やします。
            </p>
            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                ["CONSENT", "100%"],
                ["ANONYMIZE", "L4"],
                ["BOUNDARY TAG", "ACTIVE"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl">
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-500">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-cyanline">{value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-cyanline/20 bg-white/[0.045] p-6 shadow-glow backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse" />
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyanline">Audit Terminal</p>
              <span className="rounded-full border border-cyanline/25 bg-cyanline/10 px-3 py-1 text-xs font-semibold text-cyanline">LIVE</span>
            </div>
            <div className="grid gap-3">
              {[
                ["MEMORY SOURCE", "CONSENT VERIFIED"],
                ["THIRD PARTY DATA", "REMOVED"],
                ["REALITY DRIFT", "0.08"],
                ["ETHICS REVIEW", "PASSED"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-white/10 bg-obsidian/65 px-4 py-3 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-200">{value}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-magentapulse">Operating Principles</p>
            <div className="mt-4 grid gap-3">
              {["本人同意に基づく記憶登録", "匿名化と第三者情報の除去", "境界タグによる現実復帰支援", "高リスク記憶の段階的審査"].map((item) => (
                <div key={item} className="rounded-xl border border-cyanline/10 bg-cyanline/[0.04] px-4 py-3 text-sm font-medium text-slate-200">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_20%,rgba(88,244,255,0.08),transparent_24%),radial-gradient(circle_at_92%_30%,rgba(255,79,216,0.08),transparent_26%)]" />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">For Buyers</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">記憶を買う前に、会社が保証すること。</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            Novamnesis Laboratories の主役は、記憶を購入する体験者です。欲しかった人生を選ぶ前に、内容の調整、境界タグ、安全確認、体験後ケアを会社として明確にします。
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {[
            ["Curated Catalog", "恋愛、成功、旅行、人生分岐、物語記憶を、購入前に内容・強度・余韻で比較できます。"],
            ["Boundary Design", "購入した記憶が現実の経歴と混ざりすぎないよう、体験前に境界タグを設計します。"],
            ["Aftercare", "体験後は日付、現在地、購入記憶であることを確認し、必要に応じて認知安定セッションを行います。"],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:border-cyanline/25 hover:shadow-glow">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-15" />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Purchase Categories</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">購入できる記憶カテゴリ。</h2>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition duration-300 hover:border-cyanline/25 hover:shadow-glow">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer items={companyNavItems} />
    </main>
  );
}

