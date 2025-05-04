#!/usr/bin/env node

/**
 * Simple test script to run the OpenRouter search MCP server locally
 *
 * Usage:
 * 1. Set your OpenRouter API key as an environment variable:
 *    export OPENROUTER_API_KEY=your-api-key
 *
 * 2. Run this script:
 *    node test-server.js
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if API key is set
if (!process.env.OPENROUTER_API_KEY) {
  console.error("Error: OPENROUTER_API_KEY environment variable is not set");
  console.error("Please set it before running this script:");
  console.error("export OPENROUTER_API_KEY=your-api-key");
  process.exit(1);
}

// Path to the compiled server
const serverPath = join(__dirname, "build", "index.js");

console.log("Starting OpenRouter search MCP server...");
console.log(
  `Using API key: ${process.env.OPENROUTER_API_KEY.substring(0, 4)}...`
);

// Spawn the server process
const server = spawn("node", [serverPath], {
  env: {
    ...process.env,
    OPENROUTER_API_URL:
      process.env.OPENROUTER_API_URL || "https://openrouter.ai/api/v1",
  },
  stdio: "inherit",
});

// Handle server process events
server.on("error", (err) => {
  console.error("Failed to start server:", err);
});

server.on("close", (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle termination signals
process.on("SIGINT", () => {
  console.log("Received SIGINT. Shutting down server...");
  server.kill("SIGINT");
});

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Shutting down server...");
  server.kill("SIGTERM");
});
