import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";
import { loadLocalEnv } from "./load-env.js";
import { createLocalEmbedding, LOCAL_EMBEDDING_MODEL } from "./local-embedding.js";

loadLocalEnv();

const DEFAULT_TOP_K = 5;
const DEFAULT_EMBEDDING_DIMENSIONS = 1536;
const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";
const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 2400;
const REQUEST_TIMEOUT = Number(process.env.REQUEST_TIMEOUT || 30000);

const memoryProfiles = new Map();
let pool = null;
let schemaReady = false;

function isDemoReadOnly() {
  return process.env.TALENT_DEMO_READONLY === "true" || process.env.TALENT_DEMO_READONLY === "1";
}

const roleCatalog = [
  { label: "フロントエンドエンジニア", aliases: ["フロントエンド", "frontend", "front-end"] },
  { label: "バックエンドエンジニア", aliases: ["バックエンド", "backend", "back-end", "サーバーサイド"] },
  { label: "フルスタックエンジニア", aliases: ["フルスタック", "full stack", "fullstack"] },
  { label: "PM", aliases: ["pm", "プロジェクトマネージャ", "プロマネ", "project manager"] },
  { label: "PdM", aliases: ["pdm", "プロダクトマネージャ", "product manager"] },
  { label: "テックリード", aliases: ["テックリード", "tech lead", "リードエンジニア"] },
  { label: "SRE / DevOps", aliases: ["sre", "devops", "インフラ", "クラウド基盤"] },
  { label: "データエンジニア", aliases: ["データエンジニア", "data engineer"] },
  { label: "機械学習エンジニア", aliases: ["機械学習", "ml engineer", "aiエンジニア"] },
  { label: "組み込み / 制御系エンジニア", aliases: ["組み込み", "組込", "制御系", "制御ソフト", "embedded", "firmware"] },
  { label: "デザイナー", aliases: ["デザイナー", "uiデザイナー", "uxデザイナー", "designer"] },
  { label: "QA", aliases: ["qa", "テスター", "品質保証"] },
  { label: "営業", aliases: ["営業", "セールス", "sales"] },
  { label: "人事", aliases: ["人事", "採用", "hr"] },
];

const skillCatalog = [
  { name: "React", aliases: ["react", "リアクト"], category: "frontend" },
  { name: "TypeScript", aliases: ["typescript", "ts"], category: "language" },
  { name: "JavaScript", aliases: ["javascript", "js"], category: "language" },
  { name: "C", aliases: ["c", "c言語"], category: "language" },
  { name: "C++", aliases: ["c++", "cpp", "cプラスプラス"], category: "language" },
  { name: "Next.js", aliases: ["next.js", "nextjs", "next"], category: "frontend" },
  { name: "Vue", aliases: ["vue", "vue.js", "nuxt"], category: "frontend" },
  { name: "Node.js", aliases: ["node.js", "nodejs", "node"], category: "backend" },
  { name: "Python", aliases: ["python"], category: "language" },
  { name: "Java", aliases: ["java"], category: "language" },
  { name: "Go", aliases: ["golang", "go言語"], category: "language" },
  { name: "PHP", aliases: ["php", "laravel"], category: "language" },
  { name: "Ruby", aliases: ["ruby", "rails"], category: "language" },
  { name: "C#", aliases: ["c#", "dotnet", ".net"], category: "language" },
  { name: "MATLAB / Simulink", aliases: ["matlab", "simulink", "シミュリンク"], category: "control" },
  { name: "PLC", aliases: ["plc", "シーケンサ", "シーケンス制御"], category: "control" },
  { name: "RTOS", aliases: ["rtos", "リアルタイムos"], category: "embedded" },
  { name: "CAN", aliases: ["can", "can通信"], category: "embedded" },
  { name: "ROS", aliases: ["ros", "ros2"], category: "robotics" },
  { name: "SQL", aliases: ["sql"], category: "database" },
  { name: "MySQL", aliases: ["mysql"], category: "database" },
  { name: "PostgreSQL", aliases: ["postgresql", "postgres"], category: "database" },
  { name: "TiDB", aliases: ["tidb"], category: "database" },
  { name: "AWS", aliases: ["aws", "lambda", "ecs", "s3", "cloudfront"], category: "cloud" },
  { name: "Azure", aliases: ["azure"], category: "cloud" },
  { name: "GCP", aliases: ["gcp", "google cloud"], category: "cloud" },
  { name: "Docker", aliases: ["docker"], category: "infra" },
  { name: "Kubernetes", aliases: ["kubernetes", "k8s"], category: "infra" },
  { name: "Terraform", aliases: ["terraform"], category: "infra" },
  { name: "GitHub Actions", aliases: ["github actions", "github action", "ci/cd", "cicd"], category: "devops" },
  { name: "Figma", aliases: ["figma"], category: "design" },
  { name: "Salesforce", aliases: ["salesforce"], category: "business" },
  { name: "Tableau", aliases: ["tableau"], category: "analytics" },
  { name: "Power BI", aliases: ["power bi", "powerbi"], category: "analytics" },
];

const domainCatalog = [
  { label: "SaaS", aliases: ["saas", "サース"] },
  { label: "EC", aliases: ["ec", "eコマース", "通販"] },
  { label: "金融", aliases: ["金融", "fintech", "決済", "銀行", "保険"] },
  { label: "人材 / HR", aliases: ["人材", "採用", "hr", "転職"] },
  { label: "医療 / ヘルスケア", aliases: ["医療", "ヘルスケア", "healthcare"] },
  { label: "教育", aliases: ["教育", "edtech"] },
  { label: "物流", aliases: ["物流", "配送", "ロジスティクス"] },
  { label: "製造", aliases: ["製造", "工場", "manufacturing"] },
  { label: "組み込み / 制御", aliases: ["組み込み", "組込", "制御系", "制御ソフト", "ファームウェア", "embedded", "firmware"] },
  { label: "自動車 / 車載", aliases: ["自動車", "車載", "automotive", "ecu", "can通信"] },
  { label: "ロボティクス", aliases: ["ロボット", "ロボティクス", "robotics", "ros", "ros2"] },
  { label: "メディア", aliases: ["メディア", "広告", "コンテンツ"] },
  { label: "ゲーム", aliases: ["ゲーム", "game"] },
  { label: "公共", aliases: ["公共", "自治体", "官公庁"] },
];

function normalizeAliasList(values) {
  return unique((Array.isArray(values) ? values : []).map((value) => String(value || "").trim()).filter(Boolean));
}

function applyExternalTechTaxonomy() {
  const filePath = path.join(process.cwd(), "docs", "talent", "tech-taxonomy.json");
  if (!fs.existsSync(filePath)) return;

  try {
    const taxonomy = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const existingSkills = new Set(skillCatalog.map((skill) => skill.name.toLowerCase()));
    for (const item of taxonomy.skills || []) {
      const name = String(item?.name || "").trim();
      if (!name || existingSkills.has(name.toLowerCase())) continue;

      skillCatalog.push({
        name,
        aliases: normalizeAliasList([name, ...(item.aliases || [])]),
        category: String(item.category || "technology"),
      });
      existingSkills.add(name.toLowerCase());
    }
  } catch (error) {
    console.warn(`Failed to load tech taxonomy: ${error instanceof Error ? error.message : error}`);
  }
}

applyExternalTechTaxonomy();

const questionPlan = {
  role: "まず、今の主な役割や職種を教えてください。肩書きが曖昧でも、普段どんな責任を持っているかで大丈夫です。",
  skills: "実務で使ってきた技術、ツール、業務スキルを思い出せる範囲で教えてください。年数が分かるものは年数も添えてください。",
  years: "主なスキルについて、だいたい何年くらい使っているかを教えてください。正確でなくても「2年くらい」で十分です。",
  projects: "一番説明しやすい案件やプロジェクトを1つ教えてください。担当範囲、使った技術、成果があると検索に強くなります。",
  preferences: "次に入りたい案件の条件や、避けたい働き方を教えてください。リモート、稼働率、業界、チーム体制など何でも大丈夫です。",
  strengths: "周囲から評価されやすい進め方や、得意な役割を教えてください。たとえば設計、改善、調整、育成、顧客折衝などです。",
  confirm: "保存候補はかなり形になっています。修正したい表現、追加したい実績、本人確認済みにしたい項目があれば教えてください。",
};

