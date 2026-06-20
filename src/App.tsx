import React from "react";
import { experienceMenus, memoryEpisodes } from "./data";
import FacilityPage from "./pages/FacilityPage";
import ExperienceStartPage from "./pages/ExperienceStartPage";
import BookingPage from "./pages/BookingPage";
import LandingPage from "./pages/LandingPage";
import CatalogPage from "./pages/CatalogPage";
import TemplateDetailPage from "./pages/TemplateDetailPage";
import EpisodeDetailPage from "./pages/EpisodeDetailPage";
import SellPage from "./pages/SellPage";
import SafetyPage from "./pages/SafetyPage";
import ResearchPage from "./pages/ResearchPage";
import FaqPage from "./pages/FaqPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import MemoryBuybackCampaignPage from "./pages/MemoryBuybackCampaignPage";
import ChatLabPage from "./pages/ChatLabPage";
import FloatingChatWidget from "./components/FloatingChatWidget";
import { I18nProvider } from "./i18n";

export default function App() {
  const path = window.location.pathname;
  const withChat = (page: React.ReactNode) => (
    <I18nProvider>
      {page}
      <FloatingChatWidget />
    </I18nProvider>
  );

  if (path === "/chat-lab") {
    return (
      <I18nProvider>
        <ChatLabPage />
      </I18nProvider>
    );
  }

  if (path.startsWith("/template/")) {
    const slug = decodeURIComponent(path.replace("/template/", ""));
    const template = experienceMenus.find((item) => item.slug === slug);
    return withChat(template ? <TemplateDetailPage template={template} /> : <CatalogPage />);
  }

  if (path.startsWith("/episode/")) {
    const slug = decodeURIComponent(path.replace("/episode/", ""));
    const episode = memoryEpisodes.find((item) => item.slug === slug);
    return withChat(episode ? <EpisodeDetailPage episode={episode} /> : <CatalogPage />);
  }

  if (path === "/catalog") {
    return withChat(<CatalogPage />);
  }

  if (path === "/") {
    return withChat(<LandingPage />);
  }

  if (path === "/sell") {
    return withChat(<SellPage />);
  }

  if (path === "/campaign/memory-buyback") {
    return withChat(<MemoryBuybackCampaignPage />);
  }

  if (path === "/safety") {
    return withChat(<SafetyPage />);
  }

  if (path === "/research") {
    return withChat(<ResearchPage />);
  }

  if (path === "/faq") {
    return withChat(<FaqPage />);
  }

  if (path === "/facility") {
    return withChat(<FacilityPage />);
  }

  if (path === "/experience") {
    return withChat(<ExperienceStartPage />);
  }

  if (path === "/booking") {
    return withChat(<BookingPage />);
  }

  if (path === "/about") {
    return withChat(<AboutPage />);
  }

  if (path === "/contact") {
    return withChat(<ContactPage />);
  }

  return withChat(<LandingPage />);
}
