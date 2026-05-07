import React from "react";
import { Tone, SimpleCard, Review, Faq } from "../types";
import { plans, reviews, faqs, faqsSell, sellSteps, roomZones, sessionSteps, bodyStates, experienceEntryOptions, safetyItems, ethics, valuation, categories, purchaseUseCases, experienceMenus, memoryEpisodes, landingNavItems } from "../data";

export function notify(message: string) {
  window.alert(`${message}\n\nNovamnesis Laboratories は架空のデモサイトです。`);
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
      {description && <p className="mt-5 text-base leading-8 text-slate-300">{description}</p>}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  tone = "dark",
  href,
}: {
  children: string;
  variant?: "primary" | "secondary";
  tone?: Tone;
  href?: string;
}) {
  const classes =
    tone === "corporate"
      ? variant === "primary"
        ? "border border-cyanline/30 bg-cyanline text-obsidian shadow-[0_0_24px_rgba(88,244,255,0.16)] hover:-translate-y-0.5 hover:bg-white"
        : "border border-white/15 bg-white/[0.03] text-slate-100 hover:border-cyanline/45 hover:bg-white/[0.07]"
      : tone === "light"
        ? variant === "primary"
          ? "bg-slate-950 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800"
          : "border border-slate-300 bg-white text-slate-800 hover:border-slate-500 hover:bg-slate-50"
        : variant === "primary"
          ? "bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse text-obsidian shadow-glow hover:-translate-y-0.5"
          : "border border-white/15 bg-white/5 text-white hover:border-cyanline/60 hover:bg-white/10";

  const className = `rounded-full px-6 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 ${tone === "light" ? "focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-white" : "focus:ring-cyanline focus:ring-offset-2 focus:ring-offset-obsidian"
    } ${classes}`;

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button className={className} onClick={() => notify(children)} type="button">
      {children}
    </button>
  );
}

export function LogoMark({ tone = "dark", className = "h-10 w-10" }: { tone?: Tone; className?: string }) {
  const shell = tone === "light" ? "text-slate-950" : "text-cyanline";
  const core = tone === "light" ? "#0f172a" : "#58f4ff";
  const pulse = tone === "light" ? "#475569" : "#ff4fd8";

  return (
    <svg className={`${className} ${shell}`} viewBox="0 0 64 64" role="img" aria-label="Novamnesis Laboratories logo mark">
      <path
        d="M32 4 54 16.5v31L32 60 10 47.5v-31L32 4Z"
        fill="currentColor"
        fillOpacity={tone === "light" ? 0.08 : 0.1}
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M20 44V20l24 24V20" fill="none" stroke={core} strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
      <path d="M18 20c8-8 20-8 28 0M18 44c8 8 20 8 28 0" fill="none" stroke={pulse} strokeLinecap="round" strokeWidth="2" opacity="0.78" />
      <circle cx="20" cy="20" r="3.4" fill={pulse} />
      <circle cx="44" cy="44" r="3.4" fill={core} />
    </svg>
  );
}

export function BrandLockup({ tone = "dark" }: { tone?: Tone }) {
  return (
    <div className="flex items-center gap-4">
      <LogoMark tone={tone} className="h-12 w-12" />
      <div>
        <div className={`text-lg font-semibold tracking-[0.18em] sm:text-xl ${tone === "light" ? "text-slate-950" : "text-white"}`}>NEURAMNESIA</div>
        <div className={`text-xs transition ${tone === "light" ? "text-slate-500 group-hover:text-slate-800" : "text-slate-400 group-hover:text-cyanline"}`}>
          Memory Experience Marketplace
        </div>
      </div>
    </div>
  );
}

