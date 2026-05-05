type Plan = {
  title: string;
  description: string;
  category: string;
  duration: string;
  memorySpan: string;
  risk: string;
  source: string;
};

type SimpleCard = {
  title: string;
  description: string;
};

type Faq = {
  question: string;
  answer: string;
};

const navItems = [
  { label: "Experience", href: "#experience" },
  { label: "Marketplace", href: "#marketplace" },
  { label: "Sell Memory", href: "#sell" },
  { label: "Safety", href: "#safety" },
  { label: "FAQ", href: "#faq" },
];

const plans: Plan[] = [
  {
    title: "Secret Agent Mission",
    description: "誰にも知られず世界の均衡を保つ、匿名化済み潜入任務。",
    category: "Covert Hero",
    duration: "42分",
    memorySpan: "11日間",
    risk: "Medium",
    source: "ハイブリッド",
  },
  {
    title: "Mars Colony Escape",
    description: "赤い惑星の薄い空気と警報音の中、植民地から脱出する。",
    category: "SF Survival",
    duration: "50分",
    memorySpan: "3週間",
    risk: "High",
    source: "人工生成",
  },
  {
    title: "Executive Success",
    description: "巨大企業のCEOとして、ひとつの決断で市場を動かす。",
    category: "Career Elite",
    duration: "35分",
    memorySpan: "18カ月",
    risk: "Low",
    source: "匿名化済み実体験",
  },
  {
    title: "Lost Romance",
    description: "すでに終わったはずの恋を、記憶の中でもう一度だけ。",
    category: "Romance",
    duration: "38分",
    memorySpan: "6週間",
    risk: "Medium",
    source: "匿名化済み実体験",
  },
  {
    title: "Deep Space Vacation",
    description: "深宇宙クルーズの静寂と、窓外に浮かぶ知らない光。",
    category: "Luxury Travel",
    duration: "47分",
    memorySpan: "9日間",
    risk: "Low",
    source: "人工生成",
  },
  {
    title: "Heroic Rescue",
    description: "絶体絶命の現場で、誰かの未来を取り戻した記憶。",
    category: "Hero",
    duration: "44分",
    memorySpan: "72時間",
    risk: "High",
    source: "ハイブリッド",
  },
  {
    title: "Stadium Legend Final",
    description: "満員のスタジアムで、最後の一球に人生を預けるトップアスリート体験。",
    category: "Sports Career",
    duration: "40分",
    memorySpan: "14年間",
    risk: "Medium",
    source: "ハイブリッド",
  },
  {
    title: "World Tour Artist",
    description: "照明、歓声、震える指先。世界ツアー初日のステージに立つ記憶。",
    category: "Artist Career",
    duration: "36分",
    memorySpan: "8カ月",
    risk: "Low",
    source: "匿名化済み実体験",
  },
  {
    title: "Virtual Hero Origin",
    description: "誰も知らない街で目覚め、はじめて誰かを救う仮想ヒーロー誕生譚。",
    category: "Virtual Hero",
    duration: "48分",
    memorySpan: "21日間",
    risk: "Medium",
    source: "人工生成",
  },
  {
    title: "Neon Heroine Protocol",
    description: "企業都市の夜を駆け抜け、失われた真実に手を伸ばすヒロイン体験。",
    category: "Virtual Heroine",
    duration: "46分",
    memorySpan: "12日間",
    risk: "Medium",
    source: "人工生成",
  },
  {
    title: "Isekai Rebirth Archive",
    description: "見知らぬ王都で第二の名前を与えられ、選ばなかった人生を始める。",
    category: "Another World",
    duration: "55分",
    memorySpan: "2年間",
    risk: "High",
    source: "人工生成",
  },
  {
    title: "Royal Academy Spellcraft",
    description: "魔術と政治が交差する学院で、才能と秘密を抱えて卒業式を迎える。",
    category: "Fantasy Career",
    duration: "52分",
    memorySpan: "3年間",
    risk: "Medium",
    source: "人工生成",
  },
];

