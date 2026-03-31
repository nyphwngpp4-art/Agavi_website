"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { WorkflowConfig } from "@/lib/workflows";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { VoiceInput } from "@/components/VoiceInput";
import { JsonPreviewModal } from "@/components/JsonPreviewModal";
import { RoutingIndicator } from "@/components/RoutingIndicator";
import { useDispatchStore } from "@/store/dispatch-store";
import { db } from "@/lib/db";
import { Zap, Save, RotateCcw } from "lucide-react";

interface WorkflowFormProps {
  workflow: WorkflowConfig;
  onTemplateLoad?: (values: Record<string, string>) => void;
  initialValues?: Record<string, string>;
}

export function WorkflowForm({ workflow, initialValues }: WorkflowFormProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<Record<string, unknown> | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const { setDispatchStatus, setLastDispatchTarget } = useDispatchStore();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(workflow.schema),
    defaultValues: initialValues || {},
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const onSubmit = (data: Record<string, unknown>) => {
    setPendingPayload(data);
    setShowPreview(true);
  };

  const confirmDispatch = async () => {
    if (!pendingPayload) return;

    setShowPreview(false);
    setDispatchStatus("sending");
    setLastDispatchTarget(`${workflow.target} → ${workflow.webhookPath}`);

    try {
      const res = await fetch(`/api/dispatch/${workflow.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingPayload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setDispatchStatus("success");
        showToast("Dispatched successfully", "success");

        await db.history.add({
          workflowId: workflow.id,
          workflowName: workflow.name,
          domain: workflow.domain,
          payload: pendingPayload,
          status: "success",
          response: result.response,
          timestamp: Date.now(),
        });

        reset();
      } else {
        setDispatchStatus("error");
        showToast(result.error || "Dispatch failed", "error");

        await db.history.add({
          workflowId: workflow.id,
          workflowName: workflow.name,
          domain: workflow.domain,
          payload: pendingPayload,
          status: "error",
          response: JSON.stringify(result),
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      setDispatchStatus("error");
      showToast(error instanceof Error ? error.message : "Network error", "error");
    }

    setPendingPayload(null);
  };

  const handleVoiceTranscript = (text: string) => {
    if (focusedField) {
      const current = getValues(focusedField) as string;
      setValue(focusedField, current ? `${current} ${text}` : text, {
        shouldValidate: true,
      });
    }
  };

  const handleSaveTemplate = async () => {
    const name = prompt("Template name:");
    if (!name) return;

    const values = getValues() as Record<string, string>;
    await db.templates.add({
      workflowId: workflow.id,
      name,
      values,
      createdAt: Date.now(),
    });
    showToast("Template saved", "success");
  };

  const applyQuickFire = (values: Record<string, string>) => {
    Object.entries(values).forEach(([key, val]) => {
      if (val !== "") {
        setValue(key, val, { shouldValidate: true });
      }
    });
  };

  return (
    <div className="space-y-4">
      <RoutingIndicator workflow={workflow} />

      {/* Quick-fire buttons */}
      {workflow.quickFire && workflow.quickFire.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {workflow.quickFire.map((qf) => (
            <Button
              key={qf.label}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => applyQuickFire(qf.values)}
            >
              <Zap className="h-3 w-3 mr-1" />
              {qf.label}
            </Button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {workflow.fields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {(field.type === "text" || field.type === "textarea") && (
                <VoiceInput onTranscript={handleVoiceTranscript} />
              )}
            </div>

            {field.type === "textarea" ? (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                {...register(field.name)}
                onFocus={() => setFocusedField(field.name)}
              />
            ) : field.type === "select" && field.options ? (
              <Select
                id={field.name}
                {...register(field.name)}
                onFocus={() => setFocusedField(field.name)}
              >
                <option value="">Select {field.label.toLowerCase()}...</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id={field.name}
                type={field.type === "email" ? "email" : field.type === "date" ? "date" : "text"}
                placeholder={field.placeholder}
                {...register(field.name)}
                onFocus={() => setFocusedField(field.name)}
              />
            )}

            {errors[field.name] && (
              <p className="text-xs text-destructive">
                {errors[field.name]?.message as string}
              </p>
            )}
          </div>
        ))}

        <div className="flex gap-2 pt-2">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Validating..." : "Review & Dispatch"}
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={handleSaveTemplate} title="Save as template">
            <Save className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="icon" onClick={() => reset()} title="Reset form">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <JsonPreviewModal
        open={showPreview}
        onOpenChange={setShowPreview}
        payload={pendingPayload}
        workflow={workflow}
        onConfirm={confirmDispatch}
      />

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
