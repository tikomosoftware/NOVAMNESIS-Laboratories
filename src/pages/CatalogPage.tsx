import React, { useState } from "react";
import { ExperienceTemplate, MemoryEpisode, Tone } from "../types";
import { experienceEntryOptions, experienceMenus, memoryEpisodes, companyNavItems, sellNavItems, facilityNavItems, landingNavItems, catalogNavItems, bookingSteps, plans, categories, valuation, sellSteps, safetyItems, ethics, roomZones, sessionSteps, bodyStates, purchaseUseCases } from "../data";
import { Header, Footer, LogoMark, BrandLockup, Button, SectionHeader, Info, Hero, Problem, PurchaseUseCases, Service, FacilityTeaser, Marketplace, CatalogTeaser, Reviews, FAQ, FinalCta, CatalogHero, MemoryEpisodes, Plans, CardGrid } from "../components/SharedComponents";

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={catalogNavItems} />
      <CatalogHero />
      <MemoryEpisodes />
      <Plans />
      <section id="categories">
        <CardGrid eyebrow="Purchase Categories" title="人生メニューのカテゴリ。" items={categories} />
      </section>

      <Footer items={catalogNavItems} />
    </main>
  );
}

