"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { AnalysisResults } from "@/components/analysis-results";
import { ResumeResults } from "@/components/resume-results";
import { extractUrlsFromAnalysis } from "@/utils/url";
import type {
  AnalysisResult,
  ResumeResult,
  FormState,
  LoadingState,
  ErrorState,
} from "@/types/analyze";

export default function Home() {
  // Form state
  const [formState, setFormState] = useState<FormState>({
    url: "",
    prompt: "",
  });

  // Loading states
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    isAnalyzingResume: false,
  });

  // Results state
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resumeResults, setResumeResults] = useState<ResumeResult[] | null>(
    null
  );
  const [error, setError] = useState<ErrorState>({ error: null });

  const handleResumeAnalysis = async () => {
    if (!result?.analysis) return;

    setLoadingState(prev => ({ ...prev, isAnalyzingResume: true }));
    setResumeResults(null);
    setError({ error: null });

    try {
      const urls = extractUrlsFromAnalysis(result.analysis, formState.url);

      if (urls.length === 0) {
        throw new Error("No URLs found in the analysis");
      }

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume match");
      }

      setResumeResults(data.results);
    } catch (error) {
      console.error("Error:", error);
      setError({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setLoadingState(prev => ({ ...prev, isAnalyzingResume: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.url) return;

    setLoadingState(prev => ({ ...prev, isLoading: true }));
    setError({ error: null });
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
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
      setError({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      setLoadingState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex flex-col items-center p-4 relative overflow-x-hidden">
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
              value={formState.url}
              onChange={e =>
                setFormState(prev => ({ ...prev, url: e.target.value }))
              }
              required
              disabled={loadingState.isLoading}
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
              value={formState.prompt}
              onChange={e =>
                setFormState(prev => ({ ...prev, prompt: e.target.value }))
              }
              disabled={loadingState.isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-10 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 
              text-white font-medium shadow-lg shadow-violet-500/25 
              transition-all duration-300 hover:shadow-violet-500/40 hover:scale-[1.02]
              disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={loadingState.isLoading}
          >
            {loadingState.isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Website"
            )}
          </Button>
        </form>

        {error.error && (
          <div
            className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400
            shadow-lg shadow-red-500/5 backdrop-blur-sm
            animate-in fade-in slide-in-from-top-4 duration-500"
          >
            {error.error}
          </div>
        )}

        {loadingState.isLoading && <LoadingSkeleton />}

        {!loadingState.isLoading && result && (
          <>
            <AnalysisResults result={result} />

            <div className="space-y-4">
              <Button
                onClick={handleResumeAnalysis}
                disabled={loadingState.isAnalyzingResume}
                className="w-full h-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 
                  text-white font-medium shadow-lg shadow-teal-500/25 
                  transition-all duration-300 hover:shadow-teal-500/40 hover:scale-[1.02]
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loadingState.isAnalyzingResume ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Analyzing Resume Match...
                  </>
                ) : (
                  "Analyze Resume Match"
                )}
              </Button>

              {resumeResults && <ResumeResults results={resumeResults} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
