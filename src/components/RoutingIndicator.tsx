"use client";

import type { WorkflowConfig } from "@/lib/workflows";
import { useDispatchStore } from "@/store/dispatch-store";
import { Badge } from "@/components/ui/badge";
import { Radio, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface RoutingIndicatorProps {
  workflow: WorkflowConfig;
}

export function RoutingIndicator({ workflow }: RoutingIndicatorProps) {
  const { dispatchStatus } = useDispatchStore();

  const statusConfig = {
    idle: { icon: Radio, color: "text-muted-foreground", label: "Ready" },
    sending: { icon: Loader2, color: "text-yellow-500", label: "Sending..." },
    success: { icon: CheckCircle, color: "text-emerald-500", label: "Sent" },
    error: { icon: XCircle, color: "text-destructive", label: "Failed" },
  };

  const { icon: StatusIcon, color, label } = statusConfig[dispatchStatus];

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-2.5">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Sending to:</span>
        <span className="font-mono text-foreground">
          {workflow.target} → {workflow.webhookPath}
        </span>
        <Badge variant={workflow.target === "n8n" ? "default" : "secondary"} className="text-[10px]">
          {workflow.target}
        </Badge>
      </div>
      <div className={`flex items-center gap-1.5 text-xs ${color}`}>
        <StatusIcon className={`h-3.5 w-3.5 ${dispatchStatus === "sending" ? "animate-spin" : ""}`} />
        {label}
      </div>
    </div>
  );
}
