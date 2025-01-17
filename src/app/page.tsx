"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { JsonView } from "@/components/ui/json-view";

export default function Home() {
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    analysis: any;
    metadata: {
      title: string;
      description: string;
      headings: { h1: string; h2: string };
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze website");
      }

      // Parse the analysis string as JSON if it's a string
      const parsedData = {
        ...data,
        analysis:
          typeof data.analysis === "string"
            ? JSON.parse(data.analysis)
            : data.analysis,
      };

      setResult(parsedData);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-2xl mx-auto text-center space-y-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 text-transparent bg-clip-text">
          Analyze Any Website
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative w-full">
            <Input
              type="url"
              placeholder="https://example.com"
              className="w-full h-14 px-6 rounded-full bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUrl(e.target.value)
              }
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative w-full">
            <Textarea
              placeholder="What would you like to know about this website? (Optional)"
              className="w-full min-h-[100px] px-6 py-4 rounded-xl bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-violet-400 focus:border-transparent transition-all resize-none"
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setPrompt(e.target.value)
              }
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full h-10 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Analyze Website"}
          </Button>
        </form>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6 text-left">
            <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700 space-y-4">
              <h2 className="text-xl font-semibold text-zinc-100">Analysis</h2>
              <JsonView data={result.analysis} />
            </div>

            <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700 space-y-4">
              <h2 className="text-xl font-semibold text-zinc-100">
                Page Metadata
              </h2>
              <dl className="space-y-2">
                <dt className="text-zinc-400">Title</dt>
                <dd className="text-zinc-100">{result.metadata.title}</dd>
                <dt className="text-zinc-400">Description</dt>
                <dd className="text-zinc-100">{result.metadata.description}</dd>
              </dl>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
