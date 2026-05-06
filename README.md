# NEURAMNESIA

**経験したかった人生を、記憶として購入する**

架空の近未来記憶体験マーケットプレイスのデモサイト

## 🌐 デモサイト

- **URL**: https://novamnesis-laboratories.vercel.app/
- **GitHub**: https://github.com/tikomosoftware/NOVAMNESIS-Laboratories

## 📖 概要

NEURAMNESIA は、「経験できなかった恋愛」「選ばなかった人生」「行けなかった旅」など、現実では体験できなかった過去を記憶体験として購入できる架空の近未来マーケットプレイスです。

このプロジェクトは、SF的な世界観を持つダミーWebサイトとして、React + TypeScript + Tailwind CSS で構築されています。

### 社名の由来

**NEURAMNESIA** は、**Neuro（神経）** と **Amnesia（記憶喪失）** を組み合わせた造語です。記憶を失うのではなく、新しい記憶を神経レベルで獲得する。失われた過去を取り戻すのではなく、経験できなかった過去を創造する。そんな逆説的な意味を込めています。

### コンセプト

- **記憶の購入**: 恋愛、成功、旅行、結婚、挫折などの記憶を体験として購入（オンライン完結）
- **記憶の売却**: 自分の記憶を他者に販売するマーケットプレイス
- **体験セッション**: ニューロクラウンを使った記憶定着プロセス（全国3拠点の実店舗で実施）
- **安全性と倫理**: 現実との境界タグ、同意プロセス、認知安定セッション

### サービスの流れ

1. **オンライン**: 記憶の閲覧・購入はWebサイトで完結
2. **予約**: 記憶定着セッションの日時を予約（来館時に記憶選択も可能）
3. **来館**: 全国3拠点（東京・大阪・福岡）のいずれかで記憶定着を実施

## 🛠️ 技術スタック

### フロントエンド

- **React** 19.1.1
- **TypeScript** 5.9.2
- **Tailwind CSS** 3.4.17

### ビルドツール

- **Vite** 7.1.7
- **PostCSS** 8.5.6
- **Autoprefixer** 10.4.21

### デプロイ

- **Vercel** (サーバーレスホスティング)

## 📁 プロジェクト構成

```
memoria/
├── public/
│   ├── images/          # 画像アセット
│   └── favicon.svg      # ファビコン
├── src/
│   ├── components/
│   │   └── SharedComponents.tsx  # 共通コンポーネント
│   ├── data/
│   │   └── index.ts     # データ定義(記憶カタログ、FAQ等)
│   ├── pages/
│   │   ├── LandingPage.tsx       # トップページ
│   │   ├── CatalogPage.tsx       # 記憶カタログ
│   │   ├── TemplateDetailPage.tsx # 体験テンプレート詳細
│   │   ├── EpisodeDetailPage.tsx  # 記憶エピソード詳細
│   │   ├── ExperienceStartPage.tsx # 体験開始ページ
│   │   ├── BookingPage.tsx       # 予約ページ
│   │   ├── FacilityPage.tsx      # 施設案内
│   │   ├── SellPage.tsx          # 記憶売却ページ
│   │   ├── SafetyPage.tsx        # 安全性・倫理
│   │   ├── FaqPage.tsx           # FAQ
│   │   ├── AboutPage.tsx         # 会社概要
│   │   └── ContactPage.tsx       # お問い合わせ
│   ├── types/
│   │   └── index.ts     # TypeScript型定義
│   ├── App.tsx          # ルーティング
│   ├── main.tsx         # エントリーポイント
│   └── styles.css       # グローバルスタイル
├── index.html           # HTMLテンプレート
├── package.json         # 依存関係
├── tsconfig.json        # TypeScript設定
├── tailwind.config.js   # Tailwind CSS設定
├── vite.config.ts       # Vite設定
├── vercel.json          # Vercel設定
└── README.md            # このファイル
```

## 🎯 主な機能

### ページ構成

1. **Landing Page** (`/`)
   - ヒーローセクション
   - 問題提起(経験できなかった人生)
   - 購入ユースケース
   - サービス説明
   - 施設紹介
   - マーケットプレイス
   - カタログティーザー
   - レビュー
   - FAQ
   - CTA