const experienceMenus: SimpleCard[] = [
  {
    title: "スポーツ選手の人生",
    description: "プロ契約、代表選考、決勝戦、引退試合まで。身体感覚と歓声を中心に構成された競技人生テンプレート。",
  },
  {
    title: "アーティストの人生",
    description: "初舞台、創作の孤独、世界ツアー、観客の熱狂。才能を持って生きた記憶の連続体験。",
  },
  {
    title: "職業マスタリー",
    description: "料理人、建築家、研究者、職人、交渉人。熟練した手つきや判断力だけを安全に抽出したキャリア記憶。",
  },
  {
    title: "仮想ヒーロー",
    description: "都市の危機、正体を隠す日常、誰かを救う瞬間。現実には存在しない英雄譚を記憶として残します。",
  },
  {
    title: "仮想ヒロイン",
    description: "陰謀、友情、選択、覚醒。物語の中心に立つ人生を、過度な恐怖ではなく静かな没入感で設計します。",
  },
  {
    title: "異世界転生",
    description: "第二の名前、知らない言語、選ばれた役割。現実と混同しない境界タグ付きのファンタジー記憶。",
  },
];

const valuation: SimpleCard[] = [
  { title: "感情強度", description: "歓喜、喪失、緊張、安堵など、記憶に残る感情の深さを測定します。" },
  { title: "希少性", description: "一般的には体験困難な状況、職能、場所、人生局面ほど高く評価されます。" },
  { title: "物語性", description: "始まり、転機、結末がある記憶は、体験商品として再構成しやすくなります。" },
  { title: "感覚情報の鮮明さ", description: "匂い、温度、音、身体感覚の密度が没入度の基礎になります。" },
  { title: "倫理審査レベル", description: "第三者情報や心理負荷を評価し、安全な流通範囲を決定します。" },
  { title: "再体験需要", description: "購入者が求める願望、学習、憧れとの一致度を分析します。" },
];

const categories: SimpleCard[] = [
  { title: "First Love Memory", description: "初恋、告白、失恋、再会など、感情強度の高い記憶。" },
  { title: "Extreme Survival", description: "遭難、災害、極限状態からの生還など、危険度の高い体験。" },
  { title: "Professional Mastery", description: "一流職人、外科医、音楽家、アスリートなどの熟練体験。" },
  { title: "Executive Decision", description: "経営判断、交渉、勝負の瞬間など、責任ある立場の記憶。" },
  { title: "Hidden Travel", description: "普通の観光では得られない、個人的で濃密な旅の記憶。" },
  { title: "Farewell Archive", description: "別れ、喪失、卒業、人生の転機に関する記憶。" },
];

const sellSteps = [
  "事前カウンセリング",
  "記憶候補の登録",
  "感情強度・希少性スキャン",
  "匿名化・第三者情報除去",
  "倫理審査",
  "価格査定",
  "ライセンス契約",
  "マーケットプレイス掲載",
];

const safetyItems = [
  "記憶挿入前の心理スキャン",
  "記憶と現実の境界維持プロトコル",
  "緊急覚醒システム",
  "認定ニューロエンジニア監修",
  "体験後の認知安定セッション",
  "記憶混同リスクの事前評価",
  "高リスク記憶の段階的再生制御",
];

const ethics = [
  "本人同意なしの記憶抽出は禁止",
  "第三者の個人情報は自動匿名化",
  "トラウマ記憶は高リスク審査対象",
  "未成年期の記憶は制限付き",
  "犯罪・暴力・搾取に関わる記憶は厳格審査",
  "独占ライセンス契約では、提供者側の記憶アクセスに制限が発生する可能性がある",
  "購入者には、体験後の現実復帰ガイダンスを提供する",
];

const reviews = [
  "たった45分の体験だったのに、今でもあの砂嵐の匂いを覚えています。",
  "平凡な会社員に戻ったはずなのに、なぜか暗号を見ると読めてしまう気がします。",
  "売却したのは、もう思い出したくない旅の記憶でした。でも最近、誰かがその続きを見ている気がします。",
  "CEO体験を購入してから、会議室の景色が少し違って見えるようになりました。",
];

