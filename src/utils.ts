/**
 * Extracts the domain from a URL
 * @param url The URL to extract the domain from
 * @returns The domain name
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}

/**
 * Creates a search prompt based on the focus area
 * @param focus The focus area for the search
 * @returns A formatted search prompt
 */
export function createSearchPrompt(focus: string): string {
  const date = new Date().toISOString().split("T")[0];

  let prompt = `A web search was conducted on ${date}. Incorporate the following web search results into your response.`;

  if (focus === "technical" || focus === "development") {
    prompt +=
      " Focus on technical accuracy, code examples, and software development best practices.";
  }

  prompt +=
    "\n\nIMPORTANT: Cite them using markdown links named using the domain of the source.";
  prompt += "\nExample: [nytimes.com](https://nytimes.com/some-page).";

  return prompt;
}
