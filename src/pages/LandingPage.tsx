import React, { useState } from "react";
import { ExperienceTemplate, MemoryEpisode, Tone } from "../types";
import { experienceEntryOptions, experienceMenus, memoryEpisodes, companyNavItems, sellNavItems, facilityNavItems, landingNavItems, catalogNavItems, bookingSteps, plans, categories, valuation, sellSteps, safetyItems, ethics, roomZones, sessionSteps, bodyStates, purchaseUseCases } from "../data";
import { Header, Footer, LogoMark, BrandLockup, Button, SectionHeader, Info, Hero, Problem, PurchaseUseCases, Service, FacilityTeaser, Marketplace, CatalogTeaser, Reviews, FAQ, FinalCta, CatalogHero, MemoryEpisodes, Plans, CardGrid } from "../components/SharedComponents";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={landingNavItems} cta="カタログを見る" ctaHref="/catalog" />
      <Hero />
      <Problem />
      <PurchaseUseCases />
      <Service />
      <FacilityTeaser />
      <Marketplace />
      <CatalogTeaser />
      <Reviews />
      <FAQ />
      <FinalCta />
      <Footer items={landingNavItems} />
    </main>
  );
}

