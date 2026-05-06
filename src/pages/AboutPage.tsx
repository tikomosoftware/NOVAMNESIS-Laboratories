import React from "react";
import { landingNavItems } from "../data";
import { Header, Footer, SectionHeader } from "../components/SharedComponents";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={landingNavItems} />
      <section className="relative overflow-hidden px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(88,244,255,0.20),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,79,216,0.14),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_68%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">ABOUT US</p>
          <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
            記憶体験を設計する、架空の研究企業。
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
            NOVAMNESIS Laboratories は、経験できなかった恋愛、選ばなかった人生、行けなかった旅、味わえなかった成功や挫折を、記憶体験として設計する研究企業です。人生をやり直すのではなく、あなたの中にもうひとつの過去を増やします。
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-graphite/45 px-5 py-24">
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-15" />
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Mission" title="私たちが目指すこと。" />
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">経験の格差をなくす</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                生まれた場所、時代、環境によって体験できる人生は限られます。NOVAMNESIS は、誰もが望んだ経験を記憶として持ち帰れる世界を構想しています。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">記憶を安全に流通させる</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                記憶は個人の最も繊細な資産です。同意、匿名化、境界タグ、倫理審査を経て、安全に体験商品として届けるインフラを構築します。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">現実を壊さない</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                購入した記憶が日常を侵食しないよう、体験前後の境界設計と認知安定プロトコルを全セッションに組み込みます。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white">提供者を守る</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                記憶を売る側の権利と安全を最優先に設計します。本人同意なしの抽出は禁止、匿名化は自動、独占契約の影響も事前に説明します。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Company" title="会社情報。" />
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <dl className="grid gap-6">
              {[
                ["社名", "NOVAMNESIS Laboratories Inc."],
                ["設立", "2029年4月"],
                ["所在地", "東京都港区虎ノ門 4-1-1（架空）"],
                ["代表", "Dr. Rei Kurosawa（架空）"],
                ["事業内容", "記憶体験の設計・販売・査定、記憶安全基準の策定、記憶資産マーケットプレイスの運営"],
                ["従業員数", "約120名（架空）"],
                ["資本金", "48億円（架空）"],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 border-b border-white/10 pb-4 last:border-0 last:pb-0 sm:grid-cols-[160px_1fr]">
                  <dt className="text-sm font-semibold text-slate-400">{label}</dt>
                  <dd className="text-sm leading-7 text-slate-200">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-magentapulse/20 bg-magentapulse/5 p-6 text-center backdrop-blur-xl">
          <p className="text-sm leading-7 text-slate-300">
            本サイトおよび NOVAMNESIS Laboratories は架空の企業・サービスです。実在する医療・金融・記憶操作サービスではありません。
          </p>
        </div>
      </section>

      <Footer items={landingNavItems} />
    </main>
  );
}
