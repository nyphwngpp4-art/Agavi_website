"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Search, ChevronDown, ChevronUp, Trash2 } from "lucide-react";

export function DispatchHistory() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const history = useLiveQuery(
    () => db.history.orderBy("timestamp").reverse().limit(50).toArray(),
    []
  );

  const filtered = history?.filter(
    (h) =>
      h.workflowName.toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(h.payload).toLowerCase().includes(search.toLowerCase())
  );

  const clearHistory = async () => {
    if (confirm("Clear all dispatch history?")) {
      await db.history.clear();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" onClick={clearHistory} title="Clear history">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {!filtered || filtered.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-8">
          No dispatch history yet.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((record) => (
            <div key={record.id} className="border rounded-lg bg-card">
              <button
                className="w-full flex items-center justify-between px-4 py-3 text-left"
                onClick={() =>
                  setExpandedId(expandedId === record.id ? null : record.id!)
                }
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant={record.status === "success" ? "success" : "destructive"}
                    className="text-[10px]"
                  >
                    {record.status}
                  </Badge>
                  <span className="text-sm font-medium">{record.workflowName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(record.timestamp).toLocaleString()}
                  {expandedId === record.id ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </div>
              </button>

              {expandedId === record.id && (
                <div className="px-4 pb-3 border-t">
                  <pre className="text-xs font-mono bg-secondary rounded p-3 mt-2 overflow-x-auto">
                    {JSON.stringify(record.payload, null, 2)}
                  </pre>
                  {record.response && (
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">Response:</span>
                      <pre className="text-xs font-mono bg-secondary rounded p-3 mt-1 overflow-x-auto">
                        {record.response}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
