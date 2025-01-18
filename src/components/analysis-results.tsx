import { JsonView } from "@/components/ui/json-view";
import { AnalysisResult } from "@/types/analyze";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
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
        <h2 className="text-xl font-semibold text-zinc-100">Page Metadata</h2>
        <dl className="space-y-3">
          <div className="space-y-1">
            <dt className="text-sm text-zinc-400 font-medium">Title</dt>
            <dd className="text-zinc-100">{result.metadata.title}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm text-zinc-400 font-medium">Description</dt>
            <dd className="text-zinc-100">{result.metadata.description}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