export function Header({
  items,
  cta,
  tone = "dark",
  ctaHref,
}: {
  items: { label: string; href: string }[];
  cta?: string;
  tone?: Tone;
  ctaHref?: string;
}) {
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl ${tone === "light" ? "border-slate-200 bg-white/90" : "border-white/10 bg-obsidian/80"
        }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="/" className="group">
          <BrandLockup tone={tone} />
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm transition ${tone === "light" ? "text-slate-600 hover:text-slate-950" : "text-cyanline/85 hover:text-cyanline hover:drop-shadow-[0_0_6px_rgba(88,244,255,0.42)]"}`}
            >
              {item.label}
            </a>
          ))}
        </div>
        {cta && ctaHref ? (
          <a
            href={ctaHref}
            className={`rounded-full px-6 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyanline focus:ring-offset-2 ${tone === "light"
              ? "bg-slate-950 text-white hover:-translate-y-0.5 focus:ring-offset-white"
              : "bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse text-obsidian shadow-glow hover:-translate-y-0.5 focus:ring-offset-obsidian"
              }`}
          >
            {cta}
          </a>
        ) : cta ? (
          <Button tone={tone}>{cta}</Button>
        ) : null}
      </nav>
    </header>
  );
}

export function HeroVisual() {
  const bars = Array.from({ length: 18 }, (_, index) => index);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] animate-float rounded-full border border-cyanline/20 bg-white/[0.03] p-6 shadow-glow">
      <div className="absolute inset-8 rounded-full border border-magentapulse/20" />
      <div className="absolute inset-16 rounded-full border border-violetsignal/20" />
      <div className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(88,244,255,0.28),rgba(157,109,255,0.08)_45%,transparent_70%)] blur-sm" />
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div className="h-1/2 w-full animate-scan bg-gradient-to-b from-transparent via-cyanline/20 to-transparent" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center gap-2">
        {bars.map((bar) => (
          <span
            key={bar}
            className="h-20 w-1 rounded-full bg-gradient-to-t from-magentapulse via-cyanline to-violetsignal opacity-80"
            style={{
              height: `${48 + Math.sin(bar * 0.8) * 28 + (bar % 3) * 16}px`,
              animation: `pulse ${1.8 + (bar % 5) * 0.2}s ease-in-out infinite`,
              animationDelay: `${bar * 0.08}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-16 left-1/2 w-64 -translate-x-1/2 rounded-full border border-white/10 bg-obsidian/70 px-5 py-3 text-center text-xs text-cyanline backdrop-blur-md">
        MEMORY STREAM 08.17 / CONSENT VERIFIED
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(88,244,255,0.15),transparent_30%),radial-gradient(circle_at_75%_10%,rgba(255,79,216,0.14),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_65%,#060711_100%)]" />
      <div className="absolute inset-0 -z-10 novamnesis-grid opacity-40" />
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-5 pb-24 lg:grid-cols-[1.03fr_0.97fr]">
        <div className="animate-fadeIn">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyanline">Neuramnesia — Memory Experience Marketplace</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">あなたが本当に欲しかった人生を、記憶から始めよう。</h1>
          <p className="mt-7 max-w-2xl text-lg leading-9 text-slate-300">
            Neuramnesia は、恋愛、成功、旅行、結婚、挫折、性別を入れ替えた人生まで、経験できなかった過去を記憶として購入できるマーケットプレイスです。
          </p>
          <div className="mt-10 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <p className="glass-panel">青春の恋も、行けなかった旅も、選ばなかった結婚も。</p>
            <p className="glass-panel">幸せな記憶も、挫折の記憶も、人生の厚みとして手に入れる。</p>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

export function CatalogHero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(255,79,216,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(88,244,255,0.18),transparent_32%),linear-gradient(180deg,#060711_0%,#0c1020_70%,#060711_100%)]" />
      <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-20 text-center">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyanline">Neuramnesia Catalog</p>
        <h1 className="mx-auto max-w-5xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
          買いたくなる過去を、記憶メニューから選ぶ。
        </h1>
        <p className="mx-auto mt-7 max-w-3xl text-lg leading-9 text-slate-300">
          ここでは、購入可能な記憶体験を一覧できます。短い思い出から、選ばなかった人生、物語性の強い記憶まで、体験したい過去を選べます。
        </p>
      </div>
    </section>
  );
}

export function Problem() {
  const points = [
    "毎日同じ通勤、同じ仕事、同じ夜。",
    "本当に欲しかった人生は、まだ体験できていない。",
    "あなたがすでに体験した人生の一部は、誰かにとって強く望まれる記憶かもしれない。",
    "記憶は、消えていくものではなく、保存され、編集され、流通する資産になりつつある。",
  ];

  return (
    <section className="section">
      <SectionHeader eyebrow="Unlived Life" title="あなたの人生は、本当にこれだけですか？" />
      <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
        {points.map((point) => (
          <div key={point} className="glass-card text-lg leading-8 text-slate-200">
            {point}
          </div>
        ))}
      </div>
    </section>
  );
}

