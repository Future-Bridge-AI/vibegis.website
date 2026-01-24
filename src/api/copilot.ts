/**
 * CopilotKit Runtime API Handler
 * Handles requests from CopilotKit and routes them to OpenRouter
 */

import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import type { IncomingMessage, ServerResponse } from "http";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1";

/**
 * Create the CopilotKit runtime handler
 * Accepts API key and model from request headers for flexibility
 */
export function createCopilotHandler() {
  return async (req: IncomingMessage, res: ServerResponse) => {
    // Get API key from header (passed by frontend)
    const apiKey = req.headers["x-openrouter-key"] as string;
    const model = (req.headers["x-openrouter-model"] as string) || "anthropic/claude-sonnet-4";

    if (!apiKey) {
      res.statusCode = 401;
      res.end(JSON.stringify({ error: "Missing API key" }));
      return;
    }

    // Create OpenAI client configured for OpenRouter
    const openai = new OpenAI({
      apiKey,
      baseURL: OPENROUTER_API_URL,
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

    return handler(req, res);
  };
}
