import { completeWithModelFallback } from "../../src/lib/chatProxy";

type ChatRequestBody = {
  model?: string;
  messages?: unknown[];
  stream?: boolean;
};

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY ?? process.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "OpenRouter API key not configured" });
  }

  let body: ChatRequestBody;
  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  try {
    return await completeWithModelFallback({
      apiKey,
      preferredModel:
        body.model ?? process.env.OPENROUTER_MODEL ?? process.env.VITE_OPENROUTER_MODEL,
      messages: body.messages ?? [],
      stream: body.stream !== false,
    });
  } catch (error) {
    console.error("Chat proxy error:", error);
    return jsonResponse(500, { error: "Internal server error" });
  }
};
