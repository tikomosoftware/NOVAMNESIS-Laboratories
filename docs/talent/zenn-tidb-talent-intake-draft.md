---
title: "自然言語入力でスキルナレッジベースを作る: TiDB Cloudで人材プロフィール登録・検索基盤を作った"
emoji: "🧠"
type: "tech"
topics: ["tidb", "ai", "vectordb", "rag", "typescript"]
published: false
---

## はじめに

転職サイトや社内人材DBにプロフィールを登録するとき、けっこう面倒だなと思うことがあります。

職種を選ぶ。スキルを選ぶ。経験年数を入れる。案件概要を書く。希望条件を入れる。さらに「得意なこと」や「自己PR」も書く。

もちろん構造化されたデータは検索しやすいです。ただ、登録する側から見ると、フォームの項目が増えるほど入力の負担も増えます。結果として、プロフィールが薄くなったり、登録自体が後回しになったりします。

そこで今回は、フォーム入力そのものを否定するのではなく、フォームに入力する作業を「AIとの会話」に置き換えるPoCを作りました。

やりたかったのは、AIとの会話で個人プロフィールやスキルナレッジを作り、それをDBに登録し、あとから人や案件を検索・推薦できる仕組みです。

この記事では、この仕組みを「スキルナレッジベース」と呼んでいます。

スキルナレッジベースとは、単なる自己紹介文ではなく、個人の経験・技術・希望条件・強みを、AIがあとから検索や推薦に使える形で保存したものです。

仕組みとしてはシンプルです。

- ユーザーは経験やスキルを自然な文章で入力する
- AIが会話からプロフィール文と構造化データを抽出する
- 抽出結果をTiDBに保存する
- 検索側も自然な文章で「この案件に合う人」「この人に合う案件」を探す
- TiDBのkeyword検索とvector検索で候補を取り出す
- AIが「なぜ合うのか」まで説明する

題材は人材マッチングですが、転職サイト、社内人材DB、技術ナレッジDB、SESやフリーランス案件のアサインなどにも応用できる考え方です。

ポイントは「フォームを消すこと」ではありません。

DBに入れるための項目は必要です。ただ、その項目をユーザーに一つずつ選ばせたり入力させたりする代わりに、AIとの会話からDB登録に必要な形へ変換することを狙っています。

同じように、検索する側も「職種」「スキル」「年数」「業界」などの検索フォームを細かく指定するのではなく、自然な文章で条件を投げられることを重視しました。

## 作ったもの

NEURAMNESIAという自作プロジェクトの中に、`Talent Intake Lab`という画面を追加しました。

画面の流れは次のようになっています。

1. 左側のチャット欄に、経験・スキル・案件・希望条件を自然文で入力する
2. Extractorが会話からプロフィールdraftを作る
3. draftを確認してTiDBに保存する
4. Match Searchに案件条件のような自然文を入力する
5. TiDB上のプロフィールをkeyword/vector hybridで検索する
6. 上位候補に対してMatcherが適合理由を生成する

たとえば登録側は、次のように入力するだけです。

```text
組み込み系エンジニアです。
CとC++を6年使っていて、車載ECUの制御ソフト開発やCAN通信、
RTOS上のファームウェア改善を担当しました。
```

この文章から、次のような情報を抽出します。

- role: 組み込み / 制御系エンジニア
- skill: C, C++, CAN, RTOS
- domain: 自動車 / 車載, 組み込み / 制御
- project: 車載ECUの制御ソフト開発
- strength: ファームウェア改善

ポイントは、ユーザーに最初から細かいフォームを埋めさせないことです。

自然な文章として入力してもらい、その後ろでAIが`narrative`と`structured facts`に分解します。

つまりUIとしては会話でも、DBの中には検索・推薦に使える構造化データを残します。

## 公開デモの扱い

記事用に公開するデモでは、保存機能を無効にする方針にしました。

理由は、読者が誤って本物の職務経歴や個人情報を入力してしまう可能性があるからです。

公開デモでは、固定のサンプルプロフィールを10件ほど用意し、その一覧と検索だけを試せるようにします。

