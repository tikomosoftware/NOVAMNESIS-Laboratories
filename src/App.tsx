import React from "react";
import { experienceMenus, memoryEpisodes } from "./data";
import CompanyPage from "./pages/CompanyPage";
import FacilityPage from "./pages/FacilityPage";
import ExperienceStartPage from "./pages/ExperienceStartPage";
import BookingPage from "./pages/BookingPage";
import LandingPage from "./pages/LandingPage";
import CatalogPage from "./pages/CatalogPage";
import TemplateDetailPage from "./pages/TemplateDetailPage";
import EpisodeDetailPage from "./pages/EpisodeDetailPage";
import SellPage from "./pages/SellPage";
import SafetyPage from "./pages/SafetyPage";
import FaqPage from "./pages/FaqPage";

export default function App() {
  const path = window.location.pathname;

  if (path.startsWith("/template/")) {
    const slug = decodeURIComponent(path.replace("/template/", ""));
    const template = experienceMenus.find((item) => item.slug === slug);
    return template ? <TemplateDetailPage template={template} /> : <CatalogPage />;
  }

  if (path.startsWith("/episode/")) {
    const slug = decodeURIComponent(path.replace("/episode/", ""));
    const episode = memoryEpisodes.find((item) => item.slug === slug);
    return episode ? <EpisodeDetailPage episode={episode} /> : <CatalogPage />;
  }

  if (path === "/catalog") {
    return <CatalogPage />;
  }

  if (path === "/") {
    return <LandingPage />;
  }

  if (path === "/company") {
    return <CompanyPage />;
  }

  if (path === "/sell") {
    return <SellPage />;
  }

  if (path === "/safety") {
    return <SafetyPage />;
  }

  if (path === "/faq") {
    return <FaqPage />;
  }

  if (path === "/facility") {
    return <FacilityPage />;
  }

  if (path === "/experience") {
    return <ExperienceStartPage />;
  }

  if (path === "/booking") {
    return <BookingPage />;
  }

  return <CompanyPage />;
}