export function PurchaseUseCases() {
  return (
    <section id="use-cases" className="section">
      <SectionHeader
        eyebrow="Purchase Motives"
        title="買う理由は、後悔だけではない。"
        description="Novamnesis Laboratories は「なかったことを埋める」だけのサービスではありません。恋愛、成功、旅行、結婚、性別、挫折。人生の手触りを増やすために、欲しい記憶を選べます。"
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
        {purchaseUseCases.map((item) => (
          <article key={item.title} className="plan-card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <span className="rounded-full border border-cyanline/25 bg-cyanline/10 px-3 py-1 text-xs font-semibold text-cyanline">
                {item.label}
              </span>
              <span className="text-xs text-slate-500">{item.startingPrice}</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-magentapulse">{item.desire}</p>
            <h3 className="mt-4 text-2xl font-semibold leading-8 text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            <div className="mt-6 grid gap-2">
              {item.examples.map((example) => (
                <p key={example} className="rounded-2xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm leading-6 text-slate-300">
                  {example}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-5xl rounded-[2rem] border border-magentapulse/20 bg-magentapulse/5 p-6 text-center backdrop-blur-xl">
        <p className="text-base leading-8 text-slate-200">
          幸せな記憶を足すことも、失敗の記憶を足すことも、どちらも人生を豊かにする選択です。Neuramnesia では購入前に感情強度と境界タグを調整し、現実の自分を保ったまま「経験したかった人生」を持ち帰れるように設計します。
        </p>
      </div>
    </section>
  );
}

export function Service() {
  const items = [
    "人工記憶や編集済みの実体験記憶によって、特別な人生を記憶として体験できます。",
    "体験は数十分でも、記憶上は数日・数週間の冒険として残ります。",
    "感情強度、物語性、感覚情報、倫理審査レベルに基づいて調整されます。",
    "体験前にカウンセリングと記憶整合性チェックを行います。",
    "体験後には現実復帰のための認知安定プロトコルを行います。",
  ];

  return (
    <section id="experience" className="section">
      <SectionHeader
        eyebrow="Experience Layer"
        title="現実ではなく、記憶として体験する。"
        description="Neuramnesia の体験は、あなたの現在を変えずに、あなたの過去の輪郭だけを増やします。"
      />
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-magenta backdrop-blur-xl md:p-10">
        <div className="grid gap-4 md:grid-cols-5">
          {items.map((item, index) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-obsidian/60 p-5">
              <span className="text-xs text-cyanline">0{index + 1}</span>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FacilityTeaser() {
  return (
    <section className="section pt-4">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-cyanline/20 shadow-glow">
          <img
            src="/images/facility-hero.png"
            alt="未来的なリクライニングチェアでニューロクラウンを装着し記憶定着を受けている様子"
            className="aspect-[16/10] w-full object-cover"
          />
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Facility Preview</p>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">安心して体験に入れる、静かな空間です。</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            記憶体験が不安に見える理由は、仕組みよりも場面が見えないことにあります。Neuramnesia の施設ページでは、来館から覚醒後のケアまでを、身体感覚が想像できる粒度で案内します。
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <a
              href="/facility"
              className="rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5"
            >
              施設と体験の流れを見る
            </a>
            <a
              href="/safety"
              className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-300 hover:border-cyanline/60 hover:bg-white/10"
            >
              安全基準を見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Marketplace() {
  return (
    <section id="marketplace" className="section">
      <SectionHeader
        eyebrow="Memory Marketplace"
        title="人生は、共有できる資産になる。"
        description="記憶はそのまま販売されません。個人情報や第三者情報を除去し、没入度・感情強度・現実混同リスクを評価したうえで、体験商品として再構成されます。"
      />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
        {[
          ["Buy", "他人の人生の一部や、編集済みの冒険・成功・恋愛・旅・極限体験を記憶として体験できます。"],
          ["Sell", "提供者は、自分の記憶を記憶資産として登録し、査定結果に応じてライセンスできます。"],
          ["Rate", "すべての記憶には、没入度・感情強度・現実混同リスクのレーティングが付与されます。"],
        ].map(([title, text]) => (
          <div key={title} className="glass-card">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-magentapulse">{title}</p>
            <p className="mt-5 text-base leading-8 text-slate-300">{text}</p>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-cyanline/20 bg-cyanline/5 p-5 text-center backdrop-blur-xl">
        <p className="text-sm leading-7 text-slate-300">
          記憶の購入はオンラインで完結しますが、記憶の定着は実店舗で行います。日時を予約いただければ、記憶の選択は来館時でも可能です。
        </p>
      </div>
    </section>
  );
}

export function CatalogTeaser() {
  return (
    <section className="section">
      <SectionHeader
        eyebrow="Catalog Preview"
        title="欲しかった人生は、メニューにある。"
        description="このLPでは、まず記憶体験の世界観を紹介します。具体的なスポーツ選手、アーティスト、ヒーロー、異世界転生などの購入メニューは、専用カタログで選べます。"
      />
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-cyanline/20 bg-white/[0.04] p-8 text-center shadow-glow backdrop-blur-xl">
        <p className="text-lg leading-8 text-slate-200">
          他人の記憶を覗くのではなく、あなたの中に「体験済みの過去」として残す。Novamnesis Catalog では、そのための人生テンプレートを購買導線として整理しています。
        </p>
        <div className="mt-8">
          <a
            href="/catalog"
            className="inline-flex rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5"
          >
            人生メニューを見る
          </a>
        </div>
      </div>
    </section>
  );
}

export function Plans() {
  return (
    <section id="templates" className="section">
      <SectionHeader
        eyebrow="Catalog"
        title="あったかもしれない人生を選ぶ。"
        description="スポーツ選手、アーティスト、仮想ヒーロー、異世界転生。まず体験したい人生の型を選び、そこから具体的な記憶商品へ進めます。"
      />
      <div className="mx-auto mb-14 max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-magentapulse">Life Templates</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">長編テンプレート</h3>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {experienceMenus.map((menu, index) => (
            <article key={menu.title} className="glass-card hover:-translate-y-1 hover:border-cyanline/30 hover:shadow-glow">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyanline/25 bg-cyanline/10 text-sm font-semibold text-cyanline">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="text-xl font-semibold text-white">{menu.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{menu.description}</p>
              <a className="mt-6 inline-flex text-sm font-semibold text-cyanline transition hover:text-white" href={`/template/${menu.slug}`}>
                テンプレートを見る
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MemoryEpisodes() {
  return (
    <section id="episodes" className="section">
      <SectionHeader
        eyebrow="Short Memories"
        title="一生ではなく、あの数時間を買う。"
        description="青春、部活、恋愛、幼少期、敗北、達成。Novamnesis Laboratories では、一生分ではない短い記憶エピソードも選べます。"
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
        {memoryEpisodes.map((episode) => (
          <article key={episode.title} className="plan-card">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-magentapulse">{episode.tag}</p>
            <h3 className="text-lg font-semibold leading-7 text-white">{episode.title}</h3>
            <p className="mt-4 min-h-24 text-sm leading-7 text-slate-300">{episode.description}</p>
            <dl className="mt-6 grid gap-3 text-sm">
              <Info label="スパン" value={episode.period} />
              <Info label="感情" value={episode.intensity} />
              <Info label="由来" value={episode.source} />
            </dl>
            <div className="mt-7">
              <a
                href={`/episode/${episode.slug}`}
                className="inline-flex text-sm font-semibold text-cyanline transition hover:text-white"
              >
                体験内容を確認する
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Info({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white/[0.04] p-3 ${wide ? "col-span-2" : ""}`}>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-200">{value}</dd>
    </div>
  );
}

export function SellMemory() {
  return (
    <section id="sell" className="section">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Sell Your Memory</p>
          <h2 className="text-4xl font-semibold leading-tight text-white">あなたの記憶には、まだ価値がある。</h2>
          <p className="mt-6 text-base leading-8 text-slate-300">
            初恋、成功、挫折、旅、勝負の瞬間。あなたにとっては過去でも、誰かにとっては体験したかった人生かもしれません。
            Novamnesis Laboratories は、あなたの記憶を匿名化し、感情強度・希少性・没入度を評価したうえで、記憶体験として再構成します。
          </p>
          <p className="mt-5 rounded-2xl border border-magentapulse/20 bg-magentapulse/5 p-4 text-sm leading-7 text-slate-300">
            通常売却では、あなた自身の記憶は失われません。ただし、独占ライセンス契約では、一部の記憶アクセスに制限が発生する場合があります。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button>記憶を査定する</Button>
            <Button variant="secondary">売却プロセスを見る</Button>
          </div>
        </div>
        <div className="glass-card">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-sm text-slate-400">VALUATION PREVIEW</span>
            <span className="text-cyanline">JPY 428,000 - 910,000</span>
          </div>
          {valuation.slice(0, 4).map((item, index) => (
            <div key={item.title} className="mb-5">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-300">{item.title}</span>
                <span className="text-slate-500">{72 + index * 6}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-cyanline to-magentapulse" style={{ width: `${72 + index * 6}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CardGrid({ eyebrow, title, items }: { eyebrow: string; title: string; items: SimpleCard[] }) {
  return (
    <section className="section">
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="glass-card">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="section">
      <SectionHeader eyebrow="Process" title="記憶を売る流れ。" />
      <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sellSteps.map((step, index) => (
          <div key={step} className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <span className="text-xs text-cyanline">STEP {String(index + 1).padStart(2, "0")}</span>
            <p className="mt-4 font-medium text-white">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Safety() {
  return (
    <section id="safety" className="section">
      <SectionHeader
        eyebrow="Safety"
        title="安全とは、忘れないための設計です。"
        description="Novamnesis Laboratories は体験前、体験中、体験後の各段階で、現実と記憶の境界を保つための架空プロトコルを実行します。"
      />
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="glass-card">
          <h3 className="text-xl font-semibold text-white">Safety Controls</h3>
          <div className="mt-6 grid gap-3">
            {safetyItems.map((item) => (
              <p key={item} className="rounded-2xl border border-white/10 bg-obsidian/60 px-4 py-3 text-sm text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </div>
        <div id="ethics" className="glass-card">
          <h3 className="text-xl font-semibold text-white">Ethical Protocol</h3>
          <div className="mt-6 space-y-3">
            {ethics.map((item) => (
              <p key={item} className="border-l border-cyanline/40 pl-4 text-sm leading-7 text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="section">
      <SectionHeader
        eyebrow="Testimonials"
        title="体験後に残った言葉。"
        description="購入者が持ち帰ったのは、派手な夢ではなく、日常の見え方を少し変える記憶でした。"
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reviews.map((review, index) => (
          <figure key={`${review.memory}-${review.participant}`} className="glass-card">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <span className="rounded-full border border-magentapulse/25 bg-magentapulse/10 px-3 py-1 text-xs font-semibold text-magentapulse">
                {review.effect}
              </span>
              <span className="text-xs text-slate-500">#{2031 + index}</span>
            </div>
            <blockquote className="text-base leading-8 text-slate-200">“{review.quote}”</blockquote>
            <figcaption className="mt-6 text-sm text-slate-500">
              <span className="block text-slate-300">{review.memory}</span>
              <span className="mt-1 block">{review.participant}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="section">
      <SectionHeader eyebrow="FAQ" title="よくある質問。" />
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-cyanline">記憶を購入する方へ</p>
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <summary className="cursor-pointer list-none text-lg font-medium text-white">
                  <span className="inline-flex w-full items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-cyanline transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-magentapulse">記憶を売る方へ</p>
          <div className="grid gap-4">
            {faqsSell.map((faq) => (
              <details key={faq.question} className="group rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <summary className="cursor-pointer list-none text-lg font-medium text-white">
                  <span className="inline-flex w-full items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-cyanline transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-cyanline/20 bg-[radial-gradient(circle_at_15%_20%,rgba(88,244,255,0.18),transparent_28%),radial-gradient(circle_at_85%_40%,rgba(255,79,216,0.16),transparent_30%),rgba(255,255,255,0.04)] p-8 text-center shadow-glow md:p-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Begin Again</p>
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-white">経験したかった人生を、記憶として購入する。</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300">
          体験するか、提供するか。Novamnesis Laboratories は、あなたの過去と未来に新しい選択肢を与えます。
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button href="/booking">記憶を購入する</Button>
        </div>
      </div>
    </section>
  );
}


export function Footer({ items = landingNavItems, tone = "dark" }: { items?: { label: string; href: string }[]; tone?: Tone }) {
  return (
    <footer className={`border-t px-5 py-10 ${tone === "light" ? "border-slate-200 bg-white text-slate-700" : "border-white/10"}`}>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-magentapulse/20 bg-magentapulse/5 p-6 text-center backdrop-blur-xl">
          <p className="text-sm leading-7 text-slate-300">
            本サイトおよび NEURAMNESIA は架空の企業・サービスです。実在する医療・金融・記憶操作サービスではありません。
          </p>
        </div>
        <div className={`mt-8 border-t pt-6 text-center text-sm ${tone === "light" ? "border-slate-200 text-slate-500" : "border-white/10 text-slate-500"}`}>
          <p>&copy; {new Date().getFullYear()} NEURAMNESIA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

