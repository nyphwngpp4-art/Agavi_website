import { NextRequest, NextResponse } from "next/server";
import { getWorkflowById } from "@/lib/workflows";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const workflow = getWorkflowById(id);

  if (!workflow) {
    return NextResponse.json({ error: "Unknown workflow" }, { status: 404 });
  }

  // Parse and validate payload
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = workflow.schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 422 }
    );
  }

  // Resolve webhook URL from environment
  const envKey = `WEBHOOK_${id.replace(/-/g, "_").toUpperCase()}`;
  const webhookUrl = process.env[envKey];

  if (!webhookUrl) {
    return NextResponse.json(
      { error: `Webhook not configured. Set ${envKey} in environment.` },
      { status: 503 }
    );
  }

  // Resolve optional bearer token
  const tokenKey = `WEBHOOK_TOKEN_${id.replace(/-/g, "_").toUpperCase()}`;
  const token = process.env[tokenKey];

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(result.data),
    });

    const responseData = await response.text();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      workflowId: id,
      target: workflow.target,
      response: responseData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Dispatch failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 }
    );
  }
}
