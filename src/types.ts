// OpenRouter API types
export interface OpenRouterRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  plugins?: Array<{
    id: string;
    max_results?: number;
    search_prompt?: string;
  }>;
}

export interface OpenRouterAnnotation {
  type: string;
  url_citation?: {
    url: string;
    title: string;
    content?: string;
    start_index: number;
    end_index: number;
  };
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
      annotations?: OpenRouterAnnotation[];
    };
  }>;
}

// MCP tool types
export interface SearchWebParams {
  query: string;
  num_results?: number;
  focus?: "technical" | "development" | "general";
}

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  domain: string;
}

export interface SearchWebResult {
  success: boolean;
  results: SearchResult[];
  total_results?: number;
  error?: string;
}
