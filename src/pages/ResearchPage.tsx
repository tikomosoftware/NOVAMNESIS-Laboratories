import React from "react";
import { landingNavItems } from "../data";
import { Header, Footer } from "../components/SharedComponents";

const researchHeroImageSrc = "/images/memory-research-lab.png";

const originCards = [
  {
    label: "Clinical Question",
    title: "深刻なトラウマを、記憶ごと消さずに扱えないか。",
    text: "研究の出発点は、強い心的外傷を抱える人が、出来事を完全に忘れるのではなく、記憶に触れたときの苦痛だけを弱められないかという問いでした。出来事の事実を壊さず、感情反応と身体反応の結びつきを調整する方法が最初のテーマでした。",
  },
  {
    label: "Damage Reduction",
    title: "精神的なダメージを軽減するため、別の記憶の支えを重ねる。",
    text: "恐怖や喪失の記憶だけを取り除こうとすると、本人の人生の連続性まで傷つけてしまうことがあります。そこで研究チームは、安心感、達成感、保護された感覚を持つ補助記憶を重ね、つらい記憶を孤立させない方向へ進みました。",
  },
  {
    label: "Synthetic Memory",
    title: "仮想の記憶が、現実の回復を助ける可能性が見えた。",
    text: "治療補助として作られた短い安全記憶や成功記憶が、体験者の自己像を変えることが確認されました。ここから、実在する他人の経験や人工的に設計された記憶を、本人の中に無理なく定着させる発想が生まれました。",
  },
];

const milestones = [
  {
    year: "2029",
    title: "感覚束ね込みモデルの確立",
    text: "記憶を映像として流し込むのではなく、匂い、重さ、声、迷い、身体反応を小さな束に分けて再構成する方式を確立しました。体験者が「見た」ではなく「そこにいた」と感じるための基礎になっています。",
  },
  {
    year: "2031",
    title: "境界タグの標準化",
    text: "購入した記憶を現実の履歴として誤認しないよう、日付、場所、同意記録、体験後ガイダンスを結びつけた境界タグを標準化しました。定着後も「これは取得した記憶である」と認識できる設計です。",
  },
  {
    year: "2033",
    title: "段階定着プロトコルの導入",
    text: "強い物語記憶や長期の人生分岐記憶を一度に定着させず、短い章に分けて反応を確認しながら進める方式を導入しました。違和感が出た場合は強度を下げ、必要に応じて中断します。",
  },
  {
    year: "2035",
    title: "NEURAMNESIAサービス化",
    text: "研究成果をもとに、カタログ選択、事前説明、同意確認、施設での定着、帰宅後の認知安定セッションまでをひとつのサービスとして整備しました。",
  },
];

const evidenceCards = [
  {
    label: "Fixation",
    title: "記憶は単体ではなく、感情と身体感覚で定着します。",
    text: "NEURAMNESIAでは、出来事の筋書きだけでなく、呼吸、姿勢、温度、ためらい、失敗の感覚までを設計します。これにより、他人由来の記憶でも、ただの鑑賞ではなく自分の経験に近い形で保持できます。",
  },
  {
    label: "Consent",
    title: "本人同意と第三者情報の処理を最初に固定します。",
    text: "提供者の同意がない記憶は扱いません。顔、声、氏名、生活情報は匿名化または人物構造へ置換し、体験者が取得するのは個人情報ではなく、再構成された経験の輪郭です。",
  },
  {
    label: "Boundary",
    title: "現実の記憶と混同しないための印を残します。",
    text: "定着した記憶には境界タグが付与されます。記憶そのものは自然に思い出せますが、由来を確認したい瞬間には、取得日、契約種別、体験メニューを思い出せるよう設計されています。",
  },
  {
    label: "Aftercare",
    title: "定着後の数日間を含めてサービスです。",
    text: "体験直後だけでなく、翌日以降の違和感、余韻、現実復帰のしやすさを確認します。強い記憶では、短い認知安定セッションを追加して日常へ戻る速度を調整します。",
  },
];

