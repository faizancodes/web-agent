"use client";

export function AmbientBackground() {
  return (
    <>
      <div className="fixed top-0 left-1/4 w-3/4 h-1/2 bg-violet-500/10 blur-[120px] rounded-full" />
      <div className="fixed bottom-0 right-1/4 w-3/4 h-1/2 bg-blue-500/10 blur-[120px] rounded-full" />
    </>
  );
}
