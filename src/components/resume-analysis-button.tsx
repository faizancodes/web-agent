"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ResumeAnalysisButtonProps {
  isAnalyzing: boolean;
  onAnalyze: () => Promise<void>;
}

export function ResumeAnalysisButton({
  isAnalyzing,
  onAnalyze,
}: ResumeAnalysisButtonProps) {
  return (
    <Button
      onClick={onAnalyze}
      disabled={isAnalyzing}
      className="w-full h-10 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 
        text-white font-medium shadow-lg shadow-teal-500/25 
        transition-all duration-300 hover:shadow-teal-500/40 hover:scale-[1.02]
        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {isAnalyzing ? (
        <>
          <Loader2 className="animate-spin" />
          Analyzing Resume Match...
        </>
      ) : (
        "Analyze Resume Match"
      )}
    </Button>
  );
}
