import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const root = process.cwd();
const dataPath = path.join(root, "src", "data", "index.ts");
const pagesDir = path.join(root, "src", "pages");
const outDir = path.join(root, "docs", "rag");
const baseUrl = "https://novamnesis-laboratories.vercel.app";
const generatedAt = new Date().toISOString();

const staticRoutes = [
  { path: "/", title: "Landing" },
  { path: "/catalog", title: "Catalog" },
  { path: "/experience", title: "Experience" },
  { path: "/booking", title: "Booking" },
  { path: "/facility", title: "Facility" },
  { path: "/sell", title: "Sell Memory" },
  { path: "/safety", title: "Safety" },
  { path: "/faq", title: "FAQ" },
  { path: "/about", title: "About" },
  { path: "/contact", title: "Contact" },
];

function normalizeText(value) {
  return String(value)
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function routeUrl(routePath) {
  return `${baseUrl}${routePath === "/" ? "" : routePath}`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function flattenValue(value, label = "") {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => flattenValue(item, label ? `${label} ${index + 1}` : ""));
  }
  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, nested]) => flattenValue(nested, key));
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const text = normalizeText(value);
    if (!text) return [];
    return [label ? `${label}: ${text}` : text];
  }
  return [];
}

async function loadDataModule() {
  const source = await fs.readFile(dataPath, "utf8");
  const withoutImports = source.replace(/^import\s+.*?;\s*/gms, "");
  const transpiled = ts.transpileModule(withoutImports, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      skipLibCheck: true,
    },
  }).outputText;

  const sandbox = {
    exports: {},
    module: { exports: {} },
    require: () => ({}),
  };
  sandbox.module.exports = sandbox.exports;
  vm.runInNewContext(transpiled, sandbox, { filename: dataPath });
  return sandbox.module.exports;
}

function createRecord({ id, title, url, content, kind, sourcePath, metadata = {} }) {
  return {
    id,
    title: normalizeText(title),
    url,
    source_path: sourcePath,
    kind,
    content: normalizeText(content),
    metadata: {
      generated_at: generatedAt,
      ...metadata,
    },
  };
}

function chunkRecord(record, maxChars = 1200, overlap = 160) {
  if (record.content.length <= maxChars) {
    return [{ ...record, chunk_id: `${record.id}#000`, chunk_index: 0 }];
  }

  const chunks = [];
  let start = 0;
  let index = 0;
  while (start < record.content.length) {
    let end = Math.min(start + maxChars, record.content.length);
    if (end < record.content.length) {
      const boundary = Math.max(
        record.content.lastIndexOf("\n\n", end),
        record.content.lastIndexOf("\n", end),
        record.content.lastIndexOf("。", end),
      );
      if (boundary > start + maxChars * 0.55) end = boundary + 1;
    }
    chunks.push({
      ...record,
      id: record.id,
      chunk_id: `${record.id}#${String(index).padStart(3, "0")}`,
      chunk_index: index,
      content: normalizeText(record.content.slice(start, end)),
    });
    if (end >= record.content.length) break;
    start = Math.max(0, end - overlap);
    index += 1;
  }
  return chunks;
}

function dataRecords(data) {
  const records = [];

  const collectionSpecs = [
    ["sessionSteps", "session-step", "/experience"],
    ["roomZones", "facility-zone", "/facility"],
    ["bodyStates", "body-state", "/experience"],
    ["experienceEntryOptions", "experience-entry-option", "/experience"],
    ["intakeChecks", "intake-check", "/booking"],
    ["bookingSteps", "booking-step", "/booking"],
    ["plans", "plan", "/catalog"],
    ["purchaseUseCases", "purchase-use-case", "/"],
    ["experienceMenus", "experience-template", "/catalog"],
    ["memoryEpisodes", "memory-episode", "/catalog"],
    ["valuation", "valuation-factor", "/sell"],
    ["categories", "purchase-category", "/sell"],
    ["sellSteps", "sell-step", "/sell"],
    ["safetyItems", "safety-item", "/safety"],
    ["ethics", "ethics-policy", "/safety"],
    ["reviews", "review", "/"],
    ["faqs", "faq", "/faq"],
    ["faqsSell", "sell-faq", "/faq"],
  ];

  for (const [key, kind, routePath] of collectionSpecs) {
    const items = data[key];
    if (!Array.isArray(items)) continue;
    items.forEach((item, index) => {
      const title =
        typeof item === "object" && item
          ? item.title || item.question || item.label || item.memory || `${key} ${index + 1}`
          : `${key} ${index + 1}`;
      const slug =
        typeof item === "object" && item && item.slug
          ? item.slug
          : `${slugify(key)}-${String(index + 1).padStart(2, "0")}`;
      const itemPath =
        kind === "experience-template"
          ? `/template/${item.slug}`
          : kind === "memory-episode"
            ? `/episode/${item.slug}`
            : routePath;

      records.push(
        createRecord({
          id: `${kind}:${slug}`,
          title,
          url: routeUrl(itemPath),
          kind,
          sourcePath: "src/data/index.ts",
          content: flattenValue(item).join("\n"),
          metadata: { collection: key, index },
        }),
      );
    });
  }

  return records.filter((record) => record.content);
}