const extractionProviders = new Set(["auto", "local", "groq", "openai"]);
const factTypes = new Set(["role", "skill", "domain", "project", "preference", "constraint", "strength"]);

const demoTalentProfiles = [
  {
    profileUid: "demo-se-frontend-aoki",
    displayName: "青木 遥",
    text: "名前は青木遥です。フロントエンドエンジニアとしてReactとTypeScriptを4年使っています。人材系SaaSの管理画面刷新プロジェクトで設計、実装、レビューを担当しました。顧客折衝にも参加し、要件を整理してUI改善まで進めるのが得意です。リモート中心で、少人数チームのフロントエンドリード案件を希望しています。",
  },
  {
    profileUid: "demo-se-backend-sato",
    displayName: "佐藤 健",
    text: "名前は佐藤健です。バックエンドエンジニアです。Java、Node.js、SQL、MySQL、AWSを5年ほど使っています。金融系の決済API開発案件で、外部サービス連携、バッチ処理、障害対応、運用改善を担当しました。設計レビューと堅めの業務システム開発が得意です。フルリモートよりは週1出社くらいまでなら対応できます。",
  },
  {
    profileUid: "demo-se-sre-nakamura",
    displayName: "中村 亮",
    text: "名前は中村亮です。SREとDevOps寄りのエンジニアです。AWS、Docker、Kubernetes、Terraform、GitHub Actionsを実務で4年使っています。SaaS基盤のクラウド移行プロジェクトで、CI/CD整備、監視設計、コスト削減、障害対応フローの改善を担当しました。属人化した運用を整理するのが得意です。オンコールが重すぎる案件は避けたいです。",
  },
  {
    profileUid: "demo-se-data-mori",
    displayName: "森 彩花",
    text: "名前は森彩花です。データエンジニアです。Python、SQL、GCP、Tableau、Power BIを3年ほど使っています。ECサービスの分析基盤構築プロジェクトで、データマート設計、ETL改善、ダッシュボード作成、事業部との要件整理を担当しました。数字を業務改善につなげる説明が得意です。分析基盤やBI改善の案件を希望しています。",
  },
  {
    profileUid: "demo-se-fullstack-tanaka",
    displayName: "田中 航",
    text: "名前は田中航です。フルスタックエンジニア兼テックリードです。React、TypeScript、Node.js、PostgreSQL、TiDBを5年ほど使っています。B2B SaaSの新規プロダクト開発で、認証、管理画面、API、DB設計、若手メンバーのレビューを担当しました。仕様が曖昧な段階から形にするのが得意です。技術選定から入れる案件を希望しています。",
  },
  {
    profileUid: "demo-se-embedded-kondo",
    displayName: "近藤 真",
    text: "名前は近藤真です。組み込み / 制御系エンジニアです。C、C++、RTOS、CAN通信を6年ほど使っています。車載ECUの制御ソフト開発で、ファームウェア改善、性能評価、不具合解析を担当しました。仕様書を読み解いて安全側に設計を詰めるのが得意です。車載やロボティクス寄りの案件を希望しています。",
  },
  {
    profileUid: "demo-se-pm-yamada",
    displayName: "山田 美咲",
    text: "名前は山田美咲です。PMとして人材系SaaSと業務システム開発をリードしました。要件整理、顧客折衝、スケジュール調整、受け入れテスト設計を5年ほど担当しています。エンジニアとビジネス側の間に入って仕様を整理するのが得意です。リモート中心で、上流から関われる案件を希望しています。",
  },
  {
    profileUid: "demo-se-qa-ishikawa",
    displayName: "石川 直人",
    text: "名前は石川直人です。QAエンジニアです。Webサービスとモバイルアプリのテスト設計、自動テスト、Playwright、GitHub Actionsを4年ほど使っています。ECサービスのリグレッションテスト自動化と品質改善プロジェクトを担当しました。開発チームと一緒に品質基準を作るのが得意です。",
  },
  {
    profileUid: "demo-se-ml-fujii",
    displayName: "藤井 莉子",
    text: "名前は藤井莉子です。機械学習エンジニアです。Python、SQL、機械学習、データ前処理、モデル評価を3年ほど担当しています。需要予測とレコメンド改善のプロジェクトで、特徴量設計、評価指標の整理、推論バッチの改善を行いました。事業側にモデルの限界を説明しながら改善するのが得意です。",
  },
  {
    profileUid: "demo-se-designer-ogawa",
    displayName: "小川 由衣",
    text: "名前は小川由衣です。UI/UXデザイナーです。Figmaを使った管理画面、SaaS、業務アプリの情報設計とプロトタイピングを5年ほど担当しています。ユーザーインタビュー、導線整理、デザインシステム整備が得意です。エンジニアと近い距離でUI改善を進める案件を希望しています。",
  },
];

function normalizeExtractionProvider(provider) {
  return extractionProviders.has(provider) ? provider : "local";
}

