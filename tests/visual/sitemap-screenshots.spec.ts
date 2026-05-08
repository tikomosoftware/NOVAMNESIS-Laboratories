import { mkdir } from "node:fs/promises";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { experienceMenus, memoryEpisodes, siteNavItems } from "../../src/data";

type SitemapEntry = {
  name: string;
  path: string;
};

const staticRoutes: SitemapEntry[] = [
  { name: "home", path: "/" },
  ...siteNavItems.map((item) => ({
    name: item.href === "/" ? "home" : item.href.replace(/^\//, "").replace(/\//g, "-"),
    path: item.href,
  })),
  { name: "campaign-memory-buyback", path: "/campaign/memory-buyback" },
];

const dynamicRoutes: SitemapEntry[] = [
  ...experienceMenus.map((item) => ({
    name: `template-${item.slug}`,
    path: `/template/${encodeURIComponent(item.slug)}`,
  })),
  ...memoryEpisodes.map((item) => ({
    name: `episode-${item.slug}`,
    path: `/episode/${encodeURIComponent(item.slug)}`,
  })),
];

const sitemap = uniqueByPath([...staticRoutes, ...dynamicRoutes]);

for (const route of sitemap) {
  test(`capture ${route.name}`, async ({ page }, testInfo) => {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await expect(page.locator("#root")).toBeVisible();

    const folder = path.join(process.cwd(), "visual-snapshots", testInfo.project.name);
    await mkdir(folder, { recursive: true });
    await page.screenshot({
      path: path.join(folder, `${route.name}.png`),
      fullPage: true,
      animations: "disabled",
    });
  });
}

function uniqueByPath(entries: SitemapEntry[]) {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.path)) {
      return false;
    }
    seen.add(entry.path);
    return true;
  });
}
