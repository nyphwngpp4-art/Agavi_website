"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-muted text-sm font-semibold transition-all hover:text-surface"
      style={{
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.1)",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path
          d="M3 5V2h9v3M3 10H1V6h13v4h-2M3 10v3h9v-3M5 12h5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Download Summary
    </button>
  );
}