function visibleStringFromNode(node, sourceFile) {
  if (ts.isJsxText(node)) return node.getText(sourceFile);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    const parent = node.parent;
    if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent)) return "";
    if (ts.isJsxAttribute(parent)) {
      const ignored = new Set(["className", "href", "src", "alt", "id", "type", "name", "value"]);
      if (ignored.has(parent.name.getText(sourceFile))) return "";
    }
    if (ts.isPropertyAssignment(parent)) {
      const ignored = new Set(["className", "href", "src", "alt", "id", "type", "name", "value"]);
      if (ignored.has(parent.name.getText(sourceFile))) return "";
    }
    return node.text;
  }
  return "";
}

async function pageRecords() {
  const files = (await fs.readdir(pagesDir)).filter((file) => file.endsWith(".tsx"));
  const routeMap = new Map([
    ["LandingPage.tsx", "/"],
    ["CatalogPage.tsx", "/catalog"],
    ["ExperienceStartPage.tsx", "/experience"],
    ["BookingPage.tsx", "/booking"],
    ["FacilityPage.tsx", "/facility"],
    ["SellPage.tsx", "/sell"],
    ["SafetyPage.tsx", "/safety"],
    ["FaqPage.tsx", "/faq"],
    ["AboutPage.tsx", "/about"],
    ["ContactPage.tsx", "/contact"],
    ["TemplateDetailPage.tsx", "/template/:slug"],
    ["EpisodeDetailPage.tsx", "/episode/:slug"],
  ]);

  const records = [];
  for (const file of files) {
    const fullPath = path.join(pagesDir, file);
    const source = await fs.readFile(fullPath, "utf8");
    const sourceFile = ts.createSourceFile(fullPath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const strings = [];

    function visit(node) {
      const text = normalizeText(visibleStringFromNode(node, sourceFile));
      if (text && text.length > 1 && !/^[{}()[\],.:;|/\\-]+$/.test(text)) {
        strings.push(text);
      }
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);

    const unique = [...new Set(strings)];
    if (!unique.length) continue;
    const routePath = routeMap.get(file) || `/${file.replace(/Page\.tsx$/, "").toLowerCase()}`;
    records.push(
      createRecord({
        id: `page:${slugify(file.replace(/\.tsx$/, ""))}`,
        title: file.replace(/\.tsx$/, ""),
        url: routeUrl(routePath),
        kind: "page-source-text",
        sourcePath: `src/pages/${file}`,
        content: unique.join("\n"),
        metadata: { route_path: routePath },
      }),
    );
  }
  return records;
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const data = await loadDataModule();
  const records = [...dataRecords(data), ...(await pageRecords())];
  const chunks = records.flatMap((record) => chunkRecord(record));

  await fs.writeFile(path.join(outDir, "documents.json"), JSON.stringify(records, null, 2), "utf8");
  await fs.writeFile(path.join(outDir, "knowledge.jsonl"), chunks.map((chunk) => JSON.stringify(chunk)).join("\n") + "\n", "utf8");
  await fs.writeFile(
    path.join(outDir, "manifest.json"),
    JSON.stringify(
      {
        generated_at: generatedAt,
        base_url: baseUrl,
        source: "local React/Vite source",
        document_count: records.length,
        chunk_count: chunks.length,
        routes: staticRoutes.map((route) => ({ ...route, url: routeUrl(route.path) })),
        outputs: ["documents.json", "knowledge.jsonl"],
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Generated ${records.length} documents and ${chunks.length} chunks in ${path.relative(root, outDir)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
