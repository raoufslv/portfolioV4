import {
  CHAT_COMPLETION_OPTIONS,
  getChatModelCandidates,
  inspectBufferedStream,
  isRetryableChatError,
  readChatError,
} from "./chatModels";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const PEEK_LIMIT = 8192;

type AttemptFailure = {
  status: number;
  message: string;
  body: unknown;
};

type AttemptResult = { ok: true; response: Response } | { ok: false; error: AttemptFailure };

export async function completeWithModelFallback(options: {
  apiKey: string;
  messages: unknown[];
  stream: boolean;
}): Promise<Response> {
  const candidates = getChatModelCandidates();
  let lastFailure: AttemptFailure | null = null;

  for (let index = 0; index < candidates.length; index += 1) {
    const model = candidates[index];
    const result = await attemptModel(options, model);

    if (result.ok) return result.response;

    lastFailure = result.error;
    const canTryNext =
      index < candidates.length - 1 &&
      isRetryableChatError(result.error.status, result.error.message);

    if (!canTryNext) {
      return jsonResponse(result.error.status, result.error.body);
    }

    console.warn(
      `Chat model "${model}" unavailable (${result.error.status}: ${result.error.message}). Trying the next model...`
    );
  }

  return jsonResponse(
    lastFailure?.status ?? 502,
    lastFailure?.body ?? { error: "Chat API error" }
  );
}

async function attemptModel(
  options: {
    apiKey: string;
    messages: unknown[];
    stream: boolean;
  },
  model: string
): Promise<AttemptResult> {
  let upstream: Response;
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.apiKey}`,
        "HTTP-Referer": "https://raoufabdallah.me",
        "X-Title": "Raouf Portfolio",
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        stream: options.stream,
        ...CHAT_COMPLETION_OPTIONS,
      }),
    });
  } catch (error) {
    console.error(`Chat model "${model}" request failed:`, error);
    return {
      ok: false,
      error: {
        status: 502,
        message: "Chat provider unreachable",
        body: { error: "Chat provider unreachable" },
      },
    };
  }

  if (!upstream.ok) {
    const errorData = await upstream.json().catch(() => ({}));
    const { status, message } = readChatError(errorData, upstream.status);
    return { ok: false, error: { status, message, body: errorData } };
  }

  if (!options.stream) {
    const data = await upstream.json().catch(() => ({}));
    if (data && typeof data === "object" && "error" in data && (data as { error?: unknown }).error) {
      const { status, message } = readChatError(data, 502);
      return { ok: false, error: { status, message, body: data } };
    }
    return { ok: true, response: jsonResponse(200, data) };
  }

  return peekStream(upstream);
}

async function peekStream(upstream: Response): Promise<AttemptResult> {
  if (!upstream.body) {
    return {
      ok: false,
      error: {
        status: 502,
        message: "Streaming not supported",
        body: { error: "Streaming not supported" },
      },
    };
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  const buffered: Uint8Array[] = [];
  let text = "";

  try {
    while (text.length < PEEK_LIMIT) {
      const { done, value } = await reader.read();
      if (done) break;
      buffered.push(value);
      text += decoder.decode(value, { stream: true });

      const inspection = inspectBufferedStream(text);
      if (inspection.kind === "error") {
        await reader.cancel().catch(() => undefined);
        return {
          ok: false,
          error: {
            status: inspection.status,
            message: inspection.message,
            body: inspection.body,
          },
        };
      }
      if (inspection.kind === "content") {
        return { ok: true, response: continueStream(buffered, reader) };
      }
    }
  } catch (error) {
    console.error("Chat stream peek failed:", error);
    await reader.cancel().catch(() => undefined);
    return {
      ok: false,
      error: {
        status: 502,
        message: "Chat provider unreachable",
        body: { error: "Chat provider unreachable" },
      },
    };
  }

  const inspection = inspectBufferedStream(text);
  if (inspection.kind === "error") {
    await reader.cancel().catch(() => undefined);
    return {
      ok: false,
      error: {
        status: inspection.status,
        message: inspection.message,
        body: inspection.body,
      },
    };
  }

  if (inspection.kind === "pending" && text.length < PEEK_LIMIT) {
    await reader.cancel().catch(() => undefined);
    return {
      ok: false,
      error: {
        status: 502,
        message: "Empty chat response",
        body: { error: "Empty chat response" },
      },
    };
  }

  return { ok: true, response: continueStream(buffered, reader) };
}

function continueStream(
  buffered: Uint8Array[],
  reader: ReadableStreamDefaultReader<Uint8Array>
): Response {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (const chunk of buffered) controller.enqueue(chunk);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      return reader.cancel();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
