import axios from "axios";
import {
  OpenRouterRequest,
  OpenRouterResponse,
  OpenRouterAnnotation,
  SearchWebParams,
  SearchWebResult,
  SearchResult,
} from "./types.js";
import { extractDomain, createSearchPrompt } from "./utils.js";

/**
 * Client for interacting with the OpenRouter API
 */
export class OpenRouterClient {
  private apiKey: string;
  private baseUrl: string;

  /**
   * Creates a new OpenRouter client
   * @param apiKey OpenRouter API key
   * @param options Configuration options
   */
  constructor(
    apiKey: string | undefined,
    options: {
      baseUrl?: string;
    } = {}
  ) {
    if (!apiKey) {
      throw new Error("OpenRouter API key is required");
    }
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || "https://openrouter.ai/api/v1";
  }

  /**
   * Performs a web search using OpenRouter
   * @param params Search parameters
   * @returns Search results
   */
  async searchWeb(params: SearchWebParams): Promise<SearchWebResult> {
    try {
      const { query, num_results = 5, focus = "technical" } = params;

      const requestData: OpenRouterRequest = {
        model: "openai/gpt-3.5-turbo:online", // Using :online suffix as mentioned in docs
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
        plugins: [
          {
            id: "web",
            max_results: num_results,
            search_prompt: createSearchPrompt(focus),
          },
        ],
      };

      const headers: Record<string, string> = {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      };

      const response = await axios.post<OpenRouterResponse>(
        `${this.baseUrl}/chat/completions`,
        requestData,
        {
          headers,
          timeout: 30000, // 30 second timeout
        }
      );

      // Extract search results from annotations
      const annotations = response.data.choices[0]?.message?.annotations || [];
      const results: SearchResult[] = annotations
        .filter(
          (ann: OpenRouterAnnotation) =>
            ann.type === "url_citation" && ann.url_citation
        )
        .map((ann: OpenRouterAnnotation) => {
          const citation = ann.url_citation!;
          return {
            title: citation.title || "",
            url: citation.url,
            content: citation.content || "",
            domain: extractDomain(citation.url),
          };
        });

      return {
        success: true,
        results,
        total_results: results.length,
      };
    } catch (error: any) {
      console.error("OpenRouter search error:", error);
      return {
        success: false,
        results: [],
        error:
          error.response?.data?.error?.message ||
          error.message ||
          "Unknown error",
      };
    }
  }
}
