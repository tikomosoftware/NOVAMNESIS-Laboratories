# TiDB RAG Migration

このメモは、現在の `docs/rag/knowledge.jsonl` をTiDBへ移すための作業手順です。

## 方針

- 最初は `knowledge_chunks` 1テーブルで始める。
- 既存の本サイトチャットは壊さず、`retrievalMode: "tidb"` の時だけTiDB検索を試す。
- TiDB未設定、TiDB検索失敗、TiDBでヒットなしの場合はローカルJSONLへフォールバックする。
- 回答生成はGroqを優先する。Groq公式APIはChat Completionsに対応しているが、Embedding用エンドポイントは公式API Reference上では確認できないため、最初はTiDBキーワード検索とTiDB FULLTEXT検索で比較する。
- ベクトル検索は `embedding VECTOR(1536)` と `tidb-vector-index.sql` まで準備済み。実運用ではEmbedding providerを決めてから投入する。
- 不要になったチャンクは削除せず、必要な時だけ `is_active = 0` にする。

## Files

- `docs/rag/tidb-schema.sql`: 基本テーブル定義
- `docs/rag/tidb-fulltext-index.sql`: `title/content` 用FULLTEXTインデックス定義
- `docs/rag/tidb-vector-index.sql`: HNSWベクトルインデックス定義
- `scripts/tidb-import-rag-data.mjs`: JSONLからTiDBへupsertするスクリプト
- `server/tidb-rag.js`: TiDB検索モジュール
- `server/rag-chat.js`: `retrievalMode` によるTiDB/JSONL切り替え

## Environment

`.env.local` などに設定します。コミットしないでください。

```env
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile

# Optional: vector search later
OPENAI_API_KEY=
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
RAG_EMBEDDING_DIMENSIONS=1536
RAG_EMBEDDING_PROVIDER=local

TIDB_DATABASE_URL=
# or
TIDB_HOST=
TIDB_PORT=4000
TIDB_USER=
TIDB_PASSWORD=
TIDB_DATABASE=

TIDB_SSL=true
TIDB_SSL_REJECT_UNAUTHORIZED=true
TIDB_RAG_SEARCH_MODE=keyword
```

`RAG_EMBEDDING_PROVIDER`:

- `local`: 外部APIキーなしで `local-hash-ngram-v1` embeddingを生成する。コンテスト記事用のTiDB Vector Search実証に使える。
- 未設定: `OPENAI_API_KEY` があればOpenAI Embeddingを使い、無ければベクトル検索はヒットなしになる。

`TIDB_RAG_SEARCH_MODE`:

- `auto`: ベクトル検索、FULLTEXT検索、キーワード検索の順に試す
- `hybrid`: ベクトル検索、FULLTEXT検索、キーワード検索の順に試す
- `vector`: ベクトル検索のみ
- `fulltext`: TiDB FULLTEXT `MATCH ... AGAINST` を試し、失敗またはヒットなしならキーワード検索へフォールバック
- `keyword`: TiDB内の `title/content/kind` をLIKE検索

Chat Labでは環境変数を書き換えなくても `TiDB Search` セレクトで `Keyword / Fulltext / Vector / Hybrid / Auto` を比較できます。

## Workflow

1. 現在のReactデータからJSONLを再生成する。

```bash
npm run rag
```

2. TiDBにDBとTableだけ作成する。

```bash
node scripts/tidb-import-rag-data.mjs --env-file=C:\Projects\WebApp\BeaconInfoStock\.env.local --database=neuramnesia_rag --create-database --schema-only
```

3. TiDBに入れる内容を確認する。

```bash
npm run rag:tidb:dry-run
```

4. TiDBへ投入する。

```bash
node scripts/tidb-import-rag-data.mjs --env-file=C:\Projects\WebApp\BeaconInfoStock\.env.local --database=neuramnesia_rag --skip-embeddings
```

最初は `--skip-embeddings` を付けて本文だけ登録します。TiDBキーワード検索とGroq回答生成を先に確認します。

5. TiDB Vector Search用のembeddingを投入する。

外部Embeddingキーなしで検証する場合:

```bash
npm run rag:tidb:import-local-vector
```

OpenAI Embeddingを使う場合は `.env.local` に `OPENAI_API_KEY` を設定し、通常のimportを実行します。

```bash
npm run rag:tidb:import
```

6. FULLTEXTインデックスを作成する。

```bash
npm run rag:tidb:fulltext-index
```

TiDB CloudのFULLTEXT対応はプラン/リージョンに依存します。未対応の場合でも、アプリ側はFULLTEXTエラーを観測ログに出しつつTiDBキーワード検索へフォールバックします。

7. Chat Labで確認する。

`/chat-lab` を開き、Retrievalを `TiDB` に切り替えます。`TiDB Search` で `Keyword` / `Fulltext` / `Vector` / `Hybrid` を切り替えて同じ質問を投げます。ローカルembeddingを使った場合は `Embedding` を `Local` にします。レスポンスの `retrievalMode` が `tidb-fulltext` / `tidb-vector` / `tidb-keyword` ならTiDB経由です。`local-jsonl` ならフォールバックしています。

## Optional Vector Index

データ件数が増えて検索が重くなったら、TiDBで以下を実行します。

```sql
SOURCE docs/rag/tidb-vector-index.sql;
```

TiDBのベクトルインデックスはTiFlashレプリカ等の条件に依存します。最初の122チャンク程度なら、インデックス無しでも検証できます。

## Verification Notes

2026-06-20時点のローカル検証:

- `npm run rag:tidb:import-local-vector` で122チャンクへ `local-hash-ngram-v1` embeddingを投入済み。
- Chat APIで `tidbSearchMode: "vector"` + `embeddingProvider: "local"` を指定すると、`retrievalMode: "tidb-vector"` で応答する。
- Chat APIで `tidbSearchMode: "hybrid"` + `embeddingProvider: "local"` を指定すると、`retrievalMode: "tidb-hybrid"` で応答する。HybridはTiDB Vector検索とTiDBキーワード検索のrank fusion。
- 現在のTiDB環境では `MATCH ... AGAINST` が `UnknownType: *ast.MatchAgainst` になったため、FULLTEXTモードは `tidb-keyword` へフォールバックする。TiDB CloudのFULLTEXT対応はプラン/リージョン依存として記事に明記する。

## Import Options

```bash
node scripts/tidb-import-rag-data.mjs --dry-run
node scripts/tidb-import-rag-data.mjs --schema-only
node scripts/tidb-import-rag-data.mjs --schema-only --apply-fulltext-index
node scripts/tidb-import-rag-data.mjs --skip-embeddings
node scripts/tidb-import-rag-data.mjs --local-embeddings
node scripts/tidb-import-rag-data.mjs --limit=10
node scripts/tidb-import-rag-data.mjs --deactivate-missing
node scripts/tidb-import-rag-data.mjs --env-file=C:\Projects\WebApp\BeaconInfoStock\.env.local --database=neuramnesia_rag --create-database --schema-only
```

`--deactivate-missing` は、現在のJSONLに存在しないTiDB上のチャンクを `is_active = 0` にします。削除はしません。

`--env-file` は別プロジェクトのローカル環境変数を一時的に読むためのオプションです。秘密情報をこのリポジトリにコピーせずに接続確認できます。`--database` を付けると、読み込んだDB名を上書きできます。
