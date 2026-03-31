"use client";

import type { WorkflowConfig } from "@/lib/workflows";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Send, X } from "lucide-react";

interface JsonPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: Record<string, unknown> | null;
  workflow: WorkflowConfig;
  onConfirm: () => void;
}

export function JsonPreviewModal({
  open,
  onOpenChange,
  payload,
  workflow,
  onConfirm,
}: JsonPreviewModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Confirm Dispatch
            <Badge variant={workflow.target === "n8n" ? "default" : "secondary"}>
              {workflow.target}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Sending to: <span className="text-foreground font-mono">{workflow.target} → {workflow.webhookPath}</span>
          </div>

          <pre className="bg-secondary rounded-lg p-4 text-xs overflow-x-auto font-mono text-foreground max-h-64 overflow-y-auto">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            <Send className="h-4 w-4 mr-1" />
            Dispatch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
