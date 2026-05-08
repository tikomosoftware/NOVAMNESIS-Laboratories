import { Header, Footer, Button, Info, SectionHeader } from "../components/SharedComponents";
import { sellNavItems, valuation, sellSteps } from "../data";

const campaignMemories = [
  {
    title: "青春・恋愛の記憶",
    description: "告白、失恋、文化祭、卒業式、言えなかった一言など、感情の輪郭が強い記憶。",
    estimate: "通常査定 120,000円 → キャンペーン 144,000円",
  },
  {
    title: "挑戦・挫折の記憶",
    description: "部活、受験、仕事、勝負の瞬間、負けた帰り道など、物語性のある体験。",
    estimate: "通常査定 260,000円 → キャンペーン 312,000円",
  },
  {
    title: "旅・移動の記憶",
    description: "一人旅、家族旅行、帰省、知らない街の朝など、感覚情報が豊かな記憶。",
    estimate: "通常査定 180,000円 → キャンペーン 216,000円",
  },
  {
    title: "仕事・専門性の記憶",
    description: "職人技、交渉、初契約、現場判断、長年の習熟が残る記憶。",
    estimate: "通常査定 420,000円 → キャンペーン 504,000円",
  },
];

const campaignFaqs = [
  {
    question: "20%増額はどの金額に対して適用されますか？",
    answer: "倫理審査と匿名化処理後に確定した通常査定額に対して、キャンペーン係数 1.2 を適用します。",
  },
  {
    question: "記憶を売ると、その記憶はなくなりますか？",
    answer: "通常ライセンスでは失われません。独占ライセンスの場合のみ、契約範囲に応じて一部アクセス制限が発生する可能性があります。",
  },
  {
    question: "どんな記憶でも対象ですか？",
    answer: "本人同意があり、第三者情報の匿名化が可能で、倫理審査を通過した記憶が対象です。未成年期・トラウマ・犯罪に関わる記憶は追加審査になります。",
  },
];

export default function MemoryBuybackCampaignPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={sellNavItems} cta="20%増額で査定する" ctaHref="#apply" tone="corporate" />

      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_14%,rgba(255,79,216,0.26),transparent_30%),radial-gradient(circle_at_78%_16%,rgba(88,244,255,0.22),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_68%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-30" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.04fr_0.96fr]">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">Limited Buyback Campaign</p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
              あなたの記憶、いまだけ20%増しで買い取ります。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              初恋、挫折、旅、仕事、家族との一瞬。あなたにとっては過去でも、誰かにとっては体験したかった人生かもしれません。
              Neuramnesia は、同意済みの体験記憶を匿名化・編集し、記憶商品として再構成します。
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="#apply" tone="corporate">20%増額で査定する</Button>
              <Button href="#eligible" tone="corporate" variant="secondary">対象の記憶を見る</Button>
            </div>
            <p className="mt-5 text-xs leading-6 text-slate-500">
              本キャンペーンは架空のデモサイト上の表現です。実在する医療・金融・記憶操作サービスではありません。
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-cyanline/20 bg-white/[0.05] p-6 shadow-glow backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse" />
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyanline">Campaign Multiplier</p>
            <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
              <div className="rounded-3xl border border-white/10 bg-obsidian/70 p-5 text-center">
                <p className="text-xs text-slate-500">通常査定</p>
                <p className="mt-2 text-3xl font-semibold text-white">100%</p>
              </div>
              <div className="text-2xl font-semibold text-magentapulse">→</div>
              <div className="rounded-3xl border border-cyanline/25 bg-cyanline/10 p-5 text-center">
                <p className="text-xs text-cyanline">キャンペーン査定</p>
                <p className="mt-2 text-4xl font-semibold text-white">120%</p>
              </div>
            </div>
            <div className="mt-8 rounded-3xl border border-magentapulse/20 bg-magentapulse/5 p-5">
              <p className="text-sm font-semibold text-white">例: 通常査定 250,000円の記憶</p>
              <p className="mt-3 text-4xl font-semibold text-cyanline">300,000円</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">感情強度・希少性・物語性・安全性の審査後、確定査定額に20%を上乗せします。</p>
            </div>
          </div>
        </div>
      </section>

      <section id="eligible" className="section">
        <SectionHeader
          eyebrow="Eligible Memories"
          title="キャンペーン対象の記憶。"
          description="短い思い出から、人生の転機になった体験まで。匿名化と倫理審査を通過できる記憶が対象です。"
        />
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          {campaignMemories.map((item) => (
            <article key={item.title} className="plan-card">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-4 min-h-28 text-sm leading-7 text-slate-300">{item.description}</p>
              <p className="mt-5 rounded-2xl border border-cyanline/20 bg-cyanline/5 p-4 text-sm leading-7 text-cyanline">{item.estimate}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-15" />
        <SectionHeader
          eyebrow="Valuation Logic"
          title="査定額は、思い出の長さだけでは決まりません。"
          description="数分の記憶でも、感情の強度や希少性が高ければ高く評価されます。"
        />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {valuation.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="apply" className="section">
        <SectionHeader
          eyebrow="Apply Flow"
          title="20%増額で査定する流れ。"
          description="通常の売却プロセスにキャンペーン係数を適用します。査定だけで売却は確定しません。"
        />
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {sellSteps.map((step, index) => (
            <div key={step} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <span className="text-xs font-semibold text-cyanline">STEP {String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 font-medium leading-7 text-slate-200">{step}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-4xl rounded-[2rem] border border-cyanline/20 bg-white/[0.04] p-6 text-center backdrop-blur-xl">
          <p className="text-base leading-8 text-slate-300">まずは記憶候補を登録し、通常査定額と20%増額後の金額を確認できます。</p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Button href="/sell#valuation" tone="corporate">通常査定ページへ進む</Button>
            <Button href="/contact" tone="corporate" variant="secondary">相談してから申し込む</Button>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          {campaignFaqs.map((faq) => (
            <div key={faq.question} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold leading-7 text-white">{faq.question}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer items={sellNavItems} />
    </main>
  );
}
