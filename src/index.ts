#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { OpenRouterClient } from "./openrouter.js";
import * as z from "zod";

const SearchWebSchema = z.object({
  query: z.string().min(1, "Query cannot be empty"),
  num_results: z.number().int().min(1).max(10).optional(),
  focus: z.enum(["technical", "development", "general"]).optional(),
});

// Get API key from environment variable
const API_KEY = process.env.OPENROUTER_API_KEY;
const API_BASE_URL = process.env.OPENROUTER_API_URL;

if (!API_KEY) {
  throw new Error("OPENROUTER_API_KEY environment variable is required");
}

class OpenRouterSearchServer {
  private server: Server;
  private openRouter: OpenRouterClient;

  constructor() {
    this.server = new Server(
      {
        name: "developer-research-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.openRouter = new OpenRouterClient(API_KEY, {
      baseUrl: API_BASE_URL,
    });

    this.setupToolHandlers();

    this.server.onerror = (error: Error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "search_web",
          description:
            "Search the web using OpenRouter and return relevant results",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query string",
              },
              num_results: {
                type: "number",
                description: "Number of search results to return (1-10)",
                minimum: 1,
                maximum: 10,
              },
              focus: {
                type: "string",
                description: "Focus area for search results",
                enum: ["technical", "development", "general"],
              },
            },
            required: ["query"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request: any) => {
        if (request.params.name !== "search_web") {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
        }

        try {
          const params = SearchWebSchema.parse(request.params.arguments);

          const result = await this.openRouter.searchWeb(params);

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (error: unknown) {
          if (error instanceof z.ZodError) {
            return {
              content: [
                {
                  type: "text",
                  text: `Invalid parameters: ${(error as z.ZodError).message}`,
                },
              ],
              isError: true,
            };
          }

          return {
            content: [
              {
                type: "text",
                text: `Search failed: ${(error as Error).message}`,
              },
            ],
            isError: true,
          };
        }
      }
    );
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.info("OpenRouter search MCP server running on stdio");
  }
}

const server = new OpenRouterSearchServer();
server.run().catch(console.error);
