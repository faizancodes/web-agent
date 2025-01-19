import { JsonView } from "@/components/ui/json-view";
import { AnalysisResult } from "@/types/analyze";
import { Button } from "@/components/ui/button";
import { jsonToCSV, downloadCSV } from "@/utils/csv";

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const handleDownload = () => {
    const csvContent = jsonToCSV(result.analysis);
    downloadCSV(csvContent, "analysis-results.csv");
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div
        className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 space-y-4
        shadow-lg shadow-black/20 backdrop-blur-sm
        hover:bg-zinc-800/70 hover:border-violet-500/30 transition-colors duration-300"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-100">Analysis</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="text-zinc-300 hover:text-zinc-100"
          >
            Download CSV
          </Button>
        </div>
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
