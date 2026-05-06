import React, { useState } from "react";
import { ExperienceTemplate, MemoryEpisode, Tone } from "../types";
import { experienceEntryOptions, experienceMenus, memoryEpisodes, companyNavItems, sellNavItems, facilityNavItems, landingNavItems, catalogNavItems, bookingSteps, plans, categories, valuation, sellSteps, safetyItems, ethics, roomZones, sessionSteps, bodyStates, purchaseUseCases } from "../data";
import { Header, Footer, LogoMark, BrandLockup, Button, SectionHeader, Info, Hero, Problem, PurchaseUseCases, Service, FacilityTeaser, Marketplace, CatalogTeaser, Reviews, FAQ, FinalCta, CatalogHero, MemoryEpisodes, Plans, CardGrid } from "../components/SharedComponents";

export default function TemplateDetailPage({ template }: { template: ExperienceTemplate }) {
  const relatedPlans = plans.filter((plan) => template.recommendedPlans.includes(plan.title) || template.recommendedPlans.includes(plan.category));

  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={catalogNavItems} />
      <section className="relative overflow-hidden px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(88,244,255,0.18),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(255,79,216,0.16),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_72%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-30" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <a href="/catalog#templates" className="mb-8 inline-flex text-sm font-semibold text-cyanline transition hover:text-white">
              Catalog に戻る
            </a>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.32em] text-magentapulse">Template Detail</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">{template.title}</h1>
            <p className="mt-5 text-2xl leading-9 text-cyanline">{template.tagline}</p>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">{template.description}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button>この人生を予約する</Button>
              <Button variant="secondary">境界タグを確認する</Button>
            </div>
          </div>
          <div className="glass-card">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyanline">Memory Spec</p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Info label="体験時間" value={template.duration} />
              <Info label="記憶内期間" value={template.memorySpan} />
              <Info label="リスク" value={template.risk} />
              <Info label="構成" value="連続人生テンプレート" />
            </dl>
            <p className="mt-6 rounded-2xl border border-magentapulse/20 bg-magentapulse/5 p-4 text-sm leading-7 text-slate-300">
              体験後には、現実の経歴ではなく「記憶として経験した人生」として境界タグが付与されます。強い憧れを伴うテンプレートでは、数日間の余韻が残る場合があります。
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader
          eyebrow="Memory Chapters"
          title="このテンプレートに含まれる記憶章。"
          description="単なるハイライトではなく、成功する前の退屈、失敗、身体の違和感まで含めて再構成されます。"
        />
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-5">
          {template.chapters.map((chapter, index) => (
            <div key={chapter} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <span className="text-xs text-cyanline">CHAPTER {String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 text-sm leading-7 text-slate-200">{chapter}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white">残る感覚情報</h2>
            <div className="mt-6 grid gap-3">
              {template.sensations.map((sensation) => (
                <p key={sensation} className="rounded-2xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-slate-300">
                  {sensation}
                </p>
              ))}
            </div>
          </div>
          <div className="glass-card">
            <h2 className="text-2xl font-semibold text-white">購入前プロトコル</h2>
            <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
              <p>1. 願望適合スキャンで、憧れと現実復帰耐性を確認します。</p>
              <p>2. 記憶内の役割、成功度、失敗度、恋愛要素、危険度を調整します。</p>
              <p>3. 境界タグを付与し、体験後に「これは購入した記憶である」と認識できる状態を保ちます。</p>
              <p>4. 高リスクテンプレートでは、体験直後に認知安定セッションを行います。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="Recommended Plans" title="このテンプレートに近い記憶商品。" />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {relatedPlans.slice(0, 3).map((plan) => (
            <article key={plan.title} className="plan-card">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-magentapulse">{plan.category}</p>
              <h3 className="text-xl font-semibold text-white">{plan.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{plan.description}</p>
              <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <Info label="体験時間" value={plan.duration} />
                <Info label="記憶内期間" value={plan.memorySpan} />
              </dl>
            </article>
          ))}
        </div>
      </section>

      <FinalCta />
      <Footer items={catalogNavItems} />
    </main>
  );
}