function configuredProvider(provider) {
  if (provider === "local") return null;
  if (provider === "groq") return process.env.GROQ_API_KEY ? "groq" : null;
  if (provider === "openai") return process.env.OPENAI_API_KEY ? "openai" : null;
  if (process.env.GROQ_API_KEY) return "groq";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

function sanitizeProviderError(error) {
  return String(error || "")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer [redacted]")
    .replace(/api[_-]?key\s*[:=]\s*[A-Za-z0-9._-]+/gi, "api_key=[redacted]")
    .replace(/organization `[^`]+`/gi, "organization `[redacted]`")
    .replace(/org_[A-Za-z0-9_-]+/g, "[redacted]");
}

function clampText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function safeConfidence(value, fallback = 0.65) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(1, number));
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function messagesForPrompt(messages) {
  return messages
    .map((message) => `${message.role === "assistant" ? "assistant" : "user"}: ${message.content}`)
    .join("\n\n");
}

function llmExtractionPrompt(messages, localDraft) {
  return [
    "あなたは人材プロフィール登録のための聞き取りアシスタントです。",
    "会話ログから、DBに保存できる人材プロフィールdraftをJSONだけで返してください。",
    "本人が明言していない情報は断定しないでください。推定した場合はconfidenceを0.65以下にしてください。",
    "各factには、必ず根拠になる本人発話をevidenceTextとして入れてください。根拠が薄い項目は入れないでください。",
    "未知の職種、業界、技術、業務スキルも抽出して構いません。固定の技術リストに寄せる必要はありません。",
    "不足している項目があれば missingFields に role, skills, years, projects, preferences, strengths のいずれかを入れ、nextQuestionで自然な追加質問を1つだけ返してください。",
    "JSONスキーマ:",
    JSON.stringify(
      {
        displayName: "string",
        headline: "string",
        narrative: "string",
        roles: [{ label: "string", evidenceText: "string", confidence: 0.0 }],
        skills: [{ name: "string", category: "string", years: 0, level: "basic|working|advanced|mentioned", evidenceText: "string", confidence: 0.0 }],
        domains: [{ label: "string", evidenceText: "string", confidence: 0.0 }],
        projects: [{ label: "string", summary: "string", evidenceText: "string", confidence: 0.0 }],
        preferences: [{ label: "preference|constraint", value: "string", evidenceText: "string", confidence: 0.0 }],
        strengths: [{ label: "string", evidenceText: "string", confidence: 0.0 }],
        missingFields: ["role"],
        nextQuestion: "string",
      },
      null,
      2,
    ),
    "",
    "ローカル抽出の参考結果:",
    JSON.stringify(
      {
        headline: localDraft.headline,
        narrative: localDraft.narrative,
        structuredFacts: localDraft.structuredFacts,
        missingFields: localDraft.missingFields,
      },
      null,
      2,
    ),
    "",
    "会話ログ:",
    messagesForPrompt(messages),
  ].join("\n");
}

function parseJsonFromText(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("LLM returned empty content.");

  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("LLM response did not contain JSON.");
    return JSON.parse(match[0]);
  }
}

async function requestJsonFromOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL,
        temperature: 0.1,
        max_tokens: 1800,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Return only valid JSON. Do not wrap it in markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || "OpenAI extraction request failed.");
    return parseJsonFromText(data?.choices?.[0]?.message?.content || "");
  } finally {
    clearTimeout(timeout);
  }
}

async function requestJsonFromGroq(prompt) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured.");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
        temperature: 0.1,
        max_completion_tokens: 1800,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "Return only valid JSON. Do not wrap it in markdown.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || "Groq extraction request failed.");
    return parseJsonFromText(data?.choices?.[0]?.message?.content || "");
  } finally {
    clearTimeout(timeout);
  }
}

async function requestTalentJson(provider, prompt) {
  if (provider === "openai") return requestJsonFromOpenAI(prompt);
  if (provider === "groq") return requestJsonFromGroq(prompt);
  throw new Error(`Unsupported AI provider: ${provider}`);
}

async function requestTalentExtractionJson(provider, prompt) {
  return requestTalentJson(provider, prompt);
}

function isTidbConfigured() {
  return Boolean(
    process.env.TIDB_DATABASE_URL ||
      (process.env.TIDB_HOST && process.env.TIDB_USER && process.env.TIDB_PASSWORD && process.env.TIDB_DATABASE),
  );
}

function sslConfig() {
  if (process.env.TIDB_SSL === "false" || process.env.TIDB_SSL_DISABLED === "1") return undefined;
  return {
    minVersion: "TLSv1.2",
    rejectUnauthorized: process.env.TIDB_SSL_REJECT_UNAUTHORIZED !== "false",
  };
}

function connectionConfig() {
  const ssl = sslConfig();
  if (process.env.TIDB_DATABASE_URL) {
    return {
      uri: process.env.TIDB_DATABASE_URL,
      waitForConnections: true,
      connectionLimit: Number(process.env.TIDB_CONNECTION_LIMIT || 4),
      ssl,
    };
  }

  return {
    host: process.env.TIDB_HOST,
    user: process.env.TIDB_USER,
    password: process.env.TIDB_PASSWORD,
    database: process.env.TIDB_DATABASE,
    port: Number(process.env.TIDB_PORT || 4000),
    waitForConnections: true,
    connectionLimit: Number(process.env.TIDB_CONNECTION_LIMIT || 4),
    ssl,
  };
}

function getPool() {
  if (!isTidbConfigured()) return null;
  if (!pool) pool = mysql.createPool(connectionConfig());
  return pool;
}

async function ensureTalentSchema(db) {
  if (schemaReady) return;

  await db.query(`
    CREATE TABLE IF NOT EXISTS talent_profiles (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      profile_uid VARCHAR(64) NOT NULL,
      display_name VARCHAR(191),
      headline VARCHAR(255),
      narrative TEXT NOT NULL,
      search_text TEXT NOT NULL,
      structured JSON,
      embedding VECTOR(1536),
      embedding_model VARCHAR(128),
      embedding_dimensions INT,
      status VARCHAR(32) NOT NULL DEFAULT 'draft',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uk_talent_profiles_profile_uid (profile_uid),
      KEY idx_talent_profiles_status_updated (status, updated_at),
      KEY idx_talent_profiles_display_name (display_name)
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS talent_profile_facts (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      fact_uid VARCHAR(64) NOT NULL,
      profile_uid VARCHAR(64) NOT NULL,
      fact_type VARCHAR(64) NOT NULL,
      label VARCHAR(191) NOT NULL,
      value_text TEXT,
      numeric_value DECIMAL(8,2),
      evidence_text TEXT,
      confidence DECIMAL(4,3),
      verified_by_user TINYINT(1) NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY uk_talent_profile_facts_fact_uid (fact_uid),
      KEY idx_talent_profile_facts_profile_uid (profile_uid),
      KEY idx_talent_profile_facts_type_label (fact_type, label)
    )
  `);

  schemaReady = true;
}

function safeLimit(value) {
  const limit = Number(value);
  if (!Number.isInteger(limit) || limit < 1 || limit > 20) return DEFAULT_TOP_K;
  return limit;
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages
    .slice(-MAX_MESSAGES)
    .map((message) => ({
      role: message?.role === "assistant" ? "assistant" : "user",
      content: String(message?.content || "").trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((message) => message.content);
}

function userText(messages) {
  return messages
    .filter((message) => message.role === "user")
    .map((message) => message.content)
    .join("\n");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesAlias(text, aliases) {
  const lower = text.toLowerCase();
  return aliases.some((alias) => {
    const normalizedAlias = alias.toLowerCase();
    if (/^[a-z0-9+#.]{1,3}$/.test(normalizedAlias)) {
      return new RegExp(`(^|[^a-z0-9+#.])${escapeRegExp(normalizedAlias)}([^a-z0-9+#.]|$)`, "i").test(lower);
    }
    return lower.includes(normalizedAlias);
  });
}

function splitSentences(text) {
  return String(text || "")
    .split(/(?<=[。！？!?])|\r?\n/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function evidenceFor(text, aliases, fallback = "") {
  const sentence = splitSentences(text).find((item) => includesAlias(item, aliases));
  return (sentence || fallback || "").slice(0, 260);
}

function extractYearsNear(text, aliases) {
  for (const alias of aliases) {
    const escaped = escapeRegExp(alias);
    const patterns = [
      new RegExp(`${escaped}.{0,24}?(\\d+(?:\\.\\d+)?)\\s*(?:年|years?|yrs?)`, "i"),
      new RegExp(`(\\d+(?:\\.\\d+)?)\\s*(?:年|years?|yrs?).{0,24}?${escaped}`, "i"),
    ];
    for (const pattern of patterns) {
      const match = String(text).match(pattern);
      if (match) return Number(match[1]);
    }
  }
  return null;
}

function detectLevel(text, aliases) {
  const evidence = evidenceFor(text, aliases);
  if (/リード|主導|設計|アーキテクト|レビュー|育成|得意/i.test(evidence)) return "advanced";
  if (/実務|開発|担当|運用|改善|構築/i.test(evidence)) return "working";
  if (/少し|触った|勉強|学習|個人/i.test(evidence)) return "basic";
  return "mentioned";
}

function extractDisplayName(text) {
  const match = String(text).match(/(?:名前|氏名|name)\s*(?:は|:|：)?\s*([^\s、。,.]{2,32})/i);
  return match?.[1] || "";
}

function extractRoles(text) {
  return roleCatalog
    .filter((role) => includesAlias(text, role.aliases))
    .map((role) => ({
      label: role.label,
      evidenceText: evidenceFor(text, role.aliases),
      confidence: 0.86,
      verifiedByUser: false,
    }));
}

function extractSkills(text) {
  return skillCatalog
    .filter((skill) => includesAlias(text, skill.aliases))
    .map((skill) => {
      const years = extractYearsNear(text, [skill.name, ...skill.aliases]);
      const evidenceText = evidenceFor(text, [skill.name, ...skill.aliases]);
      return {
        name: skill.name,
        category: skill.category,
        years,
        level: detectLevel(text, [skill.name, ...skill.aliases]),
        evidenceText,
        confidence: years ? 0.9 : evidenceText ? 0.78 : 0.68,
        verifiedByUser: false,
      };
    });
}

function extractDomains(text) {
  return domainCatalog
    .filter((domain) => includesAlias(text, domain.aliases))
    .map((domain) => ({
      label: domain.label,
      evidenceText: evidenceFor(text, domain.aliases),
      confidence: 0.78,
      verifiedByUser: false,
    }));
}

function extractProjects(text) {
  return splitSentences(text)
    .filter((sentence) => /案件|プロジェクト|開発|構築|導入|改善|刷新|移行|リニューアル|担当|設計|運用|リード|制御|組み込み|組込|ファームウェア|マイコン|plc|rtos|can通信|車載|ecu|ロボット/i.test(sentence))
    .slice(0, 5)
    .map((sentence, index) => ({
      label: `project-${index + 1}`,
      summary: sentence.slice(0, 260),
      evidenceText: sentence.slice(0, 260),
      confidence: 0.72,
      verifiedByUser: false,
    }));
}

function extractPreferences(text) {
  return splitSentences(text)
    .filter((sentence) => /希望|やりたい|興味|好き|リモート|在宅|週\d|稼働|単価|働き方|避けたい|苦手|ng|NG|難しい/i.test(sentence))
    .slice(0, 6)
    .map((sentence) => ({
      label: /避けたい|苦手|ng|NG|難しい/i.test(sentence) ? "constraint" : "preference",
      value: sentence.slice(0, 220),
      evidenceText: sentence.slice(0, 220),
      confidence: 0.74,
      verifiedByUser: false,
    }));
}

function extractStrengths(text) {
  return splitSentences(text)
    .filter((sentence) => /得意|強み|評価|好き|リード|設計|改善|整理|調整|顧客|折衝|育成|レビュー|巻き取り|低レイヤ|リアルタイム|制御|組み込み|組込|ハードウェア/i.test(sentence))
    .slice(0, 5)
    .map((sentence) => ({
      label: sentence.slice(0, 42),
      evidenceText: sentence.slice(0, 240),
      confidence: 0.7,
      verifiedByUser: false,
    }));
}

function buildHeadline(draft) {
  const role = draft.extraction.roles[0]?.label || "未設定の候補者";
  const skills = draft.extraction.skills.slice(0, 3).map((skill) => skill.name);
  return skills.length ? `${role} / ${skills.join("・")}` : role;
}

function buildNarrative(draft) {
  const roles = draft.extraction.roles.map((role) => role.label).join("、");
  const skills = draft.extraction.skills
    .slice(0, 8)
    .map((skill) => `${skill.name}${skill.years ? ` ${skill.years}年` : ""}`)
    .join("、");
  const domains = draft.extraction.domains.map((domain) => domain.label).join("、");
  const projects = draft.extraction.projects.slice(0, 2).map((project) => project.summary).join(" ");
  const preferences = draft.extraction.preferences
    .filter((item) => item.label === "preference")
    .slice(0, 2)
    .map((item) => item.value)
    .join(" ");
  const strengths = draft.extraction.strengths.slice(0, 2).map((item) => item.evidenceText).join(" ");

  if (!roles && !skills && !projects) {
    return "まだプロフィール生成に必要な情報が不足しています。会話を通じて役割、スキル、案件経験、希望条件を確認します。";
  }

  return [
    `${roles || "役割未確認"}として、${skills || "主要スキル未確認"}を中心に経験を持つ候補者です。${
      domains ? `関わってきた領域は${domains}です。` : ""
    }`,
    projects ? `代表的な経験として、${projects}` : "",
    strengths ? `強みとして、${strengths}` : "",
    preferences ? `今後の希望として、${preferences}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildFacts(draft) {
  const facts = [];
  for (const role of draft.extraction.roles) {
    facts.push({
      factType: "role",
      label: role.label,
      valueText: role.label,
      numericValue: null,
      evidenceText: role.evidenceText,
      confidence: role.confidence,
      verifiedByUser: role.verifiedByUser,
    });
  }
  for (const skill of draft.extraction.skills) {
    facts.push({
      factType: "skill",
      label: skill.name,
      valueText: skill.years ? `${skill.name} ${skill.years}年` : skill.name,
      numericValue: skill.years,
      evidenceText: skill.evidenceText,
      confidence: skill.confidence,
      verifiedByUser: skill.verifiedByUser,
    });
  }
  for (const domain of draft.extraction.domains) {
    facts.push({
      factType: "domain",
      label: domain.label,
      valueText: domain.label,
      numericValue: null,
      evidenceText: domain.evidenceText,
      confidence: domain.confidence,
      verifiedByUser: domain.verifiedByUser,
    });
  }
  for (const project of draft.extraction.projects) {
    facts.push({
      factType: "project",
      label: project.label,
      valueText: project.summary,
      numericValue: null,
      evidenceText: project.evidenceText,
      confidence: project.confidence,
      verifiedByUser: project.verifiedByUser,
    });
  }
  for (const preference of draft.extraction.preferences) {
    facts.push({
      factType: preference.label,
      label: preference.label,
      valueText: preference.value,
      numericValue: null,
      evidenceText: preference.evidenceText,
      confidence: preference.confidence,
      verifiedByUser: preference.verifiedByUser,
    });
  }
  for (const strength of draft.extraction.strengths) {
    facts.push({
      factType: "strength",
      label: strength.label,
      valueText: strength.evidenceText,
      numericValue: null,
      evidenceText: strength.evidenceText,
      confidence: strength.confidence,
      verifiedByUser: strength.verifiedByUser,
    });
  }
  return facts;
}

function missingFields(draft) {
  const missing = [];
  if (!draft.extraction.roles.length) missing.push("role");
  if (!draft.extraction.skills.length) missing.push("skills");
  if (draft.extraction.skills.length && !draft.extraction.skills.some((skill) => skill.years)) missing.push("years");
  if (!draft.extraction.projects.length) missing.push("projects");
  if (!draft.extraction.preferences.length) missing.push("preferences");
  if (!draft.extraction.strengths.length) missing.push("strengths");
  return missing;
}

function readinessScore(missing) {
  const weights = {
    role: 18,
    skills: 24,
    years: 10,
    projects: 22,
    preferences: 14,
    strengths: 12,
  };
  return Math.max(
    0,
    100 - missing.reduce((sum, field) => sum + (weights[field] || 10), 0),
  );
}

function buildEmbeddingText(draft) {
  return [
    draft.displayName,
    draft.headline,
    draft.narrative,
    ...draft.structuredFacts.map((fact) => `${fact.factType}: ${fact.label} ${fact.valueText || ""} ${fact.evidenceText || ""}`),
  ]
    .filter(Boolean)
    .join("\n");
}

function createDraft(messages, overrides = {}) {
  const text = userText(messages);
  const baseDraft = {
    profileUid: overrides.profileUid || "",
    displayName: overrides.displayName || extractDisplayName(text),
    headline: "",
    narrative: "",
    extraction: {
      roles: extractRoles(text),
      skills: extractSkills(text),
      domains: extractDomains(text),
      projects: extractProjects(text),
      preferences: extractPreferences(text),
      strengths: extractStrengths(text),
    },
    structuredFacts: [],
    missingFields: [],
    readinessScore: 0,
    nextQuestion: "",
    dbPreview: {
      profileTable: "talent_profiles",
      factsTable: "talent_profile_facts",
      embeddingModel: LOCAL_EMBEDDING_MODEL,
      embeddingText: "",
    },
    extractionMeta: {
      mode: "local-rule",
      provider: "local",
      fallbackUsed: false,
      warning: null,
    },
  };

  baseDraft.headline = overrides.headline || buildHeadline(baseDraft);
  baseDraft.narrative = overrides.narrative || buildNarrative(baseDraft);
  baseDraft.structuredFacts = buildFacts(baseDraft);
  baseDraft.missingFields = missingFields(baseDraft);
  baseDraft.readinessScore = readinessScore(baseDraft.missingFields);
  baseDraft.nextQuestion =
    baseDraft.missingFields.length > 0 ? questionPlan[baseDraft.missingFields[0]] : questionPlan.confirm;
  baseDraft.dbPreview.embeddingText = buildEmbeddingText(baseDraft).slice(0, 2200);

  return baseDraft;
}

function normalizeLlmRoles(values) {
  return (Array.isArray(values) ? values : []).slice(0, 8).map((item) => ({
    label: clampText(item?.label, 120),
    evidenceText: clampText(item?.evidenceText, 500),
    confidence: safeConfidence(item?.confidence),
    verifiedByUser: false,
  })).filter((item) => item.label);
}

function normalizeLlmSkills(values) {
  return (Array.isArray(values) ? values : []).slice(0, 24).map((item) => ({
    name: clampText(item?.name || item?.label, 120),
    category: clampText(item?.category || "skill", 80),
    years: safeNumber(item?.years ?? item?.numericValue),
    level: ["basic", "working", "advanced", "mentioned"].includes(item?.level) ? item.level : "mentioned",
    evidenceText: clampText(item?.evidenceText, 500),
    confidence: safeConfidence(item?.confidence),
    verifiedByUser: false,
  })).filter((item) => item.name);
}

function normalizeLlmDomains(values) {
  return (Array.isArray(values) ? values : []).slice(0, 12).map((item) => ({
    label: clampText(item?.label, 120),
    evidenceText: clampText(item?.evidenceText, 500),
    confidence: safeConfidence(item?.confidence),
    verifiedByUser: false,
  })).filter((item) => item.label);
}

function normalizeLlmProjects(values) {
  return (Array.isArray(values) ? values : []).slice(0, 8).map((item, index) => ({
    label: clampText(item?.label || `project-${index + 1}`, 120),
    summary: clampText(item?.summary || item?.value || item?.valueText, 700),
    evidenceText: clampText(item?.evidenceText || item?.summary, 700),
    confidence: safeConfidence(item?.confidence),
    verifiedByUser: false,
  })).filter((item) => item.summary || item.evidenceText);
}

function normalizeLlmPreferences(values) {
  return (Array.isArray(values) ? values : []).slice(0, 12).map((item) => {
    const label = item?.label === "constraint" ? "constraint" : "preference";
    return {
      label,
      value: clampText(item?.value || item?.valueText, 500),
      evidenceText: clampText(item?.evidenceText || item?.value || item?.valueText, 500),
      confidence: safeConfidence(item?.confidence),
      verifiedByUser: false,
    };
  }).filter((item) => item.value || item.evidenceText);
}

function normalizeLlmStrengths(values) {
  return (Array.isArray(values) ? values : []).slice(0, 10).map((item) => ({
    label: clampText(item?.label || item?.value || item?.valueText, 120),
    evidenceText: clampText(item?.evidenceText || item?.value || item?.valueText, 500),
    confidence: safeConfidence(item?.confidence),
    verifiedByUser: false,
  })).filter((item) => item.label || item.evidenceText);
}

function createDraftFromLlm(messages, overrides, payload, provider) {
  const localDraft = createDraft(messages, overrides);
  const baseDraft = {
    ...localDraft,
    displayName: clampText(overrides.displayName || payload?.displayName || localDraft.displayName, 191),
    headline: clampText(payload?.headline || localDraft.headline, 255),
    narrative: clampText(payload?.narrative || localDraft.narrative, 8000),
    extraction: {
      roles: normalizeLlmRoles(payload?.roles),
      skills: normalizeLlmSkills(payload?.skills),
      domains: normalizeLlmDomains(payload?.domains),
      projects: normalizeLlmProjects(payload?.projects),
      preferences: normalizeLlmPreferences(payload?.preferences),
      strengths: normalizeLlmStrengths(payload?.strengths),
    },
    extractionMeta: {
      mode: "llm-json",
      provider,
      fallbackUsed: false,
      warning: null,
    },
  };

  baseDraft.headline = baseDraft.headline || buildHeadline(baseDraft);
  baseDraft.narrative = baseDraft.narrative || buildNarrative(baseDraft);
  baseDraft.structuredFacts = buildFacts(baseDraft);
  const computedMissing = missingFields(baseDraft);
  const llmMissing = Array.isArray(payload?.missingFields)
    ? payload.missingFields.filter((field) => Object.prototype.hasOwnProperty.call(questionPlan, field))
    : [];
  baseDraft.missingFields = unique([...llmMissing, ...computedMissing]);
  baseDraft.readinessScore = readinessScore(baseDraft.missingFields);
  baseDraft.nextQuestion =
    clampText(payload?.nextQuestion, 500) ||
    (baseDraft.missingFields.length > 0 ? questionPlan[baseDraft.missingFields[0]] : questionPlan.confirm);
  baseDraft.dbPreview.embeddingText = buildEmbeddingText(baseDraft).slice(0, 2200);

  return baseDraft;
}

async function createInterviewDraft(messages, body) {
  const providerRequest = normalizeExtractionProvider(body.extractionProvider || process.env.TALENT_INTAKE_PROVIDER);
  const localDraft = createDraft(messages, body.draftOverrides || {});
  const provider = configuredProvider(providerRequest);
  if (!provider) {
    return {
      draft: {
        ...localDraft,
        extractionMeta: {
          mode: "local-rule",
          provider: providerRequest,
          fallbackUsed: providerRequest !== "local",
          warning:
            providerRequest === "local"
              ? null
              : `${providerRequest} extraction provider is not configured. Used local rule extraction.`,
        },
      },
      extraction: {
        mode: "local-rule",
        provider: "local",
        requestedProvider: providerRequest,
        fallbackUsed: providerRequest !== "local",
        warning: providerRequest === "local" ? null : `${providerRequest} extraction provider is not configured.`,
      },
    };
  }

  try {
    const payload = await requestTalentExtractionJson(provider, llmExtractionPrompt(messages, localDraft));
    const draft = createDraftFromLlm(messages, body.draftOverrides || {}, payload, provider);
    return {
      draft,
      extraction: {
        mode: "llm-json",
        provider,
        requestedProvider: providerRequest,
        fallbackUsed: false,
        warning: null,
      },
    };
  } catch (error) {
    const warning = sanitizeProviderError(error instanceof Error ? error.message : String(error));
    return {
      draft: {
        ...localDraft,
        extractionMeta: {
          mode: "local-rule",
          provider,
          fallbackUsed: true,
          warning,
        },
      },
      extraction: {
        mode: "local-rule",
        provider: "local",
        requestedProvider: providerRequest,
        fallbackUsed: true,
        warning,
      },
    };
  }
}

function buildAssistantMessage(draft) {
  if (draft.readinessScore >= 80) {
    return `保存候補を作れる状態です。今の抽出では「${draft.headline}」として整理しています。\n\n${draft.nextQuestion}`;
  }
  if (draft.structuredFacts.length) {
    return `ここまでで${draft.structuredFacts.length}件の保存候補を抽出しました。まだ不足している項目があります。\n\n${draft.nextQuestion}`;
  }
  return draft.nextQuestion;
}

function profileUid() {
  return `talent_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;
}

function factUid(profile, fact, index) {
  return crypto
    .createHash("sha1")
    .update([profile, index, fact.factType, fact.label, fact.valueText, fact.evidenceText].join("\n"))
    .digest("hex");
}

function normalizedDraft(input) {
  const draft = input && typeof input === "object" ? input : {};
  const structuredFacts = Array.isArray(draft.structuredFacts) ? draft.structuredFacts : [];
  return {
    ...draft,
    profileUid: draft.profileUid || profileUid(),
    displayName: String(draft.displayName || "").trim().slice(0, 191),
    headline: String(draft.headline || "").trim().slice(0, 255),
    narrative: String(draft.narrative || "").trim().slice(0, 8000),
    structuredFacts: structuredFacts.slice(0, 80).map((fact) => ({
      factType: String(fact.factType || "note").slice(0, 64),
      label: String(fact.label || "note").slice(0, 191),
      valueText: fact.valueText == null ? "" : String(fact.valueText).slice(0, 2000),
      numericValue: Number.isFinite(Number(fact.numericValue)) ? Number(fact.numericValue) : null,
      evidenceText: fact.evidenceText == null ? "" : String(fact.evidenceText).slice(0, 2000),
      confidence: Number.isFinite(Number(fact.confidence)) ? Math.max(0, Math.min(1, Number(fact.confidence))) : null,
      verifiedByUser: Boolean(fact.verifiedByUser),
    })),
  };
}

async function saveTalentDraftToTidb(draft, { confirmed = false } = {}) {
  const db = getPool();
  if (!db) return null;

  await ensureTalentSchema(db);

  const dimensions = Number(process.env.RAG_EMBEDDING_DIMENSIONS || DEFAULT_EMBEDDING_DIMENSIONS);
  const embeddingText = buildEmbeddingText(draft);
  const embedding = JSON.stringify(createLocalEmbedding(embeddingText, { dimensions }));
  const status = confirmed ? "confirmed" : "draft";

  await db.execute(
    `
      INSERT INTO talent_profiles (
        profile_uid, display_name, headline, narrative, search_text, structured,
        embedding, embedding_model, embedding_dimensions, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        display_name = VALUES(display_name),
        headline = VALUES(headline),
        narrative = VALUES(narrative),
        search_text = VALUES(search_text),
        structured = VALUES(structured),
        embedding = VALUES(embedding),
        embedding_model = VALUES(embedding_model),
        embedding_dimensions = VALUES(embedding_dimensions),
        status = VALUES(status)
    `,
    [
      draft.profileUid,
      draft.displayName || null,
      draft.headline || null,
      draft.narrative,
      embeddingText,
      JSON.stringify(draft),
      embedding,
      LOCAL_EMBEDDING_MODEL,
      dimensions,
      status,
    ],
  );

  for (const [index, fact] of draft.structuredFacts.entries()) {
    await db.execute(
      `
        INSERT INTO talent_profile_facts (
          fact_uid, profile_uid, fact_type, label, value_text, numeric_value,
          evidence_text, confidence, verified_by_user
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          value_text = VALUES(value_text),
          numeric_value = VALUES(numeric_value),
          evidence_text = VALUES(evidence_text),
          confidence = VALUES(confidence),
          verified_by_user = VALUES(verified_by_user)
      `,
      [
        factUid(draft.profileUid, fact, index),
        draft.profileUid,
        fact.factType,
        fact.label,
        fact.valueText || null,
        fact.numericValue,
        fact.evidenceText || null,
        fact.confidence,
        confirmed || fact.verifiedByUser ? 1 : 0,
      ],
    );
  }

  return {
    profileUid: draft.profileUid,
    storageMode: "tidb",
    factCount: draft.structuredFacts.length,
  };
}

function saveTalentDraftToMemory(draft, { confirmed = false, warning = null } = {}) {
  const record = {
    ...draft,
    status: confirmed ? "confirmed" : "draft",
    storageMode: "memory",
    warning,
    updatedAt: new Date().toISOString(),
  };
  memoryProfiles.set(record.profileUid, record);
  return {
    profileUid: record.profileUid,
    storageMode: "memory",
    factCount: record.structuredFacts.length,
    warning,
  };
}

function createDemoTalentDraft(profile) {
  const draft = createDraft([{ role: "user", content: profile.text }], {
    profileUid: profile.profileUid,
    displayName: profile.displayName,
  });
  return normalizedDraft({
    ...draft,
    profileUid: profile.profileUid,
    displayName: profile.displayName,
  });
}

function ensureDemoTalentProfilesInMemory() {
  for (const profile of demoTalentProfiles) {
    const normalized = createDemoTalentDraft(profile);
    saveTalentDraftToMemory(normalized, { confirmed: true });
  }
}

async function saveTalentDraft(input, options) {
  const draft = normalizedDraft(input);
  if (!draft.narrative) {
    return {
      ok: false,
      status: 400,
      body: { error: "保存するnarrativeが空です。", errorCode: "VALIDATION_ERROR" },
    };
  }

  try {
    const tidbResult = await saveTalentDraftToTidb(draft, options);
    if (tidbResult) {
      saveTalentDraftToMemory(draft, options);
      return { ok: true, status: 200, body: { saved: true, ...tidbResult, draft } };
    }
  } catch (error) {
    const warning = error instanceof Error ? error.message : "unknown TiDB save error";
    const memoryResult = saveTalentDraftToMemory(draft, { ...options, warning });
    return { ok: true, status: 200, body: { saved: true, ...memoryResult, draft } };
  }

  const memoryResult = saveTalentDraftToMemory(draft, {
    ...options,
    warning: "TiDB connection env is not configured. Saved to in-memory prototype storage.",
  });
  return { ok: true, status: 200, body: { saved: true, ...memoryResult, draft } };
}

async function seedDemoTalentProfiles(options = {}) {
  const requestedStorageMode = isDemoReadOnly() ? "memory" : options.storageMode === "tidb" ? "tidb" : "memory";
  let warning = null;

  const profiles = [];
  for (const profile of demoTalentProfiles) {
    const normalized = createDemoTalentDraft(profile);

    let saved = null;
    if (requestedStorageMode === "tidb") {
      try {
        saved = await saveTalentDraftToTidb(normalized, { confirmed: true });
        if (!saved) {
          warning = "TiDB connection env is not configured. Seeded demo profiles to in-memory storage.";
        }
      } catch (error) {
        warning = error instanceof Error ? error.message : "unknown TiDB seed error";
      }
    }

    if (saved) {
      saveTalentDraftToMemory(normalized, { confirmed: true });
    } else {
      saveTalentDraftToMemory(normalized, { confirmed: true, warning });
    }

    profiles.push({
      profileUid: normalized.profileUid,
      displayName: normalized.displayName,
      headline: normalized.headline,
      factCount: normalized.structuredFacts.length,
      storageMode: saved?.storageMode || "memory",
    });
  }

  const storageMode = profiles.every((profile) => profile.storageMode === "tidb") ? "tidb" : "memory";

  return {
    seeded: profiles.length,
    storageMode,
    requestedStorageMode,
    profiles,
    warning,
    note:
      storageMode === "tidb"
        ? "Demo profiles were seeded to TiDB and mirrored to in-memory prototype storage."
        : isDemoReadOnly()
          ? "Demo read-only mode is enabled. Demo profiles are available in memory and writes to TiDB are disabled."
        : "Demo profiles were seeded to in-memory prototype storage.",
    demoReadOnly: isDemoReadOnly(),
  };
}

function tokenizeSearch(query) {
  const source = String(query || "").toLowerCase();
  const catalogTokens = [
    ...skillCatalog.flatMap((skill) =>
      includesAlias(source, [skill.name, ...skill.aliases]) ? [skill.name.toLowerCase(), ...skill.aliases] : [],
    ),
    ...roleCatalog.flatMap((role) => (includesAlias(source, role.aliases) ? [role.label.toLowerCase(), ...role.aliases] : [])),
    ...domainCatalog.flatMap((domain) =>
      includesAlias(source, domain.aliases) ? [domain.label.toLowerCase(), ...domain.aliases] : [],
    ),
  ];

  const normalizedTokens = source
    .replace(/[^\p{L}\p{N}#.+ー]+/gu, " ")
    .split(/\s+/)
    .flatMap((token) => {
      if (!token || token.length < 2) return [];
      if (token.length <= 6) return [token];

      const chars = [...token];
      const grams = [];
      for (let index = 0; index <= chars.length - 2; index += 1) {
        grams.push(chars.slice(index, index + 2).join(""));
      }
      return [token, ...grams];
    });

  return unique([...catalogTokens, ...normalizedTokens])
    .map((token) => String(token).toLowerCase())
    .filter((token) => token.length >= 2)
    .slice(0, 18);
}

function parseJson(value) {
  if (!value) return null;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function rowToSearchResult(row, score, mode) {
  return {
    profileUid: row.profile_uid,
    displayName: row.display_name || "",
    headline: row.headline || "",
    narrative: row.narrative || "",
    structured: parseJson(row.structured),
    score,
    matchMode: mode,
  };
}

function profileSummaryFromRecord(record, storageMode) {
  return {
    profileUid: record.profileUid,
    displayName: record.displayName || "",
    headline: record.headline || "",
    narrative: record.narrative || "",
    factCount: Array.isArray(record.structuredFacts) ? record.structuredFacts.length : 0,
    storageMode,
  };
}

function profileSummaryFromRow(row) {
  const structured = parseJson(row.structured);
  return {
    profileUid: row.profile_uid,
    displayName: row.display_name || structured?.displayName || "",
    headline: row.headline || structured?.headline || "",
    narrative: row.narrative || structured?.narrative || "",
    factCount: Array.isArray(structured?.structuredFacts) ? structured.structuredFacts.length : 0,
    storageMode: "tidb",
  };
}

function listTalentMemoryProfiles(limit) {
  return [...memoryProfiles.values()]
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))
    .slice(0, safeLimit(limit || 20))
    .map((profile) => profileSummaryFromRecord(profile, profile.storageMode || "memory"));
}

async function listTalentProfiles(options = {}) {
  const limit = Math.min(safeLimit(options.limit || 20), 50);
  if (isDemoReadOnly()) {
    ensureDemoTalentProfilesInMemory();
    return {
      profiles: listTalentMemoryProfiles(limit),
      storageMode: "memory",
      demoReadOnly: true,
      warning: null,
    };
  }

  const db = getPool();
  if (!db) {
    return {
      profiles: listTalentMemoryProfiles(limit),
      storageMode: "memory",
      demoReadOnly: false,
      warning: "TiDB connection env is not configured. Listing in-memory prototype storage.",
    };
  }

  try {
    await ensureTalentSchema(db);
    const [rows] = await db.execute(
      `
        SELECT profile_uid, display_name, headline, narrative, structured
        FROM talent_profiles
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `,
    );
    return {
      profiles: rows.map(profileSummaryFromRow),
      storageMode: "tidb",
      demoReadOnly: false,
      warning: null,
    };
  } catch (error) {
    return {
      profiles: listTalentMemoryProfiles(limit),
      storageMode: "memory",
      demoReadOnly: false,
      warning: error instanceof Error ? error.message : "unknown TiDB list error",
    };
  }
}

function combineResults(groups, topK) {
  const merged = new Map();
  for (const group of groups) {
    group.results.forEach((item, index) => {
      const current = merged.get(item.profileUid) || { ...item, score: 0, matchMode: item.matchMode };
      current.score += group.weight / (index + 1);
      current.matchMode = current.matchMode === item.matchMode ? current.matchMode : "hybrid";
      merged.set(item.profileUid, current);
    });
  }
  return [...merged.values()].sort((a, b) => b.score - a.score).slice(0, safeLimit(topK));
}

async function searchTalentKeyword(db, query, topK) {
  const limit = Math.min(safeLimit(topK) * 2, 20);
  const tokens = tokenizeSearch(query);
  if (!tokens.length) {
    const [rows] = await db.execute(
      `
        SELECT profile_uid, display_name, headline, narrative, structured, 0 AS score
        FROM talent_profiles
        ORDER BY updated_at DESC
        LIMIT ${limit}
      `,
    );
    return rows.map((row) => rowToSearchResult(row, Number(row.score || 0), "keyword"));
  }

  const scoreParts = tokens
    .map(() => "(CASE WHEN LOWER(COALESCE(headline, '')) LIKE ? THEN 5 ELSE 0 END + CASE WHEN LOWER(search_text) LIKE ? THEN 2 ELSE 0 END)")
    .join(" + ");
  const whereParts = tokens.map(() => "(LOWER(COALESCE(headline, '')) LIKE ? OR LOWER(search_text) LIKE ?)").join(" OR ");
  const scoreParams = tokens.flatMap((token) => [`%${token}%`, `%${token}%`]);
  const whereParams = tokens.flatMap((token) => [`%${token}%`, `%${token}%`]);

  const [rows] = await db.execute(
    `
      SELECT profile_uid, display_name, headline, narrative, structured, (${scoreParts}) AS score
      FROM talent_profiles
      WHERE ${whereParts}
      ORDER BY score DESC, updated_at DESC
      LIMIT ${limit}
    `,
    [...scoreParams, ...whereParams],
  );

  return rows.map((row) => rowToSearchResult(row, Number(row.score || 0), "keyword"));
}

async function searchTalentVector(db, query, topK) {
  const limit = Math.min(safeLimit(topK) * 2, 20);
  const dimensions = Number(process.env.RAG_EMBEDDING_DIMENSIONS || DEFAULT_EMBEDDING_DIMENSIONS);
  const vector = JSON.stringify(createLocalEmbedding(query, { dimensions }));
  const [rows] = await db.execute(
    `
      SELECT
        profile_uid, display_name, headline, narrative, structured,
        VEC_COSINE_DISTANCE(embedding, ?) AS distance
      FROM talent_profiles
      WHERE embedding IS NOT NULL AND embedding_model = ?
      ORDER BY distance ASC
      LIMIT ${limit}
    `,
    [vector, LOCAL_EMBEDDING_MODEL],
  );

  return rows.map((row) =>
    rowToSearchResult(row, row.distance == null ? 0 : 1 / (1 + Number(row.distance)), "vector"),
  );
}

function searchTalentMemory(query, topK) {
  const tokens = tokenizeSearch(query);
  return [...memoryProfiles.values()]
    .map((profile) => {
      const searchText = buildEmbeddingText(profile).toLowerCase();
      const score = tokens.length
        ? tokens.reduce((sum, token) => (searchText.includes(token) ? sum + Math.min(token.length, 8) : sum), 0)
        : 0;
      return {
        profileUid: profile.profileUid,
        displayName: profile.displayName || "",
        headline: profile.headline || "",
        narrative: profile.narrative || "",
        structured: profile,
        score,
        matchMode: "memory",
      };
    })
    .filter((item) => !tokens.length || item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, safeLimit(topK));
}

function resultFacts(result) {
  return Array.isArray(result?.structured?.structuredFacts) ? result.structured.structuredFacts : [];
}

function resultSearchText(result) {
  const facts = resultFacts(result)
    .map((fact) => `${fact.factType || ""} ${fact.label || ""} ${fact.valueText || ""} ${fact.evidenceText || ""}`)
    .join("\n");
  return [result.displayName, result.headline, result.narrative, facts].filter(Boolean).join("\n").toLowerCase();
}

function normalizeMatchScore(value, fallback = 50) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(0, Math.min(100, Math.round(number)));
}

function normalizeTextItems(values, limit = 4) {
  return (Array.isArray(values) ? values : [])
    .map((value) => clampText(value, 180))
    .filter(Boolean)
    .slice(0, limit);
}

function localMatchAnalysis(query, result) {
  const tokens = tokenizeSearch(query);
  const searchText = resultSearchText(result);
  const matchedTokens = tokens.filter((token) => searchText.includes(token));
  const matchRatio = tokens.length ? matchedTokens.length / tokens.length : 0.35;
  const fitScore = normalizeMatchScore(42 + matchRatio * 48 + Math.min(Number(result.score || 0) * 2, 10));
  const facts = resultFacts(result);
  const matchedFacts = facts
    .filter((fact) => {
      const factText = `${fact.label || ""} ${fact.valueText || ""} ${fact.evidenceText || ""}`.toLowerCase();
      return matchedTokens.some((token) => factText.includes(token));
    })
    .map((fact) => fact.valueText || fact.label || fact.evidenceText)
    .filter(Boolean);
  const highlights = unique(matchedFacts).slice(0, 4);
  const concerns = [];

  if (!highlights.length && result.headline) highlights.push(result.headline);
  if (matchRatio < 0.35) concerns.push("検索条件に対して明示的に一致する根拠が少なめです。");
  if (!facts.some((fact) => fact.factType === "skill" && fact.numericValue)) {
    concerns.push("主要スキルの年数が未登録、または抽出できていません。");
  }

  return {
    mode: "local-rule",
    provider: "local",
    fitScore,
    reason:
      highlights.length > 0
        ? `検索文と候補者情報の一致語から、${highlights.slice(0, 2).join("、")} が強い根拠として見えます。`
        : "検索文と候補者のnarrative、structured factsをローカルルールで照合しました。",
    highlights,
    concerns: concerns.slice(0, 3),
    warning: null,
  };
}

function attachLocalMatchAnalyses(query, results, warning = null) {
  return results.map((result) => {
    const analysis = localMatchAnalysis(query, result);
    return {
      ...result,
      matchAnalysis: {
        ...analysis,
        warning,
      },
    };
  });
}

function llmMatchPrompt(query, results) {
  const candidates = results.slice(0, 8).map((result) => ({
    profileUid: result.profileUid,
    displayName: result.displayName,
    headline: result.headline,
    narrative: result.narrative,
    retrievalScore: result.score,
    retrievalMode: result.matchMode,
    facts: resultFacts(result)
      .slice(0, 24)
      .map((fact) => ({
        type: fact.factType,
        label: fact.label,
        value: fact.valueText,
        years: fact.numericValue,
        evidence: fact.evidenceText,
        confidence: fact.confidence,
      })),
  }));

  return [
    "あなたは人材案件マッチングの評価アシスタントです。",
    "検索条件と候補者情報だけを根拠に、候補者ごとの適合理由をJSONだけで返してください。",
    "候補者情報にない経験やスキルは推測しないでください。弱い点があればconcernsに短く入れてください。",
    "fitScoreは0から100の整数です。検索条件に直接合う根拠が多いほど高くしてください。",
    "JSONスキーマ:",
    JSON.stringify(
      {
        matches: [
          {
            profileUid: "string",
            fitScore: 0,
            reason: "string",
            highlights: ["string"],
            concerns: ["string"],
          },
        ],
      },
      null,
      2,
    ),
    "",
    "検索条件:",
    query,
    "",
    "候補者:",
    JSON.stringify(candidates, null, 2),
  ].join("\n");
}

function normalizeLlmMatchAnalyses(payload) {
  const analyses = new Map();
  const matches = Array.isArray(payload?.matches) ? payload.matches : [];
  for (const item of matches) {
    const profileUid = clampText(item?.profileUid, 80);
    if (!profileUid) continue;
    analyses.set(profileUid, {
      mode: "llm-json",
      fitScore: normalizeMatchScore(item?.fitScore),
      reason: clampText(item?.reason, 500),
      highlights: normalizeTextItems(item?.highlights),
      concerns: normalizeTextItems(item?.concerns),
      warning: null,
    });
  }
  return analyses;
}

async function explainTalentMatches(query, results, providerRequest) {
  const requestedProvider = normalizeExtractionProvider(providerRequest || "local");
  if (!results.length) {
    return {
      results,
      match: {
        mode: "none",
        provider: "local",
        requestedProvider,
        fallbackUsed: false,
        warning: null,
      },
    };
  }

  const provider = configuredProvider(requestedProvider);
  if (!provider) {
    const warning =
      requestedProvider === "local" ? null : `${requestedProvider} match provider is not configured. Used local match rules.`;
    return {
      results: attachLocalMatchAnalyses(query, results, warning),
      match: {
        mode: "local-rule",
        provider: "local",
        requestedProvider,
        fallbackUsed: requestedProvider !== "local",
        warning,
      },
    };
  }

  try {
    const payload = await requestTalentJson(provider, llmMatchPrompt(query, results));
    const analyses = normalizeLlmMatchAnalyses(payload);
    const explainedResults = results.map((result) => {
      const local = localMatchAnalysis(query, result);
      const llm = analyses.get(result.profileUid);
      return {
        ...result,
        matchAnalysis: llm
          ? {
              ...local,
              ...llm,
              provider,
            }
          : {
              ...local,
              warning: "AI response did not include this candidate. Used local match rules for this row.",
            },
      };
    });

    return {
      results: explainedResults.sort(
        (a, b) => (b.matchAnalysis?.fitScore || 0) - (a.matchAnalysis?.fitScore || 0),
      ),
      match: {
        mode: "llm-json",
        provider,
        requestedProvider,
        fallbackUsed: false,
        warning: null,
      },
    };
  } catch (error) {
    const warning = sanitizeProviderError(error instanceof Error ? error.message : String(error));
    return {
      results: attachLocalMatchAnalyses(query, results, warning),
      match: {
        mode: "local-rule",
        provider: "local",
        requestedProvider,
        fallbackUsed: true,
        warning,
      },
    };
  }
}

async function searchTalentProfiles(query, topK) {
  const db = getPool();
  if (!db) {
    return {
      results: searchTalentMemory(query, topK),
      storageMode: "memory",
      warning: "TiDB connection env is not configured. Searching in-memory prototype storage.",
    };
  }

  try {
    await ensureTalentSchema(db);
    const keywordResults = await searchTalentKeyword(db, query, topK);
    let vectorResults = [];
    let vectorWarning = null;
    try {
      vectorResults = await searchTalentVector(db, query, topK);
    } catch (error) {
      vectorWarning = error instanceof Error ? error.message : "unknown vector search error";
    }
    return {
      results: combineResults(
        [
          { results: keywordResults, weight: 0.45 },
          { results: vectorResults, weight: 0.55 },
        ],
        topK,
      ),
      storageMode: "tidb",
      warning: vectorWarning,
    };
  } catch (error) {
    return {
      results: searchTalentMemory(query, topK),
      storageMode: "memory",
      warning: error instanceof Error ? error.message : "unknown TiDB search error",
    };
  }
}

export async function createTalentIntakeResponse(body) {
  if (!body || typeof body !== "object") {
    return {
      status: 400,
      body: { error: "入力内容が正しくありません。", errorCode: "VALIDATION_ERROR" },
    };
  }

  const action =
    body.action === "save" || body.action === "search" || body.action === "seed" || body.action === "list"
      ? body.action
      : "interview";

  if (action === "save") {
    if (isDemoReadOnly()) {
      return {
        status: 403,
        body: {
          saved: false,
          demoReadOnly: true,
          error: "デモ環境では保存機能を無効にしています。入力内容はTiDBに保存されません。",
          errorCode: "DEMO_READ_ONLY",
        },
      };
    }
    const result = await saveTalentDraft(body.draft, { confirmed: Boolean(body.confirmed) });
    return { status: result.status, body: result.body };
  }

  if (action === "list") {
    return {
      status: 200,
      body: await listTalentProfiles({ limit: body.limit }),
    };
  }

  if (action === "seed") {
    return {
      status: 200,
      body: await seedDemoTalentProfiles({ storageMode: body.storageMode }),
    };
  }

  if (action === "search") {
    const query = String(body.query || "").trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!query) {
      return {
        status: 400,
        body: { error: "検索文を入力してください。", errorCode: "VALIDATION_ERROR" },
      };
    }
    const matchProviderRequest = body.matchProvider || process.env.TALENT_MATCH_PROVIDER || "local";
    if (isDemoReadOnly()) {
      ensureDemoTalentProfilesInMemory();
      const explained = await explainTalentMatches(
        query,
        searchTalentMemory(query, body.topK),
        matchProviderRequest,
      );
      return {
        status: 200,
        body: {
          query,
          ...explained,
          storageMode: "memory",
          warning: null,
          demoReadOnly: true,
        },
      };
    }
    if (body.storageMode === "memory") {
      const explained = await explainTalentMatches(
        query,
        searchTalentMemory(query, body.topK),
        matchProviderRequest,
      );
      return {
        status: 200,
        body: {
          query,
          ...explained,
          storageMode: "memory",
          warning: null,
        },
      };
    }
    const search = await searchTalentProfiles(query, body.topK);
    const explained = await explainTalentMatches(query, search.results, matchProviderRequest);
    return {
      status: 200,
      body: {
        query,
        ...search,
        results: explained.results,
        match: explained.match,
      },
    };
  }

  const messages = normalizeMessages(body.messages);
  const interview = await createInterviewDraft(messages, body);
  return {
    status: 200,
    body: {
      assistantMessage: buildAssistantMessage(interview.draft),
      draft: interview.draft,
      extraction: interview.extraction,
      storage: {
        tidbConfigured: isTidbConfigured(),
        defaultMode: isTidbConfigured() ? "tidb" : "memory",
        demoReadOnly: isDemoReadOnly(),
      },
    },
  };
}