const serviceOutcomes = [
  "短い青春記憶や旅の記憶を、初回セッション向けの低負荷メニューとして提供できるようになりました。",
  "数年単位の人生分岐記憶を、複数回の章立てセッションとして安全に扱えるようになりました。",
  "提供者の記憶を失わせず、匿名化された体験商品として再構成できるようになりました。",
  "体験者が他人の記憶を自分の人生の厚みとして受け取りつつ、現実の履歴とは区別できる運用になりました。",
];

export default function ResearchPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={landingNavItems} />

      <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(88,244,255,0.20),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(255,79,216,0.13),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_68%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto grid max-w-7xl items-end gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">RESEARCH & FIXATION SCIENCE</p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
              他人の記憶を、自分の記憶として安心して受け取るために。
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
              NEURAMNESIAの記憶定着は、記憶を無理に上書きする技術ではありません。研究成果をもとに、感覚、感情、同意、境界タグ、アフターケアをひとつの手順として組み立て、購入した記憶を安全に持ち帰れる体験へ変えています。
            </p>
          </div>
          <figure className="overflow-hidden rounded-[2rem] border border-cyanline/20 bg-white/[0.045] shadow-glow">
            <img
              src={researchHeroImageSrc}
              alt="記憶定着研究ラボで、参加者が神経インターフェース付きチェアに横たわり、研究員がホログラムの記憶データを検証している様子"
              className="aspect-[16/10] w-full object-cover"
            />
            <figcaption className="border-t border-white/10 bg-obsidian/80 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyanline">Research Archive / 2034.11.18</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                東京ラボ第3定着室で記録された、補助記憶の感覚束ね込み試験。喪失体験後の認知負荷を下げる研究の一環として、安心感を持つ短期記憶を低強度で重ね、体験者が現実の履歴と混同しない境界タグの反応を確認している。
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Origin of Research</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              研究の始まりは、記憶を増やすことではなく、傷ついた記憶を支えることでした。
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              NEURAMNESIAの技術は、娯楽や拡張体験のために突然生まれたものではありません。深刻なトラウマ、喪失体験、長く残る自己否定感をどうすれば軽減できるのか。その研究過程で、記憶の上書きではなく、別の経験を安全に重ねるという発想に至りました。
            </p>
          </div>
          <div className="grid gap-4">
            {originCards.map((item) => (
              <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-magentapulse">{item.label}</p>
                <h3 className="mt-3 text-xl font-semibold leading-8 text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Research Basis</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">研究成果からサービスへ</h2>
          <p className="mt-5 text-base leading-8 text-slate-300">
            私たちが公開しているのは、魔法のような断言ではなく、体験者が不安を言語化し、納得して進めるための手順です。
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          {evidenceCards.map((item) => (
            <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-magentapulse">{item.label}</p>
              <h3 className="mt-4 text-xl font-semibold leading-8 text-white">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent,rgba(88,244,255,0.06),transparent)]" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyanline">Milestones</p>
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">定着技術の歩み</h2>
          </div>
          <div>
            {milestones.map((item) => (
              <article key={item.year} className="grid gap-4 border-t border-white/10 py-6 md:grid-cols-[120px_1fr]">
                <div>
                  <p className="text-2xl font-semibold text-cyanline">{item.year}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Service Outcome</p>
            <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">研究で可能になったことを、体験として届けます。</h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              研究成果は、ラボの中だけでは意味を持ちません。NEURAMNESIAでは、記憶の由来を守りながら、体験者が望む人生の断片を選び、確認し、受け取り、日常へ戻るまでをサービス化しています。
            </p>
          </div>
          <div className="grid gap-4">
            {serviceOutcomes.map((item, index) => (
              <p key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm leading-7 text-slate-300 backdrop-blur-xl">
                <span className="mr-3 font-semibold text-magentapulse">{String(index + 1).padStart(2, "0")}</span>
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <Footer items={landingNavItems} />
    </main>
  );
}
