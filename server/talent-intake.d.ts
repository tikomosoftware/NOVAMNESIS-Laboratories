export function createTalentIntakeResponse(body: unknown): Promise<{
  status: number;
  body: Record<string, unknown>;
}>;
