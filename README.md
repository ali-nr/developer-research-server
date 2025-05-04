# OpenRouter Search MCP Server

A Model Context Protocol (MCP) server that provides web search capabilities using OpenRouter's web search feature.

## Features

- Search the web using OpenRouter's web search feature
- Optimized for technical and software development content
- Reliable error handling and retry mechanisms
- Well-structured, consistent response format

## Prerequisites

- Node.js 18 or higher
- An OpenRouter API key

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/developer-research-server.git
cd developer-research-server
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Configuration

The server requires the following environment variables:

- `OPENROUTER_API_KEY` (required): Your OpenRouter API key
- `OPENROUTER_API_URL` (optional): The OpenRouter API URL (defaults to "https://openrouter.ai/api/v1")

## Usage with Cline

Add the following configuration to your `.roo/mcp.json` file:

```json
{
  "mcpServers": {
    "openrouter-search": {
      "command": "node",
      "args": ["/path/to/developer-research-server/build/index.js"],
      "env": {
        "OPENROUTER_API_KEY": "your-openrouter-api-key",
        "OPENROUTER_API_URL": "https://openrouter.ai/api/v1"
      },
      "alwaysAllow": ["search_web"],
      "timeout": 60
    }
  }
}
```

## Available Tools

### search_web

Performs a web search using OpenRouter and returns relevant results.

#### Parameters

- `query` (required): The search query string
- `num_results` (optional): Number of search results to return (1-10, default: 5)
- `focus` (optional): Focus area for search results ("technical", "development", or "general", default: "technical")

#### Example

```typescript
const result = await useMcpTool("openrouter-search", "search_web", {
  query: "React hooks best practices 2024",
  num_results: 5,
  focus: "technical",
});
```

#### Response Format

```json
{
  "success": true,
  "results": [
    {
      "title": "React Hooks Best Practices for 2024",
      "url": "https://example.com/react-hooks-best-practices",
      "content": "A comprehensive guide to React hooks best practices in 2024...",
      "domain": "example.com"
    }
    // More results...
  ],
  "total_results": 5
}
```

## License

MIT

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
