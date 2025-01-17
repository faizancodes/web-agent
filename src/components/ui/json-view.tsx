import * as React from "react";
import { cn } from "@/lib/utils";

interface JsonViewProps {
  data: any;
  className?: string;
}

function JsonView({ data, className }: JsonViewProps) {
  const renderValue = (value: any, level: number = 0): React.ReactNode => {
    const indent = "  ".repeat(level);

    if (value === null) return <span className="text-red-400">null</span>;
    if (typeof value === "boolean")
      return <span className="text-yellow-400">{value.toString()}</span>;
    if (typeof value === "number")
      return <span className="text-blue-400">{value}</span>;
    if (typeof value === "string")
      return <span className="text-green-400">"{value}"</span>;

    if (Array.isArray(value)) {
      if (value.length === 0) return <span>[]</span>;
      return (
        <div className="flex flex-col">
          <span className="text-zinc-500">[</span>
          <div className="border-l border-zinc-800/60 ml-6">
            {value.map((item, index) => (
              <div key={index} className="pl-4">
                {renderValue(item, level + 1)}
                {index < value.length - 1 && (
                  <span className="text-zinc-500">, </span>
                )}
              </div>
            ))}
          </div>
          <span className="text-zinc-500">]</span>
        </div>
      );
    }

    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) return <span>{"{}"}</span>;
      return (
        <div className="flex flex-col">
          <span className="text-zinc-500">{"{"}</span>
          <div className="border-l border-zinc-800/60 ml-6">
            {entries.map(([key, val], index) => (
              <div key={key} className="pl-4">
                <span className="text-violet-400">"{key}"</span>
                <span className="text-zinc-500 mx-1">: </span>
                <span>
                  {renderValue(val, level + 1)}
                  {index < entries.length - 1 && (
                    <span className="text-zinc-500">, </span>
                  )}
                </span>
              </div>
            ))}
          </div>
          <span className="text-zinc-500">{"}"}</span>
        </div>
      );
    }

    return value;
  };

  return (
    <div
      className={cn(
        "font-mono text-sm text-zinc-300 p-4 rounded-lg bg-zinc-900/30 overflow-x-auto",
        className
      )}
    >
      {renderValue(data)}
    </div>
  );
}

export { JsonView };
