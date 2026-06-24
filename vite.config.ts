import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "local-rag-chat-api",
      configureServer(server) {
        server.middlewares.use("/api/chat", async (req: any, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ response: "", error: "Method Not Allowed", errorCode: "VALIDATION_ERROR" }));
            return;
          }

          try {
            const chunks: Uint8Array[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk);
            }
            const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
            const bodyBytes = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
              bodyBytes.set(chunk, offset);
              offset += chunk.length;
            }
            const raw = new TextDecoder().decode(bodyBytes);
            const body = raw ? JSON.parse(raw) : {};
            const { createChatResponse } = await import("./server/rag-chat.js");
            const result = await createChatResponse(body);
            res.statusCode = result.status;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify(result.body));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(
              JSON.stringify({
                response: "",
                error: error instanceof Error ? error.message : "Unexpected error",
                errorCode: "LLM_ERROR",
              }),
            );
          }
        });

        server.middlewares.use("/api/talent-intake", async (req: any, res) => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify({ error: "Method Not Allowed", errorCode: "VALIDATION_ERROR" }));
            return;
          }

          try {
            const chunks: Uint8Array[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk);
            }
            const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
            const bodyBytes = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
              bodyBytes.set(chunk, offset);
              offset += chunk.length;
            }
            const raw = new TextDecoder().decode(bodyBytes);
            const body = raw ? JSON.parse(raw) : {};
            const { createTalentIntakeResponse } = await import("./server/talent-intake.js");
            const result = await createTalentIntakeResponse(body);
            res.statusCode = result.status;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify(result.body));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(
              JSON.stringify({
                error: error instanceof Error ? error.message : "Unexpected error",
                errorCode: "TALENT_INTAKE_ERROR",
              }),
            );
          }
        });
      },
    },
  ],
});
