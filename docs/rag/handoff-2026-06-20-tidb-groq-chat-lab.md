# Handoff: TiDB + Groq Chat Lab

Date: 2026-06-20
Project: `C:\Projects\Site\NEURAMNESIA`

## Current Status

- A standalone chat test page exists at `/chat-lab`.
- The in-app browser was verified at:
  - `http://127.0.0.1:5174/chat-lab`
- The page can call the local chat API with:
  - Provider: `Groq`
  - Retrieval: `TiDB`
- Web UI verification succeeded:
  - Test question: `予約方法と安全性について教えてください`
  - Result: HTTP 200
  - Retrieval used: TiDB keyword search
  - Sources returned: 5
  - Answer generation: Groq

## TiDB State

- Database created: `neuramnesia_rag`
- Table created: `knowledge_chunks`
- Imported source: `docs/rag/knowledge.jsonl`
- Imported rows: 122
- Embeddings were skipped for now.
- Current TiDB RAG mode is keyword search, not vector search.
- Added local vector verification:
  - `npm run rag:tidb:import-local-vector`
  - Imported/updated embeddings: 122
  - Embedding model label: `local-hash-ngram-v1`
- Chat API verification succeeded with:
  - `tidbSearchMode: "vector"`
  - `embeddingProvider: "local"`
  - Result retrieval mode: `tidb-vector`
- Chat API verification succeeded with:
  - `tidbSearchMode: "hybrid"`
  - `embeddingProvider: "local"`
  - Result retrieval mode: `tidb-hybrid`
- FULLTEXT was implemented as an optional path, but the current TiDB environment returned `UnknownType: *ast.MatchAgainst`; the app falls back to `tidb-keyword`.

## Important Files

- `src/pages/ChatLabPage.tsx`
  - Standalone chat test UI.
  - Lets the user choose provider and retrieval mode.

- `src/App.tsx`
  - Adds the `/chat-lab` route.

- `server/rag-chat.js`
  - Chat API logic.
  - Supports Groq as the chat provider.
  - Supports TiDB retrieval mode with fallback to local JSONL.

- `server/tidb-rag.js`
  - TiDB connection and retrieval logic.
  - Supports keyword, vector, fulltext, and hybrid modes.
  - Vector mode can use `embeddingProvider: "local"` for contest/demo verification.
  - Fulltext mode falls back to keyword if TiDB does not support `MATCH ... AGAINST`.

- `server/local-embedding.js`
  - Deterministic local hash/ngram embedding for TiDB Vector Search demos without external embedding API keys.

- `server/load-env.js`
  - Loads `.env` and `.env.local` for local server/API testing.

- `scripts/tidb-import-rag-data.mjs`
  - Creates schema and imports local RAG data into TiDB.
  - Useful flags:
    - `--schema-only`
    - `--create-database`
    - `--skip-embeddings`
    - `--dry-run`
    - `--database=neuramnesia_rag`
    - `--local-embeddings`
    - `--apply-fulltext-index`

- `docs/rag/tidb-fulltext-index.sql`
  - Optional FULLTEXT index for `title/content`.

- `docs/rag/tidb-schema.sql`
  - Schema for `knowledge_chunks`.

- `docs/rag/tidb-migration.md`
  - Migration notes and operating plan.

- `.env.local`
  - Exists locally.
  - Contains Groq and TiDB secrets.
  - Do not print or commit this file.

## Environment Variables Needed

Do not expose actual values in chat or commits.

- `GROQ_API_KEY`
- `GROQ_MODEL`
- `TIDB_HOST`
- `TIDB_PORT`
- `TIDB_USER`
- `TIDB_PASSWORD`
- `TIDB_DATABASE`
- `TIDB_RAG_SEARCH_MODE=keyword`

Optional later, only if production semantic vector search is enabled:

- Embedding provider API key/model.
- Current code has OpenAI embedding support and local demo embedding support, but the desired direction is Groq for chat. Since Groq is for chat generation here, production embeddings should be decided separately before relying on semantic vector search.

## Useful Commands

Start dev server:

```powershell
npm run dev -- --port 5174
```

Open test page:

```text
http://127.0.0.1:5174/chat-lab
```

Import existing local RAG data into TiDB without embeddings:

```powershell
npm run rag:tidb:import -- --skip-embeddings
```

Dry run import:

```powershell
npm run rag:tidb:dry-run
```

Import local demo embeddings for TiDB Vector Search:

```powershell
npm run rag:tidb:import-local-vector
```

Build check:

```powershell
npm run build
```

## Current Git State Notes

Modified files from this work:

- `package-lock.json`
- `package.json`
- `server/rag-chat.js`
- `src/App.tsx`

New files from this work:

- `docs/rag/tidb-migration.md`
- `docs/rag/tidb-schema.sql`
- `docs/rag/tidb-vector-index.sql`
- `scripts/tidb-import-rag-data.mjs`
- `server/load-env.js`
- `server/tidb-rag.js`
- `src/pages/ChatLabPage.tsx`
- `docs/rag/handoff-2026-06-20-tidb-groq-chat-lab.md`

Unrelated untracked item observed:

- `docs/ai-e2e/`

Treat `docs/ai-e2e/` as user-owned and unrelated unless the user explicitly asks to touch it.

## Recommended Next Steps

1. Capture article-ready screenshots/Raw JSON from `/chat-lab` for `Keyword`, `Vector + Local`, and `Hybrid + Local`.
2. Decide whether to keep local hash embeddings as a demo-only section or add a production embedding provider before publishing.
3. Improve keyword/hybrid retrieval quality if answers feel weak:
   - better scoring,
   - title/content weighting,
   - Japanese token handling,
   - source filtering.
4. Decide production embedding provider before semantic vector search:
   - Groq can remain the chat generator.
   - Vector RAG still needs an embedding model/provider.
5. After retrieval quality is acceptable, build a small admin UI for adding/editing TiDB knowledge rows.
6. Later, wire the stable chat flow back into the main homepage if desired.
