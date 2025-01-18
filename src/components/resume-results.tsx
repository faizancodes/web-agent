import { cn } from "@/lib/utils";
import { ResumeResult } from "@/types/analyze";

interface ResumeResultsProps {
  results: ResumeResult[];
}

export function ResumeResults({ results }: ResumeResultsProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-lg font-semibold text-zinc-100">
        Resume Analysis Results
      </h3>
      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/50 space-y-2
              hover:bg-zinc-800/50 hover:border-teal-500/30 transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal-400 hover:text-teal-300 transition-colors truncate max-w-[80%]"
              >
                {result.url}
              </a>
              <span
                className={cn(
                  "text-sm font-medium px-2 py-1 rounded-full",
                  result.relevanceScore >= 70
                    ? "bg-emerald-500/20 text-emerald-400"
                    : result.relevanceScore >= 40
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                )}
              >
                {result.relevanceScore}% Match
              </span>
            </div>
            <p className="text-sm text-zinc-400">{result.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
