import crypto from "node:crypto";

export const LOCAL_EMBEDDING_MODEL = "local-hash-ngram-v1";
export const DEFAULT_LOCAL_EMBEDDING_DIMENSIONS = 1536;

function hashUInt32(value) {
  const digest = crypto.createHash("sha256").update(value).digest();
  return digest.readUInt32BE(0);
}

function tokenizeEmbeddingInput(input) {
  const normalized = String(input || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}ー]+/gu, " ")
    .trim();

  const words = normalized.split(/\s+/).filter((word) => word.length >= 2);
  const compact = normalized.replace(/\s+/g, "");
  const chars = [...compact];
  const grams = [];
  for (let size = 2; size <= 4; size += 1) {
    for (let index = 0; index <= chars.length - size; index += 1) {
      grams.push(chars.slice(index, index + size).join(""));
    }
  }

  return [...new Set([...words, ...grams])].slice(0, 800);
}

export function createLocalEmbedding(input, { dimensions = DEFAULT_LOCAL_EMBEDDING_DIMENSIONS } = {}) {
  const vector = Array.from({ length: dimensions }, () => 0);
  const tokens = tokenizeEmbeddingInput(input);
  if (!tokens.length) return vector;

  for (const token of tokens) {
    const index = hashUInt32(`i:${token}`) % dimensions;
    const sign = hashUInt32(`s:${token}`) % 2 === 0 ? 1 : -1;
    const weight = Math.min(2.5, Math.log2([...token].length + 1));
    vector[index] += sign * weight;
  }

  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (!norm) return vector;

  return vector.map((value) => Number((value / norm).toFixed(6)));
}
