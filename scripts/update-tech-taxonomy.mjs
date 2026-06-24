import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputPath = path.join(root, "docs", "talent", "tech-taxonomy.json");

const sources = {
  linguist:
    "https://raw.githubusercontent.com/github-linguist/linguist/main/lib/linguist/languages.yml",
  devicon: "https://raw.githubusercontent.com/devicons/devicon/master/devicon.json",
};

const manualEntries = [
  { name: "C", category: "language", aliases: ["c", "c言語"] },
  { name: "C++", category: "language", aliases: ["c++", "cpp", "cプラスプラス"] },
  { name: "C#", category: "language", aliases: ["c#", "csharp", "シーシャープ"] },
  { name: "React", category: "frontend", aliases: ["react", "reactjs", "リアクト"] },
  { name: "TypeScript", category: "language", aliases: ["typescript", "ts"] },
  { name: "JavaScript", category: "language", aliases: ["javascript", "js"] },
  { name: "Node.js", category: "backend", aliases: ["node.js", "nodejs", "node"] },
  { name: "MATLAB / Simulink", category: "control", aliases: ["matlab", "simulink", "シミュリンク"] },
  { name: "PLC", category: "control", aliases: ["plc", "シーケンサ", "シーケンス制御"] },
  { name: "RTOS", category: "embedded", aliases: ["rtos", "リアルタイムos"] },
  { name: "CAN", category: "embedded", aliases: ["can", "can通信"] },
  { name: "ROS", category: "robotics", aliases: ["ros", "ros2"] },
  { name: "AUTOSAR", category: "embedded", aliases: ["autosar", "オートザー"] },
  { name: "Qt", category: "framework", aliases: ["qt", "キュート"] },
];

function stripYamlValue(value) {
  return String(value || "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

function parseLinguistLanguages(raw) {
  const languages = [];
  let current = null;
  let aliasesOpen = false;

  function flush() {
    if (current?.name && current.type === "programming") {
      languages.push({
        name: current.name,
        category: "language",
        aliases: [...new Set([current.name, ...current.aliases])],
        source: "github-linguist",
      });
    }
  }

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const topLevel = line.match(/^("?[^"\s][^:]*"?):\s*$/);
    if (topLevel) {
      flush();
      current = {
        name: stripYamlValue(topLevel[1]),
        type: "",
        aliases: [],
      };
      aliasesOpen = false;
      continue;
    }

    if (!current) continue;

    const type = line.match(/^\s+type:\s*(.+)$/);
    if (type) {
      current.type = stripYamlValue(type[1]);
      aliasesOpen = false;
      continue;
    }

    if (/^\s+aliases:\s*$/.test(line)) {
      aliasesOpen = true;
      continue;
    }

    if (aliasesOpen) {
      const alias = line.match(/^\s+-\s*(.+)$/);
      if (alias) {
        current.aliases.push(stripYamlValue(alias[1]));
        continue;
      }
      aliasesOpen = false;
    }
  }

  flush();
  return languages;
}

function normalizeDeviconName(name) {
  return String(name || "")
    .trim()
    .replace(/^amazonwebservices$/i, "AWS")
    .replace(/^cplusplus$/i, "C++")
    .replace(/^csharp$/i, "C#")
    .replace(/^nodejs$/i, "Node.js")
    .replace(/^react$/i, "React")
    .replace(/^typescript$/i, "TypeScript")
    .replace(/^javascript$/i, "JavaScript");
}

function parseDeviconItems(raw) {
  let records;
  try {
    records = JSON.parse(raw);
  } catch {
    return [];
  }

  return (Array.isArray(records) ? records : [])
    .map((item) => {
      const name = normalizeDeviconName(item.name);
      const aliases = [
        name,
        item.name,
        ...(Array.isArray(item.altnames) ? item.altnames : []),
        ...(Array.isArray(item.aliases) ? item.aliases : []),
      ]
        .map((value) => String(value || "").trim())
        .filter(Boolean);

      return {
        name,
        category: "technology",
        aliases: [...new Set(aliases)],
        source: "devicon",
      };
    })
    .filter((item) => item.name);
}

function mergeEntries(groups) {
  const merged = new Map();
  for (const item of groups.flat()) {
    const key = item.name.toLowerCase();
    const current = merged.get(key) || {
      name: item.name,
      category: item.category || "technology",
      aliases: [],
      sources: [],
    };

    current.aliases.push(...(item.aliases || []));
    current.sources.push(item.source || "manual");
    if (current.category === "technology" && item.category && item.category !== "technology") {
      current.category = item.category;
    }
    merged.set(key, current);
  }

  return [...merged.values()]
    .map((item) => ({
      ...item,
      aliases: [...new Set(item.aliases.map((alias) => String(alias).trim()).filter(Boolean))],
      sources: [...new Set(item.sources)],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.text();
}

async function main() {
  const [linguistRaw, deviconRaw] = await Promise.all([
    fetchText(sources.linguist),
    fetchText(sources.devicon),
  ]);

  const skills = mergeEntries([
    parseLinguistLanguages(linguistRaw),
    parseDeviconItems(deviconRaw),
    manualEntries.map((item) => ({ ...item, source: "manual-override" })),
  ]);

  const output = {
    generatedAt: new Date().toISOString(),
    sources,
    note:
      "Generated taxonomy for Talent Intake Lab. Review aliases before production use, especially short tokens.",
    skills,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    JSON.stringify(
      {
        output: outputPath,
        skills: skills.length,
        linguist: parseLinguistLanguages(linguistRaw).length,
        devicon: parseDeviconItems(deviconRaw).length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