`Save`を押した場合は、DBに保存せず「デモ環境では保存機能を無効にしています」と表示します。

これにより、画面上では自然言語入力からプロフィールdraftを作る流れを見せつつ、TiDB側には不要なデータを書き込まないようにできます。

本当に保存まで試す場合は、ローカル環境や検証用TiDB databaseで`TALENT_DEMO_READONLY`を外して動かす想定です。

## スキルナレッジベースとして見る

このPoCは、人材プロフィール登録ツールという見方もできますが、もう少し抽象化すると「スキルナレッジベース」です。

AIとの会話から、個人の経験・技術・希望条件・強みを抽出して、あとから検索や推薦に使える形で保存します。

RAGの文脈で見ると、流れは次のようになります。

```text
登録側:
自然な文章の入力
  -> AIでプロフィール/スキルfactを抽出
  -> TiDB Cloudに保存

検索側:
自然な文章の検索条件
  -> TiDB Cloudでkeyword + vector retrieval
  -> 候補プロフィールを取得
  -> AIでマッチ理由を生成
```

つまり、TiDB Cloudを単なる保存先ではなく、AIが参照する人材・スキルナレッジベースの検索基盤として使っています。

「この人は何ができるのか」「この案件に合う人は誰か」「この人に合う案件は何か」を、自然な文章から探せる状態にするのが狙いです。

## なぜTiDBを使ったか

今回のPoCでは、TiDB Cloudを「構造化データ」と「ベクトル検索」を同じ場所で扱うためのDBとして使いました。

このPoCでやりたかったことは、単にチャットUIを作ることではありません。会話から取り出したプロフィールやスキルナレッジをDBに登録し、あとから人や案件を検索・推薦できる状態にすることです。

そのためには、通常のSQLで扱える構造化データ、AIが生成するJSON、自然文検索のためのベクトルをまとめて持てるDBが欲しくなります。ここにTiDBがかなりはまりました。

人材プロフィールは、きれいなリレーショナルデータだけでは表しにくいです。

- 氏名や見出しのような通常カラム
- スキル、年数、希望条件などの検索用fact
- 本人が話した内容をまとめたnarrative
- AIが抽出したJSON
- 意味検索のためのembedding

これらを別々のDBや検索基盤に分けることもできますが、PoC段階では運用が重くなります。

TiDBなら、SQLで扱えるテーブルの中に`JSON`と`VECTOR(1536)`を置けます。今回のような「通常の絞り込みもしたいし、自然文の意味検索もしたい」用途では、かなり相性がよいと感じました。

今回の要件に対しては、特に次の3点が効きました。

- `SQL`: プロフィール、ステータス、更新日時、本人確認状態を普通のDBとして扱える
- `JSON / facts`: AI抽出結果や根拠つきfactを保存できる
- `VECTOR`: 自然な文章の検索条件から、意味的に近いプロフィールを探せる

## DB設計

Talent用には、次の2テーブルを追加しました。

```sql
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
  UNIQUE KEY uk_talent_profiles_profile_uid (profile_uid)
);

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
  UNIQUE KEY uk_talent_profile_facts_fact_uid (fact_uid)
);
```

`talent_profiles`には、プロフィール全体を保存します。

特に重要なのは次の4つです。

- `narrative`: 人が読めるプロフィール文
- `structured`: AI抽出結果をまとめたJSON
- `search_text`: keyword検索用にまとめたテキスト
- `embedding`: vector検索用の1536次元ベクトル

一方、`talent_profile_facts`には、検索や確認に使いやすい単位でfactを保存します。

たとえば「Reactを3年使っている」「車載ECUの制御ソフト開発を担当した」「リモート中心を希望している」といった粒度です。

`evidence_text`も保存しておくことで、AIが抽出した情報に対して「どの発話を根拠にしたのか」を追いやすくしています。

## AI抽出の考え方

Extractorは、会話ログからプロフィールdraftを作ります。

draftには次のような情報を持たせました。