const faqs: Faq[] = [
  {
    question: "これは夢ですか？",
    answer: "夢ではありません。MEMORIA は体験後に残る記憶印象を設計する架空のサービスです。目覚めたあとも、記憶は静かに日常へ重なります。",
  },
  {
    question: "記憶は消せますか？",
    answer: "体験直後の軽減処理は可能です。ただし、強い感情を伴う記憶は完全な無痕化を保証していません。",
  },
  {
    question: "本当に安全ですか？",
    answer: "体験前後に複数の安全プロトコルを設けています。高リスク記憶は段階的に再生され、必要に応じて中断されます。",
  },
  {
    question: "現実と混同しませんか？",
    answer: "境界維持タグを付与し、現実復帰ガイダンスを提供します。それでも、良い記憶ほど現実に似てしまうことがあります。",
  },
  {
    question: "体験後に副作用はありますか？",
    answer: "一時的な既視感、感情の残響、選ばなかった人生への郷愁が報告されています。多くは短期間で落ち着きます。",
  },
  {
    question: "自分の記憶を売ると、その記憶は失われますか？",
    answer: "通常売却では失われません。独占ライセンスでは、契約範囲に応じて一部アクセス制限が発生する場合があります。",
  },
  {
    question: "売却した記憶に他人がアクセスするのですか？",
    answer: "他人が体験するのは匿名化・編集・再構成された記憶商品です。あなた自身の生の記憶がそのまま流通することはありません。",
  },
  {
    question: "第三者が登場する記憶はどう処理されますか？",
    answer: "顔、声、氏名、関係性、識別可能な生活情報を自動匿名化し、必要に応じて人物構造を置換します。",
  },
  {
    question: "トラウマ記憶も販売できますか？",
    answer: "申請は可能ですが、高リスク審査の対象です。販売よりも保全、封印、非公開アーカイブを推奨する場合があります。",
  },
  {
    question: "独占ライセンスとは何ですか？",
    answer: "特定の購入者や企業が、一定期間その記憶商品の利用権を独占する契約です。提供者にも静かな制約が残ることがあります。",
  },
];

function notify(message: string) {
  window.alert(`${message}\n\nMEMORIA は架空のデモサイトです。`);
}

function SectionHeader({
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

function Button({
  children,
  variant = "primary",
}: {
  children: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      className={`rounded-full px-6 py-3 text-sm font-semibold transition duration-300 focus:outline-none focus:ring-2 focus:ring-cyanline focus:ring-offset-2 focus:ring-offset-obsidian ${
        variant === "primary"
          ? "bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse text-obsidian shadow-glow hover:-translate-y-0.5"
          : "border border-white/15 bg-white/5 text-white hover:border-cyanline/60 hover:bg-white/10"
      }`}
      onClick={() => notify(children)}
      type="button"
    >
      {children}
    </button>
  );
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-obsidian/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="#top" className="group">
          <div className="text-lg font-semibold tracking-[0.22em] text-white">MEMORIA</div>
          <div className="text-[11px] text-slate-400 transition group-hover:text-cyanline">Memory Experience Marketplace</div>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
              {item.label}
            </a>
          ))}
        </div>
        <Button>記憶を体験する</Button>
      </nav>
    </header>
  );
}

function HeroVisual() {
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

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(88,244,255,0.15),transparent_30%),radial-gradient(circle_at_75%_10%,rgba(255,79,216,0.14),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_65%,#060711_100%)]" />
      <div className="absolute inset-0 -z-10 memoria-grid opacity-40" />
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-14 px-5 pb-24 lg:grid-cols-[1.03fr_0.97fr]">
        <div className="animate-fadeIn">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.32em] text-cyanline">MEMORIA — Memory Experience Marketplace</p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">記憶は、もう資産になる。</h1>
          <p className="mt-7 max-w-2xl text-lg leading-9 text-slate-300">
            MEMORIA は、人間の体験記憶を記録・匿名化・再構成し、誰かの“もうひとつの人生”として届ける記憶体験マーケットプレイスです。
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Button>記憶を体験する</Button>
            <Button variant="secondary">記憶を売却する</Button>
          </div>
          <div className="mt-10 grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
            <p className="glass-panel">退屈な人生に、もうひとつの記憶を。</p>
            <p className="glass-panel">あなたが体験しなかった過去を、記憶として手に入れる。</p>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

