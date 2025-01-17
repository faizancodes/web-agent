"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { JsonView } from "@/components/ui/json-view";
import { Loader2 } from "lucide-react";
import { LoadingSkeleton } from "@/components/loading-skeleton";

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
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black flex flex-col items-center p-4 relative overflow-x-hidden">
      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-3/4 h-1/2 bg-violet-500/10 blur-[120px] rounded-full" />
      <div className="fixed bottom-0 right-1/4 w-3/4 h-1/2 bg-blue-500/10 blur-[120px] rounded-full" />

      <main className="w-full max-w-2xl mx-auto text-center space-y-12 relative py-16 mt-[15vh]">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-gradient-moving animate-gradient text-transparent bg-clip-text pb-2">
          Analyze Any Website
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative w-full group">
            <Input
              type="url"
              placeholder="https://example.com"
              className="w-full h-14 px-6 rounded-full bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500 
                focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 
                shadow-lg shadow-black/20 backdrop-blur-sm
                transition-all duration-300
                group-hover:bg-zinc-800/70 group-hover:border-violet-500/30"
              value={url}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUrl(e.target.value)
              }
              required
              disabled={isLoading}
            />
          </div>
          <div className="relative w-full group">
            <Textarea
              placeholder="What would you like to know about this website? (Optional)"
              className="w-full min-h-[100px] px-6 py-4 rounded-2xl bg-zinc-800/50 border-zinc-700/50 text-zinc-100 placeholder:text-zinc-500 
                focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
                shadow-lg shadow-black/20 backdrop-blur-sm
                transition-all duration-300
                group-hover:bg-zinc-800/70 group-hover:border-violet-500/30
                resize-none"
              value={prompt}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setPrompt(e.target.value)
              }
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 
              text-white font-medium shadow-lg shadow-violet-500/25 
              transition-all duration-300 hover:shadow-violet-500/40 hover:scale-[1.02]
              disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Website"
            )}
          </Button>
        </form>

        {error && (
          <div
            className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400
            shadow-lg shadow-red-500/5 backdrop-blur-sm
            animate-in fade-in slide-in-from-top-4 duration-500"
          >
            {error}
          </div>
        )}

        {isLoading && <LoadingSkeleton />}

        {!isLoading && result && (
          <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div
              className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 space-y-4
              shadow-lg shadow-black/20 backdrop-blur-sm
              hover:bg-zinc-800/70 hover:border-violet-500/30 transition-colors duration-300"
            >
              <h2 className="text-xl font-semibold text-zinc-100">Analysis</h2>
              <JsonView data={result.analysis} />
            </div>

            <div
              className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 space-y-4
              shadow-lg shadow-black/20 backdrop-blur-sm
              hover:bg-zinc-800/70 hover:border-violet-500/30 transition-colors duration-300"
            >
              <h2 className="text-xl font-semibold text-zinc-100">
                Page Metadata
              </h2>
              <dl className="space-y-3">
                <div className="space-y-1">
                  <dt className="text-sm text-zinc-400 font-medium">Title</dt>
                  <dd className="text-zinc-100">{result.metadata.title}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm text-zinc-400 font-medium">
                    Description
                  </dt>
                  <dd className="text-zinc-100">
                    {result.metadata.description}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
