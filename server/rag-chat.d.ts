export function createChatResponse(body: unknown): Promise<{
  status: number;
  body: Record<string, unknown>;
}>;

export function readJsonBody(req: unknown): Promise<unknown>;
