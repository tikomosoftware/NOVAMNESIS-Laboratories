import React, { useState } from "react";
import { landingNavItems } from "../data";
import { Header, Footer, notify } from "../components/SharedComponents";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-obsidian text-slate-100">
      <Header items={landingNavItems} />
      <section className="relative overflow-hidden px-5 pb-20 pt-36">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_12%,rgba(88,244,255,0.18),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,79,216,0.12),transparent_28%),linear-gradient(180deg,#060711_0%,#0c1020_68%,#060711_100%)]" />
        <div className="absolute inset-0 -z-10 novamnesis-grid opacity-35" />
        <div className="mx-auto max-w-4xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.34em] text-cyanline">CONTACT</p>
          <h1 className="text-5xl font-semibold leading-tight text-white sm:text-6xl">
            お問い合わせ。
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-9 text-slate-300">
            記憶体験に関するご質問、売却のご相談、施設見学のご希望など、お気軽にお問い合わせください。通常2営業日以内にご返信いたします。
          </p>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="text-2xl font-semibold text-white">連絡先情報</h2>
            <dl className="mt-8 grid gap-6">
              {[
                ["所在地", "東京都港区虎ノ門 4-1-1 NOVAMNESIS Tower 12F（架空）"],
                ["メール", "contact@novamnesis.test"],
                ["電話", "03-XXXX-XXXX（架空）"],
                ["営業時間", "平日 10:00 - 19:00"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                  <dt className="text-xs font-semibold uppercase tracking-[0.22em] text-cyanline">{label}</dt>
                  <dd className="mt-2 text-sm leading-7 text-slate-200">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {submitted ? (
            <div className="rounded-[2rem] border border-cyanline/25 bg-cyanline/5 p-8 shadow-glow backdrop-blur-xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cyanline">Message Sent</p>
              <h2 className="text-3xl font-semibold leading-tight text-white">お問い合わせを受け付けました。</h2>
              <p className="mt-5 text-base leading-8 text-slate-300">
                内容を確認のうえ、担当者よりご連絡いたします。通常2営業日以内にご返信いたします。
              </p>
              <p className="mt-6 text-xs leading-6 text-slate-500">
                このフォームはデモです。実際の送信やメール配信は行われません。
              </p>
            </div>
          ) : (
            <form
              className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl md:p-8"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    お名前
                    <input
                      required
                      className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline"
                      placeholder="名前を入力してください"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-semibold text-slate-200">
                    メールアドレス
                    <input
                      type="email"
                      required
                      className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline"
                      placeholder="example@novamnesis.test"
                    />
                  </label>
                </div>
                <label className="grid gap-2 text-sm font-semibold text-slate-200">
                  お問い合わせ種別
                  <select className="rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal text-slate-200 outline-none focus:border-cyanline">
                    <option>記憶体験について</option>
                    <option>記憶の売却について</option>
                    <option>施設見学について</option>
                    <option>安全基準について</option>
                    <option>法人・パートナーシップ</option>
                    <option>その他</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold text-slate-200">
                  お問い合わせ内容
                  <textarea
                    required
                    className="min-h-36 resize-none rounded-2xl border border-white/10 bg-obsidian/80 px-4 py-3 text-sm font-normal leading-7 text-slate-200 outline-none focus:border-cyanline"
                    placeholder="ご質問やご相談の内容をご記入ください"
                  />
                </label>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-cyanline via-violetsignal to-magentapulse px-6 py-3 text-sm font-semibold text-obsidian shadow-glow transition duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cyanline focus:ring-offset-2 focus:ring-offset-obsidian"
                  >
                    送信する
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-magentapulse/20 bg-magentapulse/5 p-6 text-center backdrop-blur-xl">
          <p className="text-sm leading-7 text-slate-300">
            このお問い合わせフォームはデモです。実際の送信やメール配信は行われません。
          </p>
        </div>
      </section>

      <Footer items={landingNavItems} />
    </main>
  );
}
