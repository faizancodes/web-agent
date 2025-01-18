"use client";

import { useState } from "react";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { AnalysisResults } from "@/components/analysis-results";
import { ResumeResults } from "@/components/resume-results";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { ErrorMessage } from "@/components/ui/error-message";
import { WebsiteAnalysisForm } from "@/components/website-analysis-form";
import { ResumeAnalysisButton } from "@/components/resume-analysis-button";
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

  const handleFormChange = (field: keyof FormState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex flex-col items-center p-4 relative overflow-x-hidden">
      <AmbientBackground />

      <main className="w-full max-w-2xl mx-auto text-center space-y-12 relative py-16 mt-[15vh]">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-gradient-moving animate-gradient text-transparent bg-clip-text pb-2">
          Analyze Any Website
        </h1>

        <WebsiteAnalysisForm
          formState={formState}
          isLoading={loadingState.isLoading}
          onSubmit={handleSubmit}
          onFormChange={handleFormChange}
        />

        {error.error && <ErrorMessage message={error.error} />}

        {loadingState.isLoading && <LoadingSkeleton />}

        {!loadingState.isLoading && result && (
          <>
            <AnalysisResults result={result} />

            <div className="space-y-4">
              <ResumeAnalysisButton
                isAnalyzing={loadingState.isAnalyzingResume}
                onAnalyze={handleResumeAnalysis}
              />

              {resumeResults && <ResumeResults results={resumeResults} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