```ts
type TalentDraft = {
  profileUid?: string;
  displayName?: string;
  headline?: string;
  narrative?: string;
  structuredFacts: TalentFact[];
  missingFields: string[];
  readinessScore: number;
  nextQuestion?: string;
};
```

ここで大事なのは、AIに「完成したプロフィール」だけを作らせないことです。

人材DBで使うなら、文章として読める`narrative`も必要ですが、検索やマッチングに使える粒度の`structuredFacts`も必要です。

そのため、プロンプトでは「人が読む文章」と「DB検索に使うfact」を分けて返すようにしています。

実際のプロンプトでは、主に次の制約を入れています。

```text
会話ログから、DBに保存できる人材プロフィールdraftをJSONだけで返してください。
本人が明言していない情報は断定しないでください。
推定した場合はconfidenceを0.65以下にしてください。
各factには、必ず根拠になる本人発話をevidenceTextとして入れてください。
未知の職種、業界、技術、業務スキルも抽出して構いません。
不足している項目があればmissingFieldsに入れ、nextQuestionで追加質問を1つだけ返してください。
```

返してほしいJSONの中身も、用途ごとに分けました。

```ts
{
  displayName: "string",
  headline: "string",
  narrative: "string",
  roles: [{ label: "string", evidenceText: "string", confidence: 0.0 }],
  skills: [{ name: "string", category: "string", years: 0, evidenceText: "string", confidence: 0.0 }],
  domains: [{ label: "string", evidenceText: "string", confidence: 0.0 }],
  projects: [{ label: "string", summary: "string", evidenceText: "string", confidence: 0.0 }],
  preferences: [{ label: "preference|constraint", value: "string", evidenceText: "string", confidence: 0.0 }],
  strengths: [{ label: "string", evidenceText: "string", confidence: 0.0 }],
  missingFields: ["role"],
  nextQuestion: "string"
}
```

`narrative`はプロフィールカードなどで人が読むための文章です。

一方で、`roles`、`skills`、`domains`、`projects`、`preferences`、`strengths`は、最終的に`structuredFacts`へ正規化してTiDBに保存します。

この分け方にしておくと、検索時に「Reactを3年」や「車載ECUの制御ソフト開発」のような細かい根拠を使えます。さらに`evidenceText`を持たせることで、AIがなぜそのfactを抽出したのかも確認できます。

さらに、入力が足りない場合は`missingFields`と`nextQuestion`を返します。

たとえばスキルは取れているけれど年数がない場合、次に「主なスキルについて、だいたい何年くらい使っているかを教えてください」と聞けるようにします。

この設計にすると、登録UIが単発のフォームではなく、会話しながらプロフィールの密度を上げるUIになります。

## AIがない環境でも壊れないようにした

PoCではExtractorとMatcherを分けています。

- Extractor: 会話からプロフィールdraftを作る
- Matcher: 検索結果に対して適合理由を作る

どちらも`Auto AI`を選べるようにしました。

挙動は次の順番です。

1. `GROQ_API_KEY`があればGroqを使う
2. Groqがなく、`OPENAI_API_KEY`があればOpenAIを使う
3. どちらもなければローカルルールにフォールバックする

AI APIキーがない環境でもデモが完全に止まらないように、ローカルルールによる抽出とマッチ理由生成を残しています。

技術記事としては地味ですが、PoCを人に触ってもらうときはこのフォールバックがかなり効きます。

## 動かすための設定

Vercelでは、既存のRAG機能で使っているTiDB/Groq設定を使い回しました。

Talent機能として必要になる主な環境変数は次の通りです。

```env
GROQ_API_KEY=
GROQ_MODEL=
OPENAI_API_KEY=
TIDB_HOST=
TIDB_PORT=4000
TIDB_USER=
TIDB_PASSWORD=
TIDB_DATABASE=
TIDB_SSL=true
TIDB_SSL_REJECT_UNAUTHORIZED=true
TALENT_INTAKE_PROVIDER=auto
TALENT_MATCH_PROVIDER=auto
TALENT_DEMO_READONLY=true
VITE_TALENT_DEMO_READONLY=true
RAG_EMBEDDING_DIMENSIONS=1536
```

