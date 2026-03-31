"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2 } from "lucide-react";

interface SavedTemplatesProps {
  workflowId: string;
  onLoad: (values: Record<string, string>) => void;
}

export function SavedTemplates({ workflowId, onLoad }: SavedTemplatesProps) {
  const templates = useLiveQuery(
    () =>
      db.templates
        .where("workflowId")
        .equals(workflowId)
        .reverse()
        .sortBy("createdAt"),
    [workflowId]
  );

  const deleteTemplate = async (id: number) => {
    await db.templates.delete(id);
  };

  if (!templates || templates.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Saved Templates
      </h3>
      <div className="flex flex-wrap gap-2">
        {templates.map((tmpl) => (
          <div key={tmpl.id} className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLoad(tmpl.values)}
              className="text-xs"
            >
              <FileText className="h-3 w-3 mr-1" />
              {tmpl.name}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => deleteTemplate(tmpl.id!)}
            >
              <Trash2 className="h-3 w-3 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
