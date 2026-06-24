import { createTalentIntakeResponse } from "../server/talent-intake.js";
import { readJsonBody } from "../server/rag-chat.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed", errorCode: "VALIDATION_ERROR" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const result = await createTalentIntakeResponse(body);
    res.status(result.status).json(result.body);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unexpected error",
      errorCode: "TALENT_INTAKE_ERROR",
    });
  }
}
