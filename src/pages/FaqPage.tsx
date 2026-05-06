import React from "react";
import { landingNavItems } from "../data";
import { Header, Footer, FAQ } from "../components/SharedComponents";

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100 pt-36">
      <Header items={landingNavItems} />
      <FAQ />
      <Footer items={landingNavItems} />
    </main>
  );
}