`GROQ_API_KEY`や`OPENAI_API_KEY`がない場合でも、ローカルルールにフォールバックします。

一方で、TiDB接続情報がない場合はin-memoryのプロトタイプ保存に落ちるようにしました。本番用途ではもちろん永続化が必要ですが、PoCとしては「AIキーやDB設定がないと画面が完全に壊れる」状態を避けられます。

公開デモでは`TALENT_DEMO_READONLY=true`を設定し、保存とTiDBへのseed書き込みをAPI側で無効にしています。

あわせて`VITE_TALENT_DEMO_READONLY=true`を設定して、画面上でも最初からread-onlyの注意表示を出します。DB保護は`TALENT_DEMO_READONLY`、UI表示は`VITE_TALENT_DEMO_READONLY`という分担です。

TiDBのvector検索が使えるかどうかは、確認用スクリプトで見ています。

```text
scripts/check-tidb-vector.mjs
scripts/check-talent-db.mjs
```

## 保存時にTiDBへ入れるもの

保存時には、draftから検索用テキストとembeddingを作り、TiDBに保存します。

概念的には次のような形です。

```text
会話ログ
  -> AI / local rules
  -> TalentDraft
  -> narrative
  -> structured JSON
  -> structured facts
  -> search_text
  -> embedding
  -> TiDB
```

今回のPoCでは、外部embedding APIへの依存を減らすため、ローカルのembedding関数で1536次元ベクトルを作っています。

本番用途で精度を出すなら、登録時と検索時で同じembedding modelを固定し、`embedding_model`と`embedding_dimensions`を必ず保存しておくのがよさそうです。

## マッチング検索

検索側も、フォームではなく自然文にしました。

ここも今回のポイントです。

登録時だけAI会話にしても、検索時に結局たくさんの条件フォームを埋める必要があると、体験としてはまだ重いままです。そこで検索側も、AIに相談するような自然文入力にしました。

たとえば、次のように検索できます。

```text
ReactとTypeScriptでSaaS管理画面を設計でき、顧客折衝も苦手ではない人
```

実装上はテキスト入力です。サイト側に音声認識機能を実装しているわけではありません。

ただ、入力文は話し言葉に近い自然な文章のままで問題ありません。Windowsやブラウザの音声入力を使えば、結果的に声で入力することもできますが、このPoCの本質は音声認識ではなく「自然な文章を検索条件として扱えること」です。

たとえば、次のような探し方です。

```text
来月から入れる人で、ReactとTypeScriptができて、
人材系SaaSの管理画面を任せられそうな人を探して
```

このような曖昧な条件を、TiDB上のプロフィール、structured facts、embeddingと照合して候補を返します。

検索処理は2段構えです。

1. TiDBで候補を取得する
2. AIまたはlocal ruleで適合理由を作る

TiDB側では、keyword検索とvector検索の両方を行い、最後にrank fusionしています。

```text
keyword search
  + vector search
  -> hybrid rank fusion
  -> topK candidates
  -> AI match explanation
```

keyword検索では、検索文から技術名や職種名らしいtokenを取り出し、`headline`と`search_text`に対してスコアを付けています。

概念的には次のようなSQLです。

```sql
SELECT
  profile_uid,
  display_name,
  headline,
  narrative,
  structured,
  (
    CASE WHEN LOWER(COALESCE(headline, '')) LIKE ? THEN 5 ELSE 0 END
    + CASE WHEN LOWER(search_text) LIKE ? THEN 2 ELSE 0 END
  ) AS score
FROM talent_profiles
WHERE LOWER(COALESCE(headline, '')) LIKE ?
   OR LOWER(search_text) LIKE ?
ORDER BY score DESC, updated_at DESC
LIMIT ?;
```

vector検索では、TiDBの`VEC_COSINE_DISTANCE`を使います。

```sql
SELECT
  profile_uid,
  display_name,
  headline,
  narrative,
  structured,
  VEC_COSINE_DISTANCE(embedding, ?) AS distance
FROM talent_profiles
WHERE embedding IS NOT NULL
  AND embedding_model = ?
ORDER BY distance ASC
LIMIT ?;
```