2. **Catalog** (`/catalog`)
   - 体験テンプレート一覧
   - 記憶エピソード一覧
   - カテゴリフィルター

3. **Template Detail** (`/template/:slug`)
   - 体験テンプレートの詳細
   - 章立て、感覚、推奨プラン

4. **Episode Detail** (`/episode/:slug`)
   - 記憶エピソードの詳細
   - 期間、強度、タイムライン

5. **Experience** (`/experience`)
   - 体験開始の流れ
   - セッションステップ
   - 身体状態の説明

6. **Booking** (`/booking`)
   - 予約フォーム
   - プラン選択

7. **Facility** (`/facility`)
   - 施設案内
   - 全国3拠点の情報（東京・大阪・福岡）
   - ルームゾーン説明
   - セッションフロー

8. **Sell Memory** (`/sell`)
   - 記憶売却の流れ
   - 査定基準
   - 売却ステップ

9. **Safety** (`/safety`)
   - 安全性と倫理
   - 同意プロセス
   - 認知安定セッション

10. **FAQ** (`/faq`)
    - よくある質問

11. **About** (`/about`)
    - 会社概要

12. **Contact** (`/contact`)
    - お問い合わせフォーム

### データ構造

#### ExperienceTemplate(体験テンプレート)

- タイトル、説明、タグライン
- 所要時間、記憶期間、リスク
- 章立て、感覚、推奨プラン

#### MemoryEpisode(記憶エピソード)

- タイトル、説明、期間
- 強度、タグ、ソース
- あらすじ、タイムライン、詳細

#### Plan(プラン)

- タイトル、説明、カテゴリ
- 所要時間、記憶期間、リスク

## 🚀 開発

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

### 開発サーバー

- **URL**: http://127.0.0.1:5173/
- **ホットリロード**: 有効

### ビルド

```bash
npm run build
```

- TypeScript型チェック実行
- Viteでビルド
- 出力先: `dist/`

## 🎨 デザイン

### カラーパレット

- **背景**: `#060711` (obsidian)
- **テキスト**: `slate-100` (明るいグレー)
- **アクセント**: `cyan-400`, `purple-400`
- **トーン**: ダーク、コーポレート、ライト

### タイポグラフィ

- システムフォント(sans-serif)
- レスポンシブ対応

### コンポーネント

- `Header` - ナビゲーション（固定ヘッダー）
- `Footer` - フッター（Copyright表記、Disclaimer）
- `Hero` - ヒーローセクション
- `Button` - ボタン
- `SectionHeader` - セクションヘッダー
- `CardGrid` - カードグリッド
- `BrandLockup` - ブランドロゴ＋会社名
- `Marketplace` - マーケットプレイス説明（オンライン/実店舗の説明含む）
- `FinalCta` - CTAセクション（記憶購入へのリンク）
- その他多数の共通コンポーネント

## 🏢 架空の施設情報

### 記憶定着セッション実施拠点

- **東京ラボ**: 東京都港区虎ノ門 4-1-1（架空）
- **大阪ラボ**: 大阪府大阪市北区梅田 2-5-8（架空）
- **福岡ラボ**: 福岡県福岡市中央区天神 1-10-3（架空）

記憶の購入はオンラインで完結しますが、実際の記憶定着セッションは上記の専用施設で行います。

## 📝 ライセンス

Private(非公開)

## 👤 作成者

tikomo software

## 📋 更新履歴

### 2026-05-06
- **社名変更**: NOVAMNESIS Laboratories → NEURAMNESIA（商標問題回避のため）
- 社名の由来をAboutページに追加（Neuro + Amnesiaの説明）
- "Laboratories" を社名から削除してシンプルに
- フッターのナビゲーションメニューを削除（ヘッダー固定のため冗長）
- フッターにCopyright表記を追加（© NEURAMNESIA）
- フッターのDisclaimerスタイルをAboutページと統一
- テンプレート詳細ページのCTAを「記憶を購入する」に変更（/bookingへリンク）
- 「記憶を査定する」ボタンを削除
- トップページMarketplaceセクションにオンライン/実店舗の説明を追加
- 施設ページに全国3拠点の情報を追加
- ヘッダーのブランドロゴとテキストサイズを拡大

---

**注意**: このサイトは架空のサービスを扱うデモサイトです。実際の記憶売買サービスは存在しません。
