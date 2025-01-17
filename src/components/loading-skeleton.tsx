import { Skeleton } from "./ui/skeleton";

export function LoadingSkeleton() {
    return (
      <div className="space-y-6 text-left animate-pulse">
        <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100">Analysis</h2>
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4 bg-zinc-700/50" />
            <Skeleton className="h-4 w-1/2 bg-zinc-700/50" />
            <Skeleton className="h-4 w-2/3 bg-zinc-700/50" />
            <Skeleton className="h-4 w-4/5 bg-zinc-700/50" />
          </div>
        </div>
  
        <div className="p-6 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-100">Page Metadata</h2>
          <dl className="space-y-3">
            <div className="space-y-1">
              <dt className="text-sm text-zinc-400 font-medium">Title</dt>
              <Skeleton className="h-4 w-2/3 bg-zinc-700/50" />
            </div>
            <div className="space-y-1">
              <dt className="text-sm text-zinc-400 font-medium">Description</dt>
              <Skeleton className="h-4 w-full bg-zinc-700/50" />
            </div>
          </dl>
        </div>
      </div>
    );
  }