keywordとvectorの結果は、順位ベースで混ぜています。

実装では、keyword側に`0.45`、vector側に`0.55`の重みを付け、上位ほど点が高くなるようにしました。

```js
function combineResults(groups, topK) {
  const merged = new Map();

  for (const group of groups) {
    group.results.forEach((item, index) => {
      const current =
        merged.get(item.profileUid) || { ...item, score: 0, matchMode: item.matchMode };

      current.score += group.weight / (index + 1);
      current.matchMode = current.matchMode === item.matchMode ? current.matchMode : "hybrid";
      merged.set(item.profileUid, current);
    });
  }

  return [...merged.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
```

```js
const results = combineResults(
  [
    { results: keywordResults, weight: 0.45 },
    { results: vectorResults, weight: 0.55 },
  ],
  topK,
);
```

keywordだけだと、表記ゆれや文脈の近さを拾いにくいです。

一方、vectorだけだと「React」「C++」「AWS」のような明示的な技術名に対して、完全一致に近い強い根拠を取りこぼすことがあります。

そのため、今回はkeywordとvectorを混ぜました。

人材検索では「この技術を持っていること」は強い条件になりやすいので、keyword検索もまだ重要だと感じています。

## マッチ理由を出す

検索結果をただ並べるだけだと、なぜその人が候補に出たのか分かりません。

そこでMatcherに、候補者ごとの適合理由を作らせています。

返す情報は次のような形です。

```json
{
  "fitScore": 86,
  "reason": "ReactとTypeScriptでSaaS管理画面を担当しており、検索条件の主要部分と一致しています。",
  "highlights": ["React", "TypeScript", "SaaS管理画面", "顧客折衝"],
  "concerns": ["バックエンド経験は候補者情報からは確認できません。"]
}
```

ここでも、AIには候補者情報にないことを推測させないようにしています。

人材マッチングでは「合いそう」だけでなく、「どこまでが根拠ありで、どこからが未確認か」を分けることが重要です。

## 実際にTiDBで確認したこと

接続先のTiDB Cloudでは、次を確認しました。

```json
{
  "version": "8.0.11-TiDB-v8.5.3-serverless",
  "cosineFunction": { "ok": true, "distance": 1 },
  "vectorColumn": { "ok": true },
  "vectorRoundtrip": { "ok": true, "distance": 0 },
  "errors": []
}
```

この確認で、少なくとも今回のPoCに必要な次の機能は使える状態でした。

- `VECTOR(1536)`カラムの作成
- 1536次元ベクトルのINSERT
- `VEC_COSINE_DISTANCE`による距離計算
- 保存したベクトルのroundtrip

また、Talent用のテーブルもTiDB上に作成され、実データが入ることを確認しました。

```text
database: neuramnesia_rag
tables:
- knowledge_chunks
- talent_profiles
- talent_profile_facts

talent_profiles: 2
talent_profile_facts: 15
```

この時点では、画面に表示されていた`KOMO`や`No name`もTiDBから返ってきた行です。

`No name`になっているのは、DB上の`display_name`が`null`だったためです。ここはPoCらしい粗さですが、逆に「抽出できていない項目をどう補完するか」を考える材料にもなりました。

## 技術taxonomyも足した

ローカルルールでもある程度抽出できるように、技術名のtaxonomyも用意しました。

元データは次のようなものを使っています。

- GitHub Linguist
- Devicon
- manual overrides

さらに、今回のユースケースに合わせて、組み込み・制御系も拾いやすくしました。

- C
- C++
- MATLAB / Simulink
- PLC
- RTOS
- CAN
- ROS
- 組み込み / 制御系エンジニア
- 自動車 / 車載
- ロボティクス

AIだけに寄せればtaxonomyは不要にも見えます。

ただ、実際には「AIがない環境で動かす」「既知の技術名は安定して抽出する」「検索トークンとして使う」ために、taxonomyを持っておく価値がありました。

## 更新と削除も必要になる

