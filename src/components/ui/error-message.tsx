"use client";

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div
      className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400
        shadow-lg shadow-red-500/5 backdrop-blur-sm
        animate-in fade-in slide-in-from-top-4 duration-500"
    >
      {message}
    </div>
  );
}
