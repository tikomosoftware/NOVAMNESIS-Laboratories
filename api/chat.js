import { createChatResponse, readJsonBody } from "../server/rag-chat.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ response: "", error: "Method Not Allowed", errorCode: "VALIDATION_ERROR" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const result = await createChatResponse(body);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({
      response: "",
      error: error instanceof Error ? error.message : "Unexpected error",
      errorCode: "LLM_ERROR",
    });
  }
}
