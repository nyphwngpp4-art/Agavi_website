"use client";

import { useState, useCallback } from "react";
import { workflows, type WorkflowConfig } from "@/lib/workflows";
import { WorkflowForm } from "@/components/WorkflowForm";
import { SavedTemplates } from "@/components/SavedTemplates";
import { DispatchHistory } from "@/components/DispatchHistory";
import { useDispatchStore } from "@/store/dispatch-store";
import { cn } from "@/lib/utils";
import { History, LayoutGrid } from "lucide-react";

const agaviWorkflows = workflows.filter((w) => w.domain === "agavi");

type View = "workflows" | "history";

export function DomainTabs() {
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowConfig>(agaviWorkflows[0]);
  const [view, setView] = useState<View>("workflows");
  const [templateValues, setTemplateValues] = useState<Record<string, string> | undefined>();
  const { setActiveWorkflow: setStoreWorkflow } = useDispatchStore();

  const handleWorkflowSelect = useCallback(
    (wf: WorkflowConfig) => {
      setActiveWorkflow(wf);
      setStoreWorkflow(wf.id);
      setTemplateValues(undefined);
    },
    [setStoreWorkflow]
  );

  const handleTemplateLoad = useCallback((values: Record<string, string>) => {
    setTemplateValues(values);
  }, []);

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex items-center gap-2 border-b pb-3">
        <button
          onClick={() => setView("workflows")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            view === "workflows"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <LayoutGrid className="h-4 w-4" />
          Workflows
        </button>
        <button
          onClick={() => setView("history")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            view === "history"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <History className="h-4 w-4" />
          History
        </button>
      </div>

      {view === "history" ? (
        <DispatchHistory />
      ) : (
        <>
          {/* Workflow sub-tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {agaviWorkflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => handleWorkflowSelect(wf)}
                className={cn(
                  "whitespace-nowrap px-3 py-1.5 rounded-md text-sm font-medium transition-colors shrink-0",
                  activeWorkflow.id === wf.id
                    ? "bg-secondary text-foreground border"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {wf.name}
              </button>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">{activeWorkflow.description}</p>

          {/* Saved templates */}
          <SavedTemplates
            workflowId={activeWorkflow.id}
            onLoad={handleTemplateLoad}
          />

          {/* Form */}
          <WorkflowForm
            key={`${activeWorkflow.id}-${JSON.stringify(templateValues)}`}
            workflow={activeWorkflow}
            initialValues={templateValues}
          />
        </>
      )}
    </div>
  );
}
