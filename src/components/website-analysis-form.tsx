"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type { FormState } from "@/types/analyze";

interface WebsiteAnalysisFormProps {
  formState: FormState;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onFormChange: (field: keyof FormState, value: string) => void;
}

export function WebsiteAnalysisForm({
  formState,
  isLoading,
  onSubmit,
  onFormChange,
}: WebsiteAnalysisFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
          onChange={e => onFormChange("url", e.target.value)}
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
          value={formState.prompt}
          onChange={e => onFormChange("prompt", e.target.value)}
          disabled={isLoading}
        />
      </div>

      <Button
        type="submit"
        className="w-full h-10 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 
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
  );
}