人材プロフィールやスキルナレッジは、一度登録して終わりではありません。

実際には、月に1回、数ヶ月に1回くらいの頻度で更新したくなるはずです。

たとえば、次のようなケースがあります。

- 新しく担当した案件を追加したい
- 最近使っている技術を強めに出したい
- 昔使っていた技術を残したいが、今後その案件ではマッチされたくない
- 希望条件や避けたい働き方を変えたい
- 間違って抽出されたfactを削除したい

ここで重要なのは、「削除」と「マッチ対象から外す」を分けることです。

たとえば、昔PHPを書いていた人が「PHP経験はあるが、今後はReact/TypeScript案件を受けたい」と考えている場合、PHP経験そのものを消すのが常に正解とは限りません。

職務経歴としては残したいけれど、案件推薦では弱めたい、または除外したい、という状態がありえます。

そのため本番設計では、factに次のような状態を持たせるとよさそうです。

```text
fact_type: skill
value_text: PHP
verified_by_user: true
visibility: visible
match_preference: avoid
```

または、スキルを次のように分けてもよさそうです。

- `experienced`: 経験がある
- `preferred`: 今後も受けたい
- `avoid`: 経験はあるが、案件としては受けたくない
- `hidden`: プロフィールにも検索にも出したくない

現状のPoCでは、プロフィール全体の上書き保存はできます。同じ`profile_uid`に対して保存すると、`talent_profiles`の`structured`、`search_text`、`embedding`は更新されます。

ただし、個別のfactを削除・非表示・マッチ対象外にするUIやAPIはまだ作っていません。

今後実装するなら、次のような流れにしたいです。

```text
「PHPは経験としては残すけど、今後の案件検索では外したい」
  -> AIが対象factを候補として提示
  -> ユーザーが確認
  -> match_preference = avoid に更新
  -> search_text / embedding を再生成
  -> 次回検索から推薦順位に反映
```

この設計にすると、プロフィールを「過去の経歴」として保存しつつ、「今後どうマッチされたいか」も管理できます。

人材DBでは、この差がかなり大きいと思います。

## 実運用で必要になること

今回作ったものはPoCです。

実際に人材データや職務経歴に近い情報を扱うなら、最低でも次のような設計が必要です。

- 本人同意
- 抽出結果の本人確認
- 編集・削除フロー
- スキルごとの表示/非表示/マッチ対象外設定
- 監査ログ
- 管理者権限
- seedやデモデータ投入の制限
- AIが推測した情報と本人が明言した情報の区別

特に、AI抽出結果をそのまま確定データにするのは危険です。

今回のPoCでも`confidence`や`evidence_text`を持たせていますが、本番では「本人確認済みかどうか」をもっと明確に扱う必要があります。

## まとめ

今回作ったのは、フォーム入力をAIとの会話に置き換え、個人プロフィールやスキルナレッジの登録から、人・案件の検索、推薦、マッチ理由表示までをつなげるPoCです。

使ってみて感じたのは、TiDBが「構造化データ」と「自然文検索のためのベクトル」を同じDBに置けるのが便利だということです。

人材プロフィールのようなデータは、完全に構造化されたマスタでもなく、ただの長文でもありません。

人が読めるnarrative、検索できるfacts、AIが扱いやすいJSON、意味検索用のembeddingが全部必要になります。

その受け皿として、SQL、JSON、Vector Searchをまとめて扱えるTiDBは、会話型AIアプリのDBとして使いやすい選択肢だと感じました。

今後やるなら、次はこのあたりを詰めたいです。

- 本人確認済みfactだけを検索対象にする
- スキルごとに「経験あり」「希望する」「避けたい」「非表示」を管理する
- AI抽出前後の差分レビューUIを作る
- embedding modelを本番向けに差し替える
- 案件側も同じ形式でDB化して、双方向マッチングにする
- プロフィールの更新履歴と監査ログを追加する

フォームに人間を合わせるのではなく、人間が自然な文章で入力した内容をDBに合わせていく。

人材登録やナレッジ登録のUIは、こういう方向にできるのではないかと思っています。
