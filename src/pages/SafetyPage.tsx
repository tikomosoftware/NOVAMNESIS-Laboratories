import React, { useState } from "react";
import { ExperienceTemplate, MemoryEpisode, Tone } from "../types";
import { experienceEntryOptions, experienceMenus, memoryEpisodes, companyNavItems, sellNavItems, facilityNavItems, landingNavItems, catalogNavItems, bookingSteps, plans, categories, valuation, sellSteps, safetyItems, ethics, roomZones, sessionSteps, bodyStates, purchaseUseCases } from "../data";
import { Header, Footer, LogoMark, BrandLockup, Button, SectionHeader, Info, Hero, Problem, PurchaseUseCases, Service, FacilityTeaser, Marketplace, CatalogTeaser, Reviews, FAQ, FinalCta, CatalogHero, MemoryEpisodes, Plans, CardGrid } from "../components/SharedComponents";

export default function SafetyPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={landingNavItems} tone="corporate" />
      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(88,244,255,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,79,216,0.14),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_68%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>

            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">MEMORY EXPERIENCE SAFETY</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              記憶を買う前に、安全基準を確認する。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              Novamnesis Laboratories は、購入した記憶が日常へ戻る力を壊さないよう、体験前、体験中、体験後の各段階で境界タグ、感情強度、現実混同リスクを管理します。
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-cyanline/20 bg-white/[0.045] p-6 shadow-glow backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse" />
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyanline">Pre-Session Gate</p>
            <div className="grid gap-3">
              {[
                ["Consent", "必須"],
                ["Boundary Tag", "自動付与"],
                ["Reality Drift", "事前評価"],
                ["Aftercare", "全体験に付属"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[1fr_auto] gap-4 rounded-xl border border-white/10 bg-obsidian/65 px-4 py-3 text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-200">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_18%,rgba(88,244,255,0.08),transparent_28%),radial-gradient(circle_at_80%_72%,rgba(255,79,216,0.08),transparent_30%)]" />
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Safety Controls</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">体験前後の安全管理。</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            安全基準は購入前の判断材料です。どの記憶を選ぶ場合でも、体験内容より先に確認できる独立ページとして公開しています。
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {safetyItems.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="text-sm leading-7 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ethics" className="relative overflow-hidden px-5 py-24">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Ethical Protocol</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">倫理プロトコル。</h2>
        </div>
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {ethics.map((item) => (
            <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-slate-300 backdrop-blur-xl">
              {item}
            </p>
          ))}
        </div>
      </section>

      <Footer items={landingNavItems} />
    </main>
  );
}

