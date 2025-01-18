export function normalizeUrl(urlString: string, baseUrl: string): string {
  try {
    // If it's already a valid absolute URL, return it
    if (urlString.startsWith("http")) {
      return urlString;
    }

    // Remove any leading/trailing whitespace
    urlString = urlString.trim();

    // Handle absolute paths (starting with /)
    if (urlString.startsWith("/")) {
      const baseUrlObj = new URL(baseUrl);
      return `${baseUrlObj.origin}${urlString}`;
    }

    // Handle relative paths
    return new URL(urlString, baseUrl).toString();
  } catch (error) {
    console.error("Error normalizing URL:", error);
    return urlString;
  }
}

export function extractUrlsFromAnalysis(
  analysis: any,
  baseUrl: string
): string[] {
  const urls = new Set<string>();

  const traverse = (obj: any) => {
    if (!obj) return;

    if (typeof obj === "string") {
      // Check if it's a URL-like string (starts with http or /)
      if (obj.startsWith("http") || obj.startsWith("/")) {
        urls.add(normalizeUrl(obj, baseUrl));
      }
    } else if (typeof obj === "object") {
      for (const value of Object.values(obj)) {
        if (Array.isArray(value)) {
          value.forEach(traverse);
        } else {
          traverse(value);
        }
      }
    }
  };

  traverse(analysis);
  return Array.from(urls);
}