function Problem() {
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

function Service() {
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
        description="MEMORIA の体験は、あなたの現在を変えずに、あなたの過去の輪郭だけを増やします。"
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

function Marketplace() {
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
    </section>
  );
}

function Plans() {
  return (
    <section className="section">
      <SectionHeader
        eyebrow="Catalog"
        title="あったかもしれない人生を選ぶ。"
        description="スポーツ選手、アーティスト、仮想ヒーロー、異世界転生。MEMORIA のデフォルトテンプレートは、現実では選べなかった人生を記憶商品として再設計します。"
      />
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <article key={plan.title} className="plan-card group">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-magentapulse">{plan.category}</p>
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-semibold text-white">{plan.title}</h3>
              <span className="rounded-full border border-cyanline/30 px-3 py-1 text-xs text-cyanline">{plan.risk}</span>
            </div>
            <p className="mt-4 min-h-16 text-sm leading-7 text-slate-300">{plan.description}</p>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <Info label="体験時間" value={plan.duration} />
              <Info label="記憶内期間" value={plan.memorySpan} />
              <Info label="由来" value={plan.source} wide />
            </dl>
            <div className="mt-7">
              <Button>この記憶を予約する</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ExperienceMenu() {
  return (
    <section className="section">
      <SectionHeader
        eyebrow="Default Templates"
        title="人生メニューから、記憶を選ぶ。"
        description="MEMORIA では、単発の出来事だけでなく、職業・役割・物語アーキタイプごとに設計された一連の人生テンプレートを選択できます。"
      />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
        {experienceMenus.map((menu, index) => (
          <article key={menu.title} className="glass-card hover:-translate-y-1 hover:border-cyanline/30 hover:shadow-glow">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyanline/25 bg-cyanline/10 text-sm font-semibold text-cyanline">
              {String(index + 1).padStart(2, "0")}
            </div>
            <h3 className="text-xl font-semibold text-white">{menu.title}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-300">{menu.description}</p>
            <button
              className="mt-6 text-sm font-semibold text-cyanline transition hover:text-white"
              onClick={() => notify(`${menu.title}を見る`)}
              type="button"
            >
              テンプレートを見る
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

function Info({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`rounded-2xl bg-white/[0.04] p-3 ${wide ? "col-span-2" : ""}`}>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-200">{value}</dd>
    </div>
  );
}

function SellMemory() {
  return (
    <section id="sell" className="section">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Sell Your Memory</p>
          <h2 className="text-4xl font-semibold leading-tight text-white">あなたの記憶には、まだ価値がある。</h2>
          <p className="mt-6 text-base leading-8 text-slate-300">
            初恋、成功、挫折、旅、勝負の瞬間。あなたにとっては過去でも、誰かにとっては体験したかった人生かもしれません。
            MEMORIA は、あなたの記憶を匿名化し、感情強度・希少性・没入度を評価したうえで、記憶体験として再構成します。
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

function CardGrid({ eyebrow, title, items }: { eyebrow: string; title: string; items: SimpleCard[] }) {
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

function Process() {
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

function Safety() {
  return (
    <section id="safety" className="section">
      <SectionHeader
        eyebrow="Safety"
        title="安全とは、忘れないための設計です。"
        description="MEMORIA は体験前、体験中、体験後の各段階で、現実と記憶の境界を保つための架空プロトコルを実行します。"
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
        <div className="glass-card">
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

function Reviews() {
  return (
    <section className="section">
      <SectionHeader eyebrow="Testimonials" title="体験後に残った言葉。" />
      <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
        {reviews.map((review, index) => (
          <figure key={review} className="glass-card">
            <blockquote className="text-lg leading-8 text-slate-200">“{review}”</blockquote>
            <figcaption className="mt-6 text-sm text-slate-500">MEMORIA participant #{2031 + index}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="section">
      <SectionHeader eyebrow="FAQ" title="よくある質問。" />
      <div className="mx-auto grid max-w-5xl gap-4">
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
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-cyanline/20 bg-[radial-gradient(circle_at_15%_20%,rgba(88,244,255,0.18),transparent_28%),radial-gradient(circle_at_85%_40%,rgba(255,79,216,0.16),transparent_30%),rgba(255,255,255,0.04)] p-8 text-center shadow-glow md:p-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Begin Again</p>
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold leading-tight text-white">あなたが本当に欲しかった人生を、記憶から始めよう。</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300">
          体験するか、提供するか。MEMORIA は、あなたの過去と未来に新しい選択肢を与えます。
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button>記憶を体験する</Button>
          <Button variant="secondary">記憶を査定する</Button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_1fr_1.4fr]">
        <div>
          <div className="text-lg font-semibold tracking-[0.22em] text-white">MEMORIA</div>
          <p className="mt-2 text-sm text-slate-400">Memory Experience Marketplace</p>
          <p className="mt-4 text-sm text-slate-500">架空企業情報 / Demo Corporate Profile</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-3">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-slate-400 hover:text-white">
              {item.label}
            </a>
          ))}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-slate-400">
          <p>本サイトは架空のデモサイトです。</p>
          <p>実在する医療・金融・記憶操作サービスではありません。</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header />
      <Hero />
      <Problem />
      <Service />
      <Marketplace />
      <ExperienceMenu />
      <Plans />
      <SellMemory />
      <CardGrid eyebrow="Memory Valuation" title="記憶資産の査定基準。" items={valuation} />
      <CardGrid eyebrow="Purchase Categories" title="買い取り対象の記憶カテゴリ。" items={categories} />
      <Process />
      <Safety />
      <Reviews />
      <FAQ />
      <FinalCta />
      <Footer />
    </main>
  );
}
