# Developer Research MCP Server

This repository contains a Model Context Protocol (MCP) server designed to provide structured research capabilities, primarily web search, for AI agents or other development tools. MCP enables standardized communication between a client (like an AI agent) and servers offering specialized tools.

This server initially uses OpenRouter for its web search functionality but is built with an extensible architecture to easily integrate additional research providers (e.g., other search engines, databases) in the future.

## Table of Contents

- [Developer Research MCP Server](#developer-research-mcp-server)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture and Extensibility](#architecture-and-extensibility)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Consumption](#consumption)
    - [Using with Roo Code](#using-with-roo-code)
  - [Available Tools](#available-tools)
    - [search_web](#search_web)
      - [Parameters](#parameters)
      - [Example (Conceptual Roo Code Usage)](#example-conceptual-roo-code-usage)
      - [Response Format](#response-format)
  - [License](#license)

## Features

- Provides web search capabilities via providers like OpenRouter.
- Optimized for retrieving technical and software development content.
- Designed for extensibility to support multiple research providers.
- Implements reliable error handling and retry mechanisms.
- Delivers results in a well-structured, consistent JSON format suitable for programmatic use.

## Architecture and Extensibility

This server utilizes a modular architecture. Each research provider (like OpenRouter) is implemented as a distinct module adhering to a common interface. This design principle makes it straightforward to:

1. Add support for new search engines or data sources.
2. Switch between providers based on configuration or request parameters (future enhancement).
3. Maintain and update provider-specific logic independently.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://docs.npmjs.com/cli/v10/commands/npm-install) (comes with Node.js)
- An API key for the desired research provider (e.g., OpenRouter)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/developer-research-server.git # Replace with the actual URL
   cd developer-research-server
   ```

2. **Install dependencies:**
   Use npm to install the project dependencies.

   ```bash
   npm install
   ```

3. **Build the project:**
   Compile the TypeScript code to JavaScript.

   ```bash
   npm run build
   ```

   The compiled output will be in the `build/` directory.

## Configuration

The server is configured using environment variables.

1. **Create a `.env` file:**
   Copy the `mcp-config-sample.json` (if available, or create one manually) to a `.env` file in the project root.

   ```bash
   # Example .env file content:
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_API_URL=https://openrouter.ai/api/v1
   ```

   _Note: Ensure the `.env` file is added to your `.gitignore` to avoid committing secrets._

2. **Required Environment Variables:**

   - `OPENROUTER_API_KEY` (required for OpenRouter provider): Your unique OpenRouter API key.
   - `OPENROUTER_API_URL` (optional): The base URL for the OpenRouter API. Defaults to `https://openrouter.ai/api/v1`.

   _Future providers might require different environment variables._

## Consumption

This MCP server listens for requests over standard input/output (stdio) when run directly. It's designed to be integrated into tools like Roo Code.

### Using with Roo Code

To use this server with Roo Code, add the following configuration to your `.roo/mcp.json` file. Adjust the `args` path to point to the compiled `index.js` file within your cloned repository location.

```json
{
  "mcpServers": {
    "developer-research": {
      // Changed name to be more generic
      "command": "node",
      "args": ["/full/path/to/your/developer-research-server/build/index.js"], // <-- IMPORTANT: Update this path
      "env": {
        // Environment variables are typically loaded from the .env file
        // Or can be explicitly set here if needed, but .env is recommended for secrets
        // "OPENROUTER_API_KEY": "your-openrouter-api-key", // <-- Replace or load from .env
        // "OPENROUTER_API_URL": "https://openrouter.ai/api/v1"
      },
      "alwaysAllow": ["search_web"], // List tools the agent can always use
      "timeout": 60 // Timeout in seconds
    }
  }
}
```

**Important:**

- Replace `/full/path/to/your/developer-research-server/build/index.js` with the correct absolute path on your system.
- Ensure the `OPENROUTER_API_KEY` is securely configured, preferably via the `.env` file loaded by the server process itself, rather than hardcoding it in `mcp.json`.

## Available Tools

Currently, the server provides the following tools:

### search_web

Performs a web search using the configured provider (currently OpenRouter) and returns relevant results.

#### Parameters

- `query` (string, required): The search query.
- `num_results` (integer, optional): The desired number of search results. Must be between 1 and 10. Defaults to 5.
- `focus` (string, optional): Specifies the focus area for the search. Supported values: `"technical"`, `"development"`, `"general"`. Defaults to `"technical"`.

#### Example (Conceptual Roo Code Usage)

```typescript
// Within a Roo Code agent or script
const searchResults = await useMcpTool("developer-research", "search_web", {
  query: "advanced typescript patterns",
  num_results: 3,
  focus: "technical",
});

console.log(searchResults);
```

#### Response Format

The tool returns a JSON object with the following structure:

```json
{
  "success": true, // Boolean indicating if the search was successful
  "results": [
    // Array of result objects
    {
      "title": "Title of the search result",
      "url": "https://example.com/page",
      "content": "A snippet or summary of the page content...",
      "domain": "example.com"
    }
    // ... more results
  ],
  "total_results": 3 // The actual number of results returned
}
```

In case of an error, the response might look like:

```json
{
  "success": false,
  "error": "Description of the error that occurred."
}
```

## License

MIT
