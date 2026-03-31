import { DomainTabs } from "@/components/DomainTabs";
import { Terminal } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-4 py-3 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Terminal className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">Agavi Dispatch</h1>
              <p className="text-[11px] text-muted-foreground leading-none">
                Command Interface v1.0
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">AGAVI</span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <DomainTabs />
        </div>
      </div>
    </main>
  );
}
