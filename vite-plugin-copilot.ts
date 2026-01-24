/**
 * Vite Plugin for CopilotKit Runtime
 * Adds middleware to handle /api/copilot requests in development
 */

import type { Plugin, ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "http";

/**
 * Middleware to handle CopilotKit runtime requests
 * Routes to OpenRouter with API key from request headers
 */
async function handleCopilotRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<boolean> {
  // Only handle POST to /api/copilot
  if (req.url !== "/api/copilot" || req.method !== "POST") {
    return false;
  }

  // Dynamically import to avoid bundling issues
  const { CopilotRuntime, OpenAIAdapter, copilotRuntimeNodeHttpEndpoint } =
    await import("@copilotkit/runtime");
  const OpenAI = (await import("openai")).default;

  // Get API key from header
  const apiKey = req.headers["x-openrouter-key"] as string;
  const model =
    (req.headers["x-openrouter-model"] as string) || "anthropic/claude-sonnet-4";

  if (!apiKey) {
    res.statusCode = 401;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Missing API key" }));
    return true;
  }

  try {
    // Create OpenAI client configured for OpenRouter
    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": "https://vibegis.com",
        "X-Title": "VibeGIS Widget Generator",
      },
    });

    // Create service adapter
    const serviceAdapter = new OpenAIAdapter({
      openai,
      model,
    });

    // Create CopilotKit runtime
    const runtime = new CopilotRuntime();

    // Handle the request
    const handler = copilotRuntimeNodeHttpEndpoint({
      endpoint: "/api/copilot",
      runtime,
      serviceAdapter,
    });

    await handler(req, res);
    return true;
  } catch (error) {
    console.error("CopilotKit handler error:", error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      })
    );
    return true;
  }
}

/**
 * Vite plugin that adds CopilotKit runtime middleware
 */
export function copilotPlugin(): Plugin {
  return {
    name: "vite-plugin-copilot",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const handled = await handleCopilotRequest(req, res);
        if (!handled) {
          next();
        }
      });
    },
  };
}

export default copilotPlugin;
